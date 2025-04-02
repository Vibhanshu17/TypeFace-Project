import { AuthContext } from "@/Auth/AuthContext";
import axios, { AxiosProgressEvent } from "axios";
import { useContext } from "react";
import Dropzone from "react-dropzone";
// import toast, { Toaster } from "react-hot-toast";
import { toast, Toaster } from "sonner";

function DropComponent({ refreshTableData }) {
  const maxFileSizeBytes = 5 * 1024 * 1024;
  const maxFileCount = 10;

  const { userName } = useContext(AuthContext)!;

  // const uploadFile = async (file: File) => {
  //   return new Promise((resolve, reject) => {
  //     const formData = new FormData();
  //     formData.append("userName", userName);
  //     formData.append("file", file);

  //     axios
  //       .post(`http://localhost:8080/api/files/upload`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         if (response.ok) {
  //           resolve(response);
  //         } else {
  //           reject(new Error("Upload failed"));
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading file:", error);
  //         reject(error);
  //       });
  //   });
  // };

  // const onDrop = (acceptedFiles: File[]) => {
  //   console.log(acceptedFiles);
  //   acceptedFiles.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onabort = () => toast.error("Aborted file read");
  //     reader.onerror = () => toast.error("File read failed");
  //     reader.onload = () => {
  //       toast.promise(uploadFile(file), {
  //         loading: `Saving ${file.name} ...`,
  //         success: <b>File {file.name} saved!</b>,
  //         error: <b>Could not save file {file.name}.</b>,
  //       });
  //     };
  //     reader.readAsArrayBuffer(file);
  //     reader.onloadend = () => {
  //       console.log("File read completed");
  //     };
  //     reader.onprogress = (event) => {
  //       if (event.lengthComputable) {
  //         const percent = (event.loaded / event.total) * 100;
  //         console.log(`File read progress: ${percent.toFixed(2)}%`);
  //       }
  //     };
  //   });
  // };

  const uploadHandler = (acceptedFiles: File[]): Promise<string>[] => {
    return acceptedFiles.map((file) => {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const formData = new FormData();
          formData.append("userName", userName);
          formData.append("file", file);

          toast.promise(
            await axios.post(
              "http://localhost:8080/api/files/upload",
              formData,
              {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                  if (progressEvent.lengthComputable && progressEvent.total) {
                    console.log(
                      `File: ${file.name} ${Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      )} % uploaded`
                    );
                  }
                },
              }
            ),
            {
              loading: `Uploading ${file.name}...`,
              success: () => {
                return `Successfully uploaded ${file.name}!`;
              },
              error: (err) => {
                return `Failed to upload ${file.name}: ${
                  err.response?.data?.message || err.message
                }`;
              },
            }
          );

          resolve(`File ${file.name} uploaded`);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const fileUploadPromises = uploadHandler(acceptedFiles);
    try {
      await Promise.all(fileUploadPromises);
    } catch (error) {
      toast.error(
        "Error uploading files\n" +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      refreshTableData();
    }
  };

  return (
    <div className="p-8 m-auto h-15">
      <Toaster position="bottom-right" invert={false} />
      <Dropzone
        minSize={0}
        maxSize={maxFileSizeBytes}
        maxFiles={maxFileCount}
        onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          fileRejections,
        }) => {
          const isFileTooLarge = fileRejections.some(
            (files) => files.file.size > maxFileSizeBytes
          );
          const isTooManyFiles = fileRejections.length > maxFileCount;
          return (
            <section className="w-full">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer 
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-200 animate-pulse"
                  : "border-gray-300"
              }
              ${isDragReject ? "border-red-t00 bg-red-50" : ""}
              `}
              >
                <input {...getInputProps()} />
                {!isDragActive && (
                  <p className="text-gray-600">
                    Drag & drop some files here, or click to select files
                  </p>
                )}
                {isDragActive && !isDragReject && (
                  <p className="text-blue-500">Drop to upload file</p>
                )}
                {isDragReject && (
                  <p className="text-red-500">
                    File type not accepted / Too many files
                  </p>
                )}
                {isFileTooLarge && (
                  <p className="text-red-500">
                    File size too large (max size: 5MB)
                  </p>
                )}
                {isTooManyFiles && (
                  <p className="text-red-500">Too many files</p>
                )}
              </div>
            </section>
          );
        }}
      </Dropzone>
    </div>
  );
}

export default DropComponent;
