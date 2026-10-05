import { apiGet } from "./Api";

export function listarCategorias(){
    return apiGet('/categorias') // vai devolver id e nome da categoria
}