# Feature Request: Task Comments

**Author:** Jimin (PM)  
**Date:** 2026-03-15  
**Status:** Approved  
**Priority:** High

---

## Overview

We need to add a commenting system to our task management API. Users should be able to leave comments on tasks to facilitate discussion and collaboration.

## Requirements

### Data Model

Each comment should have the following fields:
- `id` — Unique identifier
- `userId` — The user who wrote the comment
- `text` — The comment body
- `taskId` — The task this comment belongs to
- `createdAt` — Timestamp when the comment was created

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tasks/:taskId/comments` | Create a new comment |
| GET | `/tasks/:taskId/comments` | List all comments for a task |
| GET | `/tasks/:taskId/comments/:id` | Get a single comment |
| PATCH | `/tasks/:taskId/comments/:id` | Update a comment |
| DELETE | `/tasks/:taskId/comments/:id` | Delete a comment |

### Business Rules

1. Only the comment author can edit their own comments.
2. Users can delete their comments.
3. When a comment is added to a task, notify the task's assignee.
4. A task must exist for a comment to be created on it.
5. Comment content must not be empty.

### Validation

- All inputs should be validated
- Use Zod schemas for request validation
- Return appropriate error codes (400, 404, etc.)

## General Guidelines

- Follow existing codebase conventions and patterns
- Add appropriate error handling
- Make sure existing tests continue to pass
- Add the comment routes to the main app

## Out of Scope

- Comment threading / replies
- Rich text formatting
- File attachments
- Comment reactions (likes, etc.)
