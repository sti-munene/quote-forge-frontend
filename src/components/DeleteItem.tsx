import { Session } from "next-auth";
import { Text } from "./typography";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { deleteItem } from "@/utils/data-mutations";
import { useRouter } from "next/router";

type DeleteItemProps = {
  apiUrl: string;
  itemName: string;
  warningMessage: string;
};

const DeleteItem = ({ apiUrl, itemName, warningMessage }: DeleteItemProps) => {
  const { data: session } = useSession({ required: true });
  const router = useRouter();

  return (
    <div className="rounded-lg bg-red-500 bg-opacity-10 p-4">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
        <Text className="text-red-900 dark:text-red-600" as="p" size="body1">
          {warningMessage}
        </Text>

        <Button
          onClick={() =>
            deleteItem(apiUrl, session as Session, router, itemName)
          }
          variant="destructive"
        >
          Delete {itemName && itemName.toLowerCase()}
        </Button>
      </div>
    </div>
  );
};

export { DeleteItem };
