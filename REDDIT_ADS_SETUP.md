# Reddit Ads Setup Guide for Lead Generation

This guide will help you set up Reddit ads that properly track form submissions as conversions for your Cohi website.

---

## Overview: How Reddit Lead Gen Works

1. **User clicks your Reddit ad** → Lands on your website
2. **User fills out contact form** → Submits their information
3. **Form submission triggers conversion event** → Sent to Reddit
4. **Reddit optimizes your ads** → Shows ads to similar users who are likely to convert

---

## Step 1: Set Up Reddit Pixel

### What is Reddit Pixel?
Reddit Pixel is a tracking code that:
- Tracks visitors from your Reddit ads
- Measures conversions (form submissions)
- Helps Reddit optimize who sees your ads
- Enables retargeting

### Setup Steps:

1. **Go to Reddit Ads Dashboard**
   - Visit [ads.reddit.com](https://ads.reddit.com)
   - Log in with your Reddit account

2. **Navigate to Pixels**
   - Click **Tools** → **Pixels** (in the left sidebar)
   - Click **Create Pixel** (if you don't have one)

3. **Name Your Pixel**
   - Name: "Cohi Lead Generation" or similar
   - Click **Create**

4. **Copy Your Pixel ID**
   - You'll see your Pixel ID (looks like: `t2_xxxxx` or a numeric ID)
   - **Save this** - you'll need it for your website

5. **Add Pixel to Your Website**
   - The pixel code is already in your `index.html` file
   - You just need to replace `YOUR_REDDIT_PIXEL_ID_HERE` with your actual Pixel ID
   - We'll do this after you get your Pixel ID

---

## Step 2: Create Your Lead Generation Campaign

### Campaign Objective: Conversions

1. **Create New Campaign**
   - In Reddit Ads, click **Create Campaign**
   - Select **Conversions** as your campaign objective
   - This tells Reddit to optimize for form submissions

2. **Campaign Settings**
   - **Campaign Name**: "Cohi Lead Generation" or similar
   - **Budget**: Set your daily or lifetime budget
   - **Schedule**: When you want ads to run

### Ad Group Settings

1. **Targeting**
   - **Subreddits**: Target relevant subreddits like:
     - `r/energy`
     - `r/sustainability`
     - `r/commercialrealestate`
     - `r/facilitiesmanagement`
     - `r/business`
   - **Interests**: Energy efficiency, sustainability, business operations
   - **Demographics**: Location, age, etc. (if relevant)

2. **Placement**
   - **Home Feed**: Recommended for lead gen
   - **Post Comments**: Can work for engagement
   - **Sidebar**: Lower engagement but cheaper

3. **Bidding**
   - **Optimization Goal**: Select "Conversions" or "Lead Generation"
   - **Bid Strategy**: Start with "Automatic" (Reddit will optimize)
   - **Bid Amount**: Set your max cost per conversion

### Ad Creative

1. **Ad Format Options**
   - **Single Image Ad**: Simple, effective
   - **Video Ad**: Higher engagement
   - **Carousel**: Multiple images/products

2. **Ad Copy Best Practices for Lead Gen**
   - **Headline**: Clear value proposition
     - Example: "Cut Energy Costs by 30%"
     - Example: "Find Hidden Energy Waste in Your Building"
   
   - **Body Text**: Address pain points
     - Example: "Using AI and data science, we identify energy waste others miss. Get a free analysis."
   
   - **Call-to-Action**: Direct and clear
     - "Get Started"
     - "Request Analysis"
     - "Learn More"

3. **Landing Page**
   - **URL**: Your website URL with `#contact` hash
     - Example: `https://cohi.capital#contact`
   - This will jump users directly to the contact form
   - **Important**: Use the hash link so users land on the form immediately

---

## Step 3: Set Up Conversion Tracking

### Conversion Event Setup

1. **In Reddit Ads Dashboard**
   - Go to **Tools** → **Conversions**
   - Click **Create Conversion**

2. **Conversion Settings**
   - **Name**: "Contact Form Submission" or "Lead"
   - **Type**: Select **Lead** or **Custom Event**
   - **Value**: Optional - set if you know average lead value
   - **Attribution Window**: 7-30 days (how long to credit conversions)

3. **Link to Pixel**
   - Make sure your conversion is linked to your Pixel
   - This connects form submissions to ad clicks

### How It Works

When someone:
1. Clicks your Reddit ad → Pixel tracks the visit
2. Fills out your contact form → Conversion API sends event to Reddit
3. Reddit records the conversion → Uses it to optimize your ads

---

## Step 4: Configure Your Website

### Update Pixel ID

1. **In `index.html`** (around line 13):
   ```html
   rdt('init','YOUR_REDDIT_PIXEL_ID_HERE');
   ```
   Replace `YOUR_REDDIT_PIXEL_ID_HERE` with your actual Pixel ID

2. **In `script.js`** (around line 48):
   ```javascript
   const REDDIT_PIXEL_ID = 'YOUR_REDDIT_PIXEL_ID_HERE';
   ```
   Replace with your Pixel ID

### Update Conversion API (Optional - Advanced)

For server-side conversion tracking, you'll need:
- Reddit API token (requires OAuth setup)
- See `SETUP_INSTRUCTIONS.md` for details

**Note**: Pixel tracking (client-side) is usually sufficient for most use cases. The Conversion API is for more advanced tracking and privacy compliance.

---

## Step 5: Test Your Setup

### Before Launching Ads

1. **Test Pixel Tracking**
   - Visit your website: `https://yourdomain.com`
   - Open browser DevTools (F12) → Network tab
   - Filter by "reddit"
   - You should see requests to Reddit's pixel servers
   - This confirms pixel is firing

2. **Test Form Submission**
   - Submit a test form on your website
   - Check Reddit Ads dashboard → **Conversions** tab
   - You should see the test conversion (may take a few minutes)
   - This confirms conversion tracking works

3. **Test Landing Page**
   - Click your ad (or use the landing page URL)
   - Verify it jumps to `#contact` section
   - Form should be visible and functional

---

## Step 6: Launch and Optimize

### Launch Checklist

- [ ] Pixel installed and tested
- [ ] Conversion event created
- [ ] Landing page URL includes `#contact`
- [ ] Form is working and saving to Google Sheets
- [ ] Test conversion recorded in Reddit dashboard

### Optimization Tips

1. **Monitor Performance**
   - Check **Conversions** tab daily
   - Look at cost per conversion
   - Monitor click-through rate (CTR)

2. **A/B Test**
   - Test different ad copy
   - Test different headlines
   - Test different images
   - Keep what works, pause what doesn't

3. **Refine Targeting**
   - Pause underperforming subreddits
   - Increase budget on high-performing ones
   - Test new subreddit targets

4. **Optimize Landing Page**
   - Make sure form is above the fold (visible without scrolling)
   - Test different form copy
   - Consider adding social proof or testimonials

---

## Best Practices for Reddit Lead Gen Ads

### 1. Ad Creative
- **Be Authentic**: Reddit users value authenticity
- **Don't Oversell**: Be helpful, not pushy
- **Use Reddit-Style Language**: Match the tone of the subreddit
- **Include Social Proof**: "Join 500+ businesses saving on energy"

### 2. Targeting
- **Start Broad, Then Narrow**: Begin with broader targeting, then refine
- **Test Multiple Subreddits**: Don't put all budget in one place
- **Use Interest Targeting**: Combine subreddits + interests for better reach

### 3. Landing Page
- **Direct to Form**: Use `#contact` hash link
- **Clear Value Prop**: Explain what they get from filling out the form
- **Minimal Friction**: Keep form simple (name, email, message)
- **Mobile Optimized**: Many Reddit users are on mobile

### 4. Budget Management
- **Start Small**: Test with $10-20/day
- **Scale What Works**: Increase budget on winning ads
- **Set Conversion Goals**: Know your target cost per lead
- **Monitor Daily**: Check performance and adjust

---

## Troubleshooting

### Conversions Not Tracking

1. **Check Pixel**
   - Is pixel code in `index.html`?
   - Is Pixel ID correct?
   - Test in browser DevTools

2. **Check Conversion Event**
   - Is conversion event created in Reddit?
   - Is it linked to your Pixel?
   - Check attribution window (may take time to show)

3. **Check Form Submission**
   - Is form actually submitting?
   - Check browser console for errors
   - Verify Google Sheets is receiving data

### Low Conversion Rate

1. **Landing Page Issues**
   - Is form visible immediately?
   - Is value proposition clear?
   - Too many form fields?

2. **Ad-to-Landing Page Mismatch**
   - Does landing page match ad promise?
   - Is form what they expect?

3. **Targeting Too Broad**
   - Narrow to more relevant audiences
   - Test different subreddits

---

## Next Steps

1. **Set up Reddit Pixel** (get your Pixel ID)
2. **Create your first campaign** (start with small budget)
3. **Update website** with Pixel ID
4. **Test everything** before scaling
5. **Launch and monitor** daily

---

## Resources

- [Reddit Ads Help Center](https://www.redditinc.com/advertising)
- [Reddit Pixel Documentation](https://www.redditinc.com/advertising/help/pixel)
- [Reddit Ads Best Practices](https://www.redditinc.com/advertising/help/best-practices)

---

## Questions?

If you need help with:
- Setting up the Pixel ID in your code
- Creating your first campaign
- Troubleshooting conversion tracking

Let me know and I can help!

