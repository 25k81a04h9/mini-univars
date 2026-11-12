export interface RelationshipDuration {
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  years: number;
  months: number;
  days: number;
  isTodayAnniversary: boolean;
  anniversaryYear?: number;
}

export interface Milestone {
  id: string;
  title: string;
  targetDays?: number;
  targetDate?: string;
  category: 'days' | 'months' | 'years' | 'special';
  isReached: boolean;
  reachDate?: string;
  daysRemaining?: number;
}

/**
 * Calculates exact calendar difference between startDate and targetDate (defaulting to today).
 * Properly accounts for varying month lengths and leap years.
 */
export function calculateRelationshipDuration(
  startDateStr: string,
  currentDateInput?: Date | string
): RelationshipDuration {
  const start = new Date(startDateStr + 'T00:00:00');
  const now = currentDateInput
    ? typeof currentDateInput === 'string'
      ? new Date(currentDateInput + 'T00:00:00')
      : new Date(currentDateInput)
    : new Date();

  // Reset time on now for pure date math
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  if (isNaN(startDate.getTime())) {
    return { totalDays: 0, totalWeeks: 0, totalHours: 0, years: 0, months: 0, days: 0, isTodayAnniversary: false };
  }

  const diffTime = current.getTime() - startDate.getTime();
  const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Calendar year/month/day calculation
  let years = current.getFullYear() - startDate.getFullYear();
  let months = current.getMonth() - startDate.getMonth();
  let days = current.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    // Get days in previous month
    const prevMonthLastDay = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Check if today is the yearly anniversary
  const isTodayAnniversary =
    current.getMonth() === startDate.getMonth() &&
    current.getDate() === startDate.getDate() &&
    years > 0;

  return {
    totalDays,
    totalWeeks,
    totalHours,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    isTodayAnniversary,
    anniversaryYear: isTodayAnniversary ? years : undefined,
  };
}

/**
 * Calculates the next upcoming yearly anniversary and days remaining.
 */
export function getNextYearlyAnniversary(
  startDateStr: string,
  currentDateInput?: Date | string
): { nextDate: string; daysRemaining: number; nextYearNumber: number } {
  const start = new Date(startDateStr + 'T00:00:00');
  const now = currentDateInput
    ? typeof currentDateInput === 'string'
      ? new Date(currentDateInput + 'T00:00:00')
      : new Date(currentDateInput)
    : new Date();

  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let targetYear = current.getFullYear();
  let nextDate = new Date(targetYear, start.getMonth(), start.getDate());

  // If this year's anniversary has already passed, next anniversary is next year
  if (nextDate.getTime() < current.getTime()) {
    targetYear += 1;
    nextDate = new Date(targetYear, start.getMonth(), start.getDate());
  }

  const diffMs = nextDate.getTime() - current.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const nextYearNumber = targetYear - start.getFullYear();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedNextDate = `${targetYear}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;

  return {
    nextDate: formattedNextDate,
    daysRemaining,
    nextYearNumber,
  };
}

/**
 * Calculates milestone achievements (100 days, 365 days, 500 days, 1000 days, etc.)
 */
export function getMilestones(
  startDateStr: string,
  currentDateInput?: Date | string
): { reached: Milestone[]; upcoming: Milestone[]; nextMilestone: Milestone | null; progressPercent: number } {
  const duration = calculateRelationshipDuration(startDateStr, currentDateInput);
  const start = new Date(startDateStr + 'T00:00:00');

  const targets = [
    { days: 30, title: '1 Month Together ❤️' },
    { days: 50, title: '50 Days of Love' },
    { days: 100, title: '100 Days of Us 🧸' },
    { days: 200, title: '200 Days Together' },
    { days: 365, title: '1 Year Anniversary 🎂' },
    { days: 500, title: '500 Days of Smiles' },
    { days: 730, title: '2 Years Anniversary 💍' },
    { days: 1000, title: '1,000 Days Milestone 🌟' },
    { days: 1095, title: '3 Years Anniversary 🏰' },
    { days: 1461, title: '4 Years Anniversary 🌺' },
    { days: 1500, title: '1,500 Days Together 🍯' },
    { days: 1826, title: '5 Years Golden Anniversary 👑' },
    { days: 2000, title: '2,000 Days of Forever 💫' },
    { days: 2500, title: '2,500 Days of Love' },
    { days: 3000, title: '3,000 Days Milestone' },
    { days: 3652, title: '10 Years Decade of Us ✨' },
  ];

  const pad = (n: number) => n.toString().padStart(2, '0');

  const allMilestones: Milestone[] = targets.map((t) => {
    const reachDateObj = new Date(start.getTime() + t.days * 24 * 60 * 60 * 1000);
    const reachDateStr = `${reachDateObj.getFullYear()}-${pad(reachDateObj.getMonth() + 1)}-${pad(reachDateObj.getDate())}`;
    const isReached = duration.totalDays >= t.days;
    const daysRemaining = isReached ? 0 : t.days - duration.totalDays;

    return {
      id: `m-${t.days}`,
      title: t.title,
      targetDays: t.days,
      targetDate: reachDateStr,
      category: t.days % 365 === 0 ? 'years' : 'days',
      isReached,
      reachDate: reachDateStr,
      daysRemaining,
    };
  });

  const reached = allMilestones.filter((m) => m.isReached);
  const upcoming = allMilestones.filter((m) => !m.isReached);
  const nextMilestone = upcoming.length > 0 ? upcoming[0] : null;

  // Calculate progress toward next milestone
  let progressPercent = 100;
  if (nextMilestone && nextMilestone.targetDays) {
    const prevTargetDays = reached.length > 0 ? reached[reached.length - 1].targetDays || 0 : 0;
    const range = nextMilestone.targetDays - prevTargetDays;
    const currentProgress = duration.totalDays - prevTargetDays;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  }

  return { reached, upcoming, nextMilestone, progressPercent };
}

/**
 * Filter items that occurred on the same month and day in previous years ("On This Day")
 */
export function getOnThisDayItems<T extends { date?: string; timestamp?: number }>(
  items: T[],
  currentDateInput?: Date | string
): { item: T; yearsAgo: number }[] {
  const now = currentDateInput
    ? typeof currentDateInput === 'string'
      ? new Date(currentDateInput + 'T00:00:00')
      : new Date(currentDateInput)
    : new Date();

  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  const results: { item: T; yearsAgo: number }[] = [];

  for (const item of items) {
    let itemDate: Date | null = null;
    if (item.date) {
      itemDate = new Date(item.date + 'T00:00:00');
    } else if (item.timestamp) {
      itemDate = new Date(item.timestamp);
    }

    if (itemDate && !isNaN(itemDate.getTime())) {
      if (
        itemDate.getMonth() === currentMonth &&
        itemDate.getDate() === currentDay &&
        itemDate.getFullYear() < currentYear
      ) {
        results.push({
          item,
          yearsAgo: currentYear - itemDate.getFullYear(),
        });
      }
    }
  }

  return results;
}

/**
 * Returns ordinal suffix for a number (e.g. 1 -> "st", 2 -> "nd", 3 -> "rd", 4 -> "th", 11 -> "th")
 */
export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
