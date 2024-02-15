import { Container } from "@/components/Container";
import { Heading } from "@/components/typography";
import React from "react";

function NotFoundPage() {
  return (
    <div>
      <Container>
        <div>
          <Heading as="h4" size="heading6">
            Resource not found
          </Heading>
        </div>
      </Container>
    </div>
  );
}

export default NotFoundPage;
