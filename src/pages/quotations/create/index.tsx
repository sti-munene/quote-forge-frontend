import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { Heading } from "@/components/typography";

const CreateQuotationPage = () => {
  return (
    <>
      <GenericHead title="Create Quotation" />
      <main>
        <Container>
          <div className="mt-4">
            <Heading as="h5" size="heading6">
              Create Quotation
            </Heading>
          </div>
        </Container>
      </main>
    </>
  );
};

export default CreateQuotationPage;
