
import { Github, ExternalLink, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Twitter } from "lucide-react";
import { useProjectInteractions } from "@/hooks/useProjectInteractions";
import StarRating from "@/components/StarRating";
import UrlVerificationBadge from "@/components/UrlVerificationBadge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    builder: {
      name: string;
      discord: string;
      twitter?: string;
    };
    thumbnail: string;
    githubUrl: string;
    liveUrl?: string;
    tags: string[];
    mission: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { 
    stats, 
    isLiked, 
    userRating, 
    loading, 
    toggleLike, 
    rateProject 
  } = useProjectInteractions(project.id);

  // Extract Twitter username from URL for avatar
  const getTwitterUsername = (twitterUrl?: string) => {
    if (!twitterUrl) return null;
    const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
    return match ? match[1] : null;
  };

  const twitterUsername = getTwitterUsername(project.builder.twitter);
  const avatarUrl = twitterUsername ? `https://unavatar.io/twitter/${twitterUsername}` : null;

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 backdrop-blur-sm cursor-pointer">
      {/* Make the entire card clickable */}
      <Link to={`/project/${project.id}`} className="block">
        {/* Thumbnail with overlay effects */}
        <div className="relative overflow-hidden h-52">
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Mission badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground font-semibold px-3 py-1 backdrop-blur-sm">
              {project.mission}
            </Badge>
          </div>
          
          {/* URL Verification badges overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {project.liveUrl && (
              <UrlVerificationBadge url={project.liveUrl} size="sm" />
            )}
            {project.githubUrl && project.mission === "Mission 2" && (
              <UrlVerificationBadge url={project.githubUrl} size="sm" />
            )}
          </div>

          {/* Like button moved to top left below mission badge */}
          <div className="absolute top-16 left-3">
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0",
                isLiked && "bg-red-50"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike();
              }}
              disabled={loading}
            >
              <Heart className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              )} />
            </Button>
          </div>

          {/* Quick action buttons overlay - moved like button out of here */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {project.liveUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-lg"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 text-primary" />
                </a>
              </Button>
            )}
          </div>

          {/* Bottom overlay with project name */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-bold text-xl text-white mb-1 group-hover:text-primary-glow transition-colors">
              {project.name}
            </h3>
          </div>
        </div>
      </Link>

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          {/* Builder info with profile picture */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="w-10 h-10">
                {avatarUrl && (
                  <AvatarImage 
                    src={avatarUrl} 
                    alt={project.builder.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-primary-dark text-primary-foreground text-sm font-bold">
                  {project.builder.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground truncate">
                  {project.builder.name}
                </span>
                {/* X (Twitter) icon with link */}
                {project.builder.twitter &&
                  project.builder.twitter.trim().toLowerCase().startsWith("http") && (
                    <a
                      href={project.builder.twitter.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View X profile"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Twitter className="w-3 h-3" />
                    </a>
                  )}
              </div>
              <span className="text-xs text-muted-foreground">
                @{project.builder.discord}
              </span>
            </div>
          </div>
          
          {/* Interactive Star Rating */}
          <div onClick={(e) => e.stopPropagation()}>
            <StarRating
              rating={stats.avg_rating}
              userRating={userRating}
              onRate={rateProject}
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Enhanced tags with better styling */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs py-1 px-3 h-6 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-xs py-1 px-3 h-6 border-muted-foreground/20 text-muted-foreground"
            >
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* URL Verification badges in content */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.liveUrl && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Live Demo:</span>
              <UrlVerificationBadge url={project.liveUrl} size="sm" />
            </div>
          )}
          {project.githubUrl && project.mission === "Mission 2" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Source Code:</span>
              <UrlVerificationBadge url={project.githubUrl} size="sm" />
            </div>
          )}
        </div>

        {/* Real Stats section */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{stats.views_count} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{stats.likes_count} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Github className="w-3 h-3" />
            <span>{stats.rating_count} ratings</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
          asChild
          disabled={project.mission !== "Mission 2"}
          onClick={(e) => e.stopPropagation()}
        >
          {project.mission === "Mission 2" ? (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-3 w-3 mr-1" />
              Code
            </a>
          ) : (
            <span className="flex items-center">
              <Github className="h-3 w-3 mr-1" />
              Code
            </span>
          )}
        </Button>
        {project.liveUrl && (
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
