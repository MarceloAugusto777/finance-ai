import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">FinanceAI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Sua solução completa para gestão financeira inteligente. 
              Controle suas finanças de forma simples e segura.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/sobre" className="hover:text-foreground transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/politica-privacidade" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FinanceAI. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Desenvolvido com ❤️ no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}