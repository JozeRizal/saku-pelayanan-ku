
import React, { useState, useEffect } from 'react';
import { FileJson, Trash2, Info, FileText, TrendingUp, TrendingDown, AlertTriangle, X, ChevronDown, ChevronUp, UserPlus, UserMinus, Settings as SettingsIcon } from 'lucide-react';
import { ReportOptions } from '../types';

interface Props {
  onReset: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onExportLaporanKeuangan: (options: ReportOptions) => void;
  onExportExcel: () => void;
  expenseTarget: number;
  incomeTarget: number;
  onUpdateExpenseTarget: (value: number) => void;
  onUpdateIncomeTarget: (value: number) => void;
}

const Settings: React.FC<Props> = ({ 
  onReset, 
  onExportJSON, 
  onExportCSV, 
  onExportLaporanKeuangan,
  onExportExcel,
  expenseTarget, 
  incomeTarget, 
  onUpdateExpenseTarget, 
  onUpdateIncomeTarget 
}) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [includeReceipts, setIncludeReceipts] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [signees, setSignees] = useState<{name: string, position: string}[]>([
    { name: '', position: '' }
  ]);

  const addSignee = () => {
    if (signees.length < 4) {
      setSignees([...signees, { name: '', position: '' }]);
    }
  };

  const removeSignee = (index: number) => {
    setSignees(signees.filter((_, i) => i !== index));
  };

  const updateSignee = (index: number, field: 'name' | 'position', value: string) => {
    const newSignees = [...signees];
    newSignees[index][field] = value;
    setSignees(newSignees);
  };

  const handleExportLaporan = () => {
    onExportLaporanKeuangan({
      title: reportTitle,
      period: reportPeriod,
      signees: signees.filter(s => s.name || s.position),
      includeReceipts
    });
  };

  // Auto-cancel confirmation after 3 seconds if not clicked again
  useEffect(() => {
    let timer: number;
    if (isConfirmingReset) {
      timer = window.setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isConfirmingReset]);

  const handleResetClick = () => {
    if (isConfirmingReset) {
      onReset();
      setIsConfirmingReset(false);
    } else {
      setIsConfirmingReset(true);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
          <Info size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Pengaturan & Data</h2>
          <p className="text-xs text-gray-500 font-medium">Kelola anggaran dan ekspor</p>
        </div>
      </div>

      {/* Targets Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Monitor Target</h4>
        
        {/* Income Target */}
        <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Target Pemasukan</h3>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
            <input 
              type="number"
              value={incomeTarget || ''}
              onChange={(e) => onUpdateIncomeTarget(Number(e.target.value))}
              placeholder="Target dana terkumpul..."
              className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none text-lg font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed italic">
            * Target total uang yang harus masuk/terkumpul (Misal: Iuran Kas).
          </p>
        </div>

        {/* Expense Target */}
        <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <TrendingDown size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Limit Pengeluaran</h3>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
            <input 
              type="number"
              value={expenseTarget || ''}
              onChange={(e) => onUpdateExpenseTarget(Number(e.target.value))}
              placeholder="Limit belanja maksimal..."
              className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none text-lg font-bold focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed italic">
            * Batas maksimal uang yang boleh dikeluarkan.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Laporan Khusus (LPJ)</h4>
        
        <button
          onClick={handleExportLaporan}
          className="w-full bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-100 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Buat Laporan Keuangan</p>
              <p className="text-[10px] text-white/70">PDF: Detail transaksi lengkap</p>
            </div>
          </div>
        </button>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowReportOptions(!showReportOptions)}
            className="w-full p-4 flex items-center justify-between text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SettingsIcon size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Opsi Laporan PDF</span>
            </div>
            {showReportOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showReportOptions && (
            <div className="p-4 border-t border-gray-50 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Judul Laporan (Opsional)</label>
                <input 
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Contoh: Laporan Kas RT 01"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Periode Laporan (Opsional)</label>
                <input 
                  type="text"
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  placeholder="Contoh: Januari - Maret 2024"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <input 
                  type="checkbox" 
                  id="includeReceipts"
                  checked={includeReceipts}
                  onChange={(e) => setIncludeReceipts(e.target.checked)}
                  className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="includeReceipts" className="text-xs font-bold text-indigo-700 cursor-pointer select-none">
                  Tambahkan semua bukti/nota ke PDF
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tanda Tangan (Maks 4)</label>
                  {signees.length < 4 && (
                    <button 
                      onClick={addSignee}
                      className="text-indigo-600 p-1 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <UserPlus size={18} />
                    </button>
                  )}
                </div>
                
                {signees.map((signee, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-2xl space-y-2 relative group">
                    {signees.length > 1 && (
                      <button 
                        onClick={() => removeSignee(index)}
                        className="absolute -top-2 -right-2 bg-white text-rose-500 p-1 rounded-full shadow-sm border border-rose-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <UserMinus size={14} />
                      </button>
                    )}
                    <input 
                      type="text"
                      value={signee.name}
                      onChange={(e) => updateSignee(index, 'name', e.target.value)}
                      placeholder={`Nama Orang ${index + 1}`}
                      className="w-full px-3 py-2 bg-white rounded-lg border-none outline-none text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <input 
                      type="text"
                      value={signee.position}
                      onChange={(e) => updateSignee(index, 'position', e.target.value)}
                      placeholder={`Jabatan Orang ${index + 1}`}
                      className="w-full px-3 py-2 bg-white rounded-lg border-none outline-none text-[10px] focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onExportExcel}
          className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-100 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Laporan Excel Lengkap</p>
              <p className="text-[10px] text-white/70">XLSX: Format profesional multi-sheet</p>
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Ekspor Data Mentah</h4>
        
        <button
          onClick={onExportCSV}
          className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Export Data (CSV)</p>
              <p className="text-[10px] text-gray-400">Format tabel untuk Excel/Spreadsheet</p>
            </div>
          </div>
        </button>

        <button
          onClick={onExportJSON}
          className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileJson size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Export Data (JSON)</p>
              <p className="text-[10px] text-gray-400">Cadangan lengkap untuk integrasi sistem</p>
            </div>
          </div>
        </button>

        <div className="pt-4">
          <button
            onClick={handleResetClick}
            className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] ${
              isConfirmingReset 
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
              : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isConfirmingReset ? (
              <>
                <AlertTriangle size={18} className="animate-bounce" />
                <span className="text-sm font-black">YAKIN? KLIK LAGI UNTUK HAPUS SEMUA</span>
              </>
            ) : (
              <>
                <Trash2 size={18} />
                <span className="text-sm font-bold">Hapus Semua Catatan</span>
              </>
            )}
          </button>
          
          {isConfirmingReset && (
            <p className="text-center text-[10px] text-rose-500 mt-2 font-bold animate-pulse">
              Tindakan ini akan menghapus permanen seluruh data transaksi.
            </p>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-100 rounded-3xl text-center">
        <p className="text-xs text-gray-500 font-bold">Saku Pelayanan Pro</p>
        <p className="text-[10px] text-gray-400 mt-1 italic">Versi 2.0 - By : Joze Rizal</p>
      </div>
    </div>
  );
};

export default Settings;
