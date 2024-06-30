import createHttpError from 'http-errors';

const validateBody = (schema) => {
  const funcValidate = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const responseError = createHttpError(400, error.message, {
        errors: error.details,
      });
      next(responseError);
    }
  };
  return funcValidate;
};
export default validateBody;
