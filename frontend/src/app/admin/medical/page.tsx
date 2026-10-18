import { AUTH_COOKIE_NAME, getMedicalRecords, getPets, getVaccinations } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MedicalClient from "./MedicalClient";

export const revalidate = 0;

export default async function MedicalRecordsPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect("/login");

  let records: Awaited<ReturnType<typeof getMedicalRecords>> = [];
  let pets: Awaited<ReturnType<typeof getPets>> = [];
  let vaccinations: Awaited<ReturnType<typeof getVaccinations>> = [];

  try {
    [records, pets, vaccinations] = await Promise.all([
      getMedicalRecords(token),
      getPets(token),
      getVaccinations(token),
    ]);
  } catch (error) {
    console.error("Error fetching medical records:", error);
  }

  const petById = new Map(pets.map((pet) => [pet.id, pet]));

  const recordsView = records
    .map((rec) => {
      const pet = petById.get(rec.pet_id);
      return {
        ...rec,
        pets: pet ? { name: pet.name, species: pet.species, breed: pet.breed, date_of_birth: (pet as any).date_of_birth } : null,
      };
    })
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const vaccinationsView = vaccinations
    .map((vac) => {
      const pet = petById.get(vac.pet_id);
      return {
        ...vac,
        pets: pet ? { name: pet.name, species: pet.species, breed: pet.breed } : null,
      };
    })
    .sort((a, b) => new Date(b.date_administered || 0).getTime() - new Date(a.date_administered || 0).getTime());

  const consultingVetCount = new Set(records.map((rec) => rec.vet_id).filter(Boolean)).size;

  return (
    <MedicalClient
      initialRecords={recordsView}
      pets={pets}
      vaccinations={vaccinationsView}
      consultingVetCount={consultingVetCount}
    />
  );
}
