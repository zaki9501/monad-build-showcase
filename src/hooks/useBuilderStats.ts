
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
      
      // Get total projects count for this builder
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, description')
        .eq('builder_discord', builderDiscord);

      if (projectsError) throw projectsError;

      // For now, we'll use the first project's description as bio if available
      // In a real app, you might have a separate builders table with bio info
      const bio = projects?.find(p => p.description)?.description || undefined;

      setStats({
        totalProjects: projects?.length || 0,
        bio: bio
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
