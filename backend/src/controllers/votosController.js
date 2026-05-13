import pool from '../config/database.js'

export async function listarRanking(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        c.id, c.modelo, c.ano, c.preco, c.combustivel, c.imagem_url,
        m.nome  AS marca,  m.logo_url,
        cat.nome AS categoria,
        COUNT(v.id)::int AS total_votos
      FROM carros c
      JOIN marcas     m   ON c.marca_id     = m.id
      JOIN categorias cat ON c.categoria_id = cat.id
      LEFT JOIN votos v   ON v.carro_id     = c.id
      GROUP BY c.id, m.nome, m.logo_url, cat.nome
      ORDER BY total_votos DESC, c.modelo ASC
      LIMIT 20
    `)
    res.json(resultado.rows)
  } catch (erro) {
    console.error('Erro ao listar ranking:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function verificarVoto(req, res) {
  const usuarioId = req.usuario.id
  const { carroId } = req.params
  try {
    const resultado = await pool.query(
      'SELECT id FROM votos WHERE usuario_id = $1 AND carro_id = $2',
      [usuarioId, carroId]
    )
    res.json({ votado: resultado.rows.length > 0 })
  } catch (erro) {
    console.error('Erro ao verificar voto:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function votar(req, res) {
  const usuarioId = req.usuario.id
  const { carroId } = req.params
  try {
    const jaExiste = await pool.query(
      'SELECT id FROM votos WHERE usuario_id = $1 AND carro_id = $2',
      [usuarioId, carroId]
    )
    if (jaExiste.rows.length > 0) {
      return res.status(409).json({ erro: 'Você já votou neste carro.' })
    }

    await pool.query(
      'INSERT INTO votos (usuario_id, carro_id) VALUES ($1, $2)',
      [usuarioId, carroId]
    )

    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM votos WHERE carro_id = $1',
      [carroId]
    )
    res.status(201).json({ mensagem: 'Voto registrado!', total_votos: rows[0].total })
  } catch (erro) {
    console.error('Erro ao votar:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function removerVoto(req, res) {
  const usuarioId = req.usuario.id
  const { carroId } = req.params
  try {
    const resultado = await pool.query(
      'DELETE FROM votos WHERE usuario_id = $1 AND carro_id = $2 RETURNING id',
      [usuarioId, carroId]
    )
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Voto não encontrado.' })
    }

    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM votos WHERE carro_id = $1',
      [carroId]
    )
    res.json({ mensagem: 'Voto removido.', total_votos: rows[0].total })
  } catch (erro) {
    console.error('Erro ao remover voto:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}
