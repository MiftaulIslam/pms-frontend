import React from 'react';

interface ArrowTurnRightDownProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const ArrowTurnRightDown: React.FC<ArrowTurnRightDownProps> = ({
  size = 24,
  className = '',
  fill = 'none',
  stroke = 'currentColor',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    fill={fill}
    stroke={stroke}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.99 16.5 3.75 3.75m0 0 3.75-3.75m-3.75 3.75V3.75H4.49"></path>
</svg>
);

export default ArrowTurnRightDown;
