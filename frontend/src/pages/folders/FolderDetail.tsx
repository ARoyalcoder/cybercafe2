import {
  useEffect,
  useState,
} from "react";
import {
  FileText,
  Eye,
  Calendar,
} from "lucide-react";
import {
  useParams,
} from "react-router-dom";

import DashboardLayout
  from "../../layouts/DashboardLayout";

import {
  getFolderDetails,
} from "../../api/folderApi";
import Loader from "../../components/Loader/Loader";

export default function FolderDetails() {
  const { id } =
    useParams();
  const [
    setPreviewFile,
  ] = useState<any>(null);


  const [data, setData] =
    useState<any>(null);
  // const handlePrint = (
  //   url: string
  // ) => {
  //   const printWindow =
  //     window.open(
  //       url,
  //       "_blank"
  //     );

  //   printWindow?.addEventListener(
  //     "load",
  //     () => {
  //       printWindow.print();
  //     }
  //   );
  // };


  useEffect(() => {
    if (!id) return;

    getFolderDetails(id)
      .then(setData)
      .catch(console.error);

  }, [id]);

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center ">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

const handleDownload = (
  fileId: string,
  fileName: string
) => {
  const link =
    document.createElement("a");

  link.href =
    `${import.meta.env.VITE_API_URL}/files/download/${fileId}`;

  link.setAttribute(
    "download",
    fileName
  );

  document.body.appendChild(link);

  link.click();

  link.remove();
};
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">
          {data.folder.folderName}
        </h1>

        <p className="mt-2">
          Customer:
          {" "}
          {
            data.folder
              .customerName
          }
        </p>

        <p>
          Total Files:
          {" "}
          {
            data.files.length
          }
        </p>

        <p>
          Upload Date:
          {" "}
          {new Date(
            data.folder.createdAt
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Documents
        </h2>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.files.map((file: any) => (
              <div
                key={file._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* File Preview Area */}
                <div className="h-40 bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <FileText
                    size={60}
                    className="text-blue-600"
                  />
                </div>

                {/* File Details */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {file.fileName}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {file.createdAt
                          ? new Date(
                            file.createdAt
                          ).toLocaleDateString()
                          : "Recently Uploaded"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400">
                      ID: {file._id.slice(-8)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() =>
                        setPreviewFile(file)
                      }
                      className="
                              flex-1
                              flex
                              items-center
                              justify-center
                              gap-2
                              bg-blue-600
                              text-white
                              py-2.5
          f                    rounded-xl
                              font-medium
                              hover:bg-blue-700
                              transition
                            "
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <a
                      href={file.fileUrl}
                      download
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-medium  transition"
                    >
                      <button
                        onClick={() =>
                          handleDownload(
                            file.fileUrl,
                            file.fileName
                          )
                        }
                        className="
                                    px-3
                                    py-2
                                   
                                    text-white
                                    rounded-lg 
                                  "
                      >
                        Download
                      </button>

                    </a>

                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}