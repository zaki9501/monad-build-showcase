
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { projects, loading } = useProjects();

  // Debug: Log the actual mission values from the database
  React.useEffect(() => {
    if (projects.length > 0) {
      const uniqueMissions = [...new Set(projects.map(p => p.mission))];
      console.log('Available missions in database:', uniqueMissions);
      console.log('All projects with missions:', projects.map(p => ({ name: p.name, mission: p.mission })));
    }
  }, [projects]);

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Mission filter - debug logging
      console.log(`Filtering project "${project.name}": mission="${project.mission}", selectedMission="${selectedMission}"`);
      
      if (selectedMission !== "All Missions" && project.mission !== selectedMission) {
        console.log(`Project "${project.name}" filtered out by mission`);
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

      // Tag filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => project.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [projects, selectedMission, searchQuery, selectedTags]);

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
  console.log('Available missions for filter:', availableMissions);

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
            </p>
          </div>
          
          {/* View options */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              Grid View
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              List View
            </Button>
          </div>
        </div>

        {/* Enhanced Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
