
import { supabase } from '@/integrations/supabase/client';
import { mockProjects } from '@/data/mockProjects';

export const migrateProjectsToSupabase = async () => {
  console.log('Starting migration of projects to Supabase...');
  
  try {
    // Transform mock projects to match database schema with proper UUIDs
    const projectsToInsert = mockProjects.map(project => ({
      // Generate a proper UUID instead of using string IDs
      name: project.name,
      description: project.description,
      builder_name: project.builder.name,
      builder_discord: project.builder.discord,
      builder_twitter: project.builder.twitter,
      thumbnail: project.thumbnail,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      tags: project.tags,
      mission: project.mission
    }));

    // Insert projects in batches to avoid timeout
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < projectsToInsert.length; i += batchSize) {
      const batch = projectsToInsert.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}...`);
      
      const { data, error } = await supabase
        .from('projects')
        .insert(batch)
        .select();

      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
      
      results.push(...(data || []));
      console.log(`Successfully inserted ${batch.length} projects`);
    }

    console.log(`Migration completed! Total projects migrated: ${results.length}`);
    return results;
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
