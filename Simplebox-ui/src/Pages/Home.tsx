import DropComponent from "../components/Dropzone";
import "../App.css";
import FileTable from "@/components/Table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Hamburger from "@/components/Hamburger";

function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const FileManager = () => {
    return (
      <div className="flex flex-col items-right justify-between">
        <FileTable refreshTrigger={refreshKey} />
        <Button
          onClick={() => {
            localStorage.removeItem("cachedFiles");
            console.log(refreshKey);
            setRefreshKey((prev) => prev + 1);
          }}
        >
          Refresh Files
        </Button>
      </div>
    );
  };

  const refreshTableData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main>
      <title>Simplebox</title>
      <div className="min-h-screen bg-gray-100 flex flex-col gap-10">
        <Hamburger />
        <div className="container m-auto py-8 h-40">
          <DropComponent refreshTableData={refreshTableData} />
        </div>
        <div className="container mx-auto py-8">
          <FileManager />
        </div>
      </div>
    </main>
  );
}

export default Home;
