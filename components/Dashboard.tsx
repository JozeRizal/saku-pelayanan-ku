
import React from 'react';
import { DashboardStats } from '../types';
import { formatIDR } from '../utils/helpers';
import { TrendingUp, TrendingDown, Info, AlertCircle } from 'lucide-react';

interface Props {
  stats: DashboardStats;
}

const Dashboard: React.FC<Props> = ({ stats }) => {
  const hasIncomeTarget = stats.incomeTarget > 0;
  const hasExpenseTarget = stats.expenseTarget > 0;
  
  const incomePercent = hasIncomeTarget 
    ? Math.min(Math.round((stats.totalIncome / stats.incomeTarget) * 100), 100) 
    : 0;

  const expensePercent = hasExpenseTarget 
    ? Math.min(Math.round((stats.totalExpense / stats.expenseTarget) * 100), 100) 
    : 0;

  return (
    <div className="bg-indigo-600 text-white p-6 rounded-b-[2.5rem] shadow-xl safe-area-top">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold opacity-90 tracking-tight">Saku Pelayanan</h1>
        {/* Brand Icon Replacement */}
        <div className="bg-white text-indigo-600 w-9 h-9 flex items-center justify-center rounded-xl font-black text-sm shadow-inner transition-transform active:scale-95">
          SP
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-1.5 opacity-80 mb-1">
          <p className="text-xs font-bold uppercase tracking-widest">Total Saldo Kas</p>
          <Info size={12} />
        </div>
        <h2 className="text-4xl font-black tracking-tight">{formatIDR(stats.balance)}</h2>
        <p className="text-[10px] text-indigo-200 mt-1 font-medium italic">* Jumlah uang fisik yang tersedia saat ini</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-[10px] font-bold text-indigo-100 uppercase">Masuk</span>
          </div>
          <p className="text-base font-bold text-emerald-300">{formatIDR(stats.totalIncome)}</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-rose-400" />
            <span className="text-[10px] font-bold text-indigo-100 uppercase">Keluar</span>
          </div>
          <p className="text-base font-bold text-rose-300">{formatIDR(stats.totalExpense)}</p>
        </div>
      </div>

      {/* Targets Monitoring Section */}
      <div className="space-y-3">
        {/* Income Target Card */}
        {hasIncomeTarget ? (
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Progres Pengumpulan Dana</span>
              </div>
              <span className="text-xs font-black text-emerald-300">{incomePercent}%</span>
            </div>
            <div className="h-2 bg-indigo-900/40 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${incomePercent}%` }}></div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-indigo-200 uppercase font-bold tracking-tighter">Sisa yang harus dicapai</p>
                <p className="text-sm font-black text-white">{formatIDR(stats.remainingIncomeGoal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-indigo-200/60 font-bold uppercase tracking-tighter">Goal: {formatIDR(stats.incomeTarget)}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Expense Target Card */}
        {hasExpenseTarget ? (
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Pemakaian Limit Belanja</span>
              </div>
              <span className={`text-xs font-black ${expensePercent >= 90 ? 'text-rose-400 animate-pulse' : 'text-rose-300'}`}>{expensePercent}%</span>
            </div>
            <div className="h-2 bg-indigo-900/40 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-700 ${expensePercent >= 100 ? 'bg-rose-500' : 'bg-rose-400'}`} 
                style={{ width: `${expensePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-indigo-200 uppercase font-bold tracking-tighter">Sisa kuota belanja</p>
                <p className={`text-sm font-black ${stats.remainingExpenseBudget < 0 ? 'text-rose-300' : 'text-white'}`}>
                  {formatIDR(Math.max(0, stats.remainingExpenseBudget))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-indigo-200/60 font-bold uppercase tracking-tighter">Limit: {formatIDR(stats.expenseTarget)}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* No Targets Message */}
        {!hasIncomeTarget && !hasExpenseTarget && (
          <div className="bg-indigo-950/30 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-indigo-300 shrink-0" />
            <p className="text-[11px] text-indigo-100 leading-tight">
              Belum ada target yang diatur. Buka menu <b>Opsi</b> untuk mengatur target pemasukan atau pengeluaran.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
