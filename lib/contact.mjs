export const allowedServices = [
  "Website",
  "Web Application",
  "AI Automation",
  "Not Sure Yet",
];
export function validateContact(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { error: "Please send a valid project enquiry." };
  const limits = {
    name: 100,
    email: 254,
    company: 150,
    service: 40,
    details: 5000,
    website: 200,
  };
  const data = {};
  for (const [field, limit] of Object.entries(limits)) {
    const value = body[field] ?? "";
    if (typeof value !== "string" || value.length > limit)
      return { error: `Please check the ${field} field.` };
    data[field] = value.trim();
  }
  if (data.website) return { error: "Your message could not be accepted." };
  if (data.name.length < 2) return { error: "Please enter your name." };
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    /[\r\n]/.test(data.email)
  )
    return { error: "Please enter a valid email address." };
  if (!allowedServices.includes(data.service))
    return { error: "Please select a service." };
  if (data.details.length < 20)
    return {
      error: "Please include at least 20 characters of project details.",
    };
  return { data };
}
export async function deliverContact(data, config, fetcher = fetch) {
  if (!config.key || !config.from || !config.to)
    return {
      status: 503,
      error:
        "This form is not accepting messages yet. Your details have been kept; please try again later.",
    };
  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: data.email,
        subject: `Goodwork enquiry: ${data.service}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "Not provided"}\nService: ${data.service}\n\n${data.details}`,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.id)
      return {
        status: 502,
        error:
          "Your message could not be sent. Your details have been kept; please try again later.",
      };
    return { status: 200, success: true };
  } catch {
    return {
      status: 502,
      error:
        "We could not reach the email service. Your details have been kept; please try again later.",
    };
  }
}
