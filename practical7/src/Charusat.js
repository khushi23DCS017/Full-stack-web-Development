import React from 'react';
import './institutes.css';


const institutes = [
  { code: "CSPIT", name: "Chandubhai S. Patel Institute of Technology" },
  { code: "DEPSTAR", name: "Devang Patel Institute of Advance Technology and Research" },
  { code: "IIIM", name: "Indukaka Ipcowala Institute of Management" },
  { code: "RPCP", name: "Ramanbhai Patel College of Pharmacy" },
  { code: "CMPICA", name: "Smt. Chandaben Mohanbhai Patel Institute of Computer Application" },
  { code: "PDPIAS", name: "P. D. Patel Institute of Applied Sciences" },
  { code: "ARIP", name: "Ashok & Rita Patel Institute of Physiotherapy" },
  { code: "MTIN", name: "Manikaka Topawala Institute of Nursing" },
  { code: "CIPS", name: "Charotar Institute of Paramedical Sciences" }
];

function Institutes() {
  return (
    <div className="institutes-page">
      <h2 className="institutes-heading">Constituent Institutes of CHARUSAT</h2>
      <div className="institutes-grid">
        {institutes.map((inst, index) => (
          <div className="institute-card" key={index}>
            <div className="card-content">
              <h3>{inst.code}</h3>
              <p>{inst.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Institutes;
