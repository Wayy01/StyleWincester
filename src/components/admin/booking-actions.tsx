"use client";

import { useTransition } from "react";
import { NotePencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import type { Booking, BookingStatus } from "@/db/schema";
import { deleteBooking, saveBookingNote, setBookingStatus } from "@/lib/admin/bookings";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/admin/constants";
import { ConfirmDelete, DrawerFooter, DrawerTrigger } from "./modal";
import { Button, TextArea } from "./ui";
import { useAdminAction } from "./use-admin-action";

function NoteForm({ booking, close }: { booking: Pick<Booking, "id" | "name" | "adminNote">; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveBookingNote, close);
  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <input type="hidden" name="id" value={booking.id} />
      <div className="flex-1 p-6 sm:p-8">
        <TextArea
          label={`Notă internă despre ${booking.name}`}
          name="adminNote"
          rows={8}
          defaultValue={booking.adminNote}
          error={error("adminNote")}
          hint="Vizibilă doar în panou."
          autoFocus
        />
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          Salvează nota
        </Button>
      </DrawerFooter>
    </form>
  );
}

export function BookingActions({ booking }: { booking: Pick<Booking, "id" | "name" | "status" | "adminNote"> }) {
  const [pending, startTransition] = useTransition();

  function changeStatus(status: BookingStatus) {
    startTransition(async () => {
      const result = await setBookingStatus(booking.id, status);
      if (result?.ok) toast.success(result.message);
      else toast.error(result?.message ?? "Eroare");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`status-${booking.id}`}>
        Status pentru {booking.name}
      </label>
      <select
        id={`status-${booking.id}`}
        value={booking.status}
        disabled={pending}
        onChange={(e) => changeStatus(e.target.value as BookingStatus)}
        className="h-8 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-2.5 text-[0.8125rem] font-medium focus:border-oxblood focus:outline-none focus-visible:outline-1 focus-visible:outline-oxblood-2 disabled:opacity-50"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      <DrawerTrigger
        title="Notă internă"
        eyebrow="Programare"
        size="md"
        trigger={(open) => (
          <Button size="sm" onClick={open}>
            <NotePencil size={16} aria-hidden />
            {booking.adminNote ? "Editează nota" : "Adaugă notă"}
          </Button>
        )}
        render={(close) => <NoteForm booking={booking} close={close} />}
      />

      <ConfirmDelete
        id={booking.id}
        action={deleteBooking}
        title="Ștergi programarea?"
        description={`Cererea de la ${booking.name} va fi ștearsă definitiv. Dacă vrei doar să o închizi, schimbă statusul.`}
        trigger={(open) => (
          <Button size="sm" variant="danger" onClick={open} aria-label={`Șterge programarea de la ${booking.name}`}>
            <Trash size={16} aria-hidden />
          </Button>
        )}
      />
    </div>
  );
}
