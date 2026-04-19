import { getTranslations } from "next-intl/server";
import BaseLayoutAuth from "../../components/BaseLayoutAuth";
import PasswordResetSuccessSection from "../../components/passwordResetSuccessSection";

/**
 * Password was reset successfully — end of reset flow.
 *
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=807-5499
 */
export default async function PasswordResetSuccessPage() {
  const tPromo = await getTranslations("auth.verifyEmailPage");

  return (
    <BaseLayoutAuth
      promoTitle={tPromo("promoTitle")}
      promoSubtitle={tPromo("promoSubtitle")}
      sliderPaginationVariant="verifyEmail"
      footerVariant="verifyEmail"
    >
      <PasswordResetSuccessSection />
    </BaseLayoutAuth>
  );
}
