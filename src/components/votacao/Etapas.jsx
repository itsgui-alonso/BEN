export function Etapas({ atual }){
    return (
        <div className="etapas">
            {[1, 2, 3, 4, 5].map((n) => ( // cria os 5 segmentos
                <span key={n} className={n <= atual ? 'etapa etapa-ativa' : 'etapa'} /> // colorido até a etapa atual
            ))}
        </div>
    )
}