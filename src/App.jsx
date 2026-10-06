import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Faculty from "./components/Faculty.jsx";
import Subjects from "./components/Subjects.jsx";
import Timetable from "./components/Timetable.jsx";
import Notices from "./components/Notices.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import AIAssistant from "./components/AIAssistant.jsx";

function App() {
  // The whole app is controlled by this one state value.
  const [activeSection, setActiveSection] = useState("home");

  const handleNavigate = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="main-content">
        {activeSection === "home" && <Home onNavigate={handleNavigate} />}
        {activeSection === "faculty" && <Faculty />}
        {activeSection === "subjects" && <Subjects />}
        {activeSection === "timetable" && <Timetable />}
        {activeSection === "notices" && <Notices />}
        {activeSection === "faq" && <FAQ />}
        {activeSection === "help" && <Contact />}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Floating chat button: placed here so it shows on every page */}
      <AIAssistant />
    </div>
  );
}

export default App;
