import { Icon } from "../icon/Icon";

export type StepProgressProps = {
  count: number;
  current: number;
};

export const StepProgress = ({ count, current }: StepProgressProps) => {
  if (count < 1) return null;

  return (
    <div
      className="flex justify-between"
      aria-label={`Step ${current} of ${count}`}
    >
      <div>
        {current} of {count}
      </div>
      <div className="flex" role="group" aria-label="Progress Indicators">
        {renderIcons(current, count)}
      </div>
    </div>
  );
};

function renderIcons(current: number, count: number) {
  return Array.from({ length: count }, (_, i) => renderIcon(i < current, i));
}

function renderIcon(isDone: boolean, key: number) {
  return (
    <Icon
      key={`step-${key}`}
      display={isDone ? "ellipse" : "emptyEllipse"}
      className={`${isDone ? "" : "text-white"} mx-xsmall`}
      aria-label={isDone ? "Completed Step" : "Uncompleted Step"}
    />
  );
}
