import { z } from 'zod';

import { logger } from '../utils/logger.js';

const API_BASE = process.env.ONEMAP_BASE_URL || 'https://www.onemap.gov.sg/api';

interface CachedToken {
  accessToken: string;
  expiryTimestamp: number;
}

let tokenCache: CachedToken | null = null;

async function fetchToken() {
  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_EMAIL_PASSWORD;

  if (!email || !password) {
    logger.error('ONEMAP_EMAIL and ONEMAP_EMAIL_PASSWORD must be set');
    throw new Error();
  }

  const response = await fetch(`${API_BASE}/auth/post/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    logger.error(`Failed to get OneMap token: ${response.status} ${response.statusText}`);
    throw new Error();
  }

  const data = (await response.json()) as { access_token?: string; expiry_timestamp?: string };
  const accessToken = data.access_token;
  const expiryTimestamp = data.expiry_timestamp;

  if (!accessToken) {
    logger.error('OneMap token response missing access_token');
    throw new Error();
  }

  if (!expiryTimestamp) {
    logger.error('OneMap token response missing expiry_timestamp');
    throw new Error();
  }

  tokenCache = { accessToken, expiryTimestamp: Number(expiryTimestamp) };
  logger.info('OneMap access token obtained');
  return accessToken;
}

async function getAccessToken() {
  if (tokenCache && tokenCache.expiryTimestamp > Date.now()) {
    return tokenCache.accessToken;
  }
  tokenCache = null;
  return fetchToken();
}

const onemapService = {
  async getAddress(postalCode: string) {
    const url = `${API_BASE}/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y`;
    let accessToken = await getAccessToken();

    let response = await fetch(url, {
      headers: { Authorization: accessToken },
    });

    if (response.status === 401) {
      logger.warn('OneMap auth error, fetching new token...');
      tokenCache = null;
      accessToken = await fetchToken();

      response = await fetch(url, {
        headers: { Authorization: accessToken },
      });
    }

    if (!response.ok) {
      logger.error(`OneMap address lookup failed: ${response.status}`);
      throw new Error();
    }

    const data = await response.json();
    return extractAddress(data);
  },
};

function extractAddress(data: unknown) {
  const ResultSchema = z.object({
    ADDRESS: z.string(),
  });

  const ResponseSchema = z.object({
    results: z.array(ResultSchema),
  });

  const parsed = ResponseSchema.safeParse(data);
  if (!parsed.success) {
    return null;
  }

  return parsed.data.results[0]?.ADDRESS ?? null;
}

export default onemapService;
