import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Container } from "@/components/Container";
import { Heading } from "@/components/typography";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SidePanel } from "@/components/SidePanel";
import { getCustomers } from "@/utils";
import { Session } from "next-auth";
import { Customer } from "@/components/Customer";
import { CustomPagination } from "@/components/Pagination";
import { EmptyList } from "@/components/EmptyList";
import { GenericHead } from "@/components/GenericHead";

function CustomersPage({ customers }: { customers: any }) {
  return (
    <>
      <GenericHead title="Customers" />
      <main className="mt-8">
        <Container>
          <div className="mt-4 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>
            <div className="flex-grow flex-shrink items-start pb-16">
              <div className="flex items-center justify-between w-full mb-4">
                <Heading as="h3" size="heading6">
                  Customers
                </Heading>
                <Link
                  href="/customers/create"
                  className={buttonVariants({ size: "sm" })}
                >
                  Add customer
                </Link>
              </div>
              <div>
                {customers?.results?.length === 0 && (
                  <EmptyList
                    actionLink="/customers/create"
                    itemsList={customers}
                    itemName="Customer"
                  />
                )}

                {customers?.results?.length > 0 && (
                  <>
                    {customers?.results.map((customer: Customer) => {
                      return (
                        <Customer key={customers.id} customer={customer} />
                      );
                    })}

                    <CustomPagination path="/products/" data={customers} />
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default CustomersPage;

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

  const customers = await getCustomers(session as Session, page_to_query);

  return {
    props: {
      customers: customers,
    },
  };
}
