import { useState } from "react";
import StatusMessage from "./StatusMessage.jsx";
import useFetch from "../useFetch.js";

const noticeCategories = [
  "All",
  "Academic",
  "Event",
  "General",
  "Examination",
];

// How many of the newest notices get the "Latest" label.
const LATEST_COUNT = 3;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Turn the date from the server into YYYY-MM-DD for the <time> tag.
function toIsoDate(dateString) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function Notices() {
  const { data: noticeList, loading, error, reload } = useFetch("/api/notices");
  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Newest first (the backend already sorts this way, we sort again to be safe).
  const sortedNotices = [...noticeList].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // The ids of the newest notices, taken from the FULL list,
  // so a notice keeps its "Latest" label even when filters are used.
  const latestIds = sortedNotices.slice(0, LATEST_COUNT).map((n) => n.id);

  const query = searchText.trim().toLowerCase();

  const visibleNotices = sortedNotices.filter((notice) => {
    const matchesCategory = category === "All" || notice.category === category;

    const matchesSearch =
      (notice.title || "").toLowerCase().includes(query) ||
      (notice.description || "").toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setCategory("All");
    setSearchText("");
  };

  const filtersActive = category !== "All" || searchText !== "";

  return (
    <section aria-labelledby="notices-heading">
      <h1 id="notices-heading" className="page-title">
        College Notices
      </h1>

      <p className="page-subtitle">
        The latest announcements from the college.
      </p>

      <div className="filter-bar">
        <div className="field">
          <label htmlFor="notices-search">Search notices</label>

          <input
            id="notices-search"
            type="search"
            placeholder="e.g. exam, fest or holiday"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        {filtersActive && (
          <button
            type="button"
            className="btn btn-outline btn-clear"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>

      <div
        className="chip-row"
        role="group"
        aria-label="Filter notices by category"
      >
        {noticeCategories.map((item) => (
          <button
            key={item}
            className={category === item ? "chip chip-active" : "chip"}
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>

      <StatusMessage
        loading={loading}
        error={error}
        onRetry={reload}
        loadingText="Loading notices..."
      />

      {!loading && !error && (
        <p className="result-count">
          Showing {visibleNotices.length} of {noticeList.length} notices
        </p>
      )}

      {loading || error ? null : visibleNotices.length === 0 ? (
        <div className="empty-state">
          <p>😕 No notices found. Try a different word or category.</p>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="notice-list">
          {visibleNotices.map((notice) => (
            <article
              key={notice.id}
              className={
                latestIds.includes(notice.id)
                  ? "card notice-card notice-latest"
                  : "card notice-card"
              }
            >
              <div className="notice-meta">
                <span
                  className={`badge badge-${(notice.category || "general").toLowerCase()}`}
                >
                  {notice.category}
                </span>

                <time dateTime={toIsoDate(notice.date)}>
                  {formatDate(notice.date)}
                </time>

                {latestIds.includes(notice.id) && (
                  <span className="badge badge-latest">🆕 Latest</span>
                )}
              </div>

              <h3>{notice.title}</h3>

              <p>{notice.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Notices;
