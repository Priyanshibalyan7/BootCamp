import { capitalize } from '../../utils/helpers'

export default function CategoryPills({ categories, selected, onSelect }) {
  return (
    <div className="cat-pills">
      {categories.map(c => (
        <button
          key={c}
          className={`cat-pill ${selected === c ? 'active' : ''}`}
          onClick={() => onSelect(c)}
        >
          {capitalize(c)}
        </button>
      ))}
    </div>
  )
}
