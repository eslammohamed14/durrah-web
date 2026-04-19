import * as yup from "yup";
import { isValidSaudiNationalId } from "@/lib/saudiNationalId";

function normalizeSaudiLocalPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits.slice(3);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

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
  password: yup
    .string()
    .min(8, "validation.passwordMin")
    .required("validation.passwordRequired"),
  phone: yup
    .string()
    .trim()
    .required("validation.phoneRequired")
    .test("sa-mobile", "validation.phoneInvalid", (v) => {
      if (!v) return false;
      const local = normalizeSaudiLocalPhone(v);
      return /^5[0-9]{8}$/.test(local);
    }),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "validation.termsRequired")
    .required("validation.termsRequired"),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
