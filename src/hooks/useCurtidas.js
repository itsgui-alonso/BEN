import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alternarCurtida, listarMinhasCurtidas } from "../services/curtidasServices";

const CHAVE = ['minhas-curtidas']

export function useCurtidas(){
    const queryClient = useQueryClient()

    const { data: curtidos = [] } = useQuery({
        queryKey: CHAVE,
        queryFn: listarMinhasCurtidas,
        staleTime: 60_000, // não refaz a consulta por 1 minuto
    })

    const mutacao = useMutation({
        mutationFn: alternarCurtida,
        onMutate: async (projectId) => {                   // roda ANTES de ir ao servidor
            await queryClient.cancelQueries({ queryKey: CHAVE });
            const anterior = queryClient.getQueryData(CHAVE) ?? [];   // guarda o estado atual para desfazer
            queryClient.setQueryData(CHAVE, anterior.includes(projectId)
                ? anterior.filter(id => id !== projectId)  // já estava curtido: tira
                : [...anterior, projectId]);               // não estava: adiciona
            return { anterior };
        },
        onError: (_erro, _id, contexto) => {               // deu erro: volta como estava
            queryClient.setQueryData(CHAVE, contexto.anterior);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: CHAVE }), // confirma com o servidor
    });

    return {
        curtidos, 
        estaCurtido: (id) => curtidos.includes(id), // true/false para um projeto
        alternar: (id) => mutacao.mutate(id) // chama ao tocar no coração
    }
}