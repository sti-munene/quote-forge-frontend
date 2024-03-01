import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FieldError, useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Heading, Text } from "../typography";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface LineItemsError {
  [key: string | number]: {
    description?: FieldError;
    rate?: { message: string };
    quantity?: { message: string };
    amount?: { message: string };
  };
}

const logoSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      file && file?.length == 1
        ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
          ? true
          : false
        : true,
    "Invalid image file"
  )
  .refine(
    (file) =>
      file && file?.length == 1
        ? file[0]?.size <= MAX_FILE_SIZE
          ? true
          : false
        : true,
    "Max file size allowed is 2MB."
  );

const lineItemSchema = z.object({
  description: z.string().min(3, "Minimum characters: 3"),
  rate: z.coerce
    .number({
      required_error: "Rate is required",
      invalid_type_error: "Rate must be numeric",
    })
    .int()
    .min(1, { message: "Minimum rate: 1" }),
  quantity: z.coerce
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be numeric",
    })
    .int()
    .min(1, { message: "Minimum quantity: 1" }),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be numeric",
    })
    .int()
    .min(1, { message: "Minimum amount: 1" }),
});

const quotationFormSchema = z.object({
  quote_no: z.string().min(3, "At least 2 characters required"),
  logo: logoSchema,
  from_name: z.string().min(3, "At least 3 characters required"),
  from_contact: z.string().min(3, "At least 3 characters required"),
  from_email: z.string().min(3, "At least 3 characters required"),

  to_name: z.string().min(3, "At least 3 characters required"),
  to_contact: z.string().min(3, "At least 3 characters required"),
  to_email: z.string().min(3, "At least 3 characters required"),

  line_items: z.array(lineItemSchema).min(1, "Minimum line items: 1"),
  notes: z.string().min(3, "At least 3 characters required"),
});

interface QFormProps {
  csrfToken?: string;
  action?: "create" | "update";
}

