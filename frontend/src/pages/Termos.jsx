export function Termos() {
  const secoes = [
    {
      titulo: '1. Aceitação dos Termos',
      texto: 'Ao acessar e utilizar a plataforma CarCompare, você concorda com os presentes Termos de Uso. Caso não concorde com alguma condição, recomendamos que não utilize nossos serviços.',
    },
    {
      titulo: '2. Uso da Plataforma',
      texto: 'O CarCompare é uma plataforma de comparação de veículos para fins informativos. As informações exibidas — como preços, especificações e disponibilidade — são baseadas em referências de mercado e podem variar conforme versão, ano-modelo e região.',
    },
    {
      titulo: '3. Cadastro e Conta',
      texto: 'Para utilizar funcionalidades como favoritos, é necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.',
    },
    {
      titulo: '4. Propriedade Intelectual',
      texto: 'Todo o conteúdo da plataforma, incluindo textos, imagens, logotipos e código-fonte, é de propriedade do CarCompare ou de seus licenciantes. É proibida a reprodução ou distribuição sem autorização prévia.',
    },
    {
      titulo: '5. Limitação de Responsabilidade',
      texto: 'O CarCompare não se responsabiliza por decisões de compra tomadas com base nas informações exibidas na plataforma. Recomendamos sempre consultar uma concessionária ou revendedor autorizado.',
    },
    {
      titulo: '6. Alterações nos Termos',
      texto: 'Podemos atualizar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após publicação. O uso continuado da plataforma após as alterações implica na aceitação dos novos termos.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-black text-on-surface">Termos de Uso</h1>
        <p className="text-on-surface-variant text-sm mt-2">Última atualização: maio de 2026.</p>
      </div>

      <div className="flex flex-col gap-6">
        {secoes.map((s, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h2 className="font-bold text-on-surface">{s.titulo}</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">{s.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
