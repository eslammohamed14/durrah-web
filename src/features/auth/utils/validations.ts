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

/** Request password reset — email only (Figma “Forgot Your Password?”). */
export const forgotPasswordEmailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("validation.emailInvalid")
    .required("validation.emailRequired"),
});

export type ForgotPasswordEmailValues = yup.InferType<
  typeof forgotPasswordEmailSchema
>;

/** Set new password after verification (Figma “Create New Password”). */
export const createNewPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, "validation.passwordMin")
    .required("validation.passwordRequired"),
  confirmPassword: yup
    .string()
    .required("validation.confirmPasswordRequired")
    .oneOf([yup.ref("password")], "validation.passwordMismatch"),
});

export type CreateNewPasswordFormValues = yup.InferType<
  typeof createNewPasswordSchema
>;
