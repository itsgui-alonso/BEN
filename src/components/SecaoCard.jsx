// Icone vem como componente e children = o conteudo que está dentro
export function SecaoCard({ icone: Icone, titulo, className = '', children }) {
    return (
        <section className={`secao ${className}`}>
            <h3 className="secao-titulo">
                <Icone size={14}/>
                {titulo}
            </h3>
            {children}
        </section>
    )
}