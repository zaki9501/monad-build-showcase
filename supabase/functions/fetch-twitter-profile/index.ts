
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

// Enhanced rate limiting system
class RateLimiter {
  private static instance: RateLimiter;
  private queue: Array<{ resolve: Function; reject: Function; username: string }> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 6000; // Increased to 6 seconds for safety margin

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  async processRequest(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, username });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const { resolve, reject, username } = this.queue.shift()!;
      
      try {
        // Ensure minimum delay between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
          const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
          console.log(`Rate limiting: waiting ${waitTime}ms before processing ${username}`);
          await new Promise(r => setTimeout(r, waitTime));
        }

        const result = await this.fetchTwitterData(username);
        this.lastRequestTime = Date.now();
        resolve(result);
        
        // Small additional delay between queue items
        if (this.queue.length > 0) {
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  private async fetchTwitterData(username: string): Promise<any> {
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
      signal: AbortSignal.timeout(15000),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`Raw response body:`, responseText);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded - please try again later');
      }
      
      if (response.status === 404) {
        throw new Error(`Twitter user '${username}' not found`);
      }
      
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    const twitterData = JSON.parse(responseText);
    console.log('Parsed Twitter data:', JSON.stringify(twitterData, null, 2));

    if (twitterData.status !== 'success' || !twitterData.data) {
      if (twitterData.msg && twitterData.msg.includes('not found')) {
        throw new Error(`Twitter user '${username}' not found`);
      }
      throw new Error(`Twitter API error: ${twitterData.msg || 'Unknown error'}`);
    }

    return twitterData;
  }
}

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

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
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
      return new Response(JSON.stringify({ 
        error: 'Twitter API key not configured',
        profilePicture: null,
        bio: null,
        verified: false,
        cached: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { username, projectId } = requestBody;
    
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Username is required and must be a string',
        profilePicture: null,
        bio: null,
        verified: false,
        cached: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return new Response(JSON.stringify({ 
        error: 'Username cannot be empty',
        profilePicture: null,
        bio: null,
        verified: false,
        cached: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing request - Username: "${trimmedUsername}", ProjectId: ${projectId}`);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have recent data (less than 24 hours old) - only if projectId is valid UUID
    if (projectId && isValidUUID(projectId)) {
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
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Extended cache to 24 hours
        
        if (fetchedAt > twentyFourHoursAgo && existingProject.twitter_profile_picture) {
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
    } else if (projectId) {
      console.log(`Invalid projectId format: ${projectId}`);
    }

    // Use rate limiter for Twitter API requests
    const rateLimiter = RateLimiter.getInstance();
    const twitterData = await rateLimiter.processRequest(trimmedUsername);
    
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

    // Update the project with Twitter data if projectId is provided and valid
    if (projectId && isValidUUID(projectId) && profilePicture) {
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
    
    // Provide more specific error information but always return 200 status
    let errorMessage = error.message;
    if (error.name === 'TimeoutError') {
      errorMessage = 'Twitter API request timed out';
    } else if (error.message.includes('Rate limit')) {
      errorMessage = 'Twitter API rate limit exceeded - please try again later';
    } else if (error.message.includes('not found')) {
      errorMessage = `Twitter user not found: ${error.message}`;
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error connecting to Twitter API';
    }
    
    // Always return 200 status with error information to prevent FunctionsHttpError
    return new Response(JSON.stringify({ 
      error: errorMessage,
      profilePicture: null,
      bio: null,
      verified: false,
      cached: false
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
