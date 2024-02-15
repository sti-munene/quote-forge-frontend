import React, { useEffect, useState } from "react";
import { Heading } from "./typography";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/router";
import Link from "next/link";

type EmptyListProps = {
  itemName: string;
  itemsList: PaginatedResults;
  actionLink: string;
};

const EmptyList = ({ itemName, itemsList, actionLink }: EmptyListProps) => {
  const router = useRouter();
  console.log(itemsList);

  return (
    <div className="w-full flex gap-4 flex-col items-center justify-center p-4 rounded-lg bg-slate-500 dark:bg-slate-900 bg-opacity-10 dark:bg-opacity-20 h-40">
      <Heading as="h6" size="heading6">
        It seems like there are no {itemName.toLowerCase()}s here yet.
      </Heading>

      {itemsList.current_page === 1 && itemsList.results.length === 0 && (
        <Link
          className={buttonVariants({ variant: "default" })}
          href={actionLink}
        >
          Create {itemName.toLowerCase()}
        </Link>
      )}

      {itemsList.current_page > 1 && itemsList.results.length === 0 && (
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Go back
        </Button>
      )}
    </div>
  );
};

export { EmptyList };
