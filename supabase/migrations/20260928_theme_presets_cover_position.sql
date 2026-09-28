alter table public.businesses
  add column if not exists theme_preset text not null default 'professional_blue',
  add column if not exists background_color text not null default '#F8FAFC',
  add column if not exists surface_color text not null default '#FFFFFF',
  add column if not exists text_color text not null default '#0F172A',
  add column if not exists cover_position text not null default 'center';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_cover_position_check'
  ) then
    alter table public.businesses
      add constraint businesses_cover_position_check
      check (cover_position in ('top','center','bottom'));
  end if;
end $$;
