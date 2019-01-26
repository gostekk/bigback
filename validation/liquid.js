const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLiquidInput(data) {
  let errors = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.mileage = !isEmpty(data.mileage) ? data.mileage : "";
  data.liquidType = !isEmpty(data.liquidType) ? data.liquidType : "";
  data.date = !isEmpty(data.date) ? data.date : "";

  // if(Validator.isInt(data.amount)) {
  //   errors.amount = "Ilość musi być wartością liczbową"
  // }

  if (Validator.isEmpty(data.amount)) {
    errors.amount = "Amount is required";
  }

  // if(Validator.isInt(data.mileage)) {
  //   errors.mileage = "Przebieg musi być wartością liczbową"
  // }

  if (Validator.isEmpty(data.mileage)) {
    errors.mileage = "Mileage is required";
  }

  if (Validator.isEmpty(data.liquidType)) {
    errors.liquidType = "Liquid type is required";
  }

  if (Validator.isEmpty(data.date)) {
    errors.date = "Date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};