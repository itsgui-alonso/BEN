import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // controla o "enviando / deu certo / deu erro"
import { Scanner } from "@yudiel/react-qr-scanner";
import { validarQrCode } from "../../services/sessionServices";
import { limparCodigo } from "../../utils/codigo";

// onValidado(codigo) = avisa a página que o crachá foi aceito; onDigitar = trocar para a tela de digitar; onCancelar = sair
export function EtapaScanner({ onValidado, onDigitar, onCancelar }){
  const [erroCamera, setErroCamera] = useState('');            // mensagem se a câmera falhar

  const validacao = useMutation({
    mutationFn: validarQrCode,                                 // manda o QR ao back e guarda a sessão
    onSuccess: (_sessao, texto) => onValidado(texto),          // 2º argumento = o texto enviado; repassa à página
  });

  const aoEscanear = (codigos) => {
  const texto = limparCodigo(codigos[0]?.rawValue);  // lê o QR e já limpa
  if(!texto) return;                                  // se ficou vazio, ignora
  validacao.mutate(texto);                            // valida no back com o texto limpo
};

  const aoErrarCamera = (erro) => {
    setErroCamera(erro?.name === 'NotAllowedError'
      ? 'Permita o acesso à câmera para escanear o crachá.'
      : 'Não foi possível abrir a câmera.');
  };

  return (
    <section className="secao votacao-card">
      <h1 className="votacao-titulo">Escanear QR Code</h1>
      <p className="votacao-sub">Centre o QR Code da pulseira dentro da moldura</p>

      <div className="scanner-moldura">
        <Scanner
          onScan={aoEscanear}
          onError={aoErrarCamera}
          paused={validacao.isPending || validacao.isSuccess}  // pausa enquanto valida
          formats={['qr_code']}
          constraints={{ facingMode: 'environment' }}
          scanDelay={500}
          components={{ finder: false }}
        />
      </div>

      {erroCamera && <p className="scanner-erro">{erroCamera}</p>}
      {validacao.isPending && <p className="scanner-info">Validando crachá...</p>}
      {validacao.isError && <p className="scanner-erro">{validacao.error.message}</p>}

      <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
    </section>
  );
}
