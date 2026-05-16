import React, { useState } from 'react';
import { FiX, FiSend } from "react-icons/fi";

function EmailComposer({ customerEmail, onClose, onEmailSent }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill out the subject and message fields.");
      return;
    }

    // This is where you would call your Django API later
    const emailData = { to: customerEmail, subject, message };
    
    // For now, let's simulate a successful send
    console.log("Sending email:", emailData);
    
    // Inform the parent to update the timeline
    // onEmailSent({
    //   type: 'Email',
    //   desc: `Sent: ${subject}`,
    //   author: 'You', // In a real app, this is the logged-in user
    //   time: 'Just now'
    // });

    onEmailSent({ subject, message });
    
    onClose();
  };

  return (
    <div className="side-panel"> {/* Reuse the same CSS class for consistency */}
      <div className="side-panel-header">
        <h4>Compose Email</h4>
        <button onClick={onClose} className="close-btn"><FiX /></button>
      </div>

      <div className="side-panel-body">
        <div className="side-panel-row">
          <span className="detail-label">To:</span>
          <span>{customerEmail}</span>
        </div>
        
        <div className="side-panel-row" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <span className="detail-label">Subject:</span>
          <input 
            type="text" 
            className="edit-input" 
            style={{width: '100%', marginTop: '5px'}}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <span className="detail-label">Message:</span>
          <textarea 
            className="edit-textarea"
            style={{minHeight: '150px'}}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="side-panel-footer">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSend}>
          <FiSend size={14}/> Send Email
        </button>
      </div>
    </div>
  );
}

export default EmailComposer;