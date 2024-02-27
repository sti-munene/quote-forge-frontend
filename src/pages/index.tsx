import { Container } from "@/components/Container";
import { GenericHead } from "@/components/GenericHead";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession({ required: false });

  return (
    <>
      <GenericHead title="Quote Forge" />
      <main className="w-full">
        <Container>
          <div
            style={{
              height: "calc(100vh - 72px)",
            }}
            className="flex items-center justify-center"
          >
            <div>
              {session && (
                <>
                  <h4 className="text-xl">Hello, {session?.user?.username}</h4>
                  {/* <pre className="w-[80%]">{JSON.stringify(session)}</pre> */}
                </>
              )}
              <h4 className="text-3xl">Welcome to Quote Forge</h4>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
