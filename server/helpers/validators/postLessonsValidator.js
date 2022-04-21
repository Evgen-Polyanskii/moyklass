const yup = require('yup');

const schema = yup.object({
  title: yup.string().required(),
  lessonsCount: yup.number()
    .integer()
    .min(1),
  firstDate: yup.date(),
  lastDate: yup.date(),
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
