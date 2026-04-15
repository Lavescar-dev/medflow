
# MedFlow

This directory contains the MedFlow hospital management demo app.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Routing and static hosting

MedFlow now uses browser paths such as:

- `/dashboard`
- `/appointments`
- `/patient-registration`
- `/ehr`

For static hosting, the project includes two SPA fallback layers:

- `public/_redirects` for hosts that support redirect rules
- automatic `dist/404.html` generation during build for hosts that fall back to `404.html`
  
