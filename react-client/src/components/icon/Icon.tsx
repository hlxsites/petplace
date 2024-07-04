import IconMap from "./IconMap";

export type IconKeys = keyof typeof IconMap;

export type IconProps = {
  display: IconKeys;
  size?: number;
};

export const Icon = ({ display, size }: IconProps) => {
  return (
    <div
      style={{
        height: size,
        width: size,
      }}
    >
      {IconMap[display]}
    </div>
  );
};