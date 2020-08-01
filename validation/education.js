const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEducationInput(data) {
  errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "school is required";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree is required";
  }

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy  is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "from date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
