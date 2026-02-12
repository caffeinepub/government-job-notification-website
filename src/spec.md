# Specification

## Summary
**Goal:** Unblock the Admin Panel by replacing the modal password gate and access-denied screen with a visible in-page admin login, and hide dashboard controls until successfully unlocked.

**Planned changes:**
- Remove the red “Access Denied” destructive alert UI and any guard/navigation logic that renders it for the Admin Panel unlock flow.
- Replace the modal-based admin password prompt with an in-page Admin Panel login form that shows when not unlocked:
  - Headline text: “Admin Login”
  - Password input: type="password", placeholder “Enter Password”
  - Large green button: “Unlock Dashboard”
- Implement unlock logic for the in-page form:
  - If password matches `@ni#ra&j*gurja:r`, set `localStorage.setItem('isAdmin','true')` and refresh the Admin Panel section to reveal dashboard content without a full page reload.
  - If password is incorrect, trigger `window.alert('Wrong Password')` exactly.
- Gate Admin Panel dashboard controls so they only render when `localStorage.isAdmin === 'true'`, specifically hiding/showing: “Job Posts”, “Settings”, and “Manage Quiz”.

**User-visible outcome:** Visiting the Admin Panel shows a simple in-page password form (no access-denied alert, no modal). After entering the correct password, the dashboard controls and content become available; otherwise, the user sees a browser alert stating “Wrong Password”.
