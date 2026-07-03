import AppRoutes from "./routes";

import ScrollToTop from "./components/common/ScrollToTop";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import CompareBar from "./components/business/CompareBar";
import ChatBot from "./components/chat/ChatBot";

const App = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      <ScrollToTop />
      <Navbar/>

      <main>
        <AppRoutes/>
      </main>

      <Footer/>
      <CompareBar />
      <ChatBot />
    </div>
  );
};

export default App;
