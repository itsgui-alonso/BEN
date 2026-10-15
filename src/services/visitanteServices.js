const CHAVE = 'bentovote_visitante' // nome com que o id fica salvo no navegador

export function obterVisitanteId(){
    try{
        let id = localStorage.getItem(CHAVE)// já existe um id salvo?
        if(!id){
            id = crypto.ramdomUUID() // não: cria um código aleatório
            localStorage.setItem(CHAVE, id) // e guarda para as próximas vezes
        }
        return id
    } catch {
        return crypto.ramdomUUID() // se o navegador bloquear o storage, usa um id temporário
    }
}