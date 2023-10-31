import parsePhoneNumber from 'libphonenumber-js';
import { passwordStrength } from 'check-password-strength';

import {
  BreachOfPasswordPolicyError,
  PhoneNumberInvalidError,
  WeakPasswordError,
} from './errors/user';

function checkUpperCase(inputString: string) {
  return /[A-Z]/.test(inputString);
}

function checkLowerCase(inputString: string) {
  return /[a-z]/.test(inputString);
}

function checkNumber(inputString: string) {
  return /\d/.test(inputString);
}

function checkSpecialCharacter(inputString: string) {
  const format = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
  return format.test(inputString);
}

export function validatePassword(inputString: string) {
  if (
    checkLowerCase(inputString) &&
    checkUpperCase(inputString) &&
    checkNumber(inputString) &&
    checkSpecialCharacter(inputString)
  ) {
    return true;
  }

  return false;
}

export const validatePasswordStrength = (password: string) => {
  if (passwordStrength(password).id === 0) {
    throw new WeakPasswordError();
  }

  if (
    (password.length < 8 ||
      password.length > 64 ||
      validatePassword(password) === false) === true
  ) {
    throw new BreachOfPasswordPolicyError();
  }
};

export const validatePhoneNumber = (phone: string) => {
  // NOTE - IN is default option, libphonenumber can handle other country code by its own.
  const phoneNumber = parsePhoneNumber(phone, 'IN');

  if (!phoneNumber) {
    throw new PhoneNumberInvalidError();
  }

  const checkValidPhone = phoneNumber.isValid();

  if (!checkValidPhone) {
    throw new PhoneNumberInvalidError();
  }

  return phoneNumber.number;
};
