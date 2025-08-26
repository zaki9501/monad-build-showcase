
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
      console.log('Fetching builder stats for:', builderDiscord);
      
      // Get total projects count for this builder - match by discord or name if discord is empty
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, description, builder_name, builder_discord, twitter_bio, twitter_verified')
        .or(`builder_discord.eq.${builderDiscord},builder_name.eq.${builderDiscord}`);

      if (projectsError) {
        console.error('Supabase error:', projectsError);
        throw projectsError;
      }

      console.log('Raw projects from database:', projects);

      // Filter projects that actually match this builder
      const matchedProjects = projects?.filter(p => {
        const discordMatch = p.builder_discord === builderDiscord;
        const nameMatch = p.builder_name === builderDiscord;
        console.log(`Project ${p.id}: discord="${p.builder_discord}" name="${p.builder_name}" - discord match: ${discordMatch}, name match: ${nameMatch}`);
        return discordMatch || nameMatch;
      }) || [];

      console.log('Matched projects:', matchedProjects);

      // Get Twitter bio from the most recent project with Twitter data
      const twitterProject = matchedProjects.find(p => p.twitter_bio);
      const twitterBio = twitterProject?.twitter_bio;
      const verified = twitterProject?.twitter_verified || false;

      // Use Twitter bio first, then fall back to longest project description
      const descriptions = matchedProjects
        .map(p => p.description)
        .filter(Boolean)
        .filter(desc => desc && desc.trim().length > 0);
      
      console.log('Available descriptions:', descriptions);
      
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

      console.log(`Final builder stats for "${builderDiscord}":`, {
        totalProjects: matchedProjects.length,
        matchedProjects: matchedProjects.map(p => ({ name: p.builder_name, discord: p.builder_discord })),
        bio: finalBio?.substring(0, 100) + (finalBio && finalBio.length > 100 ? '...' : ''),
        twitterBio: twitterBio?.substring(0, 100) + (twitterBio && twitterBio.length > 100 ? '...' : ''),
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
      console.log('Builder identifier changed to:', builderDiscord);
      fetchBuilderStats();
    } else {
      console.log('No valid builder identifier provided');
      setLoading(false);
    }
  }, [builderDiscord]);

  return {
    stats,
    loading,
    refetch: fetchBuilderStats
  };
};
