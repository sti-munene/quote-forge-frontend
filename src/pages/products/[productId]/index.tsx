import { Container } from "@/components/Container";
import { DeleteItem } from "@/components/DeleteItem";
import { GenericHead } from "@/components/GenericHead";
import { Heading, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getProduct } from "@/utils";
import { GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

type ProductDetailPageProps = {
  product: Product;
};

function ProductDetailPage({ product }: ProductDetailPageProps) {
  const router = useRouter();

  return (
    <>
      <GenericHead title="Product Detail" />
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
                  {product.title}
                </Heading>

                <Text as="p" size="body1">
                  {product.price}
                </Text>
              </div>
            </div>

            <div className="w-full">
              <DeleteItem
                itemName="Product"
                warningMessage={`Delete ${product.title}? This action cannot be undone.`}
                apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${product.id}/`}
              />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default ProductDetailPage;

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

  const { productId } = context?.params as { productId: string };
  const product = await getProduct(productId, session as Session);

  return {
    props: {
      product: product,
    },
  };
}
