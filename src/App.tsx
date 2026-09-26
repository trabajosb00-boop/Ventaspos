import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  Truck,
  BarChart3,
  Search,
  Plus,
  ChevronDown,
  Bell,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  MoreHorizontal,
  X,
  Minus,
  Check,
  Zap,
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react";

// --- PRODUCTOS GENERICOS PARA CUALQUIER PYME ---
const productosMock = [
  { id: 1, nombre: "Café Grano Colombia 1kg", sku: "GEN-001", stock: 12, precio: 12990, categoria: "General", img: "☕" },
  { id: 2, nombre: "Polera Básica Negra", sku: "GEN-002", stock: 24, precio: 8990, categoria: "General", img: "👕" },
  { id: 3, nombre: "Aceite Oliva 500ml", sku: "GEN-003", stock: 8, precio: 6990, categoria: "General", img: "🫒" },
  { id: 4, nombre: "Mochila Urbana", sku: "GEN-004", stock: 15, precio: 19990, categoria: "General", img: "🎒" },
  { id: 5, nombre: "Jabón Natural", sku: "GEN-005", stock: 30, precio: 3990, categoria: "General", img: "🧼" },
  { id: 6, nombre: "Té Matcha 40g", sku: "GEN-006", stock: 10, precio: 7990, categoria: "General", img: "🍵" },
  { id: 7, nombre: "Libreta A5", sku: "GEN-007", stock: 50, precio: 2990, categoria: "General", img: "📓" },
  { id: 8, nombre: "Botella Térmica", sku: "GEN-008", stock: 18, precio: 9990, categoria: "General", img: "🥤" },
];

