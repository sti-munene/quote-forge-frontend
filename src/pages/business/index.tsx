import { BusinessForm } from "@/components/forms/BusinessForm";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/typography";
import { SidePanel } from "@/components/SidePanel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/utils";
import { Session } from "next-auth";
import { GenericHead } from "@/components/GenericHead";

interface BusinessPageProps {
  csrfToken: string;
  business: any;
}

function BusinessPage({ csrfToken, business }: BusinessPageProps) {
  return (
    <>
      <GenericHead title="Business" />
      <main>
        <Container>
          <div className="mt-4 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>

            <div className="flex-grow flex-shrink items-start pb-16">
              <Heading as="h6" size="heading6">
                Business
              </Heading>

              <div className="flex items-center gap-4">
                <Image
                  className="rounded-full"
                  height={250}
                  width={250}
                  alt="User profile photo"
                  src="/ben.jpg"
                />

                <Button>Upload photo</Button>
              </div>

              <div>
                {business && (
                  <BusinessForm
                    business={business}
                    action="update"
                    csrfToken={csrfToken as string}
                  />
                )}

                {!business && (
                  <BusinessForm
                    action="create"
                    csrfToken={csrfToken as string}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default BusinessPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: Session | null = await getServerSession(
    context.req,
    context.res,
    authOptions as any
  );

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (!session) {
    return { redirect: { destination: "/auth/sign-in" } };
  }

  // If the user has not completed onboarding, redirect.
  if (session && !session?.user?.has_completed_onboarding) {
    return { redirect: { destination: "/onboarding" } };
  }

  const csrfToken = await getCsrfToken(context);
  const business = await getBusiness(session as Session);

  // // Redirect user to the onboarding page if they have not set up business information
  // if (!business) {
  //   return { redirect: { destination: "/onboarding" } };
  // }

  return {
    props: { csrfToken, business },
  };
}
