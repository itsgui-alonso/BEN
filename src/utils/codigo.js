export function limparCodigo(bruto){
  let texto = String(bruto ?? '')                       // garante que é texto, mesmo se vier null
    .normalize('NFKC')                                  // troca variações de caracteres (largura total, etc.) pelo normal
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')        // remove caracteres invisíveis (espaço de largura zero, BOM)
    .replace(/[\u2010-\u2015\u2212]/g, '-')             // transforma todos os tipos de traço em hífen comum
    .trim()                                             // tira espaços e quebras de linha das pontas
  return texto
}