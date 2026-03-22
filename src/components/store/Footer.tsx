import { Shield, Truck, CreditCard, Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-10">
          {[
            { icon: Truck, title: "Frete Grátis", desc: "Acima de R$299" },
            { icon: Shield, title: "Compra Segura", desc: "Seus dados protegidos" },
            { icon: CreditCard, title: "Até 12x", desc: "Sem juros no cartão" },
            { icon: Headphones, title: "Suporte", desc: "Atendimento rápido" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-primary-foreground/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Cantinho do Tenis. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
