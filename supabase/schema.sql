-- 청첩장 방명록 스키마
-- Supabase SQL Editor에서 이 파일을 실행하세요.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 20),
  content text not null check (char_length(btrim(content)) between 1 and 300),
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook_secrets (
  message_id uuid primary key references public.guestbook_messages(id) on delete cascade,
  password_hash text not null
);

alter table public.guestbook_messages enable row level security;
alter table public.guestbook_secrets enable row level security;

drop policy if exists "Anyone can read guestbook messages" on public.guestbook_messages;
create policy "Anyone can read guestbook messages"
  on public.guestbook_messages
  for select
  to anon, authenticated
  using (true);

grant select on public.guestbook_messages to anon, authenticated;
revoke all on public.guestbook_secrets from anon, authenticated;

create or replace function public.create_guestbook_message(
  p_name text,
  p_content text,
  p_password text
)
returns public.guestbook_messages
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_name text := btrim(p_name);
  v_content text := btrim(p_content);
  v_password text := btrim(p_password);
  v_row public.guestbook_messages;
begin
  if v_name is null or v_name = '' or char_length(v_name) > 20 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  if v_content is null or v_content = '' or char_length(v_content) > 300 then
    raise exception 'invalid_content' using errcode = '22023';
  end if;

  if v_password is null or v_password = '' or char_length(v_password) > 20 then
    raise exception 'invalid_password' using errcode = '22023';
  end if;

  insert into public.guestbook_messages (name, content)
  values (v_name, v_content)
  returning * into v_row;

  insert into public.guestbook_secrets (message_id, password_hash)
  values (v_row.id, extensions.crypt(v_password, extensions.gen_salt('bf')));

  return v_row;
end;
$$;

create or replace function public.delete_guestbook_message(
  p_id uuid,
  p_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
begin
  select password_hash into stored_hash
  from public.guestbook_secrets
  where message_id = p_id;

  if stored_hash is null then
    return false;
  end if;

  if stored_hash = extensions.crypt(btrim(p_password), stored_hash) then
    delete from public.guestbook_messages where id = p_id;
    return true;
  end if;

  return false;
end;
$$;

revoke all on function public.create_guestbook_message(text, text, text) from public;
revoke all on function public.delete_guestbook_message(uuid, text) from public;
grant execute on function public.create_guestbook_message(text, text, text) to anon, authenticated;
grant execute on function public.delete_guestbook_message(uuid, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guestbook_messages'
  ) then
    alter publication supabase_realtime add table public.guestbook_messages;
  end if;
end $$;
