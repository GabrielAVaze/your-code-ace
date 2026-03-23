const brands = [
  { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { name: "Puma", logo: "https://1000logos.net/wp-content/uploads/2017/05/PUMA-Logo.png" },
  { name: "Vans", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg" },
  { name: "Converse", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg" },
  { name: "Asics", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg" },
];

const BrandsBanner = () => {
  return (
    <section className="border-y bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
          Marcas oficiais
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 w-auto object-contain opacity-40 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsBanner;