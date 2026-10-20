import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

const API_URL =
  "https://vota-bentotec.onrender.com/bentovote/v1/projetos";

const LIMITE_POR_PAGINA = 100;
const IMAGEM_PADRAO = "/teste.jpg";

const GRUPOS = {
  "grupo 1": ["stand 69", "stand 70", "stand 71", "stand 72"],
  "grupo 2": ["stand 85", "stand 86", "stand 87", "stand 88"],
  "grupo 3": ["stand 65", "stand 66", "stand 67", "stand 68"],
  "grupo 4": ["stand 81", "stand 82", "stand 83", "stand 84"],
  "grupo 5": ["stand 61", "stand 62", "stand 63", "stand 64"],
  "grupo 6": ["stand 77", "stand 78", "stand 79", "stand 80"],
  "grupo 7": ["stand 57", "stand 58", "stand 59", "stand 60"],
  "grupo 8": ["stand 73", "stand 74", "stand 75", "stand 76"],
  "grupo 9": ["stand 9", "stand 10", "stand 11", "stand 12"],
  "grupo 10": ["stand 21", "stand 22", "stand 23", "stand 24"],
  "grupo 11": ["stand 33", "stand 34", "stand 35", "stand 36"],
  "grupo 12": ["stand 45", "stand 46", "stand 47", "stand 48"],
  "grupo 13": ["stand 57", "stand 58", "stand 59", "stand 60"],
  "grupo 14": ["stand 5", "stand 6", "stand 7", "stand 8"],
  "grupo 15": ["stand 17", "stand 18", "stand 19", "stand 20"],
  "grupo 16": ["stand 29", "stand 30", "stand 31", "stand 32"],
  "grupo 17": ["stand 41", "stand 42", "stand 43", "stand 44"],
  "grupo 18": ["stand 53", "stand 54", "stand 55", "stand 56"],
  "grupo 19": ["stand 1", "stand 2", "stand 3", "stand 4"],
  "grupo 20": ["stand 13", "stand 14", "stand 15", "stand 16"],
  "grupo 21": ["stand 25", "stand 26", "stand 27", "stand 28"],
  "grupo 22": ["stand 37", "stand 38", "stand 39", "stand 40"],
  "grupo 23": ["stand 49", "stand 50", "stand 51", "stand 52"],
};
const AREAS_ESPECIAIS = {
  GDM: ["GDM"],
};
function escaparHTML(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

function normalizarStand(stand) {
  return String(stand ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function obterImagem(url) {
  if (!url) return IMAGEM_PADRAO;

  try {
    const imagem = new URL(String(url), window.location.origin);

    if (["http:", "https:"].includes(imagem.protocol)) {
      return imagem.href;
    }
  } catch {
    // Utiliza a imagem padrão se a URL for inválida.
  }

  return IMAGEM_PADRAO;
}

function extrairProjetos(resposta) {
  const dados = resposta?.dados ?? resposta?.data ?? resposta;

  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.projetos)) return dados.projetos;
  if (Array.isArray(dados?.resultados)) return dados.resultados;
  if (Array.isArray(dados?.items)) return dados.items;

  throw new Error("A API não retornou uma lista reconhecida de projetos.");
}

function normalizarProjeto(projeto, indice) {
  const participantesBrutos =
    projeto.participantes ??
    projeto.integrantes ??
    projeto.alunos ??
    [];

  let participantes = [];

  if (Array.isArray(participantesBrutos)) {
    participantes = participantesBrutos
      .map((item) => {
        if (typeof item === "string") return item;

        return (
          item?.nome ??
          item?.nome_integrante ??
          item?.nome_aluno ??
          ""
        );
      })
      .filter(Boolean);
  } else if (typeof participantesBrutos === "string") {
    participantes = participantesBrutos
      .split(",")
      .map((nome) => nome.trim())
      .filter(Boolean);
  }

  return {
    id: String(
      projeto.id ??
      projeto.projeto_id ??
      projeto.numero_projeto ??
      `projeto-${indice}`
    ),
    nome: projeto.nome_projeto ?? "Projeto sem nome",
    descricao: projeto.descricao ?? "Descrição não disponível.",
    foto: obterImagem(projeto.imagem_url),
    stand_projeto: normalizarStand(projeto.stand_projeto),
    participantes,
  };
}

function renderizarListaProjetos(projetos) {
  const cards = projetos.map((projeto) => `
    <button
      type="button"
      class="projeto-card"
      data-projeto-id="${escaparHTML(projeto.id)}"
    >
      <img
        class="projeto-card-imagem"
        src="${escaparHTML(projeto.foto)}"
        alt=""
      />
      <span class="projeto-card-nome">
        ${escaparHTML(projeto.nome)}
      </span>
      <span class="projeto-card-seta" aria-hidden="true">›</span>
    </button>
  `).join("");

  return `
    <div class="projetos-popup">
      <div class="projetos-lista">
        ${
          cards ||
          '<p class="popup-vazio">Nenhum projeto encontrado nesta área.</p>'
        }
      </div>
    </div>
  `;
}

function renderizarDetalhesProjeto(projeto) {
  const participantes = projeto.participantes.map((nome) => `
    <li>${escaparHTML(nome)}</li>
  `).join("");

  return `
    <div class="projetos-popup">
      <button type="button" class="popup-voltar" data-voltar>
        <span aria-hidden="true">←</span>
        Voltar aos projetos
      </button>

      <img
        class="detalhe-imagem"
        src="${escaparHTML(projeto.foto)}"
        alt="${escaparHTML(projeto.nome)}"
      />

      <h3 class="detalhe-nome">${escaparHTML(projeto.nome)}</h3>

      <p class="detalhe-descricao">
        ${escaparHTML(projeto.descricao)}
      </p>

      ${
        participantes
          ? `
            <h4 class="detalhe-subtitulo">Participantes</h4>
            <ul class="detalhe-participantes">${participantes}</ul>
          `
          : ""
      }
    </div>
  `;
}

export default function MapaPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mapa = L.map(container, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 3,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      attributionControl: false,
    });

    let desmontado = false;
    let projetosApiPromise = null;

    async function buscarProjetosDaApi() {
      const projetos = [];
      let pagina = 1;
      let totalPaginas = null;

      while (true) {
        const url = new URL(API_URL);
        url.searchParams.set("page", pagina);
        url.searchParams.set("limit", LIMITE_POR_PAGINA);

        const resposta = await fetch(url);

        if (!resposta.ok) {
          throw new Error(`Erro na API: HTTP ${resposta.status}`);
        }

        const resultado = await resposta.json();

        if (resultado?.sucesso === false) {
          throw new Error(
            resultado.mensagem ?? "A API informou uma falha."
          );
        }

        const dadosPagina = extrairProjetos(resultado);
        projetos.push(...dadosPagina);

        const paginacao =
          resultado?.paginacao ??
          resultado?.dados?.paginacao ??
          resultado?.data?.paginacao;

        if (Number.isFinite(Number(paginacao?.totalPaginas))) {
          totalPaginas = Number(paginacao.totalPaginas);
        }

        if (totalPaginas !== null) {
          if (pagina >= totalPaginas) break;
        } else if (dadosPagina.length < LIMITE_POR_PAGINA) {
          break;
        }

        if (dadosPagina.length === 0) break;

        pagina++;
      }

      return projetos.map(normalizarProjeto);
    }

    function obterProjetos() {
      if (!projetosApiPromise) {
        projetosApiPromise = buscarProjetosDaApi().catch((erro) => {
          projetosApiPromise = null;
          throw erro;
        });
      }

      return projetosApiPromise;
    }

    function configurarEventosPopup(popup) {
      const elemento = popup.getElement();
      if (!elemento) return;

      elemento.addEventListener("click", async (evento) => {
        const alvo = evento.target;
        if (!(alvo instanceof Element)) return;

        const botaoProjeto = alvo.closest("[data-projeto-id]");
        const botaoVoltar = alvo.closest("[data-voltar]");
        const botaoTentar = alvo.closest("[data-tentar]");

        if (botaoProjeto) {
          evento.preventDefault();
          evento.stopPropagation();

          const projeto = popup._projetos?.find(
            (item) => item.id === botaoProjeto.dataset.projetoId
          );

          if (projeto) {
            popup.setContent(renderizarDetalhesProjeto(projeto));
          }
        } else if (botaoVoltar) {
          evento.preventDefault();
          evento.stopPropagation();

          popup.setContent(
            renderizarListaProjetos(popup._projetos ?? [])
          );
        } else if (botaoTentar) {
          evento.preventDefault();
          evento.stopPropagation();

          if (popup._tipo === "grupo") {
            await abrirPopupGrupo(popup._idArea, popup._latlng);
          } else {
            await abrirPopupSala(popup._idArea, popup._latlng);
          }
        }
      });
    }

    function criarPopup(idArea, tipo, latlng) {
      const popup = L.popup({
        maxWidth: 380,
        minWidth: 300,
        maxHeight: 480,
        autoPan: true,
        className: "popup-projetos",
      })
        .setLatLng(latlng)
        .setContent(`
          <div class="projetos-popup">
            <p>Carregando projetos...</p>
          </div>
        `)
        .openOn(mapa);

      popup._tipo = tipo;
      popup._idArea = idArea;
      popup._latlng = latlng;

      configurarEventosPopup(popup);

      return popup;
    }

    async function carregarProjetosDoPopup(popup, filtro) {
      try {
        const todosProjetos = await obterProjetos();

        if (desmontado || !mapa.hasLayer(popup)) return;

        const projetos = todosProjetos.filter((projeto) =>
          filtro.includes(projeto.stand_projeto)
        );

        popup._projetos = projetos;
        popup.setContent(renderizarListaProjetos(projetos));
      } catch (erro) {
        console.error("Erro ao carregar projetos:", erro);

        if (desmontado || !mapa.hasLayer(popup)) return;

        popup.setContent(`
          <div class="projetos-popup">
            <p class="popup-vazio">
              Não foi possível carregar os projetos.
            </p>
            <button type="button" class="popup-voltar" data-tentar>
              Tentar novamente
            </button>
          </div>
        `);
      }
    }

    async function abrirPopupGrupo(idGrupo, latlng) {
      const popup = criarPopup(idGrupo, "grupo", latlng);
      const estandes = GRUPOS[idGrupo].map(normalizarStand);

      await carregarProjetosDoPopup(popup, estandes);
    }

    async function abrirPopupSala(idSala, latlng) {
      const popup = criarPopup(idSala, "sala", latlng);
      await carregarProjetosDoPopup(popup, [normalizarStand(idSala)]);
    }

    async function carregarMapa() {
      try {
        const resposta = await fetch("/mapa.svg");

        if (!resposta.ok) {
          throw new Error(`Erro ao carregar SVG: HTTP ${resposta.status}`);
        }

        const texto = await resposta.text();

        const documento = new DOMParser().parseFromString(
          texto,
          "image/svg+xml"
        );

        const svg = documento.documentElement;

        if (
          documento.querySelector("parsererror") ||
          svg.tagName.toLowerCase() !== "svg"
        ) {
          throw new Error("O arquivo mapa.svg é inválido.");
        }

        const viewBox = svg.getAttribute("viewBox");

        if (!viewBox) {
          throw new Error('O SVG precisa ter o atributo "viewBox".');
        }

        const dimensoes = viewBox.trim().split(/[\s,]+/).map(Number);

        if (
          dimensoes.length !== 4 ||
          !dimensoes.every(Number.isFinite) ||
          dimensoes[2] <= 0 ||
          dimensoes[3] <= 0
        ) {
          throw new Error("O viewBox possui dimensões inválidas.");
        }

        if (desmontado) return;

        const [, , largura, altura] = dimensoes;
        const limites = [[0, 0], [altura, largura]];

        svg.style.pointerEvents = "auto";

        const camadaSVG = L.svgOverlay(svg, limites, {
          interactive: true,
          opacity: 1,
        });

        camadaSVG.addTo(mapa);

        function encontrarElemento(id) {
          return Array.from(svg.querySelectorAll("[id]"))
            .find((elemento) => elemento.id === id);
        }

        function configurarArea(elemento, callback) {
          if (!elemento) return;

          elemento.style.pointerEvents = "all";
          elemento.style.cursor = "pointer";

          elemento.addEventListener("click", (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            const latlng = mapa.mouseEventToLatLng(evento);
            callback(latlng);
          });
        }

        Object.entries(GRUPOS).forEach(([idGrupo]) => {
          const elemento = encontrarElemento(idGrupo);

          if (!elemento) {
            console.warn(`Grupo não encontrado no SVG: "${idGrupo}"`);
            return;
          }

          configurarArea(elemento, (latlng) => {
            abrirPopupGrupo(idGrupo, latlng);
          });
        });
Object.entries(AREAS_ESPECIAIS).forEach(([idArea, stands]) => {
  const elemento = encontrarElemento(idArea);

  if (!elemento) {
    console.warn(`Área especial não encontrada no SVG: "${idArea}"`);
    return;
  }

  configurarArea(elemento, (latlng) => {
    const popup = criarPopup(idArea, "especial", latlng);

    carregarProjetosDoPopup(
      popup,
      stands.map(normalizarStand)
    );
  });
});
        // Registra somente as salas que realmente existem no SVG.
        Array.from(svg.querySelectorAll("[id]"))
          .filter((elemento) => /^sala \d+$/.test(elemento.id))
          .forEach((elemento) => {
            configurarArea(elemento, (latlng) => {
              abrirPopupSala(elemento.id, latlng);
            });
          });

        mapa.fitBounds(limites);

        // Corrige as dimensões após o layout da página.
        requestAnimationFrame(() => {
          if (!desmontado) mapa.invalidateSize();
        });
      } catch (erro) {
        console.error("Erro ao carregar o mapa:", erro);

        if (!desmontado) {
          container.innerHTML = `
            <p class="mapa-erro">
              Não foi possível carregar o mapa.
              Verifique o console para mais detalhes.
            </p>
          `;
        }
      }
    }

    carregarMapa();

    return () => {
      desmontado = true;
      mapa.remove();
    };
  }, []);

  return <div id="mapa" className="mapa-pagina" ref={containerRef} />;
}