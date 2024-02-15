import React from "react";
import { Heading, Text } from "./typography";

export function Quote({ quote }: { quote: Quotation }) {
  return (
    <div className="p-2 rounded-md border border-slate-50 dark:border-slate-800 mb-4">
      <Heading as="h6" size="heading6">
        {quote.title}
      </Heading>
    </div>
  );
}
