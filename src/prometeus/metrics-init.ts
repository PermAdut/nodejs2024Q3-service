import { collectDefaultMetrics } from 'prom-client';

export const initializeMetrics = () => {
  collectDefaultMetrics();
};
