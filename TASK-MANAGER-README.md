# 🚀 Task Manager Pro - Notion-Inspired Workspace

A powerful, feature-rich task management application inspired by Notion's modular design and flexibility. Built with vanilla JavaScript, HTML, and CSS.

## ✨ Key Features

### 🎯 Core Functionality
- **Multiple Database Views**: Switch between List, Kanban, Calendar, and Timeline views
- **Advanced Filtering**: Filter by categories (Work, Personal, Shopping, Health) and priority labels
- **Smart Sorting**: Sort by due date, priority, or creation date
- **Rich Task Properties**: Title, description, category, status, priority, tags, and due dates
- **Local Storage**: All data persists automatically in your browser

### 📊 View Types

#### 1. **List View** (Default)
- Traditional task list with full details
- Checkbox to mark complete/incomplete
- Inline edit and delete actions
- Color-coded priority indicators
- Tag display

#### 2. **Kanban Board View**
- Three columns: To Do, In Progress, Completed
- **Drag-and-drop** functionality to move tasks between statuses
- Visual task cards with metadata
- Real-time count updates per column
- Click any card to edit

#### 3. **Calendar View**
- Monthly calendar grid
- Tasks displayed on their due dates
- Navigate between months with arrow buttons
- Today's date highlighted
- Color-coded by priority
- Click tasks to edit

#### 4. **Timeline View**
- Chronological timeline of all tasks
- Visual timeline with colored dots
- Shows task progression over time
- Grouped by due date
- Status indicators (completed/pending)

### 🤖 AI Assistant

A floating AI assistant panel with intelligent features:

#### Quick Actions
- **Suggest Tasks**: Get AI-generated task suggestions based on your categories
- **Auto-Prioritize**: Automatically mark overdue tasks as urgent
- **Summarize**: Get a breakdown of completed tasks by category
- **Organize**: View current workload distribution

#### AI Chat
- Ask questions about your tasks
- Query task counts, overdue items, and due dates
- Natural language processing for common questions
- Examples:
  - "How many tasks do I have?"
  - "What's overdue?"
  - "What's due today?"

### 🏷️ Enhanced Database Properties

Each task includes:
- **Title**: Main task name
- **Description**: Detailed notes (optional)
- **Category**: Work, Personal, Shopping, Health
- **Status**: To Do, In Progress, Completed
- **Priority**: Urgent, Important, Low Priority
- **Tags**: Multiple comma-separated tags for organization
- **Due Date**: Deadline with overdue detection
- **Created Date**: Automatic timestamp

### 🎨 Notion-Like Design

- **Clean, Light Theme**: Inspired by Notion's aesthetic
- **Curved Boxes**: Smooth 8-12px border radius throughout
- **Subtle Shadows**: Minimal depth with professional shadows
- **System Fonts**: Native font stack for crisp rendering
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: 150ms transitions for all interactions

### 📱 Responsive Design

- **Desktop**: Full sidebar + main content layout
- **Tablet**: Stacked layout with collapsible sidebar
- **Mobile**: Single column with optimized touch targets
- **Kanban**: Stacks vertically on mobile
- **Calendar**: Compact grid on smaller screens

## 🎯 Usage Guide

### Adding a Task
1. Fill in the "Add New Task" form
2. Required: Title, Category, Due Date, Status, Priority
3. Optional: Description, Tags (comma-separated)
4. Click "Add Task"

### Switching Views
- Click the view icons in the tasks header:
  - **List** (three lines)
  - **Kanban** (columns)
  - **Calendar** (calendar grid)
  - **Timeline** (horizontal bars)

### Using Kanban Board
1. Switch to Kanban view
2. **Drag any task card** to a different column
3. Task status updates automatically
4. Columns: To Do → In Progress → Completed

### Filtering & Sorting
- **Categories**: Click sidebar buttons to filter by category
- **Labels**: Click priority labels to filter by urgency
- **Sort**: Use dropdown to sort by date or priority
- **Clear Completed**: Remove all finished tasks

### AI Assistant
1. Click the floating **blue button** (bottom-right)
2. Try **Quick Actions** for instant automation
3. Use **AI Chat** to ask questions
4. Examples:
   - "How many overdue tasks?"
   - "What's due today?"
   - Click "Auto-prioritize" to mark overdue as urgent

### Editing Tasks
- **List View**: Click "Edit" button on any task
- **Kanban View**: Click the task card
- **Calendar View**: Click the task name
- **Timeline View**: Click the timeline item
- Modal opens with all fields editable

### Managing Tasks
- **Complete**: Click checkbox in list view or drag to "Completed" in Kanban
- **Delete**: Click "Delete" button (confirmation required)
- **Clear Completed**: Bulk delete all completed tasks

## 🛠️ Technical Implementation

### Architecture
- **Class-Based**: Single `TaskManager` class managing all state
- **Event-Driven**: Listeners for all user interactions
- **Data Persistence**: LocalStorage for automatic saving
- **No Dependencies**: Pure vanilla JavaScript

### Key Technologies
- **HTML5**: Semantic markup with SVG icons
- **CSS3**: Grid, Flexbox, CSS Variables, Animations
- **JavaScript ES6+**: Classes, Arrow Functions, Template Literals
- **LocalStorage API**: Client-side data persistence
- **Drag and Drop API**: Native browser drag-and-drop

### File Structure
```
task-manager.html              # Main HTML structure
task-manager.css               # Complete styling (1300+ lines)
task-manager-enhanced.js       # Full application logic (900+ lines)
```

### Data Model
```javascript
{
  id: "timestamp",
  title: "Task name",
  description: "Details",
  category: "work|personal|shopping|health",
  status: "todo|in-progress|completed",
  label: "urgent|important|low-priority",
  tags: ["tag1", "tag2"],
  dueDate: "YYYY-MM-DD",
  completed: boolean,
  createdAt: timestamp
}
```

## 🎨 Design System

### Colors
- **Primary**: `#2383e2` (Notion blue)
- **Success**: `#0f9960` (green)
- **Warning**: `#f59e0b` (orange)
- **Danger**: `#e03e3e` (red)
- **Background**: `#f7f7f5` (Notion beige-gray)
- **Cards**: `#ffffff` (white)
- **Text**: `#37352f` (dark gray)

### Typography
- **Font**: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Sizes**: 0.75rem - 2rem
- **Weights**: 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 4px
- **Common**: 8px, 12px, 16px, 20px, 24px
- **Large**: 28px, 32px

## 🚀 Future Enhancements

Potential features to add:
- **Subtasks**: Nested task hierarchies
- **Relations**: Link tasks together
- **File Attachments**: Upload files to tasks
- **Collaboration**: Multi-user support
- **Real AI Integration**: Connect to GPT API
- **Export/Import**: JSON, CSV, or Markdown
- **Recurring Tasks**: Automatic task creation
- **Time Tracking**: Log time spent on tasks
- **Notifications**: Browser notifications for due dates
- **Dark Mode**: Theme switcher

## 📝 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎓 Learning Outcomes

This project demonstrates:
- Complex state management without frameworks
- Multiple view rendering from single data source
- Drag-and-drop implementation
- Calendar generation algorithms
- Local storage data persistence
- Responsive CSS Grid and Flexbox layouts
- Clean, maintainable vanilla JavaScript
- Notion-inspired UI/UX design

## 📄 License

Free to use and modify for personal or commercial projects.

---

**Built with ❤️ using Vanilla JavaScript**

No frameworks. No dependencies. Just clean, modern web development.
