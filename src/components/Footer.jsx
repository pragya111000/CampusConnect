const footerLinks = [
  { id: "faculty", label: "Faculty" },
  { id: "subjects", label: "Subjects" },
  { id: "notices", label: "Notices" },
  { id: "help", label: "Help" },
];

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>© 2026 CampusConnect | College Helpdesk Portal</p>
        <ul className="footer-links">
          {footerLinks.map((link) => (
            <li key={link.id}>
              <button onClick={() => onNavigate(link.id)}>{link.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
