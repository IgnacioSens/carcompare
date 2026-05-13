import { useEffect } from 'react'

export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — CarCompare` : 'CarCompare — Compare carros de forma inteligente'
    return () => { document.title = 'CarCompare — Compare carros de forma inteligente' }
  }, [titulo])
}
