import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { BusinessForm } from "@/components/forms/BusinessForm";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, useSession } from "next-auth/react";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { Session } from "next-auth";
import { Heading, Text } from "@/components/typography";

function OnboardingPage({ csrfToken }: { csrfToken: string }) {
  const { data: session, status } = useSession({ required: true });

  return (
    <>
      <GenericHead title="Onboarding" />

      <main>
        <Container>
          <div className="mt-4">
            <div className="mb-2">
              <Heading size="heading6" as="h6">
                Onboarding
              </Heading>
              <Text size="body1" as="p">
                Add your business information to continue
              </Text>
            </div>
            <BusinessForm action="create" csrfToken={csrfToken} />
          </div>
        </Container>
      </main>
    </>
  );
}

export default OnboardingPage;

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

  if (!session?.user?.has_completed_onboarding) {
    // Go ahead with onboarding
    const csrfToken = await getCsrfToken(context);

    return {
      props: { csrfToken: csrfToken },
    };
  }

  // Redirect user to the dashboard page if they have completed onboarding
  return { redirect: { destination: "/dashboard" } };
}
