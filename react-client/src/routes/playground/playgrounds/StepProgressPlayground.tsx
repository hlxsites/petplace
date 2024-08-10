import { StepProgress } from "~/components/design-system";
import { createNumericArray } from "~/util/misc";

const COUNT = 8;

export const StepProgressPlayground = () => {
  return (
    <div className="w-[300px]">
      {createNumericArray(COUNT).map((index) => (
        <StepProgress count={COUNT} current={index + 1} />
      ))}
      {createNumericArray(COUNT - 1)
        .reverse()
        .map((index) => (
          <StepProgress count={COUNT} current={index + 1} />
        ))}
    </div>
  );
};
