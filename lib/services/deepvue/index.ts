export * from './aadhaar';
export * from './ocr';
export * from './biometrics';
export * from './mock';

import * as aadhaar from './aadhaar';
import * as ocr from './ocr';
import * as biometrics from './biometrics';
import * as mock from './mock';

export const deepvueService = {
  ...aadhaar,
  ...ocr,
  ...biometrics,
  ...mock,
};