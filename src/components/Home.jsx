const helpdeskInfo = {
  email: "helpdesk@college.edu",
  phone: "+91 98765 43210",
  location: "Administrative Block, Room 104, Main Campus",
  hours: "Mon–Fri, 9:00 AM – 5:00 PM",
};

const featureCards = [
  {
    id: "faculty",
    icon: "👩‍🏫",
    title: "Faculty Directory",
    text: "Search faculty and HODs by name, subject or department.",
  },
  {
    id: "subjects",
    icon: "📚",
    title: "Subjects",
    text: "Look up subject names and codes for every department.",
  },
  {
    id: "timetable",
    icon: "🗓️",
    title: "Timetable",
    text: "See your weekly class schedule at a glance.",
  },
  {
    id: "notices",
    icon: "📢",
    title: "Notices",
    text: "Stay updated with exams, events and announcements.",
  },
];

function Home({ onNavigate }) {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Everything you need, in one place.</h1>

          <p>
            Find faculty, subjects, timetables, notices and campus information
            quickly with CampusConnect.
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("faculty")}
            >
              Find Faculty
            </button>

            <button
              className="btn btn-outline"
              onClick={() => onNavigate("notices")}
            >
              View Notices
            </button>
          </div>
        </div>

        <aside className="info-card" aria-label="Helpdesk information">
          <h2>Campus Helpdesk</h2>

          <p className="info-row">
            <span>📍</span> {helpdeskInfo.location}
          </p>

          <p className="info-row">
            <span>🕘</span> {helpdeskInfo.hours}
          </p>

          <p className="info-row">
            <span>✉️</span> {helpdeskInfo.email}
          </p>

          <p className="info-row">
            <span>📞</span> {helpdeskInfo.phone}
          </p>

          <button
            className="btn btn-primary btn-block"
            onClick={() => onNavigate("help")}
          >
            Contact Helpdesk
          </button>
        </aside>
      </section>

      <section aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="section-title">
          Explore CampusConnect
        </h2>

        <div className="grid grid-4">
          {featureCards.map((card) => (
            <button
              key={card.id}
              className="feature-card"
              onClick={() => onNavigate(card.id)}
            >
              <span className="feature-icon" aria-hidden="true">
                {card.icon}
              </span>

              <h3>{card.title}</h3>

              <p>{card.text}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;