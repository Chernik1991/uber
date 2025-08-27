import { ValidationError } from '../../videos/types/validationError';

export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessage: ValidationError[] } => {
  return { errorMessage: errors };
};
