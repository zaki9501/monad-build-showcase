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

// Import Mission 5 project images that actually exist
import nfThingImg from '@/assets/projects/NfThing.png';
import moNftImg from '@/assets/projects/MoNft.png';
import nadtoolsImg from '@/assets/projects/Nadtools.png';
import nadmonImg from '@/assets/projects/NADMON.png';
import blonksImg from '@/assets/projects/Blonks.png';
import moodArtImg from '@/assets/projects/MoodArt.png';

// Import github logo for Mission 2 projects
import githubImg from '@/assets/projects/github.png';

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

// Map project names to local images (using actual existing files and matching database names)
const projectImageMap: Record<string, string> = {
  // Farcaster Edition projects - matching exact database names
  'Chog vs catgirl': chogVsCatgirlImg,
  'Chog vs CatGirls': chogVsCatgirlImg,
  'Flappy Trump': flappyTrumpImg,
  'Montip': montipImg,
  'MonTip': montipImg,
  'P1x3lz': p1x3lzImg,
  
  // Mission 4 projects - matching exact database names
  'Retro Block Explorer': retroBlockExpImg,
  'Retro Block Exp.': retroBlockExpImg,
  'Monair': monairImg,
  'Testnet Explorer': testnetExpImg,
  'Testnet Exp': testnetExpImg,
  'Testnet Metrics Hub': testnetMetricsImg,
  'DevHub': testnetMetricsImg, // Using metrics hub image as fallback for DevHub
  'Monad Nebula': '/lovable-uploads/4b2be09e-ce9a-4305-97cb-e645ff465c6c.png', // Using uploaded Monad Nebula image
  
  // Mission 2 projects (using github logo)
  'nadcp_dot_fun': githubImg,
  'MonadHub-MCP': githubImg,
  'monad-mcp-server (vib3ai)': githubImg,
  'monad-mcp-server (AnasXDev)': githubImg,
  'mcp-santi': githubImg,
  'Monad NFT MCPs': githubImg, // New Mission 2 project
  
  // Mission 5 projects using actual existing images - matching exact database names
  'NFThing': nfThingImg,
  'MoNFT': moNftImg,
  'NadTools': nadtoolsImg,
  'Nadmon': nadmonImg,
  'Blonks': blonksImg,
  'Moodart': moodArtImg,
  'Bombandak': '/lovable-uploads/78ab7b38-7933-4bf2-9d20-67c859f51179.png', // Using uploaded Bombandak image
  
  // Community projects
  'Monsweeper': '/lovable-uploads/5343360c-be7b-4027-aef9-bc883105fdae.png',
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
