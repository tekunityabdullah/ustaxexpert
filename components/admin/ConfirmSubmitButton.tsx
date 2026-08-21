"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { AdminButton } from "@/components/admin/ui/Button";

type Variant = "primary" | "secondary" | "ghost" | "danger";

/**
 * A submit button that asks for confirmation before letting the form
 * submission through — used for delete actions across the CMS modules.
 * Plain window.confirm keeps this dependency-free and works with a
 * standard <form action={serverAction}> without any client-side state.
 */
export default function ConfirmSubmitButton({
  children,
  confirmMessage,
  variant = "danger",
  size = "sm",
  className = "",
  ...rest
}: {
  children: ReactNode;
  confirmMessage: string;
  variant?: Variant;
  size?: "sm" | "md";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <AdminButton
      type="submit"
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </AdminButton>
  );
}
