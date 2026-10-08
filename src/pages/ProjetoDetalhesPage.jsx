import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Building2, GraduationCap, Cpu, MapPin, Heart, Vote, ImageOff } from "lucide-react";
import { Header } from "../components/Header";
import { SecaoCard } from "../components/SecaoCard";
import { useProjeto } from "../hooks/useProjetos";

const iniciais = (nome) => {
    if(!nome) return ""
    return nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function ProjetoDetalhePage() {
    const {id} = useParams() // vai pegar o 12 por exemplo, do parametro da URL
    const navigate = useNavigate()
    const [curtido, setCurtido] = useState(false)
    const { data: projeto, isLoading, isError, refetch } = useProjeto(id) // busca o projeto na API

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id]) // vai abrir sempre no topo da lista, se estiver já rolada

    const descricao = projeto?.descricao_completa ?? projeto?.descricao; // usa a completa; se não tiver, a curta
    const integrantes = projeto?.integrantes ?? [];             // "?? []" evita erro enquanto carrega
    const professores = projeto?.professores ?? [];
    const palavras = projeto?.palavras_chave ?? [];

    return(
        <main className="detalhe-page">
            <Header nome='Mariana Costa' tipo='Visitante' evento='BentoTec 2026'></Header>

            {isLoading && <p className="vazio">Carregando...</p>}
            {isError && (
                <button className="vazio" onClick={() => refetch()}>
                    Não foi possivel carregar. Toque para tentar novamente.
                </button>
            )}

            {/* ABRINDO A VERIFICAÇÃO E O FRAGMENTO AQUI */}
            {projeto && (
                <>
                    <div className="hero">
                        {projeto.imagem_url ? (
                            <img className="hero-imagem" src={projeto.imagem_url} alt={`Imagem do projeto ${projeto.nome_projeto}`} decoding="async"/>
                        ) : (
                            <div className="hero-sem-imagem"><ImageOff size={36} /></div> 
                        )}
                        <button className="hero-voltar" onClick={() => navigate('/projetos')} aria-label="Voltar para projetos">
                            <ArrowLeft size={18}/>
                        </button>
                    </div>

                    <section className="secao"> 
                        <h1 className="sobre-titulo">Sobre o projeto</h1>
                        <p className="sobre-texto">{descricao}</p>
                    </section>

                    <div className="detalhe-linha">
                        {integrantes.length > 0 && (
                        <SecaoCard icone={Users} titulo="Integrantes">
                            <ul className="lista-integrantes">
                            {integrantes.map((i) => (
                                <li key={i.id ?? i.nome} className="integrante"> 
                                <span className="integrante-avatar">{iniciais(i.nome)}</span> 
                                <span className="integrante-dados">
                                    <span className="integrante-nome">{i.nome}</span>
                                    {i.ano && <span className="integrante-ano">{i.ano}</span>} 
                                </span>
                                </li>
                            ))}
                            </ul>
                        </SecaoCard>
                        )}

                        {projeto.stand_projeto && (
                        <SecaoCard icone={Building2} titulo="Localização" className="secao-local">
                            <p className="local-texto">{projeto.stand_projeto}</p> 
                            <button className="btn btn-gradiente btn-pequeno" onClick={() => console.log("mapa", projeto.stand_projeto)}> 
                            <MapPin size={16} /> Ver no mapa
                            </button>
                        </SecaoCard>
                        )}
                    </div>

                    {professores.length > 0 && (
                        <SecaoCard icone={GraduationCap} titulo="Professor orientador e coorientador">
                        {professores.map((p) => (
                            <p key={p.id ?? p.nome} className="professor">{p.nome}</p> 
                        ))}
                        </SecaoCard>
                    )}

                    {palavras.length > 0 && (
                        <SecaoCard icone={Cpu} titulo="Tecnologias e materiais">
                        <div className="tags">
                            {palavras.map((palavra) => (
                            <span key={palavra} className="tag">{palavra}</span> 
                            ))}
                        </div>
                        </SecaoCard>
                    )}

                    <div className="barra-acao">
                        <button className="btn-curtir" onClick={() => setCurtido((v) => !v)} aria-pressed={curtido} aria-label={curtido ? "Remover curtida" : "Curtir projeto"}> 
                        <Heart size={28} fill={curtido ? "currentColor" : "none"} /> 
                        </button>
                        <button className="btn btn-gradiente btn-votar" onClick={() => console.log("votar", projeto.id)}>
                        <Vote size={22} /> Votar
                        </button>
                    </div>
                </>
            )} 
            {/* FECHANDO O FRAGMENTO E A VERIFICAÇÃO DO PROJETO AQUI */}

        </main>
    )
}   