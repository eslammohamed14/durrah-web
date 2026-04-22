import { getTranslations } from "next-intl/server";
import { MetricItem } from "./MetricItem";
import {
  BuildingColoredIcon,
  PeopleIcon,
  StarColoredIcon,
  WorkBagIcon,
} from "@/assets/icons";

const COMPANY_METRICS = [
  { id: "customers",       value: "+10M",  labelKey: "home.customers",       Icon: <PeopleIcon /> },
  { id: "yearsExperience", value: "+90",   labelKey: "home.yearsExperience", Icon: <WorkBagIcon /> },
  { id: "propertiesSold",  value: "1,200", labelKey: "home.propertiesSold",  Icon: <BuildingColoredIcon /> },
  { id: "averageRating",   value: "5.0",   labelKey: "home.averageRating",   Icon: <StarColoredIcon /> },
] as const;

export async function CompanyMetricsSection() {
  const t = await getTranslations();

  return (
    <section
      aria-label="Company metrics"
      className="bg-background px-4 py-10 sm:px-6 md:py-16 lg:px-16 xl:px-[100px] xl:py-20"
    >
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 md:items-center xl:max-w-[1200px]">
        {COMPANY_METRICS.map(({ id, value, labelKey, Icon }) => (
          <MetricItem key={id} value={value} label={t(labelKey)} Icon={Icon} />
        ))}
      </div>
    </section>
  );
}
