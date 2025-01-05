import React from "react";

const RecentExams = () => {
  const exams = [
    { id: 1, name: "Machine Learning Basics" },
    { id: 2, name: "Network Architecture" },
    { id: 3, name: "Développement mobile" },
    { id: 4, name: "quantique biologique" },
    { id: 5, name: "Cybersecurity fundamentals" },
  ];

  return (
    <div className="recent-exams">
      <h2>Exams récentes</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>{exam.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentExams;
