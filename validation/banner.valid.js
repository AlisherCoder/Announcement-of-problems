import joi from "joi";

const bannerValid = joi.object({
   image: joi.string().required(),
   title: joi.string().required(),
   description: joi.string().required(),
   target: joi.number().min(1).max(10000).required(),
   categoryId: joi.number().positive().required(),
   regions: joi.array().items(joi.number().positive()).required(),
});

const bannerPatchValid = joi.object({
   image: joi.string(),
   title: joi.string(),
   description: joi.string(),
   target: joi.number().min(1).max(10000),
   categoryId: joi.number().positive(),
   status: joi.string().valid("PENDING", "ACTIVE", "INACTIVE"),
   regions: joi.array().items(joi.number().positive()),
});

const bannerSearch = joi.object({
   page: joi.number().positive(),
   take: joi.number().positive(),
   categoryId: joi.number().positive(),
   regionId: joi.number().positive(),
});

export { bannerValid, bannerPatchValid, bannerSearch };
