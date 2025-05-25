import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tag, Truck, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const cards = [
    {
      title: "Productos",
      description: "Gestiona tu inventario de productos",
      icon: <Package className="h-8 w-8" />,
      href: "/dashboard/productos",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Categorías",
      description: "Administra las categorías",
      icon: <Tag className="h-8 w-8" />,
      href: "/dashboard/categorias",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Proveedores",
      description: "Gestiona tus proveedores",
      icon: <Truck className="h-8 w-8" />,
      href: "/dashboard/proveedores",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Órdenes",
      description: "Administra órdenes",
      icon: <ShoppingCart className="h-8 w-8" />,
      href: "/dashboard/ordenes",
      color: "bg-amber-50 text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 mt-2">Bienvenido al sistema de gestión. Selecciona una opción para comenzar.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>{card.icon}</div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-1">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
