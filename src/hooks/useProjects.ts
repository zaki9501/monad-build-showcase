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
  'Bombandak': '/lovable-uploads/78ab7b38-7933-4bf2-9d20-67c859f51179.png',
  'Solodan NFT Launchpad': '/lovable-uploads/a20c6347-3a7a-446b-af56-0abdafe13824.png',
  
  // Mission 5 projects with live links - using ACTUAL database names and correct images
  'GeoShapes2': '/lovable-uploads/e491f150-846c-4b61-aaaf-2a67fdaceb96.png',
  'ME-INT': '/lovable-uploads/66677f3a-044c-4144-a03b-5f3319ef186a.png',
  'Mon Warrior': '/lovable-uploads/19de8b1a-dc00-4678-8d10-cc770c819b77.png',
  'MonadEvolve': '/lovable-uploads/2bd485a0-7293-4873-ac83-c2534215140a.png',
  'LendHub': '/lovable-uploads/351a2f93-6c33-4163-b8a2-b3e36c859c74.png',
  'Monad Music NFT': '/lovable-uploads/53c45c50-f77e-4e94-ac2a-59185502d4cc.png',
  'MonadPet': '/lovable-uploads/d4067856-810d-44c0-a73a-3af42f3a4708.png',
  'Vibe to Music': '/lovable-uploads/cbd90ab9-0983-49b1-bc7a-d492db640087.png',
  'Create Your Image': '/lovable-uploads/dc598086-6ed1-49b2-b3f9-df92e749dd1b.png',
  'NFT': '/lovable-uploads/6c1253eb-cf8d-40f9-983e-829401571c85.png',
  
  // Mission 5 projects - fixed naming and added missing projects
  'ChronoGlyphs': '/lovable-uploads/f87556b9-8a52-4875-aae7-d80db7bc540f.png',
  "Don't Feed the Beast": '/lovable-uploads/476ab57f-ce59-4f8c-8060-d561112da04f.png', // Fixed: added apostrophe and spaces
  'MONFTAI': '/lovable-uploads/0b268c72-d50c-4465-8ad3-0c2fbc7ebf9c.png', // Using available uploaded image
  'Mondala': '/lovable-uploads/63a55c3b-8363-47b3-ad74-9c7d1cc9e670.png', // Using available uploaded image
  'Monad Mission 5 Platform': '/lovable-uploads/7178febd-7e56-45f5-a8ed-032f21718a9b.png', // Using available uploaded image
  
  // Mission 3 projects
  'Monagayanimals': projectGaming, // Using gaming image for the shooter game
  
  // Mission 6 projects - Multisynq Applications & Games with specific preview images
  'TowerBlocs': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png',
  'Nadoodle': '/lovable-uploads/513849b9-4c34-4e39-b01c-39a74d40fc66.png',
  'Monedio Game': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png',
  'SynqChaos': '/lovable-uploads/28710d0f-5dbc-4046-9bb2-41ba0130953c.png',
  'Pixel Nad': '/lovable-uploads/d755b75f-3bc1-46fc-b6ab-857bf4393ea9.png',
  'Monad Battleship': '/lovable-uploads/97380248-0def-483a-a63d-8b57589d8498.png',
  'Catch the Mouch': '/lovable-uploads/ded4e45f-c3a7-4764-a207-83781926509b.png',
  'Monad Slither': '/lovable-uploads/d55d94c1-b2a5-49d8-9998-f50b27271a1f.png',
  'RPS Game Sync': '/lovable-uploads/ed1401bd-4af7-43c9-91ba-3359bb269ca4.png',
  'ThreeSynq': '/lovable-uploads/5e8204d4-9b0f-48a9-8c48-dd223d517abf.png',
  'Bombermon': '/lovable-uploads/1c47ae42-74b4-4cda-ad1e-4d0e2695ed4f.png',
  'SynqType': '/lovable-uploads/97c3584d-6373-4f1c-b0cd-cc57f27b09f6.png',
  'Monad Collab Code': '/lovable-uploads/c086c8f1-7895-4d9e-8acd-760ab4087d4f.png',
  'Tamagotchi Monad': '/lovable-uploads/a4bd0df8-0486-4602-903d-5be2988888b7.png',
  'Monad Together': '/lovable-uploads/a33e623e-e777-473f-81b5-9813e7c3b648.png',
  'RockSynq App': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png',
  'Novee Chess': '/lovable-uploads/a667635c-049d-4876-9c3b-0aaa6ee5ee06.png',
  'BattleSynq': '/lovable-uploads/a1eb4c4e-e5fd-4f5a-96b2-41060596abdb.png',
  
  // Community projects
  'Monsweeper': '/lovable-uploads/5343360c-be7b-4027-aef9-bc883105fdae.png',
  'Retrieve NFT holders': '/lovable-uploads/e218523f-dcbb-42dd-99d7-b16afb055793.png',
  'MonGPT': '/placeholder.svg',
  'Monad AI Assistant': projectGaming,
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isDev = (import.meta as any)?.env?.DEV === true;
  const debugLog = (...args: unknown[]) => { if (isDev) console.log(...args); };
  const debugWarn = (...args: unknown[]) => { if (isDev) console.warn(...args); };

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
        
        // Enhanced debug logging for Mission 5 projects specifically
        if (project.mission === "Make NFTs Great Again (Mission 5)" && project.live_url) {
          debugLog('🔍 MISSION 5 Project with Live URL:', {
            name: project.name,
            exactName: `"${project.name}"`,
            hasLiveUrl: !!project.live_url,
            liveUrl: project.live_url,
            originalThumbnail: project.thumbnail
          });
        }
        
        // Check if we have a mapped image using exact name match
        const mappedImage = projectImageMap[project.name];
        
        if (mappedImage) {
          thumbnail = mappedImage;
          debugLog('✅ Found exact mapped image for project:', project.name, '→', thumbnail);
        } else if (project.mission === "Make NFTs Great Again (Mission 5)" && project.live_url) {
          debugWarn('❌ NO MAPPED IMAGE for Mission 5 project with live URL:', {
            projectName: project.name,
            exactProjectName: `"${project.name}"`,
            availableKeys: Object.keys(projectImageMap).filter(key => 
              key.toLowerCase().includes('mission') || 
              key.toLowerCase().includes('nft') ||
              key.toLowerCase().includes('geo') ||
              key.toLowerCase().includes('warrior') ||
              key.toLowerCase().includes('evolve')
            )
          });
        }
        
        // For Mission 5 projects without live URL and with GitHub URL, use GitHub preview
        if (project.mission === "Make NFTs Great Again (Mission 5)" && 
            !project.live_url && 
            project.github_url && 
            !mappedImage) {
          const githubPreview = getGithubPreviewImage(project.github_url);
          if (githubPreview) {
            thumbnail = githubPreview;
            debugLog('📸 Using GitHub preview for Mission 5 project:', project.name, '→', thumbnail);
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
