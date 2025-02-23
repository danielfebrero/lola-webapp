# Fabularius.ai Front-End

Fabularius.ai is a storytelling platform where creativity meets technology. This front-end application delivers an immersive, interactive narrative experience—empowering users to explore rich stories, dynamic characters, and engaging adventures.

---

## Table of Contents

- [Fabularius.ai Front-End](#fabulariusai-front-end)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Technologies](#technologies)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

---

## Overview

The Fabularius.ai front-end is designed to bring storytelling to life. It leverages modern web technologies to deliver a responsive, feature-rich interface where users can:

- Navigate through interactive, choose-your-own-adventure narratives.
- Engage with real-time chat interactions.
- Browse detailed character profiles and image galleries.
- Experience a fully internationalized interface with support for multiple languages.

---

## Key Features

- **Interactive Storytelling:** Dynamic narratives that evolve with user choices.
- **Real-Time Chat:** Integrated chat functionality to enhance user engagement.
- **Dynamic Character Profiles:** Detailed, visually-rich character profiles.
- **Multilingual Support:** Internationalization (i18n) enables a global audience experience.
- **Modular and Scalable:** A well-organized codebase with reusable components and layouts.

---

## Technologies

- **Framework:** Next.js (React-based for server-side rendering and performance optimizations)
- **Language:** TypeScript for strong type safety
- **Styling:** Tailwind CSS for rapid and responsive UI design
- **State Management:** Redux (with slices organized under the `store` directory)
- **Tooling:** Yarn for package management and modern build tools
- **Internationalization:** Managed via a dedicated `locales` directory supporting multiple languages

---

## Project Structure

The project is organized into modular directories to ensure maintainability and scalability. Below is an overview of the file structure:

```
.
├── App.tsx
├── components/ # Reusable UI components
│ ├── CharacterProfileImageDropdown/
│ ├── Chat/
│ ├── ExploreLanguageDropdown/
│ ├── Footer/
│ ├── Header/
│ ├── ImageSlider/
│ ├── ImageViewer/
│ ├── Init/
│ ├── JSONToText/
│ ├── LatestBestWorstDropdown/
│ ├── Layouts/ # Layout components (e.g., Landing, Story, Pricing) for SSR
│ ├── LeftPanel/
│ ├── Loading/
│ ├── LoginModal/
│ ├── MainLayout/
│ ├── MarkdownToHTML/
│ ├── Meta/
│ ├── ModeDropdown/
│ ├── OptionsDropdown/
│ ├── Overlay/
│ ├── ProfileDropdown/
│ ├── SendChatInput/
│ ├── Settings/
│ └── TransitionImage/
├── hooks/ # Custom React hooks (API calls, auto-scroll, WebSocket, etc.)
├── icons/ # SVG and icon components
├── locales/ # Internationalization files for multiple languages
├── pages/ # Next.js pages & routing (e.g., explore, story, game)
├── routes/ # Additional routing and view components
├── store/ # Redux store configuration and feature slices
├── types/ # TypeScript definitions for characters, chat, games, stories, etc.
└── utils/ # Utility functions and constants
```

This structure ensures that each feature—from chat interactions to character explorations—is isolated in its own module, simplifying development and maintenance.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org) (v14 or higher)
- [Yarn](https://yarnpkg.com)

### Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/danielfebrero/lola-webapp.git
cd lola-webapp
```

2. **Install Dependencies:**

```bash
yarn install
```

3. **Run the development server**

```bash
yarn dev
```
