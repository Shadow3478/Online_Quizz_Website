import React from "react";

export default function AdminTable({ questions, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Answer</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.question}</td>
              <td className="answer-cell">{q.answer}</td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => onEdit(q)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(q)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
