import { createClient } from "@supabase/supabase-js";

// Same Supabase project can back several separate platforms/sites at once —
// APP_ID is what tells them apart in the shared course_access table (see
// supabase/course_access.sql). Change it only if this platform's own
// identity in that table changes.
export const APP_ID = "00100101";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When the env vars aren't set (e.g. local dev without a .env file), the
// client stays null and AuthGate skips the login gate entirely — so working
// on course content locally never requires a Supabase project.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
