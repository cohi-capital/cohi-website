# Cohi Landing Page

A modern, dark-mode landing page for Cohi - finding energy waste and delivering savings.

## Setup

### Configuration

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your credentials:
   - `GOOGLE_APPS_SCRIPT_URL`: Your Google Apps Script Web App URL (see Google Sheets Setup below)
   - `REDDIT_PIXEL_ID`: Your Reddit Pixel ID (optional, for ad tracking)
   - `REDDIT_API_TOKEN`: Your Reddit API token (optional, for server-side conversion tracking)

**Note:** `config.js` is gitignored and will not be committed to the repository.

### Google Sheets Integration

Form submissions are saved directly to Google Sheets via Google Apps Script.

#### Setup Steps:

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Add headers in row 1: `Timestamp`, `Name`, `Email`, `Phone`, `Message`, `Source`

2. **Create Google Apps Script**
   - In your Google Sheet, click **Extensions** → **Apps Script**
   - Paste this code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.source || 'website_contact_form'
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'Google Apps Script is working.'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy as Web App**
   - Click **Deploy** → **New deployment** → **Web app**
   - Set **Execute as**: "Me"
   - Set **Who has access**: "Anyone"
   - Click **Deploy** and authorize when prompted
   - Copy the Web App URL and add it to `config.js` as `GOOGLE_APPS_SCRIPT_URL`

### Reddit Ads Integration

The site includes Reddit Pixel tracking for conversion optimization. Pixel tracking works client-side and doesn't require additional setup beyond adding your Pixel ID to `config.js`.

For server-side conversion tracking via Reddit's Conversion API, you'll need to set up a server-side proxy endpoint due to CORS restrictions. The pixel tracking is sufficient for most use cases.

## Viewing Locally

### Direct Open
Double-click `index.html` to open it in your default browser.

### Local Server (Recommended)
Using Python:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser

Using Node.js:
```bash
npx http-server -p 8000
```
Then open http://localhost:8000 in your browser

## Deploying to GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select the branch (usually `main`)
   - Select the folder `/ (root)`
   - Click **Save**

3. **Your site will be live at:**
   `https://yourusername.github.io/your-repo-name/`

**Important:** Make sure to create `config.js` with your actual credentials before deploying, or the form will not work.

## File Structure

```
cohi-website/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript for form handling and navigation
├── reddit-pixel.js     # Reddit Pixel tracking code
├── config.js           # Configuration (gitignored - create from config.example.js)
├── config.example.js   # Example configuration file
├── logo.svg            # Logo file
└── README.md           # This file
```

## Contact Form

The contact form saves submissions to Google Sheets. The phone field is optional. Form validation ensures all required fields (name, email, message) are filled before submission.
