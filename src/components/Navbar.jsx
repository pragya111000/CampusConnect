import { useState } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "faculty", label: "Faculty" },
  { id: "subjects", label: "Subjects" },
  { id: "timetable", label: "Timetable" },
  { id: "notices", label: "Notices" },
  { id: "faq", label: "FAQ" },
  { id: "help", label: "Help" },
];

function Navbar({ activeSection, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (sectionId) => {
    onNavigate(sectionId);
    setMenuOpen(false); // close the mobile menu after choosing a page
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Main navigation">
        <button className="logo" onClick={() => handleClick("home")}>
          🎓 CampusConnect
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={activeSection === item.id ? "nav-link active" : "nav-link"}
                onClick={() => handleClick(item.id)}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
