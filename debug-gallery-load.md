# Debug Session: gallery-load
- **Status**: [OPEN]
- **Issue**: Gallery photos do not load when navigating directly from the customer or admin side; opening admin gallery first makes them appear.
- **Debug Server**: Pending
- **Log File**: .dbg/trae-debug-log-gallery-load.ndjson

## Reproduction Steps
1. Start the app.
2. Navigate to Gallery from the customer navbar.
3. Navigate to Gallery from the admin sidebar.
4. Compare with opening admin Gallery first.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | The Supabase storage list request fails on the first gallery mount. | High | Low | Pending |
| B | The gallery effect does not rerun when the route changes. | Medium | Low | Pending |
| C | The storage list succeeds but returns no image objects. | Medium | Low | Pending |
| D | Public image URLs are built incorrectly or images fail after listing. | Medium | Low | Pending |

## Log Evidence
Pending runtime reproduction.

## Verification Conclusion
Pending pre-fix and post-fix runtime verification.
