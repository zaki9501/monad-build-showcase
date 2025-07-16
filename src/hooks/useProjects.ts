
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Project {
  id: string;
  name: string;
  description: string | null;
  builder: {
    name: string;
    discord: string;
    twitter?: string | null;
  };
  thumbnail: string | null;
  githubUrl: string | null;
  liveUrl?: string | null;
  tags: string[];
  mission: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform database data to match component interface
      const transformedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        builder: {
          name: project.builder_name,
          discord: project.builder_discord,
          twitter: project.builder_twitter
        },
        thumbnail: project.thumbnail,
        githubUrl: project.github_url,
        liveUrl: project.live_url,
        tags: project.tags || [],
        mission: project.mission
      }));

      setProjects(transformedProjects);
      console.log(`Loaded ${transformedProjects.length} projects from Supabase`);
      
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      toast({
        title: "Error loading projects",
        description: "Failed to load projects from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
};
