/**
 * TIPOS DE LA BASE DE DATOS
 * =============================================================================
 * Reflejan `supabase/schema.sql`. Son la única fuente de verdad de las
 * respuestas de Supabase: los repositorios no usan `any` en ningún punto.
 *
 * REGENERARLOS CUANDO CAMBIE EL ESQUEMA
 * -----------------------------------------------------------------------------
 *   SUPABASE_PROJECT_ID=xxxxxxxx npm run types:supabase
 *
 * (el identificador es el `xxxxxxxx` de tu Project URL). Equivale a:
 *
 *   npx supabase gen types typescript --project-id <id> --schema public \
 *     > src/lib/supabase/types.ts
 *
 * El archivo generado exporta también `Database`, así que el resto del código
 * sigue compilando sin cambios. Vuelve a añadir los alias del final si los
 * necesitas (`Tables<'reviews'>` cumple la misma función).
 */

/*
 * Nota: aquí se usan alias de tipo (`type X = { … }`) y no interfaces. El
 * genérico de `createClient` espera formas con índice implícito, que las
 * interfaces de TypeScript no tienen: con `interface` la tabla se resuelve como
 * `never` y los inserts dejan de comprobarse. Los tipos que genera la CLI de
 * Supabase siguen el mismo criterio.
 */

/** Columnas generadas por la base de datos: nunca se envían al insertar. */
type Generated = 'id' | 'created_at';

export type GalleryImageRow = {
  id: string;
  storage_path: string;
  alt: string;
  category: string;
  width: number | null;
  height: number | null;
  orientation: string;
  label: string;
  caption: string | null;
  featured: boolean;
  position: number;
};

export type AmenityRow = {
  id: string;
  name: string;
  group_id: string;
  icon: string;
  detail: string | null;
  confirmed: boolean;
  position: number;
};

export type NearbyPlaceRow = {
  id: string;
  name: string;
  description: string;
  distance: string | null;
  category: string;
  image: string | null;
  icon: string;
  position: number;
};

export type ReviewRow = {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  source: string;
  location: string | null;
  published_at: string;
  approved: boolean;
  created_at: string;
};

/** Estados del flujo de trabajo de una solicitud (`check` en el esquema). */
export type BookingInquiryStatus = 'nueva' | 'respondida' | 'cerrada';

export type BookingInquiryRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  message: string | null;
  status: BookingInquiryStatus;
  created_at: string;
};

/**
 * Lo único que el navegador puede escribir. `id`, `status` y `created_at` los
 * fija la base de datos (trigger `booking_inquiries_guard`), no el cliente.
 */
export type BookingInquiryInsert = Omit<BookingInquiryRow, Generated | 'status'>;

export type Database = {
  public: {
    Tables: {
      gallery_images: {
        Row: GalleryImageRow;
        Insert: Omit<GalleryImageRow, 'id'> & { id?: string };
        Update: Partial<GalleryImageRow>;
        Relationships: [];
      };
      amenities: {
        Row: AmenityRow;
        Insert: AmenityRow;
        Update: Partial<AmenityRow>;
        Relationships: [];
      };
      nearby_places: {
        Row: NearbyPlaceRow;
        Insert: NearbyPlaceRow;
        Update: Partial<NearbyPlaceRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, Generated> & { id?: string };
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      booking_inquiries: {
        Row: BookingInquiryRow;
        Insert: BookingInquiryInsert;
        Update: Partial<BookingInquiryRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

/** Atajo con el mismo nombre que usan los tipos generados por la CLI. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
