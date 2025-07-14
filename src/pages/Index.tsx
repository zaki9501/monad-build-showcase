import React, { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import FilterSidebar from "@/components/FilterSidebar";
import Footer from "@/components/Footer";
import { mockProjects, availableTags } from "@/data/mockProjects";

const Index = () => {
  const [selectedMission, setSelectedMission] = useState("All Missions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
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

      // Tag filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => project.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [selectedMission, searchQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      <main className="container px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <FilterSidebar
              selectedMission={selectedMission}
              onMissionChange={setSelectedMission}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Community Projects
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No projects found
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your filters or search query to find more projects.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
