# TRIP — Bangladesh travel website (prototype)

Open `TRIP.dc.html` through a local server (e.g. `npx serve .`), since the pages load shared files.

Pages:
- TRIP.dc.html: home
- Destinations.dc.html: all destinations (All / Popular / Hidden gems)
- Destination.dc.html?id=<slug>: destination guide
- Stories.dc.html: story list and reader (?story=<id>)
- ShareStory.dc.html: write a story (?place=<slug>)
- About.dc.html: about and contact form
- Footer.dc.html: shared animated footer

Data lives in trip-data.js. The prototype runtime is support.js. images/ holds local photos; others load from Wikimedia Commons.
Placeholders: contact details, sample stories, destination text. Stories save to the browser only (localStorage) until a backend is added.
