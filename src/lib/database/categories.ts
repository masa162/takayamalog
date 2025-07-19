import { createClient } from '@/lib/supabase/server'

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order: number
  article_type: 'fuzoku' | 'fanza' | 'research'
  color: string
  icon?: string
  created_at: string
  article_count?: number
}

/**
 * 全カテゴリを取得（記事数付き）
 */
export async function getCategories(): Promise<DatabaseCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      *,
      article_count:articles(count)
    `
    )
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('カテゴリ取得エラー:', error)
    return []
  }

  return data.map(category => ({
    ...category,
    article_count: category.article_count?.[0]?.count || 0,
  }))
}

/**
 * カテゴリ別統計を取得
 */
export async function getCategoryStats(): Promise<
  Array<{
    name: string
    slug: string
    count: number
  }>
> {
  const categories = await getCategories()

  return categories.map(category => ({
    name: category.name,
    slug: category.slug,
    count: category.article_count || 0,
  }))
}

/**
 * カテゴリをスラッグで取得
 */
export async function getCategoryBySlug(
  slug: string
): Promise<DatabaseCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`カテゴリ取得エラー: ${error.message}`)
  }

  return data
}
