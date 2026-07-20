import { createClient } from "@supabase/supabase-js";

// Build a Supabase client that acts as the OAuth-authenticated MCP caller.
// The bearer token comes from the MCP ToolContext (ctx.getToken()) which the
// mcp-js runtime validates against the configured issuer before invoking a tool.
function isNewKey(k: string) {
  return k.startsWith("sb_publishable_") || k.startsWith("sb_secret_");
}

export function supabaseAsUser(token: string) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (isNewKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
          // Preserve the user token in Authorization
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}