const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data) {
  errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "post must be in between 10 to 300 character";
  }
  if (validator.isEmpty(data.text)) {
    errors.text = "Post text is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
