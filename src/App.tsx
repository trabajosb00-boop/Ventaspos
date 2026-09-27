import React, { useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
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
  X,
  Zap,
  Trash2,
  Save,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  UserPlus,
  Download,
  Printer
} from "lucide-react";

type Producto = {
  id: number;
  nombre: string;
  sku: string;
  stock: number;
  precio: number;
  categoria: string;
  img: string;
};

type Cliente = {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  notas: string;
  totalCompras: number;
};

type ItemVenta = {
  id: number;
  nombre: string;
  qty: number;
  precio: number;
  subtotal: number;
};

type Venta = {
  id: string;
  cliente: string;
  clienteId: string;
  monto: number;
  metodo: string;
  estado: string;
  hora: string;
  fecha: string;
  envio: "Retiro" | "Envío";
  comprobante: string;
  direccion?: string;
  comuna?: string;
  telefono?: string;
  productos: ItemVenta[];
  estadoEnvio?: "Pendiente" | "Preparando" | "En camino" | "Entregado" | "Cancelado";
  fechaEntrega?: string;
  notasEnvio?: string;
  costoEnvio?: number;
};

const productosInicial: Producto[] = [
  {
    id: 1,
    nombre: "Café Grano Colombia 1kg",
    sku: "GEN-001",
    stock: 12,
    precio: 12990,
    categoria: "General",
    img: "☕"
  },
  {
    id: 2,
    nombre: "Polera Básica Negra",
    sku: "GEN-002",
    stock: 24,
    precio: 8990,
    categoria: "General",
    img: "👕"
  },
  {
    id: 3,
    nombre: "Aceite Oliva 500ml",
    sku: "GEN-003",
    stock: 8,
    precio: 6990,
    categoria: "General",
    img: "🫒"
  },
  {
    id: 4,
    nombre: "Mochila Urbana",
    sku: "GEN-004",
    stock: 15,
    precio: 19990,
    categoria: "General",
    img: "🎒"
  },
  {
    id: 5,
    nombre: "Jabón Natural",
    sku: "GEN-005",
    stock: 30,
    precio: 3990,
    categoria: "General",
    img: "🧼"
  },
  {
    id: 6,
    nombre: "Té Matcha 40g",
    sku: "GEN-006",
    stock: 10,
    precio: 7990,
    categoria: "General",
    img: "🍵"
  }
];

const clientesInicial: Cliente[] = [
  {
    id: "cli-1",
    nombre: "Fernanda Rojas",
    rut: "15.234.567-8",
    telefono: "+56 9 1234 5678",
    email: "fernanda@mail.cl",
    direccion: "Av. Providencia 1234, Depto 42",
    comuna: "Providencia",
    ciudad: "Santiago",
    notas: "Cliente frecuente",
    totalCompras: 12
  },
  {
    id: "cli-2",
    nombre: "Diego Muñoz",
    rut: "17.890.123-4",
    telefono: "+56 9 8765 4321",
    email: "diego@mail.cl",
    direccion: "Los Leones 123, Oficina 5",
    comuna: "Providencia",
    ciudad: "Santiago",
    notas: "",
    totalCompras: 3
  },
  {
    id: "cli-3",
    nombre: "Almacén Don Lalo",
    rut: "76.123.456-7",
    telefono: "+56 2 2345 6789",
    email: "contacto@donlalo.cl",
    direccion: "Manuel Montt 123, Local 2",
    comuna: "Providencia",
    ciudad: "Santiago",
    notas: "Mayorista",
    totalCompras: 28
  }
];const productosInicial: Producto[] = [
  { id: 1, nombre: "Café Grano Colombia 1kg", sku: "GEN-001", stock: 12, precio: 12990, categoria: "General", img: "☕" },
  { id: 2, nombre: "Polera Básica Negra", sku: "GEN-002", stock: 24, precio: 8990, categoria: "General", img: "👕" },
  { id: 3, nombre: "Aceite Oliva 500ml", sku: "GEN-003", stock: 8, precio: 6990, categoria: "General", img: "🫒" },
  { id: 4, nombre: "Mochila Urbana", sku: "GEN-004", stock: 15, precio: 19990, categoria: "General", img: "🎒" },
  { id: 5, nombre: "Jabón Natural", sku: "GEN-005", stock: 30, precio: 3990, categoria: "General", img: "🧼" },
  { id: 6, nombre: "Té Matcha 40g", sku: "GEN-006", stock: 10, precio: 7990, categoria: "General", img: "🍵" },
];

