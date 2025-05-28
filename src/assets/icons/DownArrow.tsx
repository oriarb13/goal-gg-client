import React from "react";

interface DownArrowProps {
  className?: string;
  size?: number;
  color?: string;
}

export const DownArrow: React.FC<DownArrowProps> = ({
  className = "w-15 h-15",
  size = 60,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownArrow;
