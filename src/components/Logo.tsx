type LogoProps = {
  className?: string;
};

export default function Logo({ className = "h-6 w-auto" }: LogoProps) {
  return <img src="/logo.svg" alt="Your Logo" className={className} />;
}
