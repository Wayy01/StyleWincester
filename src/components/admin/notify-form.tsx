"use client";

import { useRef, useState, useTransition } from "react";
import { MagnifyingGlass, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { detectChatId, saveNotifySettings, sendTestNotification } from "@/lib/admin/notifications";
import { Button, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

export function NotifyForm({ tokenHint, chatId, enabled }: { tokenHint: string | null; chatId: string; enabled: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  // Once saved the token lives on the server; clear the field so only the masked hint remains.
  const { onSubmit, pending, error } = useAdminAction(saveNotifySettings, () => {
    (formRef.current?.elements.namedItem("telegramToken") as HTMLInputElement).value = "";
  });
  const [chat, setChat] = useState(chatId);
  const [testing, startTest] = useTransition();
  const [detecting, startDetect] = useTransition();

  const token = () => (formRef.current?.elements.namedItem("telegramToken") as HTMLInputElement).value;

  function test() {
    startTest(async () => {
      const result = await sendTestNotification(token(), chat);
      if (result?.ok) toast.success(result.message);
      else toast.error(result?.message ?? "Nu s-a putut trimite.");
    });
  }

  function detect() {
    startDetect(async () => {
      const result = await detectChatId(token());
      if (result.ok) {
        setChat(result.chatId);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-xl gap-6">
      <TextField
        label="Token bot"
        name="telegramToken"
        type="password"
        autoComplete="off"
        spellCheck={false}
        placeholder={tokenHint ? `Salvat · se termină în ${tokenHint}` : "123456789:AA…"}
        error={error("telegramToken")}
        hint={tokenHint ? "Lasă gol ca să păstrezi tokenul salvat." : "Îl primești de la @BotFather."}
      />
      <div className="grid gap-3">
        <TextField
          label="Chat ID"
          name="telegramChatId"
          inputMode="numeric"
          autoComplete="off"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          error={error("telegramChatId")}
          placeholder="123456789"
        />
        <div>
          <Button size="sm" onClick={detect} pending={detecting}>
            {!detecting && <MagnifyingGlass size={16} aria-hidden />}
            Detectează chat ID
          </Button>
        </div>
      </div>
      <Toggle label="Notificări active" hint="Primești un mesaj la fiecare cerere nouă de programare." name="enabled" defaultChecked={enabled} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se salvează…" : "Salvează"}
        </Button>
        <Button onClick={test} pending={testing}>
          {!testing && <PaperPlaneTilt size={16} aria-hidden />}
          Trimite un mesaj de test
        </Button>
      </div>
    </form>
  );
}
