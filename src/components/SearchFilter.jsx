import { useEffect, useState } from "react";
import { apiGet } from "../api.js";

// Reusable search box + department dropdown.
function SearchFilter({
  idPrefix,
  placeholder,
  searchText,
  onSearchChange,
  department,
  onDepartmentChange,
  onClear,
}) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    apiGet("/api/departments")
      .then((data) => {
        setDepartments(data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  return (
    <div className="filter-bar">
      <div className="field">
        <label htmlFor={`${idPrefix}-search`}>
          Search
        </label>

        <input
          id={`${idPrefix}-search`}
          type="search"
          placeholder={placeholder}
          value={searchText}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      </div>

      <div className="field">
        <label htmlFor={`${idPrefix}-department`}>
          Department
        </label>

        <select
          id={`${idPrefix}-department`}
          value={department}
          onChange={(event) =>
            onDepartmentChange(event.target.value)
          }
        >
          <option value="All">
            All Departments
          </option>

          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {onClear && (searchText !== "" || department !== "All") && (
        <button
          type="button"
          className="btn btn-outline btn-clear"
          onClick={onClear}
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchFilter;