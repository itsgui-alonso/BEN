import { useNavigate } from 'react-router-dom';
import { Activity, Vote, Calendar, Heart } from 'lucide-react';
import { useResumo } from '../hooks/useResumo';
import { Header } from "../components/Header";   // no topo

const formatar = (n) => Number(n ?? 0).toLocaleString('pt-BR')

export function VotosPage() {
    const navigate = useNavigate()
    const { data, isLoading, isError, refetch } = useResumo()

    const dias = data?.dias ?? []
    const ranking = data?.maisCurtidos ?? []

    return (
        <main className='projetos-page resultados-page'>
            <Header nome="Visitante" tipo="Visitante" evento="BentoTec 2026" />
            <span className='pill pill-icone'><Activity size={14} /> Apuração parcial</span>
            <h1 className='titulo'>Resultados</h1>
            <p className='resultados-intro'>
                O sistema mais transparente possível! Acompanhe a votação da BentoTec 2026 por dia, categoria e os projetos mais curtidos.
            </p>

            {isLoading && <p className='vazio'>Carregando...</p>}
            {isError && <button className='vazio' onClick={() => refetch()}>Não foi possível carregar. Toque para tentar de novo.</button>}

            {data && (
                <>
                    <section className='total-feira'>
                        <p className='total-rotulo'><Vote size={14} /> TOTAL DA FEIRA</p>
                        <strong className='total-numero'>{formatar(data.total)}</strong>
                        <span className='total-legenda'>votos registrados</span>
                    </section>

                    <div className='dias-grade'>
                        {dias.map((d) => (
                            <div className='dia-card' key={d.data}>
                                <p className='dia-rotulo'><Calendar size={14} /> DIA {d.dia}</p>
                                <strong className='dia-numero'>{formatar(d.total)}</strong>
                                <span className='dia-legenda'>votos registrados</span>
                            </div>
                        ))}
                    </div>

                    <h2 className='ranking-titulo'>Projetos mais curtidos</h2>

                    {ranking.length === 0 && <p className='vazio'>Ainda não há curtidas.</p>}

                    <ol className='ranking-lista'>
                        {ranking.map((p, i) => (
                            <li key={p.id}>
                                <button className='ranking-item' onClick={() => navigate(`/projetos/${p.id}`)}>
                                    <span className='ranking-posicao'>{i + 1}º</span>
                                    <span className='ranking-nome'>{p.nome}</span>
                                    <span className='ranking-curtidas'>
                                        <span className='ranking-numeros'>
                                            <strong>{formatar(p.curtidas)}</strong>
                                            <small>ver mais</small>
                                        </span>
                                        <Heart size={20} fill='currentColor' />
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </main>
    )
}
