import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export { insertContactSchema };

export function useContactForm() {
  return useMutation({
    mutationFn: async (data: InsertContact) => {
      const validated = insertContactSchema.parse(data);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to submit contact form" }));
        throw new Error(err.message || "Failed to submit contact form");
      }

      return res.json();
    },
  });
}
