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

const userDetailsFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
});

export function UserDetailsForm({ csrfToken }: { csrfToken: string }) {
  const { data: session, status, update } = useSession({ required: true });
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof userDetailsFormSchema>>({
    resolver: zodResolver(userDetailsFormSchema),
    defaultValues: {
      first_name: session ? session?.user?.first_name : "",
      last_name: session ? session?.user?.last_name : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userDetailsFormSchema>) => {
    try {
      setFormLoading(true);
      const res = await axios({
        method: "patch",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/`,
        data: values,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      // Update the session with the new user
      await update({
        ...session,
        user: res.data,
      });

      setFormLoading(false);
      toast.success("User updated.");
    } catch (error: any) {
      setFormLoading(false);
      toast.error(error.message || "Update error");
    }
  };

  return (
    <Form {...form}>
      <form
        // method="post"
        // action="/api/auth/callback/credentials"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Mike" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Epps" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit mt-4" type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
}
