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
  TrendingDown,
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

// --- PRODUCTOS DE ACS.MASCOTAS ---
const productosMock = [
  { id: 1, nombre: "Cama Antidesgarro Grande 90cm", sku: "ACS-CAMA-01", stock: 3, precio: 39990, categoria: "Camas", img: "🛏️" },
  { id: 2, nombre: "Correa Retráctil 5m Negra", sku: "ACS-COR-02", stock: 12, precio: 12990, categoria: "Paseo", img: "🦮" },
  { id: 3, nombre: "Juguete Hueso Resistente", sku: "ACS-JUG-03", stock: 2, precio: 6990, categoria: "Juguetes", img: "🦴" },
  { id: 4, nombre: "Plato Doble Acero Inox", sku: "ACS-PLA-04", stock: 8, precio: 10990, categoria: "Alimentación", img: "🥣" },
  { id: 5, nombre: "Capa Impermeable Talla M", sku: "ACS-CAP-05", stock: 5, precio: 15990, categoria: "Ropa", img: "🧥" },
  { id: 6, nombre: "Rascador Gato 60cm", sku: "ACS-RAS-06", stock: 1, precio: 29990, categoria: "Gatos", img: "🐱" },
  { id: 7, nombre: "Arnés Ajustable Rojo L", sku: "ACS-ARN-07", stock: 9, precio: 14990, categoria: "Paseo", img: "🐕" },
  { id: 8, nombre: "Snacks Naturales 200g", sku: "ACS-SNK-08", stock: 25, precio: 4990, categoria: "Alimentación", img: "🦴" },
];

const ventasMockInit = [
  { id: "#2847", cliente: "Fernanda Rojas", monto: 52980, metodo: "Webpay", estado: "Pagado", hora: "10:42", envio: "Retiro" },
  { id: "#2846", cliente: "Diego Muñoz", monto: 12990, metodo: "Transferencia", estado: "Pendiente", hora: "09:58", envio: "Envío" },
  { id: "#2845", cliente: "Camila Tapia", monto: 10990, metodo: "Efectivo", estado: "Pagado", hora: "09:12", envio: "Retiro" },
  { id: "#2844", cliente: "Matías Fuentes", monto: 45980, metodo: "Mercado Pago", estado: "Pagado", hora: "08:33", envio: "Envío" },
];

const clientesMock = [
  { nombre: "Fernanda Rojas", rut: "15.234.567-8", compras: 12, total: "$324.500" },
  { nombre: "Diego Muñoz", rut: "17.890.123-4", compras: 3, total: "$45.970" },
  { nombre: "Almacén Don Lalo", rut: "76.123.456-7", compras: 28, total: "$1.2M" },
];

