"use server";

import { AUTH_COOKIE_NAME, createMedicalRecord, getCurrentUser } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewMedicalRecord(formData: {
  petId: string;
  notes: string;
  appointmentId?: string;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const currentUser = await getCurrentUser(token);

  const data = await createMedicalRecord(token, {
    pet_id: formData.petId,
    vet_id: currentUser.id,
    appointment_id: formData.appointmentId || null,
    notes: formData.notes,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/medical");
  return [data];
}
