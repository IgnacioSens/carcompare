import { useTitulo } from '../hooks/useTitulo'

export function Ajuda() {
  useTitulo('Central de Ajuda')
  const topicos = [
    {
      pergunta: 'Como comparar dois carros?',
      resposta: 'Acesse a página "Comparar" pelo menu superior, selecione dois modelos nos campos indicados e as informações serão exibidas lado a lado automaticamente.',
    },
    {
      pergunta: 'Como adicionar um carro aos favoritos?',
      resposta: 'Clique em qualquer carro no catálogo para acessar sua página de detalhes. Estando logado, clique em "Adicionar aos favoritos". Seus favoritos ficam salvos na sua conta.',
    },
    {
      pergunta: 'Como filtrar carros por categoria ou combustível?',
      resposta: 'Na página do Catálogo, use a barra lateral à esquerda para filtrar por marca, categoria ou tipo de combustível. Os resultados são atualizados automaticamente.',
    },
    {
      pergunta: 'Os preços exibidos são oficiais?',
      resposta: 'Os preços são baseados em referências de mercado e podem variar conforme versão, ano-modelo, região e disponibilidade. Consulte sempre a concessionária oficial.',
    },
    {
      pergunta: 'Como criar uma conta?',
      resposta: 'Clique em "Entrar" na barra superior e selecione "Criar conta". Preencha seus dados e você receberá um email de confirmação.',
    },
    {
      pergunta: 'Esqueci minha senha. O que faço?',
      resposta: 'No momento, entre em contato pelo formulário de contato e nossa equipe irá auxiliar na recuperação da sua conta.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-black text-on-surface">Central de Ajuda</h1>
        <p className="text-on-surface-variant text-sm mt-2">Encontre respostas para as dúvidas mais comuns sobre o CarCompare.</p>
      </div>

      <div className="flex flex-col gap-4">
        {topicos.map((t, i) => (
          <div key={i} className="bg-white dark:bg-surface-container rounded-2xl shadow-card p-6 flex flex-col gap-2">
            <h2 className="font-bold text-on-surface text-[15px]">{t.pergunta}</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">{t.resposta}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
