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
import { useRouter } from "next/router";

const productFormSchema = z.object({
  title: z.string(),
  price: z.string().transform((value) => parseFloat(value)), // Convert string to number
  business: z.string().transform((value) => {
    const id = parseInt(value);
    return id;
  }),
});

interface ProductFormProps {
  csrfToken: string;
  action?: "create" | "update";
  business: {
    id: number;
  };
}

export function ProductForm({
  csrfToken,
  action = "update",
  business,
}: ProductFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [formLoading, setFormLoading] = useState(false);
  const [navigateAway, setNavigateAway] = useState(true);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    const reqConfig = {
      method: action === "create" ? "post" : "patch",
      url: "http://localhost:8000/api/products/",
      data: values,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    };

    try {
      setFormLoading(true);
      await axios(reqConfig);
      setFormLoading(false);

      action === "create" && toast.success("Product created.");
      action === "update" && toast.success("Product updated.");

      form.reset();

      if (navigateAway) {
        router.back();
      }
    } catch (error: any) {
      setFormLoading(false);
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-4"
      >
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input placeholder="T Shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="20" {...field} />
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
              Update product
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
