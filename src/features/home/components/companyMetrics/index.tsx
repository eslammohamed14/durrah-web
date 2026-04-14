"use client";

import type { ComponentType, SVGProps } from "react";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { MetricItem } from "./MetricItem";
import {
  AverageRatingMetricIcon,
  CustomersMetricIcon,
  PropertiesSoldMetricIcon,
  YearsExperienceMetricIcon,
} from "./metricIcons";
import {
  BuildingColoredIcon,
  PeopleIcon,
  StarColoredIcon,
  WorkBagIcon,
} from "@/assets/icons";

export interface CompanyMetricDefinition {
  id: string;
  value: string;
  labelKey: string;
  Icon: React.ReactNode;
}

export const COMPANY_METRICS: CompanyMetricDefinition[] = [
  {
    id: "customers",
    value: "+10M",
    labelKey: "home.customers",
    Icon: <PeopleIcon />,
  },
  {
    id: "yearsExperience",
    value: "+90",
    labelKey: "home.yearsExperience",
    Icon: <WorkBagIcon />,
  },
  {
    id: "propertiesSold",
    value: "1,200",
    labelKey: "home.propertiesSold",
    Icon: <BuildingColoredIcon />,
  },
  {
    id: "averageRating",
    value: "5.0",
    labelKey: "home.averageRating",
    Icon: <StarColoredIcon />,
  },
];

export function CompanyMetricsSection() {
  const { t } = useLocale();

  return (
    <section
      aria-label="Company metrics"
      className="bg-[#FAFAFA] px-[100px] py-20"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        {COMPANY_METRICS.map(({ id, value, labelKey, Icon }) => (
          <MetricItem key={id} value={value} label={t(labelKey)} Icon={Icon} />
        ))}
      </div>
    </section>
  );
}
