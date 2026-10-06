import { Settings } from "lucide-react";

export function Header({ nome, tipo, evento }){
    const iniciais = nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() 

    return (
        <header className="header">
            <div className="avatar">{iniciais}</div>
            <div className="header-nome"><strong>{nome}</strong><span>{tipo}</span></div>
            <span className="chip-evento"><i className="ponto" />{evento}</span>
            <button className="icone-btn" aria-label="Configurações"><Settings size={20} /></button>
        </header>
    )
}
