import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Bem-vindo ao Greenboard</h1>
      <h2>Escolha o tipo de atividade para criar:</h2>

        <Link to="/create-wordsearch" className="card">
          <div className="card-icon">🔍</div>
          <h3>Word Search</h3>
          <p>Crie um caça-palavras personalizado</p>
        </Link>

        <h3>Quiz (Em Obras) </h3>
        <p>Crie perguntas de múltipla escolha ou resposta livre</p>
        
        <h3>Memory Game (Em Obras) </h3>
        <p>Crie um jogo da memória com imagens, textos e áudios</p>
    </div>
  );
}

export default Dashboard;