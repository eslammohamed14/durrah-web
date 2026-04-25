import * as yup from "yup";
import { isValidSaudiNationalId } from "@/lib/saudiNationalId";

const saudiPhoneRegex = /^5\d{8}$/;

export const loginSchema = yup.object({
  phoneNumber: yup
    .string()
    .trim()
    .required("validation.phoneRequired")
    .matches(saudiPhoneRegex, "validation.phoneInvalid"),
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

/** Sign up — Final UI Figma `1807:32058` “Sign Up”. */
export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(2, "validation.fullNameMin")
    .max(120, "validation.fullNameMax")
    .required("validation.fullNameRequired"),
  email: yup
    .string()
    .trim()
    .email("validation.emailInvalid")
    .required("validation.emailRequired"),
  nationalId: yup
    .string()
    .trim()
    .transform((v) => (v ? v.replace(/\D/g, "") : v))
    .required("validation.nationalIdRequired")
    .matches(/^[12]\d{9}$/, "validation.nationalIdFormat")
    .test(
      "saudi-national-id",
      "validation.nationalIdInvalid",
      (v) => !!v && isValidSaudiNationalId(v),
    ),
  phoneNumber: yup
    .string()
    .trim()
    .required("validation.phoneRequired")
    .matches(saudiPhoneRegex, "validation.phoneInvalid"),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "validation.termsRequired")
    .required("validation.termsRequired"),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
