import { Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  selectedMission: string;
  onMissionChange: (mission: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

const FilterSidebar = ({
  selectedMission,
  onMissionChange,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags
}: FilterSidebarProps) => {
  const missions = [
    "All Missions",
    "Mission 1",
    "Mission 2", 
    "Mission 3",
    "Mission 4",
    "Mission 5"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mission Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mission</label>
            <Select value={selectedMission} onValueChange={onMissionChange}>
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue placeholder="Select mission" />
              </SelectTrigger>
              <SelectContent>
                {missions.map((mission) => (
                  <SelectItem key={mission} value={mission}>
                    {mission}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* X Username Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search by X (Twitter) Username</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="X username..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTags.includes(tag) 
                      ? "bg-primary hover:bg-primary-dark" 
                      : "hover:bg-primary/10 hover:border-primary/40"
                  }`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedMission !== "All Missions" || searchQuery || selectedTags.length > 0) && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                onMissionChange("All Missions");
                onSearchChange("");
                selectedTags.forEach(tag => onTagToggle(tag));
              }}
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">42</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;