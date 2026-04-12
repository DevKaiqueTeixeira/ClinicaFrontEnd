import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient, { type Cliente } from "./DashboardClient";
import { buildApiUrl } from "@/lib/api";

async function fetchAuthenticatedCliente(): Promise<Cliente | null> {
  try {
    const cookieHeader = (await cookies()).toString();

    const response = await fetch(buildApiUrl("/clientes/user"), {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Cliente;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cliente = await fetchAuthenticatedCliente();

  if (!cliente) {
    redirect("/login");
  }

  return <DashboardClient initialCliente={cliente} />;
}
