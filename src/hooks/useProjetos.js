import { useInfiniteQuery } from "@tanstack/react-query"; // versão do React Query para a slistas crescerem pagina por pagina
import { listarProjetos } from "../services/projetosServices";
import { useQuery } from "@tanstack/react-query";
import { buscarProjeto } from "../services/projetosServices";
export function useProjetos({ busca, categoria }){ // Recebe o texto da busca e a categoria escolhida
    return useInfiniteQuery({
        queryKey: ['projetos', { busca, categoria }], 

        queryFn: ({ pageParam }) => { // pageParam é o numero da pagina
           return listarProjetos({ busca, categoria, page: pageParam, limit: 10 }) // chama a API pedindo 10 projetos
        },
        initialPageParam: 1,

        getNextPageParam: (ultimaPagina) => { // depois de cada busca, o react query pergunta: qual a proxima pagina
            const { page, totalPaginas } = ultimaPagina.paginacao // minha API vai devolver a pagina atual e o total de paginas
            return page < totalPaginas ? page + 1 : undefined // se ainda tem paginas, devolve - se não undefined, acabaram as paginas
        }
    })
}

export function useProjeto(id){
    return useQuery({
        queryKey: ['projeto', id], // aqui cada projeto tem seu lugar no cache
        queryFn: () => buscarProjeto(id), // Chma a API com o id da URL
        staleTime: 1000 * 60 * 5 // 5 minutos: Se voltar nesse tempo o projeto abre na hora
    })
}