const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatedRecapInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.appearance = !isEmpty(data.appearance) ? data.appearance : "";

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