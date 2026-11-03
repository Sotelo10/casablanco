-- =============================================================================
-- CASA LEBLANC · ESQUEMA DE SUPABASE
-- =============================================================================
-- Ejecuta este archivo completo en el SQL Editor de tu proyecto de Supabase.
-- Es idempotente: puedes volver a ejecutarlo tras cambiarlo sin romper nada.
--
-- MODELO DE SEGURIDAD
-- -----------------------------------------------------------------------------
-- El sitio es estático: el navegador habla directamente con Supabase usando la
-- clave `anon`. Esa clave es pública por diseño, así que TODA la seguridad vive
-- aquí: RLS, políticas, constraints y triggers. La base de datos es el servidor.
--
--   · Contenido (galería, servicios, lugares, reseñas) → sólo LECTURA pública.
--   · Solicitudes de reserva                            → sólo INSERT anónimo.
--     Nadie puede leerlas, modificarlas ni borrarlas con la clave pública.
--
-- Las solicitudes se consultan desde el panel de Supabase (Table Editor), que
-- usa tu sesión de administrador. Por eso el sitio NO necesita `service_role`.
--
-- NOTA sobre la tabla `property`: existía en una versión anterior de este
-- archivo y ya no se crea, porque ningún punto del sitio la leía (los datos del
-- inmueble viven en `src/config/site.ts`). Si la ejecutaste antes, sigue en tu
-- base de datos sin molestar; para quitarla:  drop table public.property;
-- =============================================================================


-- =============================================================================
-- 1. TABLAS
-- =============================================================================

-- ------------------------------------------------------------------ Galería --
-- `storage_path` es el nombre del archivo dentro de `src/assets/property/`
-- (p. ej. `exterior-01.jpg`) o una URL absoluta a Supabase Storage.
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  storage_path text    not null,
  alt          text    not null,
  category     text    not null,   -- exterior | sala | comedor | cocina | ...
  width        integer,
  height       integer,
  orientation  text    not null default 'landscape',  -- landscape|portrait|square
  label        text    not null,
  caption      text,
  featured     boolean not null default false,
  position     integer not null default 0
);

create index if not exists gallery_images_position_idx
  on public.gallery_images (position);

-- ---------------------------------------------------------------- Servicios --
create table if not exists public.amenities (
  id        text    primary key,   -- wifi, piscina, estacionamiento, ...
  name      text    not null,
  group_id  text    not null,      -- esenciales | cocina | confort | ...
  icon      text    not null default 'check',
  detail    text,
  confirmed boolean not null default false,
  position  integer not null default 0
);

create index if not exists amenities_position_idx
  on public.amenities (position);

-- --------------------------------------------------------- Lugares cercanos --
create table if not exists public.nearby_places (
  id          text    primary key,
  name        text    not null,
  description text    not null,
  distance    text,                -- '15 min en auto' (texto libre)
  category    text    not null,    -- naturaleza | gastronomia | turismo | ...
  image       text,
  icon        text    not null default 'map-pin',
  position    integer not null default 0
);

create index if not exists nearby_places_position_idx
  on public.nearby_places (position);

-- ------------------------------------------------------------------ Reseñas --
-- `approved = false` mientras no la revises: sólo las aprobadas son visibles.
create table if not exists public.reviews (
  id           uuid     primary key default gen_random_uuid(),
  guest_name   text     not null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text     not null,
  source       text     not null default 'directo',  -- airbnb|booking|google|directo|otro
  location     text,
  published_at date     not null default current_date,
  approved     boolean  not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists reviews_approved_idx
  on public.reviews (approved, published_at desc);

-- ------------------------------------------- Solicitudes de reserva/contacto --
-- Una sola tabla cubre reserva y contacto: el formulario del sitio es el mismo
-- y `message` recoge la consulta libre. No hace falta una tabla de "mensajes".
create table if not exists public.booking_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  check_in   date,
  check_out  date,
  guests     integer,
  message    text,
  status     text not null default 'nueva',  -- nueva | respondida | cerrada
  created_at timestamptz not null default now()
);

create index if not exists booking_inquiries_created_idx
  on public.booking_inquiries (created_at desc);

create index if not exists booking_inquiries_status_idx
  on public.booking_inquiries (status, created_at desc);

-- Índice que sostiene el control de repeticiones del trigger de más abajo.
create index if not exists booking_inquiries_contact_idx
  on public.booking_inquiries (created_at desc, phone, email);