const ventasMockInit = [
  { id: "#2847", cliente: "Cliente Ejemplo 1", monto: 42980, metodo: "Webpay", estado: "Pagado", hora: "10:42", envio: "Retiro" },
  { id: "#2846", cliente: "Cliente Ejemplo 2", monto: 12990, metodo: "Transferencia", estado: "Pendiente", hora: "09:58", envio: "Envío" },
  { id: "#2845", cliente: "Cliente Ejemplo 3", monto: 10990, metodo: "Efectivo", estado: "Pagado", hora: "09:12", envio: "Retiro" },
  { id: "#2844", cliente: "Cliente Ejemplo 4", monto: 45980, metodo: "Mercado Pago", estado: "Pagado", hora: "08:33", envio: "Envío" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sucursal, setSucursal] = useState("MI TIENDA - Principal");
  const [showSucursal, setShowSucursal] = useState(false);
  const [showPOS, setShowPOS] = useState(false);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([{ id: 1, qty: 1 }, { id: 2, qty: 1 }]);
  const [search, setSearch] = useState("");
  const [metodoPago, setMetodoPago] = useState("Webpay");
  const [ventas, setVentas] = useState(ventasMockInit);
  const [clientePOS, setClientePOS] = useState("Cliente general");
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const productosFiltrados = useMemo(() => {
    return productosMock.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const cartDetalle = useMemo(() => {
    return cart.map(c => {
      const prod = productosMock.find(p => p.id === c.id)!;
      return { ...prod, qty: c.qty, subtotal: prod.precio * c.qty };
    });
  }, [cart]);

  const totalCart = cartDetalle.reduce((s, i) => s + i.subtotal, 0);
  const iva = Math.round(totalCart * 0.19);
  const stockBajo = productosMock.filter(p => p.stock <= 4);

  const handleAddToCart = (id: number) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === id);
      if (exists) return prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id, qty: 1 }];
    });
  };

  const handleConfirmSale = () => {
    const newId = `#${2848 + ventas.length}`;
    setVentas(v => [{ id: newId, cliente: clientePOS, monto: totalCart, metodo: metodoPago, estado: metodoPago === "Transferencia" ? "Pendiente" : "Pagado", hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), envio: "Retiro" }, ...v]);
    setToast(`Venta ${newId} creada • $${totalCart.toLocaleString('es-CL')} - ${metodoPago}`);
    setTimeout(() => setToast(null), 3000);
    setCart([]);
    setShowPOS(false);
  };

  const menu = [
    { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "Ventas / POS", icon: ShoppingCart, label: "Ventas / POS", badge: "POS" },
    { id: "Productos", icon: Package, label: "Productos / Inventario", count: productosMock.length },
    { id: "Clientes", icon: Users, label: "Clientes" },
    { id: "Pagos", icon: Receipt, label: "Pagos y SII", alert: 3 },
    { id: "Envíos", icon: Truck, label: "Envíos", count: 5 },
    { id: "Reportes", icon: BarChart3, label: "Reportes" },
  ];

  const estadoColor: any = {
    Pagado: "bg-[#00B86F]/10 text-[#00B86F] border-[#00B86F]/20",
    Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    Envío: "bg-sky-50 text-sky-700 border-sky-200",
  };

  const handleNav = (id: string) => {
    if (id === "Ventas / POS") {
      setShowPOS(true);
      setActiveSection(id);
      setMobileMenu(false);
      return;
    }
    setActiveSection(id);
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 antialiased">
      <div className="flex">
        <aside className="hidden lg:flex w-[260px] shrink-0 h-screen sticky top-0 bg-white border-r border-zinc-200 flex-col">
          <div className="h-[64px] px-5 flex items-center gap-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center font-bold">M</div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold leading-none">MI TIENDA</div>
              <div className="text-[11px] text-zinc-500 mt-1">Sistema PyME</div>
            </div>
            <Bell size={18} className="text-zinc-400" />
          </div>
          <div className="p-3">
            <div className="relative">
              <button onClick={() => setShowSucursal(!showSucursal)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] border border-zinc-200 bg-zinc-50 text-[12px]">
                <span className="truncate">{sucursal}</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {menu.map(m => (
              <button key={m.id} onClick={() => handleNav(m.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-left transition ${activeSection===m.id ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-600"}`}>
                <m.icon size={18} />
                <span className="flex-1">{m.label}</span>
                {m.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00B86F] text-white">{m.badge}</span>}
                {m.count && <span className="text-[11px] text-zinc-400">{m.count}</span>}
                {m.alert && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">{m.alert}</span>}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-zinc-100">
            <div className="rounded-[12px] bg-[#f6f6f3] border p-3">
              <div className="text-[12px] font-medium">MI TIENDA</div>
              <div className="text-[11px] text-zinc-500 mt-1">Sistema genérico para cualquier PyME</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="h-[64px] bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 rounded-[10px] border border-zinc-200">☰</button>
              <div className="hidden lg:block">
                <div className="text-[16px] font-semibold tracking-tight">{activeSection}</div>
                <div className="text-[11px] text-zinc-500">Bienvenido a MI TIENDA</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-200 bg-zinc-50">
                <Search size={14} className="text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="bg-transparent text-[12px] w-[220px] focus:outline-none" />
              </div>
              <button onClick={() => setShowPOS(true)} className="bg-zinc-900 text-white px-4 py-2.5 rounded-[12px] text-[13px] font-medium flex items-center gap-2"><Plus size={16} /> Nueva Venta</button>
            </div>
          </div>

          {activeSection==="Dashboard" && (
            <div className="p-4 lg:p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="text-[11px] uppercase text-zinc-400 font-semibold">Ventas Hoy</div>
                  <div className="mt-3 text-[22px] font-semibold">$128.940</div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="text-[11px] uppercase text-zinc-400 font-semibold">Ticket Promedio</div>
                  <div className="mt-3 text-[22px] font-semibold">$19.990</div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="text-[11px] uppercase text-zinc-400 font-semibold">Stock Bajo</div>
                  <div className="mt-3 text-[22px] font-semibold">{stockBajo.length} productos</div>
                </div>
                <div className="bg-zinc-900 text-white rounded-[16px] p-4">
                  <div className="text-[11px] uppercase text-white/60 font-semibold">Ganancia Hoy</div>
                  <div className="mt-3 text-[22px] font-semibold">$42.500</div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-[16px] p-5">
                <h3 className="font-semibold text-[14px]">Últimas ventas - MI TIENDA</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="text-[11px] uppercase text-zinc-400"><th className="pb-3">ID</th><th className="pb-3">Cliente</th><th className="pb-3">Monto</th><th className="pb-3">Estado</th></tr></thead>
                    <tbody>
                      {ventas.map(v => (
                        <tr key={v.id} className="border-t border-zinc-100 text-[13px]">
                          <td className="py-3">{v.id}</td>
                          <td className="py-3">{v.cliente}</td>
                          <td className="py-3">${v.monto.toLocaleString('es-CL')}</td>
                          <td className="py-3"><span className={`text-[11px] px-2 py-1 rounded-full border ${estadoColor[v.estado]}`}>{v.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showPOS && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="ml-auto w-full max-w-[1020px] h-full bg-white shadow-2xl flex flex-col">
            <div className="h-[64px] px-5 flex items-center justify-between border-b border-zinc-200 shrink-0">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center"><ShoppingCart size={16} /></div><div><div className="font-semibold text-[14px]">Punto de Venta • MI TIENDA</div><div className="text-[11px] text-zinc-500">Sistema genérico PyME</div></div></div>
              <button onClick={() => setShowPOS(false)} className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-4 lg:p-5 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto genérico..." className="w-full pl-9 pr-3 py-2.5 rounded-[12px] border border-zinc-200 bg-zinc-50 text-[13px] focus:outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productosFiltrados.map(p => (
                    <button key={p.id} onClick={() => handleAddToCart(p.id)} className="text-left bg-white border border-zinc-200 rounded-[14px] p-3 flex gap-3 hover:border-zinc-300 transition">
                      <div className="w-12 h-12 rounded-[12px] bg-[#f6f6f3] border flex items-center justify-center text-[22px]">{p.img}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{p.nombre}</div>
                        <div className="text-[11px] text-zinc-500">{p.sku} • Stock {p.stock}</div>
                        <div className="mt-2 flex items-center justify-between"><span className="font-semibold text-[13px]">${p.precio.toLocaleString('es-CL')}</span><span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center"><Plus size={12} /></span></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[380px] bg-[#f6f6f3] flex flex-col shrink-0">
                <div className="p-5 border-b border-zinc-200 bg-white">
                  <div className="flex items-center justify-between"><h3 className="font-semibold text-[14px]">Carrito • {cartDetalle.length} productos</h3><button onClick={() => setCart([])} className="text-[11px] text-zinc-500">Vaciar</button></div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cartDetalle.map(item => (
                    <div key={item.id} className="bg-white border border-zinc-200 rounded-[12px] p-3 flex gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-zinc-50 border flex items-center justify-center">{item.img}</div>
                      <div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{item.nombre}</div><div className="text-[11px] text-zinc-500">${item.precio.toLocaleString('es-CL')} x {item.qty}</div></div>
                      <span className="ml-auto font-semibold text-[12px]">${item.subtotal.toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-white border-t border-zinc-200 space-y-4">
                  <div className="flex justify-between font-semibold text-[16px] pt-2 border-t border-zinc-100"><span>Total</span><span>${totalCart.toLocaleString('es-CL')}</span></div>
                  <button disabled={cartDetalle.length === 0} onClick={handleConfirmSale} className="w-full bg-[#00B86F] text-white font-semibold py-3.5 rounded-[14px] flex items-center justify-center gap-2"><Zap size={18} /> Cobrar ${totalCart.toLocaleString('es-CL')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[13px] px-4 py-2.5 rounded-full shadow-xl z-[90]">{toast}</div>)}
    </div>
  );
}
