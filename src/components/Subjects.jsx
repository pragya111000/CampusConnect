import { useState } from "react";
import SearchFilter from "./SearchFilter.jsx";
import StatusMessage from "./StatusMessage.jsx";
import useFetch from "../useFetch.js";

function Subjects() {
  const { data: subjectList, loading, error, reload } = useFetch("/api/subjects");
  const [searchText, setSearchText] = useState("");
  const [department, setDepartment] = useState("All");

  const clearFilters = () => {
    setSearchText("");
    setDepartment("All");
  };

  const query = searchText.trim().toLowerCase();

  const filteredSubjects = subjectList.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query);

    const matchesDepartment =
      department === "All" || subject.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <section aria-labelledby="subjects-heading">
      <h1 id="subjects-heading" className="page-title">
        Subject Directory
      </h1>

      <p className="page-subtitle">
        Search by subject name or code, and filter by department.
      </p>

      <SearchFilter
        idPrefix="subjects"
        placeholder="e.g. Deep Learning or CSE201"
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
        loadingText="Loading subjects..."
      />

      {!loading && !error && (
        <p className="result-count">
          Showing {filteredSubjects.length} of {subjectList.length} subjects
        </p>
      )}

      {loading || error ? null : filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <p>
            😕 No subjects found. Try a different name, code or department.
          </p>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredSubjects.map((subject) => (
            <article key={subject.id} className="card">
              <span className="badge">{subject.department}</span>
              <h3 className="subject-name">{subject.name}</h3>
              <p className="subject-code">{subject.code}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Subjects;