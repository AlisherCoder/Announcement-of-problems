import joi from "joi";

const commentPostValid = joi.object({
   text: joi.string().required(),
   bannerId: joi.number().positive().required(),
});

const commentPatchValid = joi.object({
   text: joi.string().required(),
});

const likeValid = joi.object({
   bannerId: joi.number().required(),
});

const donateValid = joi.object({
   bannerId: joi.number().positive().required(),
   summa: joi.number().positive().required(),
});

export { commentPatchValid, commentPostValid, likeValid, donateValid };
