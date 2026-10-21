import { apiPost } from "./Api";

const CHAVE = 'bentovote-sessao'

export async function validarQrCode(qrCode) {
    const sessao = await apiPost('/session/validacao', { qrCode }) // manda o QR; volta { token, expira_em }
    sessionStorage.setItem(CHAVE, JSON.stringify(sessao)) // guarda a sessão (some ao fechar a aba)
    return sessao // devolve para a tela
}
export function lerSessao(){
    const texto = sessionStorage.getItem(CHAVE)
    if(!texto) return null

    const sessao = JSON.parse(texto) // texto para obejto

    if(new Date(sessao.expira_em) < new Date()){ // já passou 10 minutos
        sessionStorage.removeItem(CHAVE) // limpa sessao vencida
        return null
    }

    return sessao // sessao ainda valida
}

export async function validarQrCode(qrCode) {
    const sessao = await apiPost('/session/validacao', { qrCode })
    sessionStorage.setItem(CHAVE, JSON.stringify({ ...sessao, codigo: qrCode })) // guarda também o código
    return sessao
}