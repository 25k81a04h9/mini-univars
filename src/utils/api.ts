export interface SafeJsonResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

/**
 * Safely parses a Fetch Response without throwing SyntaxError on HTML or plain-text
 * error pages (such as Vercel's 404 "The page could not be found" response).
 */
export async function safeParseResponse<T = any>(res: Response): Promise<SafeJsonResult<T>> {
  const contentType = res.headers.get('content-type') || '';
  const rawText = await res.text();

  if (!rawText) {
    return {
      ok: res.ok,
      status: res.status,
      data: null,
      error: res.ok ? undefined : `Server returned empty response (HTTP ${res.status})`,
    };
  }

  let parsed: any = null;
  const looksLikeJson =
    contentType.includes('application/json') ||
    rawText.trim().startsWith('{') ||
    rawText.trim().startsWith('[');

  if (looksLikeJson) {
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = null;
    }
  }

  if (parsed !== null && typeof parsed === 'object') {
    return {
      ok: res.ok,
      status: res.status,
      data: parsed as T,
      error: !res.ok
        ? parsed.error || parsed.message || `Request failed (HTTP ${res.status})`
        : undefined,
    };
  }

  // Non-JSON response (plain text or HTML from a reverse proxy / static host)
  const trimmed = rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const snippet = trimmed.length > 140 ? `${trimmed.slice(0, 140)}...` : trimmed;

  if (res.status === 404) {
    return {
      ok: false,
      status: 404,
      data: null,
      error: `API endpoint not found (HTTP 404: "${snippet}"). The backend /api route is not reachable on this host.`,
    };
  }

  return {
    ok: false,
    status: res.status,
    data: null,
    error: `Unexpected non-JSON server response (HTTP ${res.status}): "${snippet}"`,
  };
}
