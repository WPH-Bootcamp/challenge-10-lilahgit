type LogoProps = {
  className?: string;
};

export default function Logo({ className = "h-6 w-158.62" }: LogoProps) {
  return <img src="/logo.svg" alt="Your Logo" className={`block ${className}`} />;
}
