import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { User } from "../../../types/next-auth";
import { useRouter } from "next/router";

const customerFormSchema = z.object({
  name: z.string(),
  contact: z.string(),
  business: z.string().transform((value) => {
    const id = parseInt(value);
    return id;
  }),
});

interface CustomerFormProps {
  csrfToken: string;
  user?: User;
  action: "create" | "update";
  business: Business;
}

export function CustomerForm({
  csrfToken,
  user,
  action = "create",
  business,
}: CustomerFormProps) {
  const router = useRouter();
  const { data: session, status, update } = useSession({ required: true });
  const [formLoading, setFormLoading] = useState(false);
  const [navigateAway, setNavigateAway] = useState(true);

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      setFormLoading(true);
      await axios({
        method: action === "create" ? "post" : "patch",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/`,
        data: values,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      setFormLoading(false);
      action === "create" && toast.success("Customer created.");
      action === "update" && toast.success("Customer updated.");
      form.reset();

      if (navigateAway) {
        router.back();
      }
    } catch (error: any) {
      setFormLoading(false);
      toast.error(error.message || "Update error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <input
          {...form.register("business")}
          name="business"
          value={business?.id}
          type="hidden"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer name</FormLabel>
                <FormControl>
                  <Input placeholder="Star LLC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact me</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="+15558886865" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          {action === "create" && (
            <>
              <Button
                className="w-fit mt-4"
                type="submit"
                onClick={() => setNavigateAway(true)}
              >
                Save
              </Button>

              <Button
                onClick={() => setNavigateAway(false)}
                variant="outline"
                className="w-fit mt-4"
                type="submit"
              >
                Save and add another
              </Button>
            </>
          )}

          {action !== "create" && (
            <Button
              className="w-fit mt-4"
              type="submit"
              onClick={() => setNavigateAway(true)}
            >
              Update customer
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
