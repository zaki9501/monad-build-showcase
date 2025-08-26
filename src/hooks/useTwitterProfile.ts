
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface TwitterProfile {
  profilePicture: string | null;
  bio: string | null;
  verified: boolean;
  loading: boolean;
  cached: boolean;
  error?: string;
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
  const isDev = (import.meta as any)?.env?.DEV === true;
  const debugLog = (...args: unknown[]) => { if (isDev) console.log(...args); };
  const debugWarn = (...args: unknown[]) => { if (isDev) console.warn(...args); };
  const debugError = (...args: unknown[]) => { if (isDev) console.error(...args); };

  const extractUsername = (url?: string) => {
    if (!url) return null;
    
    try {
      // Handle various Twitter URL formats
      const patterns = [
        // Full URLs
        /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?\s#&]+)/i,
        // Username with @
        /^@([a-zA-Z0-9_]+)$/,
        // Just username
        /^([a-zA-Z0-9_]+)$/
      ];
      
      for (const pattern of patterns) {
        const match = url.trim().match(pattern);
        if (match && match[1]) {
          const username = match[1];
          // Validate username format (Twitter usernames: 1-15 chars, alphanumeric + underscore)
          if (/^[a-zA-Z0-9_]{1,15}$/.test(username)) {
            debugLog(`✅ Extracted username: "${username}" from URL: "${url}"`);
            return username;
          }
        }
      }
      
      debugWarn(`❌ Could not extract valid username from: "${url}"`);
      return null;
    } catch (error) {
      debugError('Error extracting username:', error);
      return null;
    }
  };

  const fetchTwitterProfile = async (username: string) => {
    try {
      setProfile(prev => ({ ...prev, loading: true, error: undefined }));
      debugLog(`🐦 Fetching Twitter profile for: ${username}`);

      const { data, error } = await supabase.functions.invoke('fetch-twitter-profile', {
        body: { username, projectId },
      });

      if (error) {
        debugError('❌ Supabase function error:', error);
        throw error;
      }

      debugLog('📦 Twitter profile data received:', data);

      // Handle the case where data has an error property (but still returns 200)
      if (data?.error) {
        debugWarn('⚠️ Twitter API returned error:', data.error);
        setProfile({
          profilePicture: null,
          bio: null,
          verified: false,
          loading: false,
          cached: false,
          error: data.error
        });
        
        // Only show toast for unexpected errors, not common issues like user not found
        if (!data.error.includes('not found') && 
            !data.error.includes('Rate limit') && 
            !data.error.includes('Invalid username')) {
          toast({
            title: "Twitter Profile Error",
            description: data.error,
            variant: "destructive",
          });
        }
        return;
      }

      // Success case
      setProfile({
        profilePicture: data?.profilePicture || null,
        bio: data?.bio || null,
        verified: data?.verified || false,
        loading: false,
        cached: data?.cached || false,
        error: undefined
      });

      if (data?.profilePicture) {
        debugLog(`✅ Successfully loaded Twitter profile for ${username}`);
      } else {
        debugLog(`⚠️ No profile picture found for ${username}`);
      }

    } catch (error) {
      debugError('❌ Error fetching Twitter profile:', error);
      setProfile({
        profilePicture: null,
        bio: null,
        verified: false,
        loading: false,
        cached: false,
        error: error.message || 'Failed to load Twitter profile'
      });
      
      // Only show toast for unexpected errors
      if (!error.message?.includes('rate limit') && 
          !error.message?.includes('not found') &&
          !error.message?.includes('Invalid username')) {
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
      debugLog(`🔄 Twitter username extracted: ${username}`);
      fetchTwitterProfile(username);
    } else {
      debugLog(`ℹ️ No valid Twitter username found in URL: ${twitterUrl}`);
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
