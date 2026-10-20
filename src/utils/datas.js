const FUSO = 'America/Sao_Paulo'
// '2026-10-21T11:30:00.000Z' vira '08:30'
export function formatarHora(iso){
    return new Date(iso).toISOString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: FUSO })
}

export function formatarDataLonga(dataISO){
    const [ano, mes, dia] = dataISO.split('-').map(Number)
    const data = new Date(ano, mes - 1, dia) // monta pelas partes, para o JS não "voltar um dia" por causa do fuso
    const texto = data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

    return texto.charAt(0).toUpperCase() + texto.slice(1) // 1ª letra maiúscula
}