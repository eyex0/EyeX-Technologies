import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Order = Database["public"]["Tables"]["sales_orders"]["Row"];
type OrderInsert = Database["public"]["Tables"]["sales_orders"]["Insert"];
type OrderUpdate = Database["public"]["Tables"]["sales_orders"]["Update"];
type Product = Database["public"]["Tables"]["sales_products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["sales_products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["sales_products"]["Update"];

export interface SalesSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  topProducts: { name: string; revenue: number }[];
}

export const SalesService = {
  async getOrders(organizationId?: string): Promise<Order[]> {
    let query = supabase.from("sales_orders").select("*").order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase.from("sales_orders").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async createOrder(order: OrderInsert): Promise<Order> {
    const { data, error } = await supabase.from("sales_orders").insert(order).select().single();

    if (error) throw error;
    return data;
  },

  async updateOrder(id: string, updates: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from("sales_orders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase.from("sales_orders").delete().eq("id", id);

    if (error) throw error;
  },

  async getProducts(organizationId?: string): Promise<Product[]> {
    let query = supabase
      .from("sales_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase.from("sales_products").insert(product).select().single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from("sales_products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("sales_products").delete().eq("id", id);

    if (error) throw error;
  },

  async getSummary(organizationId?: string): Promise<SalesSummary> {
    const orders = await this.getOrders(organizationId);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed" || o.status === "delivered",
    ).length;

    const revenueByProduct: Record<string, number> = {};
    for (const order of orders) {
      if (order.status === "completed" || order.status === "delivered") {
        revenueByProduct[order.order_number] =
          (revenueByProduct[order.order_number] || 0) + Number(order.total);
      }
    }

    const topProducts = Object.entries(revenueByProduct)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
      topProducts,
    };
  },
};
