import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { consultarVotosRestantes, votar } from "../../services/votosServices";
import { lerSessao } from "../../services/sessionServices";

const rotulo = (n) => (n === 1 ? "voto" : "votos"); // "1 voto" / "2 votos" / "0 votos"

export function EtapaConfirmar({ projeto, onVotado, onNao, onRecomecar }) {
  const sessao = lerSessao();

  const restantes = useQuery({
    queryKey: ["votos-restantes", projeto.id, sessao?.token],
    queryFn: () =>
      consultarVotosRestantes({ token: sessao.token, projectId: projeto.id }),
    enabled: !!sessao, // pergunta se a seção é valida
    retry: false, // não repete sozinho se der erro
  });

  const votacao = useMutation({
    mutationFn: () => votar({ token: sessao.token, projectId: projeto.id }), // registra o voto
    onSuccess: onVotado, // avisa a página: vai para a tela 4
  });

  const dados = restantes.data; // { categoria, limite, restantes, ... }
  const erro = !sessao
    ? "Sua sessão expirou. Escaneie o crachá novamente." // sem sessão
    : restantes.error?.message || votacao.error?.message; // erro da consulta ou do voto

  return (
    <section className="secao votacao-card">
      <div className="icone-selo">
        <BadgeCheck size={22} />
      </div>
      <h1 className="votacao-titulo">
        Você tem certeza que quer votar nesse projeto?
      </h1>

      {dados &&
        dados.pode_votar && ( // texto dinâmico do Figma
          <p className="votacao-sub">
            <b>
              Você tem direito a {dados.limite} {rotulo(dados.limite)} por cada
              categoria da feira!
            </b>{" "}
            Caso você vote nesse projeto, terá{" "}
            <b>
              apenas mais {dados.restantes_apos_voto}{" "}
              {rotulo(dados.restantes_apos_voto)}
            </b>{" "}
            na categoria <b>{dados.categoria.nome}</b>.
          </p>
        )}
      {dados &&
        !dados.pode_votar && ( // já gastou todos os votos da categoria
          <p className="votacao-sub">
            Você já usou {dados.usados} de {dados.limite} {rotulo(dados.limite)}{" "}
            na categoria <b>{dados.categoria.nome}</b>. Escolha um projeto de
            outra categoria.
          </p>
        )}
      {restantes.isLoading && <p className="votacao-sub">Carregando...</p>}

      <div className="caixa-projeto">
        {" "}
        {/* card do projeto com a foto */}
        {projeto.imagem_url ? (
          <img className="caixa-projeto-img" src={projeto.imagem_url} alt="" /> // imagem vem da API
        ) : (
          <div className="caixa-projeto-img caixa-projeto-vazia" />
        )}{" "}
        <div>
          <strong>{projeto.nome_projeto}</strong>
          <small>
            {projeto.stand_projeto ?? "Stand a definir"}
            {dados ? ` - ${dados.categoria.nome}` : ""}
          </small>
        </div>
      </div>

      {erro && <p className="scanner-erro">{erro}</p>}

      <div className="votacao-botoes">
        <button className="btn-secundario" onClick={onNao}>
          Não
        </button>
        {sessao ? (
          <button
            className="btn-primario"
            onClick={() => votacao.mutate()}
            disabled={!dados?.pode_votar || votacao.isPending}
          >
            {" "}
            {/* só habilita se ainda pode votar */}
            {votacao.isPending ? "Votando..." : "Sim"}
          </button>
        ) : (
          <button className="btn-primario" onClick={onRecomecar}>
            Escanear
          </button>
        )}{" "}
        {/* sessão expirada */}
      </div>
    </section>
  );
}
