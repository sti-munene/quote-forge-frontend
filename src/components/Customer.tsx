import React from "react";
import { Heading, Text } from "./typography";
import Link from "next/link";

export function Customer({ customer }: { customer: Customer }) {
  return (
    <Link
      className="block bg-transparent hover:bg-slate-500 hover:bg-opacity-10 dark:hover:bg-slate-900 dark:hover:bg-opacity-50 p-2 rounded-md border border-slate-50 dark:border-slate-800 mb-4"
      href={`/customers/${customer.id}`}
    >
      <div className="">
        <Heading as="h6" size="heading6">
          {customer.name}
        </Heading>
      </div>
    </Link>
  );
}
