import { Title } from "~/components/design-system";
import { ComparingPlanCard } from "~/components/Membership/ComparingPlanCard";

const CA_TEST_PLANS = [
  {
    availableOnPlan: "bothLifetime",
    description: "Random text",
    title: "Available for lifetime and lifetimePlus",
  },
  {
    availableOnPlan: "lifetimePlus",
    description: "Random text",
    title: "Available only for lifetimePlus",
  },
];

const US_TEST_PLANS = [
  {
    availableOnPlan: "all",
    description: "Random text",
    title: "Available for all plans",
  },
  ...CA_TEST_PLANS,
];

export const ComparingPlanCardPlayground = () => {
  return (
    <div className="grid gap-xxxxxlarge">
      <div className="grid gap-large">
        <Title level="h2">PLANS FOR USA</Title>
        <div className="grid gap-medium">
          {US_TEST_PLANS.map(({ availableOnPlan, description, title }) => (
            <ComparingPlanCard
              key={title}
              description={description}
              title={title}
              // @ts-expect-error - ignoring for test purposes only
              availableOnPlan={availableOnPlan}
              country={"us"}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-large">
        <Title level="h2">PLANS FOR CANADA</Title>
        <div className="grid gap-medium">
          {CA_TEST_PLANS.map(({ availableOnPlan, description, title }) => (
            <ComparingPlanCard
              key={title}
              description={description}
              title={title}
              // @ts-expect-error - ignoring for test purposes only
              availableOnPlan={availableOnPlan}
              country={"ca"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
