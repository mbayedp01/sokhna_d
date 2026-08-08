import { z } from "zod";

/** Schéma partagé client (React Hook Form) et serveur (Server Action). */
export const invitationSchema = z
  .object({
    place: z.string().min(1, "Choisis un lieu."),
    customPlace: z.string().max(200, "200 caractères maximum.").optional().or(z.literal("")),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choisis une date."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Choisis une heure."),
    message: z.string().max(600, "Message trop long (600 caractères max).").optional().or(z.literal("")),
  })
  .refine((data) => data.place !== "son-choix" || (data.customPlace?.trim().length ?? 0) > 0, {
    message: "Précise le restaurant que tu as en tête.",
    path: ["customPlace"],
  });

export type InvitationInput = z.infer<typeof invitationSchema>;

export type ActionState = {
  ok: boolean;
  error?: string;
};
