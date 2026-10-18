"use server";

import { AUTH_COOKIE_NAME, createClient as createClientApi } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewClient(formData: { phoneNumber: string; address?: string }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await createClientApi(token, {
    phone_number: formData.phoneNumber,
    address: formData.address || undefined,
  });

  revalidatePath("/admin/crm");
  return [data];
}
