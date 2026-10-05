import { useEffect, useState } from "react";

export function useDebounce(valor, atrasoMs = 400){ // recebe o valor digitado na busca e o tempo de espera (400ms)
    const [ valorComAtraso, setValorComAtraso] = useState(valor) // guarda uma cópia do valor que só utiliza depois da espera

    useEffect(() => {
        const timer = setTimeout(() => { // roda sempre que valor mudar
           setValorComAtraso(valor) // agenda uma atualização para daqui 400ms
        }, atrasoMs)  // atualiza a copia com o texto mais recente

        return () => clearTimeout(timer) // se a pessoa digitar outra letra antes dos 400ms, cancela o agendamento e recomeça
    }, [valor, atrasoMs]) // rode denovo quando valor ou atrasoMS mudarem

    return valorComAtraso // devolve a cópia atrasada
}

// Basicamente a caixa de texto vai usar o texto normal (para mostrar o que a pessoa digita na hora)
// E a API vai usar o texto atrasado para fazer as buscas