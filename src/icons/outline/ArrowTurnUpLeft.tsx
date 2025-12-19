import React from 'react';

interface ArrowTurnUpLeftProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const ArrowTurnUpLeft: React.FC<ArrowTurnUpLeftProps> = ({
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
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5"></path>
</svg>
);

export default ArrowTurnUpLeft;
