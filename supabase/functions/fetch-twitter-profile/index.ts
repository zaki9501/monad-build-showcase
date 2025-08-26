
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const twitterApiKey = Deno.env.get('TWITTER_API_KEY');

function improveImageQuality(profilePicture: string | null): string | null {
  if (!profilePicture) return null;
  
  // Replace _normal.jpg with _400x400.jpg for better quality
  if (profilePicture.includes('_normal.jpg')) {
    return profilePicture.replace('_normal.jpg', '_400x400.jpg');
  }
  
  // Handle other Twitter image formats
  if (profilePicture.includes('_normal.')) {
    return profilePicture.replace('_normal.', '_400x400.');
  }
  
  return profilePicture;
}

function validateUsername(username: string): boolean {
  // Twitter usernames must be 1-15 characters, alphanumeric plus underscore
  const usernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
  return usernameRegex.test(username);
}

async function fetchTwitterProfileWithRetry(username: string, maxRetries = 2): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} - Fetching Twitter profile for: ${username}`);
      
      if (!validateUsername(username)) {
        throw new Error(`Invalid Twitter username format: ${username}`);
      }
      
      const url = `https://api.twitterapi.io/twitter/user/info?userName=${username}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': twitterApiKey!,
          'User-Agent': 'Supabase-Edge-Function/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`Raw response body:`, responseText);

      if (!response.ok) {
        if (response.status === 429) {
          console.log(`Rate limited on attempt ${attempt}, waiting before retry...`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            continue;
          }
        }
        throw new Error(`Twitter API error: ${response.status} ${response.statusText} - ${responseText}`);
      }

      const twitterData = JSON.parse(responseText);
      console.log('Parsed Twitter data:', JSON.stringify(twitterData, null, 2));

      if (twitterData.status !== 'success' || !twitterData.data) {
        throw new Error(`Twitter API error: ${twitterData.msg || 'Unknown error'} - Response: ${responseText}`);
      }

      return twitterData;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry, except for validation errors
      if (!error.message.includes('Invalid Twitter username format')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error; // Don't retry validation errors
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Twitter Profile Fetch Request ===');
    
    if (!twitterApiKey) {
      console.error('Twitter API key not configured');
      throw new Error('Twitter API key not configured');
    }

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { username, projectId } = requestBody;
    
    if (!username || typeof username !== 'string') {
      throw new Error('Username is required and must be a string');
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      throw new Error('Username cannot be empty');
    }

    console.log(`Processing request - Username: "${trimmedUsername}", ProjectId: ${projectId}`);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have recent data (less than 7 days old)
    if (projectId) {
      console.log(`Checking for cached data for project: ${projectId}`);
      
      const { data: existingProject, error: fetchError } = await supabase
        .from('projects')
        .select('twitter_data_fetched_at, twitter_profile_picture, twitter_bio, twitter_verified')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        console.log('Error fetching project data:', fetchError);
      } else if (existingProject?.twitter_data_fetched_at) {
        const fetchedAt = new Date(existingProject.twitter_data_fetched_at);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        if (fetchedAt > sevenDaysAgo && existingProject.twitter_profile_picture) {
          console.log('Returning cached Twitter data');
          return new Response(JSON.stringify({
            profilePicture: existingProject.twitter_profile_picture,
            bio: existingProject.twitter_bio,
            verified: existingProject.twitter_verified,
            cached: true
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // Fetch from Twitter API with retry logic
    const twitterData = await fetchTwitterProfileWithRetry(trimmedUsername);
    const userData = twitterData.data;
    
    let profilePicture = userData.profilePicture;
    const bio = userData.description || userData.profile_bio?.description;
    const verified = userData.isBlueVerified || userData.isVerified || false;

    console.log('Extracted data:', {
      originalProfilePicture: profilePicture,
      bio: bio?.substring(0, 100) + (bio && bio.length > 100 ? '...' : ''),
      verified
    });

    // Improve image quality
    profilePicture = improveImageQuality(profilePicture);
    console.log('Improved profile picture URL:', profilePicture);

    // Update the project with Twitter data if projectId is provided
    if (projectId && profilePicture) {
      console.log(`Updating project ${projectId} with Twitter data`);
      
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          twitter_profile_picture: profilePicture,
          twitter_bio: bio,
          twitter_verified: verified,
          twitter_data_fetched_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Error updating project with Twitter data:', updateError);
      } else {
        console.log('Successfully updated project with Twitter data');
      }
    }

    const responseData = {
      profilePicture,
      bio,
      verified,
      cached: false
    };

    console.log('=== Successful Response ===');
    console.log('Final response data:', JSON.stringify(responseData, null, 2));

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== Error in fetch-twitter-profile function ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error information
    let errorMessage = error.message;
    if (error.name === 'TimeoutError') {
      errorMessage = 'Twitter API request timed out';
    } else if (error.message.includes('429')) {
      errorMessage = 'Twitter API rate limit exceeded';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error connecting to Twitter API';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      profilePicture: null,
      bio: null,
      verified: false,
      cached: false
    }), {
      status: error.message.includes('rate limit') ? 429 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
