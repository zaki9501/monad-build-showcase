
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface BuilderStats {
  totalProjects: number;
  bio?: string;
}

export const useBuilderStats = (builderDiscord: string) => {
  const [stats, setStats] = useState<BuilderStats>({ totalProjects: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBuilderStats = async () => {
    try {
      setLoading(true);
      
      // Get total projects count for this builder - match by discord or name if discord is empty
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, description, builder_name, builder_discord')
        .or(`builder_discord.eq.${builderDiscord},builder_name.eq.${builderDiscord}`);

      if (projectsError) throw projectsError;

      // Filter projects that actually match this builder
      const matchedProjects = projects?.filter(p => 
        p.builder_discord === builderDiscord || 
        (builderDiscord && p.builder_name === builderDiscord)
      ) || [];

      // Use the longest description as a bio if available
      const bio = matchedProjects
        .map(p => p.description)
        .filter(Boolean)
        .sort((a, b) => (b?.length || 0) - (a?.length || 0))[0] || undefined;

      setStats({
        totalProjects: matchedProjects.length,
        bio: bio
      });

      console.log(`Builder stats for ${builderDiscord}:`, {
        totalProjects: matchedProjects.length,
        matchedProjects: matchedProjects.map(p => p.builder_name),
        bio: bio?.substring(0, 50) + '...'
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
    if (builderDiscord) {
      fetchBuilderStats();
    }
  }, [builderDiscord]);

  return {
    stats,
    loading,
    refetch: fetchBuilderStats
  };
};
