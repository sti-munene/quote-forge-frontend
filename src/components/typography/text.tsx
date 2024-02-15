import clsx from "clsx";
import React from "react";
import { WeightOpts } from "./utils";

type TextSizeOpts = "body1" | "body2" | "body3";

interface TextProps {
  as?: React.ElementType;
  className?: string;
  color?: "default" | "primary" | "light" | "danger";
  weight?: WeightOpts;
  size?: TextSizeOpts;
  children: React.ReactNode;
  [key: string]: any;
}

export function Text({
  as: Component = "p",
  className,
  color = "default",
  size = "body1",
  weight = "normal",
  children,
  ...props
}: TextProps) {
  const colors: Record<string, string> = {
    default: "text-current",
    primary: "text-primary-500",
    light: "text-white",
    danger: "text-red-800",
  };

  const sizes: Record<string, string> = {
    body1: "text-base",
    body2: "text-sm",
    body3: "text-xs",
  };

  const weights = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  const styles = clsx(sizes[size], colors[color], weights[weight], className);

  return (
    <Component {...props} className={styles}>
      {children}
    </Component>
  );
}
