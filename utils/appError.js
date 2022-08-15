class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const getErrorType = (error, table) => {
  let err = error;

  if (error.parent) {
    err = error.parent;
  }

  if (!err.code) {
    // FIXME: This is an absolute mess to be honest
    throw new AppError(err.message, err.statusCode);
  }

  switch (err.code) {
    case 'P2002':
      // PRISMA CASES TODO: TIDY THIS MESS UP PLEASE
      throw new AppError(`${table} already exists`, 409);
    case 'P2025':
      throw new AppError('Item not found', 404);
    default:
      throw new AppError('A server side error has occurred', 500);
  }
};

export default AppError;
