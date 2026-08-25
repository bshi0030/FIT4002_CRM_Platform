import React, { useState, useEffect } from 'react';
import { Search, Bell, Building2, Calendar, Users } from 'lucide-react';
import NotificationPopup from "./NotificationPopup";
import { getNotifications } from "../api/notifications";
import CreateTaskPopup from "../components/TaskPopUp";
import EditTaskPopup from "../components/EditTaskPopup";

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
    updateTaskStatus, deleteTask
} from "../api/tasks";

const COLUMNS = [
    {id: "todo", name: "To Do"},
    {id: "inprogress", name: "In Progress"},
    {id: "completed", name: "Completed"}
];

const TaskKanban = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [selectedTask, setSelectedTask] = useState(null);
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    //confirm-delete state
    const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);

    const handleConfirmDelete = async () => {
    try {
        await deleteTask(confirmDeleteTask._id);
        setTasks(prev => prev.filter(t => t._id !== confirmDeleteTask._id));
        setConfirmDeleteTask(null);
        setSelectedTask(null); // close the detail panel too
    } catch (err) {
        console.error("Failed to delete task", err);
        alert(err.response?.data?.message || 'Failed to delete task');
    }
};


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
                        ? {...task, status: newStatus}
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

            {showCreateTask && (
                <CreateTaskPopup
                    onClose={() => setShowCreateTask(false)}
                    refreshTasks={() => {
                        getTasks()
                            .then(data => setTasks(data))
                            .catch(err => console.error(err));
                    }}
                />
            )}

            {editingTask && (
                <EditTaskPopup
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    refreshTasks={(updatedTask) => {

                        setTasks(prev =>
                            prev.map(task =>
                                task._id === updatedTask._id
                                    ? updatedTask
                                    : task
                            )
                        );

                        setSelectedTask(updatedTask);
                    }}
                />
            )}

{selectedTask && (
    <TaskDetail
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => setEditingTask(task)}
        onDelete={(task) => setConfirmDeleteTask(task)}
    />
)}

{confirmDeleteTask && (
    <div className="modal-overlay" onClick={() => setConfirmDeleteTask(null)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Delete Task</h2>
            <p>Are you sure you want to delete <strong>{confirmDeleteTask.title}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setConfirmDeleteTask(null)}>Cancel</button>
                <button className="btn-submit" onClick={handleConfirmDelete}>Delete</button>
            </div>
        </div>
    </div>
)}

            {showNotifications && (
                <NotificationPopup
                    onClose={() => setShowNotifications(false)}
                />
            )}

            {/* NAVBAR */}
            <div className="task-navbar">

                <div className="search-wrapper">
                    <Search className="search-icon-svg" size={18}/>

                    <input
                        type="text"
                        placeholder="Search for task names..."
                        className="search-input-field"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="create-task-btn"
                    onClick={() => setShowCreateTask(true)}
                >
                    Create Task +
                </button>

                <Select
                    onValueChange={(value) => setFilterPriority(value)}
                    defaultValue="all"
                >
                    <SelectTrigger className="dropdown-trigger-custom">
                        <SelectValue placeholder="Priority"/>
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
                    <Bell size={20}/>
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
                                                <Building2 size={14}/>
                                                {task.company}
                                            </div>

                                            <div className="card-footer">

                                                <div className={`date-info ${task.overdue ? 'date-overdue' : ''}`}>
                                                    <Calendar
                                                        size={14}/> {new Date(task.dueDate).toLocaleDateString()} {task.overdue && "(Overdue)"}
                                                </div>

                                                {task.assignedTo?.length > 1 && (
                                                    <div className="collab-info">
                                                        <Users size={16}/>
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