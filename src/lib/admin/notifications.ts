"use server";

import { db } from "@/db";
import { notifySettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { sendTelegramMessage, telegramCall, testMessage } from "@/lib/notify";
import type { ActionState } from "./result";
import { notifySchema } from "./schemas";
import { done, fail, invalid } from "./server";

export type DetectResult = { ok: true; chatId: string; message: string } | { ok: false; message: string };

async function savedRow() {
  return db.query.notifySettings.findFirst({ where: (t, { eq }) => eq(t.id, 1) });
}

export async function saveNotifySettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = notifySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);

  const saved = await savedRow();
  const { telegramChatId, enabled } = parsed.data;
  const telegramToken = parsed.data.telegramToken || saved?.telegramToken || "";

  if (enabled && !telegramToken) {
    return { ok: false, message: "Adaugă tokenul botului ca să activezi notificările.", fieldErrors: { telegramToken: ["Tokenul lipsește"] } };
  }
  if (enabled && !telegramChatId) {
    return { ok: false, message: "Adaugă chat ID-ul ca să activezi notificările.", fieldErrors: { telegramChatId: ["Chat ID-ul lipsește"] } };
  }

  const values = { telegramToken, telegramChatId, enabled, updatedAt: new Date() };
  await db
    .insert(notifySettings)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: notifySettings.id, set: values });
  return done(enabled ? "Notificările sunt active." : "Setările au fost salvate.", { publicSite: false });
}

/** Uses what's typed in the form, falling back to the saved token, so the test works before saving. */
export async function sendTestNotification(token: string, chatId: string): Promise<ActionState> {
  await requireAdmin();
  const saved = await savedRow();
  const useToken = token.trim() || saved?.telegramToken || "";
  const useChat = chatId.trim() || saved?.telegramChatId || "";
  if (!useToken) return fail("Adaugă tokenul botului.");
  if (!useChat) return fail("Adaugă chat ID-ul (sau apasă „Detectează chat ID”).");

  const result = await sendTelegramMessage(useToken, useChat, testMessage());
  return result.ok ? { ok: true, message: "Mesajul de test a fost trimis. Verifică Telegram." } : fail(`Telegram: ${result.error}`);
}

type Update = {
  message?: { chat: { id: number } };
  edited_message?: { chat: { id: number } };
  channel_post?: { chat: { id: number } };
  my_chat_member?: { chat: { id: number } };
};

export async function detectChatId(token: string): Promise<DetectResult> {
  await requireAdmin();
  const saved = await savedRow();
  const useToken = token.trim() || saved?.telegramToken || "";
  if (!useToken) return { ok: false, message: "Adaugă mai întâi tokenul botului." };

  const result = await telegramCall<Update[]>(useToken, "getUpdates", { limit: 100, timeout: 0 });
  if (!result.ok) return { ok: false, message: `Telegram: ${result.error}` };

  for (const u of result.data.toReversed()) {
    const chat = u.message?.chat ?? u.edited_message?.chat ?? u.channel_post?.chat ?? u.my_chat_member?.chat;
    if (chat) return { ok: true, chatId: String(chat.id), message: `Chat ID găsit: ${chat.id}. Salvează ca să-l păstrezi.` };
  }
  return { ok: false, message: "Nu am găsit niciun mesaj. Trimite orice mesaj botului în Telegram, apoi încearcă din nou." };
}
