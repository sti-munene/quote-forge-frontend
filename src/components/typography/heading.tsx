import clsx from "clsx";
import {
  HTMLAttributes,
  PropsWithChildren,
  ComponentPropsWithRef,
  forwardRef,
  ElementType,
  ReactNode,
} from "react";
import { WeightOpts } from "./utils";

type SizeOpts =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "subtitle1"
  | "subtitle2";

type HeadingRef = HTMLHeadingElement;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  children: ReactNode;
  size?: SizeOpts;
  weight?: WeightOpts;
  className?: string;
}

const Heading = ({
  as: Component = "h3",
  children,
  className = "",
  size = "heading1",
  weight = "normal",
  ...props
}: HeadingProps) => {
  const sizes = {
    heading1: "text-6xl md:text-7xl lg:text-8xl",
    heading2: "text-4xl md:text-5xl lg:text-6xl",
    heading3: "text-3xl md:text-4xl lg:text-5xl",
    heading4: "text-2xl md:text-3xl lg:text-4xl",
    heading5: "text-xl md:text-2xl lg:text-3xl",
    heading6: "text-xl lg:text-2xl",
    subtitle1: "text-xl md:text-lg",
    subtitle2: "text-lg",
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

  const styles = clsx(sizes[size], weights[weight], className);

  return (
    <Component {...props} className={styles}>
      {children}
    </Component>
  );
};

Heading.displayName = "Heading";

export { Heading };
