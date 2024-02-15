import { useState } from "react";
import { getCsrfToken, useSession } from "next-auth/react";
import axios from "axios";
import { Container } from "@/components/Container";
import { Button, buttonVariants } from "@/components/ui/button";
import { GenericHead } from "@/components/GenericHead";
import Link from "next/link";
import { SidePanel } from "@/components/SidePanel";
import Image from "next/image";
import { Heading } from "@/components/typography";
import { UserDetailsForm } from "@/components/forms/UserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { User } from "../../types/next-auth";

export default function ProfilePage({ csrfToken }: { csrfToken: string }) {
  const { data: session, status } = useSession({ required: true });
  const [response, setResponse] = useState("{}");

  const getUserDetails = async (useToken: boolean) => {
    try {
      const response = await axios({
        method: "get",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
        headers: useToken
          ? { Authorization: "Bearer " + session?.access_token }
          : {},
      });
      setResponse(JSON.stringify(response.data));
    } catch (error: any) {
      setResponse(error.message);
    }
  };

  if (status == "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
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
                  <UserDetailsForm
                    user={session.user as User}
                    csrfToken={csrfToken as string}
                  />
                </div>
              </div>
            </div>
          </Container>
        </main>
      </>
    );
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
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

  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken: csrfToken },
  };
}
