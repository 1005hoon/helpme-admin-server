import { DateTime } from 'luxon';
export const __PROD__ = process.env.NODE_ENV === 'production';
export const __MARKETING_DB__ = __PROD__ ? 'DB_MARKETING' : 'DB_MARKETING_DEV';
export const __NOW__ = DateTime.now().setZone('Asia/Seoul');
