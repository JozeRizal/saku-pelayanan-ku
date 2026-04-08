
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants';
import { X, Camera, Check, Upload } from 'lucide-react';
import { compressImage } from '../utils/helpers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState<TransactionType>('pengeluaran');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('Lainnya');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const compressed = await compressImage(file);
        setReceiptImage(compressed);
      } catch (err) {
        alert('Gagal mengolah gambar');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return alert('Mohon isi jumlah dan deskripsi');

    onAdd({
      type,
      date,
      category,
      amount: parseFloat(amount),
      description,
      receiptImage,
    });

    // Reset fields
    setAmount('');
    setDescription('');
    setReceiptImage(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col safe-area-top">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={onClose} className="p-2 text-gray-500">
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold">Catat Transaksi</h2>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Type Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('pemasukan')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === 'pemasukan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Pemasukan
          </button>
          <button
            type="button"
            onClick={() => setType('pengeluaran')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === 'pengeluaran' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Jumlah (IDR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full text-4xl font-bold border-b-2 border-gray-100 focus:border-indigo-500 outline-none pb-2 transition-all"
            required
          />
        </div>

        {/* Grid Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium appearance-none"
            >
              {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Makan siang lapangan..."
            className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none text-sm font-medium min-h-[100px]"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Foto Bukti / Nota</label>
          <div className="relative">
            {receiptImage ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img src={receiptImage} alt="Nota" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setReceiptImage(undefined)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl aspect-video cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={32} className="mb-2" />
                  <span className="text-sm font-medium">Ambil Foto / Upload</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                <span className="text-xs font-bold text-indigo-600">Memproses Gambar...</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Check size={20} />
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
};

export default AddTransactionModal;
