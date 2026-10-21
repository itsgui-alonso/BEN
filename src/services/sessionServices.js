import { apiPost } from "./Api";

const CHAVE = 'bentovote-sessao'

export async function validarQrCode(qrCode) {
    const sessao = await apiPost('/session/validacao', { qrCode }) // manda o QR; volta { token, expira_em }
    sessionStorage.setItem(CHAVE, JSON.stringify({ ...sessao, codigo: qrCode })) // guarda a sessão + o código do crachá
    return sessao // devolve para a tela
}

export function lerSessao(){
    const texto = sessionStorage.getItem(CHAVE)
    if(!texto) return null

    const sessao = JSON.parse(texto) // texto para objeto

    if(new Date(sessao.expira_em) < new Date()){ // já passou 10 minutos
        sessionStorage.removeItem(CHAVE) // limpa sessão vencida
        return null
    }

    return sessao // sessão ainda válida
}