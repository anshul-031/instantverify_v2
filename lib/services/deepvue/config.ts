export const DEEPVUE_CONFIG = {
  API_BASE: process.env.DEEPVUE_API_BASE || 'https://api.deepvue.tech/v1',
  API_KEY: process.env.DEEPVUE_API_KEY,
  TIMEOUT: 30000, // 30 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};