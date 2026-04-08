
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatIDR } from '../utils/helpers';
import { CATEGORIES } from '../constants';
import { Trash2, Calendar, X, CheckCircle2, ZoomIn } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-40">
        <div className="bg-gray-200 p-6 rounded-full mb-4">
          <Calendar size={48} />
        </div>
        <p className="text-gray-600 font-medium">Belum ada transaksi.</p>
        <p className="text-xs mt-1">Tekan tombol + untuk menambah.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4 mb-32">
      {/* Modal Preview Gambar */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-10 right-6 text-white p-2 bg-white/10 rounded-full"
            onClick={() => setPreviewImage(null)}
          >
            <X size={28} />
          </button>
          <img 
            src={previewImage} 
            alt="Nota Preview" 
            className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border-4 border-white/10 object-contain"
          />
          <p className="mt-6 text-white/60 text-sm font-medium">Ketuk di mana saja untuk menutup</p>
        </div>
      )}

      <div className="flex items-center justify-between px-2">
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider">Riwayat Transaksi</h3>
        <span className="text-xs text-gray-400 font-bold">{transactions.length} Item</span>
      </div>
      
      {transactions.map((t) => {
        const cat = CATEGORIES.find(c => c.label === t.category);
        const isConfirming = confirmingId === t.id;

        return (
          <div 
            key={t.id} 
            className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden ${
              isConfirming ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-100'
            }`}
          >
            {isConfirming && (
              <div className="absolute inset-0 z-50 bg-rose-600 flex items-center justify-between px-4 animate-in slide-in-from-right duration-200">
                <p className="text-white font-bold text-sm">Hapus catatan ini?</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setConfirmingId(null)}
                    className="flex items-center gap-1 bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    <X size={16} /> Batal
                  </button>
                  <button 
                    onClick={() => {
                      onDelete(t.id);
                      setConfirmingId(null);
                    }}
                    className="flex items-center gap-1 bg-white text-rose-600 px-4 py-2 rounded-xl text-xs font-black shadow-lg"
                  >
                    <CheckCircle2 size={16} /> YA, HAPUS
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Thumbnail Gambar di paling kiri */}
                {t.receiptImage ? (
                  <button 
                    onClick={() => setPreviewImage(t.receiptImage!)}
                    className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shrink-0 group active:scale-95 transition-transform shadow-sm"
                  >
                    <img 
                      src={t.receiptImage} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  </button>
                ) : (
                  /* Placeholder jika tidak ada foto (agar layout tetap konsisten) */
                  <div className={`w-14 h-14 ${cat?.color || 'bg-gray-100'} rounded-2xl flex items-center justify-center shrink-0 opacity-50`}>
                    <Calendar size={20} className="opacity-40" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900 truncate">{t.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                    <span className="text-[10px] font-bold uppercase">{t.date}</span>
                    <span className="text-[10px]">•</span>
                    <span className={`text-[10px] font-bold uppercase truncate px-1.5 py-0.5 rounded-md ${cat?.color || 'bg-gray-100 text-gray-600'}`}>
                      {t.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className={`text-sm font-black whitespace-nowrap ${t.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'pemasukan' ? '+' : '-'} {formatIDR(t.amount)}
                </p>
                
                <button 
                  type="button"
                  onClick={() => setConfirmingId(t.id)}
                  className="p-2 -mr-1 text-gray-300 active:text-rose-600 active:bg-rose-50 rounded-full transition-all"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
