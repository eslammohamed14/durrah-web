import { getLocale, getTranslations } from "next-intl/server";
import CollapseSection from "@/components/ui/CollapseSection";
import type { Property } from "@/lib/types";

interface PropertyPoliciesSectionProps {
  property: Property;
}

export default async function PropertyPoliciesSection({
  property,
}: PropertyPoliciesSectionProps) {
  const t = await getTranslations();
  const locale = (await getLocale()) as "en" | "ar";

  const houseRulesText = property.policies.houseRules[locale];
  const cancellationText =
    property.policies.cancellation?.description[locale];

  const toBulletItems = (text: string) =>
    text
      .split(/\. (?=[A-Z\u0600-\u06FF])/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => (item.endsWith(".") ? item : `${item}.`));

  return (
    <section>
      <CollapseSection
        title={t("propertyDetails.reservationPolicy")}
        defaultOpen
        content={
          <ul className="space-y-2 text-[18px] text-grey-600 leading-[1.6]">
            {toBulletItems(houseRulesText).map((rule, idx) => (
              <li key={`${rule}-${idx}`} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-3 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-grey-500"
                />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        }
      />
      <CollapseSection
        title={t("propertyDetails.cancellationPolicy")}
        content={
          <p className="text-[16px] leading-[1.6] text-grey-600">
            {cancellationText ?? "-"}
          </p>
        }
      />
    </section>
  );
}
