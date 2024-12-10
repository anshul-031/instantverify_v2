export * from './aadhaar';
export * from './ocr';
export * from './biometrics';

import * as aadhaar from './aadhaar';
import * as ocr from './ocr';
import * as biometrics from './biometrics';

export const deepvueService = {
  ...aadhaar,
  ...ocr,
  ...biometrics,
};