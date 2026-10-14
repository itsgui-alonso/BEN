import { BadgeCheck } from "lucide-react";

export function EtapaIdentificada({ codigo, onContinuar }){ // codigo = o que foi validado
    return (
        <section className="secao votacao-card">
            <div className="icone-selo"><BadgeCheck size={22}/></div>
            <h1 className="votacao-titulo">Crachá Identificado</h1>
            <p className="votacao-sub">O seu crachá foi validado com sucesso!</p>

            <div className="caixa-codigo">
                <small>CODIGO</small>
                <strong>{codigo}</strong>
            </div>

            <button className="btn-primario btn-largo" onClick={onContinuar}>Continuar</button>
        </section>
    )
}