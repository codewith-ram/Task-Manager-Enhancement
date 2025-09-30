// IndexedDB Database Manager for Task Manager Pro
class TaskDatabase {
    constructor() {
        this.dbName = 'TaskManagerDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                console.log('Database upgrade needed');

                // Create Tasks object store
                if (!this.db.objectStoreNames.contains('tasks')) {
                    const taskStore = this.db.createObjectStore('tasks', { 
                        keyPath: 'id',
                        autoIncrement: false 
                    });

                    // Create indexes for efficient querying
                    taskStore.createIndex('category', 'category', { unique: false });
                    taskStore.createIndex('status', 'status', { unique: false });
                    taskStore.createIndex('label', 'label', { unique: false });
                    taskStore.createIndex('dueDate', 'dueDate', { unique: false });
                    taskStore.createIndex('completed', 'completed', { unique: false });
                    taskStore.createIndex('createdAt', 'createdAt', { unique: false });
                    taskStore.createIndex('category_status', ['category', 'status'], { unique: false });
                    
                    console.log('Tasks object store created');
                }

                // Create Users object store
                if (!this.db.objectStoreNames.contains('users')) {
                    const userStore = this.db.createObjectStore('users', { 
                        keyPath: 'email' 
                    });

                    userStore.createIndex('name', 'name', { unique: false });
                    userStore.createIndex('loginTime', 'loginTime', { unique: false });
                    
                    console.log('Users object store created');
                }

                // Create Categories object store
                if (!this.db.objectStoreNames.contains('categories')) {
                    const categoryStore = this.db.createObjectStore('categories', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });

                    categoryStore.createIndex('name', 'name', { unique: true });
                    
                    console.log('Categories object store created');
                }

                // Create Tags object store
                if (!this.db.objectStoreNames.contains('tags')) {
                    const tagStore = this.db.createObjectStore('tags', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });

                    tagStore.createIndex('name', 'name', { unique: true });
                    tagStore.createIndex('count', 'count', { unique: false });
                    
