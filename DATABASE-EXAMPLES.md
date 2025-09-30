# 🎯 Database Usage Examples

## Quick Start

### 1. Include Scripts in HTML

```html
<!-- Add before closing </body> tag -->
<script src="database.js"></script>
<script src="sql-query.js"></script>
<script src="migrate-to-db.js"></script>
<script src="task-manager-enhanced.js"></script>
```

### 2. Initialize Database

```javascript
// Create database instance
const db = new TaskDatabase();

// Initialize connection
await db.init();

// Auto-migrate from localStorage
await autoMigrate();
```

## 📝 Basic CRUD Examples

### Create Tasks

```javascript
// Single task
const task = {
    id: Date.now().toString(),
    title: "Complete project documentation",
    description: "Write comprehensive docs",
    category: "work",
    status: "in-progress",
    label: "important",
    tags: ["documentation", "project"],
    dueDate: "2025-10-15",
    completed: false,
    createdAt: new Date().toISOString()
};

await db.addTask(task);
```

### Read Tasks

```javascript
// Get all tasks
const allTasks = await db.getAllTasks();
console.log(`Total tasks: ${allTasks.length}`);

// Get specific task
const task = await db.getTask("1234567890");
console.log(task.title);

// Get by category
const workTasks = await db.getTasksByCategory('work');

// Get by status
const todoTasks = await db.getTasksByStatus('todo');

// Get completed
const completed = await db.getCompletedTasks();

// Get overdue
const overdue = await db.getOverdueTasks();
```

### Update Tasks

```javascript
// Get task
const task = await db.getTask("1234567890");

// Modify
task.status = "completed";
task.completed = true;

// Save
await db.updateTask(task);
```

### Delete Tasks

```javascript
// Delete single task
await db.deleteTask("1234567890");

// Delete all completed
await db.deleteCompletedTasks();
```

## 🔍 Advanced Query Examples

### Using SQL-Like Queries

```javascript
const sql = new SQLQuery(db);

// SELECT * FROM tasks WHERE category = 'work'
const workTasks = await sql.select({
    from: 'tasks',
    where: { category: 'work' }
});

// SELECT * FROM tasks WHERE status = 'in-progress' ORDER BY dueDate ASC
const inProgress = await sql.select({
    from: 'tasks',
    where: { status: 'in-progress' },
    orderBy: 'dueDate ASC'
});

// SELECT * FROM tasks WHERE dueDate > '2025-10-01' LIMIT 10
const upcoming = await sql.select({
    from: 'tasks',
    where: { 
        dueDate: { $gt: '2025-10-01' }
    },
    limit: 10
});
```

### Using Query Builder (Fluent API)

```javascript
// Simple query
const results = await new QueryBuilder(db)
    .from('tasks')
    .where('category', 'work')
    .orderBy('dueDate', 'ASC')
    .limit(10)
    .get();

// Complex query with multiple conditions
const urgentWork = await new QueryBuilder(db)
    .from('tasks')
    .where('category', 'work')
    .and('label', 'urgent')
    .and('completed', false)
    .orderBy('dueDate', 'ASC')
    .get();

// Get first result
const nextTask = await new QueryBuilder(db)
    .from('tasks')
    .where('completed', false)
    .orderBy('dueDate', 'ASC')
    .first();

// Count results
const workCount = await new QueryBuilder(db)
    .from('tasks')
    .where('category', 'work')
    .count();
```

### Search Examples

```javascript
// Search by title or description
const results = await db.searchTasks('project');

// Search with SQL LIKE
const sql = new SQLQuery(db);
const results = await sql.select({
    from: 'tasks',
    where: {
        title: { $like: 'project' }
    }
});

// Search in tags
const results = await sql.select({
    from: 'tasks',
    where: {
        tags: { $contains: 'urgent' }
    }
});
```

## 📊 Statistics & Analytics

### Get Comprehensive Stats

```javascript
const stats = await db.getStatistics();

console.log(`Total: ${stats.total}`);
console.log(`Completed: ${stats.completed}`);
console.log(`Pending: ${stats.pending}`);
console.log(`Overdue: ${stats.overdue}`);

console.log('By Category:', stats.byCategory);
console.log('By Status:', stats.byStatus);
console.log('By Priority:', stats.byPriority);
```

### Custom Analytics

```javascript
// Tasks completed this week
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const sql = new SQLQuery(db);
const completedThisWeek = await sql.select({
    from: 'tasks',
    where: {
        completed: true,
        createdAt: { $gte: oneWeekAgo.toISOString() }
    }
});

console.log(`Completed this week: ${completedThisWeek.length}`);

// Average tasks per category
const allTasks = await db.getAllTasks();
const categories = ['work', 'personal', 'shopping', 'health'];
categories.forEach(cat => {
    const count = allTasks.filter(t => t.category === cat).length;
    console.log(`${cat}: ${count} tasks`);
});
```

### Aggregate Queries

```javascript
const sql = new SQLQuery(db);

// Count tasks by category
const byCategory = await sql.aggregate({
    from: 'tasks',
    groupBy: 'category',
    functions: {
        total: 'COUNT(id)',
        completed: 'SUM(completed)'
    }
});

console.log(byCategory);
/*
[
    { category: 'work', total: 15, completed: 8 },
    { category: 'personal', total: 10, completed: 5 },
    ...
]
*/
```

## 🏷️ Tags Management

