import { Check } from "lucide-react";

export function EtapaRegistrado({ projeto, codigo, dataHora, onFinalizar }){
    return (
        <section className="secao votacao-card votacao-centro">
            <div className="icone-selo icone-selo-grande"><Check size={28}/></div>
            <h1 className="votacao-titulo">Voto Registrado!</h1>
            <p className="votacao-sub">O seu voto foi computado com sucesso!</p>

            <div className="recibo">
                <small>PROJETO</small>
                <strong>{projeto.nome_projeto}</strong>
                <small>DATA E HORA</small>
                <span>{dataHora}</span>
                <span className="recibo-pulseira">PULSEIRA: <b>{codigo}</b></span>
            </div>

            <button className="btn-primario btn-largo" onClick={onFinalizar}>Voltar aos projetos</button>
        </section>
    )
}