const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateNPCInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (!Validator.isLength(data.name, {max: 150})) {
    errors.name = "Imię postaci może zawierać maksymalnie 150 znaków";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Podanie imienia postaci jest wymagane";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};