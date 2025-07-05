import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project details
const supabaseUrl = "https://yuvsajkgycpsscxhlkkm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dnNhamtneWNwc3NjeGhsa2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjQyMzksImV4cCI6MjA2NjI0MDIzOX0.xK9hVnyNPCPCE8tHGhhMSItI8YRTmvBvx26LCIaVvk4";

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch JSON file from Supabase storage
// filePath should be like: "civics/2000.json" or "history/2001.json"
export async function fetchExamFromSupabase(filePath) {
  try {
    const { data, error } = await supabase.storage
      .from("civics") // Your bucket name
      .download(filePath);

    if (error) throw error;

    // Convert blob to JSON
    const text = await data.text();
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to fetch from Supabase: ${error.message}`);
  }
}

// Function to get public URL for diagram images
// diagramId should be like: "3.1", "9.5", etc.
export function getDiagramUrl(diagramId) {
  try {
    const filePath = `civics/books/form one/${diagramId}.webp`;

    const { data } = supabase.storage.from("civics").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error(`Failed to get diagram URL for ${diagramId}:`, error);
    return null;
  }
}

// Function to check if diagram exists (optional - for better error handling)
export async function checkDiagramExists(diagramId) {
  try {
    const filePath = `civics/books/form one/${diagramId}.webp`;

    const { data, error } = await supabase.storage
      .from("civics")
      .list("civics/books/form one", {
        search: `${diagramId}.webp`,
      });

    if (error) return false;
    return data.length > 0;
  } catch (error) {
    console.error(`Failed to check diagram existence for ${diagramId}:`, error);
    return false;
  }
}
