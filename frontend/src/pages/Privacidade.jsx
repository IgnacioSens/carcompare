import { useTitulo } from '../hooks/useTitulo'

export function Privacidade() {
  useTitulo('Privacidade')
  const secoes = [
    {
      titulo: '1. Dados Coletados',
      texto: 'Coletamos apenas as informações necessárias para o funcionamento da plataforma: nome, endereço de email e dados de uso como carros favoritados. Não coletamos dados financeiros ou documentos pessoais.',
    },
    {
      titulo: '2. Uso dos Dados',
      texto: 'Seus dados são utilizados exclusivamente para personalizar sua experiência na plataforma, como manter sua lista de favoritos e enviar confirmações de cadastro por email. Não vendemos nem compartilhamos seus dados com terceiros.',
    },
    {
      titulo: '3. Armazenamento e Segurança',
      texto: 'As informações são armazenadas em servidores seguros. Senhas são protegidas com criptografia e nunca são armazenadas em texto puro. Utilizamos boas práticas de segurança para proteger seus dados.',
    },
    {
      titulo: '4. Cookies',
      texto: 'A plataforma pode utilizar cookies para melhorar a experiência de navegação. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar o funcionamento de algumas funcionalidades.',
    },
    {
      titulo: '5. Seus Direitos',
      texto: 'Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato através da nossa página de contato.',
    },
    {
      titulo: '6. Contato',
      texto: 'Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato conosco pela página de Contato disponível na plataforma.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-black text-on-surface">Política de Privacidade</h1>
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
