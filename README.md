# Game Finder

A website that recommends games. You type what you like and what you play on, like "I liked Hades and Hollow Knight, something similar on PC", and it gives you 5 games with a short reason for each one.

**Live site:** https://game-finder-mauve.vercel.app

![Game Finder screenshot](docs/screenshot.png)

I built this on my own as a personal project to practice working with APIs, AI, authentication, and deployment.

## What it does

- Turns a plain-language request into game recommendations
- Gives a "Why this game?" reason for each pick
- Google sign-in, so you can save games to your own list
- "Not interested" button, so a game never shows up for you again
- "Lighter games" option for weak PCs (shows games released 2020 or earlier)
- Title search page at `/search`

## How it works

The AI never picks games from its own memory, because it can make up games that don't exist. Every request goes through four steps:

1. **Understand:** the AI turns your message into filters (genres, platform, games you liked, keywords).
2. **Fetch:** my code asks the RAWG game database for real games that match those filters.
3. **Pick:** the AI chooses the best 5 from that list only and writes a reason for each.
4. **Check:** my code verifies that every pick is a real game from the list. Anything else is thrown away.

## Tech stack

- Next.js (App Router), React, Tailwind CSS
- RAWG API for game data
- Google Gemini API for the AI, with Groq as a backup if Gemini is down or out of quota
- Firebase Authentication and Firestore for login and saved lists
- Deployed on Vercel

## Things I did to make it safer

- API keys stay on the server and are never sent to the browser
- AI output is treated as untrusted. Genres, platforms, and game IDs are checked against allowed values before use
- The user's message is passed to the AI as data, and the prompts tell it to ignore instructions inside it
- Input is limited to 500 characters
- Rate limiting per visitor and for the whole site, so nobody can use up the free AI quota
- Firestore rules only let each user read and write their own saved list
- Repeated searches are answered from a cache instead of calling the AI again

## Known limitations

I'd rather list these than hide them:

- It runs on free AI tiers, which have daily limits. When both providers run out, the site shows a message instead of recommendations.
- The rate limiter and cache live in server memory. On Vercel they can reset or differ between instances, so they are best effort. A shared store like Upstash Redis would fix this.
- "Lighter games" filters by release year. It does not check real system requirements, because RAWG's search results don't include them reliably.
- The recommendations are only as good as the RAWG data and the AI's explanation. They can be off.

## Run it locally

You need Node.js and free keys from RAWG, Google AI Studio, and Firebase. A Groq key is optional.

```bash
git clone https://github.com/rdnprdll/game-finder.git
cd game-finder
npm install
```

Create a `.env.local` file:

```
RAWG_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=
GROQ_API_KEY=
GROQ_MODEL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Then:

```bash
npm run dev
```

and open http://localhost:3000.

For Firebase, turn on Google sign-in and create a Firestore database with rules that only let a user access `users/{their own id}/...`.

## What I want to add next

- Automated tests and a GitHub Actions check
- Shared rate limiting and cache with Upstash Redis
- Accessibility fixes
- A game detail page and a "more like this" button
- Steam library import

## Credits

Game data from [RAWG](https://rawg.io).