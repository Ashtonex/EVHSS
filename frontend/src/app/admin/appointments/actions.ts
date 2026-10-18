"use server";

import { AUTH_COOKIE_NAME, createAppointment, updateAppointment } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(id: string, status: string) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await updateAppointment(token, id, status);

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  return [data];
}

export async function createNewAppointment(formData: {
  clientId: string;
  petId: string;
  date: string;
  reason: string;
  status: string;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await createAppointment(token, {
    client_id: formData.clientId,
    pet_id: formData.petId,
    appointment_date: new Date(formData.date).toISOString(),
    reason: formData.reason,
    status: formData.status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  return [data];
}
