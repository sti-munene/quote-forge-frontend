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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const businessFormSchema = z.object({
  name: z.string().min(2, "At least 2 characters required"),
  phone: z.string().refine(
    (value) => {
      return isValidPhoneNumber(value);
    },
    { message: "Invalid phone number" }
  ),
});

interface BusinessFormProps {
  csrfToken: string;
  action?: "create" | "update";
  business?: {
    id: number;
    name: string;
    phone: string;
  };
}

export function BusinessForm({
  csrfToken,
  action = "update",
  business,
}: BusinessFormProps) {
  const { data: session, status } = useSession({ required: true });
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: business ? business?.name : "",
      phone: business ? business?.phone : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof businessFormSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const reqConfig = {
      method: action === "create" ? "post" : "patch",
      url:
        action === "create"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/business/`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/business/${business?.id}/`,
      data: values,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    };

    try {
      setFormLoading(true);
      await axios(reqConfig);
      setFormLoading(false);

      action === "create" && toast.success("Business created.");
      action === "update" && toast.success("Business updated.");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Rely Screen Printing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="GB"
                    id="contact"
                    placeholder="+44 56 4564 5648"
                    countryCallingCodeEditable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit mt-4" type="submit">
          {action === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
}
