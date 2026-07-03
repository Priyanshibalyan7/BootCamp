export const formatPrice = (price) => `$${Number(price).toFixed(2)}`

export const filterProducts = (products, { category = 'all', search = '', sort = 'default' } = {}) => {
  let result = [...products]

  if (category !== 'all') {
    result = result.filter(p => p.category === category)
  }

  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(q))
  }

  switch (sort) {
    case 'price-asc':  result.sort((a, b) => a.price - b.price); break
    case 'price-desc': result.sort((a, b) => b.price - a.price); break
    case 'rating':     result.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)); break
    default: break
  }

  return result
}

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
