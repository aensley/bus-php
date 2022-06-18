<h1 align="center">
  <img src="src/img/logo.svg" alt="BUS logo" height="196" width="400"><br/><br/>
  Basic URL Shortener
</h1>

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/aensley/bus?style=flat-square)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/aensley/bus/ci/main?style=flat-square)](https://github.com/aensley/bus/actions/workflows/ci.yml?query=branch%3Amain)

## No-Frills Short URLs

This library offers the simplest of URL shortener setups for self-hosted users. There are no analytics, built-in authentication methods, or complex installation steps.

### Tech Stack

- Server-side processing: PHP
- Configuration: [Single JSON file](#.env.json)
- Data storage: [Single JSON file](#.data.json)
- Build System: Node JS

## Pre-requisites

- A domain
- A dashboard domain
- A web server
- PHP
- HTTPS Certificate

## Installation

1. Clone the repository

   ```ShellSession
   $ git clone https://github.com/aensley/bus
   ```

1. Install dependencies

   ```ShellSession
   $ npm ci
   ```

1. Build the site

   ```ShellSession
   $ npm run build
   ```

### Server Setup

The built site will be available in two directories:

1. **`dist/public/`** - This is for the domain hosting BUS itself, i.e. https://example.com
1. **`dist/dash`/** - This is for the domain hosting the BUS dashboard, where the short URLs will be created and managed, i.e. https://dash.example.com

Example configs are included for apache for both the [public](examples/apache-site-public.conf) and [dash](examples/apache-site-dash.conf) sites.

## Configuration

### .env.json

In the `dist/` folder, you must create a `.env.json` file with the site configuration.

[An example `.env.json` file](examples/.env.json) is included for reference.

Settings:

- `public-domain`: The domain for your URL shortener. This will be used as the base for your short URLs.
- `dash-domain`: The domain for your dashboard to create and manage short URLs.

### .data.json

In the `dist/` folder a `.data.json` file will automatically be created when you add your first short URL.

This file contains a JSON-formatted list of all short URLs added to your site.

Each entry has the short URL identifier as its key and the following properties:

- **`l`**: The long URL.
- **`c`**: Timestamp representing when the short URL was created.
