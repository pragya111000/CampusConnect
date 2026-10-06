import { useState } from "react";
import { apiPost } from "../api.js";

// The same list is checked again on the server (backend/app.py).
const categories = [
  "Academic",
  "Examination",
  "Fees",
  "Library",
  "Technical",
  "Other",
];

const emptyForm = {
  name: "",
  email: "",
  category: "",
  query: "",
};

const helpdeskInfo = {
  email: "helpdesk@college.edu",
  phone: "+91 98765 43210",
  location: "Administrative Block, Room 104, Main Campus",
  hours: "Mon–Fri, 9:00 AM – 5:00 PM",
};

function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // typing again removes the old messages
    setSubmitted(false);
    setSubmitError("");

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name =
        "Please enter your name (at least 2 characters).";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!categories.includes(formData.category)) {
      newErrors.category = "Please choose a category.";
    }

    if (formData.query.trim().length < 10) {
      newErrors.query =
        "Please describe your query in at least 10 characters.";
    }

    return newErrors;
  };

  const handleClear = () => {
    setFormData(emptyForm);
    setErrors({});
    setSubmitted(false);
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(false);
    setSubmitError("");

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return;
    }

    setSubmitting(true);

    try {
      // The Flask backend saves the query in the MySQL database.
      await apiPost("/api/helpdesk", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        query: formData.query.trim(),
      });

      setSubmitted(true);
      setFormData(emptyForm);
      setErrors({});
    } catch (error) {
      console.error("Error submitting query:", error);

      // If the server found a problem with a field, show it next to that field.
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setErrors(error.fieldErrors);
      }

      // "Failed to fetch" means the browser could not reach the server at all.
      setSubmitError(
        error instanceof TypeError
          ? "Could not reach the server. Please check that the backend is running and try again."
          : error.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="help-heading">
      <h1 id="help-heading" className="page-title">
        Help & Contact
      </h1>

      <p className="page-subtitle">
        Need help? Reach the helpdesk or send us your query.
      </p>

      <div className="contact-layout">
        <div className="card contact-info">
          <h2>Helpdesk Details</h2>

          <p className="info-row">
            <span>✉️</span> {helpdeskInfo.email}
          </p>

          <p className="info-row">
            <span>📞</span> {helpdeskInfo.phone}
          </p>

          <p className="info-row">
            <span>📍</span> {helpdeskInfo.location}
          </p>

          <p className="info-row">
            <span>🕘</span> {helpdeskInfo.hours}
          </p>
        </div>

        <form
          className="card contact-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Send a Query</h2>

          {submitted && (
            <p className="success-message" role="status">
              ✅ Thank you! Your query has been received. The helpdesk will get back to you soon.
            </p>
          )}

          {submitError && (
            <p className="error-message" role="alert">
              ⚠️ {submitError}
            </p>
          )}

          <div className="field">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />

            {errors.name && (
              <span id="name-error" className="error-text">
                {errors.name}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <span id="email-error" className="error-text">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="category">Query category</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              aria-invalid={errors.category ? "true" : "false"}
              aria-describedby={errors.category ? "category-error" : undefined}
            >
              <option value="">Select a category</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {errors.category && (
              <span id="category-error" className="error-text">
                {errors.category}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="query">Message</label>

            <textarea
              id="query"
              name="query"
              rows="4"
              value={formData.query}
              onChange={handleChange}
              aria-invalid={errors.query ? "true" : "false"}
              aria-describedby={errors.query ? "query-error" : undefined}
            />

            {errors.query && (
              <span id="query-error" className="error-text">
                {errors.query}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Query"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClear}
              disabled={submitting}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
