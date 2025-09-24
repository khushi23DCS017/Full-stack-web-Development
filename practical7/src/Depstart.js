import React from 'react';
import './depstar.css';

const programs = [
  {
    name: "B.Tech in Computer Science and Engineering (CSE)",
    description:
      "This program focuses on core computer science concepts including algorithms, software development, AI, machine learning, and data science. Students are trained for both industry and research roles."
  },
  {
    name: "B.Tech in Computer Engineering",
    description:
      "Combining electrical engineering and computer science, this program emphasizes computer hardware, embedded systems, networking, and VLSI. It bridges the gap between hardware and software."
  },
  {
    name: "B.Tech in Information Technology",
    description:
      "This course specializes in IT infrastructure, cybersecurity, web technologies, and cloud computing. Students gain hands-on experience in managing IT systems and services."
  }
];

function Depstar() {
  return (
    <div className="depstar-page">
      <div className="depstar-card">
        <h2 className="depstar-heading">Programs Offered at DEPSTAR</h2>
        <div className="depstar-programs">
          {programs.map((p, i) => (
            <div key={i} className="depstar-program">
              <h3 className="depstar-program-title">{p.name}</h3>
              <p className="depstar-program-desc">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Depstar;
