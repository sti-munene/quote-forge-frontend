import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import React from "react";

type PaginationLinkProps = React.ComponentProps<typeof Link>;

const PaginationLink = ({ children, ...props }: PaginationLinkProps) => (
  <Link href={props.href}>{children}</Link>
);

export function CustomPagination({
  data,
  path,
}: {
  data: PaginatedResults;
  path: string;
}) {
  if (data.current_page === 1 && data.results.length === 0) return;

  return (
    <>
      <Pagination>
        <PaginationContent>
          {data?.previous_page && (
            <PaginationItem>
              <PaginationPrevious href={`${path}?page=${data.previous_page}`} />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={`${path}?page=${data?.current_page}`}>
              Showing page {data?.current_page} of {data.total_pages}
            </PaginationLink>
          </PaginationItem>

          {data?.next_page && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href={`${path}?page=${data.next_page}`} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
