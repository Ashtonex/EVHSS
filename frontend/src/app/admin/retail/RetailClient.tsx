"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, ShoppingCart, Plus, Package, CreditCard, DollarSign, Trash2 } from "lucide-react";
import { createNewInventoryItem, checkoutPOSTransaction } from "./actions";

interface RetailItem {
  id: string;
  name: string;
  sku?: string | null;
  stock_quantity: number | string;
  unit_price?: number | string | null;
}

interface RetailClientRecord {
  id: string;
  phone_number?: string | null;
  users?: { first_name?: string | null; last_name?: string | null } | null;
}

interface CartLine {
  inventory_item_id: string;
  name: string;
  unit_price: number;
  quantity: number;
}

interface RetailClientProps {
  initialItems: RetailItem[];
  clients: RetailClientRecord[];
}

function clientLabel(client: RetailClientRecord) {
  const first = client.users?.first_name;
  const last = client.users?.last_name;
  if (first || last) return `${first || ""} ${last || ""}`.trim();
  return client.phone_number || "Unknown Client";
}

export default function RetailClient({ initialItems, clients = [] }: RetailClientProps) {
  const [items, setItems] = useState<RetailItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");

  // Checkout terminal state
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  // Add Item dialog state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [addItemError, setAddItemError] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.sku || "").toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  const cartTotal = cart.reduce((acc, line) => acc + line.unit_price * line.quantity, 0);

  const handleAddToCart = () => {
    if (!selectedProductId || quantity <= 0) return;
    const product = items.find((item) => item.id === selectedProductId);
    if (!product) return;

    const price = Number(product.unit_price ?? 0);

    setCart((prev) => {
      const existing = prev.find((line) => line.inventory_item_id === selectedProductId);
      if (existing) {
        return prev.map((line) =>
          line.inventory_item_id === selectedProductId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...prev, { inventory_item_id: product.id, name: product.name, unit_price: price, quantity }];
    });
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveCartLine = (id: string) => {
    setCart((prev) => prev.filter((line) => line.inventory_item_id !== id));
  };

  const handleCompleteSale = async () => {
    setCheckoutError("");
    if (cart.length === 0) {
      setCheckoutError("Add at least one item to the cart.");
      return;
    }
    if (!selectedClientId) {
      setCheckoutError("Please select a client for this sale.");
      return;
    }

    setCheckingOut(true);
    try {
      await checkoutPOSTransaction({
        client_id: selectedClientId,
        payment_method: paymentMethod,
        items: cart.map((line) => ({
          inventory_item_id: line.inventory_item_id,
          quantity: line.quantity,
        })),
      });

      // Reflect stock decrement locally until the server data revalidates.
      setItems((prev) =>
        prev.map((item) => {
          const line = cart.find((l) => l.inventory_item_id === item.id);
          if (!line) return item;
          return { ...item, stock_quantity: Number(item.stock_quantity) - line.quantity };
        }),
      );
      setCart([]);
      setSelectedClientId("");
      setPaymentMethod("cash");
    } catch (err: any) {
      setCheckoutError(err.message || "Failed to complete sale.");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      setAddItemError("Please provide a product name.");
      return;
    }
    setAddingItem(true);
    setAddItemError("");
    try {
      const created = await createNewInventoryItem({
        name: newName,
        sku: newSku || undefined,
        stock_quantity: newStock ? Number(newStock) : undefined,
        unit_price: newPrice ? Number(newPrice) : undefined,
      });
      setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setIsAddItemOpen(false);
      setNewName("");
      setNewSku("");
      setNewStock("");
      setNewPrice("");
    } catch (err: any) {
      setAddItemError(err.message || "Failed to add item.");
    } finally {
      setAddingItem(false);
    }
  };

  const totalStockValue = items.reduce(
    (acc, item) => acc + Number(item.stock_quantity) * Number(item.unit_price ?? 0),
    0,
  );
  const lowStockItems = items.filter((item) => Number(item.stock_quantity) < 5);

  const stats = [
    {
      label: "Total Stock Value",
      value: `$${totalStockValue.toFixed(2)}`,
      desc: "In-store assets value",
      icon: DollarSign,
    },
    { label: "Unique Products", value: items.length.toString(), desc: "Active SKUs tracked", icon: Package },
    {
      label: "Low Stock Warning",
      value: lowStockItems.length.toString(),
      desc: "Items below restock count",
      icon: Package,
      alert: lowStockItems.length > 0,
    },
    { label: "POS Sales Today", value: "$424.50", desc: "6 transactions processed", icon: ShoppingCart },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-evhs-dark font-serif">Inventory & POS Terminal</h1>
          <p className="text-muted-foreground mt-1">Manage retail stocks, veterinary medicine tracking, and POS register sales.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full px-5 border-zinc-300 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Open Register
          </Button>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-evhs hover:bg-evhs-light text-white rounded-full px-6 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold text-evhs-dark">Add Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateItem} className="space-y-4 pt-4">
                {addItemError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                    {addItemError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Hypoallergenic Dog Food"
                    className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. DF-HYPO-001"
                    className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Stock Quantity</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Unit Price ($)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddItemOpen(false)}
                    disabled={addingItem}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-evhs hover:bg-evhs-light text-white" disabled={addingItem}>
                    {addingItem ? "Adding..." : "Add Item"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Inventory & POS Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl relative overflow-hidden">
            {stat.alert && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />}
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.alert ? 'text-red-600 animate-pulse' : 'text-evhs-dark'}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.alert ? 'bg-red-500/10 text-red-600' : 'bg-evhs/5 text-evhs'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Inventory Directory */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden lg:col-span-2">
          <CardHeader className="p-6 bg-zinc-50 border-b border-border/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-serif">Product Directory</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-white outline-none focus:ring-2 focus:ring-evhs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-800">{item.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>SKU: <strong className="text-zinc-600">{item.sku || "N/A"}</strong></span>
                        <span>&bull;</span>
                        <span>Price: <strong className="text-evhs font-semibold">${Number(item.unit_price ?? 0).toFixed(2)}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block font-medium">In Stock</span>
                        <span className={`text-base font-bold ${Number(item.stock_quantity) < 5 ? 'text-red-500' : 'text-zinc-800'}`}>
                          {Number(item.stock_quantity).toFixed(0)} units
                        </span>
                      </div>
                      {Number(item.stock_quantity) < 5 && (
                        <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 uppercase tracking-widest text-[9px]">
                          Restock
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="font-semibold text-zinc-700">No products found</p>
                  <p className="text-sm mt-1">Try a different search, or add a new item.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick POS Terminal Checkout Box */}
        <Card className="border-none shadow-sm rounded-2xl h-fit">
          <CardHeader className="p-6 border-b border-border/50">
            <CardTitle className="text-lg font-serif">Quick Checkout Terminal</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Register Status</span>
              <Badge className="bg-green-500 text-white rounded-full">Active</Badge>
            </div>

            {checkoutError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded-lg text-sm">
                {checkoutError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Select Active Cart Product</label>
              <select
                className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (${Number(item.unit_price ?? 0).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl border-zinc-300 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
              disabled={!selectedProductId}
            >
              <Plus className="w-4 h-4" />
              Add to Active Bill
            </Button>

            {/* Cart Lines */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                {cart.map((line) => (
                  <div key={line.inventory_item_id} className="flex items-center justify-between text-sm bg-zinc-50 rounded-lg p-2.5">
                    <div>
                      <p className="font-medium text-zinc-800">{line.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.quantity} &times; ${line.unit_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-evhs-dark">${(line.unit_price * line.quantity).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCartLine(line.inventory_item_id)}
                        className="text-muted-foreground hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Client</label>
              <select
                className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {clientLabel(client)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Payment Method</label>
              <select
                className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-2 focus:ring-evhs"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="pt-4 border-t border-border flex justify-between font-bold text-evhs-dark text-lg">
              <span>Total Price</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full bg-evhs hover:bg-evhs-light text-white rounded-xl py-3 mt-2 flex items-center justify-center gap-2"
              onClick={handleCompleteSale}
              disabled={checkingOut || cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              {checkingOut ? "Processing..." : "Complete Sale"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
