import type { ComponentType, SVGProps } from 'react';

import * as SolidIcons from './solid';
import * as OutlineIcons from './outline';

export type { SolidIconName } from './solid';
export type { OutlineIconName } from './outline';

export type IconType = 'solid' | 'outline';

export type IconName = SolidIcons.SolidIconName | OutlineIcons.OutlineIconName;

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function getIcon(type: IconType, name: IconName): IconComponent | undefined {
  if (type === 'solid') {
    return (SolidIcons as Record<string, unknown>)[name] as IconComponent | undefined;
  }

  return (OutlineIcons as Record<string, unknown>)[name] as IconComponent | undefined;
}

export function getAllIconNames() {
  return {
    solid: SolidIcons.solidIconNames,
    outline: OutlineIcons.outlineIconNames,
  } as const;
}
