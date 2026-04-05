# Fonts

The home page uses **Montserrat** (from Google Fonts) for the “Gotham” style, so no 404s.

To use **Gotham** instead, add these files here:

- `Gotham-Book.woff2` (weight 400)
- `Gotham-Bold.woff2` (weight 700)

Then in `app/globals.css` add the `@font-face` rules for Gotham and set `--font-gotham` to `"Gotham", sans-serif` in `@theme inline`.
