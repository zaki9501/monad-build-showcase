
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

  // Get a stable client identifier for anonymous interactions (avoids CORS/rate limits)
  const getClientId = async () => {
    try {
      const storageKey = 'monad_client_fingerprint_v1';
      let clientId = localStorage.getItem(storageKey);
      if (!clientId) {
        clientId = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
        localStorage.setItem(storageKey, clientId);
      }
      return clientId;
    } catch (error) {
      // Fallback to ephemeral ID if storage is unavailable
      return `${Date.now()}-${Math.random()}`;
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

  // Check if user has liked or rated the project using secure functions
  const checkUserInteractions = async () => {
    try {
      const clientId = await getClientId();
      const ipHash = btoa(clientId); // Create hash for secure checking

      // Check if user has liked using secure function
      const { data: likeExists } = await supabase.rpc('check_user_liked_project', {
        project_uuid: projectId,
        user_ip_hash: ipHash
      });

      setIsLiked(likeExists || false);

      // Check user's rating using secure function
      const { data: userRatingValue } = await supabase.rpc('check_user_rated_project', {
        project_uuid: projectId,
        user_ip_hash: ipHash
      });

      setUserRating(userRatingValue && userRatingValue > 0 ? userRatingValue : null);
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  // Track view
  const trackView = async () => {
    try {
      const userIP = await getClientId();
      
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

  // Toggle like using secure function
  const toggleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userIP = await getClientId();

      // Use secure function to toggle like
      const { data: newLikeStatus } = await supabase.rpc('toggle_project_like', {
        project_uuid: projectId,
        user_ip_address: userIP
      });

      setIsLiked(newLikeStatus || false);
      
      if (newLikeStatus) {
        toast({
          title: "Project liked!",
          description: "Thanks for showing your support!",
        });
      } else {
        toast({
          title: "Like removed",
          description: "You've unliked this project",
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

  // Rate project using secure function
  const rateProject = async (rating: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const userIP = await getUserIP();

      // Use secure function to submit rating
      await supabase.rpc('submit_project_rating', {
        project_uuid: projectId,
        user_ip_address: userIP,
        rating_value: rating
      });

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
