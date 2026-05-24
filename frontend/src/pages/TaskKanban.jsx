import React, { useState, useEffect } from 'react';
import { Search, Bell, Building2, Calendar, Users } from 'lucide-react';
import NotificationPopup from "./NotificationPopup";
import { getNotifications } from "../api/notifications";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "../styles/TaskBoard.css";
import TaskDetail from "./TaskDetail";
import {
  getTasks,
  updateTaskStatus
} from "../api/tasks";

const COLUMNS = [
  { id: "todo", name: "To Do" },
  { id: "inprogress", name: "In Progress" },
  { id: "completed", name: "Completed" }
];

const TaskKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  
  const unreadCount =
  notifications.filter(n => !n.read).length;


  // PRIORITY COLORS
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "prio-high";

      case "Medium":
        return "prio-medium";

      case "Low":
        return "prio-low";

      default:
        return "";
    }
  };

  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = async (newStatus) => {

    try {
      setTasks(prev =>
        prev.map(task =>
          task._id === draggedTaskId
            ? { ...task, status: newStatus }
            : task
        )
      )
      await updateTaskStatus(
        draggedTaskId,
        newStatus
      )
    } catch (err) {
      console.error(
        "Failed to update task",
        err
      )

    }

  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
  (task.title ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" ||
      task.priority.toLowerCase() === filterPriority.toLowerCase();

    return matchesSearch && matchesPriority;
  });

useEffect(() => {

  getTasks()
    .then(data => {
      console.log("TASKS FROM API:", data);
      setTasks(data);
    })
    .catch(err => console.error("API ERROR:", err));

  getNotifications()
    .then(data => setNotifications(data))
    .catch(err => console.error(err));

}, []);

  return (
    <div className="task-container">

      {/* POPUP */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showNotifications && (
  <NotificationPopup
    onClose={() => setShowNotifications(false)}
  />
)}

      {/* NAVBAR */}
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

        <Select
          onValueChange={(value) => setFilterPriority(value)}
          defaultValue="all"
        >
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

<div
  className="notification-wrapper"
  onClick={() => setShowNotifications(true)}
>
  <Bell size={20} />
  {unreadCount > 0 && (
  <span className="notif-indicator"></span>
)}
</div>

      </div>

      {/* BOARD */}
      <div className="kanban-board-gradient">

        <div className="columns-wrapper">

          {COLUMNS.map(column => (
            <div
              key={column.id}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >

              <h2 className="column-title">
                {column.name}
              </h2>

              <div className="cards-stack">

                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map(task => (

                    <div
                      key={task._id}
                      className="task-card-item"
                      draggable
                      onDragStart={() => handleDragStart(task._id)}
                      onClick={() => setSelectedTask(task)}
                    >

                      <div className="card-header">

                        <h3 className="task-text-title">
                          {task.title}
                        </h3>

                        <span className={`prio-tag ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>

                      </div>

                      <div className="card-body">
                        <Building2 size={14} />
                        {task.company}
                      </div>

                      <div className="card-footer">

                        <div className={`date-info ${task.overdue ? 'date-overdue' : ''}`}>
                          <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()} {task.overdue && "(Overdue)"}
                        </div>

                        {task.assignedTo?.length > 1 && (
                          <div className="collab-info">
                            <Users size={16} />
                            <span className="collab-plus">
                              +{task.assignedTo.length - 1}
                            </span>
                          </div>
                        )}

                      </div>

                    </div>

                  ))}

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default TaskKanban;