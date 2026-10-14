"use client";
import { useRef, useState } from "react";
import { Icon } from "./icon";
type Fields = "name" | "email" | "company" | "service" | "details";
const labels = {
  name: "Name",
  email: "Email",
  company: "Company",
  service: "Service of interest",
  details: "Project details",
};
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const next: Partial<Record<Fields, string>> = {};
    if (String(data.name).trim().length < 2)
      next.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim()))
      next.email = "Please enter a valid email address.";
    if (!data.service)
      next.service = "Please choose a service, or Not Sure Yet.";
    if (String(data.details).trim().length < 20)
      next.details = "Tell us a little more (at least 20 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("idle");
      setMessage("");
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your message could not be sent. Please try again.",
        );
      setStatus("success");
      setMessage(
        "Your message has been sent. Thank you for telling us about your project.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The request timed out. Your details have been kept; please try again.",
      );
    }
  }
  function fieldProps(name: Fields) {
    return {
      id: `contact-${name}`,
      name,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `error-${name}` : undefined,
      onChange: () => {
        if (errors[name])
          setErrors((current) => ({ ...current, [name]: undefined }));
      },
    };
  }
  function error(name: Fields) {
    return (
      errors[name] && (
        <span className="field-error" id={`error-${name}`}>
          {errors[name]}
        </span>
      )
    );
  }
  return (
    <form
      className="contact-form"
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-busy={status === "loading"}
    >
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">
            {labels.name} <span>*</span>
          </label>
          <input
            {...fieldProps("name")}
            placeholder="Your name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="contact-email">
            {labels.email} <span>*</span>
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            maxLength={254}
          />
          {error("email")}
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-company">
            {labels.company} <span className="optional">(optional)</span>
          </label>
          <input
            {...fieldProps("company")}
            placeholder="Company name"
            autoComplete="organization"
            maxLength={150}
          />
          {error("company")}
        </div>
        <div className="field">
          <label htmlFor="contact-service">
            {labels.service} <span>*</span>
          </label>
          <select {...fieldProps("service")} defaultValue="" required>
            <option value="" disabled>
              Select a service
            </option>
            <option>Website</option>
            <option>Web Application</option>
            <option>AI Automation</option>
            <option>Not Sure Yet</option>
          </select>
          {error("service")}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-details">
          {labels.details} <span>*</span>
        </label>
        <textarea
          {...fieldProps("details")}
          rows={5}
          placeholder="What are you building, improving, or looking to automate?"
          required
          minLength={20}
          maxLength={5000}
        />
        {error("details")}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-bottom">
        <p>Good projects start with a conversation.</p>
        <button
          type="submit"
          className="button button-violet"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Start a Conversation"}
          <Icon name="external" />
        </button>
      </div>
      <div
        className={`form-status ${status}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
    </form>
  );
}
