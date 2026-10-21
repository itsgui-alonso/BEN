import { useState } from "react";
import { EventoAgora } from "../components/EventoAgora";
import { EventoItem } from "../components/EventoItem";
import { useEventos } from "../hooks/useEventos";
import { formatarDataLonga } from "../utils/datas";

export function EventosPage() {
    // null = "deixa o back escolher" (hoje, ou o primeiro dia da feira).
    // Quando a pessoa toca em um chip, guardamos a data escolhida aqui.
    const [diaEscolhido, setDiaEscolhido] = useState(null)
    const { data, isLoading, isError, isPlaceholderData, refetch } = useEventos(diaEscolhido)

    // "?? []" evita erro enquanto os dados ainda não chegaram
    const dias = data?.dias ?? []
    const agora = data?.agora ?? []
    const eventos = data?.eventos ?? []
    const diaAtual = diaEscolhido ?? data?.data // dia marcado nos chips

    // Título: "Agenda de Hoje" só quando o dia mostrado é hoje; senão "Agenda do Dia 22"
    const ehHoje = data?.data && data.data === data.hoje
    const titulo = ehHoje ? 'Agenda de Hoje' : data?.data ? `Agenda do Dia ${Number(data.data.slice(8, 10))}` : 'Agenda'

    return (
        <main className="projetos-page">

            {isLoading && <p className="vazio">Carregando...</p>}
            {isError && <button className="vazio" onClick={() => refetch()}>Não foi possível carregar. Toque para tentar de novo.</button>}

            {data && (
                <>
                    {/* TOPO: o que está acontecendo neste momento */}
                    <h1 className="secao-titulo" style={{ paddingTop: 20 }}>Acontecendo agora</h1>
                    {agora.length === 0
                        ? <p className="agora-vazio">Nenhum evento acontecendo neste momento.</p>
                        : agora.map((evento) => <EventoAgora key={evento.id} evento={evento} />)}

                    {/* AGENDA DO DIA */}
                    <h1 className="titulo agenda-titulo">{titulo}</h1>
                    {data.data && <p className="subtitulo">{formatarDataLonga(data.data)}</p>}

                    {/* Chips Dia 21 / Dia 22 (reaproveitam as classes .chips e .chip que você já tem) */}
                    <div className="chips">
                        {dias.map((d) => (
                            <button
                                key={d.data}
                                className={`chip ${d.data === diaAtual ? 'chip-ativo' : ''}`}
                                onClick={() => setDiaEscolhido(d.data)} // muda o dia → o hook busca de novo
                            >
                                Dia {d.dia}
                            </button>
                        ))}
                    </div>

                    {eventos.length === 0 && <p className="vazio">Nenhum evento neste dia.</p>}

                    {/* isPlaceholderData = está mostrando o dia antigo enquanto carrega o novo → deixa meio apagado */}
                    <ul className={`eventos-lista ${isPlaceholderData ? 'carregando' : ''}`}>
                        {eventos.map((evento) => <EventoItem key={evento.id} evento={evento} />)}
                    </ul>
                </>
            )}
        </main>
    )
}
