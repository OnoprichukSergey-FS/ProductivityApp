
# ProductivityApp — Task Management Application

A cross-platform productivity application built with React Native, Expo, and TypeScript. The app helps users organize daily tasks, manage priorities, track completion, and stay focused through a clean, user-friendly interface.

## Features

- Create tasks with titles, descriptions, priorities, and due dates
- Mark tasks as completed or active
- Delete tasks
- Filter tasks by All, Active, and Completed
- View task statistics and completion progress
- Store task data locally
- Navigate between task management and settings screens
- Support web, iOS, and Android through Expo

## Tech Stack

- **React Native** — Cross-platform user interface
- **Expo** — Development tooling and platform support
- **Expo Router** — File-based navigation
- **TypeScript** — Type-safe application development
- **NativeWind / Tailwind CSS** — Styling
- **Expo SQLite** — Local database storage on supported native platforms
- **Browser localStorage** — Task persistence on the web

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  add-task.tsx
  settings.tsx

components/
  TaskItem.tsx

services/
  db.ts
  db.web.ts
  settings.ts

types/
  task.ts

assets/
```

## How It Works

The application allows users to create and manage tasks through a straightforward interface.

Tasks can include descriptions, priorities, and due dates. Users can update completion status, delete tasks, and filter their task list.

The app separates the user interface from its data management logic.

On supported native platforms, task data is stored using Expo SQLite. On the web, a platform-specific storage implementation uses browser localStorage.

The native storage implementation also includes an in-memory fallback if SQLite initialization fails.

## Installation and Setup

**Requirements:** Node.js and npm.

Clone the repository:

```bash
git clone https://github.com/OnoprichukSergey-FS/ProductivityApp.git
```

Navigate into the project:

```bash
cd ProductivityApp
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run the web version:

```bash
npm run web
```

To work with native platforms, use the appropriate Expo development environment.

## Technical Highlights

This project demonstrates:

- Component-based application architecture
- TypeScript interfaces and type definitions
- React state management
- File-based navigation with Expo Router
- Asynchronous local data operations
- Platform-specific storage implementations
- Task filtering and progress calculations
- Reusable UI components

## Potential Future Improvements

- User accounts and authentication
- Cloud synchronization across devices
- Task categories and tags
- Drag-and-drop task organization
- Notifications and reminders
- Automated testing

## Author

**Sergey Onoprichuk**

Web Development Graduate | Cybersecurity Student

[GitHub Profile](https://github.com/OnoprichukSergey-FS)
