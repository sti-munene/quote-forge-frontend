import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getBusiness } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Building2,
  FileStack,
  PackageSearch,
  User,
  Users,
} from "lucide-react";
import { Text } from "./typography";

const LgSidePanel = () => {
  const lgLinkStyles = `mr-2 w-64 h-12 px-4 flex items-center justify-start gap-4 rounded-lg dark:hover:bg-slate-400 dark:hover:bg-opacity-20 bg-opacity-10 hover:text-primary`;

  return (
    <div className="hidden md:flex flex-col items-end gap-2 border-r h-screen">
      <Link className={lgLinkStyles + " mt-4"} href="/dashboard">
        <Home className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Dashboard
        </Text>
      </Link>
      <Link className={lgLinkStyles} href="/profile">
        <User className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Profile
        </Text>
      </Link>
      <Link className={lgLinkStyles} href="/business">
        <Building2 className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Business
        </Text>
      </Link>
      <Link className={lgLinkStyles} href="/products?page=1">
        <PackageSearch className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Products
        </Text>
      </Link>
      <Link className={lgLinkStyles} href={`/customers?page=1`}>
        <Users className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Customers
        </Text>
      </Link>
      <Link className={lgLinkStyles} href="/quotations?page=1">
        <FileStack className="h-9 w-9" />
        <Text size="body1" weight="medium" as="span">
          Quotations
        </Text>
      </Link>
    </div>
  );
};

const SmSidePanel = () => {
  const smLinkStyles = `h-10 w-10 p-2 rounded-sm w-full bg-transparent bg-opacity-10 flex items-center justify-center hover:bg-slate-400 hover:bg-opacity-20 dark:hover:bg-opacity-20 hover:text-primary text-sm`;

  return (
    <div className="flex flex-col items-start gap-2 md:hidden h-screen overflow-y-auto border-r pr-2">
      <Link className={smLinkStyles + " mt-4"} href="/dashboard">
        <Home className="h-7 w-7" />
      </Link>

      <Link className={smLinkStyles} href="/profile">
        <User className="h-7 w-7" />
      </Link>

      <Link className={smLinkStyles} href="/business">
        <Building2 className="h-7 w-7" />
      </Link>

      <Link className={smLinkStyles} href="/products?page=1">
        <PackageSearch className="h-7 w-7" />
      </Link>

      <Link className={smLinkStyles} href={`/customers?page=1`}>
        <Users className="h-7 w-7" />
      </Link>

      <Link className={smLinkStyles} href="/quotations?page=1">
        <FileStack className="h-7 w-7" />
      </Link>
    </div>
  );
};

export function SidePanel() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: async ({ queryKey }) => {
      const session = await getSession(authOptions as any);
      return getBusiness(session as Session);
    },
  });

  return (
    <div className="fixed top-16 z-50 overflow-y-auto">
      <SmSidePanel />
      <LgSidePanel />
    </div>
  );
}
