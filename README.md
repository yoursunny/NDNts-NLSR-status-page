# NLSR Status Page

Production site: [https://nlsr-status.netlify.com/](https://nlsr-status.netlify.com/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/39272f39-d775-4314-8573-6d70ee8d8a7a/deploy-status)](https://nlsr-status.netlify.com/)

NLSR status page built with [NDNts](https://yoursunny.com/p/NDNts/), inspired by [Alvy's NLSRC-status-page](https://github.com/alvyC/NLSR-status-page).

![NDNts logo](public/logo.svg)

This project demonstrates these NDNts capabilities:

* `EvDecoder`, an evolvability-aware TLV decoder.
  Its flexibility allows us to decode NLSR's `NameLsa` structure with very little code.
* `fetch` function from `@ndn/segmented-object`.
  It can retrieve segmented object, such as the LSDB dataset.

Build instructions:

1. `npm install` to install dependencies.
2. `npm run serve` to start development server.
3. `npm run build` to compile production site in `public/`.
