
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { migrateProjectsToSupabase } from '@/utils/migrateProjects';
import { Database, Upload } from 'lucide-react';

const MigrationButton = () => {
  const [migrating, setMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const results = await migrateProjectsToSupabase();
      
      toast({
        title: "Migration successful!",
        description: `Successfully migrated ${results.length} projects to Supabase`,
      });
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Button 
      onClick={handleMigration}
      disabled={migrating}
      variant="outline"
      className="gap-2"
    >
      {migrating ? (
        <>
          <Upload className="h-4 w-4 animate-spin" />
          Migrating...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Migrate Projects to Supabase
        </>
      )}
    </Button>
  );
};

export default MigrationButton;
