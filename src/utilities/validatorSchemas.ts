import * as yup from 'yup';

export const routeNumericIdSchema = yup.object().shape({
  params: yup.object({
    id: yup.number().integer().moreThan(0)
  })
});
