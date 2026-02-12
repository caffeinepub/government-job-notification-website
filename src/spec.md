# Specification

## Summary
**Goal:** Update the Admin Panel access flow to use a password login modal (no immediate “Access Denied”), persist admin unlock via localStorage, and support logout.

**Planned changes:**
- When navigating to the Admin Panel while not unlocked, automatically open a modal prompting “Enter Admin Password” with a masked password input and a “Login” action (no initial “Access Denied” screen).
- Validate the entered password against the exact string `@ni#ra&j*gurja:r`; on success set `localStorage.setItem('isAdmin','true')` and close the modal; on failure show a browser alert exactly “Wrong Password!”.
- On Admin Panel load/entry, check `localStorage.getItem('isAdmin') === 'true'` to decide whether to show the dashboard immediately or open the login modal.
- After successful login, display the Admin Panel dashboard actions (“Job Posts”, “Quiz”, “Settings”) and add a small top-right “Logout” button that clears/resets the `isAdmin` localStorage flag and returns the panel to the locked state.

**User-visible outcome:** Clicking the Admin Panel always prompts for an admin password (unless already unlocked). After logging in, the dashboard options appear and the user can log out to lock the Admin Panel again.
