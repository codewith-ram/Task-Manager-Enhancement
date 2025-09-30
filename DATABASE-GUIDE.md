# 🗄️ Database System Guide - Task Manager Pro

## Overview

Task Manager Pro now includes a robust **IndexedDB** database system for better data management, querying, and performance.

## 🎯 Why IndexedDB?

### Advantages over LocalStorage

| Feature | LocalStorage | IndexedDB |
|---------|-------------|-----------|
| **Storage Limit** | ~5-10 MB | ~50 MB - 1 GB+ |
| **Data Structure** | Key-value only | Complex objects |
| **Indexing** | ❌ No | ✅ Yes |
| **Querying** | ❌ No | ✅ Yes |
| **Transactions** | ❌ No | ✅ Yes |
| **Performance** | Slow for large data | Fast |
| **Async** | ❌ Synchronous | ✅ Asynchronous |

## 📊 Database Structure

### Object Stores (Tables)

#### 1. **Tasks**
Primary storage for all tasks.

```javascript
{
    id: "1234567890",           // Primary Key
    title: "Complete project",
    description: "Details...",
    category: "work",            // Indexed
    status: "in-progress",       // Indexed
    label: "urgent",             // Indexed
    tags: ["project", "urgent"], // Array
    dueDate: "2025-10-15",      // Indexed
    completed: false,            // Indexed
    createdAt: "2025-09-30..."  // Indexed
}
```

**Indexes:**
- `category` - Filter by category
- `status` - Filter by status
- `label` - Filter by priority
- `dueDate` - Sort by due date
- `completed` - Filter completed/pending
- `createdAt` - Sort by creation date
- `category_status` - Compound index

#### 2. **Users**
User authentication and profile data.

```javascript
{
    email: "user@example.com",  // Primary Key
    name: "John Doe",           // Indexed
    loginTime: "2025-09-30...", // Indexed
    rememberMe: true,
    isDemo: false,
    provider: null
}
```

#### 3. **Tags**
Tag management with usage tracking.

```javascript
{
    id: 1,                      // Auto-increment
    name: "urgent",             // Indexed (unique)
    count: 5,                   // Usage count
    createdAt: "2025-09-30..."
}
```

#### 4. **Categories**
Custom categories (future feature).

```javascript
{
    id: 1,                      // Auto-increment
    name: "Work",               // Indexed (unique)
    color: "#2383e2",
    icon: "briefcase"
}
```

#### 5. **Activity Log**
Track all user actions.

```javascript
{
    id: 1,                      // Auto-increment
    action: "create",           // Indexed
    taskId: "1234567890",       // Indexed
    description: "Created task",
    timestamp: "2025-09-30..."  // Indexed
}
```

## 🚀 Usage Examples

### Initialize Database

```javascript
const db = new TaskDatabase();
await db.init();
```

### CRUD Operations

#### Create Task
```javascript
const task = {
    id: Date.now().toString(),
    title: "New Task",
    category: "work",
    status: "todo",
    label: "important",
    tags: ["project", "urgent"],
    dueDate: "2025-10-15",
    completed: false,
    createdAt: new Date().toISOString()
};

await db.addTask(task);
```

#### Read Task
```javascript
// Get single task
const task = await db.getTask("1234567890");

// Get all tasks
const allTasks = await db.getAllTasks();
```

#### Update Task
```javascript
task.title = "Updated Title";
task.status = "completed";
await db.updateTask(task);
```

#### Delete Task
```javascript
await db.deleteTask("1234567890");
```

### Advanced Queries

#### Filter by Category
```javascript
const workTasks = await db.getTasksByCategory('work');
```

#### Filter by Status
```javascript
const inProgressTasks = await db.getTasksByStatus('in-progress');
```

#### Compound Query
```javascript
const workInProgress = await db.getTasksByCategoryAndStatus('work', 'in-progress');
```

#### Get Completed Tasks
```javascript
const completed = await db.getCompletedTasks();
```

#### Get Overdue Tasks
```javascript
const overdue = await db.getOverdueTasks();
```

#### Search Tasks
```javascript
const results = await db.searchTasks('project');
```

### Statistics

```javascript
const stats = await db.getStatistics();
console.log(stats);
/*
{
    total: 25,
    completed: 10,
    pending: 15,
    overdue: 3,
    byCategory: {
        work: 12,
        personal: 8,
        shopping: 3,
        health: 2
    },
    byStatus: {
        todo: 10,
        inProgress: 5,
        completed: 10
    },
    byPriority: {
        urgent: 5,
        important: 12,
        low: 8
    }
}
*/
```

### Tags Management

```javascript
// Save tag (auto-increments count)
await db.saveTag('urgent');

// Get all tags
const tags = await db.getAllTags();

// Get specific tag
const tag = await db.getTagByName('urgent');
```

### Activity Log

```javascript
// Log activity (automatic in CRUD operations)
await db.logActivity('create', taskId, 'Created new task');

// Get recent activity
const recentActivity = await db.getRecentActivity(50);
```

### Export/Import

```javascript
// Export all data
const exportData = await db.exportData();
const json = JSON.stringify(exportData);
// Save to file or send to server

// Import data
const importedData = JSON.parse(json);
await db.importData(importedData);
```

### Clear Data

```javascript
// Clear all data
await db.clearAllData();

// Delete entire database
await TaskDatabase.deleteDatabase();
```

## 🔄 Migration from LocalStorage

### Automatic Migration

The system automatically migrates data from LocalStorage to IndexedDB on first load.

```javascript
// In your app initialization
await autoMigrate();
```

### Manual Migration

```javascript
const migration = new DataMigration();
const result = await migration.migrate();

if (result.success) {
    console.log('Migration successful!');
}
```

