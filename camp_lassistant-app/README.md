# camp_lassistant-app

This repository contains the scaffolding for a campus assistant application.

## Structure

```
camp_lassistant-app/
├─ app.json                    # descriptor listing component files
├─ repo.json                   # repository metadata
├─ loader.json
├─ init.json
├─ final.json
├─ data/                       # sample JSON data
│  ├─ messages.json
│  ├─ orders.json
│  └─ posts.json
├─ api/                        # stub API classes
│  ├─ ChatApi.js
│  ├─ OrderAPI.js
│  └─ ForumAPI.js
└─ app/                        # UI components and hooks
   ├─ App.css
   ├─ hooks/app.js
   ├─ chat/
   │  ├─ Chat.css
   │  └─ hooks/chat.js
   ├─ order/
   │  ├─ Order.css
   │  └─ hooks/order.js
   └─ forum/
      ├─ Forum.css
      └─ hooks/forum.js
```

## Usage

The CSS and JS files provide placeholder styles and hook utilities. API classes are simple wrappers that can be replaced with real `github_api` calls.

Run the application by installing dependencies and starting the server:

```bash
cd camp_lassistant-app
npm install      # install express, cors, body-parser
npm start        # starts backend on http://localhost:3000
```

Once running you can open the static front-end pages in a browser:

- http://localhost:3000/index.html – landing page with navigation
- http://localhost:3000/chat.html – chat demo with basic multi‑chat support.  Users can switch between chats (general, private), message deletion, timestamps, auto‑refresh, username persistence, and status notifications.  Data now includes users, friend lists and chat definitions.
- http://localhost:3000/order.html – submit orders with type/addresses/campus, toggle completion with a click, persistent last item, status messages
- http://localhost:3000/runner.html – courier dashboard showing available errands and your assigned tasks; set your runner name at top
- http://localhost:3000/forum.html – create posts/replies, delete posts/comments, author persistence, auto‑refresh, and status notifications

The backend persists data in the `data/*.json` files; feel free to inspect or reset them. Chat data now supports multiple chats, user/friend lists, private/group types, attachments, and read receipts. Message objects include:

```
{
  id, chatId, type, sender, text,
  attachments:[{type,url,name}],
  readBy:[username...],
  timestamp
}
```

New API endpoints include:

- `POST /api/auth/login` returns JWT (body `{username}`)
- `GET/POST /api/chat/chats` to list/create chats (each with id, name, participants, type)
- `GET/POST /api/chat/messages` with `chatId` query/body, protected by JWT
- `GET /api/users` and `/api/friends/:user` for friend management
- `PATCH`/`DELETE` endpoints for orders, messages and posts as described earlier

The order object now supports additional fields for the runner interface:

```
{
  orderId, item, quantity, status, runner?,
  type,        // general / pickup / delivery / shopping
  pickup,      // pickup address or location
  destination, // delivery address or destination
  campus       // campus identifier or name
}
```

Data persistence remains JSON files. The server also exposes a Socket.io endpoint for real-time messaging and user presence; clients should connect using the JWT as auth.

To go beyond the basic demo (sending text, offline history, friends), real-world features such as:

* **Rich media** (images/files/audio) – would require file upload endpoints + storage and client-side handling
* **Emoji/emoji picker** – can be added in the UI by substituting emoji codes
* **Voice / video calls** – typically implemented with WebRTC and a signalling server; this prototype does not include those.
* **Offline notifications/push** – would require a background service and authentication layer.

Those enhancements are left as exercises for the full application; the current codebase provides a scaffolding and data model on which you can build these capabilities.

## Deployment
The GitHub Actions workflow (`.github/workflows/ci.yml`) includes a step to publish the contents of the `app/` folder to GitHub Pages. To deploy:

1. Push this repository to GitHub (e.g. `git remote add origin ... && git push -u origin main`).
2. Actions will run and, on success, publish static pages under `https://<username>.github.io/<repo>/`.
3. Backend cannot run on Pages – you’ll need a Node host (Heroku, Vercel, etc.) or adapt it into serverless functions.

Because this demo uses JWT and WebSocket, deployment to a Node-compatible host is recommended.

> The GitHub CLI operations (`gh repo create`, `gh run`) are unrelated to running the app and cannot be executed from within this codespace. Authenticate locally using `gh auth login` if you want to interact with GitHub.
