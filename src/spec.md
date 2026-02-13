# Specification

## Summary
**Goal:** Prevent incorrect “Access Denied” flashes for admins on admin job post routes, provide clearer guidance for non-admin users, and ensure there is a safe way to bootstrap/manage admin authorization after deployment.

**Planned changes:**
- Update the frontend admin route guard to render a dedicated loading state while `useIsAdmin()` is still resolving, and only decide between protected content vs. “Access Denied” after it completes.
- Adjust the “Access Denied” UI copy for authenticated non-admin users to include a clear next step (e.g., sign out/sign in with the admin identity or contact an administrator) while keeping the existing English message.
- Add a backend admin bootstrap/management API in the single Motoko actor to allow granting admin to a principal in a strictly access-controlled way, and ensure `isAdmin()` and job post CRUD behave correctly for admins vs. non-admins.

**User-visible outcome:** Admin users can navigate to `/admin`, `/admin/dashboard`, `/admin/posts`, and `/admin/posts/:id/edit` without seeing a transient or stuck “Access Denied” message; non-admin users get clear guidance on what to do next; and deployments have a safe, documented way to establish at least one administrator so legitimate admins are not permanently blocked.
