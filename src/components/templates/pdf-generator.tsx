import React from "react";
import { jsPDF } from "jspdf";
import { Button } from "../ui/button";

interface PdfGeneratorProps {
  pdfTitle?: string;
  pageSize?: string;
  orientation?: "portrait" | "landscape";
  tableHeaders: string[];
  tableData: (string | number)[][];
  closeDialog: () => void;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({
  pdfTitle = "Stock Level Report",
  pageSize = "a4",
  orientation = "portrait",
  tableHeaders = [],
  tableData = [],
  closeDialog,
}) => {
  const handlePrint = () => {
    const pageSizes: Record<
      string,
      { format: string | number[]; dimensions?: number[] }
    > = {
      a4: { format: "a4", dimensions: [210, 297] },
      short: { format: [215.9, 279.4] },
      long: { format: [215.9, 355.6] },
    };

    const selectedPage = pageSizes[pageSize.toLowerCase()];

    if (!selectedPage) {
      console.error(`Invalid page size: ${pageSize}`);
      return;
    }

    const isLandscape = orientation === "landscape";
    const adjustedFormat =
      isLandscape && Array.isArray(selectedPage.format)
        ? [selectedPage.format[1], selectedPage.format[0]]
        : selectedPage.format;

    const doc = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: adjustedFormat,
    });

    const baseUrl = window.location.origin;

    const imgElement1 = new Image();
    const imgElement2 = new Image();

    imgElement1.src = `${baseUrl}/images/mrl-logo.png`;
    imgElement2.src = `${baseUrl}/images/pgh-logo.png`;

    Promise.all([
      new Promise((resolve) => (imgElement1.onload = resolve)),
      new Promise((resolve) => (imgElement2.onload = resolve)),
    ]).then(() => {
      doc.addImage(imgElement1, "PNG", 30, 10, 20, 20);
      doc.addImage(imgElement2, "PNG", isLandscape ? 250 : 160, 10, 20, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const headerText = [
        "PHILIPPINE GENERAL HOSPITAL",
        "The National University Hospital",
        "University of the Philippines Manila",
        "MEDICAL RESEARCH LABORATORY",
        "Department of Medicine",
        "Taft Avenue, Manila",
        "Tel. no. 8554-8400 loc. 3232",
      ];
      let y = 15;

      doc.setFont("helvetica", "bold");
      doc.text(headerText[0], isLandscape ? 148 : 105, y, { align: "center" });
      y += 5;

      doc.setFont("helvetica", "normal");
      headerText.slice(1, 3).forEach((text) => {
        doc.text(text, isLandscape ? 148 : 105, y, { align: "center" });
        y += 5;
      });

      doc.setFont("helvetica", "bold");
      doc.text(headerText[3], isLandscape ? 148 : 105, y, { align: "center" });
      y += 5;

      doc.setFont("helvetica", "normal");
      headerText.slice(4).forEach((text) => {
        doc.text(text, isLandscape ? 148 : 105, y, { align: "center" });
        y += 5;
      });

      y += 8;
      doc.setFont("times", "italic");
      doc.text(
        "PHIC - Accredited Health Care Provider",
        isLandscape ? 148 : 105,
        y,
        {
          align: "center",
        }
      );
      y += 5;
      doc.text("ISO 9001 CERTIFIED", isLandscape ? 148 : 105, y, {
        align: "center",
      });
      y += 5;
      doc.text("TUV-SUD, Asia Pacific, Ltd", isLandscape ? 148 : 105, y, {
        align: "center",
      });
      y += 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(pdfTitle, isLandscape ? 148 : 105, y, { align: "center" });
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      const colWidths = tableHeaders.map((header, index) => {
        const longestData = Math.max(
          header.length,
          ...tableData.map((row) => row[index]?.toString().length || 0)
        );
        return Math.max(longestData * 3, 30);
      });

      const totalTableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      let x = (doc.internal.pageSize.getWidth() - totalTableWidth) / 2;
      y += 5;

      tableHeaders.forEach((header, index) => {
        const colWidth = colWidths[index];
        doc.rect(x, y, colWidth, 10);
        doc.text(header, x + 2, y + 7);
        x += colWidth;
      });

      doc.setFont("helvetica", "normal");
      y += 10;

      tableData.forEach((row) => {
        x = (doc.internal.pageSize.getWidth() - totalTableWidth) / 2;
        row.forEach((cell, cellIndex) => {
          const colWidth = colWidths[cellIndex];
          doc.rect(x, y, colWidth, 10);
          doc.text(cell?.toString() || "", x + 2, y + 7);
          x += colWidth;
        });
        y += 10;
      });

      doc.save(`${pdfTitle}.pdf`);
    });
  };

  return (
    <Button
      className="justify-end bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-300 ease-in-out"
      onClick={handlePrint}
    >
      Confirm
    </Button>
  );
};

export default PdfGenerator;
