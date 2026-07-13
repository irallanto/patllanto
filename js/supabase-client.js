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

const SUPABASE_URL = 'https://nqpdspdxkfbwctzmptsv.supabase.co';       // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcGRzcGR4a2Zid2N0em1wdHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MjQyMTksImV4cCI6MjA5OTUwMDIxOX0.acWwkHZ_cWNq3zHM2eM1yu5ysnN2p59aAGoE18Osdg0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);