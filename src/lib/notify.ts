import "server-only";
import { db } from "@/db";
import type { Booking } from "@/db/schema";
import { lengthLabel, timeLabel } from "@/lib/admin/constants";

const API = "https://api.telegram.org";
const TIMEOUT_MS = 5000;

export type NotifyBooking = Pick<
  Booking,
  "name" | "phone" | "instagram" | "serviceLabel" | "preferredDate" | "preferredTime" | "hairLength" | "message" | "locale"
>;

type TelegramReply<T> = { ok: boolean; description?: string; result?: T };
export type TelegramResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

const escapeHtml = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Never throws and never logs the token (it sits in the request URL). */
export async function telegramCall<T>(token: string, method: string, body?: Record<string, unknown>): Promise<TelegramResult<T>> {
  try {
    const res = await fetch(`${API}/bot${encodeURIComponent(token)}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as TelegramReply<T> | null;
    if (!json?.ok) return { ok: false, error: json?.description ?? `Telegram a răspuns cu eroarea ${res.status}.` };
    return { ok: true, data: json.result as T };
  } catch (e) {
    const timedOut = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
    return { ok: false, error: timedOut ? "Telegram nu a răspuns în 5 secunde." : "Nu m-am putut conecta la Telegram." };
  }
}

export function sendTelegramMessage(token: string, chatId: string, html: string) {
  return telegramCall(token, "sendMessage", {
    chat_id: chatId,
    text: html,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  });
}

function bookingMessage(b: NotifyBooking) {
  const when = [b.preferredDate, b.preferredTime && timeLabel(b.preferredTime)].filter(Boolean).join(", ");
  const lines: [string, string][] = [
    ["Nume", b.name],
    ["Telefon", b.phone],
    ["Instagram", b.instagram ? `@${b.instagram.replace(/^@+/, "")}` : ""],
    ["Serviciu", b.serviceLabel],
    ["Data dorită", when],
    ["Lungime păr", b.hairLength && lengthLabel(b.hairLength)],
    ["Mesaj", b.message],
    ["Limba", b.locale.toUpperCase()],
  ];
  const body = lines
    .filter(([, v]) => v)
    .map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v)}`)
    .join("\n");
  const site = process.env.SITE_URL?.replace(/\/+$/, "");
  const link = site ? `\n\n<a href="${escapeHtml(site)}/admin/bookings">Deschide programările</a>` : "";
  return `<b>Programare nouă</b>\n\n${body}${link}`;
}

export function testMessage() {
  return "<b>Style Wincester</b>\nNotificările funcționează. Aici vei primi cererile noi de programare.";
}

/** Announces a new booking on Telegram. Safe to await: it never throws. */
export async function notifyNewBooking(booking: NotifyBooking) {
  try {
    const row = await db.query.notifySettings.findFirst({ where: (t, { eq }) => eq(t.id, 1) });
    if (!row?.enabled || !row.telegramToken || !row.telegramChatId) return;
    const result = await sendTelegramMessage(row.telegramToken, row.telegramChatId, bookingMessage(booking));
    if (!result.ok) console.error("telegram notification failed:", result.error);
  } catch (e) {
    console.error("telegram notification failed:", e instanceof Error ? e.message : e);
  }
}

