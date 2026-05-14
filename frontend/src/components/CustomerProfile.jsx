import React, { useState } from 'react';
import './CustomerProfile.css';
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
  // State to track active tab
  const [activeTab, setActiveTab] = useState('Interactions');

  // State for the Detail Modal
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const [allInteractions, setAllInteractions] = useState([
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
                <span className="pill-count">24</span>
                <span className="pill-label">Emails</span>
              </div>
              <div className="summary-pill pill-calls">
                <span className="pill-count">16</span>
                <span className="pill-label">Calls</span>
              </div>
              <div className="summary-pill pill-tasks">
                <span className="pill-count">18</span>
                <span className="pill-label">Tasks</span>
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
            <button className="log-interaction-btn">+ Log Interaction</button>
          </div>
          
          <div className="interactions-content-layout">

            <div className="interactions-list">
              {filteredInteractions.map((item) => (
                <div 
                  className={`interaction-item clickable ${
                    selectedInteraction?.id === item.id ? 'active-item' : ''
                  }`}
                  key={item.id} 
                  onClick={() => setSelectedInteraction(item)} // 4. CLICK TO OPEN MODAL
                >
                  <div className={`interaction-icon-wrapper ${item.className}`}>{item.icon}</div>
                  
                  <div className="interaction-content">
                    <div className="interaction-meta">
                      <span className={`interaction-type ${item.typeClass}`}>{item.type}</span>
                      <span className="interaction-author">by {item.author}</span>
                    </div>
                    <p className="interaction-desc">{item.desc}</p>
                  </div>
                  <div className="interaction-time">{item.time}</div>
                </div>
              ))}
          </div> 

          {/* DETAIL VIEW */}
          {selectedInteraction && (
            <div className="interaction-detail-inline">
              <div className="detail-inline-header">
                <h4>{isEditing ? 'Edit Interaction' : 'Detail View'}</h4>
                <button onClick={() => { setSelectedInteraction(null); setIsEditing(false); }} className="close-btn"><FiX /></button>
              </div>
              
              <div className="detail-inline-body">
                <div className="detail-row">
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

                <div className="detail-row">
                  <strong>Owner:</strong> <span>{selectedInteraction.author}</span>
                </div>
                <div className="detail-row">
                  <strong>Logged:</strong> <span>{selectedInteraction.time}</span>
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

              <div className="detail-inline-footer">
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
          {activeTab === 'Interactions' && <button className="view-more-btn">View more</button>}
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
    </div>
  );
}

export default CustomerProfile;
