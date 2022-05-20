const yup = require('yup');
const _ = require('lodash');

const schema = yup.object({
  title: yup.string().required(),
  lessonsCount: yup.number()
    .integer()
    .min(1),
  firstDate: yup.string().required().test(
    (value, context) => {
      const isValid = !_.isNaN(Date.parse(value));
      return isValid || context.createError({ path: context.path, message: `${value}, is not valid date` });
    },
  ),
  lastDate: yup.string().test(
    (value, context) => {
      /* Проверка необходима для предотвращения возникновения ошибки
      в случае отсутствия данного свойства в валидируемом объекте
      */
      if (_.isUndefined(value)) return true;
      const isValid = !_.isNaN(Date.parse(value));
      return isValid || context.createError({ path: context.path, message: `${value}, is not valid date` });
    },
  ),
  teacherIds: yup.array().of(yup.number().integer().positive()),
  days: yup.array().of(yup.number().integer().min(0).max(6)),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return e.inner.map(({ path, errors }) => ({ [path]: errors }));
  }
};

module.exports = validate;
