import { VideoInputDto } from '../dto/video.input-dto';
import { ValidationError } from '../types/validationError';
import { AvailableResolutions } from '../types/video';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const vehicleInputDtoValidation = (
  data: VideoInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.title ||
    data.title === null ||
    typeof data.title !== 'string' ||
    data.title.trim().length < 2 ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }
  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim().length < 2 ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }

  if (
    data.minAgeRestriction &&
    typeof data.minAgeRestriction === 'number' &&
    (data.minAgeRestriction < 1 || data.minAgeRestriction > 18)
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'Invalid minAgeRestriction',
    });
  }
  if (
    data.canBeDownloaded &&
    typeof data.canBeDownloaded !== 'boolean'
    // data.canBeDownloaded === null
  ) {
    errors.push({
      field: 'canBeDownloaded',
      message: 'Invalid canBeDownloaded',
    });
  }

  // if (
  //   !data.email ||
  //   typeof data.email !== 'string' ||
  //   data.email.trim().length < 5 ||
  //   data.email.trim().length > 100 ||
  //   !EMAIL_REGEX.test(data.email)
  // ) {
  //   errors.push({ field: 'email', message: 'Invalid email' });
  // }

  // if (
  //   !data.vehicleMake ||
  //   typeof data.vehicleMake !== 'string' ||
  //   data.vehicleMake.trim().length < 3 ||
  //   data.vehicleMake.trim().length > 100
  // ) {
  //   errors.push({ field: 'vehicleMake', message: 'Invalid vehicleMake' });
  // }

  // if (
  //   !data.vehicleModel ||
  //   typeof data.vehicleModel !== 'string' ||
  //   data.vehicleModel.trim().length < 2 ||
  //   data.vehicleModel.trim().length > 100
  // ) {
  //   errors.push({ field: 'vehicleModel', message: 'Invalid vehicleModel' });
  // }

  // if (!data.vehicleYear || typeof data.vehicleYear !== 'number') {
  //   errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  // }

  // if (
  //   !data.vehicleLicensePlate ||
  //   typeof data.vehicleLicensePlate !== 'string' ||
  //   data.vehicleLicensePlate.trim().length < 6 ||
  //   data.vehicleLicensePlate.trim().length > 10
  // ) {
  //   errors.push({
  //     field: 'vehicleLicensePlate',
  //     message: 'Invalid vehicleLicensePlate',
  //   });
  // }

  // if (
  //   data.vehicleDescription !== null &&
  //   (typeof data.vehicleDescription !== 'string' ||
  //     data.vehicleDescription.trim().length < 10 ||
  //     data.vehicleDescription.trim().length > 200)
  // ) {
  //   errors.push({
  //     field: 'vehicleDescription',
  //     message: 'Invalid vehicleDescription',
  //   });
  // }

  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'availableResolutions must be array',
    });
  } else if (data.availableResolutions.length) {
    const existingResolutions = Object.values(AvailableResolutions);
    if (
      data.availableResolutions.length > existingResolutions.length ||
      data.availableResolutions.length < 1
    ) {
      errors.push({
        field: 'availableResolutions',
        message: 'Invalid availableResolutions',
      });
    }
    for (const resolutions of data.availableResolutions) {
      if (!existingResolutions.includes(resolutions)) {
        errors.push({
          field: 'resolutions',
          message: 'Invalid availableResolutions:' + resolutions,
        });
        break;
      }
    }
  }

  return errors;
};
