const API_URL = import.meta.env.VITE_API_URL

export async function apiGet(caminho, params = {}) { // caminho = "/projetos"; params = { busca, categoria... }
    const query = new URLSearchParams() // monta "?chave=valor" com encode correto

    Object.entries(params).forEach(([chave, valor]) => { // vai percorrer cada parametro
        const texto = String(valor ?? '').trim() // vira texto e tira os espaços
        
        if(texto !== ''){
            query.append(chave, texto) // Só envia se não tiver vazio, o backend da eero 400 para busca vazia
        }
    })

    const qs = query.toString() // "busca=robo&page=1"
    const resposta = await fetch(`${API_URL}${caminho}${qs ? `?${qs}` : ''}`) // requisicao GET
    const json = await resposta.json() // le o corpo como JSON

    if(!resposta.ok){
        throw new Error(json.erro ?? 'Erro ao falar com servidor') 
    }
    return json.dados
}