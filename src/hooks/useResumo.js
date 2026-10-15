import { useQuery } from "@tanstack/react-query";
import { buscarResumo } from "../services/relatorioServices";

export function useResumo(){
    return useQuery({
        queryKey: ['resumo-votacao'],
        queryFn: buscarResumo,
        refetchInterval: 30_000, // atualiza em 30 segundos
        staleTime: 15_000,
    })
}