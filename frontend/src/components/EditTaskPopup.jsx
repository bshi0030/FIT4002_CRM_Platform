import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../styles/TaskBoard.css";
import { updateTask } from "../api/tasks";
import { getUsers } from "../api/users";
import { getCustomers } from "../api/customers";

const EditTaskPopup = ({ task, onClose, refreshTasks }) => {
    const [taskName, setTaskName] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [customer, setCustomer] = useState(task.customer?._id || "");
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(
    task.dueDate
        ? task.dueDate.substring(0,10)
        : ""
);
    const [pipeline, setPipeline] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(
    task.assignedTo.map(user => user._id)
);
useEffect(() => {
    
    getCustomers()
    .then(data => setCustomers(data))
    .catch(console.error);

    console.log("Loading users...");

    getUsers()
        .then(data => {
            console.log("USERS FROM API:", data);
            setUsers(data);
        })
        .catch(err => {
            console.error("Failed to load users:", err);
        });

}, []);

const handleUserSelection = (userId) => {

    setSelectedUsers(prev => {

        if (prev.includes(userId)) {
            return prev.filter(id => id !== userId);
        }

        return [...prev, userId];

    });

};
const handleUpdateTask = async () => {
    try {

const updatedTask = {
    title: taskName,
    description,
    customer,
    priority,
    dueDate,
    assignedTo: selectedUsers
};

const result = await updateTask(task._id, updatedTask);

refreshTasks(result);

onClose();

    } catch (error) {

        console.error("Failed to update task:", error);

    }
};

    return (
        <div className="create-task-overlay">

            <div className="create-task-modal">

                {/* Header */}
                <div className="create-header">

                    <h2>Edit Task</h2>

                    <button
                        className="create-close-btn"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                </div>

                {/* Form */}
                <div className="create-form">

                    {/* Task Title */}
                    <div className="field full">

                        <label>TASK TITLE *</label>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />

                    </div>

                    {/* Description */}
                    <div className="field full">

                        <label>DESCRIPTION (200 WORDS MAX)</label>

                        <textarea
                            rows={5}
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </div>

                    {/* Customer */}
                    <div className="field">

                        <label>CUSTOMER *</label>

                        <input
                            type="text"
                            placeholder="Customer name"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                        />

                    </div>

                    {/* Priority */}
                    <div className="field">

                        <label>PRIORITY *</label>

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>

                    </div>

                    {/* Due Date */}
                    <div className="field">

                        <label>DUE DATE *</label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

                    </div>

                    {/* Pipeline */}
                    <div className="field">

                        <label>PIPELINE STAGE</label>

                        <select
                            value={pipeline}
                            onChange={(e) => setPipeline(e.target.value)}
                        >
                            <option>Select Stage</option>
                            <option>Lead</option>
                            <option>Qualified</option>
                            <option>Proposal</option>
                            <option>Closed</option>
                        </select>

                    </div>

                    {/* Assign Users */}
                    <div className="field full">

                        <label>ASSIGN TO (TEAM MEMBERS)</label>

                        <div className="assign-box">

{
    users.map(user => (

        <label 
            className="member"
            key={user._id}
        >

            <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
            />

            <span>
                {user.fullName}
            </span>

        </label>

    ))
}

                        </div>

<span className="selected-text">
    {selectedUsers.length} assignee(s) selected
</span>

                    </div>

                </div>

                {/* Footer */}
                <div className="create-footer">

<button
    className="create-submit-btn"
    onClick={handleUpdateTask}
>
    Save Changes
</button>

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditTaskPopup;