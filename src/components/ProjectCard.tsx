
import { Github, ExternalLink, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Twitter } from "lucide-react";
import { useProjectInteractions } from "@/hooks/useProjectInteractions";
import StarRating from "@/components/StarRating";
import { cn } from "@/lib/utils";

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
    <div className="group relative h-full">
      {/* Liquid glass background with animated gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary/5 transition-all duration-700 group-hover:shadow-3xl group-hover:shadow-primary/10 group-hover:border-white/30"></div>
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>
      
      <Card className="relative h-full overflow-hidden bg-transparent border-0 shadow-none transform transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-[1.02]">
        {/* Enhanced thumbnail with liquid overlay */}
        <div className="relative overflow-hidden h-48 rounded-t-2xl">
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          />
          
          {/* Liquid glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-glow/10 opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
          
          {/* Floating mission badge */}
          <div className="absolute top-4 left-4 transform -rotate-2 group-hover:rotate-0 transition-all duration-500">
            <Badge className="bg-white/90 backdrop-blur-sm text-primary border-0 shadow-lg font-semibold px-4 py-2 rounded-full">
              {project.mission}
            </Badge>
          </div>
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {project.liveUrl && (
              <Button
                size="sm"
                className="h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0 shadow-xl transition-all duration-300 hover:scale-110"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 text-primary" />
                </a>
              </Button>
            )}
            <Button
              size="sm"
              className={cn(
                "h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0 shadow-xl transition-all duration-300 hover:scale-110",
                isLiked && "bg-red-50/90"
              )}
              onClick={toggleLike}
              disabled={loading}
            >
              <Heart className={cn(
                "h-4 w-4 transition-all duration-300",
                isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
              )} />
            </Button>
          </div>

          {/* Liquid title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
              <h3 className="font-bold text-xl text-white mb-1 drop-shadow-lg">
                {project.name}
              </h3>
            </div>
          </div>
        </div>

        <CardHeader className="relative pb-3 pt-5 px-5">
          <div className="flex items-start justify-between gap-3">
            {/* Enhanced builder info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary-glow/30 blur-sm"></div>
                <Avatar className="relative w-12 h-12 border-2 border-white/30">
                  {avatarUrl && (
                    <AvatarImage 
                      src={avatarUrl} 
                      alt={project.builder.name}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-primary-dark text-white text-sm font-bold border-0">
                    {project.builder.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/90 truncate">
                    {project.builder.name}
                  </span>
                  {project.builder.twitter &&
                    project.builder.twitter.trim().toLowerCase().startsWith("http") && (
                      <a
                        href={project.builder.twitter.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors hover:scale-110 transform duration-200"
                        title="View X profile"
                      >
                        <Twitter className="w-3 h-3" />
                      </a>
                    )}
                </div>
                <span className="text-xs text-muted-foreground/80">
                  @{project.builder.discord}
                </span>
              </div>
            </div>
            
            {/* Enhanced star rating */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              <StarRating
                rating={stats.avg_rating}
                userRating={userRating}
                onRate={rateProject}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pb-4 px-5">
          <p className="text-muted-foreground/90 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Liquid glass tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs py-1.5 px-3 h-7 bg-white/10 backdrop-blur-sm border-white/20 text-foreground/80 hover:bg-white/20 transition-all duration-300 rounded-full transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs py-1.5 px-3 h-7 bg-white/5 backdrop-blur-sm border-white/10 text-muted-foreground/60 rounded-full"
              >
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Liquid glass stats */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground/80">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{stats.views_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{stats.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Github className="w-3 h-3" />
                <span>{stats.rating_count}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative pt-0 px-5 pb-5 flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 rounded-xl text-foreground/80 hover:text-foreground"
            asChild
            disabled={project.mission !== "Mission 2"}
          >
            {project.mission === "Mission 2" ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3 w-3 mr-2" />
                Code
              </a>
            ) : (
              <span className="flex items-center">
                <Github className="h-3 w-3 mr-2" />
                Code
              </span>
            )}
          </Button>
          {project.liveUrl && (
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-primary via-primary-glow to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-500 shadow-xl hover:shadow-2xl rounded-xl transform hover:scale-105 border-0"
              asChild
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectCard;
