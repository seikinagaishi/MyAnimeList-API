import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './editarStyle.css';
import '../common.css';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ReactLoading from 'react-loading';

interface RouteParams {
    id: string;
}

interface Anime {
    id: number,
    imagem: string,
    nome: string
}

const Editar = () => {
    const opcoesTipo = [
        {name: 'Episódios Assistidos',  value: 'EPS'},
        {name: 'Horas Assistidas',      value: 'HOUR'},
        {name: 'Obras Completadas',     value: 'COMPLETED'},
        {name: 'Obras Abandonadas',     value: 'DROPPED'},
    ]

    let { id } = useParams<RouteParams>();
    
    useEffect(() => {
        api.get(`/badges/${id}`).then((response: any) => {
            setNome(response.data.nome);
            setQuantidade(response.data.quantidade);
            setImagem(response.data.imagem);
            setTipo(response.data.tipo);
            setDescricao(response.data.descricao);

            setFormData({
                id: id,
                nome: response.data.nome,
                imagem: response.data.imagem,
                tipo: response.data.tipo,
                quantidade: response.data.quantidade,
                descricao: response.data.descricao
            })

            setImagem(response.data.imagem);
            setTipo(response.data.tipo);
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }, [])

    const history = useHistory();

    const [nome, setNome]               = useState<string>();
    const [quantidade, setQuantidade]   = useState<number>();
    const [imagem, setImagem]           = useState<string>();
    const [tipo, setTipo]               = useState<string>();
    const [descricao, setDescricao]     = useState<string>();

    const [formData, setFormData]       = useState({
        id: id,
        nome: '',
        imagem: '',
        tipo: '',
        quantidade: '',
        descricao: ''
    });

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value });

        switch(name) {
            case 'imagem':
                setImagem(value);
                break;
            case 'tipo':
                setTipo(value);
        }
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

        await api.put('/badges/update', formData).then(() => {
            alert('Editado!');
            history.push('/lista');
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })
    }

    if(
        !(nome &&
        foto &&
        tipo &&
        imagem && 
        descricao)
    ) {
        return (
            <div className="load">
                <ReactLoading type="bars" height={70} width={70} />
            </div>
        );
    }
 
    return (
        <div id="editar-page">
            <main>
                <div id="title">Editar Conquista</div>

                <form onSubmit={save}>
                    <input 
                        placeholder="NOME" name="nome" className="input-form" type="text" value={nome} required 
                        onChange={(e) => {
                            setNome(e.target.value)
                            handleInputChange(e)
                        }} 
                    />
                
                    <select name="imagem" className="input-form" value={imagem} onChange={handleInputChange} required>
                        <option value="">IMAGEM DA CONQUISTA</option>
                        { foto && foto.map((anime: Anime) => (
                            <option key={anime.id} value={anime.imagem}>{anime.nome}</option>
                        ))}
                    </select>

                    <select name="tipo" className="input-form" value={tipo} onChange={handleInputChange} required>
                        <option value="">TIPO</option>
                        { opcoesTipo && opcoesTipo.map((opt) => (
                            <option value={opt.value}>{opt.name}</option>
                        ))}
                    </select>

                    <input 
                        placeholder="QUANTIDADE MÍNIMA" name="quantidade" className="input-form" type="number" value={quantidade} required 
                        onChange={(e) => {
                            setQuantidade(Number(e.target.value))
                            handleInputChange(e)
                        }}
                    />

                    <textarea 
                        placeholder="DESCRIÇÃO" name="descricao" className="input-form" value={descricao} required
                        onChange={(e) => {
                            setDescricao(e.target.value)
                            handleInputChange(e)
                        }}
                    ></textarea>

                    <button>Editar Nova</button>
                </form>
            </main>

            <Link className="voltar" to="/lista">Voltar</Link>
        </div>
    );
}

export default Editar;