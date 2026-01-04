import * as React from 'react';

export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9 16L13 20L23 10"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
