const CHAVE = 'bentovote_visitante'

function gerarUUID(){
    if(typeof crypto.randomUUID === 'function'){
        return crypto.randomUUID()
    }
    // Plano B: UUID v4 válido com números aleatórios do navegador
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
    )
}

export function obterVisitanteId(){
    try{
        let id = localStorage.getItem(CHAVE)
        if(!id){
            id = gerarUUID()
            localStorage.setItem(CHAVE, id)
        }
        return id
    } catch {
        return gerarUUID()
    }
}