import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedClienteServer } from "@/app/stores/endpoints/clientes/getAuthenticatedCliente";
import DashboardClient, { type Cliente } from "./DashboardClient";

async function fetchAuthenticatedCliente(): Promise<Cliente | null> {
  try {
    const cookieHeader = (await cookies()).toString();

    const response = await getAuthenticatedClienteServer(cookieHeader);

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
