import { KeyRound, QrCode } from "lucide-react";

export function EtapaEscolha({ onCodigo, onScanner }){
    return (
        <section className="secao votacao-card">
            <h1 className="votacao-titulo">Valide o seu crachá</h1>
            <p className="votacao-sub">Escolha como que quer identificar o seu crachá de visitante.</p>

            <button type="button" className="opcao-pulseira" onClick={onCodigo}>
                <span className="opcao-icone"><KeyRound size={22}/></span>
                <span className="opcao-texto">
                    <strong>Inserir código da pulseira</strong>
                    <small>Digite o código de 6 dígitos impresso no crachá.</small>
                </span>
            </button>

            <button type="button" className="opcao-pulseira" onClick={onScanner}>
                <span className="opcao-icone"><QrCode size={22}/></span>
                <span className="opcao-texto">
                    <strong>Escanear o QR Code</strong>
                    <small>Aponte a câmera para o QR Code do crachá.</small>
                </span>
            </button>
        </section>
    )
}