import Joi from 'joi';

const instance = Joi.defaults((s) => s.options({ abortEarly: false })); // for multiple error

export default instance;