                    console.log('Tags object store created');
                }

                // Create Activity Log object store
                if (!this.db.objectStoreNames.contains('activityLog')) {
                    const logStore = this.db.createObjectStore('activityLog', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });

                    logStore.createIndex('timestamp', 'timestamp', { unique: false });
                    logStore.createIndex('action', 'action', { unique: false });
                    logStore.createIndex('taskId', 'taskId', { unique: false });
                    
                    console.log('Activity Log object store created');
                }
            };
        });
    }

    // TASKS CRUD Operations

    // Create/Add Task
    async addTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');
            
            const request = store.add(task);

            request.onsuccess = () => {
                this.logActivity('create', task.id, `Created task: ${task.title}`);
                resolve(task.id);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Read/Get Task by ID
    async getTask(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get All Tasks
    async getAllTasks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update Task
    async updateTask(task) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');
            const request = store.put(task);

            request.onsuccess = () => {
                this.logActivity('update', task.id, `Updated task: ${task.title}`);
                resolve(task.id);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete Task
    async deleteTask(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');
            const request = store.delete(id);

            request.onsuccess = () => {
                this.logActivity('delete', id, `Deleted task`);
                resolve(id);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Query Tasks by Category
    async getTasksByCategory(category) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Query Tasks by Status
    async getTasksByStatus(status) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('status');
            const request = index.getAll(status);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Query Tasks by Category and Status
    async getTasksByCategoryAndStatus(category, status) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('category_status');
            const request = index.getAll([category, status]);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get Completed Tasks
    async getCompletedTasks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('completed');
            const request = index.getAll(true);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get Overdue Tasks
    async getOverdueTasks() {
        const allTasks = await this.getAllTasks();
        const today = new Date().toISOString().split('T')[0];
        
        return allTasks.filter(task => 
            !task.completed && 
            task.dueDate < today
        );
    }

    // Search Tasks
    async searchTasks(searchTerm) {
        const allTasks = await this.getAllTasks();
        const term = searchTerm.toLowerCase();
        
        return allTasks.filter(task => 
            task.title.toLowerCase().includes(term) ||
            (task.description && task.description.toLowerCase().includes(term)) ||
            (task.tags && task.tags.some(tag => tag.toLowerCase().includes(term)))
        );
    }

    // Bulk Delete Completed Tasks
    async deleteCompletedTasks() {
        const completedTasks = await this.getCompletedTasks();
        const deletePromises = completedTasks.map(task => this.deleteTask(task.id));
        return Promise.all(deletePromises);
    }

    // USER Operations

    // Save User
    async saveUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.put(user);

            request.onsuccess = () => {
                resolve(user.email);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get User
    async getUser(email) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(email);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // TAGS Operations

    // Add or Update Tag
    async saveTag(tagName) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if tag exists
                const existingTag = await this.getTagByName(tagName);
                
                const transaction = this.db.transaction(['tags'], 'readwrite');
                const store = transaction.objectStore('tags');
                
                if (existingTag) {
                    // Update count
                    existingTag.count++;
                    const request = store.put(existingTag);
                    request.onsuccess = () => resolve(existingTag.id);
                } else {
                    // Create new tag
                    const newTag = {
                        name: tagName,
                        count: 1,
                        createdAt: new Date().toISOString()
                    };
                    const request = store.add(newTag);
                    request.onsuccess = () => resolve(request.result);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Get Tag by Name
    async getTagByName(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tags'], 'readonly');
            const store = transaction.objectStore('tags');
            const index = store.index('name');
            const request = index.get(name);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get All Tags
    async getAllTags() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['tags'], 'readonly');
            const store = transaction.objectStore('tags');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ACTIVITY LOG Operations

    // Log Activity
    async logActivity(action, taskId, description) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activityLog'], 'readwrite');
            const store = transaction.objectStore('activityLog');
            
            const log = {
                action: action,
                taskId: taskId,
                description: description,
                timestamp: new Date().toISOString()
            };
            
            const request = store.add(log);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get Recent Activity
    async getRecentActivity(limit = 50) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['activityLog'], 'readonly');
            const store = transaction.objectStore('activityLog');
            const index = store.index('timestamp');
            
            const request = index.openCursor(null, 'prev');
            const results = [];
            let count = 0;

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    results.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // STATISTICS

    // Get Task Statistics
    async getStatistics() {
        const allTasks = await this.getAllTasks();
        
        return {
            total: allTasks.length,
            completed: allTasks.filter(t => t.completed).length,
            pending: allTasks.filter(t => !t.completed).length,
            overdue: allTasks.filter(t => !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length,
            byCategory: {
                work: allTasks.filter(t => t.category === 'work').length,
                personal: allTasks.filter(t => t.category === 'personal').length,
                shopping: allTasks.filter(t => t.category === 'shopping').length,
                health: allTasks.filter(t => t.category === 'health').length
            },
            byStatus: {
                todo: allTasks.filter(t => t.status === 'todo').length,
                inProgress: allTasks.filter(t => t.status === 'in-progress').length,
                completed: allTasks.filter(t => t.status === 'completed').length
            },
            byPriority: {
                urgent: allTasks.filter(t => t.label === 'urgent').length,
                important: allTasks.filter(t => t.label === 'important').length,
                low: allTasks.filter(t => t.label === 'low-priority').length
            }
        };
    }

    // EXPORT/IMPORT

    // Export all data
    async exportData() {
        const tasks = await this.getAllTasks();
        const tags = await this.getAllTags();
        const activity = await this.getRecentActivity(100);
        
        return {
            tasks: tasks,
            tags: tags,
            activity: activity,
            exportDate: new Date().toISOString(),
            version: this.version
        };
    }

    // Import data
    async importData(data) {
        try {
            // Import tasks
            if (data.tasks && Array.isArray(data.tasks)) {
                for (const task of data.tasks) {
                    await this.addTask(task);
                }
            }
            
            // Import tags
            if (data.tags && Array.isArray(data.tags)) {
                for (const tag of data.tags) {
                    const transaction = this.db.transaction(['tags'], 'readwrite');
                    const store = transaction.objectStore('tags');
                    await new Promise((resolve) => {
                        const request = store.add(tag);
                        request.onsuccess = () => resolve();
                    });
                }
            }
            
            return { success: true, message: 'Data imported successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Clear all data
    async clearAllData() {
        const stores = ['tasks', 'tags', 'activityLog'];
        
        for (const storeName of stores) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.clear();
                
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        return { success: true, message: 'All data cleared' };
    }

    // Close database connection
    close() {
        if (this.db) {
            this.db.close();
            console.log('Database connection closed');
        }
    }

    // Delete entire database
    static async deleteDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase('TaskManagerDB');
            
            request.onsuccess = () => {
                console.log('Database deleted successfully');
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskDatabase;
}
