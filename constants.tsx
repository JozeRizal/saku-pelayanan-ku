
import React from 'react';
import { 
  Coffee, 
  Truck, 
  Home, 
  Package, 
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle 
} from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: { label: Category; icon: React.ReactNode; color: string }[] = [
  { label: 'Konsumsi', icon: <Coffee size={20} />, color: 'bg-orange-100 text-orange-600' },
  { label: 'Transport', icon: <Truck size={20} />, color: 'bg-blue-100 text-blue-600' },
  { label: 'Sewa', icon: <Home size={20} />, color: 'bg-purple-100 text-purple-600' },
  { label: 'Perlengkapan', icon: <Package size={20} />, color: 'bg-green-100 text-green-600' },
  { label: 'Lainnya', icon: <MoreHorizontal size={20} />, color: 'bg-gray-100 text-gray-600' },
];

export const TYPE_ICONS = {
  pemasukan: <ArrowUpCircle className="text-emerald-500" size={16} />,
  pengeluaran: <ArrowDownCircle className="text-rose-500" size={16} />,
};
