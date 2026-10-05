import { Users, MapPin, FileText, ImageOff } from "lucide-react";

export function ProjetoCard({ projeto, onVerMapa, onVerMais }) {
  const integrantes = projeto.integrantes
    .map((integrante) => integrante.nome)
    .join(" · ");

  return (
    <article className="card">
      <div className="card-topo">
        {projeto.imagem_url ? (
          <img
            className="card-imagem"
            src={projeto.imagem_url}
            alt={`Imagem do projeto ${projeto.nome_projeto}`} // acessibilidade
            loading="lazy" // só baixa quando chega perto da tela (economiza dados)
            decoding="async" // não trava a rolagem ao decodificar
          />
        ) : (
          <div className="card-imagem card-sem-imagem">
            <ImageOff size={28} />
          </div> // fallback sem imagem
        )}

        <div className="card-info">
          <h2 className="card-titulo">{projeto.nome_projeto}</h2>

          {projeto.categoria && ( // só mostra de tiver categoria
            <span className="badge">
              {projeto.categoria.nome_categoria.toUpperCase()}
            </span>
          )}

          <p className="card-integrantes">
            <Users size={14} />
            <span>{integrantes}</span>
          </p>
        </div>
      </div>

      <p className="card-descricao">{projeto.descricao}</p>

      <div className="card-acoes">
        <button className="btn btn-contorno" onClick={() => onVerMapa?.(projeto)}> {/* "?." só chama se a função foi passada */}
            <MapPin size={18} /> Ver no mapa
        </button>

        <button className=" btn btn-gradiente" onClick={() => onVerMais?.(projeto)}>
          <FileText size={18} /> Ver mais
        </button> 
      </div>
    </article>
  );
}
