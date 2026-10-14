import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, deliverContact } from "../lib/contact.mjs";
const valid = {
  name: "Test Person",
  email: "person@example.com",
  company: "Example",
  service: "Website",
  details: "We need a responsive website for our business.",
  website: "",
};
test("contact rejects invalid email, unknown services, bots and overlong input", () => {
  for (const body of [
    null,
    [],
    { ...valid, email: "bad" },
    { ...valid, email: "person@example.com\nBcc:other@example.com" },
    { ...valid, service: "Unknown" },
    { ...valid, website: "spam" },
    { ...valid, details: "short" },
    { ...valid, name: "x".repeat(101) },
    { ...valid, name: 3 },
  ])
    assert.ok(validateContact(body).error);
  assert.equal(validateContact(valid).data.email, valid.email);
});
test("unconfigured contact does not call a provider or report success", async () => {
  const result = await deliverContact(valid, {}, () => {
    throw new Error("Must not call provider");
  });
  assert.equal(result.status, 503);
  assert.equal(result.success, undefined);
});
test("contact reports success only after provider acceptance", async () => {
  const config = {
    key: "test",
    from: "sender@example.com",
    to: "inbox@example.com",
  };
  const accepted = await deliverContact(valid, config, async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    const payload = JSON.parse(options.body);
    assert.equal(payload.reply_to, valid.email);
    assert.match(payload.text, /responsive website/);
    return Response.json({ id: "provider-message" });
  });
  assert.equal(accepted.success, true);
  for (const fetcher of [
    async () => Response.json({ error: "rejected" }, { status: 422 }),
    async () => Response.json({}),
    async () => {
      throw new Error("Offline");
    },
  ]) {
    const failure = await deliverContact(valid, config, fetcher);
    assert.equal(failure.status, 502);
    assert.equal(failure.success, undefined);
  }
});
