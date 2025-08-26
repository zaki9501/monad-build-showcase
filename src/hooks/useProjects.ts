import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getGithubPreviewImage } from '@/utils/githubPreview';

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

// Import gaming image for game projects
import projectGaming from '@/assets/project-gaming.jpg';

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
  
  // Mission 5 projects using actual existing images - matching exact database names
  'NFThing': nfThingImg,
  'MoNFT': moNftImg,
  'NadTools': nadtoolsImg,
  'Nadmon': nadmonImg,
  'Blonks': blonksImg,
  'Moodart': moodArtImg,
  'Bombandak': '/lovable-uploads/78ab7b38-7933-4bf2-9d20-67c859f51179.png', // Using uploaded Bombandak image
  'Solodan NFT Launchpad': '/lovable-uploads/a20c6347-3a7a-446b-af56-0abdafe13824.png', // Using uploaded Solodan NFT Launchpad image
  
  // Mission 5 projects with live links - using new uploaded images
  'GeoShapes': '/lovable-uploads/7178febd-7e56-45f5-a8ed-032f21718a9b.png',
  'ME-int': '/lovable-uploads/da14b4a2-8577-4f28-8f83-1273bbeefcc1.png',
  'Mon Warrior Game': '/lovable-uploads/c4cc4ce5-6675-4480-8fdc-2446db3dc8f4.png',
  'PokéEvolve NFT': '/lovable-uploads/be973813-14a7-444f-82ec-e5b7e52914f9.png',
  'LendHub': '/lovable-uploads/dad46e9e-75d0-43fb-af6a-9f368d720052.png',
  'Music NADS': '/lovable-uploads/63a55c3b-8363-47b3-ad74-9c7d1cc9e670.png',
  'MonadPets': '/lovable-uploads/850a415d-7781-4b53-be23-8f46d9418ee4.png',
  'Vibe to Music': '/lovable-uploads/5505ecbe-443c-42b1-9a77-a392b924b7ec.png',
  'Create Your Image': '/lovable-uploads/0b268c72-d50c-4465-8ad3-0c2fbc7ebf9c.png',
  'NFT': '/lovable-uploads/d918e58b-6910-44c9-9a98-c2be1f41024f.png',
  
  // Mission 3 projects
  'Monagayanimals': projectGaming, // Using gaming image for the shooter game
  
  // Mission 6 projects - Multisynq Applications & Games with specific preview images
  'TowerBlocs': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png', // Using new fallback image for Mission 6
  'Nadoodle': '/lovable-uploads/513849b9-4c34-4e39-b01c-39a74d40fc66.png', // Nadoodle preview image
  'Monedio Game': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png', // Using new fallback image for Mission 6
  'SynqChaos': '/lovable-uploads/28710d0f-5dbc-4046-9bb2-41ba0130953c.png', // SynqChaos preview image
  'Pixel Nad': '/lovable-uploads/d755b75f-3bc1-46fc-b6ab-857bf4393ea9.png', // Pixel Nad preview image
  'Monad Battleship': '/lovable-uploads/97380248-0def-483a-a63d-8b57589d8498.png', // Monad Battleship preview image
  'Catch the Mouch': '/lovable-uploads/ded4e45f-c3a7-4764-a207-83781926509b.png', // Catch the Mouch preview image
  'Monad Slither': '/lovable-uploads/d55d94c1-b2a5-49d8-9998-f50b27271a1f.png', // Monad Slither preview image
  'RPS Game Sync': '/lovable-uploads/ed1401bd-4af7-43c9-91ba-3359bb269ca4.png', // RPS Game Sync preview image
  'ThreeSynq': '/lovable-uploads/5e8204d4-9b0f-48a9-8c48-dd223d517abf.png', // ThreeSynq preview image
  'Bombermon': '/lovable-uploads/1c47ae42-74b4-4cda-ad1e-4d0e2695ed4f.png', // Bombermon preview image
  'SynqType': '/lovable-uploads/97c3584d-6373-4f1c-b0cd-cc57f27b09f6.png', // SynqType preview image
  'Monad Collab Code': '/lovable-uploads/c086c8f1-7895-4d9e-8acd-760ab4087d4f.png', // Monad Collab Code preview image
  'Tamagotchi Monad': '/lovable-uploads/a4bd0df8-0486-4602-903d-5be2988888b7.png', // Tamagotchi Monad preview image
  'Monad Together': '/lovable-uploads/a33e623e-e777-473f-81b5-9813e7c3b648.png', // Monad Together preview image
  'RockSynq App': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png', // Using new fallback image for Mission 6
  'Novee Chess': '/lovable-uploads/a667635c-049d-4876-9c3b-0aaa6ee5ee06.png', // Novee Chess preview image
  'BattleSynq': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png', // Using new fallback image for Mission 6
  
  // Community projects
  'Monsweeper': '/lovable-uploads/5343360c-be7b-4027-aef9-bc883105fdae.png',
  'Retrieve NFT holders': '/lovable-uploads/e218523f-dcbb-42dd-99d7-b16afb055793.png', // Using uploaded Retrieve NFT holders image
  'MonGPT': '/lovable-uploads/mongpt-placeholder.png', // MonGPT project
  'Monad AI Assistant': projectGaming, // Using gaming image as fallback for AI assistant
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

      const formattedProjects: Project[] = (data || []).map(project => {
        let thumbnail = project.thumbnail;
        
        // Use local image if available
        if (projectImageMap[project.name]) {
          thumbnail = projectImageMap[project.name];
        } 
        // For Mission 5 projects without live URL and with GitHub URL, use GitHub preview
        else if (project.mission === "Make NFTs Great Again (Mission 5)" && 
                 !project.live_url && 
                 project.github_url) {
          const githubPreview = getGithubPreviewImage(project.github_url);
          if (githubPreview) {
            thumbnail = githubPreview;
          }
        }

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          builder: {
            name: project.builder_name,
            discord: project.builder_discord,
            twitter: project.builder_twitter || undefined,
          },
          thumbnail,
          githubUrl: project.github_url,
          liveUrl: project.live_url,
          tags: project.tags || [],
          mission: project.mission,
        };
      });

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
