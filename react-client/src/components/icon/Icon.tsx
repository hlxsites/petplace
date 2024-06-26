import CheckIcon from "./assets/check-icon.svg";

export const IconMap = Object.freeze({
  check: <CheckIcon />,
});

export type IconKeys = keyof typeof IconMap;

export type IconProps = {
  className?: string;
  color?: string;
  display: IconKeys;
  size?: number;
};

export const Icon = ({ color, display, size, ...rest }: IconProps) => {
  return (
    <div {...rest} style={{ color, width: size }}>
      {IconMap[display]}
    </div>
  );
};
