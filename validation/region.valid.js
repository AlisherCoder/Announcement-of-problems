import joi from "joi";

const regionPostValid = joi.object({
   name: joi
      .string()
      .pattern(/^[a-zA-Z']+$/)
      .required(),
});

const regionPatchValid = joi.object({
   name: joi.string().pattern(/^[a-zA-Z]+$/),
});

export { regionPatchValid, regionPostValid };
