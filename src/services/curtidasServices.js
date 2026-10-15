import { apiPost } from "./Api";
import { obterVisitanteId } from "./visitanteServices";

export function alternarCurtida(projectId){
    return apiPost('/curtidas/alternar', { visitanteId: obterVisitanteId(), projectId }) // curte e descurte
}

export async function listarMinhasCurtidas() {
    const dados = await apiPost('/curtidas/minhas', { visitanteId: obterVisitanteId() })
    return dados.projetos
}