
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface TwitterProfile {
  profilePicture: string | null;
  bio: string | null;
  verified: boolean;
  loading: boolean;
  cached: boolean;
}

export const useTwitterProfile = (twitterUrl?: string, projectId?: string) => {
  const [profile, setProfile] = useState<TwitterProfile>({
    profilePicture: null,
    bio: null,
    verified: false,
    loading: false,
    cached: false,
  });
  const { toast } = useToast();

  const extractUsername = (url?: string) => {
    if (!url) return null;
    
    try {
      // Handle various Twitter URL formats
      const patterns = [
        /(?:twitter\.com|x\.com)\/([^\/\?\s#]+)/i,
        /(?:@)([a-zA-Z0-9_]+)/,
        /^([a-zA-Z0-9_]+)$/ // Just username without @ or URL
      ];
      
      for (const pattern of patterns) {
        const match = url.trim().match(pattern);
        if (match && match[1]) {
          const username = match[1];
          // Validate username format
          if (/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
            console.log(`Extracted username: "${username}" from URL: "${url}"`);
            return username;
          }
        }
      }
      
      console.warn(`Could not extract valid username from: "${url}"`);
      return null;
    } catch (error) {
      console.error('Error extracting username:', error);
      return null;
    }
  };

  const fetchTwitterProfile = async (username: string) => {
    try {
      setProfile(prev => ({ ...prev, loading: true }));
      console.log('Fetching Twitter profile for:', username);

      const { data, error } = await supabase.functions.invoke('fetch-twitter-profile', {
        body: { username, projectId },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Twitter profile data received:', data);

      // Handle the case where data might have an error property
      if (data?.error) {
        console.warn('Twitter API returned error:', data.error);
        // Don't throw here, just set empty state
        setProfile({
          profilePicture: null,
          bio: null,
          verified: false,
          loading: false,
          cached: false,
        });
        return;
      }

      setProfile({
        profilePicture: data?.profilePicture || null,
        bio: data?.bio || null,
        verified: data?.verified || false,
        loading: false,
        cached: data?.cached || false,
      });

    } catch (error) {
      console.error('Error fetching Twitter profile:', error);
      setProfile({
        profilePicture: null,
        bio: null,
        verified: false,
        loading: false,
        cached: false,
      });
      
      // Only show toast for unexpected errors, not API failures
      if (!error.message?.includes('rate limit') && !error.message?.includes('Twitter API')) {
        toast({
          title: "Error",
          description: "Failed to load Twitter profile data.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const username = extractUsername(twitterUrl);
    if (username && username.trim()) {
      console.log('Twitter username extracted:', username);
      fetchTwitterProfile(username);
    } else {
      console.log('No valid Twitter username found in URL:', twitterUrl);
      setProfile({
        profilePicture: null,
        bio: null,
        verified: false,
        loading: false,
        cached: false,
      });
    }
  }, [twitterUrl, projectId]);

  return {
    profile,
    refetch: () => {
      const username = extractUsername(twitterUrl);
      if (username) {
        fetchTwitterProfile(username);
      }
    },
  };
};
