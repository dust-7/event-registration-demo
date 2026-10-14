import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockTokenResponse = {
  access_token: 'mock-token',
  expiry_timestamp: '9999999999999',
};

const mockSearchResponse = {
  results: [{
    "SEARCHVAL": "BUILDING",
    "BLK_NO": "10",
    "ROAD_NAME": "road name",
    "BUILDING": "BUILDING",
    "ADDRESS": "10 BUILDING SINGAPORE 123456",
    "POSTAL": "123456"
  }],
};

describe('onemapService', () => {
  let fetchSpy: jest.Spied<typeof fetch>;
  let onemapService: typeof import('./onemapService.js').default;

  beforeEach(async () => {
    jest.resetModules();
    process.env.ONEMAP_EMAIL = 'test';
    process.env.ONEMAP_EMAIL_PASSWORD = 'test';
    onemapService = (await import('./onemapService.js')).default;
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAddress', () => {
    test('returns address for a valid postal code', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        } as Response);

      const result = await onemapService.getAddress('123456');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(result).toBe('10 BUILDING SINGAPORE 123456');
    });

    test('uses cached token without calling the auth API', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        } as Response);

      await onemapService.getAddress('123456');

      fetchSpy.mockReset();

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      } as Response);

      const result = await onemapService.getAddress('123456');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('auth'),
        expect.anything()
      );
      expect(result).toBe('10 BUILDING SINGAPORE 123456');
    });

    test('fetches a new token when cached token has expired', async () => {
      const expiredTokenResponse = {
        access_token: 'short-lived-token',
        expiry_timestamp: String(Math.floor(Date.now() / 1000) + 1),
      };

      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(expiredTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        } as Response);

      await onemapService.getAddress('123456');

      // Wait for the token to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      fetchSpy.mockReset();

      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        } as Response);

      const result = await onemapService.getAddress('123456');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(result).toBe('10 BUILDING SINGAPORE 123456');
    });

    test('retries search with a new token on 401', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse),
        } as Response);

      const result = await onemapService.getAddress('123456');

      expect(fetchSpy).toHaveBeenCalledTimes(4);
      expect(result).toBe('10 BUILDING SINGAPORE 123456');
    });

    test('throws when search fails after 401 retry', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response);

      await expect(onemapService.getAddress('123456')).rejects.toThrow();
    });

    test('throws when ONEMAP_EMAIL or ONEMAP_EMAIL_PASSWORD is not set', async () => {
      delete process.env.ONEMAP_EMAIL;
      delete process.env.ONEMAP_EMAIL_PASSWORD;

      await expect(onemapService.getAddress('123456')).rejects.toThrow();
    });

    test('returns null when API response data is malformed', async () => {
      fetchSpy
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);

      const result = await onemapService.getAddress('123456');

      expect(result).toBeNull();
    });
  });
});
