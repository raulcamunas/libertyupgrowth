'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PostInsert, PostUpdate } from '@/types/database'

export async function createPost(data: PostInsert) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autenticado' }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ ...data, user_id: user.id }])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/blog')
  return { data: post }
}

export async function updatePost(id: string, data: PostUpdate) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autenticado' }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)
  return { data: post }
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autenticado' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/blog')
  return { success: true }
}


