import React from 'react';

interface ArrowUturnUpProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const ArrowUturnUp: React.FC<ArrowUturnUpProps> = ({
  size = 24,
  className = '',
  fill = 'currentColor',
  stroke = 'none',
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
  <path fill-rule="evenodd" d="M21.53 9.53a.75.75 0 0 1-1.06 0l-4.72-4.72V15a6.75 6.75 0 0 1-13.5 0v-3a.75.75 0 0 1 1.5 0v3a5.25 5.25 0 1 0 10.5 0V4.81L9.53 9.53a.75.75 0 0 1-1.06-1.06l6-6a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd"></path>
</svg>
);

export default ArrowUturnUp;
