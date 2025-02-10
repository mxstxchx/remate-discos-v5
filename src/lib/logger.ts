'use client';

const APP_LOG = (feature: string) => `[APP:${feature}]`;
const DEV_LOG = (feature: string) => `[DEV:${feature}]`;
const TEMP_LOG = (feature: string) => `[TEMP:${feature}]`;

export const logger = {
  app: (feature: string, message: string, data?: any) => {
    console.log(`${APP_LOG(feature)} ${message}`, data || '');
  },
  dev: (feature: string, message: string, data?: any) => {
    console.log(`${DEV_LOG(feature)} ${message}`, data || '');
  },
  temp: (feature: string, message: string, data?: any) => {
    console.log(`${TEMP_LOG(feature)} ${message}`, data || '');
  }
};