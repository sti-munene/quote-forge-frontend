import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { Heading } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <GenericHead title="Resource not found" />

      <div>
        <Container>
          <div
            style={{
              height: "calc(100vh - 84px)",
            }}
            className="w-full grid place-items-center"
          >
            <div className="flex flex-col items-center gap-2">
              <Heading as="h4" size="heading6">
                Resource not found
              </Heading>

              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default NotFoundPage;
