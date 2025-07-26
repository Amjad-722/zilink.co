# Svelte Front

Backend Data Store mongodb schema

```js
{
    id: "bit.ly/4mdgm60",
    type: "website", // Website | Email | Phone | Text | WiFi | Bitcoin
    long_url: "https://www.bardui.com/",
    created_at: "2025-07-23T21:04:50+0000",
}
```

```json
{
	"created_at": "2025-07-23T21:45:47+0000",
	"id": "bit.ly/4mdgm60",
	"link": "https://bit.ly/4mdgm60",
	"custom_bitlinks": [],
	"long_url": "https://www.bardui.com/",
	"title": "Pre-built Tailwind CSS Components",
	"archived": false,
	"tags": [],
	"deeplinks": [],
	"references": {
		"group": "https://api-ssl.bitly.com/v4/groups/Bp7nlGfGY0P"
	}
}
```

```json
{
	"qrcode_id": "Qp7nl4o3ru6rYBw",
	"group_guid": "Bp7nlGfGY0P",
	"title": "@kodav.dev/svelte5-qrcode - npm",
	"render_customizations": {
		"background_color": "#ffffff",
		"dot_pattern_color": "#000000",
		"dot_pattern_type": "",
		"corners": {
			"corner_1": {
				"inner_color": "#000000",
				"outer_color": "#000000",
				"shape": ""
			},
			"corner_2": {
				"inner_color": "#000000",
				"outer_color": "#000000",
				"shape": ""
			},
			"corner_3": {
				"inner_color": "#000000",
				"outer_color": "#000000",
				"shape": ""
			}
		},
		"branding": {
			"bitly_brand": true
		},
		"spec_settings": {
			"version": 0,
			"error_correction": 0,
			"mask": 0
		}
	},
	"qr_code_type": "bitlink",
	"bitlink_id": "bit.ly/4lFPzPH",
	"long_urls": ["https://www.npmjs.com/package/@kodav.dev/svelte5-qrcode"],
	"serialized_content": "https://bit.ly/4lFPzPH?r=qr",
	"archived": false,
	"created": "2025-07-23T21:04:50+0000",
	"updated": "2025-07-23T21:04:50+0000"
}
```

# First Basic idea

### Pros of the Idea

1. Easy to build (MVP): You can launch a basic version quickly with Node.js, Express, MongoDB (or even SQLite), and some frontend like React/Svelte.
2. Useful for everyone: Great for marketers, influencers, and content sharers.
3. Traffic redirection control: You can track clicks, locations, devices, etc.
4. Custom short domains: Users can use their own branded domain in the pro version.
5. Can be monetized: Ads before redirection, premium features, analytics.

### 🔥 Ways to Stand Out

- Most URL shorteners already do the basics. If you want to stand out:

1. Analytics Dashboard
   Show users how many clicks their short URL got, from which country, browser, etc.

2. Expiration Links
   Let users set an expiry time or number of clicks.

3. Password-Protected Links
   Short link only opens when password is entered.

4. Custom Slugs
   Allow user to create short.ly/imran-special-sale.

## 1. URL Shortener Schema (ShortUrl)

```ts
// models/ShortUrl.ts

import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
	longUrl: {
		type: String,
		required: true
	},
	shortCode: {
		type: String,
		required: true,
		unique: true
	},
	customAlias: {
		type: String,
		unique: true,
		sparse: true
	},
	createdByIP: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	expiresAt: {
		type: Date,
		default: null
	},
	clickCount: {
		type: Number,
		default: 0
	},
	userAgentLogs: [
		{
			date: { type: Date, default: Date.now },
			ip: String,
			userAgent: String,
			referrer: String
		}
	]
});

export default mongoose.model('ShortUrl', shortUrlSchema);
```

## 2. QR Code Schema (QrCode)

```ts
// models/QrCode.ts

import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true
	},
	qrImageUrl: {
		type: String,
		required: true // path or CDN/image link
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	createdByIP: {
		type: String
	},
	shortUrlId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ShortUrl',
		required: false // Optional relation to ShortUrl
	}
});

export default mongoose.model('QrCode', qrCodeSchema);
```

Bonus Ideas (Optional fields you can add later):

- For ShortUrl:
  isPasswordProtected: Boolean
  passwordHash: String
  platformSource: 'web' | 'api' | 'extension'

- For QrCode:
  downloadCount
  format: 'svg' | 'png'
  designOptions: { color, logo, etc. }

### what’s the correct approach?

👉 Do NOT fetch in SvelteKit's frontend and then redirect. Instead:
📌 Let the backend handle everything — including analytics and redirection — so you don’t break the flow.

+page.svelte

```svelte
<script lang="ts">
	let longUrl = '';
	let shortUrl = '';
	const createShortUrl = async () => {
		const res = await fetch('/api/shorten', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ longUrl })
		});
		const data = await res.json();
		shortUrl = data.shortUrl;
	};
</script>

<input bind:value={longUrl} placeholder="Paste your long URL..." />
<button on:click={createShortUrl}>Shorten</button>

{#if shortUrl}
	<p>Here is your short URL: <a href={shortUrl} target="_blank">{shortUrl}</a></p>
{/if}
```

✅ src/routes/[code]/+page.ts

```ts
// Server-side load function in SvelteKit

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const res = await fetch(`https://your-api.com/${params.code}`);

	if (res.status === 404) {
		return {
			status: 404,
			error: new Error('Not found')
		};
	}

	const data = await res.json();

	// ✅ Redirect user to long URL
	if (typeof window !== 'undefined') {
		window.location.href = data.longUrl;
	}

	return {};
};
```

### Backend Logic - How to Collect Analytics

```ts
app.get('/:code', async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ shortCode: req.params.code });
	if (!shortUrl) return res.status(404).send('Not found');

	// 1. Update click count
	shortUrl.clickCount += 1;
	await shortUrl.save();

	// 2. Save analytics
	const parser = new UAParser(req.headers['user-agent']);
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	await ClickAnalytics.create({
		shortUrlId: shortUrl._id,
		ip,
		userAgent: req.headers['user-agent'],
		browser: parser.getBrowser().name,
		os: parser.getOS().name,
		deviceType: parser.getDevice().type || 'Desktop',
		referrer: req.get('referrer') || 'Direct',
		timestamp: new Date()
	});

	// 3. Redirect to the long URL
	res.redirect(shortUrl.longUrl);
});
```

### New IDEA:

1. when user share the qr link the qr should display
2. if user want to protect the link with password he can do it easly
3. user can select the type of QR code like password email etc
