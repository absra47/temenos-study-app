# FIF Sandbox Lab — Verification Checklist

Run this against the live T24 test environment (office network / VPN) to confirm the
7 Financial Inclusion labs in `LABS` (components/TemenosStudyApp.jsx).

For each row: confirm it exists / matches, then write the **actual** value seen.
Reads only — no INPUT / COMMIT / AUTHORISE unless a step explicitly needs it, and
you press the key.

Legend: ☐ not checked · ✅ matches · ✏️ corrected (note new value) · ❌ not found

---

## lab-rbhp — Explore your Role-Based Home Page  (§fif-1)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Home page that loads for AUTHOR — menus/tiles limited to role | "your RBHP" | | ☐ |
| 2 | Single Customer View — exact tile / menu name | "Single Customer View (SCV)" | | ☐ |
| 3 | SCV search accepts name **and** mnemonic | both | | ☐ |
| 4 | SCV tabs present: record, accounts, loans, documents, relationships | 5 tabs listed | | ☐ |
| 5 | Work List / pending-items tile — exact name | "Work List / pending items" | | ☐ |
| 6 | Work List enquiry name | `EXCEPTION` | | ☐ |
| 7 | Command-line app outside USSP → access denied | denied | | ☐ |

---

## lab-customer — Create and authorise a customer  (§fif-2)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Menu path to create a customer | "Customer > Create Customer" (tile "Customer"/"New Customer") | | ☐ |
| 2 | Application name | `CUSTOMER` | | ☐ |
| 3 | Numeric ID length / auto-generation | 7–10 digits, reserved/auto | | ☐ |
| 4 | Mnemonic → ID link table | `MNEMONIC.CUSTOMER` | | ☐ |
| 5 | Fields on input screen: Mnemonic, Short Name, Name(s), Street, Town/Country, Sector, Target, Customer Status, Account Officer, Language, Nationality, Residence | all present | | ☐ |
| 6 | Account Officer field label (DAO) | "Account Officer (DAO)" | | ☐ |
| 7 | Status after commit | `INAU` | | ☐ |
| 8 | After authorise: amendable anytime, never reversible | confirm in VIEW / no reverse option | | ☐ |

---

## lab-relation — Link a relationship between two customers  (§fif-2)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Where relationships are entered | customer amend mode > Relationship section | | ☐ |
| 2 | Table / application | `RELATION` | | ☐ |
| 3 | Fields: related customer ID + relation code | both | | ☐ |
| 4 | Example relation code for spouse | "spouse" (find real code) | | ☐ |
| 5 | Reverse relationship auto-defaults on the other customer | auto (not entered) | | ☐ |

---

## lab-group — Create a lending group  (§fif-4)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Menu path | "Group Management > Create Group" | | ☐ |
| 2 | Application name | `GROUP` | | ☐ |
| 3 | Group Type drives limits / product eligibility / meeting rules | yes | | ☐ |
| 4 | A group links to only one Centre | one | | ☐ |
| 5 | Member table — each member must pre-exist as a customer | yes | | ☐ |
| 6 | Meeting / centre-meeting schedule fields | present | | ☐ |
| 7 | Single Group View — exact name | `SGV` / "Single Group View" | | ☐ |
| 8 | SGV shows: members, meeting details, available limit, member transfers | all | | ☐ |
| 9 | Credit Block on a member sets customer field | `BLOCKED` | | ☐ |

---

## lab-psos — Payment Source, Obligation and Split  (§fif-6)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | All three set up from the customer's SCV | yes | | ☐ |
| 2 | Payment Source application | `EB.ALERT.REQUEST` | | ☐ |
| 3 | Payment Obligation application | `EM.PS.OBLIGATION.INPUT` | | ☐ |
| 4 | Payment Split application | `EM.PS.PAYMENT.SPLIT` | | ☐ |
| 5 | Obligation amount types | User Defined / Track Loan Repayment / Track Loan Arrears | | ☐ |
| 6 | Obligation has a "next run date" field | yes | | ☐ |
| 7 | Service required in AUTO | `EVENT` (Business Events) | | ☐ |
| 8 | Obligation actions processed at COB on next run date | COB | | ☐ |
| 9 | Split to an inactive obligation is skipped | skipped | | ☐ |

---

## lab-dividend — Run the Dividend Runner  (§fif-5)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Menu path | "Dividend Processing > Dividend Runner" | | ☐ |
| 2 | Application name | `EM.DIVIDEND.RUN` | | ☐ |
| 3 | Account field controlling eligibility | `DVND.CALC` (Yes/No) | | ☐ |
| 4 | Runner has Simulation and Post modes | both | | ☐ |
| 5 | Runner inputs: period + Rate | both | | ☐ |
| 6 | Formula | (Dividend Points ÷ Days in Year) × Rate | | ☐ |
| 7 | Points source | average daily balance above the minimum | | ☐ |
| 8 | Results table | `EM.DIVIDEND.RUN.DETAILS` | | ☐ |
| 9 | Post issues a note to each member | yes | | ☐ |

---

## lab-bulkao — Bulk account-officer transfer via file upload  (§fif-3)

| # | Confirm | App code says | Actual | Status |
|---|---|---|---|---|
| 1 | Menu path | "Task Management / File Upload" | | ☐ |
| 2 | Framework | DFE (Data Formatting Engine) | | ☐ |
| 3 | Column-to-field mapping table | `DFE.MAPPING` | | ☐ |
| 4 | Uploaded rows land in status | `INAU` | | ☐ |
| 5 | Service that auto-starts on authorising the bulk change | `SG.BA.CHANGE.DAO` | | ☐ |
| 6 | Services required in AUTO | `TM.PROCESS` and `EVENT` | | ☐ |
| 7 | 3 task actions | Execute / Reassign / View | | ☐ |

---

## After the run

- List every ✏️ / ❌ row and the correct value.
- Update the matching `LABS` entry in `components/TemenosStudyApp.jsx`.
- Re-check any quiz question in the `fif` course that referenced a changed value.
