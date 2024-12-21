export * from './aadhaar';
export * from './api';
export * from './biometrics';
export * from './mock';

import * as aadhaar from './aadhaar';
import * as api from './api';
import * as biometrics from './biometrics';
import * as mock from './mock';

export const deepvueService = {
  ...aadhaar,
  ...api,
  ...biometrics,
  ...mock,
};