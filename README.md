# Form & Feedback Widget Platform

A simple full-stack MERN app for building feedback forms, embedding them as widgets, collecting submissions, and viewing analytics.

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Animations: Framer Motion
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT in `localStorage`

## Project Structure

```txt
client/  React frontend
server/  Express API + MongoDB models + widget.js
```

## Environment Variables

### Server

Create [server/.env](/Users/diviksatija/Desktop/Tech%20Projects/formflow/server/.env):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedbackwidget
JWT_SECRET=your_secret_key
```

### Client

Create [client/.env](/Users/diviksatija/Desktop/Tech%20Projects/formflow/client/.env):

```env
VITE_API_URL=http://localhost:5000
```

## Run Locally

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Features

- Register and login with JWT auth
- Protected dashboard routes
- Form CRUD with duplicate support
- Form builder with live widget preview
- Field types: text, feedback, dropdown, checkbox, rating, NPS
- Appearance controls: theme color, font, position, submit button label
- Embed snippet generation with copy button
- Public widget script with floating and inline modes
- Submission table with CSV download
- Analytics with totals, average rating, average NPS, and a 30-day line chart
- Loading states, toast notifications, and basic validation

## Mandatory Improvements

### 1. CSV Export

The submissions page includes a CSV export button so teams can analyze responses in Excel or Google Sheets without extra work.

### 2. Duplicate Form

Each dashboard card includes a duplicate action that creates a new form with the same config. This speeds up building similar surveys and feedback flows.

### 3. Submission Limit

Each form supports an optional `maxSubmissions` value. This is useful for limited campaigns, short surveys, beta access forms, or giveaways where the form should automatically close after a fixed number of responses.

### 4. Active / Inactive Toggle

Each form can be paused without deleting it. This gives users a quick way to temporarily stop collecting responses while keeping the form config and history intact.

## Embed Snippet

```html
<script src="http://localhost:5000/widget.js" data-form-id="FORM_ID_HERE"></script>
```

## Notes

- `widget.js` lives at [server/public/widget.js](/Users/diviksatija/Desktop/Tech%20Projects/formflow/server/public/widget.js)
- The backend serves `widget.js` with `express.static`
- MongoDB must be running locally on `mongodb://localhost:27017/feedbackwidget`
