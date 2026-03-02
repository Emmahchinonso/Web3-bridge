const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org" viewBox="0 0 100 100" width="70" height="70">
      <linearGradient id="bgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#0D0D0D", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#282828", stopOpacity: 1 }} />
      </linearGradient>
      <path
        d="M30 20 L70 20 L85 40 L45 40 Z"
        fill="url(#bgrad)"
        opacity="0.8"
      />
      <path
        d="M30 20 L45 40 L45 80 L30 60 Z"
        fill="url(#bgrad)"
        opacity="0.6"
      />
      <path d="M45 40 L85 40 L70 60 L30 60 Z" fill="url(#bgrad)" opacity="1" />
      <path
        d="M45 80 L70 60 L85 40 L85 80 Z"
        fill="url(#bgrad)"
        opacity="0.5"
      />
    </svg>
  );
};

export default Logo;
