import React from 'react';

interface ChevronDoubleUpProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const ChevronDoubleUp: React.FC<ChevronDoubleUpProps> = ({
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
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5"></path>
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5"></path>
</svg>
);

export default ChevronDoubleUp;
