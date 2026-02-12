# Specification

## Summary
**Goal:** Add an Admin Dashboard Settings modal that lets admins save a Gemini API key to browser localStorage.

**Planned changes:**
- Add a new grey/black styled “⚙️ Settings” button to the Admin Dashboard main action area alongside existing admin actions.
- Implement a modal dialog opened by the Settings button containing a password-masked input labeled “Gemini API Key” and a “Save Settings” button.
- Prefill the input from localStorage key `gemini_api_key` when the modal opens, and on save store the trimmed value back to `gemini_api_key` and show the success message “API Key Saved Successfully! ✅”.

**User-visible outcome:** Admins can open a Settings popup from the Admin Dashboard, enter/update a hidden Gemini API key, save it to localStorage, and see a success confirmation.
