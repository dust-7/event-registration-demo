import { describe, expect, test } from '@jest/globals';
import { stripTime, dateToIsoString } from './date.js';

describe('date', () => {
  describe('stripTime', () => {
    test('date has time set to midnight', () => {
      const input = new Date(2026, 9, 15, 14, 30, 45, 500);
      const result = stripTime(input);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    test('returns a new Date object', () => {
      const input = new Date(2026, 9, 15, 14, 30, 45, 500);
      const result = stripTime(input);
      expect(result).not.toBe(input);
      expect(input.getHours()).toBe(14);
    });
  });

  describe('dateToIsoString', () => {
    test('date is returned without time', () => {
      const input = new Date(2026, 9, 15, 23, 59, 59, 999);
      expect(dateToIsoString(input)).toBe('2026-10-15');
    });
  });
});
