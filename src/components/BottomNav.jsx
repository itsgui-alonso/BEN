import { NavLink } from "react-router-dom";
import { LayoutGrid, Calendar, Map as MapIcon, Vote } from "lucide-react"; // "Map as MapIcon" evita conflito com o Map do JavaScript

const abas = [
    { to: '/projetos', label: 'Projetos', Icone: LayoutGrid },
    { to: '/eventos', label: 'Eventos', Icone: Calendar },
    { to: '/mapa', label: 'Mapa', Icone: MapIcon },
    { to: '/votos', label: 'Votos', Icone: Vote },
]

export function BottomNav() {
    return (
       <nav className="bottom-nav">
        {abas.map(({ to, label, Icone }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `aba ${isActive ? 'aba-ativa' : ''}`}> {/* NavLink sabe se a rota está ativa */}
                <Icone size={18} /> {label}
            </NavLink>
        ))}
       </nav>
    )
}