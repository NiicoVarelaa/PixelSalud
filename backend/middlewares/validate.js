const { z } = require("zod");
const { ValidationError } = require("../errors");

/**
 * Middleware genérico para validar request con esquemas de Zod
 * @param {Object} schema - Objeto con schemas de Zod para body, params, query
 * @returns {Function} Middleware de Express
 *
 * @example
 * router.post('/productos',
 *   validate({ body: createProductoSchema }),
 *   productosController.create
 * );
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validar body
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      // Validar params
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      // Validar query
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      // Si es error de Zod, lo pasamos al error handler
      if (error instanceof z.ZodError) {
        next(error);
      } else {
        next(new ValidationError("Error de validación", error));
      }
    }
  };
};

module.exports = validate;
