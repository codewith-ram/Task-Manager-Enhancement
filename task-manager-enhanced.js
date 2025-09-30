// Enhanced Task Manager Application with Notion-like Features
class TaskManager {
    constructor() {
        // Check authentication
        this.checkAuth();
        
        this.tasks = this.loadTasks();
        this.currentCategory = 'all';
        this.currentLabel = null;
        this.currentSort = 'date-asc';
        this.currentView = 'list';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.draggedTask = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.displayUserInfo();
        this.render();
        this.setMinDate();
    }

    checkAuth() {
        const user = localStorage.getItem('taskManagerUser');
        if (!user) {
            // No user logged in, redirect to login page
            window.location.href = 'login.html';
        }
    }

    displayUserInfo() {
        const userInfoEl = document.getElementById('user-info');
        if (userInfoEl) {
            const user = JSON.parse(localStorage.getItem('taskManagerUser'));
            if (user) {
                const displayName = user.name || user.email.split('@')[0];
                userInfoEl.textContent = `Welcome, ${displayName}`;
            }
        }
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('task-form');
        this.taskTitle = document.getElementById('task-title');
        this.taskCategory = document.getElementById('task-category');
        this.taskDueDate = document.getElementById('task-due-date');
        this.taskStatus = document.getElementById('task-status');
        this.taskLabel = document.getElementById('task-label');
        this.taskTags = document.getElementById('task-tags');
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
        
        // View elements
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.listView = document.getElementById('list-view');
        this.kanbanView = document.getElementById('kanban-view');
        this.calendarView = document.getElementById('calendar-view');
        this.timelineView = document.getElementById('timeline-view');
        
        // Category and filter buttons
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.labelFilterBtns = document.querySelectorAll('.label-filter-btn');

        // Modal elements
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-task-form');
        this.closeModalBtn = document.getElementById('close-modal');
        this.cancelEditBtn = document.getElementById('cancel-edit');

        // AI Assistant elements
        this.aiToggle = document.getElementById('ai-toggle');
        this.aiPanel = document.getElementById('ai-panel');
        this.aiClose = document.getElementById('ai-close');
        this.aiInput = document.getElementById('ai-input');
        this.aiSend = document.getElementById('ai-send');
        this.aiMessages = document.getElementById('ai-messages');
        this.aiActionBtns = document.querySelectorAll('.ai-action-btn');

        // Logout button
        this.logoutBtn = document.getElementById('logout-btn');
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

        // View switching
        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
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

        // AI Assistant
        this.aiToggle.addEventListener('click', () => this.toggleAI());
        this.aiClose.addEventListener('click', () => this.closeAI());
        this.aiSend.addEventListener('click', () => this.sendAIMessage());
        this.aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendAIMessage();
        });
        this.aiActionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleAIAction(btn.dataset.action));
        });

        // Calendar navigation
        const prevMonth = document.getElementById('prev-month');
        const nextMonth = document.getElementById('next-month');
        if (prevMonth) prevMonth.addEventListener('click', () => this.changeMonth(-1));
        if (nextMonth) nextMonth.addEventListener('click', () => this.changeMonth(1));

        // Logout
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('taskManagerUser');
            window.location.href = 'login.html';
        }
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        this.taskDueDate.setAttribute('min', today);
        document.getElementById('edit-task-due-date').setAttribute('min', today);
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const tags = this.taskTags.value.trim()
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const task = {
            id: Date.now().toString(),
            title: this.taskTitle.value.trim(),
            category: this.taskCategory.value,
            dueDate: this.taskDueDate.value,
            status: this.taskStatus.value,
            label: this.taskLabel.value,
            tags: tags,
            description: this.taskDescription.value.trim(),
            completed: this.taskStatus.value === 'completed',
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
            const tags = document.getElementById('edit-task-tags').value.trim()
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            task.title = document.getElementById('edit-task-title').value.trim();
            task.category = document.getElementById('edit-task-category').value;
            task.status = document.getElementById('edit-task-status').value;
            task.label = document.getElementById('edit-task-label').value;
            task.dueDate = document.getElementById('edit-task-due-date').value;
            task.tags = tags;
            task.description = document.getElementById('edit-task-description').value.trim();
            task.completed = task.status === 'completed';
            
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
        document.getElementById('edit-task-status').value = task.status;
        document.getElementById('edit-task-label').value = task.label;
        document.getElementById('edit-task-due-date').value = task.dueDate;
        document.getElementById('edit-task-tags').value = task.tags ? task.tags.join(', ') : '';
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
            task.status = task.completed ? 'completed' : 'todo';
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
        
        this.currentLabel = null;
        this.labelFilterBtns.forEach(b => b.classList.remove('active'));
        
        this.updateSectionTitle();
        this.render();
    }

    handleLabelFilter(btn) {
        const label = btn.dataset.label;
        
        if (this.currentLabel === label) {
            this.currentLabel = null;
            btn.classList.remove('active');
        } else {
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

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        this.viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Hide all views
        document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));

        // Show selected view
        switch(view) {
            case 'list':
                this.listView.classList.add('active');
                break;
            case 'kanban':
                this.kanbanView.classList.add('active');
                this.renderKanban();
                break;
            case 'calendar':
                this.calendarView.classList.add('active');
                this.renderCalendar();
                break;
            case 'timeline':
                this.timelineView.classList.add('active');
                this.renderTimeline();
                break;
        }
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentCategory);
        }

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
        
        const tagsHTML = task.tags && task.tags.length > 0 
            ? `<div class="task-tags">${task.tags.map(tag => `<span class="task-tag">${this.escapeHtml(tag)}</span>`).join('')}</div>`
            : '';
        
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
                        ${tagsHTML}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit" data-id="${task.id}" title="Edit">Edit</button>
                <button class="task-action-btn delete" data-id="${task.id}" title="Delete">Delete</button>
            </div>
        `;

        const checkbox = card.querySelector('.task-checkbox');
        const editBtn = card.querySelector('.edit');
        const deleteBtn = card.querySelector('.delete');

        checkbox.addEventListener('click', () => this.toggleTask(task.id));
        editBtn.addEventListener('click', () => this.openEditModal(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return card;
    }

    // Kanban View
    renderKanban() {
        const filteredTasks = this.getFilteredTasks();
        const columns = {
            'todo': document.getElementById('kanban-todo'),
            'in-progress': document.getElementById('kanban-in-progress'),
            'completed': document.getElementById('kanban-completed')
        };

        // Clear all columns
        Object.values(columns).forEach(col => col.innerHTML = '');

        // Group tasks by status
        const tasksByStatus = {
            'todo': filteredTasks.filter(t => t.status === 'todo'),
            'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
            'completed': filteredTasks.filter(t => t.status === 'completed')
        };

        // Update counts
        document.getElementById('kanban-count-todo').textContent = tasksByStatus['todo'].length;
        document.getElementById('kanban-count-in-progress').textContent = tasksByStatus['in-progress'].length;
        document.getElementById('kanban-count-completed').textContent = tasksByStatus['completed'].length;

        // Render tasks in each column
        Object.keys(tasksByStatus).forEach(status => {
            tasksByStatus[status].forEach(task => {
                const card = this.createKanbanCard(task);
                columns[status].appendChild(card);
            });
        });

        this.setupDragAndDrop();
    }

    createKanbanCard(task) {
        const card = document.createElement('div');
        card.className = `kanban-card ${task.label}`;
        card.draggable = true;
        card.dataset.taskId = task.id;

        const tagsHTML = task.tags && task.tags.length > 0 
            ? task.tags.map(tag => `<span class="task-tag">${this.escapeHtml(tag)}</span>`).join('')
            : '';

        card.innerHTML = `
            <div class="kanban-card-header">
                <div class="kanban-card-title">${this.escapeHtml(task.title)}</div>
                <div class="kanban-card-actions">
                    <button class="kanban-action-btn edit-btn" title="Edit" data-id="${task.id}">✏️</button>
                    <button class="kanban-action-btn delete-btn" title="Delete" data-id="${task.id}">🗑️</button>
                </div>
            </div>
            <div class="kanban-card-meta">
                <span class="task-category">${this.getCategoryName(task.category)}</span>
                <span class="task-label ${task.label}">${task.label.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                <span class="task-due-date">${this.formatDate(task.dueDate)}</span>
            </div>
            ${tagsHTML ? `<div class="task-tags">${tagsHTML}</div>` : ''}
        `;

        // Add event listeners for action buttons
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditModal(task.id);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        return card;
    }

    setupDragAndDrop() {
        const cards = document.querySelectorAll('.kanban-card');
        const columns = document.querySelectorAll('.kanban-tasks');

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                this.draggedTask = card.dataset.taskId;
            });

            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
                this.draggedTask = null;
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingCard = document.querySelector('.dragging');
                column.appendChild(draggingCard);
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedTask) {
                    const newStatus = column.parentElement.dataset.status;
                    this.updateTaskStatus(this.draggedTask, newStatus);
                }
            });
        });
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.completed = newStatus === 'completed';
            this.saveTasks();
            this.renderKanban();
            this.updateStats();
            this.showNotification('Task status updated!');
        }
    }

    // Calendar View
    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthYear = document.getElementById('calendar-month-year');
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        monthYear.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

        const today = new Date();
        const filteredTasks = this.getFilteredTasks();

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = this.createCalendarDay(day, true, false, []);
            calendarGrid.appendChild(dayEl);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const dayTasks = filteredTasks.filter(t => t.dueDate === dateStr);
            
            const dayEl = this.createCalendarDay(day, false, isToday, dayTasks);
            calendarGrid.appendChild(dayEl);
        }

        // Next month days
        const totalCells = calendarGrid.children.length - 7; // Subtract headers
        const remainingCells = 42 - totalCells - 7; // 6 rows * 7 days - headers
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createCalendarDay(day, true, false, []);
            calendarGrid.appendChild(dayEl);
        }
    }

    createCalendarDay(day, otherMonth, isToday, tasks) {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayEl.appendChild(dayNumber);

        tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `calendar-task ${task.label}`;
            taskEl.innerHTML = `
                <span class="calendar-task-title">${this.escapeHtml(task.title)}</span>
                <button class="calendar-task-delete" data-id="${task.id}" title="Delete">×</button>
            `;
            
            // Click to edit
            taskEl.querySelector('.calendar-task-title').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditModal(task.id);
            });
            
            // Delete button
            taskEl.querySelector('.calendar-task-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(task.id);
            });
            
            dayEl.appendChild(taskEl);
        });

        return dayEl;
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    // Timeline View
    renderTimeline() {
        const container = document.getElementById('timeline-container');
        container.innerHTML = '';

        const filteredTasks = this.getFilteredTasks();
        const sortedTasks = this.getSortedTasks(filteredTasks);

        sortedTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `timeline-item ${task.label} ${task.completed ? 'completed' : ''}`;
            
            const tagsHTML = task.tags && task.tags.length > 0 
                ? task.tags.map(tag => `<span class="task-tag">${this.escapeHtml(tag)}</span>`).join('')
                : '';

            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div>
                            <div class="timeline-date">${this.formatDate(task.dueDate)}</div>
                            <div class="timeline-title">${this.escapeHtml(task.title)}</div>
                        </div>
                        <div class="timeline-actions">
                            <button class="timeline-action-btn edit-btn" title="Edit" data-id="${task.id}">Edit</button>
                            <button class="timeline-action-btn delete-btn" title="Delete" data-id="${task.id}">Delete</button>
                        </div>
                    </div>
                    ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                    <div class="timeline-meta">
                        <span class="task-category">${this.getCategoryName(task.category)}</span>
                        <span class="task-label ${task.label}">${task.label.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                        ${tagsHTML ? `<div class="task-tags">${tagsHTML}</div>` : ''}
                    </div>
                </div>
            `;

            // Add event listeners for action buttons
            const editBtn = item.querySelector('.edit-btn');
            const deleteBtn = item.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditModal(task.id);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(task.id);
            });

            container.appendChild(item);
        });
    }

    // AI Assistant
    toggleAI() {
        this.aiPanel.classList.toggle('active');
    }

    closeAI() {
        this.aiPanel.classList.remove('active');
    }

    sendAIMessage() {
        const message = this.aiInput.value.trim();
        if (!message) return;

        this.addAIMessage(message, 'user');
        this.aiInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response, 'assistant');
        }, 500);
    }

    addAIMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ${type}`;
        messageEl.textContent = text;
        this.aiMessages.appendChild(messageEl);
        this.aiMessages.scrollTop = this.aiMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
            const total = this.tasks.length;
            const completed = this.tasks.filter(t => t.completed).length;
            return `You have ${total} total tasks, with ${completed} completed and ${total - completed} pending.`;
        }
        
        if (lowerMessage.includes('overdue')) {
            const overdue = this.tasks.filter(t => !t.completed && this.isOverdue(t.dueDate));
            return `You have ${overdue.length} overdue task(s). ${overdue.length > 0 ? 'Would you like me to prioritize them?' : ''}`;
        }
        
        if (lowerMessage.includes('today') || lowerMessage.includes('due today')) {
            const today = new Date().toISOString().split('T')[0];
            const todayTasks = this.tasks.filter(t => t.dueDate === today && !t.completed);
            return `You have ${todayTasks.length} task(s) due today.`;
        }
        
        return "I can help you manage your tasks. Try asking about overdue tasks, task counts, or tasks due today!";
    }

    handleAIAction(action) {
        switch(action) {
            case 'suggest-tasks':
                this.addAIMessage('Based on your work category, consider adding: "Review project documentation", "Team standup meeting", "Code review"', 'assistant');
                break;
            case 'prioritize':
                const overdue = this.tasks.filter(t => !t.completed && this.isOverdue(t.dueDate));
                if (overdue.length > 0) {
                    overdue.forEach(t => t.label = 'urgent');
                    this.saveTasks();
                    this.render();
                    this.addAIMessage(`Marked ${overdue.length} overdue task(s) as urgent.`, 'assistant');
                } else {
                    this.addAIMessage('No overdue tasks to prioritize!', 'assistant');
                }
                break;
            case 'summarize':
                const completed = this.tasks.filter(t => t.completed);
                const categories = {};
                completed.forEach(t => {
                    categories[t.category] = (categories[t.category] || 0) + 1;
                });
                const summary = Object.entries(categories)
                    .map(([cat, count]) => `${cat}: ${count}`)
                    .join(', ');
                this.addAIMessage(`Completed tasks by category: ${summary}`, 'assistant');
                break;
            case 'organize':
                const byCategory = {};
                this.tasks.filter(t => !t.completed).forEach(t => {
                    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
                });
                const workload = Object.entries(byCategory)
                    .map(([cat, count]) => `${cat}: ${count} tasks`)
                    .join(', ');
                this.addAIMessage(`Current workload: ${workload}`, 'assistant');
                break;
        }
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
        if (this.currentView === 'list') {
            this.tasksContainer.innerHTML = '';

            const filteredTasks = this.getFilteredTasks();
            const sortedTasks = this.getSortedTasks(filteredTasks);

            if (sortedTasks.length === 0) {
                this.emptyState.classList.add('show');
            } else {
                this.emptyState.classList.remove('show');
                
                sortedTasks.forEach(task => {
                    const taskCard = this.createTaskCard(task);
                    this.tasksContainer.appendChild(taskCard);
                });
            }
        } else if (this.currentView === 'kanban') {
            this.renderKanban();
        } else if (this.currentView === 'calendar') {
            this.renderCalendar();
        } else if (this.currentView === 'timeline') {
            this.renderTimeline();
        }

        this.updateStats();
        this.updateCategoryCounts();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
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
