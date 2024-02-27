import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { Heading } from "@/components/typography";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getBusiness } from "@/utils";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { getCsrfToken } from "next-auth/react";

const CreateQuotationPage = () => {
  return (
    <>
      <GenericHead title="Create Quotation" />
      <main>
        <Container>
          <div className="mt-4">
            <Heading as="h5" size="heading6">
              Create Quotation
            </Heading>
          </div>
        </Container>
      </main>
    </>
  );
};

export default CreateQuotationPage;

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
