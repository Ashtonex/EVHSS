import { AUTH_COOKIE_NAME, getInvoices, getClients } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export const revalidate = 0;

export default async function BillingInvoicesPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let invoices: any[] = [];
  let clientList: any[] = [];

  try {
    const [rawInvoices, clients] = await Promise.all([
      getInvoices(token),
      getClients(token),
    ]);

    const clientById = new Map(clients.map((client) => [client.id, client]));

    invoices = rawInvoices.map((inv) => {
      const client = clientById.get(inv.client_id);
      return {
        ...inv,
        clients: client
          ? {
              id: client.id,
              phone_number: client.phone_number,
              users: {
                first_name: "Client",
                last_name: client.phone_number || client.id.substring(0, 8),
              },
            }
          : null,
      };
    });

    clientList = clients.map((client) => ({
      ...client,
      users: {
        first_name: "Client",
        last_name: client.phone_number || client.id.substring(0, 8),
      },
    }));
  } catch {
    // Backend unavailable / transient error — render the page with no data
    // instead of bouncing an already-authenticated admin back to /login.
    invoices = [];
    clientList = [];
  }

  return (
    <div className="space-y-8 pb-12">
      <BillingClient initialInvoices={invoices} clients={clientList} />
    </div>
  );
}
