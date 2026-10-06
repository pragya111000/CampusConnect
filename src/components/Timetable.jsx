import StatusMessage from "./StatusMessage.jsx";
import useFetch from "../useFetch.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable() {
  const { data: timetable, loading, error, reload } = useFetch("/api/timetable");

  return (
    <section aria-labelledby="timetable-heading">
      <h1 id="timetable-heading" className="page-title">
        Weekly Timetable
      </h1>

      <p className="page-subtitle">
        Your class schedule from Monday to Friday.
      </p>

      <StatusMessage
        loading={loading}
        error={error}
        onRetry={reload}
        loadingText="Loading timetable..."
      />

      {!loading && !error && timetable.length === 0 && (
        <div className="empty-state">
          <p>🗓️ No timetable has been added yet.</p>
        </div>
      )}

      <div className="table-wrapper" hidden={loading || !!error || timetable.length === 0}>
        <table className="timetable">
          <thead>
            <tr>
              <th scope="col">Time</th>

              {days.map((day) => (
                <th key={day} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {timetable.map((row) => (
              <tr
                key={row.time}
                className={
                  row.Monday === "Lunch Break" ? "break-row" : ""
                }
              >
                <th scope="row" data-label="Time">
                  {row.time}
                </th>

                {days.map((day) => (
                  <td key={day} data-label={day}>
                    {row[day]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Timetable;