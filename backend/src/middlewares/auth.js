import jwt from 'jsonwebtoken'

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Acesso negado. Faça login.' })
  }

  const token = cabecalho.split(' ')[1]

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = dados
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}
