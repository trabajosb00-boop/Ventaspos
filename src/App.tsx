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
  UserPlus
} from "lucide-react";

type Producto = { id: number; nombre: string; sku: string; stock: number; precio: number; categoria: string; img: string; };
type Cliente = { id: string; nombre: string; rut: string; telefono: string; email: string; direccion: string; comuna: string; ciudad: string; notas: string; totalCompras: number; };
type ItemVenta = { id: number; nombre: string; qty: number; precio: number; subtotal: number; };
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
    try { const s = localStorage.getItem('mitienda_productos_v2'); return s? JSON.parse(s
