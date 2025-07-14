import { Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Add import for Twitter icon
import { Twitter } from "lucide-react";

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
  // Debug: log the builder twitter value
  console.log("Builder Twitter:", project.builder.twitter);
  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-xs font-medium">
            {project.mission}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Builder Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">
              {project.builder.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {project.builder.name}
          </span>
          {/* X (Twitter) icon with link - robust check */}
          {project.builder.twitter &&
            project.builder.twitter.trim().toLowerCase().startsWith("http") && (
              <a
                href={project.builder.twitter.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
                title="View X profile"
              >
                <Twitter className="w-4 h-4 inline ml-1 align-middle" />
              </a>
            )}
          <span className="text-xs text-muted-foreground">
            @{project.builder.discord}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs py-0 px-2 h-5">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs py-0 px-2 h-5">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 hover:bg-primary/5 hover:border-primary/40"
          asChild
          disabled={project.mission !== "Mission 2"}
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
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary"
            asChild
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Live
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;