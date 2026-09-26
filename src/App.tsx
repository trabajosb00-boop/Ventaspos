import React, { useState, useMemo, useEffect } from "react";
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
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  MoreHorizontal,
  X,
  Minus,
  Check,
  Zap,
  Filter,
  Edit,
  Trash2,
  Save
} from "lucide-react";

type Producto = { id: number; nombre: string; sku: string; stock: number; precio: number; categoria: string; img: string; };
type Venta = { id: string; cliente: string; monto: number; metodo: string; estado: string; hora: string; envio: string; };

const productosInicial: Producto[] = [
  { id: 1, nombre: "Café Grano Colombia 1kg", sku: "GEN-001", stock: 12, precio: 12990, categoria: "General", img: "☕" },
  { id: 2, nombre: "Polera Básica Negra", sku: "GEN-002", stock: 24, precio: 8990, categoria: "General", img: "👕" },
  { id: 3, nombre: "Aceite Oliva 500ml", sku: "GEN-003", stock: 8, precio: 6990, categoria: "General", img: "🫒" },
  { id: 4, nombre: "Mochila Urbana", sku: "GEN-004", stock: 15, precio: 19990, categoria: "General", img: "🎒" },
  { id: 5, nombre: "Jabón Natural", sku: "GEN-005", stock: 30, precio: 3990, categoria: "General", img: "🧼" },
  { id: 6, nombre: "Té Matcha 40g", sku: "GEN-006", stock: 10, precio: 7990, categoria: "General", img: "🍵" },
];

