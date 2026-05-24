import {
  X,
  Mail,
  Phone,
  ExternalLink,
  Building2,
  Calendar,
  ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";

const TaskDetail = ({ task, onClose }) => {

  if (!task) return null;

  const priorityClass =
    task.priority === "High"
      ? "prio-high"
      : task.priority === "Medium"
        ? "prio-medium"
        : "prio-low";

  return (

    <div
      className="task-detail-overlay"
      onClick={onClose}
    >

      <div
        className="task-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          className="close-btn"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <header className="detail-header">

          <h2>{task.title}</h2>

          <p className="subtitle">
            {task.description || "No description provided"}
          </p>

        </header>

        {/* TOP DETAILS */}
        <div className="detail-grid">

          {/* CUSTOMER */}
          <div className="detail-item">

            <label>CUSTOMER</label>

            <div className="item-content">
              <Building2 size={14} />

              {task.customer?.fullName ||
                task.company ||
                "No customer"}
            </div>

          </div>

          {/* PRIORITY */}
          <div className="detail-item">

            <label>PRIORITY</label>

            <span className={`prio-tag ${priorityClass}`}>
              {task.priority}
            </span>

          </div>

          {/* DUE DATE */}
          <div className="detail-item">

            <label>DUE DATE</label>

            <div className="item-content">

              <Calendar size={14} />

              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}

            </div>

          </div>

          {/* ASSIGNEES */}
          <div className="detail-item">

            <label>ASSIGNEES</label>

            <div className="assignee-list">

              {task.assignedTo?.length > 0 ? (

                task.assignedTo.map((person, index) => (

                  <span
                    key={index}
                    className="assignee-pill"
                  >
                    {person.fullName}
                  </span>

                ))

              ) : (

                <span>No assignees</span>

              )}

            </div>

          </div>

        </div>

        {/* PIPELINE */}
        <div className="pipeline-section">

          <label>PIPELINE STAGE</label>

          <div className="pipeline-box">

            <span>
              Current:
              <strong>
                {" "}
                {task.currentStage?.name || "N/A"}
              </strong>
            </span>

            <ArrowRight size={18} />

            <span>
              Next:
              <strong>
                {" "}
                {task.nextStage?.name || "N/A"}
              </strong>
            </span>

          </div>

        </div>

        {/* NAVIGATION LINKS */}
        <div className="task-links">

          {task.customer && (

            <Link to={`/customers/${task.customer._id}`}>

              View Customer

            </Link>

          )}

          {task.deal && (

            <Link to={`/deals/${task.deal._id}`}>

              View Deal

            </Link>

          )}

        </div>

        {/* NOTES */}
        <div className="note-section">

          <label>ADD NOTE OR ACTIVITY</label>

          <div className="note-input-wrapper">

            <select className="note-select">

              <option>Note</option>
              <option>Email</option>
              <option>Call</option>
              <option>Meeting</option>

            </select>

            <input
              type="text"
              placeholder="Add note or activity..."
              className="note-input"
            />

          </div>

        </div>

{/* TIMELINE */}
<div className="activity-section">

  <label>ACTIVITY TIMELINE</label>

  {task.customer?.interactions?.length > 0 ? (
    <div className="timeline-list">

      {task.customer.interactions
        .slice()
        .reverse()
        .map((activity, index) => (

          <div key={index} className="timeline-card">

            <div className="timeline-icon">
              {activity.type === "Call" ? (
                <Phone size={16} />
              ) : (
                <Mail size={16} />
              )}
            </div>

            <div className="timeline-content">

              <div className="timeline-top">
                <span>{activity.type}</span>
                <span>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>

              <div className="timeline-message">
                {activity.details}
              </div>

            </div>

          </div>

        ))}

    </div>

  ) : (
    <p>No activities yet</p>
  )}

</div>
{/* FOOTER */}
<footer className="detail-footer">

  <button className="btn-email">
    <Mail size={16} />
    Send Email
  </button>

  {task.customer && (
    <Link
      to={`/customers/${task.customer._id}`}
      className="btn-profile"
    >
      <ExternalLink size={16} />
      View Profile
    </Link>
  )}

</footer>
      </div>

    </div>

  );

};

export default TaskDetail;