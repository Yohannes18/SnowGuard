import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-12 ${className}`}>
      {children}
    </div>
  );
}
