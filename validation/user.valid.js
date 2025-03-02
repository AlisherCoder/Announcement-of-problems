import joi from "joi";

const registerValid = joi.object({
   fullName: joi
      .string()
      .min(2)
      .max(30)
      .pattern(/^[a-zA-Z' ]+$/)
      .required(),
   phone: joi
      .string()
      .pattern(/^(?:\+998|998)?\d{9}$/)
      .required(),
   email: joi.string().email().required(),
   password: joi.string().min(4).max(10).required(),
   regionId: joi.number().integer().required(),
});

const userPatchValid = joi.object({
   fullName: joi
      .string()
      .min(2)
      .max(30)
      .pattern(/^[a-zA-Z' ]+$/),
   phone: joi.string().pattern(/^(?:\+998|998)?\d{9}$/),
   regionId: joi.number().integer(),
});

const passwordValid = joi.object({
   newPassword: joi.string().min(4).max(10).required(),
});

export { registerValid, passwordValid, userPatchValid };
