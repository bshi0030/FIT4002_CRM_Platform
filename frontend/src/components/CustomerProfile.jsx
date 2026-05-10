import React from 'react';
import './CustomerProfile.css';
import arrowRight from "../assets/arrow-right.svg";
import { FaPen } from "react-icons/fa";

function CustomerProfile() {
  return (
    <div className="customer-profile-container">
      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
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
            <button className="deal-arrow-btn"><img src={arrowRight} alt="arrow right" /></button>
          </div>
          
          <div className="deal-item">
            <div className="deal-info">
              <span className="deal-title">EV charging pilot</span>
              <span className="deal-amount">$12,000</span>
              <span className="deal-status status-won">Won</span>
            </div>
            <button className="deal-arrow-btn"><img src={arrowRight} alt="arrow right" /></button>
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
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <button className="edit-profile-btn">
              <FaPen className="edit-icon" />
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="tabs-container">
          <button className="tab active-tab">Interactions</button>
          <button className="tab">Emails</button>
          <button className="tab">Calls</button>
          <button className="tab">Tasks</button>
          <button className="tab">Files</button>
          <button className="tab">Notes</button>
        </div>
        
        {/* Interactions List */}
        <div className="interactions-card">
          <div className="interactions-header">
            <h3>All Interactions</h3>
            <button className="log-interaction-btn">+ Log Interaction</button>
          </div>
          
          <div className="interactions-list">
            {/* Item 1 */}
            <div className="interaction-item">
              <div className="interaction-icon-wrapper icon-email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="interaction-content">
                <div className="interaction-meta">
                  <span className="interaction-type type-email">Email</span>
                  <span className="interaction-author">by Hiba Zaman</span>
                </div>
                <p className="interaction-desc">Follow-up email sent on proposal terms and payment schedule</p>
              </div>
              <div className="interaction-time">Today 9:42 AM</div>
            </div>
            
            {/* Item 2 */}
            <div className="interaction-item">
              <div className="interaction-icon-wrapper icon-task">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
              <div className="interaction-content">
                <div className="interaction-meta">
                  <span className="interaction-type type-task">Task</span>
                  <span className="interaction-author">by Hiba Zaman</span>
                </div>
                <p className="interaction-desc">Prepare pricing breakdown — marked complete</p>
              </div>
              <div className="interaction-time">Yesterday 3:15 PM</div>
            </div>
            
            {/* Item 3 */}
            <div className="interaction-item">
              <div className="interaction-icon-wrapper icon-stage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="interaction-content">
                <div className="interaction-meta">
                  <span className="interaction-type type-stage">Stage Change</span>
                  <span className="interaction-author">by System</span>
                </div>
                <p className="interaction-desc">Deal moved from Demo scheduled to Proposal made</p>
              </div>
              <div className="interaction-time">Apr 22 11:00 AM</div>
            </div>
            
            {/* Item 4 */}
            <div className="interaction-item">
              <div className="interaction-icon-wrapper icon-call">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="interaction-content">
                <div className="interaction-meta">
                  <span className="interaction-type type-call">Call</span>
                  <span className="interaction-author">by Hiba Zaman</span>
                </div>
                <p className="interaction-desc">Discovery call — 22 mins. Budget confirmed for Q3. Decision maker is CFO.</p>
              </div>
              <div className="interaction-time">Apr 21 2:00 PM</div>
            </div>
            
            {/* Item 5 */}
            <div className="interaction-item">
              <div className="interaction-icon-wrapper icon-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div className="interaction-content">
                <div className="interaction-meta">
                  <span className="interaction-type type-note">Note</span>
                  <span className="interaction-author">by Hiba Zaman</span>
                </div>
                <p className="interaction-desc">Client prefers monthly billing. Refer all technical questions to their IT lead.</p>
              </div>
              <div className="interaction-time">Apr 19 10:30 AM</div>
            </div>
          </div>
          
          <button className="view-more-btn">View more</button>
        </div>
        
        {/* Files & Documents */}
        <div className="files-card">
          <div className="files-header">
            <h3>Files & Documents</h3>
            <button className="upload-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
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
