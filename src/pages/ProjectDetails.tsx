import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Eye, Heart, Star, Calendar, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Twitter } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useProjectInteractions } from "@/hooks/useProjectInteractions";
import StarRating from "@/components/StarRating";
import UrlVerificationBadge from "@/components/UrlVerificationBadge";
import AvatarWithFallback from "@/components/AvatarWithFallback";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBuilderStats } from "@/hooks/useBuilderStats";

const getMissionDescription = (mission: string) => {
  const descriptions = {
    "Mission 2": "Build Model Context Protocol (MCP) servers to enhance AI capabilities and productivity workflows.",
    "Make NFTs Great Again (Mission 5)": "Create innovative NFT experiences and marketplaces to revolutionize digital ownership.",
    "Visualizer & Dashboard (Mission 4)": "Build comprehensive dashboards and visualization tools for blockchain data analysis.",
    "Break Monad v2: Farcaster Edition": "Develop engaging games and applications integrated with the Farcaster social protocol."
  };
  return descriptions[mission as keyof typeof descriptions] || "Innovative blockchain project pushing the boundaries of decentralized technology.";
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, loading } = useProjects();
  const project = projects.find(p => p.id === id);

  const { 
    stats, 
    isLiked, 
    userRating, 
    loading: interactionLoading, 
    toggleLike, 
    rateProject 
  } = useProjectInteractions(project?.id || '');

  // Fetch builder stats - use discord handle or fallback to name
  const builderIdentifier = project?.builder.discord || project?.builder.name || '';
  const { 
    stats: builderStats, 
    loading: builderLoading 
  } = useBuilderStats(builderIdentifier);

  // Track view when component mounts
  useEffect(() => {
    if (project) {
      // Logic to track project view would go here
      console.log(`Viewing project: ${project.name}`);
    }
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />
        <main className="container px-4 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">⏳</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Loading project...</h3>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />
        <main className="container px-4 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Project not found</h3>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Back to Projects</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      <main className="container px-4 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        {project.name}
                      </CardTitle>
                      <Badge className="bg-primary/90 text-primary-foreground">
                        {project.mission}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {project.description || "An innovative project built by our community."}
                    </p>
                  </div>
                  
                  {/* Interaction Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-10 px-4",
                        isLiked && "bg-red-50 border-red-200"
                      )}
                      onClick={toggleLike}
                      disabled={interactionLoading}
                    >
                      <Heart className={cn(
                        "h-4 w-4 mr-2",
                        isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                      )} />
                      {stats.likes_count}
                    </Button>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {stats.views_count}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Project Image */}
            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={project.thumbnail || '/placeholder.svg'} 
                    alt={project.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </CardContent>
            </Card>

            {/* Mission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Mission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{project.mission}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {getMissionDescription(project.mission)}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <h5 className="font-medium mb-3">Technologies & Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="border-primary/20 text-primary hover:bg-primary/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* URL Verification Section */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.liveUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Live Link URL</span>
                      <UrlVerificationBadge url={project.liveUrl} size="md" />
                    </div>
                  )}
                  {project.githubUrl && (project.mission === "Mission 2" || project.mission === "Break Monad v2: Farcaster Edition") && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Source Code URL</span>
                      <UrlVerificationBadge url={project.githubUrl} size="md" />
                    </div>
                  )}
                  {(!project.liveUrl && !project.githubUrl) && (
                    <p className="text-sm text-muted-foreground">No URLs to verify for this project.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary"
                    asChild
                    disabled={!project.githubUrl}
                  >
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Source Code
                      </a>
                    ) : (
                      <span className="flex items-center">
                        <Github className="w-4 h-4 mr-2" />
                        View Source Code
                      </span>
                    )}
                  </Button>
                  
                  {project.liveUrl && (
                    <Button 
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Builder Info with Twitter profile picture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Builder Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <AvatarWithFallback
                      builderName={project.builder.name}
                      twitterUrl={project.builder.twitter}
                      discordUsername={project.builder.discord}
                      className="w-16 h-16"
                      projectId={project.id}
                    />
                    {/* Twitter verification badge */}
                    {builderStats.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{project.builder.name}</h4>
                      {builderStats.verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {project.builder.discord ? `@${project.builder.discord}` : 'Builder'}
                    </p>
                    
                    {/* Builder Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>{builderStats.totalProjects} projects</span>
                      </div>
                      {builderLoading && (
                        <span className="text-xs">Loading...</span>
                      )}
                    </div>
                    
                    {project.builder.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.builder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Follow on X
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Builder Bio with Twitter priority */}
                {builderStats.bio && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-sm">About the Builder</h5>
                      {builderStats.twitterBio && (
                        <Badge variant="outline" className="text-xs">
                          <Twitter className="w-3 h-3 mr-1" />
                          Twitter
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {builderStats.bio}
                    </p>
                  </div>
                )}

                {/* Show placeholder if no bio available */}
                {!builderStats.bio && !builderLoading && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground italic">
                      Builder bio will appear here when available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{stats.views_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Likes</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{stats.likes_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ratings</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{stats.rating_count}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={stats.avg_rating}
                        userRating={userRating}
                        onRate={rateProject}
                        size="sm"
                      />
                      <span className="font-medium">
                        {stats.avg_rating ? stats.avg_rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
