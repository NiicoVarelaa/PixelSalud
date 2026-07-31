const { z } = require("zod");
const { createValidationError } = require("../errors");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(error);
      } else {
        next(createValidationError("Error de validación", error));
      }
    }
  };
};

module.exports = validate;
module.exports.validate = validate;
