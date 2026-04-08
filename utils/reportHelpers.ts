
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction, DashboardStats, ReportOptions } from '../types';
import { formatIDR } from './helpers';

export const generateLaporanKeuanganPDF = (transactions: Transaction[], stats: DashboardStats, options: ReportOptions) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  doc.setFontSize(18);
  doc.text(options.title || 'LAPORAN DETAIL KEUANGAN', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(options.period ? `Periode: ${options.period}` : `Periode Laporan: s/d ${date}`, 105, 30, { align: 'center' });

  // Summary Table
  autoTable(doc, {
    startY: 40,
    head: [['Keterangan', 'Jumlah']],
    body: [
      ['Total Pemasukan', formatIDR(stats.totalIncome)],
      ['Total Pengeluaran', formatIDR(stats.totalExpense)],
      ['Saldo Akhir', formatIDR(stats.balance)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });

  // Detailed Transactions Table
  doc.setFontSize(14);
  doc.text('Daftar Transaksi Detail:', 14, (doc as any).lastAutoTable.finalY + 15);

  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString('id-ID'),
    t.type === 'pemasukan' ? 'MASUK' : 'KELUAR',
    t.category,
    t.description,
    formatIDR(t.amount)
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Jumlah']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  // Add Receipts if requested
  if (options.includeReceipts) {
    const transactionsWithReceipts = [...transactions]
      .filter(t => !!t.receiptImage)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (transactionsWithReceipts.length > 0) {
      doc.addPage();
      doc.setFontSize(18);
      doc.text('LAMPIRAN BUKTI / NOTA', 105, 20, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);

      let currentY = 40;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      transactionsWithReceipts.forEach((t, index) => {
        // Check if we need a new page (approximate height for image + text is 100)
        if (currentY + 110 > pageHeight) {
          doc.addPage();
          currentY = 20;
        }

        // Transaction Info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const typeText = t.type === 'pemasukan' ? 'PEMASUKAN' : 'PENGELUARAN';
        doc.text(`${new Date(t.date).toLocaleDateString('id-ID')} - [${typeText}]`, margin, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Keterangan: ${t.description}`, margin, currentY + 5);
        doc.text(`Jumlah: ${formatIDR(t.amount)}`, margin, currentY + 10);

        // Add Image
        try {
          // Add image (x, y, width, height)
          // We'll scale the image to fit a reasonable width
          const imgWidth = 80;
          const imgHeight = 60; // Fixed aspect ratio for simplicity or we could calculate
          doc.addImage(t.receiptImage!, 'JPEG', margin, currentY + 15, imgWidth, imgHeight);
          
          currentY += 90; // Move down for next item
        } catch (e) {
          doc.setTextColor(255, 0, 0);
          doc.text('[Gagal memuat gambar bukti]', margin, currentY + 20);
          doc.setTextColor(0, 0, 0);
          currentY += 40;
        }

        // Separator line if not the last one on page
        if (index < transactionsWithReceipts.length - 1 && currentY + 50 < pageHeight) {
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, currentY - 5, pageWidth - margin, currentY - 5);
          doc.setDrawColor(0, 0, 0);
        }
      });
    }
  }

  // Add Signatures
  if (options.signees && options.signees.length > 0) {
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Check if we need a new page for signatures
    if (finalY + 60 > pageHeight) {
      doc.addPage();
      finalY = 30;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Mengetahui,', 105, finalY, { align: 'center' });

    const signeeY = finalY + 35;
    const signeeMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    if (options.signees.length === 1) {
      doc.text(options.signees[0].name, 105, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[0].position, 105, signeeY + 5, { align: 'center' });
    } else if (options.signees.length === 2) {
      // Left
      doc.text(options.signees[0].name, 50, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[0].position, 50, signeeY + 5, { align: 'center' });
      // Right
      doc.setFontSize(12);
      doc.text(options.signees[1].name, 160, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[1].position, 160, signeeY + 5, { align: 'center' });
    } else if (options.signees.length === 3) {
      // Top row 2, Bottom row 1
      doc.text(options.signees[0].name, 50, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[0].position, 50, signeeY + 5, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(options.signees[1].name, 160, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[1].position, 160, signeeY + 5, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(options.signees[2].name, 105, signeeY + 30, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[2].position, 105, signeeY + 35, { align: 'center' });
    } else if (options.signees.length === 4) {
      // 2x2 grid
      doc.text(options.signees[0].name, 50, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[0].position, 50, signeeY + 5, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(options.signees[1].name, 160, signeeY, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[1].position, 160, signeeY + 5, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(options.signees[2].name, 50, signeeY + 30, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[2].position, 50, signeeY + 35, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(options.signees[3].name, 160, signeeY + 30, { align: 'center' });
      doc.setFontSize(10);
      doc.text(options.signees[3].position, 160, signeeY + 35, { align: 'center' });
    }
  }

  doc.save(`Laporan_Keuangan_${new Date().getTime()}.pdf`);
};

export const generateExcelReport = (transactions: Transaction[], stats: DashboardStats) => {
  // Create Summary Sheet
  const summaryData = [
    ['LAPORAN KEUANGAN PELAYANAN'],
    ['Tanggal Cetak', new Date().toLocaleDateString('id-ID')],
    [],
    ['RINGKASAN'],
    ['Total Pemasukan', stats.totalIncome],
    ['Total Pengeluaran', stats.totalExpense],
    ['Saldo Akhir', stats.balance],
    [],
    ['TARGET'],
    ['Target Pemasukan', stats.incomeTarget],
    ['Limit Pengeluaran', stats.expenseTarget],
  ];

  // Create Transactions Sheet
  const transData = [
    ['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Jumlah'],
    ...transactions.map(t => [
      t.date,
      t.type.toUpperCase(),
      t.category,
      t.description,
      t.amount
    ]),
    [], // Empty row
    ['TOTAL PEMASUKAN', '', '', '', stats.totalIncome],
    ['TOTAL PENGELUARAN', '', '', '', stats.totalExpense],
    ['SALDO AKHIR', '', '', '', stats.balance],
  ];

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  const wsTrans = XLSX.utils.aoa_to_sheet(transData);

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');
  XLSX.utils.book_append_sheet(wb, wsTrans, 'Detail Transaksi');

  XLSX.writeFile(wb, `Laporan_Pelayanan_${new Date().getTime()}.xlsx`);
};
