import { apiGet } from "./Api";

export function buscarAgenda(data){
    return apiGet('/eventos', { data })
}