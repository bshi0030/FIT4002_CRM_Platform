import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import '../styles/CustomerProfile.css';
import '../styles/InteractionSidePanel.css'
import EmailComposer from '../components/EmailComposer.jsx';
import {
  FiArrowRight,
  FiEdit2,
  FiEdit3,
  FiFolder,
  FiList,
  FiMail,
  FiPhone,
  FiSearch,
  FiUpload,
  FiUser,
  FiX,
  FiTrash2
} from "react-icons/fi";

function CustomerProfile() {
  // const { id } = useParams();
  const id = "6a0197bb20ec4d4f767bfa16";
  // State to track active tab
  const [activeTab, setActiveTab] = useState('Interactions');

  // State for the Detail Modal
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const [isComposingEmail, setIsComposingEmail] = useState(false);
  // State for the Log Interaction Modal
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [newInteractionData, setNewInteractionData] = useState({ type: 'Note', desc: '' });

  const [allInteractions, setAllInteractions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const [mockInteractions, setMockInteractions] = useState([
    {
      id: 1, type: 'Email', 
      icon: <FiMail />, 
      author: 'Hiba Zaman', 
      desc: 'Follow-up email sent on proposal terms and payment schedule',
      time: 'Today 9:42 AM', 
      className: 'icon-email', 
      typeClass: 'type-email'
    },
    {
      id: 2, 
      type: 'Task', 
      icon: <FiList />, 
      author: 'Hiba Zaman', 
      desc: 'Prepare pricing breakdown — marked complete', 
      time: 'Yesterday 3:15 PM', 
      className: 'icon-task', 
      typeClass: 'type-task'
    },
    {
      id: 3, 
      type: 'Stage Change', 
      icon: <FiFolder />, 
      author: 'System', 
      desc: 'Deal moved from Demo scheduled to Proposal made',
      time: 'Apr 22 11:00 AM', 
      className: 'icon-stage', 
      typeClass: 'type-stage'
    },
    {
      id: 4, 
      type: 'Call', 
      icon: <FiPhone />, 
      author: 'Hiba Zaman', 
      desc: 'Discovery call — 22 mins. Budget confirmed for Q3. Decision maker is CFO.',
      time: 'Apr 21 2:00 PM', 
      className: 'icon-call', 
      typeClass: 'type-call'
    },
    {
      id: 5, 
      type: 'Note', 
      icon: <FiEdit3 />, 
      author: 'Hiba Zaman', 
      desc: 'Client prefers monthly billing. Refer all technical questions to their IT lead.',
      time: 'Apr 19 10:30 AM', 
      className: 'icon-note', 
      typeClass: 'type-note'
    },
  ]);

  //GET Request: Load timeline from MongoDB using Axios instance
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await api.get(`/interactions/${id}`);
        setAllInteractions(response.data);
      } catch (error) {
        console.error("Error loading interactions from MongoDB:", error);
      }
    };
    
    if (id) fetchInteractions();
  }, [id]);

  // Helper to dynamically match raw text types to frontend style elements
