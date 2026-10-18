import { AUTH_COOKIE_NAME, getAppointments, getClients, getPets } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppointmentsClient from "./AppointmentsClient";

export const revalidate = 0;

export default async function AppointmentsPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  try {
    const [appointments, clients, pets] = await Promise.all([
      getAppointments(token),
      getClients(token),
      getPets(token),
    ]);

    const clientById = new Map(clients.map((client) => [client.id, client]));
    const petById = new Map(pets.map((pet) => [pet.id, pet]));

    const schedule = appointments.map((appointment) => {
      const pet = petById.get(appointment.pet_id);
      const client = clientById.get(appointment.client_id);
      return {
        ...appointment,
        pets: pet ? { name: pet.name, species: pet.species, breed: pet.breed } : null,
        clients: client
          ? {
              id: client.id,
              phone_number: client.phone_number,
              users: { first_name: "Client", last_name: client.phone_number || "" },
            }
          : null,
      };
    });

    const clientList = clients.map((client) => ({
      ...client,
      users: { first_name: "Client", last_name: client.phone_number || "" },
    }));

    return (
      <div className="space-y-8">
        <AppointmentsClient initialAppointments={schedule} clients={clientList} pets={pets} />
      </div>
    );
  } catch {
    redirect("/login");
  }
}