const clientesInicial: Cliente[] = [
  { id: "cli-1", nombre: "Fernanda Rojas", rut: "15.234.567-8", telefono: "+56 9 1234 5678", email: "fernanda@mail.cl", direccion: "Av. Providencia 1234, Depto 42", comuna: "Providencia", ciudad: "Santiago", notas: "Cliente frecuente", totalCompras: 12 },
  { id: "cli-2", nombre: "Diego Muñoz", rut: "17.890.123-4", telefono: "+56 9 8765 4321", email: "diego@mail.cl", direccion: "Los Leones 123, Oficina 5", comuna: "Providencia", ciudad: "Santiago", notas: "", totalCompras: 3 },
  { id: "cli-3", nombre: "Almacén Don Lalo", rut: "76.123.456-7", telefono: "+56 2 2345 6789", email: "contacto@donlalo.cl", direccion: "Manuel Montt 123, Local 2", comuna: "Providencia", ciudad: "Santiago", notas: "Mayorista", totalCompras: 28 },
];

const ventasInicial: Venta[] = [
  { id: "#2847", cliente: "Fernanda Rojas", clienteId: "cli-1", monto: 42980, metodo: "Webpay", estado: "Pagado", hora: "10:42", fecha: "2025-05-13", envio: "Envío", comprobante: "CMP-00123", direccion: "Av. Providencia 1234, Depto 42", comuna: "Providencia", telefono: "+56 9 1234 5678", productos: [{ id: 1, nombre: "Café Grano Colombia 1kg", qty: 2, precio: 12990, subtotal: 25980 }, { id: 3, nombre: "Aceite Oliva 500ml", qty: 1, precio: 6990, subtotal: 6990 }], estadoEnvio: "En camino", fechaEntrega: "2025-05-14", costoEnvio: 3000 },
  { id: "#2846", cliente: "Diego Muñoz", clienteId: "cli-2", monto: 12990, metodo: "Transferencia", estado: "Pendiente", hora: "09:58", fecha: "2025-05-13", envio: "Retiro", comprobante: "CMP-00124", productos: [{ id: 2, nombre: "Polera Básica Negra", qty: 1, precio: 8990, subtotal: 8990 }], estadoEnvio: "Pendiente" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sucursal] = useState("MI TIENDA - Principal");
  const [showPOS, setShowPOS] = useState(false);

  const [productos, setProductos] = useState<Producto[]>(() => {
    try {
      const s = localStorage.getItem('mitienda_productos_v2');
      return s ? JSON.parse(s) : productosInicial;
    } catch {
      return productosInicial;
    }
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const s = localStorage.getItem('mitienda_clientes_v2');
      return s ? JSON.parse(s) : clientesInicial;
    } catch {
      return clientesInicial;
    }
  });

  const [ventas, setVentas] = useState<Venta[]>(() => {
    try {
      const s = localStorage.getItem('mitienda_ventas_v2');
      return s ? JSON.parse(s) : ventasInicial;
    } catch {
      return ventasInicial;
    }
  });

  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [metodoPago, setMetodoPago] = useState("Webpay");
  const [clientePOS, setClientePOS] = useState<Cliente | null>(null);
  const [clienteSearch, setClienteSearch] = useState("");
  const [showClienteList, setShowClienteList] = useState(false);
  const [comprobante, setComprobante] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"Retiro" | "Envío">("Retiro");
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [comunaEnvio, setComunaEnvio] = useState("");
  const [telefonoEnvio, setTelefonoEnvio] = useState("");
  const [notasEnvio, setNotasEnvio] = useState("");
  const [costoEnvio, setCostoEnvio] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAddProd, setShowAddProd] = useState(false);
  const [showAddCliente, setShowAddCliente] = useState(false);  const [newProd, setNewProd] = useState({
    nombre: "",
    precio: "",
    stock: "",
    sku: ""
  });

  const [newCliente, setNewCliente] = useState({
    nombre: "",
    rut: "",
    telefono: "",
    email: "",
    direccion: "",
    comuna: "",
    ciudad: "Santiago"
  });

  const [selectedEnvio, setSelectedEnvio] = useState<Venta | null>(null);

  const [filtroEnvio, setFiltroEnvio] = useState<
    "Todos" | "Pendiente" | "En camino" | "Entregado"
  >("Todos");

  const [lastVenta, setLastVenta] = useState<Venta | null>(null);
  const [showBoletaModal, setShowBoletaModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      'mitienda_productos_v2',
      JSON.stringify(productos)
    );
  }, [productos]);

  useEffect(() => {
    localStorage.setItem(
      'mitienda_clientes_v2',
      JSON.stringify(clientes)
    );
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem(
      'mitienda_ventas_v2',
      JSON.stringify(ventas)
    );
  }, [ventas]);

  const productosFiltrados = useMemo(
    () =>
      productos.filter(
        p =>
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      ),
    [productos, search]
  );

  const clientesFiltrados = useMemo(() => {
    if (!clienteSearch) return clientes;

    const q = clienteSearch.toLowerCase();

    return clientes.filter(
      c =>
        c.nombre.toLowerCase().includes(q) ||
        c.rut.toLowerCase().includes(q) ||
        c.telefono.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [clientes, clienteSearch]);

  const cartDetalle = useMemo(
    () =>
      cart
        .map(c => {
          const prod = productos.find(p => p.id === c.id);

          if (!prod) return null;

          return {
            ...prod,
            qty: c.qty,
            subtotal: prod.precio * c.qty
          };
        })
        .filter(Boolean) as (
          Producto & { qty: number; subtotal: number }
        )[],
    [cart, productos]
  );

  const totalCart = cartDetalle.reduce(
    (s, i) => s + i.subtotal,
    0
  );

  const totalConEnvio =
    totalCart + (parseInt(costoEnvio) || 0);

  const stockBajo = productos.filter(
    p => p.stock <= 5
  );

  // Autocompletar dirección cuando se selecciona cliente
  const seleccionarCliente = (cliente: Cliente) => {
    setClientePOS(cliente);
    setClienteSearch(cliente.nombre);
    setShowClienteList(false);

    // Autocompletar datos de envío desde cliente
    if (cliente.direccion) {
      setDireccionEnvio(cliente.direccion);
      setComunaEnvio(cliente.comuna);
      setTelefonoEnvio(cliente.telefono);

      if (tipoEntrega === "Retiro") {
        setToast(
          `Dirección autocompletada: ${cliente.direccion}`
        );

        setTimeout(() => setToast(null), 2500);
      }
    }
  };

  const addToCart = (id: number) => {
    setCart(prev => {
      const ex = prev.find(p => p.id === id);

      if (ex) {
        return prev.map(p =>
          p.id === id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { id, qty: 1 }];
    });
  };

  const generarMensajeBoleta = (venta: Venta) => {
    const prods = venta.productos
      .map(
        p =>
          `• ${p.nombre} x${p.qty} - $${p.subtotal.toLocaleString('es-CL')}`
      )
      .join('\n');

    return `*MI TIENDA - Boleta ${venta.id}*\n` +
      `Comprobante: ${venta.comprobante}\n` +
      `Cliente: ${venta.cliente}\n` +
      `Fecha: ${venta.fecha} ${venta.hora}\n` +
      `\n${prods}\n` +
      `\nTotal: $${venta.monto.toLocaleString('es-CL')} - ${venta.metodo}\n` +
      `Entrega: ${venta.envio}${venta.direccion ? ` - ${venta.direccion}` : ''}\n` +
      `\nGracias por su compra en MI TIENDA!`;
  };                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showPOS && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="ml-auto w-full max-w-[1020px] h-full bg-white shadow-2xl flex flex-col">
            <div className="h-[64px] px-5 flex items-center justify-between border-b shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center">
                  <ShoppingCart size={16}/>
                </div>
                <div>
                  <div className="font-semibold text-[14px]">
                    POS • MI TIENDA - Envío asociado a cliente
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Cliente obligatorio para envío + autocompletar dirección
                  </div>
                </div>
              </div>
              <button onClick={()=>setShowPOS(false)} className="w-8 h-8 rounded-full border flex items-center justify-center">
                <X size={16}/>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
                    <input
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      placeholder="Buscar producto..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-[12px] border bg-zinc-50 text-[13px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productosFiltrados.map(p=>(
                    <button
                      key={p.id}
                      onClick={()=>addToCart(p.id)}
                      className="text-left bg-white border rounded-[14px] p-3 flex gap-3 hover:border-zinc-300"
                    >
                      <div className="w-12 h-12 rounded-[12px] bg-zinc-50 border flex items-center justify-center text-[20px]">
                        {p.img}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium">{p.nombre}</div>
                        <div className="text-[11px] text-zinc-500">{p.sku} • Stock {p.stock}</div>
                        <div className="mt-1 font-semibold text-[13px]">
                          ${p.precio.toLocaleString('es-CL')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[380px] bg-[#f6f6f3] flex flex-col">
                <div className="p-4 bg-white border-b space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-[13px]">
                      Carrito • {cartDetalle.length}
                      {tipoEntrega==="Envío" && clientePOS && (
                        <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full ml-1">
                          Cliente: {clientePOS.nombre}
                        </span>
                      )}
                    </h3>
                    <button onClick={()=>setCart([])} className="text-[11px] text-zinc-500">
                      Vaciar
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] border bg-zinc-50">
                      <Users size={14} className="text-zinc-400"/>
                      <input
                        value={clienteSearch}
                        onChange={e=>{
                          setClienteSearch(e.target.value);
                          setShowClienteList(true);
                          if (!e.target.value) setClientePOS(null);
                        }}
                        onFocus={()=>setShowClienteList(true)}
                        placeholder="Buscar cliente (obligatorio para envío)"
                        className="flex-1 bg-transparent text-[12px] focus:outline-none"
                      />
                      {clientePOS && (
                        <button
                          onClick={()=>{
                            setClientePOS(null);
                            setClienteSearch("");
                            setDireccionEnvio("");
                          }}
                          className="text-zinc-400"
                        >
                          <X size={14}/>
                        </button>
                      )}
                    </div>

                    {showClienteList && clienteSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-[10px] shadow-lg max-h-[200px] overflow-y-auto">
                        {clientesFiltrados.length > 0
                          ? clientesFiltrados.map(c=>(
                            <button
                              key={c.id}
                              onClick={()=>{
                                setClientePOS(c);
                                setClienteSearch(c.nombre);
                                setDireccionEnvio(c.direccion);
                                setComunaEnvio(c.comuna);
                                setTelefonoEnvio(c.telefono);
                                setShowClienteList(false);
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 border-b last:border-0"
                            >
                              <div className="text-[12px] font-medium">{c.nombre}</div>
                              <div className="text-[10px] text-zinc-500">
                                {c.rut || "Sin RUT"} • {c.telefono || "Sin teléfono"}
                              </div>
                            </button>
                          ))
                          : (
                            <div className="p-3 text-center">
                              <div className="text-[12px] text-zinc-500">
                                No se encontró cliente
                              </div>
                              <button
                                onClick={()=>{
                                  setNewCliente(prev=>({
                                    ...prev,
                                    nombre: clienteSearch.includes("-") ? "" : clienteSearch,
                                    rut: clienteSearch.includes("-") ? clienteSearch : ""
                                  }));
                                  setShowAddCliente(true);
                                  setShowClienteList(false);
                                }}
                                className="mt-2 px-3 py-2 bg-zinc-900 text-white rounded-[8px] text-[11px]"
                              >
                                Crear cliente desde aquí
                              </button>
                            </div>
                          )
                        }
                      </div>
                    )}
                  </div>                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] border bg-zinc-50">
                      <Users size={14} className="text-zinc-400"/>
                      <input
                        value={clienteSearch}
                        onChange={e=>{
                          setClienteSearch(e.target.value);
                          setShowClienteList(true);
                          if (!e.target.value) setClientePOS(null);
                        }}
                        onFocus={()=>setShowClienteList(true)}
                        placeholder="Buscar cliente (obligatorio para envío)"
                        className="flex-1 bg-transparent text-[12px] focus:outline-none"
                      />
                      {clientePOS && (
                        <button
                          onClick={()=>{
                            setClientePOS(null);
                            setClienteSearch("");
                            setDireccionEnvio("");
                          }}
                          className="text-zinc-400"
                        >
                          <X size={14}/>
                        </button>
                      )}
                    </div>

                    {showClienteList && clienteSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-[10px] shadow-lg max-h-[200px] overflow-y-auto">
                        {clientesFiltrados.length > 0 ? clientesFiltrados.map(c=>(
                          <button
                            key={c.id}
                            onClick={()=>seleccionarCliente(c)}
                            className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 border-b last:border-b-0"
                          >
                            <div className="text-[12px] font-medium flex items-center gap-2">
                              {c.nombre}
                              <span className="text-[9px] px-1 py-0.5 bg-zinc-100 rounded">{c.rut}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                              <MapPin size={10}/>{c.direccion.slice(0,35)}... • {c.telefono}
                            </div>
                          </button>
                        )) : (
                          <div className="p-3 text-center">
                            <div className="text-[12px] text-zinc-500">No se encontró "{clienteSearch}"</div>
                            <div className="text-[11px] text-zinc-400 mt-1">por nombre o RUT</div>
                          </div>
                        )}
                        <button
                          onClick={()=>{
                            const isRut = clienteSearch.includes("-") || /\d/.test(clienteSearch) && clienteSearch.length > 6;
                            setNewCliente(prev=>({
                              ...prev,
                              nombre: isRut ? "" : clienteSearch,
                              rut: isRut ? clienteSearch : prev.rut
                            }));
                            setShowAddCliente(true);
                            setShowClienteList(false);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-sky-50 text-[12px] text-sky-600 bg-sky-50/50 border-t flex items-center gap-2"
                        >
                          <UserPlus size={12}/> Crear cliente "{clienteSearch}" desde aquí
                        </button>
                      </div>
                    )}
                    {clientePOS && (
                      <div className="mt-1 text-[10px] text-green-600 flex items-center gap-1">
                        <CheckCircle size={10}/> Cliente seleccionado - dirección autocompletada
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] border bg-zinc-50">
                    <Receipt size={14} className="text-zinc-400"/>
                    <input
                      value={comprobante}
                      onChange={e=>setComprobante(e.target.value)}
                      placeholder="N° Comprobante"
                      className="flex-1 bg-transparent text-[12px] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase text-zinc-400 mb-1.5">
                      Tipo de entrega (cliente elige)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={()=>setTipoEntrega("Retiro")}
                        className={`p-2.5 rounded-[10px] border text-[12px] flex items-center justify-center gap-1 ${tipoEntrega==="Retiro" ? "bg-zinc-900 text-white" : "bg-white"}`}
                      >
                        <Package size={14}/> Retiro
                      </button>
                      <button
                        onClick={()=>setTipoEntrega("Envío")}
                        className={`p-2.5 rounded-[10px] border text-[12px] flex items-center justify-center gap-1 ${tipoEntrega==="Envío" ? "bg-zinc-900 text-white" : "bg-white"}`}
                      >
                        <Truck size={14}/> Envío
                      </button>
                    </div>

                    {tipoEntrega==="Envío" && (
                      <div className="mt-2 space-y-2">
                        <div className="px-3 py-2.5 rounded-[10px] border bg-amber-50 border-amber-200 flex items-center gap-2">
                          <MapPin size={14} className="text-amber-600"/>
                          <input
                            value={direccionEnvio}
                            onChange={e=>setDireccionEnvio(e.target.value)}
                            placeholder="Dirección (autocompletada del cliente)"
                            className="flex-1 bg-transparent text-[12px] focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={comunaEnvio}
                            onChange={e=>setComunaEnvio(e.target.value)}
                            placeholder="Comuna"
                            className="px-3 py-2 rounded-[8px] border bg-white text-[11px]"
                          />
                          <input
                            value={telefonoEnvio}
                            onChange={e=>setTelefonoEnvio(e.target.value)}
                            placeholder="Teléfono"
                            className="px-3 py-2 rounded-[8px] border bg-white text-[11px]"
                          />
                        </div>
                        <input
                          value={costoEnvio}
                          onChange={e=>setCostoEnvio(e.target.value)}
                          placeholder="Costo envío (ej: 3000)"
                          type="number"
                          className="w-full px-3 py-2 rounded-[8px] border bg-white text-[11px]"
                        />
                        <textarea
                          value={notasEnvio}
                          onChange={e=>setNotasEnvio(e.target.value)}
                          placeholder="Notas de envío (ej: timbre 42, dejar en conserjería)"
                          className="w-full px-3 py-2 rounded-[8px] border bg-white text-[11px] resize-none"
                          rows={2}
                        />
                        {!clientePOS && (
                          <div className="text-[10px] text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-1">
                            <AlertTriangle size={12}/> Envío debe estar asociado a un cliente - selecciona uno arriba
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cartDetalle.map(item=>(
                    <div key={item.id} className="bg-white border rounded-[12px] p-3 flex gap-3">
                      <div className="flex-1">
                        <div className="text-[12px] font-medium">{item.nombre}</div>
                        <div className="text-[11px] text-zinc-500">
                          ${item.precio.toLocaleString('es-CL')} x {item.qty}
                        </div>
                      </div>
                      <span className="font-semibold text-[12px]">
                        ${item.subtotal.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                  {cartDetalle.length===0 && (
                    <div className="py-12 text-center text-zinc-400 text-[12px]">Carrito vacío</div>
                  )}
                </div>

                <div className="p-4 bg-white border-t space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Webpay","Transferencia","Efectivo","Mercado Pago"].map(m=>(
                      <button
                        key={m}
                        onClick={()=>setMetodoPago(m)}
                        className={`p-2 rounded-[8px] border text-[11px] ${metodoPago===m ? "bg-zinc-900 text-white" : "bg-white"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Subtotal</span>
                      <span>${totalCart.toLocaleString('es-CL')}</span>
                    </div>
                    {costoEnvio && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Envío</span>
                        <span>${parseInt(costoEnvio).toLocaleString('es-CL')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-[14px] pt-1 border-t">
                      <span>Total</span>
                      <span>${totalConEnvio.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center">
                    {comprobante || "auto"} • {tipoEntrega}
                    {clientePOS ? `• ${clientePOS.nombre}` : ""}
                    {direccionEnvio && ` • ${direccionEnvio.slice(0,20)}`}
                  </div>

                  <button
                    disabled={cartDetalle.length===0 || (tipoEntrega==="Envío" && !clientePOS)}
                    onClick={confirmarVenta}
                    className="w-full bg-[#00B86F] text-white font-semibold py-3 rounded-[12px] flex items-center justify-center gap-2 disabled:bg-zinc-200 text-[13px]"
                  >
                    <Zap size={16}/> Cobrar ${totalConEnvio.toLocaleString('es-CL')}
                    {tipoEntrega==="Envío" ? "• Crear envío" : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddProd && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[14px] p-5 w-full max-w-[340px]">
            <h4 className="font-semibold text-[14px]">Nuevo producto</h4>
            <div className="mt-3 space-y-2">
              <input value={newProd.nombre} onChange={e=>setNewProd({...newProd, nombre:e.target.value})} placeholder="Nombre" className="w-full px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              <div className="grid grid-cols-2 gap-2">
                <input value={newProd.precio} onChange={e=>setNewProd({...newProd, precio:e.target.value})} placeholder="Precio" type="number" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
                <input value={newProd.stock} onChange={e=>setNewProd({...newProd, stock:e.target.value})} placeholder="Stock" type="number" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={()=>setShowAddProd(false)} className="py-2.5 border rounded-[10px] text-[12px]">Cancelar</button>
              <button
                onClick={()=>{
                  if(!newProd.nombre||!newProd.precio){
                    setToast("Completa");
                    setTimeout(()=>setToast(null),2000);
                    return;
                  }
                  const prod={
                    id: Date.now(),
                    nombre: newProd.nombre,
                    sku: newProd.sku || `GEN-${Date.now().toString().slice(-4)}`,
                    stock: parseInt(newProd.stock)||10,
                    precio: parseInt(newProd.precio)||0,
                    categoria:"General",
                    img:"📦"
                  };
                  setProductos(p=>[prod,...p]);
                  setNewProd({nombre:"",precio:"",stock:"",sku:""});
                  setShowAddProd(false);
                  setToast("Producto agregado");
                  setTimeout(()=>setToast(null),2000);
                }}
                className="py-2.5 bg-zinc-900 text-white rounded-[10px] text-[12px]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCliente && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[14px] p-5 w-full max-w-[380px] max-h-[90vh] overflow-y-auto">
            <h4 className="font-semibold text-[14px] flex items-center gap-2">
              <UserPlus size={16}/> Nuevo cliente (para autocompletar envíos)
            </h4>
            <div className="mt-1 text-[11px] text-zinc-500">
              Si vienes del POS, el nombre/RUT que escribiste ya está pre-llenado
            </div>
            <div className="mt-3 space-y-2">
              <input value={newCliente.nombre} onChange={e=>setNewCliente({...newCliente, nombre:e.target.value})} placeholder="Nombre completo *" className="w-full px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              <input value={newCliente.rut} onChange={e=>setNewCliente({...newCliente, rut:e.target.value})} placeholder="RUT (ej: 12.345.678-9)" className="w-full px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              <div className="grid grid-cols-2 gap-2">
                <input value={newCliente.telefono} onChange={e=>setNewCliente({...newCliente, telefono:e.target.value})} placeholder="Teléfono (+56...)" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
                <input value={newCliente.email} onChange={e=>setNewCliente({...newCliente, email:e.target.value})} placeholder="Email" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              </div>
              <input value={newCliente.direccion} onChange={e=>setNewCliente({...newCliente, direccion:e.target.value})} placeholder="Dirección completa (para autocompletar)" className="w-full px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              <div className="grid grid-cols-2 gap-2">
                <input value={newCliente.comuna} onChange={e=>setNewCliente({...newCliente, comuna:e.target.value})} placeholder="Comuna" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
                <input value={newCliente.ciudad} onChange={e=>setNewCliente({...newCliente, ciudad:e.target.value})} placeholder="Ciudad" className="px-3 py-2.5 border rounded-[10px] bg-zinc-50 text-[12px]" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={()=>setShowAddCliente(false)} className="py-2.5 border rounded-[10px] text-[12px]">Cancelar</button>
              <button onClick={handleAddCliente} className="py-2.5 bg-zinc-900 text-white rounded-[10px] text-[12px]">Guardar cliente</button>
            </div>
          </div>
        </div>
      )}

      {showBoletaModal && lastVenta && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] p-5 w-full max-w-[420px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00B86F]/10 flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#00B86F]"/>
                </div>
                <div>
                  <div className="font-semibold text-[14px]">Venta {lastVenta.id} creada</div>
                  <div className="text-[11px] text-zinc-500">
                    {lastVenta.cliente} • {lastVenta.comprobante} • PDF listo
                  </div>
                </div>
              </div>
              <button onClick={()=>setShowBoletaModal(false)} className="p-1.5 rounded-full border">
                <X size={14}/>
              </button>
            </div>

            <div className="bg-zinc-50 border rounded-[12px] p-3 text-[11px] space-y-1">
              <div className="font-mono text-[12px]">
                {lastVenta.comprobante} - ${lastVenta.monto.toLocaleString('es-CL')}
              </div>
              <div className="text-zinc-600">
                {lastVenta.productos.length} productos • {lastVenta.envio}
                {lastVenta.direccion ? ` • ${lastVenta.direccion}` : ""}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[12px] font-semibold mb-1 flex items-center gap-1">
                <FileText size={12}/> Boleta en PDF
              </div>
              <div className="text-[11px] text-zinc-500 mb-2">
                Ahora la boleta se genera en PDF profesional
              </div>
              <button
                onClick={()=>descargarPDFBoleta(lastVenta)}
                className="w-full py-2.5 rounded-[10px] bg-zinc-900 text-white text-[12px] flex items-center justify-center gap-2"
              >
                <Download size={14}/> Descargar Boleta PDF - {lastVenta.comprobante}
              </button>
            </div>

            <div className="mt-4">
              <div className="text-[12px] font-semibold mb-2">Enviar boleta PDF por WhatsApp / Correo</div>
              <div className="text-[11px] text-zinc-500 mb-2">
                Se descarga el PDF automaticamente y luego abre WhatsApp/Email para adjuntar
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={()=>enviarWhatsApp(lastVenta)}
                  className="py-3 rounded-[12px] bg-[#25D366] text-white text-[12px] font-medium flex flex-col items-center gap-1"
                >
                  <Phone size={18}/> WhatsApp PDF
                  <span className="text-[10px] opacity-80 truncate max-w-[120px]">
                    {lastVenta.telefono || clientes.find(c=>c.id===lastVenta.clienteId)?.telefono || "Sin teléfono"}
                  </span>
                </button>
                <button
                  onClick={()=>enviarEmail(lastVenta)}
                  className="py-3 rounded-[12px] bg-zinc-900 text-white text-[12px] font-medium flex flex-col items-center gap-1"
                >
                  <Mail size={18}/> Email PDF
                  <span className="text-[10px] opacity-70 truncate max-w-[120px]">
                    {clientes.find(c=>c.id===lastVenta.clienteId)?.email || "Sin email"}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={()=>{
                  navigator.clipboard.writeText(generarMensajeBoleta(lastVenta));
                  setToast("Boleta copiada");
                  setTimeout(()=>setToast(null),2000);
                }}
                className="py-2.5 rounded-[10px] border text-[11px] flex items-center justify-center gap-1"
              >
                <FileText size={12}/> Copiar
              </button>
              <button
                onClick={()=>descargarPDFGuia(lastVenta)}
                className="py-2.5 rounded-[10px] border text-[11px] flex items-center justify-center gap-1"
              >
                <Truck size={12}/> Guia PDF
              </button>
              <button
                onClick={()=>setShowBoletaModal(false)}
                className="py-2.5 rounded-[10px] bg-zinc-100 text-[11px]"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-3 p-2.5 bg-sky-50 border border-sky-200 rounded-[10px] text-[10px] text-sky-800">
              💡 PDF: Al tocar WhatsApp o Email, el PDF se descarga primero. Luego adjuntalo manualmente en la conversacion/correo. Es la forma estandar para PDFs.
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[12px] px-4 py-2.5 rounded-full shadow-xl z-[90]">
          {toast}
        </div>
      )}
    </div>
  );
}