export function QuotationForm({ action = "create" }: QFormProps) {
  const form = useForm({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      from_contact: "+254710698933",
      from_email: "arcs@example.com",
      from_name: "Hotel La Mada",
      line_items: [
        { description: "Sample product", rate: 55, quantity: 1, amount: 55 },
      ],
      notes: "Some notes",
      quote_no: "555-888",
      to_contact: "+254710698933",
      to_email: "eq@example.com",
      to_name: "Eq Group",
      logo: null,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "line_items",
  });

  const { data: session, status, update } = useSession({ required: true });

  const onSubmit = async (values: any) => {
    const formData = new FormData();

    for (const key in values) {
      if (key === "line_items") {
        continue;
      }

      if (key === "logo") {
        // Handle file upload
        const fileInput = document.getElementById("logo") as HTMLInputElement;
        const f = fileInput.files?.[0];

        if (f) {
          formData.append(key, f);
        }
      } else {
        formData.append(key, values[key]);
      }
    }

    const reqConfig = {
      method: action === "create" ? "post" : "patch",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quotations/create/`,
      data: formData,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const qRes = await axios(reqConfig);

      // Create the line items
      const lineItemsReqConf = {
        method: "put",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quotations/add/line-items/${qRes.data.id}/`,
        data: {
          line_items: values.line_items,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
      };
      await axios(lineItemsReqConf);

      action === "create" && toast.success("Quote saved.");
      action === "update" && toast.success("Quote updated.");
    } catch (err: any) {
      console.log(err?.response?.data);
      toast.error("Something went wrong.");
    }
  };

  const handleQuantityChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const quantity = parseInt(event.target.value, 10);
    setValue(`line_items.${index}.quantity`, quantity);
    const rate = watch(`line_items.${index}.rate`, 0);
    const amount = rate * quantity;
    setValue(`line_items.${index}.amount`, amount || 0); // Set default amount to 0

    await trigger(`line_items.${index}.rate`); // Trigger re-validation
  };

  const handleRateChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rate = parseInt(event.target.value, 10);
    setValue(`line_items.${index}.rate`, rate);
    const quantity = watch(`line_items.${index}.quantity`, 0);
    const amount = rate * quantity;
    setValue(`line_items.${index}.amount`, amount || 0); // Set default amount to 0

    await trigger(`line_items.${index}.quantity`); // Trigger re-validation
  };

  return (
    <div className="px-4 py-6 border rounded-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Quote No. & Logo */}
          <div className="flex items-center justify-between">
            {/* Quote Number */}
            <FormField
              control={control}
              name="quote_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quote No.</FormLabel>
                  <FormControl>
                    <Input placeholder="#3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo */}
            <FormField
              control={control}
              name="logo"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        ref={field.ref}
                        name={field.name}
                        onChange={(e: any) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* To & From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* From */}
            <div>
              <Heading className="mb-2" size="heading6" as="h6">
                From
              </Heading>

              <FormField
                control={control}
                name="from_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="from_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="bs@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="from_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* To */}
            <div>
              <Heading className="mb-2" size="heading6" as="h6">
                To
              </Heading>

              <FormField
                control={control}
                name="to_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="to_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="bs@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="to_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <Heading className="mb-2" size="heading6" as="h6">
                Line items
              </Heading>

              <Button
                variant="default"
                type="button"
                onClick={() =>
                  append({
                    amount: 0,
                    description: "",
                    quantity: 1,
                    rate: 0,
                  })
                }
              >
                Add line item
              </Button>
            </div>

            <div className="overflow-y-auto">
              <table
                style={{
                  borderSpacing: "0.5rem",
                  borderCollapse: "separate",
                }}
                className="w-full overflow-y-auto"
              >
                <thead className="thead">
                  <tr className=" border-y">
                    <th className="px-2 min-w-12 text-center">#</th>
                    <th className="px-2 min-w-[420px] text-left">
                      Item description
                    </th>
                    <th className="px-2 min-w-40 text-right">Rate</th>
                    <th className="px-2 min-w-40 text-right">Qty</th>
                    <th
                      style={{
                        minWidth: "160px",
                      }}
                      className="px-2 text-right"
                    >
                      Amount
                    </th>
                    <th className="px-2 min-w-40 text-right"></th>
                  </tr>
                </thead>

                <tbody className="py-3">
                  {fields.map((item: any, index: number) => (
                    <tr key={item.id} className="mb-2">
                      <td className="px-2 text-center flex-col align-center">
                        <Text className="-mt-6" size="body2">
                          {index + 1}
                        </Text>
                      </td>

                      <td className="px-2 flex-col align-top">
                        <FormField
                          control={control}
                          name={`line_items.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <Input placeholder="Description" {...field} />
                            </FormItem>
                          )}
                        />

                        {(errors?.line_items as LineItemsError)?.[index]
                          ?.description && (
                          <Text size="body3" className="mt-2 text-destructive">
                            {
                              (errors?.line_items as LineItemsError)[index]
                                ?.description?.message
                            }
                          </Text>
                        )}
                      </td>

                      <td className="px-2 flex-col align-top">
                        <FormField
                          control={control}
                          name={`line_items.${index}.rate`}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e: any) => {
                                  handleRateChange(index, e);
                                  field.onChange(e);
                                }}
                              />
                            </FormItem>
                          )}
                        />

                        {(errors?.line_items as LineItemsError)?.[index]
                          ?.rate && (
                          <Text size="body3" className="mt-2 text-destructive">
                            {
                              (errors?.line_items as LineItemsError)[index]
                                ?.rate?.message
                            }
                          </Text>
                        )}
                      </td>

                      <td className="px-2 flex-col align-top">
                        <FormField
                          control={control}
                          name={`line_items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e: any) => {
                                  handleQuantityChange(index, e);
                                  field.onChange(e);
                                }}
                              />
                            </FormItem>
                          )}
                        />

                        {(errors?.line_items as LineItemsError)?.[index]
                          ?.quantity && (
                          <Text size="body3" className="mt-2 text-destructive">
                            {
                              (errors?.line_items as LineItemsError)[index]
                                ?.quantity?.message
                            }
                          </Text>
                        )}
                      </td>

                      <td className="px-2 flex-col align-top">
                        <FormField
                          control={control}
                          name={`line_items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                readOnly
                                className="pointer-events-none"
                                type="number"
                                {...field}
                              />
                            </FormItem>
                          )}
                        />

                        {(errors?.line_items as LineItemsError)?.[index]
                          ?.amount && (
                          <Text size="body3" className="mt-2 text-destructive">
                            {
                              (errors?.line_items as LineItemsError)[index]
                                ?.amount?.message
                            }
                          </Text>
                        )}
                      </td>

                      <td className="px-2 flex-col align-top">
                        <Button
                          className="gap-1"
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-5 w-5" />
                          <Text size="body2" weight="medium">
                            Remove
                          </Text>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 border-t pt-4">
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end items-center mt-8">
            <Button size="lg" type="submit">
              Save quote
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
