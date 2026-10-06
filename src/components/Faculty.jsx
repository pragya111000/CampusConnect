import { useState } from "react";
import SearchFilter from "./SearchFilter.jsx";
import StatusMessage from "./StatusMessage.jsx";
import useFetch from "../useFetch.js";

function Faculty() {
  // useFetch loads the faculty list and tells us if it is loading or failed.
  const { data: facultyList, loading, error, reload } = useFetch("/api/faculty");
  const [searchText, setSearchText] = useState("");
  const [department, setDepartment] = useState("All");

  const clearFilters = () => {
    setSearchText("");
    setDepartment("All");
  };

  const query = searchText.trim().toLowerCase();

  // Keep a faculty member only if BOTH the search and the department match.
  // The search text can match the name, the subject OR the department name.
  const filteredFaculty = facultyList.filter((person) => {
    const matchesSearch =
      (person.name || "").toLowerCase().includes(query) ||
      (person.subject || "").toLowerCase().includes(query) ||
      (person.department || "").toLowerCase().includes(query);

    const matchesDepartment =
      department === "All" || person.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <section aria-labelledby="faculty-heading">
      <h1 id="faculty-heading" className="page-title">
        Faculty Directory
      </h1>

      <p className="page-subtitle">
        Search by faculty name, subject or department, and filter by department.
      </p>

      <SearchFilter
        idPrefix="faculty"
        placeholder="e.g. Anjali, Machine Learning or AIML"
        searchText={searchText}
        onSearchChange={setSearchText}
        department={department}
        onDepartmentChange={setDepartment}
        onClear={clearFilters}
      />

      <StatusMessage
        loading={loading}
        error={error}
        onRetry={reload}
        loadingText="Loading faculty..."
      />

      {!loading && !error && (
        <p className="result-count">
          Showing {filteredFaculty.length} of {facultyList.length} faculty
        </p>
      )}

      {loading || error ? null : filteredFaculty.length === 0 ? (
        <div className="empty-state">
          <p>😕 No faculty found. Try a different name, subject or department.</p>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredFaculty.map((person) => (
            <article key={person.id} className="card faculty-card">
              <div className="avatar" aria-hidden="true">
                {person.name
                  .replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s*/, "")
                  .charAt(0)}
              </div>

              <h3>{person.name}</h3>

              <div className="tag-row">
                <span className="badge">{person.department}</span>

                <span
                  className={
                    person.role === "HOD"
                      ? "badge badge-hod"
                      : "badge badge-muted"
                  }
                >
                  {person.role}
                </span>
              </div>

              <p className="card-detail">
                <strong>Subject:</strong> {person.subject}
              </p>

              <a
                className="card-link"
                href={`mailto:${person.email}`}
              >
                {person.email}
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Faculty;