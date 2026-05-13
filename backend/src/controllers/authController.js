import bcrypt from 'bcryptjs'
import jwt    from 'jsonwebtoken'
import pool   from '../config/database.js'
import { enviarEmailBoasVindas } from '../services/email.js'

export async function cadastrar(req, res) {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' })
  }

  try {
    const jaExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    )
    if (jaExiste.rows.length > 0) {
      return res.status(409).json({ erro: 'Email já cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const resultado = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senhaHash]
    )

    const usuario = resultado.rows[0]

    enviarEmailBoasVindas(usuario.email, usuario.nome).catch(err =>
      console.warn('Email não enviado (configure EMAIL_* no .env):', err.message)
    )

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', usuario })
  } catch (erro) {
    console.error('Erro no cadastro:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function login(req, res) {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha.' })
  }

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }

    const usuario = resultado.rows[0]

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash)
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    })
  } catch (erro) {
    console.error('Erro no login:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}
