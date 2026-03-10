export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {/* "Todos" tab */}
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${
          selected === null
            ? "bg-chile text-white shadow-md shadow-chile/30"
            : "bg-cream dark:bg-stone-800 text-charcoal/60 dark:text-stone-400 hover:bg-mostaza/10 dark:hover:bg-stone-700 hover:text-mostaza"
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${
            selected === cat.id
              ? "bg-chile text-white shadow-md shadow-chile/30"
              : "bg-cream dark:bg-stone-800 text-charcoal/60 dark:text-stone-400 hover:bg-mostaza/10 dark:hover:bg-stone-700 hover:text-mostaza"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
