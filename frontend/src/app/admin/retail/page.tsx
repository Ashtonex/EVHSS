import { AUTH_COOKIE_NAME, getInventoryItems, getClients } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RetailClient from "./RetailClient";

export const revalidate = 0;

export default async function InventoryRetailPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  try {
    const [items, clients] = await Promise.all([getInventoryItems(token), getClients(token)]);

    return (
      <div className="space-y-8">
        <RetailClient initialItems={items} clients={clients} />
      </div>
    );
  } catch {
    // Avoid bouncing the admin to /login on a transient backend error; render with empty data instead.
    return (
      <div className="space-y-8">
        <RetailClient initialItems={[]} clients={[]} />
      </div>
    );
  }
}
