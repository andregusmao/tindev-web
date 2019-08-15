import React, { useState } from "react";
import "./Login.css";

import api from "../services/api";

import logo from "../assets/logo.svg";

export default function Login({ history }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/devs", {
        username
      });

      const { _id } = response.data;

      history.push(`/dev/${_id}`);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setError('');
          }}
          placeholder="Digite seu usuário no Github"
        />
        <button type="submit">Enviar</button>
        <label className="error">{error}</label>
      </form>
    </div>
  );
}
