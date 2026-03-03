import Link from "next/link";

type RegisterButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export default function RegisterButton({
  href = "/register",
  label = "Register",
  className = "",
}: RegisterButtonProps) {
  return (
    <Link
      href={href}
      className={`register-btn inline-flex items-center justify-center ${className}`}
    >
      {label}
    </Link>
  );
}

