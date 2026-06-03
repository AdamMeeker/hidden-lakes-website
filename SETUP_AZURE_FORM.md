# Contact Form — Azure Setup (for Adam)

The website's contact form now posts to a built-in Azure Static Web Apps API
(`/api/contact`). On each submission the function **stores the lead in Azure Table
Storage first, then emails it via Azure Communication Services (ACS)**. If email
ever fails, the lead is still saved and the visitor still sees success. If the whole
API is down, the page shows a "email us directly" fallback — so no lead is lost.

The code is already in the repo (`/api`). It just needs Azure resources + four
app settings. ~20–30 min, one-time.

## What to provision in Azure

1. **Storage account** (or reuse an existing one)
   - Create a Storage account (Standard, LRS is fine).
   - Copy its **connection string** (Access keys → Connection string).
   - A table named `ContactSubmissions` is created automatically on first submit.

2. **Azure Communication Services (ACS) + Email**
   - Create a **Communication Services** resource.
   - Create an **Email Communication Services** resource and add a domain:
     - Quickest: use the **Azure-managed domain** (gives a sender like
       `donotreply@<guid>.azurecomm.net`). No DNS needed.
     - Later/optional: connect a custom domain (e.g. `hiddenlakesia.com`) for
       branded sender addresses.
   - **Connect** the email domain to the Communication Services resource.
   - Copy the ACS **connection string** and the **sender address (MailFrom)**.

## App settings to add (Static Web App → Settings → Configuration → Application settings)

| Name | Value |
|------|-------|
| `AZURE_STORAGE_CONNECTION_STRING` | the storage account connection string |
| `ACS_CONNECTION_STRING` | the Communication Services connection string |
| `ACS_SENDER_ADDRESS` | e.g. `donotreply@<guid>.azurecomm.net` |
| `CONTACT_RECIPIENT` | `hiddenlakesia@gmail.com` (where leads are emailed) |

Save — the API picks these up automatically (no redeploy needed, though a fresh
deploy doesn't hurt).

## Test
1. Visit the live site, submit the contact form.
2. A "Thank you" message should appear, and an email should arrive at
   `hiddenlakesia@gmail.com`.
3. Verify the row in Storage: Storage account → Storage browser → Tables →
   `ContactSubmissions`.

## Heads-up: duplicate deploy workflow
There are **two** workflow files in `.github/workflows/`:
- `azure-static-web-apps-nice-cliff-065e4d50f.yml`  ← the real one (token
  `AZURE_STATIC_WEB_APPS_API_TOKEN_NICE_CLIFF_065E4D50F`); this one now builds the API.
- `azure-static-web-apps.yml`  ← uses a generic token `AZURE_STATIC_WEB_APPS_API_TOKEN`
  and `skip_app_build: true`, and does **not** build the API.

If that second workflow is active (its secret exists), it can deploy without the
API and/or cause confusing double deploys. **Recommendation: delete
`azure-static-web-apps.yml`** unless you know it's intentionally pointing at a
second environment. (Tell the assistant and it can remove it.)

## Cost
- Table Storage: effectively pennies/month at this volume.
- ACS Email: pay-per-email, fractions of a cent each. No monthly subscription.
