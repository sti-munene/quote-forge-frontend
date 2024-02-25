import { Container } from "@/components/Container";
import { DeleteItem } from "@/components/DeleteItem";
import { GenericHead } from "@/components/GenericHead";
import { Heading, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getBusiness, getCustomer, getCustomers } from "@/utils";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";

interface CustomerDetailPageProps {
  business: Business;
  customer: Customer;
}

function CustomerDetailPage({ customer }: CustomerDetailPageProps) {
  const router = useRouter();

  return (
    <>
      <GenericHead title="Customer Detail" />
      <main>
        <Container>
          <div className="min-h-[500px] pt-8 pb-16 w-full flex flex-col items-center justify-between">
            <div className="w-full pb-2 mb-2 border-b">
              <div className="mb-2">
                <Button variant={"outline"} onClick={() => router.back()}>
                  Go back
                </Button>
              </div>

              <div>
                <Heading as="h4" size="heading6">
                  {customer.name}
                </Heading>

                <Text as="p" size="body1">
                  {customer.contact}
                </Text>
              </div>
            </div>

            <div className="w-full">
              <DeleteItem
                itemName="Customer"
                warningMessage={`Delete ${customer.name}? This action cannot be undone.`}
                apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${customer.id}/`}
              />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default CustomerDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions as any
  );

  // If the user is already logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/auth/sign-in" } };
  }

  const business = await getBusiness(session as Session);
  const { customerId } = context?.params as { customerId: string };

  const customer = await getCustomer(customerId, session as Session);
  console.log(customer);

  return {
    props: {
      business: business,
      customer: customer,
    },
  };
}
