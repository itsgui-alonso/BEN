import { MapPin } from "lucide-react";
import { formatarHora } from "../utils/datas";

export function EventoAgora({ evento, onVerLocal }){
    return (
        <article className="evento-agora">
            <span className="agora-selo"><i className="agora-ponto" /> ACONTECENDO AGORA</span>
            <h3 className="agora-titulo">{evento.titulo}</h3>
            <p className="agora-horario">{formatarHora(evento.inicio)} – {formatarHora(evento.fim)}</p>

            <div className="agora-rodape">
                <span className="agora-local"><MapPin size={16} /> {evento.local.nome}</span>
                <button type="button" className="agora-btn" onClick={() => onVerLocal?.(evento.local)}>Ver no mapa</button>
            </div>
        </article>
    )
}