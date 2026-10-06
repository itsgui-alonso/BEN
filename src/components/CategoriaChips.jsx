export function CategoriaChips({ categorias, selecionada, onSelecionar }){
    const itens = [{ id: null, nome_categoria: 'Todos'}, ...categorias] // Todos = item falso com id null (sem filtro)

    return (
        <div className="chips" role="tablist">
            {itens.map((item) => (
                <button
                    key={String(item.id)} // cahve unica 
                    role="tab"
                    aria-selected={item.id === selecionada} // informa qual está ativo
                    className={`chip ${item.id === selecionada ? 'chip-ativo' : ''}`} // adiciona classe do ativo
                    onClick={() => onSelecionar(item.id)} // avisa a pagina qual id foi clicado
                >
                    {item.nome_categoria}
                </button>
            ))}
        </div>
    )
}