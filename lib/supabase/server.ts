import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Database } from "./database.types";
import type { ResearchProduct, MyProduct, ProductFilterParams, PaginationParams } from "@/lib/products/types";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getResearchProducts(
  filters: ProductFilterParams,
  pagination: PaginationParams,
  search?: string
): Promise<{ data: ResearchProduct[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('research_products')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`product_name.ilike.%${search}%,model.ilike.%${search}%`)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.tubeSpec) {
    query = query.eq('tube_spec', filters.tubeSpec)
  }
  if (filters.threadSpec) {
    query = query.eq('thread_spec', filters.threadSpec)
  }

  const from = (pagination.page - 1) * pagination.pageSize
  const to = from + pagination.pageSize - 1

  const { data, count } = await query.range(from, to).order('id')

  return { data: data ?? [], count: count ?? 0 }
}

export async function getResearchProductFilterOptions(): Promise<{
  categories: string[]
  tubeSpecs: string[]
  threadSpecs: string[]
}> {
  const supabase = await createClient()

  const [catRes, tubeRes, threadRes] = await Promise.all([
    supabase.from('research_products').select('category').not('category', 'is', null),
    supabase.from('research_products').select('tube_spec').not('tube_spec', 'is', null),
    supabase.from('research_products').select('thread_spec').not('thread_spec', 'is', null),
  ])

  const toSortedUnique = (rows: { [key: string]: string | null }[] | null, key: string) =>
    [...new Set((rows ?? []).map((r) => r[key]).filter(Boolean) as string[])].sort()

  return {
    categories: toSortedUnique(catRes.data, 'category'),
    tubeSpecs: toSortedUnique(tubeRes.data, 'tube_spec'),
    threadSpecs: toSortedUnique(threadRes.data, 'thread_spec'),
  }
}

export async function getMyProducts(
  filters: ProductFilterParams,
  pagination: PaginationParams,
  search?: string
): Promise<{ data: MyProduct[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('my_products')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`product_name.ilike.%${search}%,model.ilike.%${search}%`)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.tubeSpec) {
    query = query.eq('tube_spec', filters.tubeSpec)
  }
  if (filters.threadSpec) {
    query = query.eq('thread_spec', filters.threadSpec)
  }

  const from = (pagination.page - 1) * pagination.pageSize
  const to = from + pagination.pageSize - 1

  const { data, count } = await query.range(from, to).order('id')

  return { data: data ?? [], count: count ?? 0 }
}

export async function getMyProductById(id: number): Promise<MyProduct | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('my_products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null

  return data
}

export async function getMyProductFilterOptions(): Promise<{
  categories: string[]
  tubeSpecs: string[]
  threadSpecs: string[]
}> {
  const supabase = await createClient()

  const [catRes, tubeRes, threadRes] = await Promise.all([
    supabase.from('my_products').select('category').not('category', 'is', null),
    supabase.from('my_products').select('tube_spec').not('tube_spec', 'is', null),
    supabase.from('my_products').select('thread_spec').not('thread_spec', 'is', null),
  ])

  const toSortedUnique = (rows: { [key: string]: string | null }[] | null, key: string) =>
    [...new Set((rows ?? []).map((r) => r[key]).filter(Boolean) as string[])].sort()

  return {
    categories: toSortedUnique(catRes.data, 'category'),
    tubeSpecs: toSortedUnique(tubeRes.data, 'tube_spec'),
    threadSpecs: toSortedUnique(threadRes.data, 'thread_spec'),
  }
}
