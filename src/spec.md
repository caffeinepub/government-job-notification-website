# Specification

## Summary
**Goal:** Update the Client Admin login to use a new strong password and ensure authentication is exact, case-sensitive, and preserves special characters.

**Planned changes:**
- Replace the hardcoded Client Admin password in `frontend/src/hooks/useClientAdminAuth.ts` with exactly `@ni#ra&j*gurja:r`.
- Ensure the password input in `frontend/src/pages/ClientAdminPage.tsx` accepts and submits special characters unchanged (no trimming/sanitizing/normalization).
- Ensure authentication uses an exact, case-sensitive string match so only the exact password unlocks the admin panel/dashboard.

**User-visible outcome:** Users can log into the Client Admin area only by entering the exact password `@ni#ra&j*gurja:r` (including special characters and exact letter casing); any other input continues to show the existing error and does not unlock the admin UI.
