/* ─────────────────────────────────────────
   MODULE  —  Supabase Client
   Single shared client instance, imported wherever comment data is
   read or written (comment-widget.js, sidebar.js testimonials, and
   admin.js). Loaded straight from CDN as an ES module — no build
   step, matching how three-accent.js pulls in three.js.

   Fill in your own project's URL + anon key below. The anon key is
   public by design (it's meant to ship in client code) — access
   control is enforced by the Row Level Security policies you set up
   in Supabase, not by hiding this key. See supabase-setup.sql.
   ───────────────────────────────────────── */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);