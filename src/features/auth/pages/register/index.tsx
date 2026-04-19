import { getTranslations } from "next-intl/server";
import BaseLayoutAuth from "../../components/BaseLayoutAuth";
import RegisterFormSection from "../../components/registerFormSection";

/**
 * Sign up — Final UI Figma “Sign Up” (`1807:32058`).
 * @see https://www.figma.com/design/XKx3FF4Xw6ZpvooyvB71Kn/Durrah-Property-%F0%9F%8F%96%EF%B8%8F?node-id=1807-32058
 */
export default async function RegisterPage() {
  const tPanel = await getTranslations("auth.verifyEmailPage");

  return (
    <BaseLayoutAuth
      authShellVariant="register"
      promoTitle={tPanel("promoTitle")}
      promoSubtitle={tPanel("promoSubtitle")}
      sliderPaginationVariant="verifyEmail"
      footerVariant="register"
      contentMaxWidthClass="max-w-full"
      showFormColumnDecoration
      formAreaClassName="flex min-h-0 flex-1 items-start justify-center px-6 pb-8 pt-8 sm:px-10 lg:px-0 lg:pb-10 lg:pt-0"
      contentInnerClassName="lg:pt-[100px] lg:ps-[100px] lg:pe-[60px]"
    >
      <RegisterFormSection />
    </BaseLayoutAuth>
  );
}
