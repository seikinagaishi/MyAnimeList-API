import React from 'react';
import './homeStyle.css';
import '../common.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div id="home-page">
            <main>
                <div id="title">Projeto ADI</div>

                <div id="button-area">
                    <Link to="/perfil" className="button">Pesquisar perfil</Link>
                    <Link to="/lista" className="button">Gerenciar conquistas</Link>
                </div>
            </main>
        </div>
    );
}

export default Home;