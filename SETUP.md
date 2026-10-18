# Inkology – Setup Guide (one time, ~20 minutes)

## How it works
- Your site's files live in a **private GitHub repository** (only YOU can change it).
- **Netlify** (free) shows the site to everyone, and updates itself whenever you change files on GitHub.
- Visitors can only look and send bookings. They cannot change anything.

## Step 1 – Put the files on GitHub
1. Make a free account at github.com → **New repository** → name it `inkology` → choose **Private** → Create.
2. Click **uploading an existing file**, drag in everything from this folder (unzipped), click **Commit changes**.

## Step 2 – Publish with Netlify
1. Make a free account at netlify.com (sign in with GitHub).
2. **Add new site → Import from Git → GitHub → inkology**. Leave settings as they are → **Deploy**.
3. Your site is live at a `xxxx.netlify.app` link. (You can connect your own domain later in Site settings → Domains.)

## Step 3 – Get booking alerts (email + WhatsApp)
In Netlify: **Site configuration → Environment variables → Add**:

| Name | Value |
|---|---|
| `GMAIL_USER` | your Gmail address (alerts arrive here) |
| `GMAIL_APP_PASSWORD` | Google Account → Security → 2-Step Verification (turn on) → **App passwords** → create one → paste the 16 letters |
| `CALLMEBOT_PHONE` | your number with country code, e.g. `919876543210` |
| `CALLMEBOT_KEY` | key you get from callmebot.com (WhatsApp section: follow their 1-minute steps) |

Then **Deploys → Trigger deploy**. Send a test booking from your site.
*Note: real SMS in India needs paid registration (DLT), so the "text" alert is sent to your WhatsApp instead – free and instant.*

## Step 4 – Add / change photos (the easy part)
Photos are in two folders:
- `src/photos/gallery` → "Past Tattoos" section
- `src/photos/designs` → "Available Designs" section

On github.com open the folder → **Add file → Upload files** → drop your photos → **Commit**. The site updates in about a minute.
(Prefer your PC? Install **GitHub Desktop**, copy photos into the folder, click **Commit** then **Push**.)

- **File name = caption.** `japanese-koi.jpg` shows as "Japanese Koi".
- **Order:** start the name with a number: `01-koi.jpg`, `02-wolf.jpg`.
- To remove a photo, delete the file in the same folder.
- Tip: resize photos to under ~1 MB each (phone "medium" size) so the site loads fast.

## Step 5 – Your details
Open `src/siteConfig.js` on GitHub (pencil icon) and change address, phone, WhatsApp, Instagram, hours. **Commit**. Done.
