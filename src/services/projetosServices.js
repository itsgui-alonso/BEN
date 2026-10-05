import { apiGet } from "./Api";

export function listarProjetos({ busca, categoria, page = 1, limit = 10 }){
    return apiGet('/projetos', { busca, categoria, page, limit }) // Limite coloquei 10 por enquanto
}