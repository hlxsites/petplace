import { createNumericArray } from "~/util/misc";
import { classNames } from "~/util/styleUtil";
import { Text } from "../text/Text";

export type StepProgressProps = {
  count: number;
  current: number;
};

export const StepProgress = ({ count, current }: StepProgressProps) => {
  if (count < 1) return null;

  const safeCurrent = Math.min(Math.max(current, 1), count);
  const stepText = `${safeCurrent} of ${count}`;

  return (
    <div
      className="flex items-center justify-between"
      data-testid="StepProgress"
    >
      <Text
        aria-label={`Step ${stepText}`}
        color="primary-900"
        fontWeight="medium"
        size="14"
      >
        {stepText}
      </Text>
      <div className="flex items-center gap-[3px]">{renderSteps()}</div>
    </div>
  );

  function renderSteps() {
    return createNumericArray(count).map((index) => {
      const isDone = index === safeCurrent - 1;
      return (
        <div
          className={classNames(
            "box-content size-[13px] rounded-full border border-solid border-primary-900",
            {
              "bg-primary-900": isDone,
            }
          )}
          key={`step-${index}`}
        />
      );
    });
  }
};
