import type { FC, ComponentType, SVGProps } from 'react';
import { IconCheck, IconHeart } from './icons';

export const IconMap = Object.freeze({
  check: IconCheck,
  heart: IconHeart,
});

export type IconKeys = keyof typeof IconMap;

export interface IconProps extends SVGProps<SVGSVGElement> {
  'data-testid'?: string;
  display: IconKeys;
}

export const Icon: FC<IconProps> = ({
  'data-testid': testId,
  display,
  ...rest
}) => {
  const SvgIcon: ComponentType<SVGProps<SVGSVGElement>> = IconMap[display];
  return <SvgIcon data-testid={testId ?? `Icon-${display}`} {...rest} />;
};