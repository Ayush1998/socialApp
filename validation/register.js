const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegistration(data) {
  errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name should be between 2 to 30 chars";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "name is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "email is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password length should be between 6 and 30";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "confirm password is required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "password must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
