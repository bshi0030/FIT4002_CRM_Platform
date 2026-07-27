import React, { useEffect, useState } from 'react';
import { FiX, FiSend } from "react-icons/fi";
import api from '../api/client';

export function EmailComposer({ customerEmail, customerId, onClose, onEmailSent }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill out the subject and message fields.");
      return;
    }

    setIsSending(true);

    const accessToken = window.localStorage.getItem('google_access_token') || 
                        window.sessionStorage.getItem('accessToken');

    // This is where you would call your Django API later
    const payload = {
      type: "Email",
      details: message, 
      emailSubject: subject || "CRM Update",
      customerEmail: customerEmail,
      googleAccessToken: accessToken
    };
    
    try {
      await api.post(`/customers/${customerId}/interactions`, payload);
      
      if (onEmailSent) {
        onEmailSent();
      }
      
      setSubject("");
      setMessage("");
      onClose();
      
      console.log("Email sent and interaction logged successfully!");
    } catch (err) {
      console.error("Failed to execute live email pipeline:", err);
      alert(err.response?.data?.message || "Could not dispatch email. Ensure your Google account is linked.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="side-panel"> 
      <div className="side-panel-header">
        <h4>Compose Email</h4>
        <button onClick={onClose} className="close-btn" disabled={isSending}><FiX /></button>
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
            disabled={isSending}
            placeholder="Enter email subject..."
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <span className="detail-label">Message:</span>
          <textarea 
            className="edit-textarea"
            style={{minHeight: '150px'}}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            placeholder="Type your email message here..."
          />
        </div>
      </div>

      <div className="side-panel-footer">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSend}>
          <FiSend size={14}/> {isSending ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
}

export default EmailComposer;