import { useState } from "react";
import "../styles/SalesPipeline.css";
import DealCard from "../components/DealCard";

const STAGES = [
  { name: "Qualified", dot: "#A4A4A4" },
  { name: "Contact Made", dot: "#F5C518" },
  { name: "Demo Scheduled", dot: "#4DC9C9" },
  { name: "Proposal Made", dot: "#F5A623" },
  { name: "Negotiation", dot: "#C0392B" },
];

const DUMMY_DEALS = [
  { id: 1, name: "Security Audit Deal", company: "ShieldTech", price: "112K", priority: "High", probability: 70, stage: "Qualified", daysAgo: 3 },
  { id: 2, name: "Marketing Deal", company: "ShieldTech", price: "64K", priority: "Medium", probability: 45, stage: "Qualified", daysAgo: 5 },
  { id: 3, name: "Cloud Infrastructure", company: "ShieldTech", price: "143K", priority: "High", probability: 70, stage: "Contact Made", daysAgo: 3 },
  { id: 4, name: "Cloud Infrastructure", company: "ShieldTech", price: "143K", priority: "High", probability: 70, stage: "Demo Scheduled", daysAgo: 3 },
  { id: 5, name: "Security Audit Deal", company: "ShieldTech", price: "112K", priority: "High", probability: 70, stage: "Proposal Made", daysAgo: 3 },
  { id: 6, name: "Marketing Deal", company: "ShieldTech", price: "64K", priority: "Medium", probability: 40, stage: "Negotiation", daysAgo: 4 },
];

const INITIAL_FORM = { name: "", company: "", price: "", priority: "Medium", probability: 20 };

function SalesPipeline() {
  const [deals, setDeals] = useState(DUMMY_DEALS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleAddLead = () => setShowModal(true);
  const handleCloseModal = () => { setShowModal(false); setForm(INITIAL_FORM); };
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.company || !form.price) return;
    const newDeal = {
      id: deals.length + 1,
      name: form.name,
      company: form.company,
      price: form.price,
      priority: form.priority,
      probability: Number(form.probability),
      stage: "Qualified",
      daysAgo: 0,
    };
    setDeals([...deals, newDeal]);
    handleCloseModal();
  };

  const getDealsForStage = (stageName) => deals.filter((d) => d.stage === stageName);

  return (
    <div className="pipeline-page">

      <div className="wonlost-panel">
        <div className="wonlost-section">
          <div className="wonlost-label-row">
            <div className="wonlost-line" />
            <span className="wonlost-text">Won</span>
            <div className="wonlost-line" />
          </div>
          <div className="wonlost-box" />
          <div className="wonlost-arrow">&#8964;</div>
        </div>
        <div className="wonlost-section">
          <div className="wonlost-label-row">
            <div className="wonlost-line" />
            <span className="wonlost-text">Lost</span>
            <div className="wonlost-line" />
          </div>
          <div className="wonlost-box" />
          <div className="wonlost-arrow">&#8964;</div>
        </div>
      </div>

      <div className="pipeline-gradient-box">
        <h1 className="pipeline-title">Sales Pipeline</h1>

        <div className="pipeline-action-bar">
          <button className="btn-add-lead" onClick={handleAddLead}>
            + Add Lead
          </button>
        </div>

        <div className="pipeline-stages">
          {STAGES.map((stage) => (
            <div className="stage-column" key={stage.name}>
              <div className="stage-header">
                <span className="stage-dot" style={{ backgroundColor: stage.dot }} />
                <span className="stage-name">{stage.name}</span>
              </div>
              <div className="stage-cards-area">
                {getDealsForStage(stage.name).map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Lead</h2>
            <div className="modal-field">
              <label className="modal-label">Deal Name *</label>
              <input className="modal-input" type="text" name="name" placeholder="e.g. Security Audit Deal" value={form.name} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Company Name *</label>
              <input className="modal-input" type="text" name="company" placeholder="e.g. ShieldTech" value={form.company} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Deal Price *</label>
              <input className="modal-input" type="text" name="price" placeholder="e.g. 50K" value={form.price} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Priority</label>
              <select className="modal-input" name="priority" value={form.priority} onChange={handleFormChange}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Deal Probability (%)</label>
              <input className="modal-input" type="number" name="probability" min="0" max="100" value={form.probability} onChange={handleFormChange} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SalesPipeline;