export * from './create';
export * from './process';
export * from './get';
export * from './types';

import * as create from './create';
import * as process from './process';
import * as get from './get';

export const verificationService = {
  ...create,
  ...process,
  ...get,
};