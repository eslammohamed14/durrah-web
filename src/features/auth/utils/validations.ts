import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("validation.emailInvalid")
    .required("validation.emailRequired"),
  password: yup
    .string()
    .min(8, "validation.passwordMin")
    .required("validation.passwordRequired"),
  rememberMe: yup.boolean().default(false),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
