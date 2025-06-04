const Joi = require("joi");

//register validate
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(1024).email().required(),
    password: Joi.string().min(8).max(255).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(data);
};
//login validate
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(1024).email().required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(data);
};
//product validate
const productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().allow(""),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    imageUrl: Joi.string().uri().optional(),
  });
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
