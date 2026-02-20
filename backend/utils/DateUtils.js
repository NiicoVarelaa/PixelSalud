const toSQLDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

const toSQLDateTime = (date = new Date()) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const daysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

module.exports = {
  toSQLDate,
  toSQLDateTime,
  daysDifference,
  isDateInRange,
};
