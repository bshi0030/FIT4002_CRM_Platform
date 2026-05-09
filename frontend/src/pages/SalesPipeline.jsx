import "../styles/SalesPipeline.css";

const STAGES = [
  { name: "Qualified", dot: "#A4A4A4" },
  { name: "Contact Made", dot: "#F5C518" },
  { name: "Demo", dot: "#4DC9C9" },
  { name: "Proposal Made", dot: "#F5A623" },
  { name: "Negotiation", dot: "#C0392B" },
];

function SalesPipeline() {
  return (
    <div className="pipeline-page">

      {/* LEFT PANEL - WON / LOST */}
      <div className="wonlost-panel">

        <div className="wonlost-section">
          <div className="wonlost-label-row">
            <div className="wonlost-line" />
            <span className="wonlost-text">Won</span>
            <div className="wonlost-line" />
          </div>
          <div className="wonlost-box">
          </div>
          <div className="wonlost-arrow">&#8964;</div>
        </div>

        <div className="wonlost-section">
          <div className="wonlost-label-row">
            <div className="wonlost-line" />
            <span className="wonlost-text">Lost</span>
            <div className="wonlost-line" />
          </div>
          <div className="wonlost-box">
          </div>
          <div className="wonlost-arrow">&#8964;</div>
        </div>

      </div>

      {/* MAIN GRADIENT AREA */}
      <div className="pipeline-gradient-box">

        <h1 className="pipeline-title">Sales Pipeline</h1>

        {/* STAGE COLUMNS */}
        <div className="pipeline-stages">
          {STAGES.map((stage) => (
            <div className="stage-column" key={stage.name}>
              <div className="stage-header">
                <span
                  className="stage-dot"
                  style={{ backgroundColor: stage.dot }}
                />
                <span className="stage-name">{stage.name}</span>
              </div>
              <div className="stage-cards-area">
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default SalesPipeline;