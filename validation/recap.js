const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatedRecapInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.sessionDate = !isEmpty(data.sessionDate) ? data.sessionDate : "";

  if (!Validator.isLength(data.title, {max: 150})) {
    errors.title = "Tytuł może zawierać maksymalnie 150 znaków";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Tytuł jest wymagany";
  }

  if (!Validator.isLength(data.description, {min: 50})) {
    errors.description = "Podsumowanie musi zawierać co najmniej 50 znaków";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Podsumowanie jest wymagane!";
  }

  if (Validator.isEmpty(data.sessionDate)) {
    errors.sessionDate = "Data sesji jest wymagana";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};