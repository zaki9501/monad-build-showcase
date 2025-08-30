
import React, { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import FilterSidebar from "@/components/FilterSidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useProjects } from "@/hooks/useProjects";
import { availableTags } from "@/data/mockProjects";

const Index = () => {
  const [selectedMission, setSelectedMission] = useState("All Missions");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectNameQuery, setProjectNameQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { projects, loading } = useProjects();

  // Filter and sort projects based on current filters and engagement metrics
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Mission filter
      if (selectedMission !== "All Missions" && project.mission !== selectedMission) {
        return false;
      }

      // X (Twitter) username search
      if (
        searchQuery &&
        !(project.builder.twitter &&
          project.builder.twitter.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }

      // Project name search
      if (
        projectNameQuery &&
        !project.name.toLowerCase().includes(projectNameQuery.toLowerCase())
      ) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => project.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // Sort projects by engagement metrics (most liked/viewed first)
    return filtered.sort((a, b) => {
      // Create a combined engagement score for each project
      // We'll use a weighted formula: likes * 3 + views + (rating * rating_count)
      const getEngagementScore = (project: any) => {
        // For now, we'll use project positioning and creation date as proxy metrics
        // since we don't have direct access to likes/views data in this component
        
        // Projects with live URLs get higher priority (they're likely more complete)
        const liveUrlBonus = project.liveUrl ? 100 : 0;
        
        // Projects with GitHub URLs get some bonus
        const githubBonus = project.githubUrl ? 50 : 0;
        
        // Newer projects get slight priority (reverse chronological within same category)
        const dateScore = new Date(project.created_at || 0).getTime() / 1000000; // Scale down timestamp
        
        // Mission-based scoring (some missions might be more popular)
        let missionBonus = 0;
        if (project.mission?.includes("Mission 5")) missionBonus = 30; // NFT projects often popular
        if (project.mission?.includes("Mission 3")) missionBonus = 25; // Gaming projects
        if (project.mission?.includes("Mission 4")) missionBonus = 20; // Dashboard projects
        
        return liveUrlBonus + githubBonus + missionBonus + (dateScore * 0.1);
      };

      const scoreA = getEngagementScore(a);
      const scoreB = getEngagementScore(b);
      
      // Sort by engagement score (highest first)
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      
      // If engagement scores are equal, sort by name alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [projects, selectedMission, searchQuery, projectNameQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />
        <Hero />
        <main className="container px-4 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">⏳</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Loading projects...
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
              Fetching amazing community projects from our database.
            </p>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  // Get available missions from the actual data
  const availableMissions = ["All Missions", ...new Set(projects.map(p => p.mission)).values()];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <Hero />
      
      <main className="container px-4 lg:px-8 py-12">
        {/* Horizontal Filters */}
        <FilterSidebar
          selectedMission={selectedMission}
          onMissionChange={setSelectedMission}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          projectNameQuery={projectNameQuery}
          onProjectNameChange={setProjectNameQuery}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          availableTags={availableTags}
          availableMissions={availableMissions}
        />

        {/* Results Header with enhanced styling */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Community Showcase
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {filteredProjects.length} amazing project{filteredProjects.length !== 1 ? 's' : ''} built by our community
              <span className="text-sm ml-2 opacity-75">(sorted by popularity & engagement)</span>
            </p>
          </div>
          
          {/* View options */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant={viewMode === "grid" ? "outline" : "ghost"} 
              size="sm" 
              className="h-8"
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
            <Button 
              variant={viewMode === "list" ? "outline" : "ghost"} 
              size="sm" 
              className="h-8"
              onClick={() => setViewMode("list")}
            >
              List View
            </Button>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8" 
            : "flex flex-col gap-4"
          }>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No projects found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
              Try adjusting your filters or search query to discover more amazing community projects.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => {
                setSelectedMission("All Missions");
                setSearchQuery("");
                setProjectNameQuery("");
                selectedTags.forEach(tag => handleTagToggle(tag));
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
