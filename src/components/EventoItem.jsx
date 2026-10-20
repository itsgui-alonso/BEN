import { MapPin } from "lucide-react";
import { formatarHora } from "../utils/datas";

export function EventoItem({ evento, onVerLocal }) {
    return (
        <li className="evento-item">
            <div className="evento-horario">
                <strong>{formatarHora(evento.inicio)}</strong>
                <span>até {formatarHora(evento.fim)}</span>
            </div>

            <div className="evento-info">
                <h3 className="evento-titulo">{evento.titulo}</h3>
                {/* O pin com o nome do local é um botão: depois ele abre o mapa naquele local */}
                <button type="button" className="evento-local" onClick={() => onVerLocal?.(evento.local)}>
                    <MapPin size={14} /> {evento.local.nome}
                </button>
            </div>
        </li>
    )
}