-- =============================================================================
-- 2. VALIDACIÓN EN SERVIDOR (constraints)
-- =============================================================================
-- La validación del navegador es sólo comodidad: cualquiera puede llamar a la
-- API REST directamente. Estas reglas son las que de verdad protegen la tabla.
-- `add constraint if not exists` no existe en Postgres, así que se recrean.

alter table public.booking_inquiries
  drop constraint if exists booking_inquiries_name_len,
  drop constraint if exists booking_inquiries_phone_len,
  drop constraint if exists booking_inquiries_phone_digits,
  drop constraint if exists booking_inquiries_email_format,
  drop constraint if exists booking_inquiries_guests_range,
  drop constraint if exists booking_inquiries_message_len,
  drop constraint if exists booking_inquiries_dates_order,
  drop constraint if exists booking_inquiries_dates_pair,
  drop constraint if exists booking_inquiries_stay_length,
  drop constraint if exists booking_inquiries_status_values;

alter table public.booking_inquiries
  -- Nombre: entre 2 y 120 caracteres útiles.
  add constraint booking_inquiries_name_len
    check (char_length(btrim(name)) between 2 and 120),

  -- Teléfono: longitud razonable y al menos 6 dígitos reales.
  add constraint booking_inquiries_phone_len
    check (char_length(btrim(phone)) between 6 and 32),
  add constraint booking_inquiries_phone_digits
    check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 6 and 20),

  -- Correo: opcional, pero si viene debe tener forma de correo.
  add constraint booking_inquiries_email_format
    check (
      email is null
      or (char_length(email) <= 160 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$')
    ),

  -- Huéspedes: un grupo real, no un número absurdo.
  add constraint booking_inquiries_guests_range
    check (guests is null or guests between 1 and 30),

  -- Mensaje: suficiente para una consulta, no para un volcado de spam.
  add constraint booking_inquiries_message_len
    check (message is null or char_length(message) <= 2000),

  -- Fechas: coherentes entre sí y con una estancia plausible.
  add constraint booking_inquiries_dates_pair
    check (check_out is null or check_in is not null),
  add constraint booking_inquiries_dates_order
    check (check_in is null or check_out is null or check_out > check_in),
  add constraint booking_inquiries_stay_length
    check (check_in is null or check_out is null or (check_out - check_in) <= 365),

  -- Estado: sólo los tres valores del flujo de trabajo.
  add constraint booking_inquiries_status_values
    check (status in ('nueva', 'respondida', 'cerrada'));


-- =============================================================================
-- 3. NORMALIZACIÓN, FECHAS Y LÍMITE DE ENVÍOS (trigger)
-- =============================================================================
-- Lo que no cabe en un `check` inmutable (fechas relativas a hoy, recuento de
-- envíos recientes) se resuelve aquí. `security definer` es imprescindible:
-- `anon` no puede leer la tabla, pero la función sí necesita contar filas.
--
-- Los mensajes de error son tokens internos (`rate_limit`, `check_in_past`…);
-- la interfaz nunca los muestra tal cual, los traduce a un texto humano.

create or replace function public.booking_inquiries_guard()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent_count integer;
begin
  -- --- Normalización: quita caracteres no imprimibles y espacios sobrantes ---
  new.name := btrim(regexp_replace(
    regexp_replace(new.name, '[^[:print:]]', ' ', 'g'), '[[:space:]]+', ' ', 'g'));

  new.phone := btrim(regexp_replace(
    regexp_replace(new.phone, '[^[:print:]]', ' ', 'g'), '[[:space:]]+', ' ', 'g'));

  new.email := nullif(btrim(lower(coalesce(new.email, ''))), '');

  -- En el mensaje se conservan los saltos de línea: son parte del texto.
  new.message := nullif(btrim(regexp_replace(
    coalesce(new.message, ''), '[^[:print:][:space:]]', '', 'g')), '');

  -- --- Fechas relativas a hoy (no pueden ir en un CHECK inmutable) ---------
  -- Un día de margen absorbe la diferencia de zona horaria del visitante.
  if new.check_in is not null and new.check_in < current_date - 1 then
    raise exception 'check_in_past' using errcode = 'P0001';
  end if;

  if new.check_in is not null and new.check_in > current_date + 730 then
    raise exception 'check_in_too_far' using errcode = 'P0001';
  end if;

  -- --- Límite de envíos por contacto --------------------------------------
  -- Máximo 3 solicitudes por hora desde el mismo teléfono o correo. Se limita
  -- por contacto y no globalmente: así nadie puede bloquear el formulario al
  -- resto de visitantes inundándolo.
  select count(*)
    into recent_count
    from public.booking_inquiries b
   where b.created_at > now() - interval '1 hour'
     and (
       b.phone = new.phone
       or (new.email is not null and b.email = new.email)
     );

  if recent_count >= 3 then
    raise exception 'rate_limit' using errcode = 'P0001';
  end if;

  -- El estado inicial siempre lo decide la base de datos.
  new.status := 'nueva';
  new.created_at := now();

  return new;
end;
$$;

-- La función sólo debe ejecutarse desde el trigger, nunca vía RPC.
revoke all on function public.booking_inquiries_guard() from public, anon, authenticated;

drop trigger if exists booking_inquiries_guard_trg on public.booking_inquiries;
create trigger booking_inquiries_guard_trg
  before insert on public.booking_inquiries
  for each row execute function public.booking_inquiries_guard();


-- =============================================================================
-- 4. ROW LEVEL SECURITY
-- =============================================================================
alter table public.gallery_images    enable row level security;
alter table public.amenities         enable row level security;
alter table public.nearby_places     enable row level security;
alter table public.reviews           enable row level security;
alter table public.booking_inquiries enable row level security;

-- ---------------------------------------------------------------- Políticas --
-- Sin política = denegado. Sólo se declara lo estrictamente necesario.

drop policy if exists "lectura publica de la galeria"  on public.gallery_images;
drop policy if exists "lectura publica de servicios"   on public.amenities;
drop policy if exists "lectura publica de lugares"     on public.nearby_places;
drop policy if exists "lectura de resenas aprobadas"   on public.reviews;
drop policy if exists "alta de solicitud"              on public.booking_inquiries;
-- Nombres de la versión anterior del esquema, por si ya la ejecutaste.
drop policy if exists "contenido publico: gallery_images" on public.gallery_images;
drop policy if exists "contenido publico: amenities"      on public.amenities;
drop policy if exists "contenido publico: nearby_places"  on public.nearby_places;
drop policy if exists "reseñas aprobadas"                 on public.reviews;
drop policy if exists "crear consulta"                    on public.booking_inquiries;

-- Contenido del sitio: lectura para cualquiera.
create policy "lectura publica de la galeria"
  on public.gallery_images for select to anon, authenticated using (true);

create policy "lectura publica de servicios"
  on public.amenities for select to anon, authenticated using (true);

create policy "lectura publica de lugares"
  on public.nearby_places for select to anon, authenticated using (true);

-- Reseñas: sólo las que has aprobado. Las pendientes no salen de la base.
create policy "lectura de resenas aprobadas"
  on public.reviews for select to anon, authenticated using (approved = true);

-- Solicitudes: sólo se pueden crear, y siempre en estado 'nueva'.
-- No hay política de select/update/delete: quedan denegadas para la clave
-- pública, así que nadie puede leer, alterar ni borrar los datos de un cliente.
create policy "alta de solicitud"
  on public.booking_inquiries for insert to anon, authenticated
  with check (status = 'nueva');


-- =============================================================================
-- 5. PERMISOS DE TABLA (defensa en profundidad)
-- =============================================================================
-- RLS ya bloquea todo lo no declarado. Retirar además los permisos SQL evita
-- que una política futura demasiado abierta exponga datos por accidente.

revoke all on public.gallery_images    from anon, authenticated;
revoke all on public.amenities         from anon, authenticated;
revoke all on public.nearby_places     from anon, authenticated;
revoke all on public.reviews           from anon, authenticated;
revoke all on public.booking_inquiries from anon, authenticated;

grant select on public.gallery_images to anon, authenticated;
grant select on public.amenities      to anon, authenticated;
grant select on public.nearby_places  to anon, authenticated;
grant select on public.reviews        to anon, authenticated;

-- Insertar y nada más. El sitio nunca pide la fila de vuelta, así que no
-- necesita permiso de lectura para guardar una solicitud.
grant insert on public.booking_inquiries to anon, authenticated;


-- =============================================================================
-- 6. COMPROBACIÓN RÁPIDA
-- =============================================================================
-- Ejecuta esto después del script. Las cinco tablas deben aparecer con
-- `rowsecurity = true`.
--
--   select tablename, rowsecurity
--     from pg_tables
--    where schemaname = 'public'
--    order by tablename;
--
-- Y estas son las políticas que deberías ver (y ninguna más):
--
--   select tablename, policyname, cmd, roles
--     from pg_policies
--    where schemaname = 'public'
--    order by tablename, policyname;
-- =============================================================================
