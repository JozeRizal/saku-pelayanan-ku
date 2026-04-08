
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, DashboardStats, ReportOptions } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import Settings from './components/Settings';
import { LayoutGrid, Settings as SettingsIcon, Plus } from 'lucide-react';
import { downloadJSON, downloadCSV } from './utils/helpers';
import { generateLaporanKeuanganPDF, generateExcelReport } from './utils/reportHelpers';

const STORAGE_KEY = 'saku_pelayanan_data';
const EXPENSE_TARGET_KEY = 'saku_pelayanan_target';
const INCOME_TARGET_KEY = 'saku_pelayanan_income_target';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseTarget, setExpenseTarget] = useState<number>(0);
  const [incomeTarget, setIncomeTarget] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedExpenseTarget = localStorage.getItem(EXPENSE_TARGET_KEY);
    const savedIncomeTarget = localStorage.getItem(INCOME_TARGET_KEY);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) setTransactions(parsed);
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
    
    if (savedExpenseTarget) setExpenseTarget(Number(savedExpenseTarget));
    if (savedIncomeTarget) setIncomeTarget(Number(savedIncomeTarget));
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(EXPENSE_TARGET_KEY, expenseTarget.toString());
  }, [expenseTarget]);

  useEffect(() => {
    localStorage.setItem(INCOME_TARGET_KEY, incomeTarget.toString());
  }, [incomeTarget]);

  // Derived Stats
  const stats = useMemo<DashboardStats>(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeTarget,
      expenseTarget,
      remainingIncomeGoal: Math.max(0, incomeTarget - totalIncome),
      remainingExpenseBudget: expenseTarget - totalExpense
    };
  }, [transactions, incomeTarget, expenseTarget]);

  // Handlers
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newTransaction: Transaction = {
      ...data,
      id: newId,
      createdAt: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (!id) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const resetData = () => {
    // Confirmation is now handled in the Settings component UI
    setTransactions([]);
  };

  const exportJSON = () => {
    downloadJSON(transactions, `SakuPelayanan_${new Date().toLocaleDateString()}.json`);
  };

  const exportCSV = () => {
    if (transactions.length === 0) return alert('Data kosong');
    const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Deskripsi'];
    const rows = [
      ...transactions.map(t => [t.id, t.date, t.type, t.category, t.amount.toString(), t.description]),
      ['', '', '', '', '', ''], // Empty row
      ['', '', '', 'TOTAL PEMASUKAN', stats.totalIncome.toString(), ''],
      ['', '', '', 'TOTAL PENGELUARAN', stats.totalExpense.toString(), ''],
      ['', '', '', 'SALDO AKHIR', stats.balance.toString(), '']
    ];
    downloadCSV(headers, rows, `SakuPelayanan_${new Date().toLocaleDateString()}.csv`);
  };

  const exportLaporanKeuangan = (options: ReportOptions) => {
    generateLaporanKeuanganPDF(transactions, stats, options);
  };

  const exportExcel = () => {
    generateExcelReport(transactions, stats);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-gray-50 overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto pb-32">
        {activeTab === 'home' ? (
          <>
            <Dashboard stats={stats} />
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </>
        ) : (
          <Settings 
            onReset={resetData} 
            onExportJSON={exportJSON} 
            onExportCSV={exportCSV} 
            onExportLaporanKeuangan={exportLaporanKeuangan}
            onExportExcel={exportExcel}
            expenseTarget={expenseTarget}
            incomeTarget={incomeTarget}
            onUpdateExpenseTarget={setExpenseTarget}
            onUpdateIncomeTarget={setIncomeTarget}
          />
        )}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl z-40 active:scale-90 transition-transform ring-4 ring-white"
      >
        <Plus size={32} />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around h-20 px-6 safe-area-bottom z-40">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400 opacity-60'}`}>
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold uppercase">Utama</span>
        </button>
        <div className="w-16"></div>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-400 opacity-60'}`}>
          <SettingsIcon size={24} />
          <span className="text-[10px] font-bold uppercase">Opsi</span>
        </button>
      </nav>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addTransaction} />
    </div>
  );
};

export default App;
