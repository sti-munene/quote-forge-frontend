import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { ProductForm } from "@/components/forms/ProductForm";
import { Heading } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getBusiness } from "@/utils";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const ProductCreatePage = ({
  csrfToken,
  business,
}: {
  csrfToken: string;
  business: any;
}) => {
  const router = useRouter();

  return (
    <>
      <GenericHead title="Create Product" />

      <main>
        <Container>
          <div className="mt-8">
            <div className="mb-2">
              <Button variant={"outline"} onClick={() => router.back()}>
                Go back
              </Button>
            </div>

            <Heading as="h6" size="heading6">
              Create Product
            </Heading>

            <ProductForm
              business={business}
              csrfToken={csrfToken}
              action="create"
            />
          </div>
        </Container>
      </main>
    </>
  );
};

export default ProductCreatePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: Session | null = await getServerSession(
    context.req,
    context.res,
    authOptions as any
  );

  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/auth/sign-in" } };
  }

  // If the user has not completed onboarding, redirect.
  if (session && !session?.user?.has_completed_onboarding) {
    return { redirect: { destination: "/onboarding" } };
  }

  const csrfToken = await getCsrfToken(context);
  const business = await getBusiness(session as Session);

  return {
    props: { csrfToken: csrfToken, business: business },
  };
}
