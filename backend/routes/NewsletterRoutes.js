const express = require("express");
const router = express.Router();

const newsletterController = require("../controllers/NewsletterController");
const { mutationLimiter } = require("../config/rateLimiters");
const { validate } = require("../middlewares/validate");
const {
  createNewsletterSubscriptionSchema,
  newsletterUnsubscribeQuerySchema,
} = require("../schemas/NewsletterSchemas");

router.post(
  "/suscripciones",
  mutationLimiter,
  validate(createNewsletterSubscriptionSchema),
  newsletterController.subscribe,
);

router.get(
  "/baja",
  validate(newsletterUnsubscribeQuerySchema),
  newsletterController.unsubscribe,
);

module.exports = router;
