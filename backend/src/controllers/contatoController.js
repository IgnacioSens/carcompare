import { enviarEmailContato } from '../services/email.js'

export async function enviarContato(req, res) {
  const { nome, email, mensagem } = req.body

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' })
  }

  try {
    await enviarEmailContato(nome, email, mensagem)
    res.json({ mensagem: 'Mensagem enviada com sucesso!' })
  } catch (erro) {
    console.error('Erro ao enviar contato:', erro)
    res.status(500).json({ erro: 'Erro ao enviar mensagem. Tente novamente.' })
  }
}
