import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { HAS_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

type Client = SupabaseClient<Database>;

let anon: Client | null = null;
let service: Client | null = null;

const opts = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/** Read client. Uses the anon key, so RLS decides what is visible: published rows only. */
export function readClient(): Client | null {
  if (!HAS_SUPABASE) return null;
  anon ??= createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, opts);
  return anon;
}

/** Write client for server actions. Service role, server only. Returns null when not configured. */
export function serviceClient(): Client | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  service ??= createClient<Database>(SUPABASE_URL, key, opts);
  return service;
}
