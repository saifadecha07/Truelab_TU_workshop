# Truelab

> Front-end prototype created for the **Trustworthy AI Workshop Buildathon**

Truelab is a dashboard prototype for monitoring fuel transport operations in one interface. The current version focuses on presenting operational data clearly through separate views for trucks, vessels, pipelines, and alerts.

This project is a **UI prototype built with mock data** to demonstrate the dashboard flow and monitoring experience.

## What the project includes

- `Overview` dashboard with KPI cards and a volume reconciliation chart
- `Truck Fleet` page for transport status, e-seal state, route, ETA, and fuel volume
- `Pipeline Monitor` page for pressure, flow rate, and station status
- `Vessel Tracking (AIS)` page for vessel status, route, AIS activity, and ullage comparison
- `Alert Center` page for critical, warning, and info alerts

## Current scope

What is implemented in this repository now:

- front-end only
- mock dataset for trucks, vessels, pipeline nodes, and alerts
- interactive dashboard layout
- filtering, searching, status badges, and detail views
- charts for comparing fuel volume data

What is not implemented yet:

- real-time data connection
- backend or database
- authentication
- AI model or anomaly detection engine

## Tech Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Purpose

The purpose of this project is to present a dashboard concept for fuel logistics monitoring during the buildathon. The main focus of the work is the **interface design, data presentation, and user flow** for monitoring transport and alert information.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Screenshots / Demo

You can add your demo link or screenshots here before publishing.

- Demo: `https://your-demo-link`
- Slides: `https://your-presentation-link`

Example image section:

```md
![Truelab Dashboard](./public/truelab-dashboard.png)
```

## Buildathon Note

This repository reflects the prototype I built during the **Trustworthy AI Workshop Buildathon**. It is intended to showcase the dashboard concept and the front-end implementation completed in the event.

## Author

- Name: `Your Name`
- GitHub: `https://github.com/your-username`
