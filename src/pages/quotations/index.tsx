import React from "react";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Container } from "@/components/Container";
import { Heading } from "@/components/typography";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SidePanel } from "@/components/SidePanel";
import { getQuotations } from "@/utils";
import { Session } from "next-auth";
import { CustomPagination } from "@/components/Pagination";
import { Quote } from "@/components/Quote";
import { EmptyList } from "@/components/EmptyList";
import { GenericHead } from "@/components/GenericHead";

function QuotationsPage({ quotations }: { quotations: PaginatedResults }) {
  return (
    <>
      <GenericHead title="Quotations" />

      <main className="mt-8">
        <Container>
          <div className="mt-4 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>

            <div className="flex-grow flex-shrink items-start pb-16">
              <div className="flex items-center justify-between w-full mb-4">
                <Heading as="h3" size="heading6">
                  Quotations
                </Heading>
                <Link
                  href="/quotations/create"
                  className={buttonVariants({ size: "sm" })}
                >
                  New quote
                </Link>
              </div>

              {quotations?.results?.length === 0 && (
                <EmptyList
                  actionLink="/quotations/create"
                  itemsList={quotations}
                  itemName="Quotations"
                />
              )}

              {quotations?.results?.length > 0 && (
                <>
                  <div>
                    {quotations?.results?.length > 0 && (
                      <>
                        {quotations?.results.map((quote: any) => {
                          return <Quote key={quote.id} quote={quote} />;
                        })}
                      </>
                    )}
                  </div>

                  <CustomPagination path="/customers/" data={quotations} />
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default QuotationsPage;

interface SampleQuery {
  page?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: Session | null = await getServerSession(
    context.req,
    context.res,
    authOptions as any
  );

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/auth/sign-in" } };
  }

  // If the user has not completed onboarding, redirect.
  if (session && !session?.user?.has_completed_onboarding) {
    return { redirect: { destination: "/onboarding" } };
  }

  const query = context.query as SampleQuery;
  let page_to_query = query.page ? query.page : "1";

  const quotations = await getQuotations(session as Session, page_to_query);

  return {
    props: {
      quotations: quotations,
    },
  };
}
