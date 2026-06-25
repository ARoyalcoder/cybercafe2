import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="flex">
        {/* Sidebar */}

        <Sidebar />

        {/* Content Area */}

        <div className="flex flex-1 flex-col min-h-screen lg:ml-72">
          {/* Navbar */}

          <div
            className="
              sticky
              top-0
              z-40
              border-b
              border-white/10
              bg-[#030712]/80
              backdrop-blur-xl
            "
          >
            <Navbar />
          </div>

          {/* Main Content */}

          <main
            className="
              flex-1
              p-4
              md:p-6
              lg:p-8
            "
          >
            <div className="max-w-400 mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}