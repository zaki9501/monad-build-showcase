
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!twitterApiKey) {
      throw new Error('Twitter API key not configured');
    }

    const { username, projectId } = await req.json();
    
    if (!username) {
      throw new Error('Username is required');
    }

    console.log(`Fetching Twitter profile for username: ${username}`);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have recent data (less than 7 days old)
    if (projectId) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('twitter_data_fetched_at, twitter_profile_picture, twitter_bio, twitter_verified')
        .eq('id', projectId)
        .single();

      if (existingProject?.twitter_data_fetched_at) {
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

    // Fetch from Twitter API
    const twitterResponse = await fetch(`https://api.twitterapi.io/twitter/user/info?userName=${username}`, {
      method: 'GET',
      headers: {
        'X-API-Key': twitterApiKey,
      },
    });

    if (!twitterResponse.ok) {
      throw new Error(`Twitter API error: ${twitterResponse.status} ${twitterResponse.statusText}`);
    }

    const twitterData = await twitterResponse.json();
    console.log('Twitter API response:', JSON.stringify(twitterData, null, 2));

    if (twitterData.status !== 'success' || !twitterData.data) {
      throw new Error(`Twitter API error: ${twitterData.msg || 'Unknown error'}`);
    }

    const userData = twitterData.data;
    const profilePicture = userData.profilePicture;
    const bio = userData.description || userData.profile_bio?.description;
    const verified = userData.isBlueVerified || false;

    // Update the project with Twitter data if projectId is provided
    if (projectId && profilePicture) {
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

    return new Response(JSON.stringify({
      profilePicture,
      bio,
      verified,
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-twitter-profile function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      profilePicture: null,
      bio: null,
      verified: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
