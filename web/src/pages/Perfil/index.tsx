import React, { useState } from 'react';
import './perfilStyle.css';
import '../common.css';
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

interface ItemProps {
    id: number;
    nome: string;
    status: string;
    finalizado: string;
    assistidos: number;
    imagem: string;
    nota: number;
    tempo_episodio: number;
}

const Perfil = () => {
    const [listaLoaded, setListaLoaded]                 = useState<boolean>(false);
    const [primeiroAssistido, setPrimeiroAssistido]     = useState<ItemProps>();
    const [primeiro10, setPrimeiro10]                   = useState<ItemProps>();
    const [tempoAssistido, setTempoAssistido]           = useState<number>(0);
    const [episodiosAssistidos, setEpisodiosAssistidos] = useState<number>(0);
    const [completados, setCompletados]                 = useState<number>(0);
    const [abandonados, setAbandonados]                 = useState<number>(0);
    const [username, setUsername]                       = useState<string>();
    const [conquistas, setConquistas]                   = useState<ConquistaProps[]>([]);
    const [isLoading, setIsLoading]                     = useState<boolean>(false);

    async function getList() {
        setListaLoaded(false);
        setIsLoading(true);

        api.get('/badges').then((response) => {
            setConquistas(response.data);
        })
        .catch((err) => {
            alert(`Erro: ${err}`);
        })

        await api.get(`/mal/list/${username}`).then((response: any) => {
            let animelist: ItemProps[] = [];
            let tempo = 0;
            let episodios = 0;
            response.data.data.map((item: any) => {
                animelist.push({
                    id:             item.node.id,
                    nome:           item.node.title,
                    status:         item.list_status.status,
                    finalizado:     item.list_status.finish_date ?? null,
                    assistidos:     item.list_status.num_episodes_watched,
                    nota:           item.list_status.score,
                    imagem:         item.node.main_picture.large,
                    tempo_episodio: item.node.average_episode_duration
                })

                tempo += (item.list_status.num_episodes_watched * item.node.average_episode_duration) ?? 0;
                episodios += item.list_status.num_episodes_watched ?? 0;
            });

            let animesFinalizados = animelist.filter((anime: any) => anime.finalizado != null);
            let animesCompletos   = animelist.filter((anime: any) => anime.status == 'completed');
            let animesAbandonados = animelist.filter((anime: any) => anime.status === 'dropped');
            obterPrimeiroAnime(animesFinalizados);
            obterPrimeiro10(animesFinalizados);
            setTempoAssistido(tempo);
            setEpisodiosAssistidos(episodios);
            setCompletados(animesCompletos.length);
            setAbandonados(animesAbandonados.length);

            setIsLoading(false);
            setListaLoaded(true);
        })
        .catch((err) => {
            alert('Perfil não disponível!');
            setIsLoading(false);
            setListaLoaded(false);
        })
    }

    async function obterPrimeiroAnime(animes: any) {
        let maisAntigoAssistido: any = await obterAntigo(animes);

        setPrimeiroAssistido(maisAntigoAssistido);
        return;
    }

    async function obterPrimeiro10(animes: any) {
        let animesAssistidosCom10 = animes.filter((anime: any) => anime.nota === 10);
        let maisAntigoCom10: any = await obterAntigo(animesAssistidosCom10);

        setPrimeiro10(maisAntigoCom10);
        return;
    }

    async function obterAntigo(animes: any) {
        let maisAntigo: any = null;
        await animes.map((anime: any) => {
            if(!maisAntigo) {
                maisAntigo = anime;
            } 
            else if(new Date(maisAntigo.finalizado) > new Date(anime.finalizado)) {
                maisAntigo = anime;
            }
        })

        return maisAntigo;
    }

    if(!listaLoaded) {
        return (
            <div id="perfil-page">
                <div className="alert-area"></div>
                <main> 
                    <input id="title" type="text" placeholder="Nome" onBlur={getList} onChange={(e) => setUsername(e.target.value)} />

                    { isLoading &&
                        <div className="load">
                            <ReactLoading type="bars" height={70} width={70} />
                        </div>
                    }
                </main>  
            </div>
        );
    }

    return (
        <div id="perfil-page">
            <div className="alert-area"></div>
            { listaLoaded &&
                <main>
                    <input id="title" type="text" placeholder="Nome" onBlur={getList} onChange={(e) => setUsername(e.target.value)} />

                    { isLoading &&
                        <div className="load">
                            <ReactLoading type="bars" height={70} width={70} />
                        </div>
                    }

                    { !isLoading &&
                        <div id="main">
                            <div id="profile-info">
                                <div className="anime-card">
                                    <span className="anime-label">Primeiro anime</span>
                                    { primeiroAssistido ?
                                        <a href={`https://myanimelist.net/anime/${primeiroAssistido?.id}`}>
                                            <img alt={primeiroAssistido.nome} className="anime-picture" src={primeiroAssistido.imagem}/>
                                        </a>
                                    :
                                        <img alt="Indefinido" className="anime-picture" src="https://images.pexels.com/photos/66100/pexels-photo-66100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/>
                                    }
                                </div>

                                <div className="anime-card">
                                    <span className="anime-label">Primeiro 10</span>
                                    { primeiro10 ?
                                        <a href={`https://myanimelist.net/anime/${primeiro10?.id}`}>
                                            <img alt={primeiro10?.nome} className="anime-picture" src={primeiro10?.imagem}/>
                                        </a>
                                    :
                                        <img alt="Indefinido" className="anime-picture" src="https://images.pexels.com/photos/66100/pexels-photo-66100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"/>
                                    }
                                </div>

                                <div id="profile-statistics">
                                    <div>{(tempoAssistido / 3600).toFixed(1)} horas assistidas</div>
                                    <div>{completados} animes completados</div>
                                </div>
                            </div>

                            <div id="badges">
                                <div className="title">Conquistas</div>

                                { conquistas.map((conquista) => {
                                    let ok = false;
                                    let tipoRequisito;
                                    switch(conquista.tipo) {
                                        case 'EPS':
                                            ok = conquista.quantidade <= episodiosAssistidos;
                                            tipoRequisito = 'episódios assistidos';
                                            break;
                                        case 'HOUR':
                                            ok = conquista.quantidade <= tempoAssistido;
                                            tipoRequisito = 'horas assistidas';
                                            break;
                                        case 'COMPLETED':
                                            ok = conquista.quantidade <= completados;
                                            tipoRequisito = 'obras assistidas';
                                            break;
                                        case 'DROPPED':
                                            ok = conquista.quantidade <= abandonados;
                                            tipoRequisito = 'obras abandonadas';
                                    }

                                    if(ok) {
                                        return (
                                            <div key={conquista.id} className="badge-card">
                                                <div className="requirement">{`${conquista.quantidade} ${tipoRequisito}`}</div>
                
                                                <img className="badge-picture" alt={conquista.nome} src={conquista.imagem}/>
                                                <div className="badge-info">
                                                    <span className="badge-title">{conquista.nome}</span>
                
                                                    {conquista.descricao}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                                

                            </div>
                        </div>
                    }
                </main>
            }
        </div>
    );
}

export default Perfil;