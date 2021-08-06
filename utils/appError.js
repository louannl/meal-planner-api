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
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors[0];
    if (errors.validatorKey === 'is_null') {
      throw new AppError(`${table} ${errors.path} cannot be empty`, 400);
    }
    throw new AppError(`${table} ${errors.message}`, 400);
  }

  const errorParent = error.parent;

  if (!errorParent.code) {
    //FIXME: This is an absolute mess to be honest
    throw new AppError(errorParent.message, errorParent.statusCode);
  }

  switch (errorParent.code) {
    case '08003':
      throw new AppError('Database connection does not exists', 500);
    case '08006':
      throw new AppError('Database connection failure', 503);
    case '2F002':
      throw new AppError('Modifying data is not permitted', 403);
    case '57P03':
      throw new AppError('Database connection failure', 503);
    case '42601':
      throw new AppError('Syntax error', 400);
    case '42501':
      throw new AppError('Insufficient privilege', 403);
    case '42602':
      throw new AppError('Invalid name', 400);
    case '42622':
      throw new AppError('Name too long', 400);
    case '42939':
      throw new AppError('Name is reserved', 400);
    case '42703':
      throw new AppError('Column is undefined', 400);
    case '42000':
      throw new AppError('Syntax error or access rule violation', 400);
    case '42P01':
      throw new AppError('Table is undefined', 400);
    case '42P02':
      throw new AppError('Parameter is undefined', 400);
    case '23503':
      throw new AppError(
        `Item is currently in use in ${errorParent.table}`,
        400
      );
    case '23505':
      throw new AppError(`${errorParent.detail}`, 409);
    default:
      throw new AppError('A server side error has occurred', 500);
  }
};

export default AppError;
