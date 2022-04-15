const _ = require('lodash');
const yup = require('yup');

const schema = yup.object({
  date: yup.string().test(
    (value, context) => {
      /* Проверка необходима для предотвращения возникновения ошибки
      в случае отсутствия данного свойства в валидируемом объекте
      */
      if (_.isUndefined(value)) return true;
      const dates = value.split(',');
      if (dates.length > 2) {
        return context.createError({ path: context.path, message: 'Invalid time period is set' });
      }
      const isValid = dates.every((date) => !_.isNaN(Date.parse(date)));
      return isValid || context.createError({ path: context.path, message: `${value}, is not valid date` });
    },
  ),
  status: yup.number()
    .min(0)
    .max(1),
  teacherIds: yup.string().test(
    (value, context) => {
      if (_.isUndefined(value)) return true;
      const isValid = value.split(',').every((id) => _.isFinite(Number(id)));
      return isValid || context.createError({ path: context.path, message: `${value}, it's not a number` });
    },
  ),
  studentsCount: yup.string().test(
    (value, context) => {
      if (_.isUndefined(value)) return true;
      const values = value.split(',');
      if (values.length > 2) {
        return context.createError({ path: context.path, message: 'Invalid range is set' });
      }
      const isValid = values.every((val) => _.isFinite(Number(val)));
      return isValid || context.createError({ path: context.path, message: `${value}, it's not a number` });
    },
  ),
  page: yup.number().positive(),
  lessonsPerPage: yup.number().positive(),
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
