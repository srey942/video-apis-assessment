import { createClient } from "@supabase/supabase-js";

export const fetchVideoDataFromSupabase = async (videoId: any) => {
//   const supabaseUrl = process.env.SUPABASE_URL;
//   const supabaseKey = process.env.SUPABASE_KEY;

  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2hqZ2twZXd2cW1yaXpyd3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3NTIyMDcsImV4cCI6MjAwMTMyODIwN30.ZZGSVFyr5x7jGapWWZSDKw-fRZQ6nER6MRu4q6SwXCc";
  const supabaseUrl = "https://pdshjgkpewvqmrizrwro.supabase.co";
  //key ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2hqZ2twZXd2cW1yaXpyd3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3NTIyMDcsImV4cCI6MjAwMTMyODIwN30.ZZGSVFyr5x7jGapWWZSDKw-fRZQ6nER6MRu4q6SwXCc");
  // url const supabaseUrl = "https://pdshjgkpewvqmrizrwro.supabase.co";

  // Initialize Supabase client

  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    console.log("video id service", videoId);
    const { data, error } = await supabase.storage
      .from("videos")
      .download(`./converted/${videoId}.mp4`);
    if (error) {
      throw error;
    } else {
      console.log("File downloaded successfully:", data?.path);
      return { success: true };
    }
  } catch (error) {
    console.error(error);
    throw new Error("custom message");
  }
};
