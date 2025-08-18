# Developer Guide

## Project Structure

```text
steprun.ai
├── frontend
├── backend
├── docker-compose.yml
├── hooks
├── DEVLOG.md
└── README.md
```

## Starting the Project

Since the application runs with `sandboxed` user privileges, you need to build and run the project in a Docker container.

### Docker-Compose

- Install Docker and Docker-Compose
- Build and run the project: `docker compose up -d`

### Frontend

Based on React and Next.js.

- Install dependencies: `pnpm i`
- Start development server: `pnpm dev`

### Backend

Based on FastAPI and Python. Backend services must run in Docker container with `sandboxed` user privileges.

## Architecture

- each script is running in a separate python process in the `sandboxed` user space.
- `sandboxed` user accesses are strictly limited, e.g. fs access.
- each script process `pwd` is located in `/sandboxes/sandbox_{session-id}`
- `dmtcp` is used to enable checkpointing and restoring of the python process.
  - snapshot files is stored in `/sandboxes/snapshots`
- each python process has shared libraries in `/sandboxes/shared_libs`, and temp libraries in `/sandboxes/sandbox_{session-id}/lib`

### repl for nested code execution

Use `code.interact(banner="",exitmsg="uniquePrefx-[serial]")` to get the nested code execution step by step.
