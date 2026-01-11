import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import EditPostForm from '@/components/EditPostForm'

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Post
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)

  if (!post) {
    redirect('/admin')
  }

  return <EditPostForm post={post} />
}





