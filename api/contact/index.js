/**
 * Hidden Lakes — Contact form handler (Azure Static Web Apps managed API)
 *
 * Reliability design: a submission is STORED FIRST (Azure Table Storage), THEN
 * emailed (Azure Communication Services). If email fails, the lead is still saved
 * and the request still succeeds — so a lead is never lost. If storage isn't
 * configured but email works (or vice-versa), it still counts as a success.
 *
 * Required app settings (set in the Static Web App → Configuration):
 *   AZURE_STORAGE_CONNECTION_STRING   connection string for the storage account
 *   ACS_CONNECTION_STRING             Azure Communication Services connection string
 *   ACS_SENDER_ADDRESS                verified sender, e.g. donotreply@<guid>.azurecomm.net
 *   CONTACT_RECIPIENT                 where leads are emailed (default hiddenlakesia@gmail.com)
 */

module.exports = async function (context, req) {
  // Parse body (SWA may deliver it as an object or a JSON string)
  let data = req.body || {};
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }

  const clean = (v) => (v == null ? "" : String(v)).trim();

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (clean(data._gotcha)) {
    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: { ok: true } };
    return;
  }

  const firstName = clean(data.firstName);
  const lastName  = clean(data.lastName);
  const email     = clean(data.email);
  const phone     = clean(data.phone);
  const interest  = clean(data.interest);
  const lotInterest = clean(data.lotInterest);
  const message   = clean(data.message);
  const updates   = data.updates ? "Yes" : "No";

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!firstName || !lastName || !emailOk) {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { ok: false, error: "Please provide first name, last name, and a valid email." }
    };
    return;
  }

  const submittedAt = new Date().toISOString();
  const record = { firstName, lastName, email, phone, interest, lotInterest, message, updates, submittedAt };

  let stored = false;
  let emailed = false;
  const errors = [];

  // 1) STORE FIRST — durability so no lead is ever lost
  const storageConn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (storageConn) {
    try {
      const { TableClient } = require("@azure/data-tables");
      const table = TableClient.fromConnectionString(storageConn, "ContactSubmissions");
      try { await table.createTable(); } catch (e) { /* table already exists */ }
      const rowKey = submittedAt.replace(/[:.]/g, "-") + "-" + Math.random().toString(36).slice(2, 8);
      await table.createEntity({ partitionKey: submittedAt.slice(0, 10), rowKey, ...record });
      stored = true;
    } catch (e) {
      errors.push("store: " + e.message);
      context.log.error("Storage write failed", e);
    }
  } else {
    errors.push("store: not configured");
  }

  // 2) EMAIL via Azure Communication Services
  const acsConn   = process.env.ACS_CONNECTION_STRING;
  const sender    = process.env.ACS_SENDER_ADDRESS;
  const recipient = process.env.CONTACT_RECIPIENT || "hiddenlakesia@gmail.com";
  if (acsConn && sender) {
    try {
      const { EmailClient } = require("@azure/communication-email");
      const client = new EmailClient(acsConn);
      const subject = `New Hidden Lakes inquiry — ${firstName} ${lastName}`;
      const plainText = [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || "-"}`,
        `Interested in: ${interest || "-"}`,
        `Lot: ${lotInterest || "-"}`,
        `Wants updates: ${updates}`,
        ``,
        `Message:`,
        message || "(none)",
        ``,
        `Submitted: ${submittedAt}`
      ].join("\n");

      const poller = await client.beginSend({
        senderAddress: sender,
        content: { subject, plainText },
        recipients: { to: [{ address: recipient }] },
        replyTo: [{ address: email, displayName: `${firstName} ${lastName}` }]
      });
      await poller.pollUntilDone();
      emailed = true;
    } catch (e) {
      errors.push("email: " + e.message);
      context.log.error("Email send failed", e);
    }
  } else {
    errors.push("email: not configured");
  }

  if (stored || emailed) {
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { ok: true, stored, emailed }
    };
  } else {
    // Nothing worked — tell the client so it can show the email fallback
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { ok: false, stored, emailed, errors }
    };
  }
};
