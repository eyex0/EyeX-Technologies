import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Warehouse = Database["public"]["Tables"]["inventory_warehouses"]["Row"];
type WarehouseInsert = Database["public"]["Tables"]["inventory_warehouses"]["Insert"];
type Supplier = Database["public"]["Tables"]["inventory_suppliers"]["Row"];
type SupplierInsert = Database["public"]["Tables"]["inventory_suppliers"]["Insert"];
type Product = Database["public"]["Tables"]["inventory_products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["inventory_products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["inventory_products"]["Update"];

export interface InventorySummary {
  totalProducts: number;
  totalValue: number;
  lowStockAlerts: number;
  totalWarehouses: number;
  totalSuppliers: number;
}

export const InventoryService = {
  async getWarehouses(organizationId?: string): Promise<Warehouse[]> {
    let query = supabase
      .from("inventory_warehouses")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createWarehouse(warehouse: WarehouseInsert): Promise<Warehouse> {
    const { data, error } = await supabase
      .from("inventory_warehouses")
      .insert(warehouse)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSuppliers(organizationId?: string): Promise<Supplier[]> {
    let query = supabase
      .from("inventory_suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createSupplier(supplier: SupplierInsert): Promise<Supplier> {
    const { data, error } = await supabase
      .from("inventory_suppliers")
      .insert(supplier)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProducts(organizationId?: string): Promise<Product[]> {
    let query = supabase
      .from("inventory_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("inventory_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from("inventory_products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from("inventory_products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from("inventory_products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getSummary(organizationId?: string): Promise<InventorySummary> {
    const products = await this.getProducts(organizationId);
    const warehouses = await this.getWarehouses(organizationId);
    const suppliers = await this.getSuppliers(organizationId);

    const totalValue = products.reduce(
      (sum, p) => sum + Number(p.unit_price) * p.quantity,
      0
    );
    const lowStockAlerts = products.filter((p) => p.quantity <= p.reorder_level).length;

    return {
      totalProducts: products.length,
      totalValue,
      lowStockAlerts,
      totalWarehouses: warehouses.length,
      totalSuppliers: suppliers.length,
    };
  },
};