### Check Migration Status

```javascript
const migration = new DataMigration();
const status = await migration.checkMigrationStatus();
console.log(status);
```

## 📁 File Structure

```
database.js           # Main database class
migrate-to-db.js      # Migration utilities
DATABASE-GUIDE.md     # This file
```

## 🔧 Integration with Task Manager

### Update task-manager-enhanced.js

Replace LocalStorage methods with IndexedDB:

```javascript
class TaskManager {
    constructor() {
        this.db = new TaskDatabase();
        this.init();
    }

    async init() {
        await this.db.init();
        await this.loadTasks();
    }

    async loadTasks() {
        this.tasks = await this.db.getAllTasks();
        this.render();
    }

    async addTask(task) {
        await this.db.addTask(task);
        await this.loadTasks();
    }

    async updateTask(task) {
        await this.db.updateTask(task);
        await this.loadTasks();
    }

    async deleteTask(id) {
        await this.db.deleteTask(id);
        await this.loadTasks();
    }
}
```

## 🎯 Performance Benefits

### Before (LocalStorage)
```javascript
// Load all tasks
const tasks = JSON.parse(localStorage.getItem('tasks'));

// Filter by category (slow)
const workTasks = tasks.filter(t => t.category === 'work');

// Time: O(n) - Must scan all tasks
```

### After (IndexedDB)
```javascript
// Load tasks by category (fast)
const workTasks = await db.getTasksByCategory('work');

// Time: O(log n) - Uses index
```

## 📊 Storage Capacity

| Browser | IndexedDB Limit |
|---------|----------------|
| Chrome | ~60% of disk space |
| Firefox | ~50% of disk space |
| Safari | ~1 GB |
| Edge | ~60% of disk space |

## 🔒 Security Features

### Data Isolation
- Each origin has separate database
- No cross-origin access
- Secure by default

### Transactions
- ACID compliant
- Automatic rollback on error
- Data integrity guaranteed

## 🛠️ Advanced Features

### Custom Queries

```javascript
// Get tasks due this week
async getTasksDueThisWeek() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const allTasks = await this.getAllTasks();
    return allTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
    });
}
```

### Batch Operations

```javascript
// Bulk update
async bulkUpdateStatus(taskIds, newStatus) {
    const promises = taskIds.map(async id => {
        const task = await this.getTask(id);
        task.status = newStatus;
        return this.updateTask(task);
    });
    
    return Promise.all(promises);
}
```

### Pagination

```javascript
// Get tasks with pagination
async getTasksPaginated(page = 1, limit = 20) {
    const allTasks = await this.getAllTasks();
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
        tasks: allTasks.slice(start, end),
        total: allTasks.length,
        page: page,
        pages: Math.ceil(allTasks.length / limit)
    };
}
```

## 🐛 Error Handling

```javascript
try {
    await db.addTask(task);
} catch (error) {
    if (error.name === 'ConstraintError') {
        console.error('Task with this ID already exists');
    } else if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
    } else {
        console.error('Database error:', error);
    }
}
```

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ 24+ |
| Firefox | ✅ 16+ |
| Safari | ✅ 10+ |
| Edge | ✅ 12+ |
| Opera | ✅ 15+ |

## 🔮 Future Enhancements

### Planned Features
- [ ] Full-text search
- [ ] Data synchronization
- [ ] Offline queue
- [ ] Conflict resolution
- [ ] Backup/restore
- [ ] Data encryption
- [ ] Multi-user support
- [ ] Real-time updates

### SQL-Like Queries
```javascript
// Future: SQL-like syntax
const results = await db.query(`
    SELECT * FROM tasks 
    WHERE category = 'work' 
    AND status = 'in-progress'
    ORDER BY dueDate ASC
    LIMIT 10
`);
```

## 📚 API Reference

### TaskDatabase Class

#### Initialization
- `init()` - Initialize database connection

#### Tasks
- `addTask(task)` - Create new task
- `getTask(id)` - Get task by ID
- `getAllTasks()` - Get all tasks
- `updateTask(task)` - Update existing task
- `deleteTask(id)` - Delete task
- `getTasksByCategory(category)` - Filter by category
- `getTasksByStatus(status)` - Filter by status
- `getTasksByCategoryAndStatus(category, status)` - Compound filter
- `getCompletedTasks()` - Get completed tasks
- `getOverdueTasks()` - Get overdue tasks
- `searchTasks(term)` - Search tasks
- `deleteCompletedTasks()` - Bulk delete completed

#### Users
- `saveUser(user)` - Save user data
- `getUser(email)` - Get user by email

#### Tags
- `saveTag(name)` - Add/update tag
- `getTagByName(name)` - Get tag by name
- `getAllTags()` - Get all tags

#### Activity
- `logActivity(action, taskId, description)` - Log action
- `getRecentActivity(limit)` - Get recent logs

#### Statistics
- `getStatistics()` - Get comprehensive stats

#### Data Management
- `exportData()` - Export all data
- `importData(data)` - Import data
- `clearAllData()` - Clear all data
- `close()` - Close connection
- `deleteDatabase()` - Delete database (static)

## 🎉 Summary

The IndexedDB system provides:

✅ **Better Performance** - Indexed queries
✅ **More Storage** - 50MB to 1GB+
✅ **Advanced Queries** - Filter, search, sort
✅ **Activity Tracking** - Complete audit log
✅ **Statistics** - Real-time analytics
✅ **Export/Import** - Data portability
✅ **Transactions** - Data integrity
✅ **Async Operations** - Non-blocking

**Start using**: Include `database.js` in your HTML and initialize!

---

*Last Updated: 2025-09-30*
*Version: 2.0.0*
