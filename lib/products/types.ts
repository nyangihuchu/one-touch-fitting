import { type Tables } from "@/lib/supabase/database.types";

export type ResearchProduct = Tables<"research_products">;
export type MyProduct = Tables<"my_products">;

export interface ProductFilterParams {
  category?: string;
  tubeSpec?: string;
  threadSpec?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  totalPages: number;
}
