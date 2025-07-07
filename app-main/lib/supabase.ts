import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`
const supabaseAnonKey = process.env.SUPABASE_API_KEYS_ANON_PUBLIC!

if (!process.env.SUPABASE_PROJECT_ID) {
  console.error("SUPABASE_PROJECT_ID manquant dans les variables d'environnement");
}
if (!process.env.SUPABASE_API_KEYS_ANON_PUBLIC) {
  console.error("SUPABASE_API_KEYS_ANON_PUBLIC manquant dans les variables d'environnement");
}
if (!process.env.SUPABASE_API_KEYS_SERVICE_ROLE) {
  console.error("SUPABASE_API_KEYS_SERVICE_ROLE manquant dans les variables d'environnement");
}

console.log("Configuration Supabase:", {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!process.env.SUPABASE_API_KEYS_SERVICE_ROLE
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 0,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
    fetch: (url, options = {}) => {
      if (process.env.NODE_ENV === 'development') {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000),
        });
      }
      return fetch(url, options);
    },
  },
})

const supabaseServiceKey = process.env.SUPABASE_API_KEYS_SERVICE_ROLE!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  realtime: {
    params: {
      eventsPerSecond: 0,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
    fetch: (url, options = {}) => {
      if (process.env.NODE_ENV === 'development') {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000),
        });
      }
      return fetch(url, options);
    },
  },
})

export default supabase
