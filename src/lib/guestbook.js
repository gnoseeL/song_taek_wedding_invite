import { isSupabaseConfigured, supabase } from '@/lib/supabase'

const NOT_CONFIGURED = '방명록 설정이 완료되지 않았습니다.'

export function mapGuestbookMessage(row) {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    createdAt: row.created_at,
  }
}

export async function listGuestbookMessages() {
  if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED)

  const { data, error } = await supabase
    .from('guestbook_messages')
    .select('id, name, content, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapGuestbookMessage)
}

export async function createGuestbookMessage({ name, content, password }) {
  if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED)

  const { data, error } = await supabase.rpc('create_guestbook_message', {
    p_name: name,
    p_content: content,
    p_password: password,
  })

  if (error) throw error

  const row = Array.isArray(data) ? data[0] : data
  if (!row) throw new Error('메시지 작성에 실패했습니다.')

  return mapGuestbookMessage(row)
}

export async function deleteGuestbookMessage(id, password) {
  if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED)

  const { data, error } = await supabase.rpc('delete_guestbook_message', {
    p_id: id,
    p_password: password,
  })

  if (error) throw error
  return Boolean(data)
}

export function subscribeGuestbookMessages(onChange) {
  if (!isSupabaseConfigured) return () => {}

  const channel = supabase
    .channel('guestbook-messages')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'guestbook_messages' },
      onChange,
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
