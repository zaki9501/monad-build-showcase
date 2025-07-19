
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Import actual project images that exist
import chogVsCatgirlImg from '@/assets/projects/Chog-vs-catgirl.png';
import flappyTrumpImg from '@/assets/projects/Flapy -trump.png';
import monairImg from '@/assets/projects/Monair.png';
import montipImg from '@/assets/projects/Montip.png';
import p1x3lzImg from '@/assets/projects/P1x3lz.png';
import retroBlockExpImg from '@/assets/projects/Retro Block Exp..png';
import testnetExpImg from '@/assets/projects/Testnet Exp.png';
import testnetMetricsImg from '@/assets/projects/Testnet Metrics Hub.png';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  builder: {
    name: string;
    discord: string;
    twitter?: string;
  };
  thumbnail: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  tags: string[];
  mission: string;
}

// Map project names to local images (only for existing images)
const projectImageMap: Record<string, string> = {
  'Chog vs catgirl': chogVsCatgirlImg,
  'Flappy Trump': flappyTrumpImg,
  'Monair': monairImg,
  'Montip': montipImg,
  'P1x3lz': p1x3lzImg,
  'Retro Block Explorer': retroBlockExpImg,
  'Testnet Explorer': testnetExpImg,
  'Testnet Metrics Hub': testnetMetricsImg,
  // Mission 5 projects will use database thumbnails since local images don't exist
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        builder: {
          name: project.builder_name,
          discord: project.builder_discord,
          twitter: project.builder_twitter || undefined,
        },
        // Use local image if available, otherwise use database thumbnail
        thumbnail: projectImageMap[project.name] || project.thumbnail,
        githubUrl: project.github_url,
        liveUrl: project.live_url,
        tags: project.tags || [],
        mission: project.mission,
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
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
    refetch: fetchProjects
  };
};
