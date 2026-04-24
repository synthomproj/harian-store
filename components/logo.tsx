type LogoProps = {
  className?: string;
};

export function logo({ className = "" }: LogoProps = {}) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" role="img">
      <rect x="6" y="10" width="52" height="44" rx="12" fill="#00d1ff" stroke="#000" strokeWidth="4" />
      <rect x="14" y="18" width="24" height="18" rx="4" fill="#fff7d6" stroke="#000" strokeWidth="4" />
      <path d="M42 24 54 18v18L42 30z" fill="#ffe066" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
      <path d="M18 44h28" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="27" r="3" fill="#ff6b6b" />
    </svg>
  );
}

export const Logo = logo;
