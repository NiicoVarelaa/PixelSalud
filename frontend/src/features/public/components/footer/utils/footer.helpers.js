export const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const getNewsletterStorageKey = (email) =>
  `newsletter_subscribed_${email}`;
