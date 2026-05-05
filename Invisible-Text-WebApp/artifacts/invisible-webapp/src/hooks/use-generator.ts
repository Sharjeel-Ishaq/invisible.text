import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const generateSchema = z.object({
  length: z.coerce.number().min(1).max(1000).default(100),
});

type GenerateRequest = z.infer<typeof generateSchema>;

const generateResponseSchema = z.object({
  text: z.string(),
  length: z.number(),
  message: z.string(),
});

export type { GenerateRequest };

export function useGenerateText() {
  return useMutation({
    mutationFn: async (data: GenerateRequest) => {
      const validated = generateSchema.parse(data);
      
      // We generate the text client-side to ensure it works even if the backend is down.
      // The character \u3164 is the Hangul Filler, which is widely used for invisible text.
      const length = validated.length;
      const text = "\u3164".repeat(length);
      
      // Simulate a small delay for better UX (feedback that something happened)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        text,
        length,
        message: `${length} invisible character${length === 1 ? "" : "s"} generated successfully.`
      };
    },
  });
}
