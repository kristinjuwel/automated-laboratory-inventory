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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CustomPagination from "../ui/pagination-custom";
import { CalibrationSchema } from "@/packages/api/inventory";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import Image from "next/image";
import EditCalibration from "../dialogs/calibration-edit";

interface CalibrationLogValues {
  calibrationId: number;
  materialId: number;
  material: string;
  calibrationDate: string;
  nextCalibration: string;
  notes: string;
  file: string;
  userId: number;
  user: string;
  laboratory: string;
  fileName: string;
}

const ITEMS_PER_PAGE = 4;

const CalibrationLogs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const labSlug = pathname?.split("/")[2];
  const [calibrations, setCalibrations] = useState<CalibrationLogValues[]>([]);
  const [filteredCalibrations, setFilteredCalibrations] = useState<
    CalibrationLogValues[]
  >([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedCalibration, setSelectedCalibration] =
    useState<CalibrationLogValues | null>(null);
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
  useEffect(() => {
    if (!isEditDialogOpen) {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}calibration`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch calibration logs");
          }
          const data = await response.json();
          const mappedCalibrations = data.map(
            (calibration: CalibrationSchema) => ({
              ...calibration,
              user: `${calibration.user.firstName} ${
                calibration.user.middleName
                  ? calibration.user.middleName + " "
                  : ""
              }${calibration.user.lastName}`,
              material: calibration.material.itemName,
              laboratory: calibration.material.laboratory.labName,
              file: calibration.file,
              fileName: calibration.attachments,
            })
          );

          const laboratoryFilter = mappedCalibrations.filter(
            (calibration: CalibrationLogValues) =>
              calibration.laboratory.toLowerCase() === labSlug
          );
          setCalibrations(laboratoryFilter);
          setFilteredCalibrations(laboratoryFilter);
        } catch (error) {
          console.error("Error fetching calibrations:", error);
        }
      };

      fetchMaterials();
    }
  }, [labSlug, isEditDialogOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredCalibrations(
      calibrations.filter((calibration) => {
        const combinedString = `${calibration.material} ${calibration.user} ${calibration.notes} ${calibration.fileName}`;
        return combinedString.toLowerCase().includes(query);
      })
    );
    setCurrentPage(1);
  };

  const paginatedCalibrations = filteredCalibrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderFile = (file: string, fileName: string) => {
    const mimeType = getMimeType(fileName);

    if (mimeType.startsWith("video/")) {
      return (
        <div className="flex justify-center items-start">
          <video
            controls
            style={{ width: "100%", height: "300px" }}
            className="flex justify-start items-start"
          >
            <source src={`data:${mimeType};base64,${file}`} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (mimeType === "application/pdf") {
      return (
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
              uri: `data:${mimeType};base64,${file}`,
              fileName: fileName,
            },
          ]}
          prefetchMethod="GET"
          config={{ header: { disableHeader: true } }}
        />
      );
    }

    if (mimeType.startsWith("image/")) {
      return (
        <div className="flex flex-col justify-end items-end">
          <Image
            src={`data:${mimeType};base64,${file}`}
            alt="File preview"
            width={100}
            height={100}
            style={{ width: "100%", height: "auto" }}
          />
          <a
            href={`data:${mimeType};base64,${file}`}
            download={fileName}
            className="text-teal-800 flex justify-center rounded-xl bg-teal-200 h-10 w-28 p-2 mt-4 hover:bg-teal-500"
          >
            Download
          </a>
        </div>
      );
    }

    return (
      <div>
        <p>
          Unsupported file type.
          <a
            href={`data:${mimeType};base64,${file}`}
            download={fileName}
            className="text-teal-800 italic underline-offset-2 underline"
          >
            Click here to download the file.
          </a>
        </p>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Calibration Logs
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for a material"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>
          <Button
            className="bg-teal-500 text-white w-42 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out ml-6"
            onClick={() => {
              router.push("/calibration-log-form");
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Calibrate Equipment
          </Button>
          <Button
            className="bg-black text-white w-36 justify-center rounded-lg hover:bg-gray-700 transition-colors duration-300 ease-in-out mx-2"
            onClick={() => {
              setIsPrintDialogOpen(true);
            }}
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            Print Forms
          </Button>
        </div>
      </div>

      <Toaster />
      <TooltipProvider>
        <Table className="overflow-x-auto">
          <TableHeader className="text-center justify-center">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Personnel</TableHead>
              <TableHead>Calibration Date</TableHead>
              <TableHead>Next Calibration</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCalibrations.length > 0 ? (
              paginatedCalibrations.map((calibration) => (
                <TableRow key={calibration.calibrationId}>
                  <TableCell>{calibration.calibrationId}</TableCell>
                  <TableCell>{calibration.material}</TableCell>
                  <TableCell>{calibration.user}</TableCell>
                  <TableCell>
                    {new Date(calibration.calibrationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(calibration.nextCalibration).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-teal-600 hover:text-teal-900 hover:bg-teal-50"
                      onClick={() => {
                        setSelectedCalibration(calibration);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Paperclip className="w-4 h-4 -mr-0.5" /> View Attachment
                    </Button>
                  </TableCell>
                  <TableCell className="relative max-w-8 truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer truncate">
                          {calibration.notes}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{calibration.notes}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedCalibration(calibration);
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
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
      <CustomPagination
        totalItems={filteredCalibrations.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 sm:h-4/5 h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Edit className="text-teal-500 size-5 -mt-0.5" />
              Edit Calibration
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedCalibration && (
            <EditCalibration
              closeDialog={() => setIsEditDialogOpen(false)}
              calibrationId={selectedCalibration.calibrationId}
              materialId={selectedCalibration.materialId}
              calibrationDate={selectedCalibration.calibrationDate}
              nextCalibration={selectedCalibration.nextCalibration}
              notes={selectedCalibration.notes}
              file={null}
              userId={selectedCalibration.userId}
            ></EditCalibration>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-white max-h-svh h-auto max-w-2xl overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2 tracking-tight text-teal-900 mt-2">
              <Paperclip className="text-teal-900 size-5 -mt-0.5" />
              File Preview - {selectedCalibration?.fileName}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedCalibration?.file && (
            <div className="rounded-xl items-start justify-start top-0 h-full">
              {renderFile(
                selectedCalibration.file,
                selectedCalibration.fileName
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <Printer className="text-black size-5 -mt-0.5" />
              Print Disposal Form
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to print this form?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsPrintDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsPrintDialogOpen(false)}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalibrationLogs;
