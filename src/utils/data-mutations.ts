import axios from "axios";
import { Session } from "next-auth";
import { NextRouter } from "next/router";
import { toast } from "sonner";

export const deleteItem = async (
  apiUrl: string,
  session: Session,
  router: NextRouter,
  itemName?: string
) => {
  try {
    await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer  ${session?.access_token}`,
      },
    });

    const toastMsg = itemName
      ? `${itemName} has been deleted.`
      : "Item has been deleted deleted.";

    toast.success(toastMsg);
    router.back();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      toast.error("An error occurred.");
    }
    toast.error("An unexpected error occurred.");
  }
};
