// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentCategory = 'all';
        this.currentLabel = null;
        this.currentSort = 'date-asc';
        this.editingTaskId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
        this.setMinDate();
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('task-form');
        this.taskTitle = document.getElementById('task-title');
        this.taskCategory = document.getElementById('task-category');
        this.taskDueDate = document.getElementById('task-due-date');
        this.taskLabel = document.getElementById('task-label');
        this.taskDescription = document.getElementById('task-description');

        // Display elements
        this.tasksContainer = document.getElementById('tasks-container');
        this.emptyState = document.getElementById('empty-state');
        this.sectionTitle = document.getElementById('section-title');
        
        // Stats elements
        this.totalTasksEl = document.getElementById('total-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        this.pendingTasksEl = document.getElementById('pending-tasks');

        // Control elements
        this.sortSelect = document.getElementById('sort-select');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        
        // Category buttons
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.labelFilterBtns = document.querySelectorAll('.label-filter-btn');

        // Modal elements
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-task-form');
        this.closeModalBtn = document.getElementById('close-modal');
        this.cancelEditBtn = document.getElementById('cancel-edit');
    }

    attachEventListeners() {
        // Form submission
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        
        // Category filtering
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleCategoryChange(btn));
        });

        // Label filtering
        this.labelFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLabelFilter(btn));
        });

        // Sorting
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Modal controls
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());
        this.editForm.addEventListener('submit', (e) => this.handleEditTask(e));
        
        // Close modal on outside click
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeModal();
            }
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        this.taskDueDate.setAttribute('min', today);
        document.getElementById('edit-task-due-date').setAttribute('min', today);
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const task = {
            id: Date.now().toString(),
            title: this.taskTitle.value.trim(),
            category: this.taskCategory.value,
            dueDate: this.taskDueDate.value,
            label: this.taskLabel.value,
            description: this.taskDescription.value.trim(),
            completed: false,
            createdAt: Date.now()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskForm.reset();
        this.render();
        this.showNotification('Task added successfully!');
    }

    handleEditTask(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('edit-task-id').value;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.title = document.getElementById('edit-task-title').value.trim();
            task.category = document.getElementById('edit-task-category').value;
            task.label = document.getElementById('edit-task-label').value;
            task.dueDate = document.getElementById('edit-task-due-date').value;
            task.description = document.getElementById('edit-task-description').value.trim();
            
            this.saveTasks();
            this.closeModal();
            this.render();
            this.showNotification('Task updated successfully!');
        }
    }

    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-category').value = task.category;
        document.getElementById('edit-task-label').value = task.label;
        document.getElementById('edit-task-due-date').value = task.dueDate;
        document.getElementById('edit-task-description').value = task.description;

        this.editModal.classList.add('show');
    }

    closeModal() {
        this.editModal.classList.remove('show');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.render();
            this.showNotification('Task deleted!');
        }
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
            this.showNotification(`${completedCount} task(s) cleared!`);
        }
    }

    handleCategoryChange(btn) {
        this.categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        
        // Clear label filter when changing category
        this.currentLabel = null;
        this.labelFilterBtns.forEach(b => b.classList.remove('active'));
        
        this.updateSectionTitle();
        this.render();
    }

    handleLabelFilter(btn) {
        const label = btn.dataset.label;
        
        if (this.currentLabel === label) {
            // Deselect if clicking the same label
            this.currentLabel = null;
            btn.classList.remove('active');
        } else {
            // Select new label
            this.labelFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.currentLabel = label;
        }
        
        this.render();
    }

    updateSectionTitle() {
        const categoryNames = {
            all: 'All Tasks',
            work: 'Work Tasks',
            personal: 'Personal Tasks',
            shopping: 'Shopping Tasks',
            health: 'Health Tasks'
        };
        this.sectionTitle.textContent = categoryNames[this.currentCategory] || 'All Tasks';
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentCategory);
        }

        // Filter by label
        if (this.currentLabel) {
            filtered = filtered.filter(t => t.label === this.currentLabel);
        }

        return filtered;
    }

    getSortedTasks(tasks) {
        const sorted = [...tasks];

        switch (this.currentSort) {
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                break;
            case 'date-desc':
                sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
                break;
            case 'priority':
                const priorityOrder = { urgent: 0, important: 1, 'low-priority': 2 };
                sorted.sort((a, b) => priorityOrder[a.label] - priorityOrder[b.label]);
                break;
            case 'created':
                sorted.sort((a, b) => b.createdAt - a.createdAt);
                break;
        }

        return sorted;
    }

    isOverdue(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    getCategoryName(category) {
        const names = {
            work: 'Work',
            personal: 'Personal',
            shopping: 'Shopping',
            health: 'Health'
        };
        return names[category] || category;
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.label} ${task.completed ? 'completed' : ''}`;
        
        const isOverdue = !task.completed && this.isOverdue(task.dueDate);
        
        card.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <div class="task-content">
                <div class="task-header">
                    <div>
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-meta">
                            <span class="task-category">
                                ${this.getCategoryName(task.category)}
                            </span>
                            <span class="task-label ${task.label}">
                                ${task.label.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                            <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                                ${this.formatDate(task.dueDate)}${isOverdue ? ' (Overdue)' : ''}
                            </span>
                        </div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit" data-id="${task.id}" title="Edit">Edit</button>
                <button class="task-action-btn delete" data-id="${task.id}" title="Delete">Delete</button>
            </div>
        `;

        // Attach event listeners
        const checkbox = card.querySelector('.task-checkbox');
        const editBtn = card.querySelector('.edit');
        const deleteBtn = card.querySelector('.delete');

        checkbox.addEventListener('click', () => this.toggleTask(task.id));
        editBtn.addEventListener('click', () => this.openEditModal(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return card;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
    }

    updateCategoryCounts() {
        const counts = {
            all: this.tasks.length,
            work: this.tasks.filter(t => t.category === 'work').length,
            personal: this.tasks.filter(t => t.category === 'personal').length,
            shopping: this.tasks.filter(t => t.category === 'shopping').length,
            health: this.tasks.filter(t => t.category === 'health').length
        };

        Object.keys(counts).forEach(category => {
            const countEl = document.getElementById(`count-${category}`);
            if (countEl) {
                countEl.textContent = counts[category];
            }
        });
    }

    render() {
        // Clear container
        this.tasksContainer.innerHTML = '';

        // Get filtered and sorted tasks
        const filteredTasks = this.getFilteredTasks();
        const sortedTasks = this.getSortedTasks(filteredTasks);

        // Show empty state if no tasks
        if (sortedTasks.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            
            // Render tasks
            sortedTasks.forEach(task => {
                const taskCard = this.createTaskCard(task);
                this.tasksContainer.appendChild(taskCard);
            });
        }

        // Update stats and counts
        this.updateStats();
        this.updateCategoryCounts();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2383e2;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
            font-weight: 500;
            font-size: 0.875rem;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
