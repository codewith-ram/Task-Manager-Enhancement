// Migration Script: LocalStorage to IndexedDB
class DataMigration {
    constructor() {
        this.db = new TaskDatabase();
    }

    async migrate() {
        try {
            console.log('Starting migration from LocalStorage to IndexedDB...');
            
            // Initialize database
            await this.db.init();
            
            // Migrate tasks
            await this.migrateTasks();
            
            // Migrate user
            await this.migrateUser();
            
            // Extract and save tags
            await this.migrateTags();
            
            console.log('Migration completed successfully!');
            return { success: true, message: 'Migration completed' };
            
        } catch (error) {
            console.error('Migration failed:', error);
            return { success: false, message: error.message };
        }
    }

    async migrateTasks() {
        // Get tasks from localStorage
        const tasksJSON = localStorage.getItem('tasks');
        
        if (!tasksJSON) {
            console.log('No tasks found in localStorage');
            return;
        }
        
        const tasks = JSON.parse(tasksJSON);
        console.log(`Found ${tasks.length} tasks to migrate`);
        
        // Add each task to IndexedDB
        for (const task of tasks) {
            try {
                await this.db.addTask(task);
            } catch (error) {
                console.error(`Failed to migrate task ${task.id}:`, error);
            }
        }
        
        console.log('Tasks migrated successfully');
    }

    async migrateUser() {
        // Get user from localStorage
        const userJSON = localStorage.getItem('taskManagerUser');
        
        if (!userJSON) {
            console.log('No user found in localStorage');
            return;
        }
        
        const user = JSON.parse(userJSON);
        console.log(`Migrating user: ${user.email}`);
        
        // Add user to IndexedDB
        await this.db.saveUser(user);
        
        console.log('User migrated successfully');
    }

    async migrateTags() {
        // Get all tasks to extract tags
        const tasks = await this.db.getAllTasks();
        const tagSet = new Set();
        
        // Collect all unique tags
        tasks.forEach(task => {
            if (task.tags && Array.isArray(task.tags)) {
                task.tags.forEach(tag => tagSet.add(tag));
            }
        });
        
        console.log(`Found ${tagSet.size} unique tags`);
        
        // Save each tag
        for (const tag of tagSet) {
            await this.db.saveTag(tag);
        }
        
        console.log('Tags migrated successfully');
    }

    async checkMigrationStatus() {
        await this.db.init();
        
        const tasks = await this.db.getAllTasks();
        const tags = await this.db.getAllTags();
        const stats = await this.db.getStatistics();
        
        return {
            tasksCount: tasks.length,
            tagsCount: tags.length,
            statistics: stats
        };
    }
}

// Auto-migrate on first load
async function autoMigrate() {
    try {
        // Check if migration is needed
        const migrated = localStorage.getItem('migratedToIndexedDB');
        
        if (migrated === 'true') {
            console.log('Data already migrated to IndexedDB');
            return;
        }
        
        // Perform migration
        const migration = new DataMigration();
        const result = await migration.migrate();
        
        if (result.success) {
            // Mark as migrated
            localStorage.setItem('migratedToIndexedDB', 'true');
            console.log('✅ Migration successful!');
            
            // Show status
            const status = await migration.checkMigrationStatus();
            console.log('Migration Status:', status);
        }
        
    } catch (error) {
        console.error('Auto-migration failed:', error);
    }
}
