import { useEffect, useState } from 'react'
import { getProducts, getCategories, getByCategory, getFeatured } from '../api/products'

export function useProducts() {
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    getProducts().then(d => { setProducts(d); setLoading(false) })
  }, [])

  return { products, loading }
}

export function useFeatured(n = 8) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getFeatured(n).then(d => { setProducts(d); setLoading(false) })
  }, [n])

  return { products, loading }
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    getCategories().then(d => { setCategories(['all', ...d]); setLoading(false) })
  }, [])

  return { categories, loading }
}

export function useRelated(category, excludeId) {
  const [related,  setRelated]  = useState([])

  useEffect(() => {
    if (!category) return
    getByCategory(category).then(d =>
      setRelated(d.filter(p => p.id !== excludeId).slice(0, 4))
    )
  }, [category, excludeId])

  return { related }
}
