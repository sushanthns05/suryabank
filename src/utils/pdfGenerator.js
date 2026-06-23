import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
};

const addLetterhead = (doc, title, subtitle) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Header background
  doc.setFillColor(15, 23, 42); // bg-slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  // Bank Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SURYA BANK", 14, 19);
  
  // Branch Info / Date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("Kengeri Satellite Town Branch", pageWidth - 14, 14, { align: 'right' });
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 21, { align: 'right' });
  
  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 42);
  
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 48);
  }
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Confidential & Proprietary - Surya Bank • Page ${i} of ${pageCount}`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: 'center' }
    );
  }
};

export const generateDashboardPDF = (title, summaryCards) => {
  const doc = new jsPDF();
  
  addLetterhead(doc, title, "Executive Operations Summary");

  // Summary Metrics Section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Key Performance Indicators", 14, 62);

  const metricsData = summaryCards.map(card => [
    card.title,
    card.value,
    card.trend
  ]);

  autoTable(doc, {
    startY: 68,
    head: [['Metric', 'Current Value', 'Trend (vs last quarter)']],
    body: metricsData,
    theme: 'grid',
    headStyles: { fillColor: [245, 158, 11] }, // Surya primary color (amber-500)
    styles: { fontSize: 10, cellPadding: 5 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  addFooter(doc);
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
};

export const generateReportPDF = (reportData) => {
  const doc = new jsPDF();
  
  let title = "Custom Report";
  if (reportData.type === 'transactions') title = "Global Transaction Ledger";
  if (reportData.type === 'loans') title = "Loan Disbursement Report";
  if (reportData.type === 'customers') title = "Customer Acquisition Report";

  const subtitle = `Period: ${new Date(reportData.startDate).toLocaleDateString()} to ${new Date(reportData.endDate).toLocaleDateString()} | Total Records: ${reportData.totalRecords}`;
  
  addLetterhead(doc, title, subtitle);

  // Summary logic
  let startY = 60;

  if (reportData.type === 'transactions') {
    const totalCredit = reportData.data.filter(t => t.type === 'credit').reduce((a,b) => a + Number(b.amount||0), 0);
    const totalDebit = reportData.data.filter(t => t.type === 'debit').reduce((a,b) => a + Number(b.amount||0), 0);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Credit Volume: ${formatCurrency(totalCredit)}`, 14, 60);
    doc.text(`Total Debit Volume: ${formatCurrency(totalDebit)}`, 100, 60);
    startY = 70;
  } else if (reportData.type === 'loans') {
    const approvedVal = reportData.data.filter(l => l.status === 'approved').reduce((a,b) => a + Number(b.amount||0), 0);
    const pendingCount = reportData.data.filter(l => l.status !== 'approved' && l.status !== 'rejected').length;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Approved Value: ${formatCurrency(approvedVal)}`, 14, 60);
    doc.text(`Pending Applications: ${pendingCount}`, 100, 60);
    startY = 70;
  }

  // Table Configuration
  let head = [];
  let body = [];

  if (reportData.type === 'transactions') {
    head = [['Date/Time', 'Txn ID', 'Account No.', 'Type', 'Amount']];
    body = reportData.data.map(row => [
      new Date(row.timestamp || row.createdAt).toLocaleString(),
      row.id.substring(0, 8),
      row.accountNumber || 'N/A',
      row.type.toUpperCase(),
      formatCurrency(row.amount)
    ]);
  } else if (reportData.type === 'loans') {
    head = [['App Date', 'Applicant', 'Type', 'Status', 'Requested Amount']];
    body = reportData.data.map(row => [
      new Date(row.createdAt || row.date).toLocaleDateString(),
      row.customerName,
      row.type,
      row.status.replace(/_/g, ' ').toUpperCase(),
      formatCurrency(row.amount)
    ]);
  } else if (reportData.type === 'customers') {
    head = [['Join Date', 'Name', 'Account No.', 'PAN', 'Status']];
    body = reportData.data.map(row => [
      new Date(row.createdAt).toLocaleDateString(),
      row.fullName,
      row.accountNumber || 'Pending',
      row.panNumber || 'N/A',
      row.isBlocked ? 'BLOCKED' : 'ACTIVE'
    ]);
  }

  autoTable(doc, {
    startY: startY,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // Dark slate
    styles: { fontSize: 8, cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  addFooter(doc);
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
