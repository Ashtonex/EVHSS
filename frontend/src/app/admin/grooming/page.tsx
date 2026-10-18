import { AUTH_COOKIE_NAME, getGroomingRecords, getPets } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GroomingClient from "./GroomingClient";

export const revalidate = 0;

export default async function GroomingLogsPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let logs: any[] = [];
  let pets: any[] = [];

  try {
    const [records, petsList] = await Promise.all([
      getGroomingRecords(token),
      getPets(token),
    ]);

    const petById = new Map(petsList.map((pet) => [pet.id, pet]));
    pets = petsList;

    logs = records
      .map((record) => {
        const pet = petById.get(record.pet_id);
        return {
          ...record,
          pets: pet ? { name: pet.name, species: pet.species, breed: pet.breed } : null,
        };
      })
      .sort((a, b) => {
        const dateA = a.appointment_date ? new Date(a.appointment_date).getTime() : 0;
        const dateB = b.appointment_date ? new Date(b.appointment_date).getTime() : 0;
        return dateB - dateA;
      });
  } catch {
    // Transient backend error — render with an empty list instead of bouncing
    // the admin to /login (they already have a valid session cookie).
    logs = [];
    pets = [];
  }

  return (
    <div className="space-y-8 pb-12">
      <GroomingClient initialRecords={logs} pets={pets} />
    </div>
  );
}
