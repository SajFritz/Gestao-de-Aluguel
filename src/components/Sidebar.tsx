"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Building2, Users, FileText, DollarSign, Receipt, LogOut, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/imoveis", icon: Building2, label: "Imóveis" },
  { href: "/dashboard/inquilinos", icon: Users, label: "Inquilinos" },
  { href: "/dashboard/contratos", icon: FileText, label: "Contratos" },
  { href: "/dashboard/movimentacoes", icon: DollarSign, label: "Movimentações" },
  { href: "/dashboard/despesas", icon: Receipt, label: "Despesas" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const usuario = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("usuario") || "{}")
    : {};

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Gestão de Aluguéis</h1>
        <p className="text-sm text-gray-500 mt-1">{usuario.nome}</p>
        <p className="text-xs text-gray-400">{usuario.tipo}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {usuario.tipo === "Admin" && (
          <Link
            href="/dashboard/usuarios"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/dashboard/usuarios"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <UserCog className="w-5 h-5" />
            Usuários
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
