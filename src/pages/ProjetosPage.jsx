import { useState, useEffect, useRef} from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoriaChips } from "../components/CategoriaChips";
import { ProjetoCard } from "../components/ProjetoCard";
import { useDebounce } from "../hooks/useDebounce";
import { useProjetos } from "../hooks/useProjetos";
import { useCategorias } from "../hooks/useCategorias";

export function ProjetosPage() {
    const [textoBusca, setTextoBusca] = useState('') // o que a pessoa vai digitar
    const [categoriaId, setCategoriaId] = useState(null) // null = "Todos"
    const busca = useDebounce(textoBusca, 400) // versão atrasada que vai apra a API

    const { data: categorias = [] } = useCategorias() // = [] evita eero enquanto carrega
    const {
        data, isLoading, isError, referch,
        fetchNextPage, hasNextPage, isFetchingNextPage,
    } = useProjetos({ busca, categoria: categoriaId})

    const projetos = data?.pages.flatMap((projeto) => projeto.projetos) ?? []

    // Scroll infinito: vai observar um elemento invisivel no fim da lista

    const sentinela = useRef(null) // seria o elemento do fim
    useEffect(() => {
        const el = sentinela.current
        if(!el) return

        const observador = new IntersectionObserver(([entrada]) => {
            if( entrada.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
        }, { rootMargin: '300px'})

        observador.observe(el)
        return () => observador.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <main>
            <Header nome="Mariana Costa" tipo="Visitante" evento="Bentotec 2026" />
            <span className="pill">Feira 2026 · em curso</span>
            <h1 className="titulo">Projetos</h1>
            <p className="subtitulo">Explore as ideias criadas pelos alunos. Filtre por categoria e vote no seu favorito.</p>

            <SearchBar valor={textoBusca} onChange={setTextoBusca} />
            <div style={{ height: 16 }} />
            <CategoriaChips categorias={categorias} selecionada={categoriaId} onSelecionar={setCategoriaId} />
            <div style={{ height: 20 }} />

            {isLoading && <p className="vazio">Carregando...</p>}
            {isError && <button className="vazio" onClick={() => referch()}>Não foi possível carregar. Toque para tentar de novo.</button>}
            {!isLoading && !isError && projetos.length  === 0 && <p className="vazio">Nenhum projeto encontrado.</p>}

            {projetos.map((p) => (
                <ProjetoCard
                    key={p.id}
                    projeto={p}
                    onVerMapa={(proj) => console.log('mapa', proj.stand_projeto)}   // TODO: navegar para o mapa
                    onVerMais={(proj) => console.log('detalhe', proj.id)}           // TODO: navegar para o detalhe
                />
            ))}

            <div ref={sentinela} style={{ height: 1 }} />            {/* o "sentinela" invisível */}
            {isFetchingNextPage && <p className="vazio">Carregando mais…</p>}
        </main>
    )
}