import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Home 	from './pages/Home';
import Lista 	from './pages/Lista';
import Cadastro from './pages/Cadastro';
import Editar 	from './pages/Editar';

import Perfil from './pages/Perfil';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route component={Home} 	path="/" 			exact />
			<Route component={Lista} 	path="/lista" 		exact />
			<Route component={Cadastro} path="/cadastro" 	exact />
			<Route component={Editar} 	path="/editar/:id" 	exact />

			<Route component={Perfil} 	path="/perfil" 		exact />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);

reportWebVitals();
