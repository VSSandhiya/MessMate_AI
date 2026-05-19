// =============================================
// SUPABASE BACKEND INTEGRATION
// =============================================

// Insert your Supabase project credentials here
const SUPABASE_URL = "https://cpkvbzyzekmvloybcwvu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Zienl6ZWttdmxveWJjd3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODUwMjcsImV4cCI6MjA5NDc2MTAyN30.q5xr-IzQH-bJFsfVWYGb1gNC0xzfvZ7j86Bd3-ZmbPc";

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized successfully!");
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
} else {
  console.warn("Supabase credentials missing. Running in Offline Caching Fallback mode.");
}

// Fetch all messes from live database
async function fetchMessesFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('messes')
      .select('*');

    if (error) throw error;
    return data;
  } catch (e) {
    console.error("Error fetching live messes from Supabase:", e.message);
    return null;
  }
}

// Update a mess's real-time state in live database (e.g. posting a review or crowd level)
async function updateMessInDB(messId, updates) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('messes')
      .update(updates)
      .eq('id', messId);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`Error updating mess ${messId} in Supabase:`, e.message);
    return false;
  }
}
