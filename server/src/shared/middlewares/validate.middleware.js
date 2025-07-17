import ApiError from "../utils/apiError.util.js";
import { ErrorFormatter } from "../utils/errorFormatter.js";

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = ErrorFormatter.formatJoiError(error);
      return next(new ApiError("Validation error.", 400, details));
    }

    next();
  };

export default validate;
