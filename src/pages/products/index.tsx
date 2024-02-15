import React from "react";
import { Session, getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Container } from "@/components/Container";
import { Product } from "@/components/Product";
import { Heading } from "@/components/typography";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SidePanel } from "@/components/SidePanel";
import { CustomPagination } from "@/components/Pagination";
import { getProducts } from "@/utils";
import { EmptyList } from "@/components/EmptyList";
import { GenericHead } from "@/components/GenericHead";

function ProductsPage({ products }: { products: PaginatedProducts }) {
  return (
    <>
      <GenericHead title="Products" />

      <main className="mt-8">
        <Container>
          <div className="mt-2 flex w-full flex-row gap-4">
            <div className="w-12 md:w-64 flex flex-col gap-2 md:gap-1 items-start md:items-end relative">
              <SidePanel />
            </div>

            <div className="flex-grow flex-shrink items-start pb-16">
              <div className="flex items-center justify-between w-full mb-4">
                <Heading as="h3" size="heading6">
                  Products
                </Heading>
                <Link
                  href="/products/create"
                  className={buttonVariants({ size: "sm" })}
                >
                  Add products
                </Link>
              </div>
              <div>
                {products?.results?.length === 0 && (
                  <EmptyList
                    actionLink="/products/create"
                    itemsList={products}
                    itemName="Product"
                  />
                )}

                {products?.results?.length > 0 && (
                  <>
                    {products?.results.map((product: any) => {
                      return <Product key={product.id} product={product} />;
                    })}

                    <CustomPagination path="/products/" data={products} />
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

export default ProductsPage;

interface SampleQuery {
  page?: string;
}

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

  const query = context.query as SampleQuery;
  let page_to_query = query.page ? query.page : "1";
  const products = await getProducts(session as Session, page_to_query);

  return {
    props: {
      products,
    },
  };
}
