import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { buscarAgenda } from "../services/eventosServices";


export function useEventos(data){
    return useQuery({
        queryKey: ['eventos', data ?? 'auto'], // cada dia tem seu lugar no cache
        queryFn: () => buscarAgenda(data),
        refetchInterval: 60_000,               // atualiza sozinho a cada 1 min (o "agora" vai mudando)
        staleTime: 30_000,                     // 30s: se voltar à aba nesse tempo, abre na hora
        placeholderData: keepPreviousData      // ao trocar de dia, mantém a lista antiga até a nova chegar (sem piscar)
    })
}