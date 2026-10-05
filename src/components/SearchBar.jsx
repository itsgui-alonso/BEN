import { Search, X } from "lucide-react";

export function SearchBar({ valor, onChange }){
    return (
        <div className="busca">
            <Search size={20} />
            <input 
                type="search"
                value={valor} // texto vem da pagina
                onChange={(e) => onChange(e.target.value)} // a cada letra avisa  a pagina
                placeholder="Pesquisar projeto, integrante ou palavra-chave"
                autoCorrect="off" autoCapitalize="none" // não corrige nomes
                enterKeyHint="search" // tecla enter do teclado vira buscar
                aria-label="Pesquisar projetos"
            />
            {valor && (
                <button className="busca-limpar" onClick={() => onChange('')} aria-label="Limpar busca"><X size={18} /></button>
            )}
        </div>
    )
}