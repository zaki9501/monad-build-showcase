
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
  availableMissions?: string[];
}

const FilterSidebar = ({
  selectedMission,
  onMissionChange,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  availableMissions
}: FilterSidebarProps) => {
  // Create a mapping from full mission names to simplified display names
  const getMissionDisplayName = (fullMissionName: string) => {
    if (fullMissionName === "All Missions") return "All Missions";
    
    // Map based on actual mission names from the database
    // Remove Mission 1 mapping entirely - we'll filter it out
    if (fullMissionName === "Mission 2") return "Mission 2";
    if (fullMissionName === "Mission 3") return "Mission 3";
    if (fullMissionName.includes("Mission 4") || fullMissionName.includes("Visualizer & Dashboard")) return "Mission 4";
    if (fullMissionName.includes("Mission 5") || fullMissionName.includes("Make NFTs Great Again")) return "Mission 5";
    
    // Handle any mission that contains "Mission" followed by a number (except Mission 1)
    const missionMatch = fullMissionName.match(/Mission (\d+)/);
    if (missionMatch && missionMatch[1] !== "1") {
      return `Mission ${missionMatch[1]}`;
    }
    
    // Filter out Mission 1 related missions entirely
    if (fullMissionName.includes("Break Monad v2: Farcaster Edition") || fullMissionName.includes("Farcaster Edition")) {
      return null; // This will be filtered out
    }
    
    return fullMissionName; // fallback to original name
  };

  // Filter out missions that should not be displayed (like Mission 1)
  const getValidMissions = (missions: string[]) => {
    return missions.filter(mission => {
      const displayName = getMissionDisplayName(mission);
      return displayName !== null;
    });
  };

  // Sort missions in proper numerical order
  const sortMissions = (missions: string[]) => {
    const validMissions = getValidMissions(missions);
    const allMissions = [...validMissions];
    
    // Separate "All Missions" from the rest
    const allMissionsIndex = allMissions.findIndex(m => m === "All Missions");
    const allMissionsItem = allMissionsIndex !== -1 ? allMissions.splice(allMissionsIndex, 1)[0] : null;
    
    // Sort the remaining missions by extracting mission numbers
    const sortedMissions = allMissions.sort((a, b) => {
      const getNumber = (mission: string) => {
        const displayName = getMissionDisplayName(mission);
        if (!displayName) return 999;
        const match = displayName.match(/Mission (\d+)/);
        return match ? parseInt(match[1]) : 999; // Put non-numbered missions at the end
      };
      
      return getNumber(a) - getNumber(b);
    });
    
    // Put "All Missions" first if it exists
    if (allMissionsItem) {
      return [allMissionsItem, ...sortedMissions];
    }
    
    return sortedMissions;
  };

  // Debug: Log the available missions and their display names
  console.log('Available missions:', availableMissions);
  console.log('Mission display names:', availableMissions?.map(m => ({ original: m, display: getMissionDisplayName(m) })));

  // Get the display name for the currently selected mission
  const selectedMissionDisplay = getMissionDisplayName(selectedMission) || selectedMission;

  // Create mission options with display names but keep original values, sorted properly
  const missionOptions = sortMissions(availableMissions || ["All Missions"]);

  return (
    <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50 mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mission Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mission</label>
            <Select value={selectedMission} onValueChange={onMissionChange}>
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue placeholder="Select mission">
                  {selectedMissionDisplay}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {missionOptions.map((mission) => {
                  const displayName = getMissionDisplayName(mission);
                  if (!displayName) return null;
                  return (
                    <SelectItem key={mission} value={mission}>
                      {displayName}
                    </SelectItem>
                  );
                })}
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
          <div className="space-y-2 md:col-span-2">
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
        </div>

        {/* Clear Filters */}
        {(selectedMission !== "All Missions" || searchQuery || selectedTags.length > 0) && (
          <div className="mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => {
                onMissionChange("All Missions");
                onSearchChange("");
                selectedTags.forEach(tag => onTagToggle(tag));
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
