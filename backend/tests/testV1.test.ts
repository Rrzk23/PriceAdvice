import priceProcess from '../src/priceProcessing'; // Adjust the path as necessary
import { describe, expect, test } from '@jest/globals';
describe('normalizePrice', () => {
  test('handles single prices with dollar sign', () => {
    expect(priceProcess('$500,000')).toBe(500000);
  });

  test('handles single prices without dollar sign', () => {
    expect(priceProcess('500,000')).toBe(500000);
  });

  test('handles price ranges with "to"', () => {
    expect(priceProcess('$400,000 to $450,000')).toBe(425000);
  });

  test('handles price ranges with "-"', () => {
    expect(priceProcess('$400,000 - $450,000')).toBe(425000);
  });

  test('handles price ranges with "-" (no spaces)', () => {
    expect(priceProcess('$400,000-$450,000')).toBe(425000);
  });

  test('returns "Auction" for auction prices', () => {
    expect(priceProcess('Auction')).toBe('Auction');
  });

  test('returns "N/A" for undefined prices', () => {
    expect(priceProcess('')).toBe('Not Price or Auction available.');
  });

  // Add more test cases as needed
});
