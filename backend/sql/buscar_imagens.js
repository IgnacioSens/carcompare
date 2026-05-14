// Script que busca imagens reais do Wikipedia para cada carro
// e gera o SQL de UPDATE automaticamente.
//
// Como rodar: node buscar_imagens.js
// Resultado:  arquivo imagens_geradas.sql pronto para rodar no Supabase

import fs from 'fs'

const carros = [
  { id: 'cc000001-0000-0000-0000-000000000000', wikipedia: 'Toyota_Yaris' },
  { id: 'cc000002-0000-0000-0000-000000000000', wikipedia: 'Honda_Fit' },
  { id: 'cc000003-0000-0000-0000-000000000000', wikipedia: 'Volkswagen_Polo' },
  { id: 'cc000004-0000-0000-0000-000000000000', wikipedia: 'Fiat_Argo' },
  { id: 'cc000005-0000-0000-0000-000000000000', wikipedia: 'Chevrolet_Onix' },
  { id: 'cc000006-0000-0000-0000-000000000000', wikipedia: 'Renault_Sandero' },
  { id: 'cc000007-0000-0000-0000-000000000000', wikipedia: 'Mini_Cooper' },
  { id: 'cc000008-0000-0000-0000-000000000000', wikipedia: 'Hyundai_HB20' },
  { id: 'cc000009-0000-0000-0000-000000000000', wikipedia: 'Mazda2' },
  { id: 'cc000010-0000-0000-0000-000000000000', wikipedia: 'Kia_Rio' },
  { id: 'cc000011-0000-0000-0000-000000000000', wikipedia: 'Toyota_Corolla_(E210)' },
  { id: 'cc000012-0000-0000-0000-000000000000', wikipedia: 'Honda_Civic_(eleventh_generation)' },
  { id: 'cc000013-0000-0000-0000-000000000000', wikipedia: 'Volkswagen_Virtus' },
  { id: 'cc000014-0000-0000-0000-000000000000', wikipedia: 'Chevrolet_Onix_Plus' },
  { id: 'cc000015-0000-0000-0000-000000000000', wikipedia: 'Nissan_Sentra' },
  { id: 'cc000016-0000-0000-0000-000000000000', wikipedia: 'Mazda3' },
  { id: 'cc000017-0000-0000-0000-000000000000', wikipedia: 'BMW_3_Series_(G20)' },
  { id: 'cc000018-0000-0000-0000-000000000000', wikipedia: 'Mercedes-Benz_C-Class_(W206)' },
  { id: 'cc000019-0000-0000-0000-000000000000', wikipedia: 'Audi_A4_(B9)' },
  { id: 'cc000020-0000-0000-0000-000000000000', wikipedia: 'Lexus_IS_(third_generation)' },
  { id: 'cc000021-0000-0000-0000-000000000000', wikipedia: 'Toyota_RAV4_(XA50)' },
  { id: 'cc000022-0000-0000-0000-000000000000', wikipedia: 'Honda_CR-V_(sixth_generation)' },
  { id: 'cc000023-0000-0000-0000-000000000000', wikipedia: 'Hyundai_Tucson_(NX4)' },
  { id: 'cc000024-0000-0000-0000-000000000000', wikipedia: 'Jeep_Renegade' },
  { id: 'cc000025-0000-0000-0000-000000000000', wikipedia: 'Jeep_Compass_(MP)' },
  { id: 'cc000026-0000-0000-0000-000000000000', wikipedia: 'Land_Rover_Defender_(L663)' },
  { id: 'cc000027-0000-0000-0000-000000000000', wikipedia: 'BMW_X5_(G05)' },
  { id: 'cc000028-0000-0000-0000-000000000000', wikipedia: 'Mercedes-Benz_GLE-Class_(W167)' },
  { id: 'cc000029-0000-0000-0000-000000000000', wikipedia: 'Audi_Q5_(FY)' },
  { id: 'cc000030-0000-0000-0000-000000000000', wikipedia: 'Kia_Sportage_(NQ5)' },
  { id: 'cc000031-0000-0000-0000-000000000000', wikipedia: 'Volvo_XC60_(second_generation)' },
  { id: 'cc000032-0000-0000-0000-000000000000', wikipedia: 'Porsche_Cayenne_(9YA)' },
  { id: 'cc000033-0000-0000-0000-000000000000', wikipedia: 'Subaru_Forester_(SK)' },
  { id: 'cc000034-0000-0000-0000-000000000000', wikipedia: 'Ford_Bronco_Sport' },
  { id: 'cc000035-0000-0000-0000-000000000000', wikipedia: 'Chevrolet_Trailblazer_(2021)' },
  { id: 'cc000036-0000-0000-0000-000000000000', wikipedia: 'Toyota_Hilux_(eighth_generation)' },
  { id: 'cc000037-0000-0000-0000-000000000000', wikipedia: 'Ford_Ranger_(T6)' },
  { id: 'cc000038-0000-0000-0000-000000000000', wikipedia: 'Chevrolet_Colorado' },
  { id: 'cc000039-0000-0000-0000-000000000000', wikipedia: 'Nissan_Frontier_(D41)' },
  { id: 'cc000040-0000-0000-0000-000000000000', wikipedia: 'Ram_1500_(DT)' },
  { id: 'cc000041-0000-0000-0000-000000000000', wikipedia: 'Ford_Maverick_(2022)' },
  { id: 'cc000042-0000-0000-0000-000000000000', wikipedia: 'Mitsubishi_Triton' },
  { id: 'cc000043-0000-0000-0000-000000000000', wikipedia: 'Rivian_R1T' },
  { id: 'cc000044-0000-0000-0000-000000000000', wikipedia: 'BMW_M4_(G82)' },
  { id: 'cc000045-0000-0000-0000-000000000000', wikipedia: 'Mercedes-AMG_C_63' },
  { id: 'cc000046-0000-0000-0000-000000000000', wikipedia: 'Audi_RS5' },
  { id: 'cc000047-0000-0000-0000-000000000000', wikipedia: 'Porsche_992' },
  { id: 'cc000048-0000-0000-0000-000000000000', wikipedia: 'Alfa_Romeo_Giulia_(952)' },
  { id: 'cc000049-0000-0000-0000-000000000000', wikipedia: 'Mazda_MX-5_(ND)' },
  { id: 'cc000050-0000-0000-0000-000000000000', wikipedia: 'Dodge_Challenger_(LC)' },
]

