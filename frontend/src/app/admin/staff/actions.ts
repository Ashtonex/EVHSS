"use server";

import { AUTH_COOKIE_NAME, createStaffSchedule } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewShift(formData: {
  staffId: string;
  shiftStart: string;
  shiftEnd: string;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await createStaffSchedule(token, {
    staff_id: formData.staffId,
    shift_start: new Date(formData.shiftStart).toISOString(),
    shift_end: new Date(formData.shiftEnd).toISOString(),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/staff");
  return [data];
}
