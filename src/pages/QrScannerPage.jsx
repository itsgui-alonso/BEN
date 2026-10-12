import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; // controla o "enviando / deu certo / deu erro"
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { useProjeto } from "../hooks/useProjetos";
import { validarQrCode } from "../services/sessionServices";


export function QrScannerPage(){
    const { id } = useParams(); // id do projeto vindo da URL
    const navigate = useNavigate()
    const { data: projeto } = useProjeto(id) // busca o projeto só para mostrar o nome
    const [erroCamera, setErroCamera] = useState('') // mensagem se a câmera falhar/for negada

    const validacao = useMutation({
        mutationFn: validarQrCode, // função que manda o QR ao back
        onSuccess: () => navigate(`/projetos/${id}`) // TEMPORÁRIO: depois vai para a próxima etapa do voto
    })

    const aoEscanear = (codigos) => { // a lib chama isto quando lê um QR
        const texto = codigos[0]?.rawValue?.trim() // texto do primeiro QR lido
        if(!texto) return  // leitura vazia: ignora
        validacao.mutate(texto) // envia ao back para validar
    }

    const aoErrarCamera = (erro) => {                          // a lib chama isto se a câmera não abrir
    setErroCamera(
      erro?.name === 'NotAllowedError'
        ? 'Permita o acesso à câmera para escanear o crachá.' // usuário negou a permissão
        : 'Não foi possível abrir a câmera.'                  // outro problema (sem câmera, HTTP...)
    )
  }

  return (
    <>
        <Header nome="Mariana Costa" tipo='Visitante' evento='BentoTec 2026' />

        <div className="scanner-topo">
            <button className="icone-btn" onClick={() => navigate(-1)} aria-label="Voltar">
                <ArrowLeft size={18}/>
            </button>
            <div>
                <small>Votação</small>
                <strong>{projeto?.nome_projeto}</strong>
            </div>
        </div>

        <div className="etapas">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= 2 ? 'etapa etapa-ativa' : 'etapa'} /> // etapa 2 = escanear
            ))}
        </div>

        <section className="secao scanner-card">
            <h1 className="sobre-titulo">Escanear QR Code</h1>
            <p className="sobre-texto">Centre o QR Code do crachá dentro da moldura</p>

            <div className="scanner-moldura">
                <Scanner
                    onScan={aoEscanear}
                    onError={aoErrarCamera}
                    paused={validacao.isPending || validacao.isSuccess} // pausa enquanto valida, evita enviar 2x
                    formats={['qr_code']}
                    constraints={{ facingMode: 'environment' }}
                    scanDelay={500}
                    components={{ finder: false}}
                />
            </div>

            {erroCamera && <p className="scanner-erro">{erroCamera}</p>}
            {validacao.isPending && <p className="scanner-info">Validando crachá...</p>}
            {validacao.isError && (
                <p className="scanner-erro">{validacao.error.message}</p> // ex: "QrCode invalido!"
            )}

            <button className="btn-cancelar" onClick={() => navigate(`/projetos/${id}`)}>
                Cancelar
            </button>

        </section>
    </>
  )
}
