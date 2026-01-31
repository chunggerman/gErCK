// backend/src/app/utils/responseWrapper.js

export function success(data, message = "") {
  return {
    status: true,
    data,
    message
  };
}

export function validationError(validation, message = "") {
  return {
    status: false,
    validation,
    message
  };
}

export function duplicateRejected(message = "Duplicate rejected") {
  return {
    status: false,
    duplicateRejected: true,
    message
  };
}

export function invalidOrder(message = "Invalid operation order") {
  return {
    status: false,
    invalidOrder: true,
    message
  };
}

export function failure(message = "Operation failed") {
  return {
    status: false,
    message
  };
}
