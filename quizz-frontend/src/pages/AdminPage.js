import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminTable from "../components/AdminTable";
import Modal from "../components/Modal";

const emptyForm = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  answer: "",
};

export default function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8080/questions");
      setQuestions(res.data || []);
    } catch (e) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (q) => {
    setEditing(q);
    setForm({
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      answer: q.answer,
    });
    setModalOpen(true);
  };

  const onDelete = async (q) => {
    if (!window.confirm("Delete this question?")) return;
    setBusy(true);
    try {
      await axios.delete(`http://localhost:8080/questions/${q.id}`);
      await fetchQuestions();
    } catch (e) {
      alert("Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await axios.put(`http://localhost:8080/questions/${editing.id}`, form);
      } else {
        await axios.post("http://localhost:8080/questions", form);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditing(null);
      await fetchQuestions();
    } catch (e) {
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1>📋 Manage Questions</h1>
        <button className="btn-add" onClick={openAdd}>
          + Add Question
        </button>
      </div>

      {loading ? (
        <div className="quiz-loading">Loading questions…</div>
      ) : error ? (
        <div className="quiz-error">{error}</div>
      ) : (
        <AdminTable questions={questions} onEdit={openEdit} onDelete={onDelete} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => !busy && setModalOpen(false)}
        title={editing ? "✏️ Edit Question" : "📝 Add Question"}
        footer={
          <>
            <button
              className="btn-cancel"
              onClick={() => !busy && setModalOpen(false)}
              disabled={busy}
            >
              Cancel
            </button>
            <button className="btn-save" onClick={onSubmit} disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div className="field">
            <label>Question</label>
            <input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Enter question"
              required
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: ".75rem",
            }}
          >
            {["option1", "option2", "option3", "option4"].map((key) => (
              <div className="field" key={key}>
                <label>{key.replace("option", "Option ")}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={`Enter ${key.replace("option", "Option ")}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="field">
            <label>Correct Answer (must match an option)</label>
            <input
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Exact correct answer"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
