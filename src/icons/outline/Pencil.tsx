import React from 'react';

interface PencilProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const Pencil: React.FC<PencilProps> = ({
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
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path>
</svg>
);

export default Pencil;
