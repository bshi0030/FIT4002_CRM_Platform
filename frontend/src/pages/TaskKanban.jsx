import React, { useState } from 'react';
import { Search, Bell, Building2, Calendar, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "../styles/TaskBoard.css";

const COLUMNS = [
  { id: "todo", name: "To Do" },
  { id: "inprogress", name: "In Progress" },
  { id: "completed", name: "Completed" }
];

// MOCK DATA
const TASKS = [
  { id: 1, title: "Follow up with Armc Inc", company: "Armc Inc", date: "Apr 27", priority: "High", status: "todo" },
  { id: 2, title: "Send contract to TechCorp", company: "Deisel Inc", date: "Jan 27", priority: "Low", status: "todo", collaborative: true },
  { id: 3, title: "Product demo GlobalTech", company: "GlobalTech Solutions", date: "Apr 27", priority: "Medium", status: "inprogress", overdue: true },
  { id: 4, title: "Price negotiation with RetailCo", company: "RetailCo", date: "Aug 27", priority: "Medium", status: "completed", collaborative: true },
];

const TaskKanban = () => {
  const [tasks, setTasks] = useState(TASKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // PRIORITY COLORS
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'prio-high';
      case 'Medium': return 'prio-medium';
      case 'Low': return 'prio-low';
      default: return '';
    }
  };

  // DRAG START
  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  // DROP
  const handleDrop = (newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === draggedTaskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  // FILTERING
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" ||
      task.priority.toLowerCase() === filterPriority.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="task-container">

      {/* TOP NAVBAR */}
      <div className="task-navbar">

        <div className="search-wrapper">
          <Search className="search-icon-svg" size={18} />
          <input
            type="text"
            placeholder="Search for task names..."
            className="search-input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => setFilterPriority(value)} defaultValue="all">
          <SelectTrigger className="dropdown-trigger-custom">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="dropdown-content-custom">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <div className="notification-wrapper">
          <Bell size={20} className="bell-icon" />
          <span className="notif-indicator"></span>
        </div>

      </div>

      {/* KANBAN BOARD */}
      <div className="kanban-board-gradient">

        <div className="columns-wrapper">

          {COLUMNS.map(column => (
            <div
              key={column.id}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              <h2 className="column-title">{column.name}</h2>

              <div className="cards-stack">

                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <div
                      key={task.id}
                      className="task-card-item"
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                    >

                      <div className="card-header">
                        <h3 className="task-text-title">{task.title}</h3>
                        <span className={`prio-tag ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="card-body">
                        <Building2 size={14} /> {task.company}
                      </div>

                      <div className="card-footer">
                        <div className={`date-info ${task.overdue ? 'date-overdue' : ''}`}>
                          <Calendar size={14} /> {task.date} {task.overdue && "(Overdue)"}
                        </div>

                        {task.collaborative && (
                          <div className="collab-info">
                            <Users size={16} /> <span className="collab-plus">+1</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}

                {filteredTasks.filter(t => t.status === column.id).length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center mt-4">
                    No tasks found
                  </p>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default TaskKanban;