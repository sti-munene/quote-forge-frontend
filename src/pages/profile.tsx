import { getCsrfToken } from "next-auth/react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { GenericHead } from "@/components/GenericHead";
import { SidePanel } from "@/components/SidePanel";
import Image from "next/image";
import { Heading } from "@/components/typography";
import { UserDetailsForm } from "@/components/forms/UserForm";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

export default function ProfilePage({ csrfToken }: { csrfToken: string }) {
  return (
    <>
      <GenericHead title="Profile" />

      <main>
        <Container>
          <div className="mt-4 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>

            <div className="flex-grow flex-shrink items-start pb-16">
              <Heading as="h3" size="heading6">
                Profile
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
                <UserDetailsForm csrfToken={csrfToken as string} />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

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

  // Return csrf token
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken: csrfToken },
  };
}
