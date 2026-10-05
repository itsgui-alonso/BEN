import { useQuery } from "@tanstack/react-query";
import { listarCategorias } from "../services/categoriasServices";

export function useCategorias(){
    return useQuery({
        queryKey: ['categorias'], // a lista de categorias não depende de nada
        queryFn: listarCategorias, // função que  busca os dados
        staleTime: 1000 * 60 * 30 // por 30 minutos, considera os dados frescos e não fica perguntando para API
    })
}