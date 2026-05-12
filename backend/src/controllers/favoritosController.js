import pool from '../config/database.js'

export async function listarFavoritos(req, res) {
  const usuarioId = req.usuario.id

  try {
    const resultado = await pool.query(
      `SELECT
        f.id AS favorito_id, f.created_at,
        c.id, c.modelo, c.ano, c.preco, c.combustivel, c.imagem_url,
        m.nome AS marca,
        cat.nome AS categoria
      FROM favoritos f
      JOIN carros     c   ON f.carro_id     = c.id
      JOIN marcas     m   ON c.marca_id     = m.id
      JOIN categorias cat ON c.categoria_id = cat.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC`,
      [usuarioId]
    )
    res.json(resultado.rows)
  } catch (erro) {
    console.error('Erro ao listar favoritos:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function adicionarFavorito(req, res) {
  const usuarioId = req.usuario.id
  const { carro_id } = req.body

  if (!carro_id) {
    return res.status(400).json({ erro: 'Informe o carro_id.' })
  }

  try {
    const jaExiste = await pool.query(
      'SELECT id FROM favoritos WHERE usuario_id = $1 AND carro_id = $2',
      [usuarioId, carro_id]
    )
    if (jaExiste.rows.length > 0) {
      return res.status(409).json({ erro: 'Carro já está nos favoritos.' })
    }

    await pool.query(
      'INSERT INTO favoritos (usuario_id, carro_id) VALUES ($1, $2)',
      [usuarioId, carro_id]
    )

    res.status(201).json({ mensagem: 'Carro adicionado aos favoritos.' })
  } catch (erro) {
    console.error('Erro ao adicionar favorito:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function removerFavorito(req, res) {
  const usuarioId = req.usuario.id
  const { carroId } = req.params

  try {
    const resultado = await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND carro_id = $2 RETURNING id',
      [usuarioId, carroId]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Favorito não encontrado.' })
    }

    res.json({ mensagem: 'Carro removido dos favoritos.' })
  } catch (erro) {
    console.error('Erro ao remover favorito:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}
