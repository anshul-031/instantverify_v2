import { VerificationReport } from "@/lib/types/report";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(report: VerificationReport): Promise<void> {
  try {
    const element = document.querySelector('.verification-report');
    if (!element) throw new Error('Report element not found');

    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Add metadata
    pdf.setProperties({
      title: `Verification Report - ${report.trackingId}`,
      subject: 'Background Verification Report',
      author: 'InstantVerify.in',
      keywords: 'verification, background check',
      creator: 'InstantVerify.in',
    });

    // Add footer with page numbers
    const totalPages = Math.ceil(pdfHeight / pdf.internal.pageSize.getHeight());
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128);
      pdf.text(
        `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleString()}`,
        10,
        pdf.internal.pageSize.getHeight() - 10
      );
    }

    // Download the PDF
    pdf.save(`verification-report-${report.trackingId}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}