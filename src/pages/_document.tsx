import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";
import { Inter as FontSans } from "next/font/google";

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body
      // className={cn(
      //   "min-h-screen bg-background font-sans antialiased",
      //   fontSans.variable
      // )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
