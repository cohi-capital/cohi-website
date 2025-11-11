# Cohi Landing Page

A modern, dark-mode landing page for Cohi - finding energy waste and delivering savings.

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

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select the branch (usually `main`)
   - Select the folder `/ (root)`
   - Click **Save**

3. **Your site will be live at:**
   `https://yourusername.github.io/your-repo-name/`

## File Structure

```
cohi_revival_website/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── script.js       # JavaScript for form handling
├── logo.svg        # Logo file
└── README.md       # This file
```

## Contact Form

The contact form is configured to use Formspree and is fully functional. Form submissions are sent to the configured Formspree endpoint.
