import { AuthContext } from "@/Auth/AuthContext";
import axios from "axios";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";

interface FileData {
  id: string;
  originalFilename: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

interface FileTableProps {
  refreshTrigger?: number;
}

const downloadFile = async (
  fileId: string,
  userName: string,
  fileName: string,
  fileType: string
) => {
  try {
    if (!userName || userName === "") userName = localStorage.get("username");
    const response = await axios.get(
      `http://localhost:8080/api/files/download/${userName}/${Number(fileId)}`,
      {
        responseType: "blob",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: fileType })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        `Download failed: ${error.response?.data?.message || error.message}`
      );
    } else {
      toast.error("Unknown download error");
    }
  }
};

const FileTable = memo(({ refreshTrigger }: FileTableProps) => {
  const { userId, setUserId, userName, setUserName } = useContext(AuthContext)!;
  const [files, setFiles] = useState<FileData[]>(() => {
    const cachedFiles = localStorage.getItem("cachedFiles");
    return cachedFiles ? JSON.parse(cachedFiles) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const table = useReactTable({
    data: files,
    columns: [
      { accessorKey: "id", header: "File Id" },
      { accessorKey: "originalFilename", header: "File Name" },
      { accessorKey: "mimeType", header: "File Type" },
      { accessorKey: "createdAt", header: "Created At" },
      { accessorKey: "updatedAt", header: "Updated At" },
      { accessorKey: "downloadBtn", header: "Download Button" },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 7 } },
  });

  const fetchFiles = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<FileData[]>(
          `http://localhost:8080/api/files/${userName}`,
          {
            signal,
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        const _files = response.data;
        _files.sort((a: FileData, b: FileData) => Number(b.id) - Number(a.id));

        setFiles(_files);
        localStorage.setItem("cachedFiles", JSON.stringify(response.data));
      } catch (err) {
        if (!axios.isCancel(err)) {
          toast.error("Failed to fetch files");
          setError("Failed to fetch files");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userName, refreshTrigger]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (!userId) {
      const savedUserId = localStorage.getItem("token");
      if (savedUserId) setUserId(savedUserId);
      else toast.error("User Id not found, please login again");
    } else if (!userName) {
      const savedUserName = localStorage.getItem("username");
      if (savedUserName) setUserName(savedUserName);
      else toast.error("Username not found, please login again");
    } else {
      fetchFiles(controller.signal);
    }
    // else {

    //   const interval = setInterval(() => {
    //     if (userId && userName) {
    //       fetchFiles(controller.signal);
    //       clearInterval(interval);
    //     }
    //   }, 500);
    // }

    return () => controller.abort();
  }, [userName, userId, fetchFiles, refreshTrigger]);

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Toaster />
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your uploaded files.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">File Id</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>File Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-left">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {Number(row.id) + 1}
                </TableCell>
                <TableCell>{row.original.originalFilename}</TableCell>
                <TableCell>{row.original.mimeType}</TableCell>
                <TableCell>{row.original.createdAt?.split("T")[0]}</TableCell>
                <TableCell>{row.original.updatedAt?.split("T")[0]}</TableCell>
                <TableCell
                  onClick={() =>
                    downloadFile(
                      row.original.id,
                      userName,
                      row.original.originalFilename,
                      row.original.mimeType
                    )
                  }
                >
                  <DownloadIcon/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
});

export default FileTable;

