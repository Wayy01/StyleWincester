import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Autentificare" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src="/media/photo/night-portrait.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-[50%_30%] opacity-90"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="display text-[clamp(4rem,8vw,7rem)] text-bone">Style Wincester</p>
          <p className="a-eyebrow mt-8 text-bone/75">Hair artist studio · Chișinău</p>
        </div>
      </section>

      <section className="flex items-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <p className="a-h2 lg:hidden">Style Wincester</p>
          <p className="a-eyebrow mt-10 text-oxblood lg:mt-0">Administrare</p>
          <h1 className="a-title mt-2">Bine ai revenit</h1>
          <p className="mb-10 mt-5 text-muted">Intră cu emailul și parola de administrator.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
