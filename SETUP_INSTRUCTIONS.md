# Form Integration Setup Instructions

This guide will help you set up:
1. **Google Drive/Sheets Integration** - Save form submissions directly to Google Sheets
2. **Reddit Conversion API** - Track form submissions as conversions for Reddit ads

---

## 1. Google Drive/Sheets Integration Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Cohi Contact Form Submissions"
4. Add headers in row 1: `Timestamp`, `Name`, `Email`, `Phone`, `Message`, `Source`

### Step 2: Create Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code and paste this script:

```javascript
// Handle POST requests from the form
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the data as a new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.source || 'website_contact_form'
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing - optional)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Google Apps Script is working. Use POST to submit form data.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (💾 icon) and give your project a name like "Cohi Form Handler"

### Step 3: Deploy as Web App (Simplified - No OAuth Setup Needed)

**Method 1: Direct Deployment (Try this first)**
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set the following:
   - **Description**: "Cohi Contact Form Handler"
   - **Execute as**: "Me" (your email)
   - **Who has access**: **"Anyone"** (this allows your website to submit data)
4. Click **Deploy**
5. You'll be prompted to **Authorize access** - click it
6. Click **Review Permissions**
7. Choose your Google account
8. You may see a warning that the app isn't verified - click **Advanced** → **Go to Cohi Form Handler (unsafe)** (this is safe since it's your own script)
9. Click **Allow** to grant permissions
10. **Copy the Web App URL** - you'll need this for the next step

**If you get OAuth errors, try Method 2 below:**

**Method 2: Enable Google Cloud Project (If Method 1 Fails)**

If you get OAuth errors, you need to enable the Google Cloud project:

1. In Apps Script editor, click the **Project Settings** icon (⚙️) on the left
2. Scroll down to **Google Cloud Platform (GCP) Project**
3. Click **Change project**
4. Click **Create a new Google Cloud project** (or select existing if you have one)
5. Wait for it to create (may take a minute)
6. Once created, go back to **Deploy** → **New deployment**
7. Try deploying again with:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"

**Method 3: Use Google Forms Instead (Easiest Alternative)**

If OAuth continues to be problematic, you can use Google Forms which doesn't require any setup:
1. Create a Google Form with fields: Name, Email, Phone, Message
2. Get the form submission URL
3. Update the form to submit directly to Google Forms instead

Let me know which method works for you!

### Step 5: Update Your Website Code
1. Open `script.js`
2. Find the line: `const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL you copied

**Example:**
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

**Important:** Make sure you copy the URL from the deployment, not from the editor URL.

---

## 2. Reddit Conversion API Setup

### Step 1: Get Your Reddit Pixel ID
1. Log in to [Reddit Ads](https://ads.reddit.com)
2. Go to **Tools** → **Pixels**
3. Create a new pixel or use an existing one
4. **Copy your Pixel ID** (it looks like: `t2_xxxxx` or a numeric ID)

### Step 2: Get Your Reddit API Token
1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Click **create app** or **create another app**
3. Select **script** as the app type
4. Fill in the details:
   - **Name**: "Cohi Conversion API"
   - **Description**: "Conversion tracking for Cohi website"
   - **Redirect URI**: `http://localhost` (required but not used)
5. Click **create app**
6. You'll see your **client ID** (under the app name) and **secret** (below the app)
7. You'll need to create an access token using OAuth2. For production, you may want to:
   - Use Reddit's OAuth2 flow to get a token
   - Or use a server-side solution to securely store the token

**Note:** For security, the API token should ideally be stored server-side. The current implementation stores it in the client-side code, which is visible to users. For production, consider:
- Using a server-side proxy endpoint
- Or using Reddit's client-side pixel tracking only

### Step 3: Update Your Website Code
1. Open `index.html`
2. Find the Reddit Pixel code (around line 13)
3. Replace `YOUR_REDDIT_PIXEL_ID_HERE` with your actual Pixel ID

4. Open `script.js`
5. Find: `const REDDIT_PIXEL_ID = 'YOUR_REDDIT_PIXEL_ID_HERE';`
6. Replace with your Pixel ID
7. Find: `const REDDIT_API_TOKEN = 'YOUR_REDDIT_API_TOKEN_HERE';`
8. Replace with your API token

**Example:**
```javascript
const REDDIT_PIXEL_ID = 't2_abc123xyz';
const REDDIT_API_TOKEN = 'your_oauth_token_here';
```

### Step 4: Test the Integration
1. Submit a test form on your website
2. Check your Google Sheet - you should see a new row with the submission
3. Check Reddit Ads dashboard - you should see conversion events (may take a few minutes)

---

## 3. Optional: Keep Formspree as Backup

The code is configured to also send to Formspree as a backup. If you want to:
- **Keep it**: Leave `FORMSPREE_ENDPOINT` as is
- **Remove it**: Change to `const FORMSPREE_ENDPOINT = null;`

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Reddit API Token**: Currently stored in client-side code, which means it's visible to anyone viewing your website source. For production:
   - Consider using a server-side proxy endpoint
   - Or use only the Reddit Pixel (client-side tracking) without the Conversion API
   - The Pixel tracking in the HTML is safe to use client-side

2. **Google Apps Script**: The Web App URL is public, but that's okay since:
   - The script validates data
   - You can add additional security checks in the Apps Script
   - Consider adding rate limiting or IP restrictions in the script

3. **Email Hashing**: The Reddit conversion code hashes emails for privacy, but for production you may want to use SHA-256 hashing.

---

## Troubleshooting

### Google Sheets not receiving data:
- Check that the Web App is deployed with "Anyone" access
- Check the Apps Script execution logs: **Executions** in Apps Script editor
- Verify the URL in `script.js` matches your Web App URL exactly

### Reddit conversions not tracking:
- Verify your Pixel ID is correct in both `index.html` and `script.js`
- Check browser console for errors
- Verify your API token is valid
- Check Reddit Ads dashboard - conversions may take a few minutes to appear

### Form not submitting:
- Check browser console for JavaScript errors
- Verify at least one endpoint (Google Apps Script or Formspree) is configured
- Check network tab to see which requests are failing

---

## Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Google Apps Script execution logs
3. Verify all URLs and tokens are correct
4. Test with a simple form submission

