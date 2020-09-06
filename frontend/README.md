# Frontend

_This is information regarding development. If you're looking for information regarding production setup, see [templates](/templates)._

This uses the Next.js framework.

#### Requires

- npm

1. Clone the repository if it hasn't been done yet
2. Navigate to the `frontend` directory (the one this README is in)
3. Run `npm install`
4. Ensure the the backend API is running (See the instructions in the [`backend directory`](/backend) if you haven't started it yet)
5. Run `npm run dev`

Note that iSSG and the service worker are not enabled in the development build and so pages will likely load slower than in production.

**Build Production (Test iSSG or Service Worker)**

1. Run `npm run build`
2. Run `npm run start`