const ventasInicial: Venta[] = [
  { id: "#2847", cliente: "Cliente Ejemplo 1", monto: 42980, metodo: "Webpay", estado: "Pagado", hora: "10:42", envio: "Retiro" },
  { id: "#2846", cliente: "Cliente Ejemplo 2", monto: 12990, metodo: "Transferencia", estado: "Pendiente", hora: "09:58", envio: "Envío" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sucursal] = useState("MI TIENDA - Principal");
  const [showPOS, setShowPOS] = useState(false);
  const [productos, setProductos] = useState<Producto[]>(() => {
    try { const s = localStorage.getItem('mitienda_productos'); return s ? JSON.parse(s) : productosInicial; } catch { return productosInicial; }
  });
  const [ventas, setVentas] = useState<Venta[]>(() => {
    try { const s = localStorage.getItem('mitienda_ventas'); return s ? JSON.parse(s) : ventasInicial; } catch { return ventasInicial; }
  });
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [metodoPago, setMetodoPago] = useState("Webpay");
  const [clientePOS, setClientePOS] = useState("Cliente general");
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAddProd, setShowAddProd] = useState(false);
  const [newProd, setNewProd] = useState({ nombre: "", precio: "", stock: "", sku: "" });

  useEffect(() => { localStorage.setItem('mitienda_productos', JSON.stringify(productos)); }, [productos]);
  useEffect(() => { localStorage.setItem('mitienda_ventas', JSON.stringify(ventas)); }, [ventas]);

  const productosFiltrados = useMemo(() => productos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [productos, search]);
  const cartDetalle = useMemo(() => cart.map(c => { const prod = productos.find(p => p.id === c.id)!; return { ...prod, qty: c.qty, subtotal: prod.precio * c.qty }; }).filter(Boolean), [cart, productos]);
  const totalCart = cartDetalle.reduce((s, i) => s + i.subtotal, 0);
  const stockBajo = productos.filter(p => p.stock <= 5);

  const addToCart = (id: number) => {
    setCart(prev => { const ex = prev.find(p => p.id === id); if (ex) return prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p); return [...prev, { id, qty: 1 }]; });
  };

  const confirmarVenta = () => {
    if (cartDetalle.length === 0) return;
    const newId = `#${2848 + ventas.length}`;
    // descontar stock
    setProductos(prev => prev.map(p => { const item = cart.find(c => c.id === p.id); if (item) return { ...p, stock: Math.max(0, p.stock - item.qty) }; return p; }));
    setVentas(v => [{ id: newId, cliente: clientePOS, monto: totalCart, metodo: metodoPago, estado: metodoPago === "Transferencia" ? "Pendiente" : "Pagado", hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), envio: "Retiro" }, ...v]);
    setToast(`Venta ${newId} - $${totalCart.toLocaleString('es-CL')}`);
    setTimeout(() => setToast(null), 3000);
    setCart([]); setShowPOS(false);
  };

  const handleAddProducto = () => {
    if (!newProd.nombre || !newProd.precio) { setToast("Completa nombre y precio"); setTimeout(()=>setToast(null),2000); return; }
    const prod: Producto = { id: Date.now(), nombre: newProd.nombre, sku: newProd.sku || `GEN-${Date.now().toString().slice(-4)}`, stock: parseInt(newProd.stock) || 10, precio: parseInt(newProd.precio) || 0, categoria: "General", img: "📦" };
    setProductos(p => [prod, ...p]);
    setNewProd({ nombre: "", precio: "", stock: "", sku: "" }); setShowAddProd(false);
    setToast("Producto agregado"); setTimeout(()=>setToast(null),2000);
  };

  const menu = [
    { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "Ventas / POS", icon: ShoppingCart, label: "Ventas / POS", badge: "POS" },
    { id: "Productos", icon: Package, label: "Productos", count: productos.length },
    { id: "Clientes", icon: Users, label: "Clientes" },
    { id: "Pagos", icon: Receipt, label: "Pagos y SII" },
    { id: "Envíos", icon: Truck, label: "Envíos" },
    { id: "Reportes", icon: BarChart3, label: "Reportes" },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900">
      <div className="flex">
        <aside className={`fixed lg:static inset-y-0 left-0 w-[260px] bg-white border-r border-zinc-200 z-40 flex flex-col transition-transform ${mobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-[64px] px-5 flex items-center gap-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center font-bold">M</div>
            <div><div className="text-[13px] font-semibold">MI TIENDA</div><div className="text-[11px] text-zinc-500">Sistema PyME</div></div>
          </div>
          <div className="p-3"><div className="px-3 py-2.5 rounded-[12px] bg-zinc-50 border border-zinc-200 text-[12px] truncate">{sucursal}</div></div>
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {menu.map(m => (
              <button key={m.id} onClick={() => { if (m.id==="Ventas / POS") setShowPOS(true); setActiveSection(m.id); setMobileMenu(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-left ${activeSection===m.id ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"}`}>
                <m.icon size={18} /><span className="flex-1">{m.label}</span>{(m as any).count && <span className="text-[11px] text-zinc-400">{(m as any).count}</span>}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-zinc-100"><div className="bg-[#f6f6f3] rounded-[12px] p-3 border"><div className="text-[12px] font-medium">MI TIENDA - Principal</div><div className="text-[11px] text-zinc-500 mt-1">Genérico para cualquier PyME</div></div></div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="h-[64px] bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
            <div className="flex items-center gap-3"><button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 border rounded-[10px]">☰</button><div className="font-semibold">{activeSection}</div></div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border bg-zinc-50"><Search size={14} className="text-zinc-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="bg-transparent text-[12px] w-[180px] focus:outline-none" /></div>
              <button onClick={()=>setShowPOS(true)} className="bg-zinc-900 text-white px-4 py-2.5 rounded-[12px] text-[13px] font-medium flex items-center gap-2"><Plus size={16}/> Venta</button>
            </div>
          </div>

          {activeSection==="Dashboard" && (
            <div className="p-4 lg:p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-[16px] p-4"><div className="text-[11px] text-zinc-400 uppercase font-semibold">Ventas Hoy</div><div className="mt-2 text-[20px] font-semibold">${ventas.reduce((s,v)=>s+v.monto,0).toLocaleString('es-CL')}</div></div>
                <div className="bg-white border rounded-[16px] p-4"><div className="text-[11px] text-zinc-400 uppercase font-semibold">Productos</div><div className="mt-2 text-[20px] font-semibold">{productos.length}</div></div>
                <div className="bg-white border rounded-[16px] p-4"><div className="text-[11px] text-zinc-400 uppercase font-semibold">Stock Bajo</div><div className="mt-2 text-[20px] font-semibold">{stockBajo.length}</div></div>
                <div className="bg-zinc-900 text-white rounded-[16px] p-4"><div className="text-[11px] text-white/60 uppercase">Funciones</div><div className="mt-2 text-[16px] font-semibold">Sistema Base OK</div><div className="text-[11px] text-white/60 mt-1">Sin controlador</div></div>
              </div>
              <div className="bg-white border rounded-[16px] p-5">
                <h3 className="font-semibold text-[14px]">Últimas ventas - MI TIENDA</h3>
                <div className="mt-4 space-y-2">
                  {ventas.map(v => (
                    <div key={v.id} className="flex items-center justify-between py-3 border-t border-zinc-100 text-[13px]"><span>{v.id} - {v.cliente}</span><span>${v.monto.toLocaleString('es-CL')}</span><span className="text-[11px] px-2 py-1 rounded-full bg-zinc-100">{v.estado}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection==="Productos" && (
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Productos / Inventario ({productos.length})</h3><button onClick={()=>setShowAddProd(true)} className="bg-zinc-900 text-white px-3 py-2 rounded-[10px] text-[12px] flex items-center gap-1"><Plus size={14}/> Agregar</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {productosFiltrados.map(p => (
                  <div key={p.id} className="bg-white border rounded-[14px] p-4">
                    <div className="flex gap-3"><div className="w-12 h-12 rounded-[12px] bg-zinc-50 border flex items-center justify-center text-[20px]">{p.img}</div><div className="flex-1"><div className="text-[13px] font-medium">{p.nombre}</div><div className="text-[11px] text-zinc-500">{p.sku} - Stock {p.stock}</div><div className="mt-1 font-semibold text-[13px]">${p.precio.toLocaleString('es-CL')}</div></div></div>
                    <div className="mt-3 flex gap-2"><button onClick={()=>addToCart(p.id)} className="flex-1 py-2 rounded-[10px] bg-zinc-900 text-white text-[12px]">Agregar a venta</button><button onClick={()=>setProductos(pr=>pr.filter(x=>x.id!==p.id))} className="p-2 rounded-[10px] border"><Trash2 size={14}/></button></div>
                  </div>
                ))}
              </div>
              {showAddProd && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"><div className="bg-white rounded-[16px] p-5 w-full max-w-[380px]">
                  <h4 className="font-semibold">Nuevo producto</h4>
                  <div className="mt-4 space-y-3">
                    <input value={newProd.nombre} onChange={e=>setNewProd({...newProd, nombre:e.target.value})} placeholder="Nombre" className="w-full px-3 py-2.5 rounded-[10px] border bg-zinc-50 text-[13px]" />
                    <input value={newProd.sku} onChange={e=>setNewProd({...newProd, sku:e.target.value})} placeholder="SKU (opcional)" className="w-full px-3 py-2.5 rounded-[10px] border bg-zinc-50 text-[13px]" />
                    <div className="grid grid-cols-2 gap-2"><input value={newProd.precio} onChange={e=>setNewProd({...newProd, precio:e.target.value})} placeholder="Precio" type="number" className="px-3 py-2.5 rounded-[10px] border bg-zinc-50 text-[13px]" /><input value={newProd.stock} onChange={e=>setNewProd({...newProd, stock:e.target.value})} placeholder="Stock" type="number" className="px-3 py-2.5 rounded-[10px] border bg-zinc-50 text-[13px]" /></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>setShowAddProd(false)} className="py-2.5 border rounded-[12px] text-[13px]">Cancelar</button><button onClick={handleAddProducto} className="py-2.5 bg-zinc-900 text-white rounded-[12px] text-[13px] flex items-center justify-center gap-1"><Save size={14}/> Guardar</button></div>
                </div></div>
              )}
            </div>
          )}

          {activeSection==="Clientes" && (
            <div className="p-4 lg:p-6"><div className="bg-white border rounded-[16px] p-5"><h3 className="font-semibold">Clientes</h3><div className="mt-4 text-[13px] text-zinc-500">Función base lista. Aquí irá el listado de clientes con RUT, compras y total. Por ahora usa "Cliente general" en el POS.</div><div className="mt-4 grid gap-2">{["Cliente Ejemplo 1","Cliente Ejemplo 2","Cliente Ejemplo 3"].map(c=><div key={c} className="flex items-center justify-between p-3 border rounded-[12px]"><span className="text-[13px]">{c}</span><span className="text-[11px] text-zinc-400">3 compras</span></div>)}</div></div></div>
          )}

          {activeSection==="Pagos" && (
            <div className="p-4 lg:p-6"><div className="bg-white border rounded-[16px] p-5"><h3 className="font-semibold">Pagos y SII - MI TIENDA</h3><div className="mt-4 space-y-2">{ventas.filter(v=>v.estado==="Pendiente").map(v=><div key={v.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-[12px] text-[13px]"><span>{v.id} - {v.cliente}</span><span>${v.monto.toLocaleString('es-CL')}</span><span className="text-[11px] px-2 py-1 rounded-full bg-amber-200">Pendiente</span></div>)}{ventas.filter(v=>v.estado==="Pendiente").length===0 && <div className="text-[13px] text-zinc-500">No hay pagos pendientes. Todo al día.</div>}</div></div></div>
          )}

          {activeSection==="Envíos" && (
            <div className="p-4 lg:p-6"><div className="bg-white border rounded-[16px] p-5"><h3 className="font-semibold">Envíos</h3><div className="mt-4 space-y-2">{ventas.filter(v=>v.envio==="Envío").map(v=><div key={v.id} className="flex items-center justify-between p-3 border rounded-[12px] text-[13px]"><span>{v.id} - {v.cliente}</span><span>{v.envio}</span><span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 border">En camino</span></div>)}</div></div></div>
          )}

          {activeSection==="Reportes" && (
            <div className="p-4 lg:p-6"><div className="bg-white border rounded-[16px] p-5"><h3 className="font-semibold">Reportes - MI TIENDA</h3><div className="mt-4 grid grid-cols-2 gap-4"><div className="border rounded-[12px] p-4"><div className="text-[11px] text-zinc-400 uppercase">Total vendido</div><div className="text-[18px] font-semibold mt-1">${ventas.reduce((s,v)=>s+v.monto,0).toLocaleString('es-CL')}</div></div><div className="border rounded-[12px] p-4"><div className="text-[11px] text-zinc-400 uppercase">Ventas</div><div className="text-[18px] font-semibold mt-1">{ventas.length}</div></div></div><div className="mt-4 text-[12px] text-zinc-500">Reportes base funcionando. Luego agregaremos gráficos y exportación a Excel.</div></div></div>
          )}
        </main>
      </div>

      {showPOS && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="ml-auto w-full max-w-[980px] h-full bg-white shadow-2xl flex flex-col">
            <div className="h-[64px] px-5 flex items-center justify-between border-b shrink-0"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center"><ShoppingCart size={16}/></div><div><div className="font-semibold text-[14px]">Punto de Venta • MI TIENDA</div><div className="text-[11px] text-zinc-500">Función core - Sin controlador</div></div></div><button onClick={()=>setShowPOS(false)} className="w-8 h-8 rounded-full border flex items-center justify-center"><X size={16}/></button></div>
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex gap-2 mb-4"><div className="flex-1 relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full pl-9 pr-3 py-2.5 rounded-[12px] border bg-zinc-50 text-[13px] focus:outline-none"/></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productosFiltrados.map(p=>(
                    <button key={p.id} onClick={()=>addToCart(p.id)} className="text-left bg-white border rounded-[14px] p-3 flex gap-3 hover:border-zinc-300">
                      <div className="w-12 h-12 rounded-[12px] bg-zinc-50 border flex items-center justify-center text-[20px]">{p.img}</div>
                      <div className="flex-1"><div className="text-[13px] font-medium">{p.nombre}</div><div className="text-[11px] text-zinc-500">{p.sku} • Stock {p.stock}</div><div className="mt-1 font-semibold text-[13px]">${p.precio.toLocaleString('es-CL')}</div></div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[360px] bg-[#f6f6f3] flex flex-col">
                <div className="p-4 bg-white border-b"><div className="flex justify-between"><h3 className="font-semibold text-[14px]">Carrito • {cartDetalle.length}</h3><button onClick={()=>setCart([])} className="text-[11px] text-zinc-500">Vaciar</button></div></div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cartDetalle.map(item=>(
                    <div key={item.id} className="bg-white border rounded-[12px] p-3 flex gap-3"><div className="flex-1"><div className="text-[12px] font-medium">{item.nombre}</div><div className="text-[11px] text-zinc-500">${item.precio.toLocaleString('es-CL')} x {item.qty}</div></div><span className="font-semibold text-[12px]">${item.subtotal.toLocaleString('es-CL')}</span></div>
                  ))}
                  {cartDetalle.length===0 && <div className="py-16 text-center text-zinc-400 text-[13px]">Carrito vacío</div>}
                </div>
                <div className="p-4 bg-white border-t space-y-3">
                  <div className="grid grid-cols-2 gap-2">{["Webpay","Transferencia","Efectivo","Mercado Pago"].map(m=><button key={m} onClick={()=>setMetodoPago(m)} className={`p-2.5 rounded-[10px] border text-[12px] ${metodoPago===m ? "bg-zinc-900 text-white" : "bg-white"}`}>{m}</button>)}</div>
                  <div className="flex justify-between font-semibold text-[16px]"><span>Total</span><span>${totalCart.toLocaleString('es-CL')}</span></div>
                  <button disabled={cartDetalle.length===0} onClick={confirmarVenta} className="w-full bg-[#00B86F] text-white font-semibold py-3.5 rounded-[14px] flex items-center justify-center gap-2 disabled:bg-zinc-200"><Zap size={18}/> Cobrar ${totalCart.toLocaleString('es-CL')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[13px] px-4 py-2.5 rounded-full shadow-xl z-[90]">{toast}</div>}
    </div>
  );
}
