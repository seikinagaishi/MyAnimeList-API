import React, { useEffect, useState } from 'react';
import './listaStyle.css';
import '../common.css';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ReactLoading from 'react-loading';

interface ConquistaProps {
    id: number;
    nome: string;
    tipo: string;
    imagem: string;
    quantidade: number;
    descricao: string;
}

const Lista = () => {
    const [conquistas, setConquistas] = useState<ConquistaProps[]>([]);

    useEffect(() => {
        api.get('/badges').then((response) => {
            setConquistas(response.data);
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }, [])

    async function deleteBadge(id: number) {
        await api.delete(`/badges/${id}`).then(() => {
            alert(`Conquista ${id} deletada!`);
            window.location.reload();
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }

    if(!conquistas) {
        return (
            <div className="load">
                <ReactLoading type="bars" height={70} width={70} />
            </div>
        );
    }

    return (
        <div id="lista-page">
            <main>
                <div id="title">Lista de Conquistas</div>

                <div id="data-set">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Imagem</th>
                            <th>Tipo</th>
                            <th>Quantidade Mínima</th>
                            <th>Descrição</th>
                            <th>Atualização</th>
                        </tr>
                        { conquistas.map((conquista) => (
                            <tr key={conquista.id}>
                                <td>{conquista.id}</td>
                                <td>{conquista.nome}</td>
                                <td><img className="anime-picture" alt={conquista.nome} src={conquista.imagem}/></td>
                                <td>{conquista.tipo}</td>
                                <td>{conquista.quantidade}</td>
                                <td>{conquista.descricao}</td>
                                <td>
                                    <Link to={`/editar/${conquista.id}`} className="option">Alterar</Link>
                                    | 
                                    <span className="option" onClick={() => deleteBadge(conquista.id)}>Excluir</span>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

                <div id="buttons">
                    <Link className="button" to="/">Home</Link>
                    <Link className="button" to="/cadastro">Criar Nova</Link>
                </div>
            </main>
        </div>
    );
}

export default Lista;