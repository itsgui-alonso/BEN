import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Etapas } from "../components/votacao/Etapas";
import { EtapaEscolha } from "../components/votacao/EtapaEscolha";
import { EtapaScanner } from "../components/votacao/EtapaScanner";
import { EtapaCodigo } from "../components/votacao/EtapaCodigo";
import { EtapaIdentificada } from "../components/votacao/EtapaIdentificada";
import { EtapaConfirmar } from "../components/votacao/EtapaConfirmar";
import { EtapaRegistrado } from "../components/votacao/EtapaRegistrado";
import { useProjeto } from "../hooks/useProjetos";
import { lerSessao } from "../services/sessionServices";

const SEGMENTOS = {  escolha: 1, scanner: 2, codigo: 2, identificada: 3, confirmar: 4, registrado: 5 }

export function VotarPage(){
    const { id } = useParams() // id do projeto na URL
    const navigate = useNavigate() // navegar pelas telas
    const { data: projeto } = useProjeto(id) // dados do projeto...

    const sessaoAtual = lerSessao() // null se não existe ou já passou dos 10 min

    const [etapa, setEtapa] = useState(sessaoAtual ? 'confirmar' : 'escolha') // sessão válida pula o scanner
    const [codigo, setCodigo] = useState(sessaoAtual?.codigo ?? '')
    
    const [dataHora, setDataHora] = useState('') // quando o voto foi feito

    const validado = (texto) => {setCodigo(texto); setEtapa('identificada')} // qrcode eu código aceito

    const votado = () => {
        setDataHora(new Date().toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })); // "21 de outubro de 2026 às 21:23"
        setEtapa('registrado')
    }

    const sair = () => navigate(etapa === 'registrado' ? '/projetos' : `/projetos/${id}`) // seta e CANCELAR

    return (
        <>

            <div className="votacao-topo">
                <button className="icone-btn" onClick={sair} aria-label="Voltar"><ArrowLeft size={18}/></button>
                <div>
                    <small>Votação</small>
                    <strong>{projeto?.nome_projeto}</strong>
                </div>
            </div>
            <Etapas atual={SEGMENTOS[etapa]} />

            {etapa === 'escolha' && <EtapaEscolha onCodigo={() => setEtapa('codigo')} onScanner={() => setEtapa('scanner')} />}

            {etapa === 'scanner' && <EtapaScanner onValidado={validado} onDigitar={() => setEtapa('codigo')} onCancelar={sair} />}

            {etapa === 'codigo' && <EtapaCodigo onValidado={validado} onVoltar={() => setEtapa('escolha')} />}

            {etapa === 'identificada' && <EtapaIdentificada codigo={codigo} onContinuar={() => setEtapa('confirmar')} />}

            {etapa === 'confirmar' && projeto && (
                <EtapaConfirmar projeto={projeto} onVotado={votado} onNao={sair} onRecomecar={() => setEtapa('escolha')} />
            )}
            
            {etapa === 'registrado' && projeto && (
                <EtapaRegistrado projeto={projeto} codigo={codigo} dataHora={dataHora} onFinalizar={() => navigate('/projetos')} />
            )}
        </>
    )

}
