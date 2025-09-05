
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface BuilderStats {
  totalProjects: number;
  bio?: string;
  twitterBio?: string;
  verified?: boolean;
}

export const useBuilderStats = (builderDiscord: string) => {
  const [stats, setStats] = useState<BuilderStats>({ totalProjects: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBuilderStats = async () => {
    try {
      setLoading(true);
      
      // Get total projects count for this builder - match by discord or name if discord is empty
      let projects = [];
      let projectsError = null;
      
      // Try to query projects table
      try {
        const result = await supabase
          .from('projects')
          .select('id, description, builder_name, builder_discord, twitter_bio, twitter_verified')
          .or(`builder_discord.eq."${builderDiscord}",builder_name.eq."${builderDiscord}"`);
        
        projects = result.data || [];
        projectsError = result.error;
      } catch (err) {
        projectsError = err;
      }

      if (projectsError) {
        // Don't throw error, just return empty stats
        setStats({ totalProjects: 0 });
        return;
      }

      // Filter projects that actually match this builder
      const matchedProjects = projects?.filter(p => {
        const discordMatch = p.builder_discord === builderDiscord;
        const nameMatch = p.builder_name === builderDiscord;
        return discordMatch || nameMatch;
      }) || [];

      // Get Twitter bio from the most recent project with Twitter data
      const twitterProject = matchedProjects.find(p => p.twitter_bio);
      const twitterBio = twitterProject?.twitter_bio;
      const verified = twitterProject?.twitter_verified || false;

      // Use Twitter bio first, then fall back to longest project description
      const descriptions = matchedProjects
        .map(p => p.description)
        .filter(Boolean)
        .filter(desc => desc && desc.trim().length > 0);
      
      const projectBio = descriptions
        .sort((a, b) => (b?.length || 0) - (a?.length || 0))[0] || undefined;

      // Prioritize Twitter bio over project description
      const finalBio = twitterBio || projectBio;

      setStats({
        totalProjects: matchedProjects.length,
        bio: finalBio,
        twitterBio: twitterBio,
        verified: verified
      });

    } catch (error) {
      console.error('Error fetching builder stats:', error);
      toast({
        title: "Error",
        description: "Failed to load builder statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (builderDiscord && builderDiscord.trim()) {
      fetchBuilderStats();
    } else {
      setLoading(false);
    }
  }, [builderDiscord]);

  return {
    stats,
    loading,
    refetch: fetchBuilderStats
  };
};
