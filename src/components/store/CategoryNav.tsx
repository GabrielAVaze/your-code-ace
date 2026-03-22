import { useState } from "react";

const categories = [
  "Início", "Nike", "Adidas", "Puma", "Vans", "Converse", "Asics", "Todos os Produtos"
];

interface Props {
  onCategoryChange?: (cat: string) => void;
}

const CategoryNav = ({ onCategoryChange }: Props) => {
  const [active, setActive] = useState("Início");

  const handleClick = (cat: string) => {
    setActive(cat);
    onCategoryChange?.(cat);
  };

  return (
    <nav className="bg-primary/95 border-t border-primary-foreground/10 overflow-x-auto scrollbar-hide">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
              active === cat
                ? "text-accent"
                : "text-primary-foreground/80 hover:text-primary-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