```javascript
// Add tags (auto-increments count)
await db.saveTag('urgent');
await db.saveTag('project');
await db.saveTag('meeting');

// Get all tags
const tags = await db.getAllTags();
console.log(tags);
/*
[
    { id: 1, name: 'urgent', count: 5, createdAt: '...' },
    { id: 2, name: 'project', count: 12, createdAt: '...' },
    ...
]
*/

// Get specific tag
const urgentTag = await db.getTagByName('urgent');
console.log(`Urgent tag used ${urgentTag.count} times`);

// Most used tags
const allTags = await db.getAllTags();
const sorted = allTags.sort((a, b) => b.count - a.count);
console.log('Top 5 tags:', sorted.slice(0, 5));
```

## 📝 Activity Logging

```javascript
// Logs are created automatically on CRUD operations
// But you can also log custom activities

await db.logActivity('custom', taskId, 'User viewed task details');

// Get recent activity
const recentActivity = await db.getRecentActivity(20);

recentActivity.forEach(log => {
    console.log(`${log.timestamp}: ${log.action} - ${log.description}`);
});

// Filter activity by action
const sql = new SQLQuery(db);
const createActions = await sql.select({
    from: 'activityLog',
    where: { action: 'create' },
    orderBy: 'timestamp DESC',
    limit: 10
});
```

## 💾 Export & Import

### Export Data

```javascript
// Export all data
const exportData = await db.exportData();

// Convert to JSON
const json = JSON.stringify(exportData, null, 2);

// Download as file
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `tasks-backup-${new Date().toISOString()}.json`;
a.click();
```

### Import Data

```javascript
// Read file
const fileInput = document.getElementById('import-file');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Import
    const result = await db.importData(data);
    
    if (result.success) {
        console.log('Import successful!');
    } else {
        console.error('Import failed:', result.message);
    }
});
```

## 🔄 Data Migration

### Migrate from LocalStorage

```javascript
// Automatic migration
await autoMigrate();

// Manual migration
const migration = new DataMigration();
const result = await migration.migrate();

if (result.success) {
    console.log('✅ Migration complete');
    
    // Check status
    const status = await migration.checkMigrationStatus();
    console.log(`Migrated ${status.tasksCount} tasks`);
    console.log(`Found ${status.tagsCount} tags`);
}
```

## 🧹 Data Management

### Clear Specific Data

```javascript
// Delete all completed tasks
await db.deleteCompletedTasks();

// Delete old activity logs (keep last 100)
const allLogs = await db.getRecentActivity(1000);
const oldLogs = allLogs.slice(100);
// Delete old logs manually
```

### Clear All Data

```javascript
// Clear all data but keep structure
await db.clearAllData();

// Completely delete database
await TaskDatabase.deleteDatabase();
```

## 🎯 Real-World Scenarios

### Scenario 1: Dashboard Statistics

```javascript
async function getDashboardStats() {
    const stats = await db.getStatistics();
    const overdue = await db.getOverdueTasks();
    const recentActivity = await db.getRecentActivity(5);
    
    return {
        overview: {
            total: stats.total,
            completed: stats.completed,
            pending: stats.pending,
            overdue: overdue.length
        },
        categories: stats.byCategory,
        recentActivity: recentActivity.map(log => ({
            action: log.action,
            description: log.description,
            time: new Date(log.timestamp).toLocaleString()
        }))
    };
}

const dashboard = await getDashboardStats();
console.log(dashboard);
```

### Scenario 2: Weekly Report

```javascript
async function getWeeklyReport() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const sql = new SQLQuery(db);
    
    // Tasks created this week
    const created = await sql.select({
        from: 'tasks',
        where: {
            createdAt: { $gte: oneWeekAgo.toISOString() }
        }
    });
    
    // Tasks completed this week
    const completed = created.filter(t => t.completed);
    
    // Overdue tasks
    const overdue = await db.getOverdueTasks();
    
    return {
        week: {
            created: created.length,
            completed: completed.length,
            completionRate: ((completed.length / created.length) * 100).toFixed(1) + '%'
        },
        overdue: overdue.length,
        topCategories: Object.entries(
            created.reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + 1;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1])
    };
}

const report = await getWeeklyReport();
console.log('Weekly Report:', report);
```

### Scenario 3: Task Recommendations

```javascript
async function getTaskRecommendations() {
    const sql = new SQLQuery(db);
    
    // Get urgent incomplete tasks
    const urgent = await sql.select({
        from: 'tasks',
        where: {
            label: 'urgent',
            completed: false
        },
        orderBy: 'dueDate ASC',
        limit: 5
    });
    
    // Get overdue tasks
    const overdue = await db.getOverdueTasks();
    
    // Get tasks due soon (next 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const dueSoon = await sql.select({
        from: 'tasks',
        where: {
            completed: false,
            dueDate: { $lte: threeDaysFromNow.toISOString().split('T')[0] }
        },
        orderBy: 'dueDate ASC'
    });
    
    return {
        urgent: urgent.map(t => t.title),
        overdue: overdue.map(t => t.title),
        dueSoon: dueSoon.map(t => ({
            title: t.title,
            dueDate: t.dueDate
        }))
    };
}

const recommendations = await getTaskRecommendations();
console.log('Recommended tasks:', recommendations);
```

## 🎉 Summary

The database system provides:

✅ **Simple CRUD** - Easy create, read, update, delete
✅ **SQL-Like Queries** - Familiar query syntax
✅ **Fluent API** - Chainable query builder
✅ **Advanced Filtering** - Operators, search, aggregates
✅ **Statistics** - Built-in analytics
✅ **Activity Tracking** - Complete audit log
✅ **Export/Import** - Data portability
✅ **Migration Tools** - Easy upgrade from localStorage

**Start building with the database today!** 🚀

---

*Last Updated: 2025-09-30*
