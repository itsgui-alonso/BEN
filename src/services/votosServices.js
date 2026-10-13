import { apiPost } from "./Api";

export function consultarVotosRestantes({ token, projectId }){
    return apiPost('/votos/restantes', { token, projectId }) // pergunta ao back quantos votos sobram
}

export function votar({ token, projectId }){
    return apiPost('/votos/votar', { token, projectId }) // registra o voto
}