const ventas7Dias = [
  { dia: "Lun", valor: 145000, label: "15" },
  { dia: "Mar", valor: 210000, label: "16" },
  { dia: "Mié", valor: 185000, label: "17" },
  { dia: "Jue", valor: 320000, label: "18" },
  { dia: "Vie", valor: 280000, label: "19" },
  { dia: "Sáb", valor: 410000, label: "20" },
  { dia: "Dom", valor: 395000, label: "21" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sucursal, setSucursal] = useState("ACS Mascotas - Santiago");
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
    setToast(`Venta  ${newId} creada • $${totalCart.toLocaleString('es-CL')} - ${metodoPago}`);
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
    if (id === activeSection) {
      setToast(`${id} actualizado • ${new Date().toLocaleTimeString('es-CL')}`);
      setTimeout(() => setToast(null), 1800);
    } else {
      setActiveSection(id);
    }
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 antialiased">
      <div className="flex">
        <aside className="hidden lg:flex w-[260px] shrink-0 h-screen sticky top-0 bg-white border-r border-zinc-200 flex-col">
          <div className="h-[64px] px-5 flex items-center gap-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center font-bold">A</div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold leading-none">ACS Mascotas</div>
              <div className="text-[11px] text-zinc-500 mt-1">acs.mascotas</div>
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
              <div className="text-[12px] font-medium">Stock bajo</div>
              <div className="text-[11px] text-zinc-500 mt-1">{stockBajo.length} productos por reponer</div>
              <div className="mt-2 space-y-1">
                {stockBajo.slice(0,2).map(p => (
                  <div key={p.id} className="flex items-center justify-between text-[11px]"><span className="truncate">{p.nombre}</span><span className="text-red-600 font-medium">{p.stock}</span></div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="h-[64px] bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 rounded-[10px] border border-zinc-200"><span className="text-[12px]">☰</span></button>
              <div className="hidden lg:block">
                <div className="text-[16px] font-semibold tracking-tight">{activeSection}</div>
                <div className="text-[11px] text-zinc-500">Bienvenido de vuelta, Bastian</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-200 bg-zinc-50">
                <Search size={14} className="text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto, SKU, cliente..." className="bg-transparent text-[12px] w-[220px] focus:outline-none" />
              </div>
              <button onClick={() => setShowPOS(true)} className="bg-zinc-900 text-white px-4 py-2.5 rounded-[12px] text-[13px] font-medium flex items-center gap-2"><Plus size={16} /> Nueva Venta</button>
            </div>
          </div>

          {activeSection==="Dashboard" && (
            <div className="p-4 lg:p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="flex items-center justify-between"><span className="text-[11px] tracking-widest uppercase text-zinc-400 font-semibold">Ventas Hoy</span><TrendingUp size={16} className="text-[#00B86F]" /></div>
                  <div className="mt-3 text-[22px] font-semibold mono">$128.940</div>
                  <div className="mt-1 text-[11px] text-[#00B86F] flex items-center gap-1"><ArrowUpRight size={12} /> +18% vs ayer</div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="flex items-center justify-between"><span className="text-[11px] tracking-widest uppercase text-zinc-400 font-semibold">Ticket Promedio</span><ShoppingCart size={16} className="text-zinc-400" /></div>
                  <div className="mt-3 text-[22px] font-semibold mono">$19.990</div>
                  <div className="mt-1 text-[11px] text-zinc-500">4 productos / venta</div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[16px] p-4">
                  <div className="flex items-center justify-between"><span className="text-[11px] tracking-widest uppercase text-zinc-400 font-semibold">Stock Bajo</span><AlertTriangle size={16} className="text-amber-500" /></div>
                  <div className="mt-3 text-[22px] font-semibold mono">{stockBajo.length} productos</div>
                  <div className="mt-1 text-[11px] text-amber-600">Reponer hoy</div>
                </div>
                <div className="bg-zinc-900 text-white rounded-[16px] p-4">
                  <div className="text-[11px] tracking-widest uppercase text-white/60 font-semibold">Ganancia Hoy</div>
                  <div className="mt-3 text-[22px] font-semibold mono">$42.500</div>
                  <div className="mt-1 text-[11px] text-white/60">Margen 33%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[16px] p-5">
                  <div className="flex items-center justify-between"><h3 className="font-semibold text-[14px]">Ventas últimos 7 días</h3><button className="text-[11px] px-2.5 py-1.5 rounded-full border border-zinc-200 flex items-center gap-1"><Download size={12} /> Exportar</button></div>
                  <div className="mt-6 h-[160px] flex items-end gap-2">
                    {ventas7Dias.map(v => (
                      <div key={v.dia} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-[10px] bg-zinc-900" style={{ height: `${(v.valor/410000)*120}px` }} />
                        <span className="text-[11px] text-zinc-500">{v.dia}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[16px] p-5">
                  <h3 className="font-semibold text-[14px]">Productos más vendidos</h3>
                  <div className="mt-4 space-y-3">
                    {productosMock.slice(0,4).map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] bg-zinc-50 border flex items-center justify-center">{p.img}</div>
                        <div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{p.nombre}</div><div className="text-[11px] text-zinc-500">{p.stock} en stock</div></div>
                        <span className="text-[12px] font-medium mono">${p.precio.toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-[16px] p-5">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-[14px]">Últimas ventas</h3><button className="text-[11px] text-zinc-500">Ver todo</button></div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="text-[11px] tracking-widest uppercase text-zinc-400"><th className="pb-3 font-semibold">ID</th><th className="pb-3 font-semibold">Cliente</th><th className="pb-3 font-semibold">Monto</th><th className="pb-3 font-semibold">Método</th><th className="pb-3 font-semibold">Estado</th></tr></thead>
                    <tbody>
                      {ventas.map(v => (
                        <tr key={v.id} className="border-t border-zinc-100 text-[13px]">
                          <td className="py-3 mono text-[12px]">{v.id}</td>
                          <td className="py-3">{v.cliente}</td>
                          <td className="py-3 mono">${v.monto.toLocaleString('es-CL')}</td>
                          <td className="py-3 text-[12px]">{v.metodo}</td>
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
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center"><ShoppingCart size={16} /></div><div><div className="font-semibold text-[14px]">Punto de Venta • ACS Mascotas</div><div className="text-[11px] text-zinc-500">Stock descuenta solo y boleta al SII automática</div></div></div>
              <button onClick={() => setShowPOS(false)} className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-4 lg:p-5 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cama, correa, juguete..." className="w-full pl-9 pr-3 py-2.5 rounded-[12px] border border-zinc-200 bg-zinc-50 text-[13px] focus:outline-none" /></div>
                  <button className="px-3 py-2.5 rounded-[12px] border border-zinc-200 bg-white text-[12px] flex items-center gap-1"><Filter size={14} /> Filtro</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productosFiltrados.map(p => (
                    <button key={p.id} onClick={() => handleAddToCart(p.id)} className="text-left bg-white border border-zinc-200 rounded-[14px] p-3 flex gap-3 hover:border-zinc-300 transition">
                      <div className="w-12 h-12 rounded-[12px] bg-[#f6f6f3] border flex items-center justify-center text-[22px]">{p.img}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate">{p.nombre}</div>
                        <div className="text-[11px] text-zinc-500 mono">{p.sku} • Stock {p.stock}</div>
                        <div className="mt-2 flex items-center justify-between"><span className="mono font-semibold text-[13px]">${p.precio.toLocaleString('es-CL')}</span><span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center"><Plus size={12} /></span></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[380px] bg-[#f6f6f3] flex flex-col shrink-0">
                <div className="p-5 border-b border-zinc-200 bg-white">
                  <div className="flex items-center justify-between"><h3 className="font-semibold text-[14px]">Carrito • {cartDetalle.length}  productos</h3><button onClick={() => setCart([])} className="text-[11px] text-zinc-500 hover:text-zinc-900">Vaciar</button></div>
                  <div className="mt-3"><div className="flex items-center gap-2 p-2.5 rounded-[12px] border border-zinc-200 bg-zinc-50"><Users size={16} className="text-zinc-500" /><input value={clientePOS} onChange={e => setClientePOS(e.target.value)} className="flex-1 bg-transparent text-[13px] focus:outline-none" placeholder="Cliente (RUT / nombre)" /><MoreHorizontal size={16} className="text-zinc-400" /></div></div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cartDetalle.length === 0 && (<div className="py-16 text-center text-zinc-400"><ShoppingCart size={28} className="mx-auto mb-3 opacity-50" /><div className="text-[13px]">Carrito vacío</div><div className="text-[11px] mt-1">Agrega productos para vender</div></div>)}
                  {cartDetalle.map(item => (
                    <div key={item.id} className="bg-white border border-zinc-200 rounded-[12px] p-3 flex gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-zinc-50 border flex items-center justify-center">{item.img}</div>
                      <div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{item.nombre}</div><div className="text-[11px] text-zinc-500 mono">${item.precio.toLocaleString('es-CL')} x {item.qty}</div><div className="mt-2 flex items-center gap-1"><button onClick={() => setCart(c => c.map(x => x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><Minus size={12} /></button><span className="w-6 text-center text-[12px] mono font-medium">{item.qty}</span><button onClick={() => setCart(c => c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x))} className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center"><Plus size={12} /></button><span className="ml-auto mono text-[12px] font-semibold">${item.subtotal.toLocaleString('es-CL')}</span></div></div>
                      <button onClick={() => setCart(c => c.filter(x => x.id !== item.id))} className="self-start p-1 hover:bg-zinc-100 rounded-full"><X size={14} className="text-zinc-400" /></button>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-white border-t border-zinc-200 space-y-4">
                  <div><div className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-2">Método de pago</div><div className="grid grid-cols-2 gap-2">{[{ id: "Webpay", label: "Webpay Plus", icon: CreditCard, desc: "Tarjetas" }, { id: "Transferencia", label: "Transferencia", icon: Building2, desc: "Banco" }, { id: "Efectivo", label: "Efectivo", icon: Banknote, desc: "Caja" }, { id: "Mercado Pago", label: "Mercado Pago", icon: Smartphone, desc: "QR / Link" }].map(m => (<button key={m.id} onClick={() => setMetodoPago(m.id)} className={`text-left p-3 rounded-[12px] border flex items-center gap-2.5 transition ${metodoPago === m.id ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" : "bg-white border-zinc-200 hover:border-zinc-300"}`}><m.icon size={16} className={metodoPago === m.id ? "text-white" : "text-zinc-500"} /><div><div className="text-[12px] font-medium leading-none">{m.label}</div><div className={`text-[10px] mt-1 ${metodoPago === m.id ? "text-white/70" : "text-zinc-500"}`}>{m.desc}</div></div>{metodoPago === m.id && <Check size={14} className="ml-auto" />}</button>))}</div></div>
                  <div className="space-y-2 text-[13px] border-t border-zinc-100 pt-4"><div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="mono">${totalCart.toLocaleString('es-CL')}</span></div><div className="flex justify-between text-zinc-500"><span>IVA 19%</span><span className="mono">${iva.toLocaleString('es-CL')}</span></div><div className="flex justify-between font-semibold text-[16px] pt-2 border-t border-zinc-100"><span>Total</span><span className="mono">${(totalCart).toLocaleString('es-CL')}</span></div></div>
                  <button disabled={cartDetalle.length === 0} onClick={handleConfirmSale} className="w-full bg-[#00B86F] hover:bg-[#00a862] disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold py-3.5 rounded-[14px] flex items-center justify-center gap-2 shadow-[0_12px_24px_-10px_#00B86F] transition"><Zap size={18} /> Cobrar ${totalCart.toLocaleString('es-CL')} • {metodoPago}</button>
                  <div className="text-[11px] text-center text-zinc-500">Boleta electrónica se enviará automáticamente al SII • Folio 884</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[13px] px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 z-[90]"><span className="w-2 h-2 rounded-full bg-[#00B86F] animate-pulse" /> {toast}</div>)}
    </div>
  );
}
