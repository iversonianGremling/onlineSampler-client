// src/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#f0a500",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
    >
      Back
    </button>
  );
};

export default BackButton;
