import pool from '../config/database.js'

const BG_BY_CATEGORY = {
  hatch:     '#d3e4fe',
  sedan:     '#e5eeff',
  suv:       '#dce9ff',
  esportivo: '#cbdbf5',
  picape:    '#f0e8ff',
  eletrico:  '#e0f5e9',
}

function normalizeStr(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function normalizeFuel(fuel) {
  const map = { flex: 'Flex', gasolina: 'Gasolina', eletrico: 'Elétrico', hibrido: 'Híbrido', diesel: 'Diesel' }
  return map[normalizeStr(fuel)] || fuel || ''
}

const SQL = `
  SELECT
    c.id,
    m.nome           AS brand,
    c.modelo         AS model,
    c.ano,
    c.preco          AS price,
    c.combustivel    AS fuel,
    cat.nome         AS category,
    e.potencia_cv    AS hp,
    e.torque_nm      AS torque,
    e.zero_cem       AS acc,
    e.velocidade_max AS "topSpeed",
    e.motor          AS engine,
    e.consumo_cidade AS "consumoCidade",
    c.imagem_url     AS "imagemUrl"
  FROM carros c
  LEFT JOIN marcas        m   ON m.id      = c.marca_id
  LEFT JOIN categorias    cat ON cat.id    = c.categoria_id
  LEFT JOIN especificacoes e  ON e.carro_id = c.id
`

function formatCar(row) {
  const category = normalizeStr(row.category)
  const price    = Number(row.price)
  return {
    id:         row.id,
    brand:      row.brand  || '',
    model:      row.model  || '',
    ano:        row.ano,
    price:      price,
    priceNum:   price,
    priceLabel: `R$ ${price.toLocaleString('pt-BR')}`,
    hp:         row.hp       != null ? Number(row.hp)                          : null,
    acc:        row.acc      != null ? `${Number(row.acc).toFixed(1)}s`        : null,
    torque:     row.torque   != null ? `${Number(row.torque).toFixed(0)} Nm`   : null,
    topSpeed:   row.topSpeed != null ? `${Number(row.topSpeed).toFixed(0)} km/h` : null,
    engine:     row.engine   || null,
    fuel:       normalizeFuel(row.fuel),
    category,
    cons:       row.consumoCidade != null ? `${Number(row.consumoCidade).toFixed(1)} km/l` : null,
    bg:         BG_BY_CATEGORY[category] || '#dce9ff',
    trans:      null,
    drive:      null,
    length:     null,
    width:      null,
    height:     null,
    trunk:      null,
    imagemUrl:  row.imagemUrl || null,
    pros:       [],
    negatives:  [],
  }
}

export async function getCars(req, res) {
  try {
    const { rows } = await pool.query(SQL + ' ORDER BY m.nome, c.modelo')
    res.json(rows.map(formatCar))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar carros' })
  }
}

export async function getCarById(req, res) {
  try {
    const { rows } = await pool.query(SQL + ' WHERE c.id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Carro não encontrado' })
    res.json(formatCar(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar carro' })
  }
}
