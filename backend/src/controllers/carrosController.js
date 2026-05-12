import pool from '../config/database.js'

export async function listarCarros(req, res) {
  const { marca, categoria, combustivel, busca } = req.query

  try {
    let query = `
      SELECT
        c.id, c.modelo, c.ano, c.preco, c.combustivel, c.imagem_url,
        c.potencia, c.torque, c.zero_cem, c.velocidade_maxima, c.motor, c.consumo,
        m.nome  AS marca,     m.logo_url,
        cat.nome AS categoria
      FROM carros c
      JOIN marcas     m   ON c.marca_id    = m.id
      JOIN categorias cat ON c.categoria_id = cat.id
      WHERE 1=1
    `
    const params = []

    if (marca) {
      params.push(marca)
      query += ` AND m.id = $${params.length}`
    }

    if (categoria) {
      params.push(categoria)
      query += ` AND cat.id = $${params.length}`
    }

    if (combustivel) {
      params.push(combustivel)
      query += ` AND c.combustivel = $${params.length}`
    }

    if (busca) {
      params.push(`%${busca}%`)
      query += ` AND (c.modelo ILIKE $${params.length} OR m.nome ILIKE $${params.length})`
    }

    query += ' ORDER BY m.nome, c.modelo'

    const resultado = await pool.query(query, params)
    res.json(resultado.rows)
  } catch (erro) {
    console.error('Erro ao listar carros:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function buscarCarro(req, res) {
  const { id } = req.params

  try {
    const resultado = await pool.query(
      `SELECT
        c.id, c.modelo, c.ano, c.preco, c.combustivel, c.imagem_url,
        c.potencia, c.torque, c.zero_cem, c.velocidade_maxima, c.motor, c.consumo,
        m.nome AS marca, m.logo_url, m.pais_origem,
        cat.nome AS categoria, cat.descricao AS categoria_descricao
      FROM carros c
      JOIN marcas     m   ON c.marca_id    = m.id
      JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1`,
      [id]
    )

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Carro não encontrado.' })
    }

    res.json(resultado.rows[0])
  } catch (erro) {
    console.error('Erro ao buscar carro:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function listarMarcas(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT id, nome, pais_origem, logo_url FROM marcas ORDER BY nome'
    )
    res.json(resultado.rows)
  } catch (erro) {
    console.error('Erro ao listar marcas:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}

export async function listarCategorias(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT id, nome, descricao FROM categorias ORDER BY nome'
    )
    res.json(resultado.rows)
  } catch (erro) {
    console.error('Erro ao listar categorias:', erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
}
