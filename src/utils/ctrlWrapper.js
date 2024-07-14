export const ctrlWrapper = (controller) => {
  const funcNextError = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return funcNextError;
};
