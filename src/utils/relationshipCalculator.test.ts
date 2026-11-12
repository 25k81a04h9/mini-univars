import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRelationshipDuration,
  getNextYearlyAnniversary,
  getMilestones,
  getOnThisDayItems
} from './relationshipCalculator';

test('calculateRelationshipDuration calculates exact days, months, and years', () => {
  // Exactly 1 year, 2 months, 10 days
  const startDate = '2023-01-01';
  const currentDate = '2024-03-11';
  const duration = calculateRelationshipDuration(startDate, currentDate);

  assert.equal(duration.years, 1);
  assert.equal(duration.months, 2);
  assert.equal(duration.days, 10);
  assert.ok(duration.totalDays > 430);
  assert.equal(duration.isTodayAnniversary, false);
});

test('calculateRelationshipDuration detects yearly anniversary', () => {
  const startDate = '2022-05-20';
  const anniversaryDate = '2025-05-20';
  const duration = calculateRelationshipDuration(startDate, anniversaryDate);

  assert.equal(duration.years, 3);
  assert.equal(duration.months, 0);
  assert.equal(duration.days, 0);
  assert.equal(duration.isTodayAnniversary, true);
  assert.equal(duration.anniversaryYear, 3);
});

test('getNextYearlyAnniversary calculates days remaining and next anniversary year', () => {
  const startDate = '2024-05-20';
  const currentDate = '2025-05-15'; // 5 days before anniversary
  const next = getNextYearlyAnniversary(startDate, currentDate);

  assert.equal(next.nextDate, '2025-05-20');
  assert.equal(next.daysRemaining, 5);
  assert.equal(next.nextYearNumber, 1);
});

test('getMilestones correctly flags reached and upcoming milestones', () => {
  const startDate = '2024-01-01';
  const currentDate = '2024-04-20'; // ~110 days
  const { reached, upcoming, nextMilestone, progressPercent } = getMilestones(startDate, currentDate);

  assert.ok(reached.some((m) => m.id === 'm-100'));
  assert.ok(upcoming.some((m) => m.id === 'm-200'));
  assert.equal(nextMilestone?.id, 'm-200');
  assert.ok(progressPercent >= 0 && progressPercent <= 100);
});

test('getOnThisDayItems matches items from previous years on the same month and day', () => {
  const items = [
    { title: 'First Trip to Paris', date: '2022-07-15' },
    { title: 'Picnic in the Park', date: '2023-07-15' },
    { title: 'Different Day Event', date: '2023-08-20' },
  ];

  const matched = getOnThisDayItems(items, '2024-07-15');
  assert.equal(matched.length, 2);
  assert.equal(matched[0].yearsAgo, 2);
  assert.equal(matched[1].yearsAgo, 1);
});
