// Yehulu Microfinance Core Banking UAT Test Script v1.0 (Pitron Tech Solutions).
// Extracted from the UAT workbook — the prepared script (columns A–H); tester columns omitted.
export const UAT_MODULES = [
 {
  "id": "01",
  "code": "01 Security and Users",
  "title": "Module 1 - Security, Users, Roles and Access Control",
  "cases": [
   {
    "id": "SEC-001",
    "sub": "User Creation",
    "desc": "Create a new user profile in the CBS with role, branch and access-type assignment",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "System Administrator profile available; branch and role static data already created",
    "steps": [
     "Log in as System Administrator",
     "Navigate to User Maintenance and create a new user",
     "Capture user name, sign-on name, department/branch, role and access type",
     "Commit the record"
    ],
    "data": "User: UAT.CSO.01 / Branch: ET-001-0001 / Role: Customer Service Officer",
    "expected": "User record is created and held in unauthorised (INAU) status awaiting a checker; all mandatory fields are validated"
   },
   {
    "id": "SEC-002",
    "sub": "User Authorisation",
    "desc": "Authorise a newly created user profile under maker-checker",
    "ref": "RGD 3.1 / 4.1 Approval Matrix",
    "pre": "Unauthorised user record UAT.CSO.01 exists",
    "steps": [
     "Log in as a second administrator (checker)",
     "Retrieve the unauthorised user record",
     "Review the details and authorise"
    ],
    "data": "Record: UAT.CSO.01",
    "expected": "User is authorised and becomes active; audit trail records both the inputter and the authoriser with date and time stamps"
   },
   {
    "id": "SEC-003",
    "sub": "Segregation of Duties",
    "desc": "Verify the same user cannot input and authorise the same user record",
    "ref": "RGD 4.1 / 4.2 Maker-Checker",
    "pre": "Unauthorised user record created by administrator A",
    "steps": [
     "Log in as administrator A (the inputter)",
     "Retrieve the record created in the previous step",
     "Attempt to authorise it"
    ],
    "data": "Record created by the same sign-on ID",
    "expected": "System rejects the action with a segregation-of-duties error; the same user ID cannot act as both maker and checker on one record"
   },
   {
    "id": "SEC-004",
    "sub": "First Login",
    "desc": "First-time login forces password change",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Authorised user with system-generated password",
    "steps": [
     "Log in with the user name and initial password",
     "Observe the forced password-change prompt",
     "Set a new password that complies with the password policy"
    ],
    "data": "User: UAT.CSO.01",
    "expected": "Login is not permitted until the password is changed; the new password is accepted only if it satisfies the configured complexity, length and history rules"
   },
   {
    "id": "SEC-005",
    "sub": "Password Policy",
    "desc": "Invalid password attempts lock the user account",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Active authorised user exists",
    "steps": [
     "Attempt login with an incorrect password for the configured number of consecutive attempts",
     "Attempt a further login with the correct password"
    ],
    "data": "User: UAT.CSO.01 / deliberate wrong password",
    "expected": "The account is locked after the configured number of failed attempts and the correct password is refused until an administrator resets the account"
   },
   {
    "id": "SEC-006",
    "sub": "Password Reset",
    "desc": "Administrator resets a locked user account",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "User account is in locked status",
    "steps": [
     "Log in as System Administrator",
     "Reset the password / unlock the user record",
     "Have the user log in with the reset password"
    ],
    "data": "User: UAT.CSO.01",
    "expected": "Account is unlocked, the user logs in successfully and is again forced to change the password on first use"
   },
   {
    "id": "SEC-007",
    "sub": "Role-Based Access",
    "desc": "CSO role permits transaction input but not authorisation",
    "ref": "RGD 4.1 / 4.2 Approval Matrix",
    "pre": "User UAT.CSO.01 attached to the Customer Service Officer role",
    "steps": [
     "Log in as UAT.CSO.01",
     "Input a customer record and commit",
     "Attempt to authorise an unauthorised transaction from the checker queue"
    ],
    "data": "Role: Customer Service Officer",
    "expected": "Input is allowed and the record is held unauthorised; the authorisation function is either hidden or rejected for this role"
   },
   {
    "id": "SEC-008",
    "sub": "Role-Based Access",
    "desc": "SCSO / CSM role permits first-level authorisation",
    "ref": "RGD 4.1 / 4.2 Approval Matrix",
    "pre": "Unauthorised customer record exists; user attached to SCSO or CSM role",
    "steps": [
     "Log in as UAT.SCSO.01",
     "Open the authorisation queue",
     "Authorise the pending customer record"
    ],
    "data": "Role: Senior Customer Service Officer / Customer Service Manager",
    "expected": "The record is authorised at first level and, where a second authorisation is configured, moves to the Branch Manager queue rather than going live"
   },
   {
    "id": "SEC-009",
    "sub": "Role-Based Access",
    "desc": "Branch Manager performs second-level authorisation",
    "ref": "RGD 4.1 / 4.2 Approval Matrix",
    "pre": "Record has passed first-level authorisation",
    "steps": [
     "Log in as UAT.BM.01",
     "Open the second-authoriser queue",
     "Authorise the record"
    ],
    "data": "Role: Branch Manager",
    "expected": "The record is fully authorised and live; the audit trail shows inputter, first authoriser and second authoriser separately"
   },
   {
    "id": "SEC-010",
    "sub": "Module Restriction",
    "desc": "User cannot access a module not assigned to the role",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "User role has no loan-module entitlement",
    "steps": [
     "Log in as a teller-only user",
     "Attempt to open the loan origination menu or launch the application directly"
    ],
    "data": "Role: Teller",
    "expected": "Access is denied; the menu option is not displayed and direct navigation returns an authorisation error that is written to the security log"
   },
   {
    "id": "SEC-011",
    "sub": "Branch Data Segregation",
    "desc": "User attached to one branch cannot view or transact on another branch's records",
    "ref": "RGD 3.2 Branches",
    "pre": "Two branches created and customers/accounts booked in each",
    "steps": [
     "Log in as a user attached to Branch ET-001-0001",
     "Attempt to enquire on and then debit an account belonging to Branch ET-001-0002"
    ],
    "data": "Accounts in two different branches",
    "expected": "The account of the other branch is not retrievable or is view-only per policy, and any transaction attempt is rejected"
   },
   {
    "id": "SEC-012",
    "sub": "User Amendment",
    "desc": "Amend a user's role and branch under maker-checker",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Authorised active user exists",
    "steps": [
     "Log in as administrator and amend the role and branch of UAT.CSO.01",
     "Commit and have a second administrator authorise",
     "Log in as the amended user"
    ],
    "data": "New role: Senior Customer Service Officer",
    "expected": "The amendment is held unauthorised until approved; after authorisation the user's menu and entitlements reflect the new role and branch"
   },
   {
    "id": "SEC-013",
    "sub": "User Closure",
    "desc": "Disable / close a user profile",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Active authorised user exists",
    "steps": [
     "Close or disable the user record and have it authorised",
     "Attempt to log in with that user"
    ],
    "data": "User: UAT.CSO.01",
    "expected": "Login is refused for the closed user; the record is retained for audit purposes and is not physically deleted"
   },
   {
    "id": "SEC-014",
    "sub": "Audit Trail",
    "desc": "All user activity is recorded in the audit trail",
    "ref": "RGD 3.1 / 12 Audit",
    "pre": "Transactions have been input, authorised, amended and reversed during UAT",
    "steps": [
     "Log in as Internal Audit user",
     "Run the audit-trail enquiry for a selected user and date range",
     "Trace one customer record, one account and one transaction end to end"
    ],
    "data": "Date range covering the UAT execution window",
    "expected": "The enquiry shows the record key, function, before/after values, user ID, terminal, company and date-time for every action, and cannot be edited or deleted by any user"
   },
   {
    "id": "SEC-015",
    "sub": "Override Control",
    "desc": "Transaction above the branch limit requires a higher-level override",
    "ref": "RGD 7.4 Transfers / 7.1 Cash Approval Matrix",
    "pre": "Override limits configured per role",
    "steps": [
     "Log in as CSO and input a transfer above the configured override threshold",
     "Commit and observe the override message",
     "Route the transaction to CSM/BM for override approval"
    ],
    "data": "Transfer amount above the configured branch threshold",
    "expected": "The transaction cannot be completed by the CSO; an override is raised and only a CSM/BM sign-on can release it, with the override recorded in the audit trail"
   }
  ]
 },
 {
  "id": "02",
  "code": "02 Static Data",
  "title": "Module 2 - Static Data, Company and Branch Hierarchy",
  "cases": [
   {
    "id": "STD-001",
    "sub": "Company Setup",
    "desc": "Create the Head Office company/entity within the multi-book structure",
    "ref": "RGD 3.2 Branches",
    "pre": "Blank environment; entity code ET-001 agreed",
    "steps": [
     "Log in as System Administrator",
     "Create the Head Office company record with entity code, name, local currency and reporting parameters",
     "Authorise the record"
    ],
    "data": "Entity: ET-001 / Currency: ETB",
    "expected": "Head Office is created in the COMPANY application within the multi-book structure and is available for branch attachment"
   },
   {
    "id": "STD-002",
    "sub": "Branch Setup",
    "desc": "Create a branch and verify the branch code format",
    "ref": "RGD 3.2 Branches",
    "pre": "Head Office company exists",
    "steps": [
     "Create a branch under the Head Office",
     "Capture the branch code in the format entity code + branch code",
     "Authorise and verify the code on the branch enquiry"
    ],
    "data": "Branch code: ET-001-0001",
    "expected": "The branch is created with the code in the ET-001-0001 format; a code that does not follow the agreed structure is rejected"
   },
   {
    "id": "STD-003",
    "sub": "Office Categories",
    "desc": "All nine office categories are configurable",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Head Office company created",
    "steps": [
     "Create one office record for each category: Branch, Credit Department, General Operations, Internal Audit, Finance and HR, CEO, Executive Administration, IT and Cybersecurity, Commercial",
     "Authorise each record"
    ],
    "data": "Nine office categories per Section 3.1",
    "expected": "All nine categories exist as selectable office types; the label 'Branch' is used in place of 'Bank Branch' as agreed for a microfinance institution"
   },
   {
    "id": "STD-004",
    "sub": "Office Hierarchy",
    "desc": "Verify the reporting hierarchy Head Office to User",
    "ref": "RGD 3.1 Office Architecture",
    "pre": "Offices and users created",
    "steps": [
     "Open the office hierarchy view",
     "Trace the structure Head Office > District > Department/Function > Branch > User",
     "Confirm a user is attached at the lowest level"
    ],
    "data": "One complete hierarchy chain",
    "expected": "The hierarchy displays in the agreed sequence and a user attached to a branch rolls up correctly through department, district and head office"
   },
   {
    "id": "STD-005",
    "sub": "Static Hierarchy View",
    "desc": "Office structure is represented in DAO for a static hierarchical view",
    "ref": "RGD 3.2 Branches",
    "pre": "Office hierarchy configured",
    "steps": [
     "Open the DAO hierarchy enquiry",
     "Expand each level and compare against the configured office structure"
    ],
    "data": "Full office structure",
    "expected": "DAO reflects the same structure as the operational hierarchy, with no missing or orphaned nodes"
   },
   {
    "id": "STD-006",
    "sub": "Multi-Book",
    "desc": "All office levels are represented within the multi-book system",
    "ref": "RGD 3.2 Branches",
    "pre": "Companies and branches created",
    "steps": [
     "Post a transaction in a branch",
     "Run the branch-level trial balance and then the consolidated trial balance"
    ],
    "data": "One test transaction",
    "expected": "The entry appears in the branch book and consolidates correctly at Head Office level without duplication"
   },
   {
    "id": "STD-007",
    "sub": "Branch Expansion",
    "desc": "Create additional branches after Go-Live without disturbing existing data",
    "ref": "RGD 3.2 Branches",
    "pre": "Head Office live with at least one branch carrying balances",
    "steps": [
     "Create a new branch record and authorise it",
     "Open a customer and account in the new branch",
     "Re-run the consolidated trial balance"
    ],
    "data": "Branch codes ET-001-0002 to ET-001-0004",
    "expected": "The new branch is created and transacts normally; balances of existing branches are unchanged and the consolidated position remains in balance"
   },
   {
    "id": "STD-008",
    "sub": "Currency",
    "desc": "ETB is set up as the local currency with correct decimal handling",
    "ref": "RGD 5.2 Global Loan Parameters",
    "pre": "Company created",
    "steps": [
     "Open the currency table and verify the ETB record",
     "Post a transaction with centimes and check rounding and display"
    ],
    "data": "ETB, 2 decimal places",
    "expected": "ETB is the local/reporting currency, amounts carry two decimals and no foreign-currency product is offered in Phase 1"
   },
   {
    "id": "STD-009",
    "sub": "Cash Denomination",
    "desc": "Note and coin denominations are configured",
    "ref": "RGD 6.1 Cash Denomination",
    "pre": "Currency table configured",
    "steps": [
     "Open the denomination table for ETB",
     "Verify the notes 200, 100, 50, 10, 5 and 1 and the coins 1, 0.50, 0.25, 0.10, 0.05 and 0.01",
     "Enter a teller deposit and capture the denomination breakdown"
    ],
    "data": "Deposit of 1,356.75 ETB split across denominations",
    "expected": "All listed denominations are available for selection and the captured breakdown must equal the transaction amount before the entry can be committed"
   },
   {
    "id": "STD-010",
    "sub": "Rounding",
    "desc": "Cash transaction rounding follows Ethiopian currency rules",
    "ref": "RGD 6.2 Rounding",
    "pre": "Denominations configured",
    "steps": [
     "Post a cash transaction that produces a fraction below the smallest coin",
     "Observe the rounding applied and the resulting GL entry"
    ],
    "data": "Interest payment producing a value of 0.004 ETB",
    "expected": "The amount is rounded per the agreed rule, the rounding difference is posted to the designated rounding GL account and the customer balance and GL remain in agreement"
   },
   {
    "id": "STD-011",
    "sub": "Calendar",
    "desc": "Working days and public holidays are configured",
    "ref": "RGD 11.1 Phase 1 Items",
    "pre": "Company created",
    "steps": [
     "Load the Ethiopian holiday calendar for the current year",
     "Book a loan whose repayment date falls on a holiday"
    ],
    "data": "Ethiopian public holiday calendar",
    "expected": "Holidays are recognised and the repayment date is moved per the configured business-day convention, with the convention applied consistently across products"
   },
   {
    "id": "STD-012",
    "sub": "Chart of Accounts",
    "desc": "Chart of accounts is loaded and mapped to the reporting lines",
    "ref": "RGD 4.3 / 5.2 GL Mapping",
    "pre": "GL-mapping workshop output signed off",
    "steps": [
     "Load the approved chart of accounts",
     "Run the trial balance and confirm every account maps to a reporting line"
    ],
    "data": "Approved Yehulu chart of accounts",
    "expected": "All GL accounts are created, each is mapped to a balance-sheet or profit-and-loss line, and no unmapped or suspense-only account remains unassigned"
   }
  ]
 },
 {
  "id": "03",
  "code": "03 Customer Onboarding",
  "title": "Module 3 - Customer Onboarding and CIF Maintenance",
  "cases": [
   {
    "id": "CUS-001",
    "sub": "Individual Onboarding",
    "desc": "Create an Individual - Standard customer aged 18 or above",
    "ref": "RGD 4.1 Customer",
    "pre": "CSO user authorised; customer static data configured",
    "steps": [
     "Log in as CSO",
     "Open customer creation and select customer type Individual - Standard",
     "Capture given name, middle name, surname, mother's name, date of birth, nationality, gender, profession and marital status",
     "Commit the record"
    ],
    "data": "DOB giving an age of 35; Nationality Ethiopian",
    "expected": "The customer record is created in unauthorised status with all captured details retained and the customer type set to Individual - Standard"
   },
   {
    "id": "CUS-002",
    "sub": "Junior Onboarding",
    "desc": "Create an Individual - Junior customer below 18 years",
    "ref": "RGD 4.1 Customer",
    "pre": "CSO user authorised",
    "steps": [
     "Create a customer with a date of birth giving an age below 18",
     "Select customer type Individual - Junior",
     "Capture guardian details where required and commit"
    ],
    "data": "DOB giving an age of 15",
    "expected": "The customer is created and classified as Junior; the system derives the age from the date of birth and restricts the customer to products permitted for minors"
   },
   {
    "id": "CUS-003",
    "sub": "Non-Individual Onboarding",
    "desc": "Create a Non-Individual customer with the additional KYC set",
    "ref": "RGD 4.1 Customer / Extra KYC",
    "pre": "CSO user authorised",
    "steps": [
     "Select customer type Non-Individual",
     "Capture registered company name, headquarters, main business purpose, TIN and business licence details",
     "Capture the names of authorised account operators",
     "Commit the record"
    ],
    "data": "Registered enterprise with valid TIN and trade licence",
    "expected": "The Non-Individual customer is created with all corporate KYC fields captured; individual-only fields are suppressed or made non-mandatory"
   },
   {
    "id": "CUS-004",
    "sub": "Signatory Mandates",
    "desc": "Capture multiple authorised signatories and mandate thresholds for a Non-Individual",
    "ref": "RGD 4.1 Extra KYC",
    "pre": "Non-Individual customer record exists",
    "steps": [
     "Open the signatory/mandate section",
     "Add three authorised signatories with specimen signatures",
     "Define the mandate threshold requiring two signatures above a stated amount",
     "Commit and authorise"
    ],
    "data": "Three signatories; dual-signature mandate above a defined amount",
    "expected": "Multiple mandates are held against the customer and the mandate rule is retrievable at the point of transaction authorisation"
   },
   {
    "id": "CUS-005",
    "sub": "Customer ID",
    "desc": "Customer ID is auto-generated within the agreed length",
    "ref": "RGD 4.1 Customer",
    "pre": "Customer ID generation rules configured to 5-8 digits",
    "steps": [
     "Create and authorise three customers in succession",
     "Note the customer IDs generated"
    ],
    "data": "Three consecutive customer creations",
    "expected": "Each customer receives a system-generated ID between 5 and 8 digits, IDs are sequential and unique, and manual entry of a customer ID is not permitted"
   },
   {
    "id": "CUS-006",
    "sub": "Economic Classification",
    "desc": "Classify a customer as a Private Customer",
    "ref": "RGD 4.1 Economic Ownership Classification",
    "pre": "Classification attribute configured with three values",
    "steps": [
     "Create a customer and select the economic ownership classification Private",
     "Commit and authorise",
     "Retrieve the customer and confirm the attribute is stored"
    ],
    "data": "Sole proprietor / market trader",
    "expected": "The Private classification is stored as a customer attribute alongside, and not instead of, the Individual/Non-Individual type, and is available as a reporting selection criterion"
   },
   {
    "id": "CUS-007",
    "sub": "Economic Classification",
    "desc": "Classify a customer as a Government Customer",
    "ref": "RGD 4.1 Economic Ownership Classification",
    "pre": "Classification attribute configured",
    "steps": [
     "Create a Non-Individual customer for a municipal bureau",
     "Select the classification Government",
     "Commit and authorise"
    ],
    "data": "Municipal bureau holding an institutional account",
    "expected": "The Government classification is stored and the customer can be extracted separately for regulatory and portfolio reporting"
   },
   {
    "id": "CUS-008",
    "sub": "Economic Classification",
    "desc": "Classify a customer as a Public Enterprise Customer",
    "ref": "RGD 4.1 Economic Ownership Classification",
    "pre": "Classification attribute configured",
    "steps": [
     "Create a Non-Individual customer for a state-owned corporation",
     "Select the classification Public Enterprise",
     "Commit and authorise"
    ],
    "data": "State-owned corporation",
    "expected": "The Public Enterprise classification is stored and reportable, and the three classifications are mutually exclusive"
   },
   {
    "id": "CUS-009",
    "sub": "Mandatory Fields",
    "desc": "System enforces mandatory customer fields at commit",
    "ref": "RGD 4.1 Customer",
    "pre": "CSO user authorised",
    "steps": [
     "Begin customer creation and deliberately leave mother's name, date of birth and mobile number blank",
     "Attempt to commit the record"
    ],
    "data": "Incomplete customer record",
    "expected": "The record is rejected with a clear message naming each missing mandatory field, and no partial customer record is created"
   },
   {
    "id": "CUS-010",
    "sub": "TIN Validation",
    "desc": "Tax Identification Number accepts only 10 numeric digits",
    "ref": "RGD 4.1 Customer",
    "pre": "CSO user authorised",
    "steps": [
     "Enter a TIN of 9 digits and attempt to commit",
     "Enter a TIN of 11 digits and attempt to commit",
     "Enter a valid 10-digit TIN and commit"
    ],
    "data": "Invalid: 001234567 and 001234567890 / Valid: 0012345678",
    "expected": "Both invalid values are rejected with a format error; only the 10-digit numeric value is accepted and stored"
   },
   {
    "id": "CUS-011",
    "sub": "National ID Validation",
    "desc": "Fayda National ID accepts a 12-digit numeric value",
    "ref": "RGD 4.1 ID Types",
    "pre": "ID type table configured",
    "steps": [
     "Select ID type National ID (Fayda)",
     "Enter an 11-digit value and attempt to commit",
     "Enter the valid 12-digit FIN and commit"
    ],
    "data": "Invalid: 12345678987 / Valid: 123456789876",
    "expected": "The 12-digit numeric format is enforced for the Fayda National ID and any other length is rejected"
   },
   {
    "id": "CUS-012",
    "sub": "Passport Validation",
    "desc": "National Passport accepts two letters followed by seven digits",
    "ref": "RGD 4.1 ID Types",
    "pre": "ID type table configured",
    "steps": [
     "Select ID type National Passport",
     "Enter a value that breaks the format and attempt to commit",
     "Enter a valid value and commit"
    ],
    "data": "Invalid: E1234567 / Valid: EP1234567",
    "expected": "Only the two-letter plus seven-digit alphanumeric format is accepted and stored against the customer"
   },
   {
    "id": "CUS-013",
    "sub": "Driving Licence Validation",
    "desc": "Driver's Licence accepts the agreed alphanumeric format",
    "ref": "RGD 4.1 ID Types",
    "pre": "ID type table configured",
    "steps": [
     "Select ID type Driver's Licence",
     "Enter values that fall outside 1-2 leading numbers followed by 6-8 digits",
     "Enter a valid value and commit"
    ],
    "data": "Valid: 1-123456",
    "expected": "The configured alphanumeric format is enforced and out-of-format values are rejected"
   },
   {
    "id": "CUS-014",
    "sub": "Birth Certificate",
    "desc": "Birth certificate reference accepts a region-varying alphanumeric value",
    "ref": "RGD 4.1 ID Types",
    "pre": "ID type table configured",
    "steps": [
     "Select ID type Birth Certificate",
     "Capture a regional reference and commit"
    ],
    "data": "AA/VERA/2018/12345",
    "expected": "The alphanumeric reference is accepted and stored without imposing a single national format, since the format varies by region or city"
   },
   {
    "id": "CUS-015",
    "sub": "Mobile Number",
    "desc": "Mobile number is prefixed with the Ethiopian country code",
    "ref": "RGD 4.1 Customer",
    "pre": "CSO user authorised",
    "steps": [
     "Enter a mobile number without the +251 prefix",
     "Enter a mobile number with the +251 prefix and commit"
    ],
    "data": "Invalid: 0912345678 without prefix / Valid: +251912345678",
    "expected": "The +251 prefix is applied or enforced and the stored number is in the agreed international format for use by the notification and digital channels"
   },
   {
    "id": "CUS-016",
    "sub": "Document Attachment",
    "desc": "Attach the supporting documents required at onboarding",
    "ref": "RGD 4.1 Customer",
    "pre": "Customer record in progress; document types configured",
    "steps": [
     "Attach a scanned identification document, proof of income and proof of residential address",
     "Attach the customer photograph and specimen signature",
     "Commit and retrieve the customer"
    ],
    "data": "PDF and JPEG files within the configured size limit",
    "expected": "All documents are stored against the customer, are retrievable from the customer enquiry, and the record cannot be authorised while a mandatory document type is missing"
   },
   {
    "id": "CUS-017",
    "sub": "ID Expiry",
    "desc": "Capture identification issue and expiry dates and flag expiry",
    "ref": "RGD 4.1 Customer",
    "pre": "Customer record in progress",
    "steps": [
     "Capture the date of issue, date of expiry and issuing authority",
     "Create a second customer with an already-expired document",
     "Run the expired-ID exception report"
    ],
    "data": "One current document, one expired document",
    "expected": "Issue, expiry and issuing authority are stored; an expired document raises a warning at onboarding and the customer appears on the KYC exception report"
   },
   {
    "id": "CUS-018",
    "sub": "Maker-Checker",
    "desc": "Customer creation follows the CSO to SCSO/CSM to BM approval matrix",
    "ref": "RGD 4.1 Approval Matrix",
    "pre": "Users exist for each role in the matrix",
    "steps": [
     "Input the customer as CSO",
     "Authorise at first level as SCSO or CSM",
     "Authorise at second level as Branch Manager",
     "Check the customer status after each stage"
    ],
    "data": "One new individual customer",
    "expected": "The customer becomes live only after the second authorisation; each stage is separately recorded with user ID and timestamp"
   },
   {
    "id": "CUS-019",
    "sub": "Maker-Checker",
    "desc": "Reject and return a customer record for correction",
    "ref": "RGD 4.1 Approval Matrix",
    "pre": "Unauthorised customer record pending approval",
    "steps": [
     "Log in as authoriser and open the pending record",
     "Reject or return it with a reason",
     "Log in as the original CSO and retrieve the returned record"
    ],
    "data": "Reason: incomplete address documentation",
    "expected": "The record is returned to the inputter with the reason visible, remains unauthorised, and can be corrected and resubmitted without re-keying the whole record"
   },
   {
    "id": "CUS-020",
    "sub": "Duplicate Prevention",
    "desc": "Prevent creation of a duplicate customer with the same identification number",
    "ref": "RGD 4.1 Customer",
    "pre": "An authorised customer already holds Fayda ID 123456789876",
    "steps": [
     "Create a new customer using the same Fayda ID number",
     "Attempt to commit"
    ],
    "data": "Duplicate Fayda ID",
    "expected": "The system raises a duplicate warning or blocks the creation, and the existing customer record is presented for the user to link to instead"
   },
   {
    "id": "CUS-021",
    "sub": "Customer Amendment",
    "desc": "Amend customer details under maker-checker",
    "ref": "RGD 4.1 Customer",
    "pre": "Authorised live customer exists",
    "steps": [
     "Log in as CSO and amend the residential address and mobile number",
     "Commit and authorise as SCSO/CSM",
     "Run the audit enquiry on the customer"
    ],
    "data": "New address and mobile number",
    "expected": "The amendment is held unauthorised until approved and the audit trail retains both the previous and the new values"
   },
   {
    "id": "CUS-022",
    "sub": "Photo and Signature",
    "desc": "Retrieve the customer photograph and signature at the point of transaction",
    "ref": "RGD 4.3 Withdrawal Rules",
    "pre": "Customer with photo and signature uploaded",
    "steps": [
     "Initiate a cash withdrawal on the customer's account",
     "Invoke the signature verification display from the transaction screen"
    ],
    "data": "Existing savings account",
    "expected": "The photograph and specimen signature are displayed to the teller before the withdrawal is completed, satisfying the withdrawal verification rule"
   },
   {
    "id": "CUS-023",
    "sub": "Junior Product Control",
    "desc": "Junior customer is restricted to products permitted for minors",
    "ref": "RGD 4.1 / 5.1 Account Products",
    "pre": "Junior customer created and authorised",
    "steps": [
     "Attempt to open an Ordinary Savings account for the Junior customer",
     "Open a Youth Account for the same customer"
    ],
    "data": "Junior customer aged 15",
    "expected": "Products carrying a minimum age of 18 are not selectable for the Junior customer, while the Youth Account opens successfully"
   },
   {
    "id": "CUS-024",
    "sub": "Customer Enquiry",
    "desc": "Retrieve a consolidated customer view",
    "ref": "RGD 4.1 Customer",
    "pre": "Customer with accounts, deposits and a loan",
    "steps": [
     "Open the customer enquiry and search by name, ID number and mobile number",
     "Review the consolidated position"
    ],
    "data": "Customer with more than one product",
    "expected": "The customer is retrievable by each search key and the enquiry lists all accounts, deposits, loans, balances and linked group memberships in one view"
   },
   {
    "id": "CUS-025",
    "sub": "Age Derivation",
    "desc": "Age is derived from date of birth and drives product eligibility",
    "ref": "RGD 5.2 Eligibility Rules",
    "pre": "Products configured with minimum and maximum ages",
    "steps": [
     "Create a customer aged 17 years and 11 months",
     "Attempt to book a product with a minimum age of 18"
    ],
    "data": "DOB producing an age just below 18",
    "expected": "The system derives the age at the transaction date and blocks the product with a clear eligibility message rather than relying on manual checking"
   }
  ]
 },
 {
  "id": "04",
  "code": "04 Account Management",
  "title": "Module 4 - Account Opening, Maintenance and Closure",
  "cases": [
   {
    "id": "ACC-001",
    "sub": "Account Opening",
    "desc": "Open an Ordinary Savings account with the minimum opening balance",
    "ref": "RGD 5.1 / Build Register - Accounts",
    "pre": "Authorised individual customer exists",
    "steps": [
     "Log in as CSO and open an account under the Ordinary Savings product",
     "Attach the mandate, photo and signature",
     "Fund the account with the minimum opening balance and commit"
    ],
    "data": "Opening deposit 100 ETB",
    "expected": "The account is created in unauthorised status carrying the Ordinary Savings product conditions and the 100 ETB minimum opening balance is enforced"
   },
   {
    "id": "ACC-002",
    "sub": "Account Opening",
    "desc": "Reject an account opening below the minimum opening balance",
    "ref": "RGD 5.1 Minimum Opening Balance",
    "pre": "Authorised customer exists",
    "steps": [
     "Open an Ordinary Savings account",
     "Attempt to fund it with an amount below the product minimum",
     "Commit"
    ],
    "data": "Opening deposit 50 ETB",
    "expected": "The transaction is rejected with a minimum-opening-balance message and the account is not activated"
   },
   {
    "id": "ACC-003",
    "sub": "Account Opening",
    "desc": "Open a Group Account",
    "ref": "Build Register - Accounts",
    "pre": "Group registered and group customer record created",
    "steps": [
     "Open an account under the Group Account product for the group customer",
     "Capture the group signatories",
     "Fund with 100 ETB and commit"
    ],
    "data": "Opening deposit 100 ETB",
    "expected": "The Group Account opens with the group product conditions and is linked to the registered Group ID"
   },
   {
    "id": "ACC-004",
    "sub": "Account Opening",
    "desc": "Open a Youth Account for a junior customer",
    "ref": "Build Register - Accounts",
    "pre": "Junior customer created and authorised",
    "steps": [
     "Open an account under the Youth Account product",
     "Capture guardian details where configured",
     "Fund with 100 ETB and commit"
    ],
    "data": "Junior customer aged 15; deposit 100 ETB",
    "expected": "The Youth Account opens successfully for the minor and carries the 8% interest condition configured for the product"
   },
   {
    "id": "ACC-005",
    "sub": "Account Opening",
    "desc": "Open a Business/Current Account for an individual and for an organisation",
    "ref": "Build Register - Accounts",
    "pre": "Individual and Non-Individual customers exist",
    "steps": [
     "Open a Business/Current Account for an individual and fund it with 1,000 ETB",
     "Open a Business/Current Account for an organisation and fund it with 2,000 ETB",
     "Attempt each with a lower amount"
    ],
    "data": "1,000 ETB individual / 2,000 ETB organisation",
    "expected": "Each account opens at its own minimum and lower amounts are rejected, confirming the differentiated minimum balance by customer type"
   },
   {
    "id": "ACC-006",
    "sub": "Account Numbering",
    "desc": "Account number is generated as a 10-digit sequential number",
    "ref": "RGD 4.2 Accounts",
    "pre": "Numbering series configured to start at 9000000001",
    "steps": [
     "Open and authorise three accounts in succession",
     "Record the account numbers assigned"
    ],
    "data": "Three consecutive account openings",
    "expected": "Numbers are assigned sequentially from 9000000001, each is exactly 10 digits, and the length is preserved as the sequence increases"
   },
   {
    "id": "ACC-007",
    "sub": "Account Numbering",
    "desc": "Account numbers cannot be manually entered or modified",
    "ref": "RGD 4.2 Accounts",
    "pre": "Account opening in progress",
    "steps": [
     "Attempt to type an account number during account opening",
     "Retrieve a live account and attempt to amend its number"
    ],
    "data": "Existing account number",
    "expected": "The account number field is system-controlled and not editable at creation or afterwards by any user role"
   },
   {
    "id": "ACC-008",
    "sub": "Account Numbering",
    "desc": "Closed account numbers are never reused",
    "ref": "RGD 4.2 Accounts",
    "pre": "At least one account has been closed",
    "steps": [
     "Note the account number of a closed account",
     "Open several new accounts and inspect the numbers issued"
    ],
    "data": "Closed account number",
    "expected": "The number of the closed account is not reissued and no duplicate account number can exist in the system"
   },
   {
    "id": "ACC-009",
    "sub": "Account Activation",
    "desc": "Account activates only after KYC, approval and initial deposit are complete",
    "ref": "RGD 4.2 Accounts",
    "pre": "Customer with incomplete KYC",
    "steps": [
     "Open an account for a customer whose KYC documents are incomplete",
     "Attempt to authorise and then transact on it",
     "Complete the KYC, authorise and deposit the minimum balance"
    ],
    "data": "Incomplete then completed KYC",
    "expected": "The account cannot be activated or transacted on until KYC, the approval chain and the initial deposit are all complete; only then does it move to active status"
   },
   {
    "id": "ACC-010",
    "sub": "Maker-Checker",
    "desc": "Account opening follows the CSO to SCSO/CSM to BM matrix",
    "ref": "RGD 4.2 Approval Matrix",
    "pre": "Users exist for each role",
    "steps": [
     "Input the account opening as CSO",
     "Authorise as SCSO/CSM",
     "Authorise as Branch Manager where the second level applies"
    ],
    "data": "One new savings account",
    "expected": "Each authorisation level is applied in sequence and the account is live only after the final authorisation"
   },
   {
    "id": "ACC-011",
    "sub": "Segregation of Duties",
    "desc": "The same user cannot input and authorise an account opening",
    "ref": "RGD 4.2 Accounts",
    "pre": "Unauthorised account record created by a CSO",
    "steps": [
     "Log in as the same CSO who input the record",
     "Attempt to authorise the account opening"
    ],
    "data": "Same sign-on ID",
    "expected": "The system enforces segregation of duties and refuses the authorisation, as required by the scoping document"
   },
   {
    "id": "ACC-012",
    "sub": "Charges",
    "desc": "No account opening charge is levied",
    "ref": "RGD 5.1 Account Opening Charges",
    "pre": "Products configured per the build register",
    "steps": [
     "Open and authorise one account of each product type",
     "Review the account entries and customer statement"
    ],
    "data": "One account per product",
    "expected": "No opening charge is posted on any account product and the opening deposit is credited in full"
   },
   {
    "id": "ACC-013",
    "sub": "Charges",
    "desc": "No ledger or maintenance fee is levied",
    "ref": "RGD 5.1 Ledger / Maintenance Fees",
    "pre": "Active accounts with balances",
    "steps": [
     "Run the month-end close",
     "Review the statements of each account product"
    ],
    "data": "Accounts held for a full month",
    "expected": "No ledger, maintenance, cheque book, card, SMS or e-statement fee is charged on any product"
   },
   {
    "id": "ACC-014",
    "sub": "Interest",
    "desc": "Ordinary Savings interest is accrued and capitalised monthly",
    "ref": "Build Register - Accounts (7.5%)",
    "pre": "Ordinary Savings account funded and active",
    "steps": [
     "Note the balance and value date",
     "Run the daily close for a full month",
     "Review the interest accrual and the capitalisation entry"
    ],
    "data": "Balance 10,000 ETB at 7.5% p.a.",
    "expected": "Interest accrues on the account and is capitalised monthly at the configured rate; the credited amount agrees to the manual recalculation within rounding tolerance"
   },
   {
    "id": "ACC-015",
    "sub": "Interest",
    "desc": "Youth Account interest is accrued and capitalised monthly at the product rate",
    "ref": "Build Register - Accounts (8%)",
    "pre": "Youth Account funded and active",
    "steps": [
     "Run the daily close for a full month",
     "Review the interest accrual and capitalisation entry"
    ],
    "data": "Balance 10,000 ETB at 8% p.a.",
    "expected": "Interest is capitalised monthly at the Youth Account rate and is distinguishable from the Ordinary Savings rate in the GL"
   },
   {
    "id": "ACC-016",
    "sub": "Interest",
    "desc": "Business/Current Account earns no interest",
    "ref": "Build Register - Accounts",
    "pre": "Business/Current Account funded and active",
    "steps": [
     "Run the close for a full month",
     "Review the account statement and interest accrual enquiry"
    ],
    "data": "Balance 50,000 ETB",
    "expected": "No interest is accrued or paid on the Business/Current Account"
   },
   {
    "id": "ACC-017",
    "sub": "Withholding Tax",
    "desc": "Withholding tax is deducted from interest paid on savings",
    "ref": "RGD 4.3 Tax Treatment",
    "pre": "Savings account with interest capitalised",
    "steps": [
     "Run the interest capitalisation",
     "Review the gross interest, the tax deducted and the net credit to the customer"
    ],
    "data": "Gross interest of 100 ETB",
    "expected": "10% withholding tax is deducted from the gross interest, the net amount is credited to the customer and the tax is posted to the withholding tax GL account"
   },
   {
    "id": "ACC-018",
    "sub": "Overdraft Restriction",
    "desc": "Savings and non-current accounts cannot go into debit",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Savings account with a credit balance",
    "steps": [
     "Attempt a withdrawal greater than the available balance on an Ordinary Savings account",
     "Repeat on the Group, Youth and Digital Savings products"
    ],
    "data": "Withdrawal exceeding the available balance",
    "expected": "Every attempt is rejected with an insufficient-funds message; no savings or non-current account can operate with a negative balance"
   },
   {
    "id": "ACC-019",
    "sub": "Statement",
    "desc": "Produce an account statement on customer request",
    "ref": "RGD 5.1 Statement Frequency",
    "pre": "Account with transaction history",
    "steps": [
     "Request a statement for a selected date range",
     "Generate and print or export it"
    ],
    "data": "Date range covering several transactions",
    "expected": "The statement is produced on demand for the requested period, showing opening balance, all movements with value dates and the closing balance that agrees to the account enquiry"
   },
   {
    "id": "ACC-020",
    "sub": "Dormancy",
    "desc": "Account is flagged dormant after the configured period of inactivity",
    "ref": "RGD 4.3 / Build Register - Accounts",
    "pre": "Account with no customer-initiated movement for the dormancy period",
    "steps": [
     "Age the account past the configured dormancy period using only interest postings",
     "Run the daily close and review the account status"
    ],
    "data": "Account with interest postings only",
    "expected": "The account is flagged dormant at the configured period; interest posting alone does not count as movement. Note: the scoping document states one year while the build register states twenty-four months - see the Open Items tab"
   },
   {
    "id": "ACC-021",
    "sub": "Dormancy",
    "desc": "Transactions on a dormant account are blocked until reactivation",
    "ref": "RGD 4.3 Dormancy Rules",
    "pre": "Account flagged dormant",
    "steps": [
     "Attempt a withdrawal from the dormant account",
     "Attempt a deposit to the dormant account"
    ],
    "data": "Dormant account",
    "expected": "Debit activity is blocked and an override or reactivation is required; the treatment of credits follows the configured policy and is applied consistently"
   },
   {
    "id": "ACC-022",
    "sub": "Reactivation",
    "desc": "Reactivate a dormant account under the agreed rule",
    "ref": "RGD 4.3 / Build Register - Accounts",
    "pre": "Dormant account exists",
    "steps": [
     "Perform the reactivation procedure and record the approval",
     "Post the required debit transactions",
     "Re-check the account status"
    ],
    "data": "Two debit transactions within three months",
    "expected": "The account returns to active status once the reactivation rule is satisfied and normal transactions resume"
   },
   {
    "id": "ACC-023",
    "sub": "Account Closure",
    "desc": "Close an account on customer request",
    "ref": "RGD 5.1 Account Closure Rules",
    "pre": "Account with a nil or settled balance",
    "steps": [
     "Settle accrued interest and any outstanding items",
     "Initiate closure with the reason 'customer request'",
     "Authorise the closure"
    ],
    "data": "Account balance transferred out",
    "expected": "The account closes, the residual balance is paid out or transferred, the closure reason is recorded and no further transactions are accepted"
   },
   {
    "id": "ACC-024",
    "sub": "Account Closure",
    "desc": "Close an account required by lawful authority or where a duplicate is held",
    "ref": "RGD 5.1 Account Closure Rules",
    "pre": "Customer holds duplicate accounts",
    "steps": [
     "Initiate closure selecting the reason 'lawful authority' and then 'duplicate account'",
     "Authorise each closure"
    ],
    "data": "Duplicate account of the same customer",
    "expected": "Each closure reason is selectable and stored, and the closure is reflected in the audit trail and closure report"
   },
   {
    "id": "ACC-025",
    "sub": "Account Closure",
    "desc": "Close a zero-balance account not funded within one month of opening",
    "ref": "Build Register - Accounts",
    "pre": "Account opened with zero balance more than one month ago",
    "steps": [
     "Run the close for the period",
     "Review the exception list of unfunded accounts",
     "Apply the closure procedure"
    ],
    "data": "Unfunded account older than one month",
    "expected": "The unfunded account is identified by the system and can be closed under the configured rule"
   },
   {
    "id": "ACC-026",
    "sub": "Transaction Limits",
    "desc": "No transaction limits are applied on account products",
    "ref": "RGD 5.1 Transaction Limits",
    "pre": "Funded account",
    "steps": [
     "Post a high-value deposit and a high-value withdrawal within the available balance",
     "Post several transactions in one day"
    ],
    "data": "Deposit and withdrawal of 500,000 ETB",
    "expected": "No per-transaction or daily count limit blocks the activity, subject only to available balance and the approval matrix for high-value items"
   }
  ]
 },
 {
  "id": "05",
  "code": "05 Savings and Deposits",
  "title": "Module 5 - Savings and Deposit Products",
  "cases": [
   {
    "id": "DEP-001",
    "sub": "Fixed Time Deposit",
    "desc": "Open a Fixed Time Deposit at the minimum opening amount",
    "ref": "RGD 5.3 / Build Register - Savings",
    "pre": "Customer holds an active basic savings account",
    "steps": [
     "Log in as CSO and open a Fixed Time Deposit contract",
     "Capture the principal, term and agreed interest rate",
     "Fund the deposit from the customer's savings account and commit",
     "Authorise the contract"
    ],
    "data": "Principal 100,000 ETB; term 180 days",
    "expected": "The deposit contract is created with the agreed principal, maturity date and rate; the funding account is debited and the deposit GL is credited"
   },
   {
    "id": "DEP-002",
    "sub": "Fixed Time Deposit",
    "desc": "Reject a Fixed Time Deposit below the minimum opening amount",
    "ref": "Build Register - Savings",
    "pre": "Customer with insufficient deposit amount",
    "steps": [
     "Attempt to open a Fixed Time Deposit below the product minimum",
     "Commit"
    ],
    "data": "Principal 50,000 ETB",
    "expected": "The contract is rejected against the configured minimum opening balance for the product"
   },
   {
    "id": "DEP-003",
    "sub": "Fixed Time Deposit",
    "desc": "Term is restricted to the agreed range with a pre-agreed maturity date",
    "ref": "RGD 5.3 Deposit Products",
    "pre": "Product configured for 90 to 365 days or more",
    "steps": [
     "Attempt a term below 90 days",
     "Book a term of 90 days and then 365 days",
     "Verify the maturity date derived in each case"
    ],
    "data": "Terms of 60, 90 and 365 days",
    "expected": "Terms below the minimum are rejected; valid terms are accepted and the maturity date is derived correctly from the value date"
   },
   {
    "id": "DEP-004",
    "sub": "Fixed Time Deposit",
    "desc": "Only a single deposit is permitted at contract opening",
    "ref": "Build Register - Savings",
    "pre": "Active Fixed Time Deposit contract",
    "steps": [
     "Attempt an additional deposit into the existing contract before maturity"
    ],
    "data": "Top-up of 10,000 ETB",
    "expected": "Additional deposits into a live term contract are refused; a new contract must be opened instead"
   },
   {
    "id": "DEP-005",
    "sub": "Fixed Time Deposit",
    "desc": "Capture the negotiated interest rate against the contract",
    "ref": "Build Register - Savings",
    "pre": "Rate negotiation approval recorded",
    "steps": [
     "Open a contract and enter the negotiated rate",
     "Attempt a rate outside the approved band",
     "Authorise at the required level"
    ],
    "data": "Negotiated rate within the approved band",
    "expected": "The negotiated rate is captured at contract level, rates outside the permitted band require a higher approval, and the rate is retained for the life of the contract"
   },
   {
    "id": "DEP-006",
    "sub": "Fixed Time Deposit",
    "desc": "Interest is paid at maturity",
    "ref": "RGD 5.3 / Build Register - Savings",
    "pre": "Fixed Time Deposit approaching maturity",
    "steps": [
     "Run the close through to the maturity date",
     "Review the interest accrual and the payment entry at maturity"
    ],
    "data": "Contract of 180 days",
    "expected": "Interest accrues monthly and is paid on the maturity date net of 10% withholding tax, with the principal handled per the rollover instruction"
   },
   {
    "id": "DEP-007",
    "sub": "Fixed Time Deposit",
    "desc": "Automatic rollover of principal and interest at maturity",
    "ref": "RGD 5.3 Rollover Rule",
    "pre": "Contract with rollover instruction set to principal plus interest",
    "steps": [
     "Set the rollover instruction at contract level",
     "Run the close through maturity",
     "Review the new contract created"
    ],
    "data": "Rollover of principal plus interest for a further 180 days",
    "expected": "A new contract is created automatically for the rolled amount at the applicable rate, retaining the link to the original contract reference"
   },
   {
    "id": "DEP-008",
    "sub": "Fixed Time Deposit",
    "desc": "Early withdrawal before maturity follows the agreed treatment",
    "ref": "RGD 5.3 Penalty / Withdrawal Rule",
    "pre": "Live Fixed Time Deposit before maturity",
    "steps": [
     "Request an early withdrawal of the deposit",
     "Review the interest treatment and any penalty applied",
     "Authorise the break"
    ],
    "data": "Withdrawal at day 60 of a 180-day contract",
    "expected": "The break is processed under the approved rule and the interest treatment applied matches the confirmed policy. Note: the scoping document states no early-withdrawal penalty while the build register states loss of interest - see the Open Items tab"
   },
   {
    "id": "DEP-009",
    "sub": "Fixed Time Deposit",
    "desc": "Pledge a Fixed Time Deposit as security for a loan",
    "ref": "RGD 5.3 Use as Loan Security",
    "pre": "Live Fixed Time Deposit and a loan application in progress",
    "steps": [
     "Link the deposit to the loan as collateral",
     "Attempt to withdraw or break the deposit while the loan is live",
     "Close the loan and re-attempt the withdrawal"
    ],
    "data": "Deposit of 100,000 ETB pledged against a loan",
    "expected": "The deposit is blocked or lien-marked while pledged, the withdrawal attempt is refused, and the lien is released automatically when the loan closes"
   },
   {
    "id": "DEP-010",
    "sub": "Digital Savings",
    "desc": "Open a Yehulu Digital Savings account",
    "ref": "Build Register - Savings",
    "pre": "Customer with registered mobile-money or bank account",
    "steps": [
     "Open a Digital Savings account under the product",
     "Fund it with the minimum opening balance",
     "Authorise the account"
    ],
    "data": "Opening balance 100 ETB",
    "expected": "The account opens under the Digital Savings product with daily interest calculation and the digital channel eligibility recorded"
   },
   {
    "id": "DEP-011",
    "sub": "Digital Savings",
    "desc": "Interest is calculated daily and paid daily",
    "ref": "RGD 4.3 / Build Register - Savings",
    "pre": "Funded Digital Savings account",
    "steps": [
     "Note the opening balance",
     "Run the daily close for five consecutive days",
     "Review the daily interest calculation and the daily credit"
    ],
    "data": "Balance 10,000 ETB at 25% p.a.",
    "expected": "Interest is calculated on the daily balance and credited daily net of withholding tax, and the five-day total agrees to the manual recalculation"
   },
   {
    "id": "DEP-012",
    "sub": "Digital Savings",
    "desc": "0.2% withdrawal charge is applied to Digital Savings withdrawals only",
    "ref": "RGD 5.1 / 4.3 Fees and Charges",
    "pre": "Funded Digital Savings account and a funded Ordinary Savings account",
    "steps": [
     "Withdraw 5,000 ETB from the Digital Savings account",
     "Withdraw 5,000 ETB from the Ordinary Savings account",
     "Compare the charges posted"
    ],
    "data": "Withdrawal 5,000 ETB; expected charge 10 ETB",
    "expected": "A charge of 0.2% is deducted on the Digital Savings withdrawal and posted to the fee income GL, while the Ordinary Savings withdrawal carries no charge"
   },
   {
    "id": "DEP-013",
    "sub": "Digital Savings",
    "desc": "Minimum deposit per transaction is enforced",
    "ref": "Build Register - Savings",
    "pre": "Active Digital Savings account",
    "steps": [
     "Attempt a deposit below the product minimum",
     "Deposit exactly the minimum"
    ],
    "data": "Attempt 10 ETB then 25 ETB",
    "expected": "The below-minimum deposit is rejected and the 25 ETB deposit is accepted"
   },
   {
    "id": "DEP-014",
    "sub": "Women's Savings",
    "desc": "Open a Women's Savings account restricted to eligible customers",
    "ref": "Build Register - Savings",
    "pre": "Female customer and a female-owned entity exist, plus one ineligible customer",
    "steps": [
     "Open a Women's Savings account for the eligible customer",
     "Attempt to open the same product for an ineligible customer"
    ],
    "data": "Eligible and ineligible customers",
    "expected": "The product opens only for women or business entities fully owned by women; the ineligible attempt is blocked or requires a documented override"
   },
   {
    "id": "DEP-015",
    "sub": "Women's Savings",
    "desc": "Interest accrues monthly and is paid monthly at the product rate",
    "ref": "Build Register - Savings",
    "pre": "Funded Women's Savings account",
    "steps": [
     "Run the close for a full month",
     "Review the accrual, the tax deduction and the credit to the customer"
    ],
    "data": "Balance 20,000 ETB at the configured product rate",
    "expected": "Interest is accrued and paid monthly at the product rate net of 10% withholding tax. Note: the scoping document quotes 25% while the build register quotes 10% - see the Open Items tab"
   },
   {
    "id": "DEP-016",
    "sub": "Compulsory Savings",
    "desc": "Open a Compulsory Savings account linked to a loan",
    "ref": "Build Register - Savings",
    "pre": "Approved loan awaiting disbursement",
    "steps": [
     "Open a Compulsory Savings account for the borrower",
     "Capture the undertaking letter reference",
     "Link the account to the loan contract"
    ],
    "data": "Compulsory savings equal to 10% of the loan amount",
    "expected": "The account is opened, linked to the loan and flagged as restricted for the life of the borrowing relationship"
   },
   {
    "id": "DEP-017",
    "sub": "Compulsory Savings",
    "desc": "Funds are restricted while the linked loan remains active",
    "ref": "Build Register - Savings",
    "pre": "Compulsory Savings account linked to an active loan",
    "steps": [
     "Attempt a withdrawal from the compulsory savings account while the loan is active",
     "Close the loan",
     "Re-attempt the withdrawal"
    ],
    "data": "Withdrawal request during and after the loan term",
    "expected": "The withdrawal is blocked while the loan is active and is permitted once the loan is fully settled and the restriction is released"
   },
   {
    "id": "DEP-018",
    "sub": "Compulsory Savings",
    "desc": "Interest is accrued and paid monthly at the product rate",
    "ref": "Build Register - Savings",
    "pre": "Funded Compulsory Savings account",
    "steps": [
     "Run the close for a full month",
     "Review the accrual and the payment"
    ],
    "data": "Balance 10,000 ETB at the configured product rate",
    "expected": "Interest is credited monthly at the product rate net of withholding tax, and the rate is distinguishable from the other savings products in the GL"
   },
   {
    "id": "DEP-019",
    "sub": "Withholding Tax",
    "desc": "10% withholding tax applies consistently across all savings products",
    "ref": "RGD 4.3 / 5.3 Notes",
    "pre": "Interest capitalised on each savings product",
    "steps": [
     "Run interest capitalisation across all savings products",
     "Extract the withholding tax posted per product",
     "Reconcile to the gross interest"
    ],
    "data": "One funded account per savings product",
    "expected": "Withholding tax is deducted at 10% of gross interest on every savings product without exception, and the total agrees to the tax GL balance"
   },
   {
    "id": "DEP-020",
    "sub": "Tax Negotiation",
    "desc": "A local field accommodates a negotiated tax code",
    "ref": "RGD 4.3 Approval Matrix - Tax Negotiation",
    "pre": "Customer with an approved negotiated tax treatment",
    "steps": [
     "Capture the alternative tax code in the local field at account level",
     "Run interest capitalisation",
     "Review the tax applied"
    ],
    "data": "Alternative approved tax code",
    "expected": "The negotiated tax code overrides the default 10% for that account only, requires the configured approval, and the default applies to all other accounts"
   },
   {
    "id": "DEP-021",
    "sub": "Deposit Channels",
    "desc": "Deposits are accepted through all approved channels",
    "ref": "RGD 4.2 / 6.3 Deposit Channels",
    "pre": "Active savings account",
    "steps": [
     "Post a deposit through the branch teller",
     "Post a deposit through the agent channel",
     "Post a deposit through the mobile transfer channel where available in the test environment"
    ],
    "data": "Deposit of 1,000 ETB per channel",
    "expected": "Each channel credits the account correctly, the channel is identifiable on the account statement, and no channel-specific limit blocks the transaction"
   },
   {
    "id": "DEP-022",
    "sub": "Maximum Balance",
    "desc": "No maximum balance or maximum deposit limit is applied",
    "ref": "RGD 4.3 General Parameters",
    "pre": "Active savings account",
    "steps": [
     "Post a very large deposit to a savings account",
     "Review the account balance and any warning raised"
    ],
    "data": "Deposit of 5,000,000 ETB",
    "expected": "The deposit is accepted with no maximum balance restriction, subject to the normal approval matrix for high-value transactions"
   },
   {
    "id": "DEP-023",
    "sub": "GL Posting",
    "desc": "Savings principal, interest and tax post to the correct GL accounts",
    "ref": "RGD 4.3 Accounting / GL Mapping",
    "pre": "Interest capitalisation completed",
    "steps": [
     "Extract the GL entries generated by deposit, withdrawal, interest accrual, interest payment and tax",
     "Compare each to the approved GL mapping"
    ],
    "data": "One full cycle per savings product",
    "expected": "Every entry posts to the account specified in the approved GL mapping, debits equal credits, and no entry falls into an unmapped suspense account"
   }
  ]
 },
 {
  "id": "06",
  "code": "06 Teller and Vault",
  "title": "Module 6 - Teller Operations, Cash and Vault Management",
  "cases": [
   {
    "id": "TLR-001",
    "sub": "Till Management",
    "desc": "Open a teller till with an opening balance",
    "ref": "RGD 7.3 Vault Operations",
    "pre": "Teller user authorised; vault holds cash",
    "steps": [
     "Log in as teller and open the till for the day",
     "Receive the cash allocation from the vault",
     "Confirm the till opening balance"
    ],
    "data": "Opening cash 200,000 ETB",
    "expected": "The till opens with the allocated balance, the vault is reduced by the same amount and the teller position report agrees to the physical cash"
   },
   {
    "id": "TLR-002",
    "sub": "Vault Operations",
    "desc": "Transfer cash from the vault to a till",
    "ref": "RGD 7.3 Approval Matrix",
    "pre": "Vault balance sufficient",
    "steps": [
     "Input the vault-to-till outflow as SCSO-Cash",
     "Authorise as CSO per the approval matrix",
     "Verify the till and vault balances"
    ],
    "data": "Transfer of 100,000 ETB",
    "expected": "The movement follows the SCSO-Cash input and CSO authorisation matrix, and both the vault and till balances update with a full audit trail"
   },
   {
    "id": "TLR-003",
    "sub": "Vault Operations",
    "desc": "Perform an intra-day cash reinforcement from vault to till",
    "ref": "RGD 7.3 Approval Matrix",
    "pre": "Till running low during the day",
    "steps": [
     "Input the reinforcement as SCSO-Cash",
     "Authorise as CSM or BM",
     "Verify the updated till position"
    ],
    "data": "Reinforcement of 50,000 ETB",
    "expected": "The top-up requires CSM/BM authorisation as specified and is reflected immediately in the till position"
   },
   {
    "id": "TLR-004",
    "sub": "Cash Deposit",
    "desc": "Post a cash deposit to a savings account via the teller",
    "ref": "RGD 6.3 Teller Cash Deposits",
    "pre": "Active savings account; till open",
    "steps": [
     "Input the cash deposit and capture the denomination breakdown",
     "Commit and authorise where required",
     "Verify the customer balance, till balance and receipt"
    ],
    "data": "Deposit 5,000 ETB",
    "expected": "The account is credited, the till balance increases by the same amount, the receipt prints and the GL entry is generated correctly"
   },
   {
    "id": "TLR-005",
    "sub": "Cash Deposit",
    "desc": "High-value cash deposit requires supervisory approval",
    "ref": "RGD 7.1 Cash Deposits Approval Matrix",
    "pre": "Approval threshold configured",
    "steps": [
     "Input a deposit above the configured high-value threshold as CSO",
     "Attempt to complete it without approval",
     "Route to SCSO/CSM for approval"
    ],
    "data": "Deposit above the high-value threshold",
    "expected": "The transaction is held pending SCSO/CSM approval and only completes after the approver releases it, with the approval recorded"
   },
   {
    "id": "TLR-006",
    "sub": "Cash Withdrawal",
    "desc": "Post a cash withdrawal from a savings account via the teller",
    "ref": "RGD 6.4 Teller Cash Withdrawal",
    "pre": "Funded savings account; photo and signature on file",
    "steps": [
     "Input the withdrawal and verify the displayed photo and signature",
     "Capture the customer's signature on the voucher",
     "Commit, authorise where required and pay out"
    ],
    "data": "Withdrawal 3,000 ETB",
    "expected": "The withdrawal completes only after signature verification, the account and till balances update, and the withdrawal voucher prints for customer signature"
   },
   {
    "id": "TLR-007",
    "sub": "Cash Withdrawal",
    "desc": "Withdrawal above the available balance is rejected",
    "ref": "RGD 4.2 Overdraft Restriction",
    "pre": "Savings account with a balance of 3,000 ETB",
    "steps": [
     "Attempt to withdraw 5,000 ETB from the account",
     "Observe the system response"
    ],
    "data": "Withdrawal 5,000 ETB against a 3,000 ETB balance",
    "expected": "The transaction is rejected for insufficient funds and no partial payment or negative balance is created"
   },
   {
    "id": "TLR-008",
    "sub": "Cash Withdrawal",
    "desc": "High-value or exceptional withdrawal requires supervisory approval",
    "ref": "RGD 7.1 Cash Withdrawal Approval Matrix",
    "pre": "Approval threshold configured",
    "steps": [
     "Input a withdrawal above the configured threshold as CSO",
     "Route it for SCSO/CSM approval",
     "Complete the payout after approval"
    ],
    "data": "Withdrawal above the high-value threshold",
    "expected": "The withdrawal is held for approval, the approver identity is recorded, and the payout occurs only after release"
   },
   {
    "id": "TLR-009",
    "sub": "Denomination",
    "desc": "Denomination breakdown must equal the transaction amount",
    "ref": "RGD 6.1 Cash Denomination",
    "pre": "Till open",
    "steps": [
     "Input a deposit and enter a denomination breakdown that does not equal the amount",
     "Correct the breakdown to equal the amount and commit"
    ],
    "data": "Deposit 1,356 ETB",
    "expected": "The mismatched breakdown is rejected and the transaction commits only when the denominations total the transaction amount"
   },
   {
    "id": "TLR-010",
    "sub": "Transaction Reversal",
    "desc": "Reverse a same-day teller transaction",
    "ref": "RGD 7.1 Back Office Functions",
    "pre": "Teller transaction posted on the current business day",
    "steps": [
     "Retrieve the transaction reference",
     "Initiate the reversal and authorise it at the required level",
     "Review the account, till and GL entries"
    ],
    "data": "Deposit of 5,000 ETB posted in error",
    "expected": "The reversal restores the account and till balances, generates contra GL entries, and both the original entry and the reversal remain visible on the statement and audit trail"
   },
   {
    "id": "TLR-011",
    "sub": "Till Closure",
    "desc": "Close the till and balance the teller position",
    "ref": "RGD 7.3 Approval Matrix",
    "pre": "Teller has transacted during the day",
    "steps": [
     "Run the teller cash position report",
     "Count the physical cash and enter the closing denomination",
     "Close the till as SCSO-Cash with CSM/BM authorisation"
    ],
    "data": "End-of-day cash count",
    "expected": "The system closing balance agrees to the physical count, the till closes under the SCSO-Cash input and CSM/BM authorisation matrix, and no till can be left open at close of business"
   },
   {
    "id": "TLR-012",
    "sub": "Cash Difference",
    "desc": "Register a till overage or shortage",
    "ref": "RGD 7.3 Fault Registration",
    "pre": "Deliberate difference between the physical count and the system balance",
    "steps": [
     "Enter a closing count that differs from the system balance",
     "Register the difference as CSO and have it authorised by SCSO-Cash or CSM",
     "Review the suspense posting"
    ],
    "data": "Shortage of 100 ETB",
    "expected": "The difference is registered, posted to the cash difference or suspense GL account, and reported for follow-up; the till cannot close with an unexplained difference"
   },
   {
    "id": "TLR-013",
    "sub": "Agent Channel",
    "desc": "Post a deposit and withdrawal through the agent channel",
    "ref": "RGD 6.3 / 6.4 Channels",
    "pre": "Agent configured in the system",
    "steps": [
     "Post a deposit through the agent channel",
     "Post a withdrawal through the agent channel",
     "Review the agent position and settlement entries"
    ],
    "data": "Deposit and withdrawal of 2,000 ETB each",
    "expected": "Both transactions post to the customer account, update the agent float and are identifiable by channel on the statement and in the agent reconciliation report"
   },
   {
    "id": "TLR-014",
    "sub": "Dormant Account",
    "desc": "Teller transactions on a dormant account follow the dormancy rule",
    "ref": "RGD 4.3 Dormancy Rules",
    "pre": "Dormant account exists",
    "steps": [
     "Attempt a teller withdrawal from the dormant account",
     "Attempt a teller deposit",
     "Reactivate and repeat"
    ],
    "data": "Dormant account",
    "expected": "Debit activity is blocked pending reactivation and the teller receives a clear dormancy message rather than a generic error"
   },
   {
    "id": "TLR-015",
    "sub": "Rounding",
    "desc": "Cash transaction rounding is applied and posted correctly",
    "ref": "RGD 6.2 Rounding",
    "pre": "Till open",
    "steps": [
     "Post a transaction producing a fraction below the smallest coin",
     "Review the rounded amount and the GL entry"
    ],
    "data": "Amount producing a sub-coin fraction",
    "expected": "The rounding rule is applied consistently, the difference posts to the rounding GL account and the customer receipt shows the rounded amount actually paid or received"
   },
   {
    "id": "TLR-016",
    "sub": "Teller Reporting",
    "desc": "Produce the teller journal and cash position reports",
    "ref": "RGD 8 Reporting",
    "pre": "Teller has transacted during the day",
    "steps": [
     "Run the teller journal for the day",
     "Run the branch cash position report",
     "Reconcile to the GL cash accounts"
    ],
    "data": "Full day of teller activity",
    "expected": "Both reports reconcile to each other and to the GL cash balance, and every transaction shows the teller ID, time, channel and authoriser"
   }
  ]
 },
 {
  "id": "07",
  "code": "07 Transfers",
  "title": "Module 7 - Transfers and Internal Payments",
  "cases": [
   {
    "id": "TRF-001",
    "sub": "Internal Transfer",
    "desc": "Transfer funds between two accounts of the same customer",
    "ref": "RGD 4.2 Transfers",
    "pre": "Customer holds two funded accounts",
    "steps": [
     "Input an internal transfer between the two accounts",
     "Commit and authorise",
     "Verify both balances and both statements"
    ],
    "data": "Transfer of 5,000 ETB",
    "expected": "The debit and credit post with the same value date and reference, both statements show the transfer and the GL nets to nil for an intra-book movement"
   },
   {
    "id": "TRF-002",
    "sub": "Account to Account",
    "desc": "Transfer funds between accounts of different customers",
    "ref": "RGD 4.2 Transfers",
    "pre": "Two customers with funded accounts",
    "steps": [
     "Input the transfer, capturing the beneficiary details and narrative",
     "Authorise per the approval matrix",
     "Verify both balances"
    ],
    "data": "Transfer of 10,000 ETB",
    "expected": "Funds move correctly between the two customers, the narrative is carried to both statements and the transaction is fully reversible if input in error"
   },
   {
    "id": "TRF-003",
    "sub": "Approval Matrix",
    "desc": "Single transfer follows the CSO to SCSO matrix with override above the threshold",
    "ref": "RGD 7.4 Single Transfers",
    "pre": "Threshold configured; roles set up",
    "steps": [
     "Input a transfer below the threshold as CSO and authorise as SCSO",
     "Input a transfer above the threshold and attempt to authorise as SCSO",
     "Complete the override as CSM/BM"
    ],
    "data": "One transfer below and one above the override threshold",
    "expected": "Below-threshold transfers complete at SCSO level; above-threshold transfers require a CSM/BM override. Note: the scoping document quotes the threshold in MZN and must be restated in ETB - see the Open Items tab"
   },
   {
    "id": "TRF-004",
    "sub": "Bulk Transfer",
    "desc": "Input and authorise a bulk transfer file",
    "ref": "RGD 7.4 Bulk Transfers",
    "pre": "Bulk transfer template prepared",
    "steps": [
     "Upload or key the bulk transfer batch as CSO",
     "Review the batch totals and validation report",
     "Authorise as SCSO/CSM and release"
    ],
    "data": "Batch of 20 credits totalling 200,000 ETB",
    "expected": "The batch validates each line before release, rejects invalid account numbers without failing the whole batch, and the released total agrees to the sum of the individual postings"
   },
   {
    "id": "TRF-005",
    "sub": "Insufficient Funds",
    "desc": "Transfer exceeding the available balance is rejected",
    "ref": "RGD 4.2 Overdraft Restriction",
    "pre": "Account with a balance below the transfer amount",
    "steps": [
     "Attempt a transfer greater than the available balance",
     "Observe the system response"
    ],
    "data": "Transfer of 20,000 ETB against a balance of 5,000 ETB",
    "expected": "The transfer is rejected for insufficient funds and the account is not driven into debit"
   },
   {
    "id": "TRF-006",
    "sub": "Invalid Beneficiary",
    "desc": "Transfer to a closed or invalid account is rejected",
    "ref": "RGD 4.2 Transfers",
    "pre": "One closed account and one non-existent account number",
    "steps": [
     "Attempt a transfer to the closed account",
     "Attempt a transfer to a non-existent account number"
    ],
    "data": "Closed and invalid account numbers",
    "expected": "Both attempts are rejected at input with a clear message, and no suspense entry is created"
   },
   {
    "id": "TRF-007",
    "sub": "Transfer Reversal",
    "desc": "Reverse a transfer posted in error",
    "ref": "RGD 7.1 Back Office Functions",
    "pre": "Authorised transfer posted on the current business day",
    "steps": [
     "Retrieve the transfer reference and initiate the reversal",
     "Authorise the reversal",
     "Verify both accounts and the GL"
    ],
    "data": "Transfer of 10,000 ETB posted in error",
    "expected": "Both legs are reversed with contra entries, balances return to their prior position and the original and reversal both remain on the audit trail"
   },
   {
    "id": "TRF-008",
    "sub": "Loan Repayment Transfer",
    "desc": "Transfer from a savings account to settle a loan instalment",
    "ref": "RGD 4.4 Loans",
    "pre": "Active loan with an instalment due and a funded savings account",
    "steps": [
     "Input a transfer from the savings account to the loan account",
     "Authorise and review the loan schedule"
    ],
    "data": "Instalment amount due",
    "expected": "The instalment is applied to the loan in the correct order of allocation, the schedule updates and the savings account is debited once only"
   }
  ]
 },
 {
  "id": "08",
  "code": "08 Loan Origination",
  "title": "Module 8 - Loan Origination, Approval and Disbursement",
  "cases": [
   {
    "id": "LON-001",
    "sub": "Application Input",
    "desc": "Capture a loan application through the origination workflow",
    "ref": "RGD 4.4 Approval Matrix",
    "pre": "Authorised customer with a savings account; CRO user available",
    "steps": [
     "Log in as Customer Relationship Officer",
     "Create a loan application capturing product, amount, tenor, purpose and repayment frequency",
     "Commit the application"
    ],
    "data": "Short-Term Loan of 50,000 ETB for 6 months",
    "expected": "The application is created with a unique reference in 'Application input' status and is visible in the origination pipeline"
   },
   {
    "id": "LON-002",
    "sub": "Loan Lifecycle",
    "desc": "Application moves through every configured status in sequence",
    "ref": "RGD 4.4 Loan Lifecycle",
    "pre": "Loan application created",
    "steps": [
     "Progress the application through eligibility check, guarantor input, collateral input, credit assessment, review approval, offer production and loan creation",
     "Record the status at each stage"
    ],
    "data": "One complete application",
    "expected": "Each status is reached in the defined sequence, no stage can be skipped, and the status history is retained against the loan reference"
   },
   {
    "id": "LON-003",
    "sub": "Eligibility",
    "desc": "Minimum age of 18 is enforced at application",
    "ref": "RGD 5.2 Eligibility Rules",
    "pre": "Customer aged below 18 exists",
    "steps": [
     "Attempt to create a loan application for the customer aged below 18",
     "Repeat for a customer aged 18 or above"
    ],
    "data": "Customers aged 17 and 25",
    "expected": "The under-age application is blocked with an eligibility message and the eligible application proceeds"
   },
   {
    "id": "LON-004",
    "sub": "Eligibility",
    "desc": "Product-specific minimum age is enforced for Loan Against Property and Vehicle Loan",
    "ref": "Build Register - Loans",
    "pre": "Customer aged 19 exists",
    "steps": [
     "Attempt a Loan Against Property application for the customer aged 19",
     "Attempt a Vehicle Loan for the same customer",
     "Repeat with a customer aged 25"
    ],
    "data": "Customers aged 19 and 25",
    "expected": "The product-specific minimum age is applied per the confirmed parameter. Note: the build register states 21 years while the scoping document states 18 - see the Open Items tab"
   },
   {
    "id": "LON-005",
    "sub": "Eligibility",
    "desc": "Salary Loan maximum age of 60 is enforced",
    "ref": "Build Register - Loans",
    "pre": "Customer aged 62 exists",
    "steps": [
     "Attempt a Salary Loan application for the customer aged 62",
     "Repeat with a customer aged 45"
    ],
    "data": "Customers aged 62 and 45",
    "expected": "The application for the customer above the maximum age is blocked and the eligible application proceeds"
   },
   {
    "id": "LON-006",
    "sub": "Eligibility",
    "desc": "Nationality restriction is enforced",
    "ref": "RGD 5.2 Eligibility Rules",
    "pre": "Non-Ethiopian customer record exists",
    "steps": [
     "Attempt a loan application for a non-Ethiopian customer",
     "Repeat for an Ethiopian customer"
    ],
    "data": "Non-Ethiopian and Ethiopian customers",
    "expected": "The application is restricted to Ethiopian nationals per the product rule, with any exception requiring a documented override"
   },
   {
    "id": "LON-007",
    "sub": "Amount Validation",
    "desc": "Minimum loan amount of 10,000 ETB is enforced",
    "ref": "RGD 5.2 Global Loan Parameters",
    "pre": "Loan application in progress",
    "steps": [
     "Enter a loan amount below 10,000 ETB and commit",
     "Enter exactly 10,000 ETB and commit"
    ],
    "data": "Amounts of 5,000 and 10,000 ETB",
    "expected": "Amounts below the minimum are rejected and the minimum amount is accepted"
   },
   {
    "id": "LON-008",
    "sub": "Amount Validation",
    "desc": "Maximum loan amount of 900,000 ETB is enforced",
    "ref": "RGD 5.2 Global Loan Parameters",
    "pre": "Loan application in progress",
    "steps": [
     "Enter a loan amount above 900,000 ETB and commit",
     "Enter exactly 900,000 ETB and commit"
    ],
    "data": "Amounts of 1,000,000 and 900,000 ETB",
    "expected": "Amounts above the maximum are rejected without an approved override and the maximum amount is accepted"
   },
   {
    "id": "LON-009",
    "sub": "Amount Validation",
    "desc": "Group loan maximum of 3,600,000 ETB is enforced at group level",
    "ref": "Build Register - Loans",
    "pre": "Registered group with member applications",
    "steps": [
     "Build up group exposure towards the group maximum",
     "Attempt an application that would take the group above the maximum"
    ],
    "data": "Group exposure approaching 3,600,000 ETB",
    "expected": "Total group exposure is checked against the group maximum and the excess application is blocked or requires an approved override"
   },
   {
    "id": "LON-010",
    "sub": "Guarantor",
    "desc": "Two guarantors are captured and validated",
    "ref": "RGD 5.2 Guarantor Requirements",
    "pre": "Loan application at guarantor input stage",
    "steps": [
     "Attempt to progress with one guarantor only",
     "Capture two guarantors with valid identification and income evidence",
     "Progress the application"
    ],
    "data": "Two guarantors with valid ID",
    "expected": "The application cannot progress with fewer than the required two guarantors, and guarantor identification and income details are stored against the loan"
   },
   {
    "id": "LON-011",
    "sub": "Collateral",
    "desc": "Capture collateral by type and value",
    "ref": "RGD 5.2 Collateral",
    "pre": "Loan application at collateral input stage",
    "steps": [
     "Capture collateral of type property, machinery, vehicle, guarantor and cheque in turn",
     "Record the valuation, valuation date and valuer",
     "Progress the application"
    ],
    "data": "Property valued at 1,200,000 ETB",
    "expected": "All collateral types are selectable, valuation details are stored, and the collateral is linked to the loan and reportable in the collateral register"
   },
   {
    "id": "LON-012",
    "sub": "Savings Requirement",
    "desc": "10% savings requirement is enforced before disbursement",
    "ref": "RGD 5.2 Savings Requirement",
    "pre": "Approved loan awaiting disbursement",
    "steps": [
     "Attempt disbursement without the compulsory savings in place",
     "Fund the compulsory savings with 10% of the requested amount",
     "Re-attempt disbursement"
    ],
    "data": "Loan 100,000 ETB; compulsory savings 10,000 ETB",
    "expected": "Disbursement is blocked until the 10% savings is deposited and lien-marked; the savings does not earn interest and is not treated as part of the loan principal"
   },
   {
    "id": "LON-013",
    "sub": "Savings Requirement",
    "desc": "Overdraft loans are excluded from the 10% savings rule",
    "ref": "Build Register - Loans",
    "pre": "Approved overdraft facility awaiting activation",
    "steps": [
     "Activate an overdraft facility without compulsory savings",
     "Review the assessment basis recorded"
    ],
    "data": "Overdraft facility",
    "expected": "The overdraft activates without a savings requirement, with the assessment based on transaction history and account turnover instead"
   },
   {
    "id": "LON-014",
    "sub": "Equity Contribution",
    "desc": "Vehicle Loan equity of 30% to 50% is locked until disbursement",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Vehicle Loan application approved",
    "steps": [
     "Deposit the equity contribution into the customer's savings account",
     "Attempt to withdraw the equity before disbursement",
     "Disburse the loan and review the equity treatment"
    ],
    "data": "Vehicle value 600,000 ETB; equity 30%",
    "expected": "The equity is locked in the savings account and cannot be withdrawn before disbursement; the loan cannot be disbursed until the required percentage is on deposit"
   },
   {
    "id": "LON-015",
    "sub": "Fees",
    "desc": "Processing fee of 5% is calculated and collected",
    "ref": "RGD 5.2 Fees and Charges",
    "pre": "Approved loan awaiting disbursement",
    "steps": [
     "Review the fee calculated on the loan schedule",
     "Disburse the loan",
     "Review the fee posting and the net amount received by the customer"
    ],
    "data": "Loan 100,000 ETB; expected fee 5,000 ETB",
    "expected": "The fee is calculated as 5% of the loan request amount, collected at the configured point and posted to the fee income GL, with the customer receiving the correct net proceeds"
   },
   {
    "id": "LON-016",
    "sub": "Fees",
    "desc": "No application fee is charged on any loan product",
    "ref": "RGD 5.2 Fees and Charges",
    "pre": "Loan applications across several products",
    "steps": [
     "Create applications under each loan product",
     "Review the charges raised at application stage"
    ],
    "data": "One application per product",
    "expected": "No application fee is raised on any product, and the only fee at origination is the processing fee"
   },
   {
    "id": "LON-017",
    "sub": "Fees",
    "desc": "Digital Loan fee treatment differs from other products",
    "ref": "Build Register - Loans",
    "pre": "Digital Loan application approved",
    "steps": [
     "Review the fees calculated on the Digital Loan",
     "Compare against the standard 5% processing fee"
    ],
    "data": "Digital Loan of 20,000 ETB",
    "expected": "The Digital Loan is configured with the confirmed fee treatment, which the build register records as not applicable rather than the standard 5% processing fee"
   },
   {
    "id": "LON-018",
    "sub": "Insurance",
    "desc": "Insurance premium is not collected through the loan account",
    "ref": "Build Register - Loans",
    "pre": "Loan application in progress",
    "steps": [
     "Review the fee schedule on the loan",
     "Confirm no insurance fee is deducted by the system"
    ],
    "data": "Any loan product",
    "expected": "No insurance premium is collected by the CBS, since insurance is collected by the insurance company; any premium reference is recorded for information only"
   },
   {
    "id": "LON-019",
    "sub": "Credit Assessment",
    "desc": "Credit assessment captures the approved scoring criteria",
    "ref": "RGD 5.2 Credit Scoring",
    "pre": "Application at credit assessment stage",
    "steps": [
     "Run the credit assessment",
     "Capture repayment history, collateral estimation and transaction/account activity",
     "Record the assessment outcome"
    ],
    "data": "Existing customer with repayment history",
    "expected": "The assessment records all three criteria, produces a documented outcome and is retained against the loan for audit"
   },
   {
    "id": "LON-020",
    "sub": "Approval Hierarchy",
    "desc": "Loan approval follows the defined hierarchy",
    "ref": "RGD 5.2 Approval Hierarchy",
    "pre": "Application ready for approval; users exist at each level",
    "steps": [
     "Route the application through CSO, CSM, Branch Manager, Loan Officer, Loan Supervisor, Loan Department Head and CEO as applicable to the amount",
     "Record the approver at each level"
    ],
    "data": "Loan amount requiring escalation to the highest level",
    "expected": "The application cannot bypass a level in the hierarchy, each approval is recorded with user ID and timestamp, and approval limits by amount are enforced"
   },
   {
    "id": "LON-021",
    "sub": "Offer Production",
    "desc": "Produce the loan offer and repayment schedule for customer acceptance",
    "ref": "RGD 4.4 Loan Lifecycle",
    "pre": "Application approved",
    "steps": [
     "Generate the loan offer document",
     "Generate the repayment schedule",
     "Record customer acceptance"
    ],
    "data": "Approved loan of 100,000 ETB",
    "expected": "The offer shows the amount, tenor, rate, fees, instalment and total repayable, the schedule matches the product terms, and acceptance is recorded before creation"
   },
   {
    "id": "LON-022",
    "sub": "Disbursement",
    "desc": "Disbursement follows the CRO input and dual CSM/BM authorisation matrix",
    "ref": "RGD 4.4 Approval Matrix",
    "pre": "Approved loan with all conditions met",
    "steps": [
     "Input the disbursement as CRO",
     "Authorise at first level as CSM/BM",
     "Authorise at second level as CSM/BM",
     "Verify the credit to the customer account"
    ],
    "data": "Loan of 100,000 ETB",
    "expected": "Disbursement requires both authorisations, and the proceeds are credited only after the second authoriser releases the transaction"
   },
   {
    "id": "LON-023",
    "sub": "Disbursement",
    "desc": "Only a single disbursement is permitted per loan",
    "ref": "RGD 4.4 / 5.2 Disbursement Rules",
    "pre": "Loan disbursed in full",
    "steps": [
     "Attempt a second or partial disbursement against the same loan contract"
    ],
    "data": "Attempt to disburse a further 20,000 ETB",
    "expected": "The system permits a single disbursement only and refuses any subsequent tranche against the same contract"
   },
   {
    "id": "LON-024",
    "sub": "Disbursement",
    "desc": "Proceeds are credited to the customer's designated account",
    "ref": "RGD 4.4 Additional Information",
    "pre": "Approved loan with a nominated settlement account",
    "steps": [
     "Nominate the customer's savings account as the settlement account",
     "Disburse the loan",
     "Verify the credit and the GL entries"
    ],
    "data": "Loan 100,000 ETB net of the 5% fee",
    "expected": "The net proceeds are credited to the nominated account only, the loan GL is debited and the settlement account cannot be changed without authorisation"
   },
   {
    "id": "LON-025",
    "sub": "Base Date",
    "desc": "Interest and schedule are driven from the disbursement date",
    "ref": "Build Register - Loans",
    "pre": "Loan disbursed on a known date",
    "steps": [
     "Disburse the loan and note the value date",
     "Review the first accrual date and the first instalment due date"
    ],
    "data": "Disbursement on a mid-month date",
    "expected": "Interest accrues from the disbursement date and the schedule is derived from that base date rather than the application or approval date"
   },
   {
    "id": "LON-026",
    "sub": "Product Parameters",
    "desc": "Short-Term Loan interest rates vary correctly by tenor",
    "ref": "RGD 5.2 Loan Product Catalogue",
    "pre": "Short-Term Loan product configured",
    "steps": [
     "Book a 3-month loan and check the rate applied",
     "Repeat for 6 months, 10 months and 1 year",
     "Compare each schedule against manual calculation"
    ],
    "data": "Tenors of 3, 6, 10 and 12 months",
    "expected": "The rates 23%, 24%, 24.5% and 25% are applied to the respective tenors and the resulting schedules agree to the manual recalculation"
   },
   {
    "id": "LON-027",
    "sub": "Product Parameters",
    "desc": "Medium-Term Loan is booked at the product tenor and rate",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Medium-Term Loan product configured",
    "steps": [
     "Book a loan for 3 years at the product rate",
     "Attempt a tenor outside 2 to 5 years",
     "Review the generated schedule"
    ],
    "data": "Tenor 3 years at 25% p.a.",
    "expected": "The loan books at 25% per annum on a reducing balance with monthly repayment, and tenors outside 2 to 5 years are rejected"
   },
   {
    "id": "LON-028",
    "sub": "Product Parameters",
    "desc": "Long-Term Loan is booked at the product tenor and rate",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Long-Term Loan product configured",
    "steps": [
     "Book a loan for 10 years at the product rate",
     "Attempt a tenor outside 5 to 15 years",
     "Review the schedule"
    ],
    "data": "Tenor 10 years at 28% p.a.",
    "expected": "The loan books at 28% per annum with monthly repayment, and tenors outside 5 to 15 years are rejected"
   },
   {
    "id": "LON-029",
    "sub": "Product Parameters",
    "desc": "Emergency Loan is booked within the 1 to 12 month range",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Emergency Loan product configured; borrower with a good repayment record",
    "steps": [
     "Attempt an Emergency Loan for a customer with no borrowing history",
     "Book the loan for an existing borrower for 6 months",
     "Review the rate applied"
    ],
    "data": "Tenor 6 months for an existing borrower",
    "expected": "The loan is restricted to current or past borrowers with a good record, books within the 1 to 12 month range and takes the short-term rate classification"
   },
   {
    "id": "LON-030",
    "sub": "Product Parameters",
    "desc": "Micro Housing Loan is booked on medium-term conditions",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Micro Housing Loan product configured",
    "steps": [
     "Book a Micro Housing Loan for 4 years with a stated housing purpose",
     "Apply the 2-month grace period on request",
     "Review the schedule"
    ],
    "data": "Tenor 4 years; purpose house improvement",
    "expected": "The loan books on medium-term conditions with the grace period applied to principal only and the purpose restricted to the approved housing purposes"
   },
   {
    "id": "LON-031",
    "sub": "Product Parameters",
    "desc": "Loan Against Property requires clear-title property collateral",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Loan Against Property product configured",
    "steps": [
     "Attempt to progress the application without property collateral",
     "Capture clear-title property collateral and valuation",
     "Book a loan for 8 years"
    ],
    "data": "Property collateral with clear title; tenor 8 years",
    "expected": "The product cannot be booked without registered property collateral and books within the 5 to 15 year range"
   },
   {
    "id": "LON-032",
    "sub": "Product Parameters",
    "desc": "Salary Loan captures employer and deduction details",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Salary Loan product configured",
    "steps": [
     "Capture the employer, employment start date and salary details",
     "Attempt to book for an employee with under 3 months of service",
     "Book for an eligible employee for 18 months"
    ],
    "data": "Employment of 8 months; tenor 18 months",
    "expected": "The minimum employment period is enforced, employer details are stored and the repayment is set up for direct salary deduction or automatic transfer"
   },
   {
    "id": "LON-033",
    "sub": "Product Parameters",
    "desc": "SME Loan enforces business documentation and operating history",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "SME Loan product configured",
    "steps": [
     "Attempt an SME Loan for a business trading under 6 months",
     "Capture business licence, TIN and revenue evidence for an eligible business",
     "Book the loan with a cash-flow based repayment structure"
    ],
    "data": "Business trading 14 months with valid licence and TIN",
    "expected": "The minimum trading period and documentation requirements are enforced and the repayment can be structured weekly, monthly or flexibly to match business cash flow"
   },
   {
    "id": "LON-034",
    "sub": "Product Parameters",
    "desc": "Yehulu Digital Loan is booked on the digital product conditions",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Digital Loan product configured",
    "steps": [
     "Book a Digital Loan for 2 months",
     "Review the commission calculation and repayment method",
     "Attempt a tenor beyond 3 months"
    ],
    "data": "Loan 20,000 ETB for 2 months at 7% commission per month",
    "expected": "The loan books for 1 to 3 months, the 7% monthly commission is calculated on the disbursed amount on a flat basis with equal principal repayment, and longer tenors are rejected"
   },
   {
    "id": "LON-035",
    "sub": "Product Parameters",
    "desc": "Repayment frequency options are enforced by product",
    "ref": "Build Register - Loans",
    "pre": "Loan products configured",
    "steps": [
     "Book a Short-Term Loan with weekly repayment",
     "Book a Medium-Term Loan and attempt weekly repayment",
     "Review each schedule"
    ],
    "data": "Weekly and monthly frequencies",
    "expected": "Weekly repayment is available on Short-Term and Digital Loans, monthly applies to the remaining products, and unsupported frequencies are not selectable"
   },
   {
    "id": "LON-036",
    "sub": "Schedule Generation",
    "desc": "Annuity repayment schedule is generated on a reducing balance",
    "ref": "RGD 5.2 Repayment Method",
    "pre": "Loan booked and disbursed",
    "steps": [
     "Generate the repayment schedule",
     "Recalculate the instalment, interest and principal split manually for the first three periods",
     "Compare to the system schedule"
    ],
    "data": "Loan 100,000 ETB, 12 months, 25% p.a.",
    "expected": "The instalment is level, the interest is calculated on the reducing outstanding balance, the principal and interest split matches the manual calculation and the final instalment clears the loan to nil"
   },
   {
    "id": "LON-037",
    "sub": "Schedule Generation",
    "desc": "Grace period defers principal only",
    "ref": "RGD 5.2 Grace Period",
    "pre": "Medium or Long-Term Loan with an approved grace request",
    "steps": [
     "Book the loan with a 2-month grace period",
     "Review the first two instalments",
     "Review the schedule after the grace period"
    ],
    "data": "2-month grace on a 3-year loan",
    "expected": "Principal repayment is deferred for two months while interest continues to accrue and is treated per the approved policy; the schedule resumes normally afterwards"
   },
   {
    "id": "LON-038",
    "sub": "Loan Purpose",
    "desc": "Loan purpose codes are captured from the approved list",
    "ref": "RGD 5.2 Loan Purposes",
    "pre": "Purpose code table configured",
    "steps": [
     "Create applications selecting house improvement, house purchase, household, car purchase and working capital in turn",
     "Attempt to commit without a purpose"
    ],
    "data": "Five approved purpose codes",
    "expected": "All approved purposes are selectable, the field is mandatory, and purpose is reportable for portfolio analysis"
   },
   {
    "id": "LON-039",
    "sub": "Currency",
    "desc": "Loans can be booked in ETB only",
    "ref": "RGD 5.2 Global Loan Parameters",
    "pre": "Loan application in progress",
    "steps": [
     "Review the currency options available at application",
     "Attempt to select a currency other than ETB"
    ],
    "data": "Currency selection",
    "expected": "ETB is the only currency available for loan products and no foreign-currency loan can be booked in Phase 1"
   },
   {
    "id": "LON-040",
    "sub": "Negotiability",
    "desc": "Tenor, amount and rate cannot be negotiated at customer level",
    "ref": "RGD 5.2 Negotiability of Terms",
    "pre": "Loan application in progress",
    "steps": [
     "Attempt to override the product interest rate at the individual loan level",
     "Attempt to extend the tenor beyond the product maximum"
    ],
    "data": "Rate and tenor overrides",
    "expected": "Product-level parameters cannot be amended at individual customer level without a controlled override, and any override is logged and reported"
   },
   {
    "id": "LON-041",
    "sub": "Multiple Loans",
    "desc": "Behaviour where a customer holds more than one active loan",
    "ref": "Build Register - Loans (Multi-Loan Policy)",
    "pre": "Customer with one active loan",
    "steps": [
     "Attempt a second loan application for the same customer under a different product",
     "Review any warning or block raised",
     "Record the observed behaviour"
    ],
    "data": "Customer with one active loan",
    "expected": "The system behaviour matches the confirmed multi-loan policy and total customer exposure is visible at application. Note: the maximum concurrent loans and multi-loan policy are not specified in the source documents - see the Open Items tab"
   }
  ]
 },
 {
  "id": "09",
  "code": "09 Loan Servicing",
  "title": "Module 9 - Loan Servicing, Repayment and Delinquency",
  "cases": [
   {
    "id": "LSV-001",
    "sub": "Repayment",
    "desc": "Post a cash repayment through the teller",
    "ref": "RGD 4.4 Loans",
    "pre": "Active loan with an instalment due",
    "steps": [
     "Post the instalment as a cash repayment through the teller",
     "Authorise and review the loan schedule and balances"
    ],
    "data": "Instalment amount due",
    "expected": "The repayment clears the due instalment, the outstanding principal reduces and the schedule shows the instalment as settled"
   },
   {
    "id": "LSV-002",
    "sub": "Repayment",
    "desc": "Instalment is collected automatically from the settlement account",
    "ref": "RGD 4.4 Loans",
    "pre": "Active loan with a funded settlement account and an instalment due",
    "steps": [
     "Run the daily close over the instalment due date",
     "Review the settlement account and the loan schedule"
    ],
    "data": "Funded settlement account",
    "expected": "The instalment is collected automatically on the due date, the settlement account is debited once and the schedule is updated"
   },
   {
    "id": "LSV-003",
    "sub": "Repayment",
    "desc": "Allocation order is applied to a partial repayment",
    "ref": "RGD 4.4 Loans",
    "pre": "Active loan with overdue penalty, interest and principal outstanding",
    "steps": [
     "Post a partial repayment less than the total amount due",
     "Review how the amount is allocated across penalty, interest and principal"
    ],
    "data": "Partial payment of 50% of the amount due",
    "expected": "The payment is allocated in the approved order, the allocation is visible on the loan enquiry and the remaining balance stays overdue"
   },
   {
    "id": "LSV-004",
    "sub": "Repayment",
    "desc": "Overpayment is handled correctly",
    "ref": "RGD 5.2 Early Settlement",
    "pre": "Active loan with an instalment due",
    "steps": [
     "Post a repayment greater than the instalment due",
     "Review the treatment of the excess"
    ],
    "data": "Payment of 150% of the instalment due",
    "expected": "The excess is applied per the configured rule, either against future instalments or as an advance, and is clearly identified on the loan enquiry"
   },
   {
    "id": "LSV-005",
    "sub": "Early Settlement",
    "desc": "Settle a loan early with no prepayment charge",
    "ref": "RGD 5.2 Early Settlement / Prepayment",
    "pre": "Active loan part way through its term",
    "steps": [
     "Request the early settlement quotation",
     "Post the settlement amount",
     "Review the closure entries and any charge applied"
    ],
    "data": "Settlement at month 6 of a 12-month loan",
    "expected": "The quotation shows outstanding principal and accrued interest to date, no prepayment charge is applied, and the loan closes with a nil balance"
   },
   {
    "id": "LSV-006",
    "sub": "Penalty",
    "desc": "3% penalty is applied to an overdue amount",
    "ref": "RGD 5.2 Penalty",
    "pre": "Loan with an instalment past its due date",
    "steps": [
     "Allow an instalment to fall overdue and run the daily close",
     "Review the penalty calculated and posted",
     "Recalculate manually"
    ],
    "data": "Overdue instalment of 10,000 ETB",
    "expected": "The penalty is calculated at 3% on the due amount not settled by the scheduled date, posts to the penalty income GL and agrees to the manual recalculation"
   },
   {
    "id": "LSV-007",
    "sub": "Penalty",
    "desc": "No separate late payment charge is raised",
    "ref": "RGD 5.2 Late Payment Charges",
    "pre": "Loan with an overdue instalment",
    "steps": [
     "Review all charges raised on the overdue loan"
    ],
    "data": "Overdue loan",
    "expected": "Only the 3% penalty is raised; no additional late payment charge is applied on any product"
   },
   {
    "id": "LSV-008",
    "sub": "Interest Accrual",
    "desc": "Interest accrues daily on the reducing outstanding balance",
    "ref": "RGD 5.2 Interest Calculation Method",
    "pre": "Active loan disbursed",
    "steps": [
     "Run the daily close for 30 days",
     "Extract the daily accrual entries",
     "Recalculate manually for the period"
    ],
    "data": "Loan 100,000 ETB at 25% p.a.",
    "expected": "Accrual is based on the outstanding balance and the configured day basis, and the monthly total agrees to the manual recalculation within rounding tolerance"
   },
   {
    "id": "LSV-009",
    "sub": "Interest Accrual",
    "desc": "Digital Loan commission is applied on a flat basis to the disbursed amount",
    "ref": "Build Register - Loans",
    "pre": "Active Digital Loan",
    "steps": [
     "Run the close over the loan term",
     "Review the commission charged each month",
     "Recalculate manually"
    ],
    "data": "Digital Loan 20,000 ETB for 3 months at 7% per month",
    "expected": "Commission is calculated on the disbursed amount on a flat basis rather than the reducing balance, and equal principal repayments are applied"
   },
   {
    "id": "LSV-010",
    "sub": "Classification",
    "desc": "Loans are classified into the correct ageing bucket",
    "ref": "RGD 5.2 Loan Classification",
    "pre": "Loans with varying days past due",
    "steps": [
     "Create loans overdue by 45, 120, 250 and 400 days",
     "Run the close and the classification routine",
     "Review the classification assigned to each"
    ],
    "data": "Days past due of 45, 120, 250 and 400",
    "expected": "The loans are classified as performing, substandard, doubtful and loss respectively, matching the buckets up to 90, 91-180, 181-365 and over 365 days"
   },
   {
    "id": "LSV-011",
    "sub": "Classification",
    "desc": "Provisioning is calculated per the NBE directive",
    "ref": "RGD 4.4 Loans - Provisioning Reference",
    "pre": "Loans classified across all buckets",
    "steps": [
     "Run the provisioning calculation",
     "Extract the provision by classification",
     "Compare to the NBE directive rates supplied with the requirement document"
    ],
    "data": "Portfolio spread across all four buckets",
    "expected": "The provision rate applied to each bucket matches the NBE directive, the provision posts to the correct GL account and the total agrees to the manual computation"
   },
   {
    "id": "LSV-012",
    "sub": "Classification",
    "desc": "Interest is suspended on non-performing loans",
    "ref": "RGD 4.4 / NBE Directive",
    "pre": "Loan classified as substandard or worse",
    "steps": [
     "Run the close on a loan that has moved to non-performing",
     "Review the interest accrual and the suspense entries"
    ],
    "data": "Loan overdue beyond 90 days",
    "expected": "Interest accrual moves to suspense from the point of classification, income is not overstated, and suspended interest is recognised only on receipt"
   },
   {
    "id": "LSV-013",
    "sub": "Delinquency Reporting",
    "desc": "Produce the arrears and PAR reports",
    "ref": "RGD 8 Reporting",
    "pre": "Portfolio containing overdue loans",
    "steps": [
     "Run the arrears ageing report",
     "Run the portfolio at risk report by branch, product and officer",
     "Reconcile the totals to the loan ledger"
    ],
    "data": "Portfolio with a known arrears position",
    "expected": "Both reports agree to the loan ledger and to each other, and can be produced by branch, product, loan officer and classification"
   },
   {
    "id": "LSV-014",
    "sub": "Rescheduling",
    "desc": "Reschedule a loan for a borrower in difficulty",
    "ref": "RGD 4.4 / 5.2 Rescheduling",
    "pre": "Active loan with a documented hardship case",
    "steps": [
     "Capture the rescheduling request with the reason",
     "Obtain the required approval",
     "Regenerate the repayment schedule and review the classification treatment"
    ],
    "data": "Reason: medical hardship; extension of 6 months",
    "expected": "The new schedule is generated, the reason and approval are stored, the rescheduling is flagged on the loan and the classification is treated per the NBE directive"
   },
   {
    "id": "LSV-015",
    "sub": "Refinancing",
    "desc": "Top-up is permitted only after 50% of principal is repaid",
    "ref": "RGD 5.2 Refinancing / Top-up",
    "pre": "One loan with 30% of principal repaid and one with 60% repaid",
    "steps": [
     "Attempt a top-up on the loan with 30% repaid",
     "Attempt a top-up on the loan with 60% repaid",
     "Review the repayment conduct check applied"
    ],
    "data": "Loans at 30% and 60% principal repaid",
    "expected": "The first attempt is blocked and the second proceeds, with the system also checking repayment history and transaction conduct before approval"
   },
   {
    "id": "LSV-016",
    "sub": "Write-off",
    "desc": "Write off a loan with CEO approval",
    "ref": "RGD 5.2 Write-off Rules",
    "pre": "Loan classified as loss",
    "steps": [
     "Initiate the write-off with the reason recorded",
     "Attempt to complete it without CEO approval",
     "Complete it with CEO approval and review the GL entries"
    ],
    "data": "Loan classified as loss",
    "expected": "The write-off cannot complete without CEO-level approval; on approval the loan moves to written-off status, the provision is utilised and the memorandum record is retained for recovery"
   },
   {
    "id": "LSV-017",
    "sub": "Recovery",
    "desc": "Post a recovery against a written-off loan",
    "ref": "RGD 5.2 Write-off Rules",
    "pre": "Written-off loan on the memorandum register",
    "steps": [
     "Post a cash recovery against the written-off loan",
     "Review the GL treatment and the recovery report"
    ],
    "data": "Recovery of 5,000 ETB",
    "expected": "The recovery is credited to recoveries income rather than reducing a live loan balance, and the written-off balance is updated on the memorandum register"
   },
   {
    "id": "LSV-018",
    "sub": "Loan Closure",
    "desc": "Loan closes on final repayment and securities are released",
    "ref": "RGD 4.4 Loan Lifecycle",
    "pre": "Loan with one instalment remaining",
    "steps": [
     "Post the final instalment",
     "Review the loan status, the compulsory savings lien and the collateral register"
    ],
    "data": "Final instalment payment",
    "expected": "The loan moves to closed status with a nil balance, the lien on the compulsory savings is released and the collateral is marked for release with the closure recorded"
   },
   {
    "id": "LSV-019",
    "sub": "Loan Status",
    "desc": "Loan reaches matured and defaulted statuses correctly",
    "ref": "RGD 4.4 Loan Lifecycle",
    "pre": "One loan reaching term end with a balance and one severely overdue",
    "steps": [
     "Run the close past the maturity date of a loan with an outstanding balance",
     "Run the close on a loan overdue beyond the default threshold"
    ],
    "data": "Matured and defaulted scenarios",
    "expected": "The first loan is flagged matured with the residual balance still payable and the second is flagged defaulted, with both statuses driving the correct reporting treatment"
   },
   {
    "id": "LSV-020",
    "sub": "Loan Enquiry",
    "desc": "Retrieve the complete loan position and history",
    "ref": "RGD 8 Reporting",
    "pre": "Loan with a full transaction history",
    "steps": [
     "Open the loan enquiry",
     "Review the schedule, payments, arrears, accruals, fees, collateral and guarantors"
    ],
    "data": "Loan with several months of history",
    "expected": "The enquiry presents the full position in one view, agreeing to the statement and the GL, with drill-down to individual transactions"
   },
   {
    "id": "LSV-021",
    "sub": "Loan Statement",
    "desc": "Produce the loan statement and amortisation schedule for the customer",
    "ref": "RGD 8 Reporting",
    "pre": "Active loan",
    "steps": [
     "Generate the loan statement for a date range",
     "Generate the current amortisation schedule",
     "Compare both to the loan enquiry"
    ],
    "data": "Date range covering several instalments",
    "expected": "Both documents print correctly, reconcile to the loan enquiry and show the outstanding balance, next due date and next instalment amount"
   },
   {
    "id": "LSV-022",
    "sub": "Reversal",
    "desc": "Reverse a loan repayment posted in error",
    "ref": "RGD 7.1 Back Office Functions",
    "pre": "Repayment posted on the current business day",
    "steps": [
     "Reverse the repayment and authorise it",
     "Review the loan schedule, balances and GL entries"
    ],
    "data": "Repayment of 10,000 ETB posted in error",
    "expected": "The schedule reverts to its previous state, contra GL entries are generated, and both the original and the reversal remain on the audit trail"
   }
  ]
 },
 {
  "id": "10",
  "code": "10 Group Lending",
  "title": "Module 10 - Group Registration and Group Lending",
  "cases": [
   {
    "id": "GRP-001",
    "sub": "Group Registration",
    "desc": "Register a group with a unique Group ID and name",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group setup functionality configured",
    "steps": [
     "Create a group record capturing group name, group type and formation details",
     "Commit and authorise",
     "Note the Group ID assigned"
    ],
    "data": "Solidarity group of 6 members",
    "expected": "The group is created with a system-generated unique Group ID and name, and duplicate group registration is prevented"
   },
   {
    "id": "GRP-002",
    "sub": "Group Type",
    "desc": "Configure a Joint-Liability / Solidarity group",
    "ref": "RGD 4.4 Group Types",
    "pre": "Group types configured",
    "steps": [
     "Register a group with type Joint-Liability/Solidarity",
     "Capture the joint-liability details and undertaking",
     "Authorise the record"
    ],
    "data": "Joint-liability group",
    "expected": "The group type is stored, joint-liability details are captured against the group, and each member retains an individual customer profile and loan contract"
   },
   {
    "id": "GRP-003",
    "sub": "Group Type",
    "desc": "Configure an Organized / Registered group",
    "ref": "RGD 4.4 Group Types",
    "pre": "Group types configured",
    "steps": [
     "Register a group with type Organized/Registered and capture the legal registration details",
     "Authorise the record",
     "Confirm the facility can be granted to the group or to individual members"
    ],
    "data": "Registered cooperative",
    "expected": "The group type is stored with its legal registration reference and the facility structure follows the approved product terms for the group type"
   },
   {
    "id": "GRP-004",
    "sub": "Member Linking",
    "desc": "Link individual customers to a registered group",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group registered and individual customers created",
    "steps": [
     "Link six individual customers to the Group ID",
     "Designate the group leader",
     "Set the membership status for each member"
    ],
    "data": "Six members with one designated leader",
    "expected": "All members are linked to the common Group ID, the group leader is identified, and membership status is maintainable over time"
   },
   {
    "id": "GRP-005",
    "sub": "Group Size",
    "desc": "Group size limits are enforced",
    "ref": "RGD 5.2 / Build Register - Loans",
    "pre": "Group registration in progress",
    "steps": [
     "Attempt to register a group below the minimum size",
     "Attempt to add members beyond the maximum size",
     "Register a group within the permitted range"
    ],
    "data": "Groups of 2, 6 and 12 members",
    "expected": "Group size is validated against the confirmed range. Note: the scoping document states 3-10 members while the build register states 4-10 - see the Open Items tab"
   },
   {
    "id": "GRP-006",
    "sub": "Member Exit",
    "desc": "Amend membership status when a member leaves the group",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group with linked members",
    "steps": [
     "Change a member's status to inactive or exited",
     "Review the effect on group exposure and on that member's live loan"
    ],
    "data": "One member exiting the group",
    "expected": "Membership status updates, the member's individual loan remains live and correctly reported, and group exposure recalculates"
   },
   {
    "id": "GRP-007",
    "sub": "Group Lending",
    "desc": "Book individual loans for group members linked to the Group ID",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group with six linked members",
    "steps": [
     "Create a loan application for each member under the Regular Group Loan product",
     "Progress each through approval",
     "Verify the Group ID is carried on each loan"
    ],
    "data": "Six loans of 30,000 ETB each",
    "expected": "Each member has an individual loan account carrying the common Group ID, preserving individual account-level accounting while maintaining the group relationship"
   },
   {
    "id": "GRP-008",
    "sub": "Group Lending",
    "desc": "Disburse group loans to individual member accounts",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Approved group member loans",
    "steps": [
     "Disburse each member's loan",
     "Verify the credit lands in each member's individual account",
     "Review the group exposure after disbursement"
    ],
    "data": "Six disbursements of 30,000 ETB each",
    "expected": "Each disbursement credits the individual member's account rather than a pooled group account, and total group exposure updates accordingly"
   },
   {
    "id": "GRP-009",
    "sub": "Group Monitoring",
    "desc": "Enquire on total group exposure and individual member exposure",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group with disbursed member loans",
    "steps": [
     "Run the group exposure enquiry",
     "Compare the group total to the sum of member balances",
     "Drill down to an individual member"
    ],
    "data": "Group with six active loans",
    "expected": "The group total equals the sum of the individual member outstanding balances and the enquiry supports drill-down to member level"
   },
   {
    "id": "GRP-010",
    "sub": "Group Monitoring",
    "desc": "Monitor group repayment performance and arrears",
    "ref": "RGD 4.4 Group Loan Clarification",
    "pre": "Group with at least one member in arrears",
    "steps": [
     "Allow one member's instalment to fall overdue",
     "Run the group repayment and arrears report"
    ],
    "data": "One member overdue by 45 days",
    "expected": "The group report shows the overdue member, group arrears, group PAR and overall repayment performance, enabling joint-liability follow-up"
   },
   {
    "id": "GRP-011",
    "sub": "Group Reporting",
    "desc": "Produce group-level portfolio reports",
    "ref": "RGD 4.4 / 8 Reporting",
    "pre": "Several groups with active loans",
    "steps": [
     "Run the group portfolio report by branch and by group type",
     "Reconcile to the loan ledger"
    ],
    "data": "Multiple groups across branches",
    "expected": "Group portfolio reports can be produced by branch, group type and officer and reconcile to the total loan portfolio"
   },
   {
    "id": "GRP-012",
    "sub": "Fallback Approach",
    "desc": "Group reference is captured in a local field where group setup is unavailable",
    "ref": "RGD 4.4 Fallback - Documentation/Procedure",
    "pre": "Group functionality confirmed as unavailable for a scenario",
    "steps": [
     "Capture the Group ID/Group Reference in the available local reference field on each member loan",
     "Extract all loans carrying the same reference"
    ],
    "data": "Group reference on six member loans",
    "expected": "Loans belonging to the same group can be identified, extracted and reported using the local reference field, satisfying the documented fallback approach"
   },
   {
    "id": "GRP-013",
    "sub": "Group Savings",
    "desc": "Operate a group savings account alongside member loans",
    "ref": "Build Register - Accounts",
    "pre": "Group Account opened for the registered group",
    "steps": [
     "Post deposits and withdrawals on the Group Account under the group mandate",
     "Verify the signatory rules are applied"
    ],
    "data": "Group Account with a multi-signatory mandate",
    "expected": "Transactions require the mandated signatories, the account is linked to the Group ID and balances are visible on the group enquiry"
   }
  ]
 },
 {
  "id": "11",
  "code": "11 Overdraft",
  "title": "Module 11 - Overdraft Facilities",
  "cases": [
   {
    "id": "OVD-001",
    "sub": "Facility Creation",
    "desc": "Create an overdraft facility on an eligible Business/Current Account",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Business/Current Account active; credit approval obtained",
    "steps": [
     "Create the overdraft facility at account level",
     "Capture the approved limit, interest rate, effective date and expiry date",
     "Authorise the facility"
    ],
    "data": "Limit 200,000 ETB; term 12 months",
    "expected": "The facility is created against the account with all approved conditions captured and becomes available only after authorisation"
   },
   {
    "id": "OVD-002",
    "sub": "Product Restriction",
    "desc": "Overdraft cannot be granted on savings or non-current accounts",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Ordinary Savings, Group, Youth and Digital Savings accounts active",
    "steps": [
     "Attempt to attach an overdraft facility to each non-current account product in turn"
    ],
    "data": "One account per savings product",
    "expected": "Every attempt is refused; the overdraft facility is restricted to eligible Business/Current Accounts only"
   },
   {
    "id": "OVD-003",
    "sub": "Credit Assessment",
    "desc": "Overdraft activation requires a separate credit assessment and approval",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Business/Current Account without a credit assessment",
    "steps": [
     "Attempt to activate an overdraft facility without a recorded credit assessment",
     "Complete the assessment and approval",
     "Re-attempt activation"
    ],
    "data": "Account turnover and transaction history evidence",
    "expected": "The facility cannot be activated without a separate credit assessment and approval, which are stored against the account for audit"
   },
   {
    "id": "OVD-004",
    "sub": "Limit Control",
    "desc": "Utilisation beyond the approved limit is prevented",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Account with an approved overdraft limit of 200,000 ETB and a nil balance",
    "steps": [
     "Withdraw an amount within the limit",
     "Attempt a withdrawal that would breach the approved limit",
     "Review the balances"
    ],
    "data": "Withdrawals of 150,000 and 100,000 ETB",
    "expected": "The first withdrawal is permitted and the second is refused; the account cannot be driven beyond the approved limit without an authorised excess approval"
   },
   {
    "id": "OVD-005",
    "sub": "Interest",
    "desc": "Interest is charged on the utilised amount only",
    "ref": "RGD 4.2 / 5.2 Overdraft Facility",
    "pre": "Overdraft facility with partial utilisation",
    "steps": [
     "Utilise part of the limit and run the daily close for one month",
     "Extract the interest charged",
     "Recalculate manually on the utilised balance"
    ],
    "data": "Limit 200,000 ETB; utilised 80,000 ETB",
    "expected": "Interest is charged on the utilised amount only and not on the full approved limit, and the calculated amount agrees to the manual recalculation"
   },
   {
    "id": "OVD-006",
    "sub": "Interest",
    "desc": "Interest is calculated on a daily basis and capitalised",
    "ref": "RGD 4.2 Overdraft Facility",
    "pre": "Overdraft account with fluctuating utilisation",
    "steps": [
     "Vary the utilised balance across the month",
     "Run the daily close",
     "Review the daily interest calculation and the capitalisation entry"
    ],
    "data": "Utilisation varying between 50,000 and 150,000 ETB",
    "expected": "Interest is calculated on the daily utilised balance, capitalised per the product configuration, and the total agrees to the manual day-by-day recalculation"
   },
   {
    "id": "OVD-007",
    "sub": "Interest Rate",
    "desc": "Overdraft rate varies with the approved facility tenor",
    "ref": "RGD 4.2 / 5.2 Overdraft Facility",
    "pre": "Overdraft products configured for 3, 6 and 12 month facilities",
    "steps": [
     "Create a 3-month facility and check the rate applied",
     "Repeat for 6-month and 12-month facilities"
    ],
    "data": "Facilities of 3, 6 and 12 months",
    "expected": "The rates 35%, 32% and 30% are applied to the 3-month, 6-month and 12-month facilities respectively"
   },
   {
    "id": "OVD-008",
    "sub": "Facility Amendment",
    "desc": "Amend an approved overdraft limit under maker-checker",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Active overdraft facility",
    "steps": [
     "Amend the approved limit and the expiry date",
     "Authorise the amendment",
     "Test utilisation against the revised limit"
    ],
    "data": "Limit increased from 200,000 to 300,000 ETB",
    "expected": "The amendment requires authorisation, takes effect only after approval, and the audit trail retains both the previous and the revised conditions"
   },
   {
    "id": "OVD-009",
    "sub": "Facility Renewal",
    "desc": "Renew an overdraft facility at expiry",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Overdraft facility approaching expiry",
    "steps": [
     "Process the renewal with a new expiry date and approval",
     "Run the close past the original expiry date",
     "Review the account behaviour"
    ],
    "data": "Renewal for a further 12 months",
    "expected": "The renewed facility remains available past the original expiry date and the renewal is recorded with its approval in the audit trail"
   },
   {
    "id": "OVD-010",
    "sub": "Facility Expiry",
    "desc": "Unrenewed facility expires and the outstanding is treated as overdue",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Overdraft facility with a utilised balance approaching expiry",
    "steps": [
     "Allow the facility to reach expiry without renewal",
     "Run the daily close",
     "Review the account status, the interest applied and the classification"
    ],
    "data": "Facility expiring with 80,000 ETB utilised",
    "expected": "No further utilisation is permitted after expiry, the outstanding balance is treated as overdue, and penalty and classification rules are applied"
   },
   {
    "id": "OVD-011",
    "sub": "Facility Cancellation",
    "desc": "Cancel an overdraft facility and verify the audit trail",
    "ref": "RGD 4.2 Overdraft",
    "pre": "Overdraft facility with a nil utilised balance",
    "steps": [
     "Cancel the facility and authorise the cancellation",
     "Attempt to utilise the account beyond its credit balance",
     "Run the overdraft audit report"
    ],
    "data": "Cancellation of an unused facility",
    "expected": "The facility is cancelled, further overdrawing is refused, and the report shows the complete history of creation, approval, amendment, renewal and cancellation"
   }
  ]
 },
 {
  "id": "12",
  "code": "12 Fixed Assets",
  "title": "Module 12 - Fixed Assets and Depreciation",
  "cases": [
   {
    "id": "FAS-001",
    "sub": "Asset Classes",
    "desc": "Create the four approved asset classes with their depreciation parameters",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Chart of accounts loaded",
    "steps": [
     "Create asset classes for Motor Vehicles, Computers/Servers/IT Equipment, Office Equipment and Furniture and Fixtures",
     "Set the depreciation rate, method and frequency for each",
     "Authorise the records"
    ],
    "data": "Rates of 20%, 25%, 20% and 10%; straight-line, monthly",
    "expected": "All four classes are created with the correct rate, straight-line method and monthly frequency, and each is mapped to its asset and depreciation GL accounts"
   },
   {
    "id": "FAS-002",
    "sub": "Asset Acquisition",
    "desc": "Capitalise a newly acquired fixed asset",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Asset classes configured",
    "steps": [
     "Create an asset record capturing description, class, cost, acquisition date and location",
     "Commit and authorise",
     "Review the GL entries"
    ],
    "data": "Motor vehicle costing 1,200,000 ETB",
    "expected": "The asset is capitalised to the correct asset GL account, receives a unique asset reference and appears in the fixed asset register"
   },
   {
    "id": "FAS-003",
    "sub": "Asset Location",
    "desc": "Assign and transfer an asset between locations",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Capitalised asset exists",
    "steps": [
     "Assign the asset to Head Office",
     "Transfer it to a branch and authorise the transfer",
     "Run the asset register by location"
    ],
    "data": "Transfer from Head Office to Branch ET-001-0001",
    "expected": "The location updates, the transfer is recorded in the asset history, and the register can be produced by head office, data centre, branch or department"
   },
   {
    "id": "FAS-004",
    "sub": "Depreciation",
    "desc": "Run monthly straight-line depreciation for motor vehicles",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Motor vehicle capitalised in the current month",
    "steps": [
     "Run the month-end depreciation routine",
     "Extract the depreciation charged on the vehicle",
     "Recalculate manually at 20% per annum straight-line"
    ],
    "data": "Cost 1,200,000 ETB at 20% p.a.",
    "expected": "The monthly charge equals the annual straight-line amount divided by twelve, posts to the depreciation expense and accumulated depreciation accounts, and agrees to the manual calculation"
   },
   {
    "id": "FAS-005",
    "sub": "Depreciation",
    "desc": "Run monthly depreciation for IT equipment, office equipment and furniture",
    "ref": "RGD 10 Fixed Assets",
    "pre": "One asset capitalised in each remaining class",
    "steps": [
     "Run the month-end depreciation routine",
     "Extract the charge for each asset class",
     "Recalculate manually at 25%, 20% and 10% per annum"
    ],
    "data": "One asset per class",
    "expected": "Each class depreciates at its own rate on a straight-line monthly basis and the charges post to the correct GL accounts by class"
   },
   {
    "id": "FAS-006",
    "sub": "Depreciation",
    "desc": "Depreciation stops when an asset is fully depreciated",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Asset approaching the end of its useful life",
    "steps": [
     "Run the depreciation routine past the point at which the asset is fully written down",
     "Review the net book value and the subsequent charge"
    ],
    "data": "Asset at the end of its useful life",
    "expected": "Depreciation ceases at a nil or residual net book value, no negative net book value arises and the asset remains on the register"
   },
   {
    "id": "FAS-007",
    "sub": "Asset Disposal",
    "desc": "Dispose of an asset and recognise the gain or loss",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Capitalised asset with accumulated depreciation",
    "steps": [
     "Record the disposal with the proceeds and disposal date",
     "Authorise the disposal",
     "Review the GL entries and the register"
    ],
    "data": "Proceeds of 400,000 ETB against a net book value of 350,000 ETB",
    "expected": "The cost and accumulated depreciation are removed, the gain or loss is posted to the correct income or expense account, and the asset is flagged as disposed on the register"
   },
   {
    "id": "FAS-008",
    "sub": "Asset Reporting",
    "desc": "Produce the fixed asset register and movement schedule",
    "ref": "RGD 8 / 10 Fixed Assets",
    "pre": "Assets capitalised, depreciated, transferred and disposed",
    "steps": [
     "Run the fixed asset register",
     "Run the asset movement schedule for the period",
     "Reconcile both to the GL"
    ],
    "data": "Full asset population",
    "expected": "The register shows cost, accumulated depreciation and net book value by class and location, and the totals reconcile to the GL fixed asset balances"
   }
  ]
 },
 {
  "id": "13",
  "code": "13 GL and Reporting",
  "title": "Module 13 - General Ledger, Accounting and Reporting",
  "cases": [
   {
    "id": "GLR-001",
    "sub": "GL Mapping",
    "desc": "Savings product entries post to the mapped GL accounts",
    "ref": "RGD 4.3 Accounting / GL Mapping",
    "pre": "GL mapping signed off in the GL-mapping workshop",
    "steps": [
     "Post a deposit, a withdrawal, an interest accrual, an interest payment and a tax deduction on each savings product",
     "Extract the resulting GL entries",
     "Compare each entry to the approved mapping"
    ],
    "data": "One full cycle per savings product",
    "expected": "Principal, interest, fees and tax post to the accounts named in the approved mapping, with no entry defaulting to an unmapped account"
   },
   {
    "id": "GLR-002",
    "sub": "GL Mapping",
    "desc": "Loan product entries post to the mapped GL accounts",
    "ref": "RGD 5.2 Accounting / GL Mapping",
    "pre": "GL mapping signed off",
    "steps": [
     "Disburse, accrue, repay, apply a penalty, provision and write off a loan",
     "Extract the GL entries at each stage",
     "Compare to the approved mapping"
    ],
    "data": "One full loan lifecycle",
    "expected": "Principal, interest, fees, penalties, suspense, provision and write-off each post to their mapped accounts and the loan ledger agrees to the GL control account"
   },
   {
    "id": "GLR-003",
    "sub": "Double Entry",
    "desc": "Every transaction generates a balanced double entry",
    "ref": "RGD 8 Reporting",
    "pre": "Full day of UAT transaction activity",
    "steps": [
     "Extract all GL entries for the business day",
     "Sum the debits and credits by transaction and in total"
    ],
    "data": "One full business day",
    "expected": "Debits equal credits for every individual transaction and for the day as a whole, with no single-sided or orphaned entries"
   },
   {
    "id": "GLR-004",
    "sub": "Journal Entry",
    "desc": "Input and authorise a manual journal entry",
    "ref": "RGD 8 Reporting",
    "pre": "Journal entry permissions configured",
    "steps": [
     "Input a balanced manual journal as maker",
     "Attempt to commit an unbalanced journal",
     "Authorise the balanced journal as checker"
    ],
    "data": "Balanced and unbalanced journals",
    "expected": "The unbalanced journal is refused, the balanced journal is held for authorisation and posts only after approval, with maker and checker both recorded"
   },
   {
    "id": "GLR-005",
    "sub": "Trial Balance",
    "desc": "Produce a trial balance that agrees to the subsidiary ledgers",
    "ref": "RGD 8 Finance Reports",
    "pre": "Full day of activity across all modules",
    "steps": [
     "Run the trial balance at branch level and consolidated",
     "Reconcile the control accounts to the customer accounts, loan and deposit ledgers and the cash position"
    ],
    "data": "End-of-day position",
    "expected": "The trial balance balances, and the deposit, loan, cash and fixed asset control accounts agree exactly to their subsidiary ledgers"
   },
   {
    "id": "GLR-006",
    "sub": "Financial Statements",
    "desc": "Produce the income statement",
    "ref": "RGD 8 Finance Reports",
    "pre": "Transactions posted across income and expense lines",
    "steps": [
     "Run the income statement for the period at branch and consolidated level",
     "Trace interest income, fee income and penalty income back to source transactions"
    ],
    "data": "Period covering interest, fee and penalty activity",
    "expected": "The income statement reflects all income and expense lines correctly, agrees to the trial balance and can be produced by branch and consolidated"
   },
   {
    "id": "GLR-007",
    "sub": "Financial Statements",
    "desc": "Produce the balance sheet",
    "ref": "RGD 8 Finance Reports",
    "pre": "Full trial balance available",
    "steps": [
     "Run the balance sheet at branch and consolidated level",
     "Confirm assets equal liabilities plus equity",
     "Agree the balances to the trial balance"
    ],
    "data": "End-of-period position",
    "expected": "The balance sheet balances, agrees to the trial balance and correctly classifies loans, deposits, fixed assets and provisions"
   },
   {
    "id": "GLR-008",
    "sub": "Financial Statements",
    "desc": "Produce the cash flow statement",
    "ref": "RGD 8 Finance Reports",
    "pre": "Period activity posted",
    "steps": [
     "Run the cash flow statement for the period",
     "Agree the movement in cash to the opening and closing cash and bank balances"
    ],
    "data": "One reporting period",
    "expected": "The reported cash movement agrees to the change in cash and bank balances between the two period ends"
   },
   {
    "id": "GLR-009",
    "sub": "GL Reporting",
    "desc": "Produce GL movement and general ledger detail reports",
    "ref": "RGD 8 Finance Reports",
    "pre": "Posting activity across several GL accounts",
    "steps": [
     "Run the GL movement report for a selected account and date range",
     "Drill from the movement to the underlying transaction"
    ],
    "data": "Selected GL account with several movements",
    "expected": "The report shows opening balance, all movements with references and closing balance, and each movement is traceable to its source transaction"
   },
   {
    "id": "GLR-010",
    "sub": "Reconciliation",
    "desc": "Produce the reconciliation reports",
    "ref": "RGD 8 Finance Reports",
    "pre": "Cash, agent and interface activity posted",
    "steps": [
     "Run the reconciliation report for cash, agent float and suspense accounts",
     "Investigate any unmatched item"
    ],
    "data": "One business day of activity",
    "expected": "Reconciling items are listed with age and reference, and every suspense or unmatched item is identifiable for follow-up"
   },
   {
    "id": "GLR-011",
    "sub": "Suspense Control",
    "desc": "Suspense accounts are monitored and cleared",
    "ref": "RGD 8 Finance Reports",
    "pre": "Entries posted to suspense during UAT",
    "steps": [
     "Run the suspense account ageing report",
     "Clear a suspense item to its correct account with authorisation"
    ],
    "data": "Aged suspense items",
    "expected": "Suspense balances are visible and aged, clearing entries require authorisation and the cleared item disappears from the ageing report"
   },
   {
    "id": "GLR-012",
    "sub": "Regulatory Reporting",
    "desc": "Produce the loan classification and provisioning report for NBE",
    "ref": "RGD 4.4 / 8 Reporting",
    "pre": "Portfolio classified across all buckets",
    "steps": [
     "Run the loan classification and provisioning report",
     "Compare the classifications and provision rates to the NBE directive",
     "Reconcile the totals to the loan ledger"
    ],
    "data": "Portfolio spread across all four classifications",
    "expected": "The report presents the portfolio by classification with the provision computed per the NBE directive, and the totals agree to the loan ledger and the GL provision balance"
   },
   {
    "id": "GLR-013",
    "sub": "Tax Reporting",
    "desc": "Produce the withholding tax report for remittance",
    "ref": "RGD 4.3 Tax Treatment",
    "pre": "Withholding tax deducted across savings products",
    "steps": [
     "Run the withholding tax report for the period",
     "Agree the total to the withholding tax GL account balance"
    ],
    "data": "One month of interest payments",
    "expected": "The report shows the tax deducted per customer and product, and the total agrees exactly to the tax liability account balance"
   },
   {
    "id": "GLR-014",
    "sub": "Branch Reporting",
    "desc": "Reports can be produced at branch and consolidated level",
    "ref": "RGD 3.2 / 8 Reporting",
    "pre": "Activity in more than one branch",
    "steps": [
     "Run the trial balance, income statement and portfolio reports for each branch",
     "Run the same reports consolidated",
     "Compare the sum of branches to the consolidated figures"
    ],
    "data": "Two or more active branches",
    "expected": "The sum of the branch reports equals the consolidated report for every reporting line, with no double counting from inter-branch entries"
   },
   {
    "id": "GLR-015",
    "sub": "Report Output",
    "desc": "Reports can be exported and printed in the required formats",
    "ref": "RGD 8 Reporting",
    "pre": "Reports generated",
    "steps": [
     "Export a report to PDF and to spreadsheet format",
     "Print a report and compare it to the on-screen output"
    ],
    "data": "Selected finance and portfolio reports",
    "expected": "Exports open correctly with figures, headers and page numbering intact, and the printed output matches the screen and export values"
   },
   {
    "id": "GLR-016",
    "sub": "Report Access",
    "desc": "Report access is restricted by role",
    "ref": "RGD 3.1 / 8 Reporting",
    "pre": "Users with differing roles",
    "steps": [
     "Attempt to run the consolidated financial statements as a teller",
     "Run the same reports as a Finance user"
    ],
    "data": "Teller and Finance user roles",
    "expected": "Report access follows the role entitlement, restricted reports are not available to unauthorised roles, and report access is logged"
   }
  ]
 },
 {
  "id": "14",
  "code": "14 COB and Period End",
  "title": "Module 14 - Close of Business and Period End Processing",
  "cases": [
   {
    "id": "EOD-001",
    "sub": "COB Execution",
    "desc": "Close of business completes successfully without error",
    "ref": "RGD 11.1 Phase 1 Items",
    "pre": "Full day of transaction activity posted",
    "steps": [
     "Confirm all tills are closed and no unauthorised transaction remains in the queue",
     "Launch the close of business",
     "Monitor the run to completion and review the log"
    ],
    "data": "One full business day",
    "expected": "The close completes within the agreed window with no errors in the log and the system date rolls to the next working day"
   },
   {
    "id": "EOD-002",
    "sub": "COB Control",
    "desc": "Close of business is blocked by open tills or unauthorised transactions",
    "ref": "RGD 7.3 / 11.1",
    "pre": "One till left open and one unauthorised transaction pending",
    "steps": [
     "Attempt to launch the close of business",
     "Review the exception raised",
     "Clear the exceptions and rerun"
    ],
    "data": "Open till and pending authorisation",
    "expected": "The close halts or reports the exceptions rather than proceeding silently, and completes only once the open items are cleared"
   },
   {
    "id": "EOD-003",
    "sub": "COB Processing",
    "desc": "Interest accrual is generated during the close for all products",
    "ref": "RGD 4.3 / 5.2 Interest",
    "pre": "Active deposit and loan accounts",
    "steps": [
     "Run the close for one business day",
     "Extract the accrual entries for savings, deposits and loans",
     "Recalculate a sample manually"
    ],
    "data": "Sample of accounts across products",
    "expected": "Accrual is generated for every eligible account, the daily amounts agree to manual recalculation and no account is skipped"
   },
   {
    "id": "EOD-004",
    "sub": "COB Processing",
    "desc": "Month-end interest capitalisation and payment run correctly",
    "ref": "RGD 4.3 Interest Payment Frequency",
    "pre": "Accounts accrued through to month end",
    "steps": [
     "Run the month-end close",
     "Review the capitalisation and payment entries by product",
     "Confirm the frequency applied per product"
    ],
    "data": "One account per savings product",
    "expected": "Interest is capitalised monthly for the monthly products and daily for Digital Savings, and is paid at maturity for the Fixed Time Deposit"
   },
   {
    "id": "EOD-005",
    "sub": "COB Processing",
    "desc": "Instalments become due and overdue processing runs at the close",
    "ref": "RGD 5.2 Penalty",
    "pre": "Loans with instalments due on the processing date",
    "steps": [
     "Run the close over an instalment due date with an unfunded settlement account",
     "Review the due, overdue and penalty entries"
    ],
    "data": "Loan with an unfunded settlement account",
    "expected": "The instalment is raised as due, moves to overdue when unpaid, and the 3% penalty is applied from the scheduled date"
   },
   {
    "id": "EOD-006",
    "sub": "COB Processing",
    "desc": "Loan classification and provisioning update during the close",
    "ref": "RGD 5.2 Loan Classification",
    "pre": "Loans crossing classification boundaries",
    "steps": [
     "Age loans across the 90, 180 and 365 day boundaries",
     "Run the close",
     "Review the classification and provision movement"
    ],
    "data": "Loans at 89, 91, 180 and 366 days past due",
    "expected": "Classification moves at the correct boundary, the provision is recalculated automatically and the movement is posted to the GL"
   },
   {
    "id": "EOD-007",
    "sub": "COB Processing",
    "desc": "Dormancy flagging runs during the close",
    "ref": "RGD 4.3 Dormancy Rules",
    "pre": "Accounts approaching the dormancy threshold",
    "steps": [
     "Age an account to the dormancy threshold",
     "Run the close",
     "Review the account status and the dormancy report"
    ],
    "data": "Account at the dormancy threshold",
    "expected": "The account is flagged dormant automatically at the configured period and appears on the dormancy report"
   },
   {
    "id": "EOD-008",
    "sub": "COB Processing",
    "desc": "Depreciation runs at month end",
    "ref": "RGD 10 Fixed Assets",
    "pre": "Fixed assets capitalised",
    "steps": [
     "Run the month-end close",
     "Review the depreciation entries generated for each asset class"
    ],
    "data": "Assets across all four classes",
    "expected": "Depreciation is generated once per month for each asset, at the correct rate, with no duplicate or missed charge"
   },
   {
    "id": "EOD-009",
    "sub": "Date Handling",
    "desc": "System date rolls correctly over weekends and holidays",
    "ref": "RGD 11.1 Phase 1 Items",
    "pre": "Holiday calendar loaded",
    "steps": [
     "Run the close on the day before a weekend or public holiday",
     "Review the new system date and the treatment of dated items"
    ],
    "data": "Close run before a public holiday",
    "expected": "The date rolls to the next working day, and accruals and due dates over the non-working period are handled per the configured convention"
   },
   {
    "id": "EOD-010",
    "sub": "Value Dating",
    "desc": "Back-valued and forward-valued entries are handled correctly",
    "ref": "RGD 8 Reporting",
    "pre": "Permissions configured for back-value posting",
    "steps": [
     "Post a back-valued deposit within the permitted window",
     "Attempt a back-value beyond the permitted window",
     "Review the interest adjustment generated"
    ],
    "data": "Back-value of 3 days",
    "expected": "The permitted back-value posts with an interest adjustment for the affected period, the excessive back-value is refused, and both are visible on the audit trail"
   },
   {
    "id": "EOD-011",
    "sub": "Recovery",
    "desc": "Close of business can be restarted after an interruption",
    "ref": "RGD 11.1 Phase 1 Items",
    "pre": "Test environment permitting a controlled interruption",
    "steps": [
     "Interrupt the close at a defined stage",
     "Restart the close",
     "Verify no duplicate or missing postings"
    ],
    "data": "Controlled interruption during the run",
    "expected": "The close resumes from the point of failure without duplicating postings, and the day's totals agree to a clean run"
   },
   {
    "id": "EOD-012",
    "sub": "Period End",
    "desc": "Month-end and year-end close produce the correct results",
    "ref": "RGD 8 Reporting",
    "pre": "Full period of activity posted",
    "steps": [
     "Run the month-end close and produce the financial statements",
     "Run the year-end close",
     "Review the profit transfer to reserves and the opening balances of the new period"
    ],
    "data": "Full accounting period",
    "expected": "The period closes with balanced statements, profit or loss transfers correctly to retained earnings at year end, and prior-period postings are prevented once the period is closed"
   }
  ]
 },
 {
  "id": "15",
  "code": "15 Interfaces",
  "title": "Module 15 - Interfaces and Digital Channels (Phase 2 - conditional)",
  "cases": [
   {
    "id": "INT-001",
    "sub": "Mobile Money Disbursement",
    "desc": "Disburse a Yehulu Digital Loan to a mobile wallet",
    "ref": "RGD 9 Interfaces / 13 Out of Scope",
    "pre": "Mobile money interface available in the test environment",
    "steps": [
     "Approve a Digital Loan for a customer with a registered wallet",
     "Trigger the disbursement to the wallet",
     "Verify the wallet credit and the CBS entries"
    ],
    "data": "Digital Loan of 20,000 ETB to a registered wallet",
    "expected": "The wallet is credited, the CBS records the disbursement against the loan, and the interface reference is stored on both sides for reconciliation"
   },
   {
    "id": "INT-002",
    "sub": "Mobile Money Repayment",
    "desc": "Receive a Digital Loan repayment from a mobile wallet",
    "ref": "RGD 9 Interfaces",
    "pre": "Active Digital Loan and mobile money interface available",
    "steps": [
     "Initiate a repayment from the customer's wallet",
     "Verify the loan schedule and balances in the CBS"
    ],
    "data": "Repayment of one instalment",
    "expected": "The repayment is applied to the loan in the correct allocation order and the interface reference is retained for reconciliation"
   },
   {
    "id": "INT-003",
    "sub": "Digital Savings Channel",
    "desc": "Deposit to and withdraw from Digital Savings through the wallet channel",
    "ref": "RGD 9 Interfaces",
    "pre": "Digital Savings account and interface available",
    "steps": [
     "Post a wallet deposit to the Digital Savings account",
     "Post a wallet withdrawal",
     "Verify the 0.2% withdrawal charge"
    ],
    "data": "Deposit and withdrawal of 5,000 ETB",
    "expected": "Both transactions update the account balance, the withdrawal charge is applied correctly and the channel is identifiable on the statement"
   },
   {
    "id": "INT-004",
    "sub": "Interface Failure",
    "desc": "Failed or timed-out interface transactions are handled safely",
    "ref": "RGD 9 Interfaces",
    "pre": "Interface available with the ability to simulate failure",
    "steps": [
     "Simulate a timeout during a disbursement to a wallet",
     "Review the CBS position and the wallet position",
     "Run the interface reconciliation"
    ],
    "data": "Simulated timeout",
    "expected": "No double disbursement or orphaned entry arises, the transaction is either fully applied or fully reversed, and the exception is listed on the reconciliation report"
   },
   {
    "id": "INT-005",
    "sub": "Interface Reconciliation",
    "desc": "Reconcile interface transactions to the CBS ledger",
    "ref": "RGD 9 Interfaces",
    "pre": "A day of interface activity posted",
    "steps": [
     "Extract the interface transaction log",
     "Run the CBS channel report",
     "Match the two and investigate differences"
    ],
    "data": "One day of channel activity",
    "expected": "Every interface transaction has a matching CBS entry, and unmatched items are aged and reported for investigation"
   },
   {
    "id": "INT-006",
    "sub": "Notification",
    "desc": "Transaction notifications are generated for the customer",
    "ref": "RGD 9 Interfaces",
    "pre": "SMS gateway configured in the test environment",
    "steps": [
     "Post a deposit, withdrawal and loan disbursement",
     "Review the notification queue and delivery log"
    ],
    "data": "Customer with a valid +251 mobile number",
    "expected": "A notification is generated per transaction to the registered mobile number, the queue clears and failures are logged for retry"
   }
  ]
 }
];
