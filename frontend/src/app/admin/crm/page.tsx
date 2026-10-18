import { AUTH_COOKIE_NAME, getClients, getPets, type ApiClient, type ApiPet } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CRMClient from "./CRMClient";

export const revalidate = 0;

export default async function CRMPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let clients: ApiClient[] = [];
  let pets: ApiPet[] = [];

  try {
    const [clientsData, petsData] = await Promise.all([getClients(token), getPets(token)]);
    clients = clientsData;
    pets = petsData;
  } catch (error) {
    console.error("Error fetching CRM data:", error);
  }

  const petsByClient = new Map<string, ApiPet[]>();
  for (const pet of pets) {
    const list = petsByClient.get(pet.client_id) || [];
    list.push(pet);
    petsByClient.set(pet.client_id, list);
  }

  const clientList = clients.map((client) => ({
    ...client,
    pets: petsByClient.get(client.id) || [],
  }));

  return (
    <div className="space-y-8 pb-12">
      <CRMClient initialClients={clientList} />
    </div>
  );
}
