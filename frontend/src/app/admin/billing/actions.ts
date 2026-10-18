"use server";

import { AUTH_COOKIE_NAME, createInvoice } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewInvoice(formData: {
  clientId: string;
  totalAmount: number;
  status: string;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await createInvoice(token, {
    client_id: formData.clientId,
    total_amount: formData.totalAmount,
    status: formData.status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/billing");
  return [data];
}
