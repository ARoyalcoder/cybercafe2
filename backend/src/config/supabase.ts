import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(
  "Supabase URL:",
  supabaseUrl ? "Loaded" : "Missing"
);

console.log(
  "Supabase Service Key:",
  supabaseServiceRoleKey
    ? "Loaded"
    : "Missing"
);

if (!supabaseUrl) {
  throw new Error(
    "Missing SUPABASE_URL environment variable"
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable"
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);