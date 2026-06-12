# Contact Form — Azure Setup Guide (for Adam)

The Hidden Lakes contact form posts to a small serverless API that already lives in
this repo at `/api/contact`. On each submission it **(1) saves the lead to Azure
Table Storage, then (2) emails it via Azure Communication Services (ACS)**. Because
it saves first, a lead is never lost even if the email send fails. If the whole API
is ever unreachable, the website shows a "email us directly" fallback — so no lead
is ever a dead end.

The code is done. It just needs Azure resources + 4 settings. ~20–30 minutes, one
time. Everything below happens in **Adam's Azure account** (Tiffany/the assistant
can't do this part — it needs your Azure login).

---

## What you'll end up with
- A **Storage account** (holds every submission in a table).
- An **Azure Communication Services** resource + **Email** (sends the notification).
- **4 settings** added to the existing Static Web App so the code can find them.

---

## STEP 1 — Storage account (saves the leads)

1. Azure Portal → search **Storage accounts** → **+ Create**.
2. Resource group: reuse one or create `hidden-lakes`. Name: e.g. `hiddenlakesstore`
   (lowercase, must be globally unique). Region: pick close (e.g. Central US).
   Redundancy: **LRS** is fine. Create it.
3. When deployed → open it → left menu **Security + networking → Access keys**.
4. Click **Show** on key1 → copy the **Connection string**. Save it for Step 3.
   (A table named `ContactSubmissions` is created automatically on the first submit.)

## STEP 2 — Communication Services + Email (sends the email)

1. Portal → search **Communication Services** → **+ Create** → same resource group →
   name e.g. `hidden-lakes-comm` → Data location: United States → Create.
2. Portal → search **Email Communication Services** → **+ Create** → name e.g.
   `hidden-lakes-email` → Create.
3. Open that Email resource → **Provision domains** → **+ Add domain** →
   **Add free Azure subdomain** (this needs no DNS). Wait for it to finish; it
   creates a sender like `donotreply@<random>.azurecomm.net`. Copy that **MailFrom
   address** for Step 3.
4. Connect the email to the Communication Service: open the **Communication
   Services** resource (`hidden-lakes-comm`) → **Email → Domains** → **Connect
   domain** → pick the subdomain you just made.
5. In `hidden-lakes-comm` → **Settings → Keys** → copy the **Connection string**.
   Save it for Step 3.

## STEP 3 — Add the 4 settings to the Static Web App

1. Portal → open the Static Web App (the Hidden Lakes site,
   `nice-cliff-065e4d50f`).
2. Left menu → **Settings → Configuration** (a.k.a. Environment variables /
   Application settings).
3. Add these four (Name must match exactly), then **Save**:

   | Name | Value |
   |------|-------|
   | `AZURE_STORAGE_CONNECTION_STRING` | the Storage connection string from Step 1 |
   | `ACS_CONNECTION_STRING` | the Communication Services connection string from Step 2.5 |
   | `ACS_SENDER_ADDRESS` | the `donotreply@<random>.azurecomm.net` from Step 2.3 |
   | `CONTACT_RECIPIENT` | `hiddenlakesia@gmail.com` |

## STEP 4 — Make sure the API actually deployed

The form needs the `/api` function deployed. The workflow
`.github/workflows/azure-static-web-apps-nice-cliff-065e4d50f.yml` builds it
(`api_location: "api"`).

- There is a **second, redundant** workflow `azure-static-web-apps.yml` that does
  NOT build the API. If it's active it can deploy a version without the function.
  **Recommendation: delete `azure-static-web-apps.yml`** (or tell the assistant to).
  Keep only the `nice-cliff` one.
- After saving the settings in Step 3, trigger a fresh deploy (any push, or
  re-run the latest GitHub Action) so the function picks up the new settings.

## STEP 5 — Test it

1. Open the live site, fill out the contact form, submit.
2. You should see "Thank you! We've received your message…".
3. Check `hiddenlakesia@gmail.com` for the email.
4. Confirm the saved row: Storage account → **Storage browser → Tables →
   ContactSubmissions**.

If the email doesn't arrive but the row IS saved → the lead is safe; re-check the
ACS settings/sender. If neither happens → the API settings names are likely off, or
the API didn't deploy (Step 4).

---

## Cost
- Table Storage: pennies/month at this volume.
- ACS Email: pay-per-email, fractions of a cent each. No monthly subscription.

## Need a hand?
The assistant can: remove the redundant workflow, re-trigger a deploy, and run a
live test submission once the 4 settings are in. If Adam wants, the assistant can
also walk through these portal steps interactively on screen.
