
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProjectStats {
  likes_count: number;
  views_count: number;
  avg_rating: number | null;
  rating_count: number;
}

export const useProjectInteractions = (projectId: string) => {
  const [stats, setStats] = useState<ProjectStats>({
    likes_count: 0,
    views_count: 0,
    avg_rating: null,
    rating_count: 0
  });
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get user's IP address for identification
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  };

  // Fetch project stats
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_project_stats', {
        project_uuid: projectId
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setStats({
          likes_count: Number(data[0].likes_count) || 0,
          views_count: Number(data[0].views_count) || 0,
          avg_rating: data[0].avg_rating ? Number(data[0].avg_rating) : null,
          rating_count: Number(data[0].rating_count) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Check if user has liked or rated the project
  const checkUserInteractions = async () => {
    try {
      const userIP = await getUserIP();

      // Check if user has liked
      const { data: likeData } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_ip', userIP)
        .single();

      setIsLiked(!!likeData);

      // Check user's rating
      const { data: ratingData } = await supabase
        .from('project_ratings')
        .select('rating')
        .eq('project_id', projectId)
        .eq('user_ip', userIP)
        .single();

      setUserRating(ratingData?.rating || null);
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  // Track view
  const trackView = async () => {
    try {
      const userIP = await getUserIP();
      
      await supabase
        .from('project_views')
        .insert({
          project_id: projectId,
          user_ip: userIP
        });

      fetchStats();
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  // Toggle like
  const toggleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userIP = await getUserIP();

      if (isLiked) {
        // Remove like
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_ip', userIP);
        
        setIsLiked(false);
        toast({
          title: "Like removed",
          description: "You've unliked this project",
        });
      } else {
        // Add like
        await supabase
          .from('project_likes')
          .insert({
            project_id: projectId,
            user_ip: userIP
          });
        
        setIsLiked(true);
        toast({
          title: "Project liked!",
          description: "Thanks for showing your support!",
        });
      }

      fetchStats();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rate project
  const rateProject = async (rating: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userIP = await getUserIP();

      if (userRating) {
        // Update existing rating
        await supabase
          .from('project_ratings')
          .update({ rating })
          .eq('project_id', projectId)
          .eq('user_ip', userIP);
      } else {
        // Insert new rating
        await supabase
          .from('project_ratings')
          .insert({
            project_id: projectId,
            user_ip: userIP,
            rating
          });
      }

      setUserRating(rating);
      fetchStats();
      
      toast({
        title: "Rating submitted!",
        description: `You rated this project ${rating} stars`,
      });
    } catch (error) {
      console.error('Error rating project:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    checkUserInteractions();
    trackView(); // Track view when component mounts
  }, [projectId]);

  return {
    stats,
    isLiked,
    userRating,
    loading,
    toggleLike,
    rateProject
  };
};
