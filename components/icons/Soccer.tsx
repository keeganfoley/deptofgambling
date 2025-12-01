export default function Soccer({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Pentagon in center */}
      <path
        d="M12 7L15.5 9.5L14 14H10L8.5 9.5L12 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Connecting lines to edges */}
      <path d="M12 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 9.5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 9.5L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
