import { getTranslations } from "next-intl/server";
import BaseLayoutAuth from "../../components/BaseLayoutAuth";
import ResetPasswordFormSection from "../../components/resetPasswordFormSection";

/**
 * Forgot password — request verification code by email.
 *
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=807-5244
 */
export default async function ResetPasswordPage() {
  const tPromo = await getTranslations("auth.verifyEmailPage");

  return (
    <BaseLayoutAuth
      promoTitle={tPromo("promoTitle")}
      promoSubtitle={tPromo("promoSubtitle")}
      sliderPaginationVariant="verifyEmail"
      footerVariant="verifyEmail"
    >
      <ResetPasswordFormSection />
    </BaseLayoutAuth>
  );
}
