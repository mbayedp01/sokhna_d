"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { invitationSchema, type ActionState } from "@/lib/schema";
import { ACTIVITIES, PLACES } from "@/lib/content";
import { formatDateFr } from "@/lib/utils";

/** Échappe le HTML pour éviter toute injection dans l'email. */
function esc(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #e8dcc6;color:#5c6355;font-size:13px;letter-spacing:.06em;text-transform:uppercase;">${esc(label)}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #e8dcc6;color:#2c3128;font-size:15px;font-weight:600;">${esc(value) || "—"}</td>
  </tr>`;
}

/**
 * Server Action : valide la réponse et envoie l'email récapitulatif via Resend.
 * Aucune donnée n'est stockée côté serveur.
 */
export async function submitInvitation(raw: unknown): Promise<ActionState> {
  const parsed = invitationSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Certaines informations manquent. Vérifie tes choix." };
  }
  const data = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "non disponible";
  const userAgent = h.get("user-agent") || "non disponible";
  const submittedAt = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date());

  const placeName = PLACES.find((p) => p.id === data.place)?.name ?? data.place;
  const activityName = ACTIVITIES.find((a) => a.id === data.activity)?.label ?? data.activity;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? "Invitation <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("[invitation] RESEND_API_KEY ou RESEND_TO manquant.");
    return { ok: false, error: "L'envoi est momentanément indisponible. Réessaie dans un instant." };
  }

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;padding:32px;background:#faf8f3;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e8dcc6;border-radius:18px;overflow:hidden;">
    <tr><td style="padding:28px 24px;background:#6b8161;color:#faf8f3;">
      <div style="font-size:12px;letter-spacing:.3em;text-transform:uppercase;opacity:.8;">Réponse reçue</div>
      <div style="font-size:26px;margin-top:6px;">Sokhna a répondu 🌸</div>
    </td></tr>
    <tr><td style="padding:8px 8px 4px;">
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        ${row("Nom", "Sokhna")}
        ${row("Lieu", placeName)}
        ${row("Activité", activityName)}
        ${row("Date", formatDateFr(data.date))}
        ${row("Heure", data.time)}
        ${row("Message", data.message?.trim() || "—")}
        ${row("Soumis le", submittedAt)}
        ${row("Adresse IP", ip)}
        ${row("Navigateur", userAgent)}
      </table>
    </td></tr>
    <tr><td style="padding:18px 24px;color:#5c6355;font-size:12px;font-family:Arial,sans-serif;">
      Message généré automatiquement depuis le site d'invitation.
    </td></tr>
  </table>
</body></html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `🌸 Réponse de Sokhna — ${placeName}, ${formatDateFr(data.date)} à ${data.time}`,
      html,
      text: [
        "Nom : Sokhna",
        `Lieu : ${placeName}`,
        `Activité : ${activityName}`,
        `Date : ${formatDateFr(data.date)}`,
        `Heure : ${data.time}`,
        `Message : ${data.message?.trim() || "—"}`,
        `Soumis le : ${submittedAt}`,
        `Adresse IP : ${ip}`,
        `Navigateur : ${userAgent}`,
      ].join("\n"),
    });

    if (error) {
      console.error("[invitation] Resend:", error);
      return { ok: false, error: "L'envoi a échoué. Réessaie dans un instant." };
    }
    return { ok: true };
  } catch (e) {
    console.error("[invitation] Exception:", e);
    return { ok: false, error: "Une erreur est survenue. Réessaie dans un instant." };
  }
}