const getStyleConfig = (type) => {
  switch (type) {
    case 'Email':
      return {
        icon: <FiMail />,
        className: 'icon-email',
        typeClass: 'type-email'
      };
    case 'Task':
      return {
        icon: <FiList />,
        className: 'icon-task',
        typeClass: 'type-task'
      };
    case 'Call':
      return {
        icon: <FiPhone />,
        className: 'icon-call',
        typeClass: 'type-call'
      };
    case 'Note':
      return {
        icon: <FiEdit3 />,
        className: 'icon-note',
        typeClass: 'type-note'
      };
    case 'Stage Change':
    default:
      return {
        icon: <FiFolder />,
        className: 'icon-stage',
        typeClass: 'type-stage'
      };
  }
};

  // Logic to delete an interaction
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      setAllInteractions(allInteractions.filter(item => item.id !== id));
      setSelectedInteraction(null);
    }
  };

  const handleEditClick = () => {
    setEditedData(selectedInteraction); // Load current data into the form
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  // 3. Save changes back to the main list
  const handleSave = () => {
    const updatedList = allInteractions.map((item) =>
      item.id === editedData.id ? editedData : item
    );
    
    setAllInteractions(updatedList); // Update the master list
    setSelectedInteraction(editedData); // Update current view
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Logic for adding a new interaction
  const handleOpenLogModal = () => {
    let defaultType = 'Note';
    if (['Emails', 'Calls', 'Tasks', 'Notes'].includes(activeTab)) {
      const mapping = {
        'Emails': 'Email',
        'Calls': 'Call',
        'Tasks': 'Task',
        'Notes': 'Note'
      };
      defaultType = mapping[activeTab];
    }
    setNewInteractionData({ type: defaultType, desc: '' });
    setIsLoggingModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLoggingModalOpen(false);
  };

  const handleNewInteractionChange = (e) => {
    const { name, value } = e.target;
    setNewInteractionData({ ...newInteractionData, [name]: value });
  };

  const handleSaveNewInteraction = async () => {
    if (!newInteractionData.desc.trim()) {
      alert("Please enter a description.");
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeStamp = `Today ${timeString}`;

    const payload = {
      entityId: id, // Grabbed dynamically from your useParams() hook
      type: newInteractionData.type || 'Note',
      desc: newInteractionData.desc,
      author: 'Hiba Zaman', // Matches your current salesperson session variable
      time: now.toISOString()
    };

    try {
      // 4. Hit the exact same Express endpoint to store it in MongoDB
      const res = await api.post('/interactions/create', payload);
      
      if (res.data.status === 'success') {
        // 5. Inject the raw saved document directly from the database to your timeline state
        setAllInteractions([res.data.data, ...allInteractions]);
        
        // 6. Close the modal on success
        setIsLoggingModalOpen(false);
        
        // 7. Clear the text field state for the next interaction entry
        setNewInteractionData({ type: 'Note', desc: '' });
      }
    } catch (err) {
      console.error("Failed to save new manual interaction to database:", err);
      alert("Server error: Could not save interaction. Please check if your backend is running.");
    }
  };

  const formatInteractionTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const interactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor((today - interactionDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today ${time}`;
    }

    if (diffDays === 1) {
      return `Yesterday ${time}`;
    }

    return `${date.getDate()}/${date.getMonth() + 1} ${time}`;
  };

  //Logic to filter interactions based on tab
  const filteredInteractions = allInteractions.filter(item => {
    if (activeTab === 'Interactions') return true;
    // Map plural tab names to singular types
    const tabMapping = {
      'Emails': 'Email',
      'Calls': 'Call',
      'Tasks': 'Task',
      'Notes': 'Note'
    };
    return item.type === tabMapping[activeTab];
  });

  const visibleInteractions = filteredInteractions.slice(0, visibleCount);
  const hasMoreInteractions = visibleCount < filteredInteractions.length;
  const canViewLess = visibleCount > 5;

  // Calculate dynamic stats
  const emailCount = allInteractions.filter(i => i.type === 'Email').length;
  const callCount = allInteractions.filter(i => i.type === 'Call').length;
  const taskCount = allInteractions.filter(i => i.type === 'Task').length;

  const totalInteractions = allInteractions.length;
  let engagementLevel = 'Low';
  let engagementClass = 'engagement-low';
  if (totalInteractions >= 5) {
    engagementLevel = 'High';
    engagementClass = 'engagement-high';
  } else if (totalInteractions >= 3) {
    engagementLevel = 'Medium';
    engagementClass = 'engagement-medium';
  }

  // Ensure recentInteractionTime is based on the first element (most recent)
  const recentInteractionTime = allInteractions.length > 0 ? allInteractions[0].time : 'No recent activity';

  return (
    <div className="customer-profile-container">

      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar-placeholder">
            <FiUser className="avatar-icon" />
          </div>
          <h2 className="profile-name">John Smith</h2>
          <p className="profile-subtitle">Procurement Manager ·<br/>GreenWatts Ltd</p>
          
          <div className="about-account">
            <h3>About account</h3>
            
            <div className="info-group">
              <span className="info-label">Email</span>
              <span className="info-value email-link">john@greenwatts.com</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Phone</span>
              <span className="info-value">+60 12 345 6789</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Company</span>
              <span className="info-value">GreenWatts Ltd</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Department</span>
              <span className="info-value">Operations</span>
            </div>
            
            <div className="info-group">
              <span className="info-label">Created</span>
              <span className="info-value">April 1, 2026</span>
            </div>
          </div>
        </div>

        {/* Linked Deals Card */}
        <div className="linked-deals-card">
          <h3>Linked Deals</h3>
          
          <div className="deal-item">
            <div className="deal-info">
              <span className="deal-title">Solar grid expansion</span>
              <span className="deal-amount">$48,000</span>
              <span className="deal-status status-proposal">Proposal Made</span>
            </div>
            <button className="deal-arrow-btn" aria-label="View solar grid expansion deal">
              <FiArrowRight />
            </button>
          </div>
          
          <div className="deal-item">
            <div className="deal-info">
              <span className="deal-title">EV charging pilot</span>
              <span className="deal-amount">$12,000</span>
              <span className="deal-status status-won">Won</span>
            </div>
            <button className="deal-arrow-btn" aria-label="View EV charging pilot deal">
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        {/* Top Header / Activity Summary */}
        <div className="activity-header-area">
          <div className="activity-summary-card">
            <h3>Activity Summary</h3>
            <div className="activity-pills">
              <div className="summary-pill pill-emails">
                <span className="pill-count">{emailCount}</span>
                <span className="pill-label">Emails</span>
              </div>
              <div className="summary-pill pill-calls">
                <span className="pill-count">{callCount}</span>
                <span className="pill-label">Calls</span>
              </div>
              <div className="summary-pill pill-tasks">
                <span className="pill-count">{taskCount}</span>
                <span className="pill-label">Tasks</span>
              </div>
            </div>

            <div className="engagement-insights">
              <div className="insight-row">
                <span className="insight-label">Engagement:</span>
                <span className={`insight-badge ${engagementClass}`}>{engagementLevel}</span>
              </div>
              <div className="insight-row">
                <span className="insight-label">Last Active:</span>
                <span className="insight-value">{formatInteractionTime(recentInteractionTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="search-bar">
              <input type="text" placeholder="Search interactions, notes, email and more..." />
              <FiSearch className="search-icon" />
            </div>
            <button className="edit-profile-btn">
              <FiEdit2 className="edit-icon" />
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="tabs-container">
          {['Interactions', 'Emails', 'Calls', 'Tasks', 'Files', 'Notes'].map((name) => (
            <button 
              key={name}
              className={`tab ${activeTab === name ? 'active-tab' : ''}`}
              onClick={() => {
                setActiveTab(name)
                setSelectedInteraction(null);
                setIsEditing(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        
        {/* Interactions List */}
        <div className="interactions-card">
          <div className="interactions-header">
            <h3>{activeTab === 'Interactions' ? 'All Interactions' : activeTab}</h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="log-interaction-btn" onClick={() => setIsComposingEmail(true)}>
                <FiMail /> Send Email
              </button>
              <button className="log-interaction-btn" onClick={handleOpenLogModal}>+ Log Interaction</button>
            </div>
          </div>
          
          <div className="interactions-content-layout">

            <div className="interactions-list">
              {visibleInteractions.map((item) => {

                const config = getStyleConfig(item.type);

                const itemId = item._id || item.id;

                return (
                  <div 
                    className={`interaction-item clickable ${selectedInteraction?.id === item.id ? 'active-item' : ''}`}
                    key={item.id} 
                    onClick={() => setSelectedInteraction(item)} // 4. CLICK TO OPEN MODAL
                  >
                    {/* Uses the generated icon background wrapper style */}
                    <div className={`interaction-icon-wrapper ${config.className}`}>
                      {config.icon}
                    </div>

                    <div className="interaction-content">
                      <div className="interaction-meta">
                        <span className={`interaction-type ${config.typeClass}`}>{item.type}</span>
                        <span className="interaction-author">by {item.author}</span>
                      </div>
                      <p className="interaction-desc">{item.desc}</p>
                    </div>
                    <div className="interaction-time">{formatInteractionTime(item.time)}</div>
                  </div>
                );
              })}
            </div>

            {/* SHOW EITHER DETAIL VIEW OR EMAIL COMPOSER */}
            {isComposingEmail ? (
              <EmailComposer 
                customerEmail="john@greenwatts.com" 
                onClose={() => setIsComposingEmail(false)}
                onEmailSent={async ({ subject, message }) => {

                  // Generate the dynamic timeline timestamp
                  const now = new Date();
                  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const timeStamp = `Today ${timeString}`;

                  const payload = {
                    entityId: id, // Pass the dynamic ID to the backend document
                    type: 'Email',
                    desc: `Sent: ${subject}`,
                    author: 'Hiba Zaman',
                    time: now.toISOString()
                  };

                  try {
                    // Axios automatically serializes JSON objects
                    const res = await api.post('/interactions/create', payload);

                    if (res.data.status === 'success') {
                      // Logic to add the new log to your interaction state
                      setAllInteractions([res.data.data, ...allInteractions]);
                    }
                  } catch (err) {
                    console.error("Failed to post interaction document:", err);
                  }
                }}
              />
              ) : selectedInteraction && (
                <div className="side-panel">
                  <div className="side-panel-header">
                    <h4>{isEditing ? 'Edit Interaction' : 'Detail View'}</h4>
                    <button onClick={() => { setSelectedInteraction(null); setIsEditing(false); }} className="close-btn"><FiX /></button>
                  </div>
              
                <div className="side-panel-body">
                  <div className="side-panel-row">
                    <strong>Activity:</strong> 
                    {isEditing ? (
                      <select name="type" className="edit-select" value={editedData.type} onChange={handleInputChange}>
                        <option value="Email">Email</option>
                        <option value="Call">Call</option>
                        <option value="Task">Task</option>
                        <option value="Note">Note</option>
                      </select>
                    ) : (
                      <span>{selectedInteraction.type}</span>
                    )}
                  </div>

                  <div className="side-panel-row">
                    <strong>Owner:</strong> <span>{selectedInteraction.author}</span>
                  </div>
                  <div className="side-panel-row">
                    <strong>Logged:</strong> <span>{formatInteractionTime(selectedInteraction.time)}</span>
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <strong>Notes:</strong>
                    {isEditing ? (
                      <textarea 
                        name="desc"
                        value={editedData.desc} 
                        onChange={handleInputChange}
                        className="edit-textarea"
                      />
                    ) : (
                      <p style={{ color: '#555', marginTop: '8px', lineHeight: '1.4' }}>
                        {selectedInteraction.desc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="side-panel-footer">
                  {isEditing ? (
                    <>
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      <button className="save-btn" onClick={handleSave}>Save Changes</button>
                    </>
                  ) : (
                    <>
                      <button className="delete-btn-action" onClick={() => handleDelete(selectedInteraction.id)}>
                        <FiTrash2 /> Delete
                      </button>
                      <button className="edit-btn-action" onClick={handleEditClick}>
                        <FiEdit2 /> Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {filteredInteractions.length > 5 && (
            <button
              className="view-more-btn"
              onClick={() => {
                if (hasMoreInteractions) {
                  setVisibleCount((prev) => prev + 5);
                } else {
                  setVisibleCount(5);
                }
              }}
            >
              {hasMoreInteractions ? "View more" : "View less"}
            </button>
          )}
        </div>

        
        {/* Files & Documents */}
        <div className="files-card">
          <div className="files-header">
            <h3>Files & Documents</h3>
            <button className="upload-btn">
              <FiUpload />
              Upload
            </button>
          </div>
          
          <div className="files-list">
            <div className="file-item">
              <div className="file-info">
                <span className="file-name">GreenWatts_Proposal_v2.pdf</span>
                <span className="file-meta">Uploaded Apr 20 - 1.2 MB</span>
              </div>
              <button className="download-btn">Download</button>
            </div>
            <div className="file-item">
              <div className="file-info">
                <span className="file-name">Contract_draft_Apr22.docx</span>
                <span className="file-meta">Uploaded Apr 20 - 1.2 MB</span>
              </div>
              <button className="download-btn">Download</button>
            </div>
          </div>
        </div>
      </div>

      {/* LOG INTERACTION MODAL */}
      {isLoggingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>Log Interaction</h3>
              <button onClick={handleCloseLogModal} className="close-btn"><FiX /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Interaction Type</label>
                <select 
                  name="type" 
                  value={newInteractionData.type} 
                  onChange={handleNewInteractionChange}
                  className="edit-select"
                >
                  <option value="Email">Email</option>
                  <option value="Call">Call</option>
                  <option value="Task">Task</option>
                  <option value="Note">Note</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description / Notes</label>
                <textarea 
                  name="desc"
                  value={newInteractionData.desc} 
                  onChange={handleNewInteractionChange}
                  className="edit-textarea"
                  placeholder="Enter details about this interaction..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseLogModal}>Cancel</button>
              <button className="save-btn" onClick={handleSaveNewInteraction}>Save Interaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerProfile;
