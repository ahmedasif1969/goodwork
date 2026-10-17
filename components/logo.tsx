export function Logo() {
  return (
    <span className="brand">
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 3 4 9v12l11 6 11-6V9L15 3Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M15 9 10 12v6l5 3 5-3v-3h-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand-name">
        GOODWORK<span className="brand-descriptor">Digital</span>
      </span>
    </span>
  );
}
