"use server";

import { AUTH_COOKIE_NAME, createInventoryItem, processPOSTransaction } from "@/lib/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewInventoryItem(formData: {
  name: string;
  sku?: string;
  stock_quantity?: number;
  unit_price?: number;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await createInventoryItem(token, {
    name: formData.name,
    sku: formData.sku || undefined,
    stock_quantity: formData.stock_quantity,
    unit_price: formData.unit_price,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/retail");
  return data;
}

export async function checkoutPOSTransaction(payload: {
  client_id: string;
  payment_method: string;
  items: Array<{ inventory_item_id: string; quantity: number }>;
}) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");

  const data = await processPOSTransaction(token, payload);

  revalidatePath("/admin");
  revalidatePath("/admin/retail");
  return data;
}
