import { apiGet } from "./Api";

export function buscarResumo(){
    return apiGet('/relatorio/resumo')
}