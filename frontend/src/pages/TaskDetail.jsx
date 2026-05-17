import {
  X,
  Mail,
  Phone,
  ExternalLink,
  Building2,
  Calendar,
  ArrowRight
} from 'lucide-react';

const TaskDetail = ({ task, onClose }) => {

  if (!task) return null;

  const priorityClass =
    task.priority === "High"
      ? "prio-high"
      : task.priority === "Medium"
      ? "prio-medium"
      : "prio-low";

  return (
    <div className="task-detail-overlay" onClick={onClose}>

      <div
        className="task-detail-panel"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* HEADER */}
        <header className="detail-header">

          <h2>{task.title}</h2>

          <p className="subtitle">
            {task.description}
          </p>

        </header>

        {/* TOP DETAILS */}
        <div className="detail-grid">

          <div className="detail-item">

            <label>CUSTOMER</label>

            <div className="item-content">
              <Building2 size={14} />
              {task.company}
            </div>

          </div>

          <div className="detail-item">

            <label>PRIORITY</label>

            <span className={`prio-tag ${priorityClass}`}>
              {task.priority}
            </span>

          </div>

          <div className="detail-item">

            <label>DUE DATE</label>

            <div className="item-content">
              <Calendar size={14} />
              {task.date}, 2027
            </div>

          </div>

          <div className="detail-item">

            <label>ASSIGNEES</label>

            <div className="assignee-list">

              {task.assignees?.map((person, index) => (
                <span key={index} className="assignee-pill">
                  {person}
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* PIPELINE */}
        <div className="pipeline-section">

          <label>PIPELINE STAGE</label>

          <div className="pipeline-box">

            <span>
              Current: <strong>{task.currentStage}</strong>
            </span>

            <ArrowRight size={18} />

            <span>
              Next: <strong>{task.nextStage}</strong>
            </span>

          </div>

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

          {task.activities?.map((activity, index) => (

            <div key={index} className="activity-item">

              <div className="activity-icon">

                {activity.type === "CALL"
                  ? <Phone size={14} />
                  : <Mail size={14} />
                }

              </div>

              <div className="activity-content">

                <div className="activity-top">

                  <strong>{activity.type}</strong>

                  <span className="activity-date">
                    {activity.date}
                  </span>

                </div>

                <div className="activity-text">
                  {activity.text}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default TaskDetail;