async function buscarImagem(titulo) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.thumbnail?.source) {
      // Aumenta a resolução da thumbnail para 1280px
      return data.thumbnail.source.replace(/\/\d+px-/, '/1280px-')
    }
    return null
  } catch {
    return null
  }
}

async function main() {
  console.log('Buscando imagens do Wikipedia...\n')
  const linhas = []
  const falhas = []

  for (const carro of carros) {
    const imagem = await buscarImagem(carro.wikipedia)

    if (imagem) {
      console.log(`✅ ${carro.wikipedia}`)
      linhas.push(`UPDATE carros SET imagem_url = '${imagem}' WHERE id = '${carro.id}';`)
    } else {
      console.log(`❌ ${carro.wikipedia} — não encontrado`)
      falhas.push(carro.wikipedia)
    }

    // Pequena pausa para não sobrecarregar a API
    await new Promise(r => setTimeout(r, 300))
  }

  const sql = linhas.join('\n')
  fs.writeFileSync('./imagens_geradas.sql', sql, 'utf-8')

  console.log('\n✅ SQL gerado em: backend/sql/imagens_geradas.sql')

  if (falhas.length > 0) {
    console.log('\n⚠️  Não encontrados (precisam de ajuste manual):')
    falhas.forEach(f => console.log(`   - ${f}`))
  }
}

main()
