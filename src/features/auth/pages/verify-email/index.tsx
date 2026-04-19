import { getTranslations } from "next-intl/server";
import BaseLayoutAuth from "../../components/BaseLayoutAuth";
import VerifyEmailFormSection from "../../components/verifyEmailFormSection";

/**
 * Email verification screen (split panel + OTP).
 *
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=807-5307
 */
type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const t = await getTranslations("auth.verifyEmailPage");
  const resolved = await searchParams;
  const raw = resolved.email;
  const email =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  return (
    <BaseLayoutAuth
      promoTitle={t("promoTitle")}
      promoSubtitle={t("promoSubtitle")}
      sliderPaginationVariant="verifyEmail"
      footerVariant="verifyEmail"
    >
      <VerifyEmailFormSection email={email} />
    </BaseLayoutAuth>
  );
}
