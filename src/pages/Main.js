import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

import API_URL from '../config';

import "./Main.css";

import api from "../services/api";

import logo from "../assets/logo.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const [userLogged, setUserLogged] = useState({});

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: match.params.id
        }
      });

      const userResponse = await api.get(`/devs/${match.params.id}`);

      setUserLogged(userResponse.data);

      setLoaded(true);

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);
  

  useEffect(() => {
    const socket = io(API_URL, {
      query: {
        user: match.params.id
      }
    });

    socket.on("match", dev => setMatchDev(dev));
  }, [match.params.id]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/like`, null, {
      headers: {
        user: match.params.id
      }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislike`, null, {
      headers: {
        user: match.params.id
      }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      {loaded ? (
        users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user._id}>
                <img src={user.avatar} alt={user.name} />
                <footer>
                  <strong>{user.name}</strong>
                  <p>{user.bio}</p>
                </footer>

                <div className="buttons">
                  <button type="button" onClick={() => handleLike(user._id)}>
                    <img src={like} alt="like" />
                  </button>
                  <button type="button" onClick={() => handleDislike(user._id)}>
                    <img src={dislike} alt="dislike" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">Acabou :(</div>
        )
      ) : (
        <div className="empty">Carregando...</div>
      )}

      {matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="It's a match" />
          <img className="avatar" src={matchDev.avatar} alt="It's a match" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>
            FECHAR
          </button>
        </div>
      )}
      <div className="footer">
        Seja bem vindo {userLogged.name}
      </div>
    </div>
  );
}
