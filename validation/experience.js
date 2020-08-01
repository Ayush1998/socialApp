const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateExperienceInput(data) {
  errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title is required";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "company is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "from date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
