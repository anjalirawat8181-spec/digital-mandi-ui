import type { ReactNode, ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className="base-button"
      {...props}
    >
      {children}
    </button>
  );
}
