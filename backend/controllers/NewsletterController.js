const newsletterService = require("../services/NewsletterService");

const subscribe = async (req, res, next) => {
  try {
    const result = await newsletterService.suscribir(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const { token } = req.query;
    const result = await newsletterService.desuscribirPorToken(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
};
