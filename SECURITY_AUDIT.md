# Precision Khamari security review

## Scope
Reviewed the tRPC procedures, authentication boundaries, field ownership patterns, user-entered records, external links, and client routing on 12 November 2026.

## Findings and remediation

- Protected procedures use the authenticated session context for fields, soil tests, records, chat, yields, and exports.
- User-facing field names, notes, and AI messages now have server-side length and non-empty validation through Zod.
- The AI assistant is server-side only; model credentials are not exposed to the browser.
- Cadastral fields are explicitly farmer-entered/verified metadata and are not presented as legal ownership proof.
- External official land links use a new tab with `rel="noreferrer"`.
- Chat field selection no longer uses an invalid empty Radix Select value.
- The app does not request national ID, deed scans, bank credentials, or pesticide purchase credentials in chat.
- GPS and reverse-geocoded values are treated as advisory location data, not a legal survey.

## Remaining operational guidance

Keep dependencies updated through the managed WebDev environment, review production logs for failed authentication or LLM calls, and avoid storing secrets in client code or committed `.env` files.
