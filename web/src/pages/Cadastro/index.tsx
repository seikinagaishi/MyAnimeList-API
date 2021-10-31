import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './cadastroStyle.css';
import '../common.css';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

interface Anime {
    id: number,
    imagem: string,
    nome: string
}

const Cadastro = () => {
    const history = useHistory();

    const [formData, setFormData] = useState({
        nome: '',
        imagem: '',
        tipo: '',
        quantidade: '',
        descricao: ''
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const [foto, setFoto] = useState<any>();

    useEffect(() => {
        api.get('/mal').then((response: any) => {
            let animelist: Anime[] = [];
            response.data.data.map((anime: any) => {
                animelist.push({
                    id: anime.node.id,
                    imagem: anime.node.main_picture.large,
                    nome: anime.node.title
                })
            })

            setFoto(animelist);
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }, [])

    async function save(event: FormEvent) {
        event.preventDefault();

        await api.post('/badges/create', formData).then(() => {
            alert('Cadastrado!');
            history.push('/lista');
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }

    if(!foto) {
        return (
            <div className="load">
                <ReactLoading type="bars" height={70} width={70} />
            </div>
        );
    }
 
    return (
        <div id="cadastro-page">
            <main>
                <div id="title">Criar Conquista</div>

                <form onSubmit={save}>
                    <input placeholder="NOME" name="nome" className="input-form" type="text" onChange={handleInputChange} required />
                   
                    <select name="imagem" className="input-form" onChange={handleInputChange} required>
                        <option value="" defaultChecked>IMAGEM DA CONQUISTA</option>
                        { foto && foto.map((anime: Anime) => (
                            <option key={anime.id} value={anime.imagem}>{anime.nome}</option>
                        ))}
                    </select>

                    <select name="tipo" className="input-form" onChange={handleInputChange} required>
                        <option value="" defaultChecked>TIPO</option>
                        <option value="EPS">Episódios Assistidos</option>
                        <option value="HOUR">Horas Assistidas</option>
                        <option value="COMPLETED">Obras Completadas</option>
                        <option value="DROPPED">Obras Abandonadas</option>
                    </select>

                    <input placeholder="QUANTIDADE MÍNIMA" name="quantidade" className="input-form" type="number" onChange={handleInputChange} required />
                    <textarea placeholder="DESCRIÇÃO" name="descricao" className="input-form" onChange={handleInputChange} required></textarea>

                    <button>Criar Nova</button>
                </form>
            </main>

            <Link className="voltar" to="/lista">Voltar</Link>
        </div>
    );
}

export default Cadastro;