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
  telefono…
