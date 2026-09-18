# Defense Enclave Society — Production MVP Setup

## 1. Create Supabase project
Create a Supabase project, then open SQL Editor and run `schema.sql`.

## 2. Configure frontend
Open `app.js` and replace:

```js
const CONFIG={SUPABASE_URL:'',SUPABASE_ANON_KEY:''};
```

with the Supabase Project URL and **anon/public key**. Never put a service-role key in browser code.

## 3. First admin
Register the first member normally. Then, in Supabase SQL Editor, run:

```sql
update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
```

## 4. Production data
Replace sample society phone/email/address and seed real data for works, events, gallery and finances.

## 5. Hosting
This frontend can be hosted on Cloudflare Pages, GitHub Pages (with backend on Supabase), Netlify, or another static host. Supabase supplies authentication/database/storage; the host supplies the public website URL.

## 6. Important privacy point
The public member directory should expose only information approved by the society (for example name + house number). Phone, email, address and complaint details should remain authenticated/private.
