import { getTranslations } from "next-intl/server";
import BaseLayoutAuth from "../../components/BaseLayoutAuth";

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <BaseLayoutAuth>
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-durrah-blue">{t("register")}</h1>
        <p className="text-sm text-[#667085]">{t("layout.comingSoon")}</p>
      </section>
    </BaseLayoutAuth>
  );
}
