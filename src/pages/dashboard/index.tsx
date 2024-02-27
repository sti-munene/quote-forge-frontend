import React from "react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Container } from "@/components/Container";
import { Product } from "@/components/Product";
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

function DashboardPage() {
  return (
    <>
      <GenericHead title="Dashboard" />
      <main className="mt-8">
        <Container>
          <div className="mt-4 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>
            <div className="flex-grow flex-shrink items-start pb-16">
              <div className="flex items-center justify-between w-full mb-4">
                <Heading as="h3" size="heading6">
                  Dashboard
                </Heading>
                <Link
                  href="/customers/create"
                  className={buttonVariants({ size: "sm" })}
                >
                  Do sth
                </Link>
              </div>
              <div>DashboardPage</div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default DashboardPage;

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

  if (session && !session?.user?.has_completed_onboarding) {
    return { redirect: { destination: "/onboarding" } };
  }

  return {
    props: {},
  };
}
