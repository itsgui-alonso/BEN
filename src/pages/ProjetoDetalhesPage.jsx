import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Building2,
  GraduationCap,
  Cpu,
  MapPin,
  Heart,
  Vote,
  ImageOff,
} from "lucide-react";
import { Header } from "../components/Header";
import { SecaoCard } from "../components/SecaoCard";
import { useProjeto } from "../hooks/useProjetos";
import { useCurtidas } from "../hooks/useCurtidas";

const iniciais = (nome) => {
  if (!nome) return "";
  return nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function ProjetoDetalhePage() {
  const { id } = useParams() // vai pegar o 12 por exemplo, do parametro da URL
  const navigate = useNavigate()
  const { estaCurtido, alternar } = useCurtidas()
  const curtido = estaCurtido(id)
  const { data: projeto, isLoading, isError, refetch } = useProjeto(id) // busca o projeto na API

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]); // vai abrir sempre no topo da lista, se estiver já rolada

  const integrantes = projeto?.integrantes ?? []; // "?? []" evita erro enquanto carrega
  const professores = [projeto?.orientador, projeto?.co_orientador].filter(
    Boolean,
  );
  const palavras = (projeto?.palavras_chave ?? "") // se ainda não carregou (ou veio null), usa texto vazio
    .split(",") // "A, B, C" vira ["A", " B", " C"]
    .map((p) => p.trim()) // tira os espaços das pontas de cada palavra
    .filter(Boolean);

  return (
    <main className="detalhe-page">
      <Header
        nome="Mariana Costa"
        tipo="Visitante"
        evento="BentoTec 2026"
      ></Header>

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
              <img
                className="hero-imagem"
                src={projeto.imagem_url}
                alt={`Imagem do projeto ${projeto.nome_projeto}`}
                decoding="async"
              />
            ) : (
              <div className="hero-sem-imagem">
                <ImageOff size={36} />
              </div>
            )}
            <button
              className="hero-voltar"
              onClick={() => navigate("/projetos")}
              aria-label="Voltar para projetos"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          <section className="secao">
            <h1 className="sobre-titulo">Sobre o projeto</h1>
            <p className="sobre-texto">{projeto.descricao}</p>
          </section>

          <div className="detalhe-linha">
            {integrantes.length > 0 && (
              <SecaoCard icone={Users} titulo="Integrantes">
                {" "}
                {/* card com título laranja e ícone */}
                <ul className="lista-integrantes">
                  {" "}
                  {/* lista de integrantes */}
                  {integrantes.map(
                    (
                      i, // uma linha para cada integrante
                    ) => (
                      <li key={i.id ?? i.nome} className="integrante">
                        {" "}
                        {/* key = identificador único do item */}
                        <span className="integrante-avatar">
                          {iniciais(i.nome)}
                        </span>{" "}
                        {/* círculo com as iniciais (AL, PS...) */}
                        <span className="integrante-dados">
                          {" "}
                          {/* agrupa nome e série, um embaixo do outro */}
                          <span className="integrante-nome">{i.nome}</span>{" "}
                          {/* nome do integrante */}
                          {(i.serie || i.curso) && ( // só desenha se tiver série ou curso
                            <span className="integrante-ano">
                              {" "}
                              {/* linha pequena abaixo do nome */}
                              {[i.serie, i.curso]
                                .filter(Boolean)
                                .join(" · ")}{" "}
                              {/* junta os dois: "2º Ano · Eletrotécnica" */}
                            </span>
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </SecaoCard>
            )}

            {projeto.stand_projeto && (
              <SecaoCard
                icone={Building2}
                titulo="Localização"
                className="secao-local"
              >
                <p className="local-texto">{projeto.stand_projeto}</p>
                <button
                  className="btn btn-gradiente btn-pequeno"
                  onClick={() => console.log("mapa", projeto.stand_projeto)}
                >
                  <MapPin size={16} /> Ver no mapa
                </button>
              </SecaoCard>
            )}
          </div>

          {professores.length > 0 && (
            <SecaoCard
              icone={GraduationCap}
              titulo="Professor orientador e coorientador"
            >
              {professores.map((nome) => (
                <p key={nome} className="professor">
                  {nome}
                </p>
              ))}
            </SecaoCard>
          )}

          {palavras.length > 0 && (
            <SecaoCard icone={Cpu} titulo="Tecnologias e materiais">
              <div className="tags">
                {palavras.map((palavra) => (
                  <span key={palavra} className="tag">
                    {palavra}
                  </span>
                ))}
              </div>
            </SecaoCard>
          )}

          <div className="barra-acao">
            <button
              className={`btn-curtir ${curtido ? 'coracao-ativo' : ''}`}
              onClick={() => alternar(id)}
              aria-pressed={curtido}
              aria-label={curtido ? "Remover curtida" : "Curtir projeto"}
            >
              <Heart size={28} fill={curtido ? "currentColor" : "none"} />
            </button>
            <button
              className="btn btn-gradiente btn-votar"
              onClick={() => navigate(`/projetos/${id}/votar`)}
            >
              <Vote size={22} /> Votar
            </button>
          </div>
        </>
      )}
      {/* FECHANDO O FRAGMENTO E A VERIFICAÇÃO DO PROJETO AQUI */}
    </main>
  );
}
