import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, FilePlus, Paperclip, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomPagination from "../ui/pagination-custom";
import { IncidentSchema } from "@/packages/api/inventory";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import PdfGenerator from "../templates/pdf-generator";
import PdfForm from "../templates/pdf-form";
import IncidentEdit from "../dialogs/edit-incident";
import { Label } from "../ui/label";

interface IncidentValues {
  incidentFormId: number;
  date: string;
  time: string;
  natureOfIncident: string;
  qty: string;
  materialId: string;
  brand: string;
  remarks: string;
  userId: string;
  involvedIndividuals: string;
  materialsInvolved: string;
  file: string;
  attachments: string;
  fileType?: string;
  files: File[];
  creationDate: string;
  dateUpdated: string;
}

const ITEMS_PER_PAGE = 4;

const Incident = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [incidents, setIncidents] = useState<IncidentValues[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentValues[]>(
    []
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentValues | null>(null);
  const getMimeType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "doc":
      case "docx":
        return "application/msword";
      case "txt":
        return "text/plain";
      case "xlsx":
      case "xls":
        return "application/vnd.ms-excel";
      case "pptx":
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "mp4":
        return "video/mp4";
      case "mkv":
        return "video/x-matroska";
      default:
        return "application/octet-stream";
    }
  };
  function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const byteArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }
  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}incident-forms`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch incident forms");
          }
          const data = await response.json();
          const mappedIncidents = data.map((incident: IncidentSchema) => {
            const fileTypes = incident.attachments
              ? incident.attachments.split(",")
              : [];

            const files =
              incident.files && Array.isArray(incident.files)
                ? incident.files.map((fileBase64: string, index: number) => {
                    const mimeType =
                      getMimeType(fileTypes[index]) ||
                      "application/octet-stream";
                    return new File(
                      [base64ToUint8Array(fileBase64)],
                      `${fileTypes[index]}`,
                      {
                        type: mimeType,
                      }
                    );
                  })
                : [];

            const attachments =
              incident.attachments && Array.isArray(incident.attachments)
                ? incident.attachments.map(
                    (attachmentBase64: string, index: number) => {
                      const mimeType =
                        fileTypes[index] || "application/octet-stream";
                      return new File(
                        [base64ToUint8Array(attachmentBase64)],
                        `attachment${index + 1}`,
                        {
                          type: mimeType,
                        }
                      );
                    }
                  )
                : [];

            const allFiles = [...files, ...attachments];

            return {
              ...incident,
              files: allFiles,
            };
          });

          setIncidents(mappedIncidents);
          setFilteredIncidents(mappedIncidents);
        } catch (error) {
          console.error("Error fetching incident forms:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredIncidents(
      incidents.filter((incident) => {
        const combinedString = `${incident.materialsInvolved} ${incident.involvedIndividuals} ${incident.brand} ${incident.date}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const tableHeaders = [
    "ID",
    "Date",
    "Time",
    "Involved Material/s \nItem name (Brand) - Quantity",
    "Quantity",
    "Brand",
    "Nature of Incident",
    "Involved Personnel/s",
    "Remarks",
    "Attachments",
    "Created At",
    "Updated At",
  ];
  const tableData = incidents.map((incident) => [
    incident.incidentFormId,
    new Date(incident.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    new Date(`1970-01-01T${incident.time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    incident.materialsInvolved
    .split(",")
    .map((material, index) => {
      const brands = incident.brand.split(",");
      const quantities = incident.qty.split(",");

      // Return plain text for PDF-friendly output
      return `${material.trim()} (${brands[index]?.trim() || "N/A"}) - ${
        quantities[index]?.trim() || "N/A"
      }`;
    })
    .join("\n"),
    incident.qty,
    incident.brand,
    incident.natureOfIncident,
    incident.involvedIndividuals,
    incident.remarks,
    incident.attachments
      .split(",")
      .map((attachment: string) => attachment.trim())
      .join("\n"),
    new Date(incident.creationDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    new Date(incident.dateUpdated).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ]);

  const singleTableData = selectedIncident
    ? [
        [
          selectedIncident.incidentFormId,
          new Date(selectedIncident.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          new Date(`1970-01-01T${selectedIncident.time}`).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          ),
          selectedIncident.materialsInvolved
          .split(",")
          .map((material, index) => {
            const brands = selectedIncident.brand.split(",");
            const quantities = selectedIncident.qty.split(",");

            // Return plain text for PDF-friendly output
            return `${material.trim()} (${brands[index]?.trim() || "N/A"}) - ${
              quantities[index]?.trim() || "N/A"
            }`;
          })
          .join("\n"),
          selectedIncident.qty,
          selectedIncident.brand,
          selectedIncident.natureOfIncident,
          selectedIncident.involvedIndividuals,
          selectedIncident.remarks,
          selectedIncident.attachments
            .split(",")
            .map((attachment: string) => attachment.trim())
            .join("\n"),
          new Date(selectedIncident.creationDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          new Date(selectedIncident.dateUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        ],
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl sm:text-2xl text-center sm:text-left font-semibold text-teal-700 mb-4">
          Incident Forms
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:hidden items-center gap-4 w-full">
          <div className="relative flex-grow w-full">
            <Input
              placeholder="Search for a material"
              value={search}
              onChange={handleSearch}
              className="w-full pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-500" />
            </span>
          </div>

          <Button
            className="flex items-center bg-teal-500 text-white w-full justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out"
            onClick={() => {
              router.push("/incident-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Report Incident
          </Button>
          <Button
            className="bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out mx-2"
            onClick={() => {
              setIsPrintAllOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
          </Button>
        </div>
      </div>

      <Toaster />
      <Table className="overflow-x-auto">
        <TableHeader className="text-center justify-center">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>
              <div className="flex flex-col">
                <Label className="text-sm font-bold">Material</Label>
                <Label className="text-xs text-teal-600 text-nowrap">
                  Item name (Brand) - Quantity
                </Label>
              </div>
            </TableHead>
            <TableHead>Nature of Incident</TableHead>
            <TableHead>Involved Personnel/s</TableHead>
            <TableHead>Attachment</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-nowrap">Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIncidents.length > 0 ? (
            paginatedIncidents.map((incident) => (
              <TableRow key={incident.incidentFormId}>
                <TableCell>{incident.incidentFormId}</TableCell>
                <TableCell>
                  {new Date(incident.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(`1970-01-01T${incident.time}`).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2 justify-center items-center text-center w-full">
                    {incident.materialsInvolved
                      .split(",")
                      .map((material, index) => (
                        <div key={index} className="flex flex-row gap-3">
                          <p className="text-nowrap">
                            {material.trim()} (
                            {incident.brand.split(",")[index].trim()}) -{" "}
                            {incident.qty.split(",")[index].trim()}
                          </p>
                        </div>
                      ))}
                  </div>
                </TableCell>
                <TableCell>{incident.natureOfIncident}</TableCell>
                <TableCell>{incident.involvedIndividuals}</TableCell>
                <TableCell className="justify-start text-left">
                  {incident.files &&
                    incident.files.map((file: File, index: number) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="rounded-md text-teal-600 hover:text-teal-900 hover:bg-teal-50"
                        onClick={() => {
                          setIsPreviewOpen(true);
                          setSelectedFile(file);
                        }}
                      >
                        <Paperclip className="w-4 h-4 -mr-0.5" /> {file.name}
                      </Button>
                    ))}
                </TableCell>
                <TableCell>{incident.remarks}</TableCell>
                <TableCell>
                  {new Date(incident.creationDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(incident.dateUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 -mr-0.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-black-600 hover:text-black-900 hover:bg-black-50"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setIsPrintDialogOpen(true);
                    }}
                  >
                    <Printer className="w-4 h-4 -mr-1" /> Print
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500">
                No materials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CustomPagination
        totalItems={filteredIncidents.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 sm:h-4/5 h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Incident Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <IncidentEdit
              closeDialog={() => setIsEditDialogOpen(false)}
              incidentFormId={selectedIncident.incidentFormId}
              date={selectedIncident.date}
              time={selectedIncident.time}
              natureOfIncident={selectedIncident.natureOfIncident}
              qty={selectedIncident.qty}
              materialId={selectedIncident.materialId}
              brand={selectedIncident.brand}
              remarks={selectedIncident.remarks}
              userId={selectedIncident.userId}
              involvedIndividuals={selectedIncident.involvedIndividuals}
              materialsInvolved={selectedIncident.materialsInvolved}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-white max-h-4/5 h-fit max-w-2xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2 tracking-tight text-teal-900 mt-2">
              <Paperclip className="text-teal-900 size-5 -mt-0.5" />
              File Preview - {selectedFile?.name}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedFile && (
            <div className="rounded-xl items-start justify-start top-0 h-full">
              <DocViewer
                theme={{ primary: "#D7F5E9", secondary: "#E4F8F0" }}
                style={{
                  borderRadius: "15px",
                  overflow: "auto",
                  display: "flex",
                  height: "500px",
                  backgroundColor: "#F1FBF7",
                }}
                pluginRenderers={DocViewerRenderers}
                documents={[
                  {
                    uri: URL.createObjectURL(selectedFile),
                    fileName: selectedFile.name,
                  },
                ]}
                config={{
                  header: { disableHeader: true },
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintAllOpen} onOpenChange={setIsPrintAllOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Incident Forms
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this form?
          </p>
          <p className="text-left text-sm italic">
            *This form shall be printed in a long bond paper.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintAllOpen(false)}
            >
              Cancel
            </Button>
            <PdfGenerator
              pdfTitle="Incident Report"
              pageSize="long"
              orientation="landscape"
              tableHeaders={tableHeaders}
              tableData={tableData}
              closeDialog={() => setIsPrintAllOpen(false)}
            ></PdfGenerator>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              Print Incident Form
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <p className="text-left pt-2 text-m">
            Select page size for the form:
          </p>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span className={pageSize ? "text-black" : "text-gray-500"}>
                    {pageSize === "a4"
                      ? "A4 (210 x 297 mm)"
                      : pageSize === "short"
                      ? "Short (Letter, 215.9 x 279.4 mm)"
                      : pageSize === "long"
                      ? "Long (Legal, 215.9 x 355.6 mm)"
                      : "Select Page Size"}
                  </span>
                  <span className="ml-auto">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  { label: "A4 (210 x 297 mm)", value: "a4" },
                  { label: "Short (Letter, 215.9 x 279.4 mm)", value: "short" },
                  { label: "Long (Legal, 215.9 x 355.6 mm)", value: "long" },
                ].map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={pageSize === option.value}
                    onCheckedChange={(checked) =>
                      setPageSize(checked ? option.value : "a4")
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-left pt-4 text-m">
            Select orientation for the form:
          </p>
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  <span
                    className={orientation ? "text-black" : "text-gray-500"}
                  >
                    {orientation === "portrait"
                      ? "Portrait"
                      : orientation === "landscape"
                      ? "Landscape"
                      : "Select Orientation"}
                  </span>
                  <span className="ml-auto">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  { label: "Portrait", value: "portrait" as const },
                  { label: "Landscape", value: "landscape" as const },
                ].map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={orientation === option.value}
                    onCheckedChange={(checked) =>
                      setOrientation(checked ? option.value : "portrait")
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Cancel
            </Button>
            {selectedIncident && (
              <PdfForm
                pdfTitle="Incident Form"
                pageSize={pageSize}
                orientation={orientation}
                tableHeaders={tableHeaders}
                tableData={singleTableData}
                materialName={selectedIncident.natureOfIncident}
                closeDialog={() => setIsPrintDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Incident;
