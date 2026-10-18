"use server";

import { AUTH_COOKIE_NAME, createGroomingRecord, getCurrentUser } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewGroomingRecord(formData: {
  petId: string;
  servicesProvided: string;
  groomerNotes: string;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const currentUser = await getCurrentUser(token);

  const data = await createGroomingRecord(token, {
    pet_id: formData.petId,
    groomer_id: currentUser.id,
    appointment_date: new Date().toISOString(),
    services_provided: formData.servicesProvided,
    groomer_notes: formData.groomerNotes,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/grooming");
  return [data];
}
