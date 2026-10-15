import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Vote } from "lucide-react";
import { validarQrCode } from "../../services/sessionServices";

export function EtapaCodigo({ onValidado, onVoltar }){
    const [codigo, setCodigo] = useState('') // o que o visitante digitar

    const validacao = useMutation({
        mutationFn: validarQrCode, // mesma função do scanner
        onSuccess: (_sessao, texto) => onValidado(texto) // avisa a pagina com o código aceito
    })

    const enviar = (e) => {
         e.preventDefault() // impede a página de recarregar ao dar Enter
         const texto = codigo.trim() // tira espaços das pontas
         if(!texto){ // vazio: não envia
            return
         }
         validacao.mutate(texto)
    }

    return (
        <main className="etapa-codigo">
            <section className="secao votacao-card">
                <h1 className="votacao-titulo">Código do Crachá</h1>
                <p className="votacao-sub">Insira o código impresso no seu crachá</p>

                <form onSubmit={enviar}>
                    <input
                        className="campo-codigo"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)} // atualiza o estado a cada letra digitada
                        placeholder="Ex: BTF5K9"
                        autoCapitalize="characters" // o celular ja abre em letra maiuscula
                        autoComplete="off"
                        spellCheck={false}
                    />

                    {validacao.isError && <p className="scanner-erro">{validacao.error.message}</p>}

                    <div className="votacao-botoes">
                        <button type="button" className="btn-secundario" onClick={onVoltar}>Voltar</button>
                        <button type="submit" className="btn-primario" disabled={validacao.isPending}>
                            <Vote size={16} />
                            {validacao.isPending ? 'Validando...' : 'Validar'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}