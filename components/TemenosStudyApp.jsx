"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home, BookOpen, Layers, GitBranch, BarChart3, Search, ChevronRight,
  ChevronLeft, Check, X, RotateCcw, Shuffle, ArrowRight, ArrowLeft,
  CheckCircle2, Circle, Target, Brain, Globe, HelpCircle, Lightbulb,
  GraduationCap, ListChecks, Menu, BookMarked, Award, Wrench,
  Volume2, Square, Pause, Play
} from "lucide-react";

/* ============================================================================
   TEMENOS STUDY APP — one app, all courses. Slide-depth content.
   Add a course = append to CONCEPTS + COURSES. UI is fully data-driven.
   Course 1 (Financial Inclusion) is built to full slide depth below.
   ========================================================================== */

const CONCEPTS = {
  // ============ COURSE 1 · Financial Inclusion Foundation ============
  // ---- Section 1: Introduction & Role-Based Home Pages ----
  rbhp: {
    title: "Role-Based Home Page (RBHP)",
    simple: "A landing screen tailored to a user's job, showing only the functions their role needs.",
    example: "A Teller lands on cash/cheque/forex tools; a Loan Officer lands on applications, arrears and collateral.",
    why: "Showing every user the whole system is slow and unsafe; role pages make staff fast and reduce error.",
    memory: "Right role → right buttons, one page.",
    temenos: "Predefined by Temenos per role; what a user can reach is governed by their User Security Profile (USSP).",
    related: ["allinone", "ussp", "scv", "worklist"], diagram: "roleaccess",
  },
  allinone: {
    title: "All-in-One Page",
    simple: "The catch-all RBHP with the widest set of applications; role pages are trimmed versions of it.",
    example: "An admin works from All-in-One to reach customers, groups, product parameters and system parameters together.",
    why: "You need one master page to reach everything for setup and supervision.",
    memory: "All-in-One = master key; role pages = single-door keys cut from it.",
    temenos: "System Parameters and Product Parameters are reached from here; icons at the top are fast links to FI applications.",
    related: ["rbhp", "ussp", "landingpages"],
  },
  ussp: {
    title: "User Security Profile (USSP)",
    simple: "Controls which applications a user can navigate to from their home page.",
    example: "Removing an app from a teller's USSP means they can't open it, even if it shows in a menu.",
    why: "Security and segregation of duties — it decides who can touch what.",
    memory: "USSP = you shall see only your permitted apps.",
    temenos: "Edit with care: changing it restricts real users. It's the access layer behind every RBHP.",
    related: ["rbhp", "allinone"],
  },
  scv: {
    title: "Single Customer View (SCV)",
    simple: "One screen showing everything about a customer — record, accounts, loans, documents, relationships.",
    example: "An agent opens a customer's SCV to view accounts and statements, open an account, and check relationships without switching screens.",
    why: "A 360° view gives full context for good service and decisions.",
    memory: "SCV = the customer's whole story on one page.",
    temenos: "The landing page on all RBHPs; also where Payment Sources → Obligations → Splits are set up.",
    related: ["sgv", "custrec", "scvtabs", "psos"],
  },
  sgv: {
    title: "Single Group View",
    simple: "The 360° view for a group — view/maintain the group, meeting details, member transfers, splits, reports.",
    example: "A field officer opens a lending group's view to transfer a member or check the group's available limit.",
    why: "Group lending needs the same all-in-one context as customers, but at group level.",
    memory: "SGV = SCV, but for the group.",
    temenos: "Shows the group's available limit; used across Group Management.",
    related: ["scv", "grouplending", "grouptype"],
  },
  worklist: {
    title: "Dashboard, Work List & EXCEPTION Enquiry",
    simple: "The home dashboard shows your tasks (overdue / due soon / later) and a Work List of pending items.",
    example: "A supervisor sees unauthorised records listed in the Work List and clicks straight through to action them.",
    why: "It surfaces what needs attention so nothing is missed.",
    memory: "Work List = the pile of things waiting on you.",
    temenos: "The Work List of pending items (e.g. unauthorised records) is driven by the EXCEPTION enquiry.",
    related: ["rbhp", "taskmgmt"],
  },
  landingpages: {
    title: "Role Landing Pages",
    simple: "Each role gets its own page: Loans, Accounts/Deposits, Teller, Head Teller, Branch Manager, Finance, System Admin, Product/System Parameters.",
    example: "Head Teller does till management; Finance runs daily financial reports; System Admin manages users.",
    why: "Different jobs need different tools grouped together.",
    memory: "One page per job.",
    temenos: "Head Teller = till management & enquiries; Finance = GL/journals/reports; System Admin = users, audit logs; Product/System Parameters = setup tables.",
    related: ["rbhp", "allinone", "roles"],
  },
  roles: {
    title: "Example Role Definitions",
    simple: "Named roles with set functions: Customer Service Agent, Payment Services Agent, Teller, Loan Services, Credit Manager, Auditor.",
    example: "A Customer Service Agent can view/amend customers, create groups and view unauthorised transfers; a Credit Manager does credit scoring and reviews limits.",
    why: "Roles package the right permissions for each job function.",
    memory: "Role = a job's toolkit.",
    temenos: "Payment Services Agent = funds transfers & standing orders; Loan Services = applications/arrears/collateral; Auditor = supports internal audit.",
    related: ["rbhp", "ussp", "landingpages"],
  },

  // ---- Section 2: Customer ----
  custrec: {
    title: "Customer Record",
    simple: "The single core record holding a customer's basic information, reused everywhere in the system.",
    example: "You create a customer record as soon as you have their name and address — not only when they open an account.",
    why: "Transact is customer-centric: one record is the source of truth, never duplicated across modules.",
    memory: "One customer = one record; authorise it and you can't reverse it, only amend it.",
    temenos: "CUSTOMER is a Core Application; once authorised it can't be reversed, only amended.",
    related: ["custcentric", "relation", "dao", "custid", "scv"], diagram: "custhub",
  },
  custcentric: {
    title: "Customer-Centric / Core Application",
    simple: "Everything in Transact revolves around the customer, so customer details aren't repeated in other modules.",
    example: "A customer's address entered once is used by accounts, loans and statements alike.",
    why: "It avoids duplication and keeps every module consistent.",
    memory: "The customer sits at the centre; everything else points to it.",
    temenos: "CUSTOMER is a Core Application; its details are referenced across all applications.",
    related: ["custrec", "counterparty"],
  },
  counterparty: {
    title: "Customer as Counterparty (incl. Nostro)",
    simple: "In FI a 'customer' is anyone the bank deals with — not only people it sells to.",
    example: "Account holders, borrowers and depositors are customers; so are brokers, agents and correspondent banks.",
    why: "The bank must record every party it transacts with, including other banks.",
    memory: "Customer = any counterparty, even another bank.",
    temenos: "Banks hold Nostro accounts (our money) at other banks; those banks are also customer records.",
    related: ["custrec", "bankcust"],
  },
  relation: {
    title: "RELATION Table",
    simple: "Links customers by relationship type — spouse, parent/child, company/subsidiary.",
    example: "Link a husband and wife once; the reverse relationship fills in automatically.",
    why: "Banks need to see connected parties for risk, KYC and servicing.",
    memory: "Set one side, RELATION mirrors the other.",
    temenos: "No limit on relationships; only one side needs setup, the reverse auto-defaults; holds the related customer's code/mnemonic.",
    related: ["custrec", "dao"],
  },
  dao: {
    title: "Account Officer (DAO)",
    simple: "The staff member responsible for a customer, defaulted onto all that customer's transactions.",
    example: "Every loan and account for a customer carries the same officer, so performance can be reported by officer.",
    why: "It enables MIS at account-officer level and clear ownership of relationships.",
    memory: "DAO = default account owner, stamped on every transaction.",
    temenos: "DEPT.ACCT.OFFICER; can link to a USER ID to auto-subscribe that user to the officer's tasks; bulk transfers move a whole portfolio between DAOs.",
    related: ["custrec", "relation", "bulkao"],
  },
  prospect: {
    title: "Prospect Customer",
    simple: "A lightweight record opened with minimum details before someone is a full customer.",
    example: "A walk-in enquiry is captured as a prospect with just mnemonic, gender, sector and industry.",
    why: "Lets the bank track potential customers without full onboarding.",
    memory: "Prospect = customer-lite.",
    temenos: "Whether business is allowed with a prospect, and how long prospect details are held, is set in the COMPANY table.",
    related: ["custrec", "custid"],
  },
  custid: {
    title: "Customer ID",
    simple: "The numeric identification code for a customer, 7–10 digits, and can be auto-generated.",
    example: "The system assigns 100100 to a new customer.",
    why: "Every customer needs a unique machine key.",
    memory: "ID = the number; mnemonic = the nickname.",
    temenos: "Length 7–10 digits; can be auto-generated by T24.",
    related: ["mnemonic", "custrec"],
  },
  mnemonic: {
    title: "Mnemonic",
    simple: "An easy alternative reference for a customer, usable instead of the numeric ID.",
    example: "Staff type a short generated code instead of a 9-digit ID to pull up the customer.",
    why: "IDs are hard to remember; a mnemonic is a human-friendly handle.",
    memory: "Mnemonic = memory aid (that's literally the word).",
    temenos: "Stored in MNEMONIC.CUSTOMER; auto-generated in FI as surname chars + birth year/month + a sequence (entity name + sequence for non-individuals).",
    related: ["custid", "custrec"],
  },
  custtabs: {
    title: "Individual Customer Tabs",
    simple: "The customer record is organised into tabs holding different information sets.",
    example: "Address, Contact, Identification, Marital, Other, Education, Employment, KYC and Beneficiary tabs.",
    why: "Grouping fields keeps a large record navigable and drives eligibility/scoring.",
    memory: "Tabs = drawers of the customer file.",
    temenos: "Identification doc names must be valid EB.LOOKUP CUS.LEGAL.DOC.NAME; Other holds death/probate & dependents; Beneficiary sets who savings pay to on death.",
    related: ["custrec", "autofields", "nonindiv"],
  },
  autofields: {
    title: "Auto-Updated Customer Fields",
    simple: "Some fields the system maintains automatically as the customer transacts.",
    example: "Taking a new loan increments the customer's loan cycle count.",
    why: "They feed eligibility, scoring and reporting without manual entry.",
    memory: "The system keeps score for you.",
    temenos: "AA Loans Written Off (set on write-off), Universal Loan Cycle (per disbursement), Groups (membership).",
    related: ["custtabs", "shadowlimit"],
  },
  shadowlimit: {
    title: "Shadow Limit",
    simple: "The maximum a customer can borrow, based on a multiple of their savings.",
    example: "A member with strong savings gets a higher shadow borrowing ceiling.",
    why: "Ties lending capacity to demonstrated saving.",
    memory: "Save more → shadow ceiling rises.",
    temenos: "Based on a savings multiple; product setup in the global PRODUCT.PARAMETERS table.",
    related: ["autofields", "custrec"],
  },
  nonindiv: {
    title: "Non-Individual Customer",
    simple: "A customer record for a business/entity rather than a person.",
    example: "A company customer with a registration date, business start date and signatories.",
    why: "Businesses need different fields (entity name, signatories, mandates) than individuals.",
    memory: "Company = entity tabs, not personal tabs.",
    temenos: "Abbreviated name auto-fills from entity name; date registered can't be after business start; signatories need not be customers; Mandates can link signature groups.",
    related: ["custtabs", "custrec"],
  },
  scvtabs: {
    title: "SCV Tabs: History, Documents, Channels, Communications",
    simple: "Extra tabs on the Single Customer View for change history, files, online access and messages.",
    example: "You review who changed a field via History of Changes, or find a customer's uploaded ID in Documents.",
    why: "One place for audit trail, document storage, digital access and correspondence.",
    memory: "History = who changed what; Documents = files; Channels = online access; Communications = messages.",
    temenos: "History of Changes shows old vs new values + inputter/authorizer; Channels create EB.EXTERNAL.USER; Communications hold EB.SECURE.MESSAGE.",
    related: ["scv", "custrec"],
  },
  bankcust: {
    title: "Bank Customer",
    simple: "A customer record flagged as a bank, used in payment (SWIFT) processing.",
    example: "A correspondent bank is set up as a bank customer so cross-border payments format correctly.",
    why: "Payments to a bank behave differently from payments to a person.",
    memory: "Sector 8001 = this customer is a bank.",
    temenos: "Sector 8001 is predefined in ACCOUNT.CLASS with BANK as ID; after authorisation an AGENCY record (same ID) holds standard settlement instructions.",
    related: ["counterparty", "custrec"],
  },

  // ---- Section 3: Task Management, File Upload & AO Transfer ----
  taskmgmt: {
    title: "Task Management",
    simple: "A dashboard that brings pending work to the user instead of making them hunt through menus and queues.",
    example: "A user sees tasks split into overdue / due-soon / later and clicks Execute to act on the most urgent.",
    why: "It improves efficiency and ensures nothing important is missed.",
    memory: "Tasks come to you; you don't go looking.",
    temenos: "Features: auto task creation from events, manual to-dos, content-driven execution via templates, delegation, notifications. The dashboard is the start of every RBHP.",
    related: ["worklist", "taskstruct", "taskservices"],
  },
  taskstruct: {
    title: "Task Structure",
    simple: "Each task carries a title, detail, dates, a priority, and links to what it concerns.",
    example: "A task 'Review overdue loan' with High priority, linked to a customer and contract, assigned to two users.",
    why: "Rich task data lets users prioritise and act without digging.",
    memory: "Title + priority + who + what it links to.",
    temenos: "Priority High/Med/Low; can link to account officer, group, customer, application/contract, transaction ref; can carry a free-text note.",
    related: ["taskmgmt", "taskactions"],
  },
  taskactions: {
    title: "Task Actions: Execute / Reassign / View",
    simple: "The three things you can do with a task.",
    example: "Execute opens the relevant app; Reassign changes priority/assignees; View just shows detail.",
    why: "Covers acting, delegating and inspecting.",
    memory: "Do it, pass it, or look at it.",
    temenos: "Execute's app list varies by task template; reassignment is limited to users in the same company or with access to ALL companies (uses the real server date).",
    related: ["taskstruct", "taskdelegates"],
  },
  notifications: {
    title: "Notifications",
    simple: "Messages sent to one or more users about something needing awareness.",
    example: "A notification tells an officer a record they own was authorised.",
    why: "Keeps staff informed of relevant events.",
    memory: "Notification = FYI to a user.",
    temenos: "Each has an owner/assignee; can go to more than one user; linkable to account officer/group/customer/contract/transaction ref.",
    related: ["taskmgmt", "taskservices"],
  },
  taskdelegates: {
    title: "Task Delegates",
    simple: "Delegating specific tasks to other users or groups to support teamwork and simple workflows.",
    example: "An officer on leave delegates their approval tasks to a colleague.",
    why: "Work continues when someone is unavailable.",
    memory: "Delegate = hand tasks to someone else.",
    temenos: "Authorised via System Parameters > Tasks > Task Parameters; the user profile start date must be earlier than the current system date.",
    related: ["taskactions", "taskservices"],
  },
  taskservices: {
    title: "Task Services & Archival",
    simple: "Background services that must run for task workflows to work, plus where completed tasks go.",
    example: "TM.PROCESS marks workflow tasks complete as they finish.",
    why: "Automation only works if the services run.",
    memory: "TM.PROCESS + EVENT must be AUTO.",
    temenos: "TM.PROCESS and EVENT run in AUTO; completed-tasks enquiry lists a user's finished tasks newest-first; archival is set in EM.TM.PARAMETER.",
    related: ["taskmgmt", "notifications"],
  },
  dfe: {
    title: "File Upload & the DFE",
    simple: "Bulk-uploading files (e.g. from Excel) into Transact, processed through the Data Formatting Engine.",
    example: "Payroll uploads one file that creates loan repayments for 500 staff.",
    why: "Bulk operations at scale are impossible one by one.",
    memory: "DFE = translator between your file and Transact fields.",
    temenos: "Built on the Data Formatting Engine; supports delimiter-based and fixed-position files; handles both financial and non-financial uploads.",
    related: ["fileuploadtables", "fileuploadproc"],
  },
  fileuploadtables: {
    title: "File Upload Parameter Tables",
    simple: "The tables that define where files land, their type, and how columns map to fields.",
    example: "A funds-transfer upload maps its columns to FUNDS.TRANSFER fields via a mapping record.",
    why: "The system must know the file's format and destination.",
    memory: "Path + Type + Mapping.",
    temenos: "FILE.UPLOAD.PARAM (directory), EB.FILE.UPLOAD.TYPE (type/mode/path, company-prefixed per company), DFE.MAPPING (column→field, referenced by DFE.MAPPING.ID).",
    related: ["dfe", "fileuploadproc"],
  },
  fileuploadproc: {
    title: "File Upload Processing",
    simple: "Uploading a file, having it auto-processed, then authorising or fixing the results.",
    example: "A committed FT upload creates records in INAU status; you bulk-authorise them from the Processed Files enquiry.",
    why: "Uploaded records still need control before they take effect.",
    memory: "Upload → INAU → authorise.",
    temenos: "EB.FILE.UPLOAD uploads; service BNK/EM.DFE.FILE.PROCESS (AUTO) processes; Uploaded/Failed enquiries monitor; all records must be authorised or deleted before archiving.",
    related: ["fileuploadtables", "dfe"],
  },
  bulkao: {
    title: "Bulk Account Officer Transfer",
    simple: "Automatically moving a whole portfolio (customers, accounts, loans) from one officer to another.",
    example: "An officer resigns; their entire book is reassigned in one batch.",
    why: "Portfolios change hands often; manual reassignment would be slow and error-prone.",
    memory: "One switch moves the whole book.",
    temenos: "Runs as a background batch updating Customer/Group/Account/Loans/Deposits; service SG.BA.CHANGE.DAO auto-starts on authorising the change.",
    related: ["dao", "taskmgmt"],
  },

  // ---- Section 4: Group Management ----
  grouplending: {
    title: "Group Lending",
    simple: "Small groups borrow collectively and guarantee each other's repayment, so collateral usually isn't needed.",
    example: "Five traders form a group, save for three months, then each receives a loan; peer pressure sustains repayment.",
    why: "A building block of inclusive finance — reaching people without collateral and cutting admin cost by bundling small loans.",
    memory: "The group is the collateral.",
    temenos: "5+ members, ~3 months saving discipline, mutual guarantee; managed by the Group Management application.",
    related: ["groupapp", "grouptype", "centre", "sgv"], diagram: "centre",
  },
  groupapp: {
    title: "Group Management Application",
    simple: "Creates and maintains groups for group lending — but doesn't handle financial transactions itself.",
    example: "You form a group and its members here; the actual loans run through lending.",
    why: "Separates group administration from money movement.",
    memory: "Group app manages people, not money.",
    temenos: "To open group accounts a CUSTOMER record is needed; the system can auto-create a Non-Individual customer record for the group.",
    related: ["grouplending", "grouptype", "creategroup"],
  },
  grouptype: {
    title: "Group Type",
    simple: "The main parameter defining a kind of group — allowed products, size limits and rules.",
    example: "A 'Women's Savings Group' type allows certain loan products, min 5 / max 20 members, single membership.",
    why: "Different programmes need different group rules, encoded once.",
    memory: "Group Type = the rulebook for that group kind.",
    temenos: "Holds Allowed Products (validated at application & contract), min/max membership, the MULTI.GROUPS rule (single only for now), inactivity months and loan-cycle rules.",
    related: ["grouplending", "grouplimits", "groupparams"],
  },
  grouplimits: {
    title: "Group Limits (Revolving / Non-Revolving)",
    simple: "How a group's borrowing ceiling is checked against outstanding and new loans.",
    example: "A revolving group limit compares current + past-due outstanding + the new application against the limit.",
    why: "Controls total group exposure.",
    memory: "Revolving = includes outstanding; Non-revolving = original amounts.",
    temenos: "Savings category codes for the calc are in EM.PRODUCT.PARAMETERS; the available limit shows on the Single Group View.",
    related: ["grouptype", "sgv"],
  },
  groupparams: {
    title: "Group Support Tables",
    simple: "Parameter tables for member maintenance reasons, designations and meeting attendance.",
    example: "A member is tagged Chairperson; a meeting records attendance codes.",
    why: "Attendance and roles are key factors in successful group lending.",
    memory: "Reasons, roles, attendance.",
    temenos: "ICB.GROUP.REASON (maintenance reasons), ICB.GROUP.DESIGNATION (Chairperson/Treasurer…), Attendance Codes (meeting attendance).",
    related: ["grouptype", "groupmaint"],
  },
  creategroup: {
    title: "Creating & Authorising Groups",
    simple: "Forming a group record (validated against its type) and approving it; some groups are 'abbreviated'.",
    example: "You create a group with meeting schedule and venue, then authorise it under Unauthorised groups.",
    why: "Groups need setup and a control step before use.",
    memory: "Create → authorise; abbreviated = info-only members.",
    temenos: "A Non-Individual customer record is auto-created on authorisation; abbreviated groups' members aren't clients (no CIF), only minimum details.",
    related: ["groupapp", "groupmaint"],
  },
  groupmaint: {
    title: "Group Maintenance Actions",
    simple: "The ways a group changes over time: transfers, blocks, exits, reinstatement, splits.",
    example: "A member is credit-blocked from future products; a large group is split into two.",
    why: "Real groups gain/lose members and change status.",
    memory: "Transfer · block · exit · reinstate · split.",
    temenos: "Credit Block updates the BLOCKED field on the customer; transfers may need outstanding cleared and update the customer's DAO to the receiving group's officer.",
    related: ["creategroup", "groupparams", "centre"],
  },
  centre: {
    title: "Centre",
    simple: "A larger grouping of several small groups that meet together for efficiency.",
    example: "Ten 5-member groups form a centre of ~50; a centre manager visits two centres a day.",
    why: "Keeps field costs down while serving many small borrowers.",
    memory: "You join a group, not a centre — a centre is a group of groups.",
    temenos: "Up to 10–12 groups; members join a group not the centre; a group links to only one centre; abbreviated groups can't link; loans/transfers/exits happen at group level.",
    related: ["grouplending", "grouptype"],
  },
  groupenq: {
    title: "Group Enquiries",
    simple: "Reports for viewing a group's arrangements, outstandings, payments and history.",
    example: "An officer runs the outstandings report before a group meeting.",
    why: "Officers need a quick read on group health.",
    memory: "Enquiry = the group's read-out.",
    temenos: "Arrangement details, Outstandings report, Expected payments, Loan application report, Credit history, Group savings report.",
    related: ["sgv", "grouplending"],
  },

  // ---- Section 5: Dividend Processing ----
  dividend: {
    title: "Dividend Processing",
    simple: "Sharing a credit union's yearly profit back to its members based on their savings.",
    example: "A member who kept a high balance all year receives a larger dividend than one with a small balance.",
    why: "Credit unions are member-owned and not-for-profit; sharing profit is the point.",
    memory: "Members own it, so members share the profit.",
    temenos: "A dividend is a share of profit paid to members; a member opens a share account and makes the required deposit to join.",
    related: ["divfeatures", "divformula"], diagram: "dividend",
  },
  divfeatures: {
    title: "Dividend Processing Features",
    simple: "What the module does: parameterise the method, accrue points daily, simulate, post automatically, generate certificates.",
    example: "You simulate the pay-out, then let the system post it on the due date and issue dividend notes.",
    why: "Covers the full cycle from calculation to member correspondence.",
    memory: "Parameterise → accrue → simulate → post → notify.",
    temenos: "Tables under All-in-One > Product Parameters > ACCOUNT Tables; daily accrual of dividend points on applicable share accounts.",
    related: ["dividend", "divrunner"],
  },
  divformula: {
    title: "Dividend Formula & Points",
    simple: "The dividend is calculated from accumulated points, the days in the year and the rate.",
    example: "Higher average balance → more points → bigger dividend.",
    why: "It rewards members in proportion to the savings they kept.",
    memory: "Dividend = (Points ÷ Days in Year) × Rate.",
    temenos: "Points use the average daily balance method; points = sum of daily balances over the month; dividing by days gives the average balance.",
    related: ["dividend", "divminbal"],
  },
  divminbal: {
    title: "Minimum Balance Rule",
    simple: "Daily balance only adds to points if it's above a set minimum, and is truncated to whole currency first.",
    example: "A day below the minimum contributes no points that day.",
    why: "Encourages members to keep a meaningful balance.",
    memory: "Below minimum → no points that day.",
    temenos: "If Account Balance > Minimum Balance then Points += Account Balance (balance truncated to a whole amount).",
    related: ["divformula", "divconfig"],
  },
  divconfig: {
    title: "Dividend Configuration (DVND.CALC / WHT.TAX)",
    simple: "Account-level switches and accounting categories that control dividend calc and tax.",
    example: "Setting DVND.CALC=No excludes an account from dividends.",
    why: "Not every account earns dividends, and some attract withholding tax.",
    memory: "DVND.CALC=No → no dividend; WHT.TAX=Yes → tax it.",
    temenos: "Categories tab holds Dividend Expense and suspense accounts for pending/unpaid dividends and tax; set on the ACCOUNT.",
    related: ["divformula", "divrunner"],
  },
  divrunner: {
    title: "Dividend Runner",
    simple: "The application that runs dividend simulations and the actual posting.",
    example: "You run a simulation, check results, then set the action to Post for the real run.",
    why: "Lets you verify before committing real postings.",
    memory: "Simulate first, then Post.",
    temenos: "Service BNK/EM.DIV.PROCESS.DIVIDENDS; outcomes in EM.DIVIDEND.RUN.DETAILS (failures resubmittable); a dividend note is generated to the customer's documents.",
    related: ["divfeatures", "divconfig"],
  },

  // ---- Section 6: Payment Obligations & Splits ----
  psos: {
    title: "Payment Source → Obligation → Split",
    simple: "A money-management tool: money coming in (a source) is automatically set aside for commitments (obligations) by splitting it.",
    example: "When salary lands, send 50% to the loan instalment and $300 to a rent obligation automatically.",
    why: "Helps customers meet commitments and save for goals without manual transfers.",
    memory: "Source → Obligation → Split: what comes in, what it's for, how it's divided.",
    temenos: "Set up from the SCV; the EVENT service (Business Events) qualifies sources; actions run at COB.",
    related: ["paymenttypes", "paymentsource", "paymentobligation", "paymentsplit"], diagram: "psos",
  },
  paymenttypes: {
    title: "Payment Types (TEC.ITEMS)",
    simple: "Parameter defining the kinds of incoming money that can act as payment sources.",
    example: "A 'local cash deposit' payment type can be set to trigger a split.",
    why: "The system must recognise which transactions count as sources.",
    memory: "Payment Type = a recognised kind of money-in.",
    temenos: "Defined in TEC.ITEMS (transaction type, currency, amount + conditions), based on business events; Inherit=yes shows the field during source creation.",
    related: ["psos", "obligationaction"],
  },
  obligationaction: {
    title: "Obligation Action (EM.PS.OBLIGATION.ACTION)",
    simple: "What happens when an obligation period ends — e.g. auto-send rent to a landlord.",
    example: "TRANSFER.EXTERNAL generates a funds transfer for the collected rent on the obligation date.",
    why: "The obligation must do something with the money it collected.",
    memory: "Action = what to do at the end.",
    temenos: "EM.PS.OBLIGATION.ACTION; uses keywords &OBL.ACCOUNT& / &OBL.CURRENCY& / &OBL.AMOUNT&; defines the app/version and user prompt.",
    related: ["obligationtype", "psos"],
  },
  obligationtype: {
    title: "Obligation Type (EM.PS.OBLIGATION.TYPE)",
    simple: "Defines a kind of obligation — how its amount and frequency behave.",
    example: "A RENT.PAYMENT type asks for an amount and frequency and pays out to a beneficiary.",
    why: "Different goals (rent, savings, loan) need different amount/frequency behaviour.",
    memory: "Type = the shape of the obligation.",
    temenos: "Amount types: User Defined / Track Loan Repayment / Track Loan Arrears. Frequency: One-off / Recurring / Track Repayment Schedule.",
    related: ["obligationaction", "paymentobligation"],
  },
  paymentsource: {
    title: "Payment Source (EB.ALERT.REQUEST)",
    simple: "The first setup step: defines what incoming money triggers a split on an account.",
    example: "A local-currency cash deposit of $500 or more into savings is set as a source.",
    why: "Splits only fire when qualifying money arrives.",
    memory: "Source = the trigger.",
    temenos: "Stored in EB.ALERT.REQUEST; Active Yes/No; the trigger amount is on the Conditions tab; examples: cash/cheque deposits, salary, government benefits.",
    related: ["psos", "paymentsplit"],
  },
  paymentobligation: {
    title: "Payment Obligation (EM.PS.OBLIGATION.INPUT)",
    simple: "What the set-aside money is for, with its amount, frequency and dates.",
    example: "A monthly rent obligation of $300 with start and end dates.",
    why: "Defines each commitment the money serves.",
    memory: "Obligation = the goal the money funds.",
    temenos: "Stored in EM.PS.OBLIGATION.INPUT; 'Run incomplete' executes even if underfunded; 'Track Arrears' tries to recover previous shortfalls.",
    related: ["obligationtype", "paymentsplit"],
  },
  paymentsplit: {
    title: "Payment Split (EM.PS.PAYMENT.SPLIT)",
    simple: "Defines how incoming funds from a source are distributed across obligations.",
    example: "On a cash deposit: 50% to the loan instalment and $300 to rent; on a cheque deposit: 100% to the loan.",
    why: "One deposit often needs dividing across several commitments.",
    memory: "Split = the divide-up rule.",
    temenos: "Stored in EM.PS.PAYMENT.SPLIT; executed one by one until all done or the amount runs out; splits to inactive obligations are skipped.",
    related: ["paymentsource", "psprocessing"],
  },
  psprocessing: {
    title: "Splits Processing",
    simple: "How the system actually runs splits when qualifying money lands, and when obligation actions fire.",
    example: "A qualifying credit triggers the split immediately; the obligation's payout runs at COB on its run date.",
    why: "Timing matters — collection vs payout happen at different moments.",
    memory: "Qualify & split on credit; pay out at COB.",
    temenos: "Business Events qualifies the source; the EVENT service must run in AUTO; obligation actions process during COB on the next run date (recurring recalculates; one-off runs once).",
    related: ["paymentsplit", "psos"],
  },

  // ============ COURSE 2 · AA Lending Foundation Part 1 ============
  // ---- Section 1: Basics of the Lending Product Line ----
  aa2overview: {
    title: "Arrangement Architecture (AA)",
    simple: "Temenos' framework for building banking products from reusable parts and selling them to customers as arrangements.",
    example: "A personal loan product is assembled from interest, term and charge components, then opened for a customer.",
    why: "It replaces rigid per-product code with flexible, reusable building blocks so banks innovate faster.",
    memory: "AA = build once from parts, sell many times.",
    temenos: "An arrangement is an agreement between bank and customer; AA supports several repayment structures and rate types.",
    related: ["aa2prodline", "aa2prodvsarr", "aa2repaystruct"], diagram: "aa2hierarchy",
  },
  aa2repaystruct: {
    title: "Periodic vs Bullet Repayment",
    simple: "Two overall shapes: pay principal+interest over the life, or pay interest during and principal as one lump at the end.",
    example: "A car loan repays a bit of principal each month (periodic); a bridging loan pays interest monthly then all principal at maturity (bullet).",
    why: "Different products and cashflows need different repayment shapes.",
    memory: "Periodic = chip away; Bullet = one big hit at the end.",
    temenos: "Periodic Repayment vs Bullet Repayment; both feed the payment schedule.",
    related: ["aa2repaytypes", "aa2overview"],
  },
  aa2repaytypes: {
    title: "Repayment Types",
    simple: "How each instalment is shaped: Constant, Linear, Actual, Fixed Equal, or User-defined.",
    example: "Constant keeps the instalment level; Linear keeps the principal portion level.",
    why: "Banks and customers need different instalment behaviours.",
    memory: "Constant = level payment; Linear = level principal.",
    temenos: "Constant (annuity), Linear, Actual, Fixed Equal Repayment, User-defined; defaulted from the product, changeable if negotiable.",
    related: ["aa2repaystruct", "aa2ratetypes"],
  },
  aa2ratetypes: {
    title: "Interest Rate Types",
    simple: "AA supports Fixed, Floating, Periodic and Risk-Free (RFR) rates.",
    example: "A fixed loan never changes; a floating loan moves with a base rate; a periodic loan resets on a schedule.",
    why: "Loans price risk differently; the rate type sets how and when the rate can change.",
    memory: "Fixed = frozen · Floating = follows market · Periodic = resets · RFR = lookback.",
    temenos: "Fixed rates hold for the tenure; floating varies; periodic rates apply per time period; RFR are lookback rates.",
    related: ["aa2repaytypes", "aa2overview"],
  },
  aa2prodline: {
    title: "Product Line",
    simple: "The highest level of the product hierarchy — defined by Temenos, made of reusable business components.",
    example: "Lending, Deposits and Accounts are product lines.",
    why: "It sets the shared foundation every product below it draws from.",
    memory: "Line = the top, owned by Temenos.",
    temenos: "Internal product lines are created by Temenos; clients can only change the description. Made of reusable business components.",
    related: ["aa2prodgroup", "aa2buscomp"], diagram: "aa2hierarchy",
  },
  aa2prodgroup: {
    title: "Product Group",
    simple: "The second level — a user-definable subset of a product line.",
    example: "Under Lending: Mortgages, Working Capital Loans, Personal Loans.",
    why: "It organises products into meaningful families the bank controls.",
    memory: "Group = a family of products the client defines.",
    temenos: "User-definable; any number under a line; made of business components selected from the line.",
    related: ["aa2prodline", "aa2product"],
  },
  aa2product: {
    title: "Product",
    simple: "The third level — a user-definable subset of a group where values get assigned to component fields.",
    example: "A '5-Year Fixed Mortgage' product with rate 4.5% fixed and term 36 months.",
    why: "It's the actual saleable thing, differentiated by its condition values.",
    memory: "Product = the item on the menu.",
    temenos: "Values assigned to business-component fields here are Product Conditions; you can control whether they're amendable at arrangement level.",
    related: ["aa2prodgroup", "aa2prodcond", "aa2prodvsarr"],
  },
  aa2buscomp: {
    title: "Business Components",
    simple: "Reusable building blocks (Interest, Charges, Term Amount, Schedule…) that products are assembled from.",
    example: "The Interest component is reused across mortgages, personal loans and overdrafts.",
    why: "Reuse means building products by assembling parts, not writing each from scratch.",
    memory: "Like car parts: one design fits many models.",
    temenos: "Components can be used across product lines; some are mandatory, some optional per line.",
    related: ["aa2product", "aa2prodcond"],
  },
  aa2prodcond: {
    title: "Product Conditions",
    simple: "The values assigned to a component's fields — e.g. Rate = 4.5%, Type = Fixed, Term = 36 months.",
    example: "Setting the Interest component to 4.5% fixed and the Term to 36 months defines the product.",
    why: "Product conditions are exactly what make one product different from another.",
    memory: "Same components, different conditions = different products.",
    temenos: "Values assigned to business-component fields at product level; determine the differences between products.",
    related: ["aa2buscomp", "aa2prodvsarr"],
  },
  aa2prodvsarr: {
    title: "Products vs Arrangements",
    simple: "A Product is the template; an Arrangement is one instance of it sold to a customer.",
    example: "'Personal Loan' is the product; Harry's specific $42,000 loan is an arrangement.",
    why: "This is the core mental model of AA — and the most tested idea.",
    memory: "Product = menu item; Arrangement = the meal on your table.",
    temenos: "An arrangement is created as a copy of the product conditions; negotiated values become Arrangement Conditions.",
    related: ["aa2product", "aa2prodcond", "aa2ids"], diagram: "aa2hierarchy",
  },
  aa2catalog: {
    title: "Product Catalog",
    simple: "The common place to browse all AA products and start new arrangements.",
    example: "Navigate Lending → Personal Loans → Personal Loan, then click 'New Arrangement'.",
    why: "One catalog makes finding and selling products easy.",
    memory: "Catalog = the shop window for products.",
    temenos: "Navigate line → group → product; the New Arrangement icon starts the sale (Simulate is also available).",
    related: ["aa2prodvsarr", "aa2create"],
  },

  // ---- Section 2: Creating & Authorising Lending Arrangements ----
  aa2ids: {
    title: "The Three Auto-Generated IDs",
    simple: "Creating an arrangement generates an Activity ID, an Arrangement ID and an Account ID.",
    example: "Attempting creates AAACT…; validating creates AA…; plus an account number holds the loan balance.",
    why: "Each ID tracks a different thing — the action, the agreement, and the money.",
    memory: "Attempt → Activity ID; Validate → Arrangement ID; plus the Account ID.",
    temenos: "Activity ID = AAACT+YYDDD+seq (at attempt); Arrangement ID = AA+YYDDD+seq (at validation); dates are Julian; the initial ID is NEW.",
    related: ["aa2roles", "aa2create"], diagram: "aa2createflow",
  },
  aa2roles: {
    title: "Customer Roles on an Arrangement",
    simple: "Who's who on the deal — beneficial owners and non-beneficial parties like guarantors.",
    example: "A loan has a primary borrower (beneficial owner), a guarantor, and an authorised signatory.",
    why: "Loans often involve several parties; the system must know each one's part.",
    memory: "First beneficial owner runs the show (accounting/tax/limits).",
    temenos: "Roles held in AA.CUSTOMER.ROLE (Applicant, Guarantor, Beneficiary…); the first beneficial owner drives accounting, reporting, tax and limits; all owners must exist in CUSTOMER.",
    related: ["aa2ids", "aa2settle"],
  },
  aa2commit: {
    title: "Commitment Amount & Term",
    simple: "The approved facility amount to lend, and the period over which it's repaid.",
    example: "A $150,000 commitment (entered 150T) over a 12-month term.",
    why: "These define the size and length of the loan.",
    memory: "T = thousands, M = millions; give term OR maturity.",
    temenos: "Commitment can use T/M; term in days/weeks/months/years or blank for Call products; either term or maturity date is required; defaulted from product, changeable if negotiable.",
    related: ["aa2repayfreq", "aa2ids"],
  },
  aa2repayfreq: {
    title: "Repayment Frequency, Type & Account Officer",
    simple: "How often repayments fall due, their shape, and who owns the loan.",
    example: "Monthly frequency, Constant type; account officer defaults from the customer record.",
    why: "Sets the repayment rhythm and ownership for MIS.",
    memory: "Frequency + type + officer.",
    temenos: "Frequency in days/business days/weeks/months/years; type defaulted from product; the Account Officer defaults from ACCOUNT.OFFICER on the CUSTOMER record if not entered.",
    related: ["aa2commit", "aa2settle"],
  },
  aa2settle: {
    title: "Limit, Settlement & Pay In/Pay Out",
    simple: "The sanctioned limit, and the accounts money is disbursed to and repaid from.",
    example: "Pay Out account receives the disbursement; Pay In account is debited for repayments.",
    why: "The system must know where money goes and comes from to automate settlement.",
    memory: "Pay OUT = disburse to; Pay IN = repay from.",
    temenos: "A sanctioned limit can be stated; Settlement can use another arrangement/account; Active=Yes enables disbursement/repayment.",
    related: ["aa2repayfreq", "aa2properties"],
  },
  aa2properties: {
    title: "Arrangement Spread Across Properties",
    simple: "An arrangement isn't one record — it's a set of arrangement conditions, one per property of the product.",
    example: "Commitment, Interest, Schedule and Settlement each appear as their own tab.",
    why: "Because it's scattered, you use the composite screens rather than raw tables.",
    memory: "Many tabs = many property records = one arrangement.",
    temenos: "Body of the arrangement = a set of arrangement conditions, one per property; use enquiries/composite screens to view it.",
    related: ["aa2prodvsarr", "aa2ovconditions"],
  },
  aa2create: {
    title: "Create → Commit Flow",
    simple: "Open the arrangement, capture details, validate, then commit.",
    example: "Fill customer + currency, validate to generate the ID, capture amount/term/settlement, then commit.",
    why: "A structured flow ensures all required data is captured before the record exists.",
    memory: "Fill → validate → capture → commit.",
    temenos: "From the Product Catalog use New Arrangement; validating the initial screen generates the Arrangement ID and reveals all properties/tabs.",
    related: ["aa2catalog", "aa2overrides"], diagram: "aa2createflow",
  },
  aa2overrides: {
    title: "Overrides & Txn Complete",
    simple: "On commit the system may raise warnings you must accept before the record saves.",
    example: "'Maximum negotiation value exceeded' or 'Have you received the Loan Agreement?' → set Received, then Accept.",
    why: "Overrides are the bank's checkpoint against errors and policy breaches.",
    memory: "Accept overrides → 'Txn Complete' → now Unauthorised.",
    temenos: "Common overrides: negotiation limit exceeded, unauthorised overdraft, loan-agreement received; accepting gives Txn Complete; the arrangement is then Unauthorised.",
    related: ["aa2create", "aa2authorise"],
  },
  aa2authorise: {
    title: "Authorising the Arrangement",
    simple: "A second user approves the unauthorised arrangement to make it live.",
    example: "Find the loan under Unauthorised, open the overview, choose Approve, then authorise.",
    why: "Input-and-authorise is the core two-person control.",
    memory: "Find Loan → Unauthorised → Approve.",
    temenos: "Retail Operations → Find Loan → Unauthorised → enter Owner → Approve from Pending Approval; if the product auto-disburses, status becomes Current.",
    related: ["aa2overrides", "aa2findloan", "aa2recordstatus"], diagram: "aa2createflow",
  },
  aa2recordstatus: {
    title: "Record Status Lifecycle (IHLD · INAO · INAU · RNAU · LIVE)",
    simple: "The stages a record moves through from a half-finished draft to a fully live, production record.",
    example: "You start a loan for customer 100343 and save it half-filled: IHLD. You commit it: INAU, waiting for a supervisor. They authorise it: LIVE.",
    why: "Every status is a checkpoint — nothing reaches production without passing input, override and authorisation controls.",
    how: "IHLD = a draft, not yet submitted to the validation queue. INAO = submitted but blocked on an unaccepted override. INAU = fully committed by the operator, now waiting on a second user (supervisor) to authorise. RNAU = a reversal/cancellation of a live record, itself waiting on supervisor sign-off. LIVE = all checks passed, overrides accepted, supervisor authorised — active in production.",
    temenos: "IHLD (Input Held): saved as a draft, not committed — e.g. a part-filled AA arrangement for customer 100343 kept aside to finish later. INAO (Input Authorised - Overrides): commit triggered a policy warning (e.g. 'Maximum discount exceeded') that blocks completion until the override is accepted. INAU (Input Authorised - Needs Authorisation): operator hit commit and got 'Txn Complete' — record AA2507602X98 now sits in the pending queue for a supervisor. RNAU (Reverse Unauthorised): a reversal (R mode) of an existing live record is pending supervisor approval — e.g. undoing a loan created by mistake. LIVE: fully authorised and active — generating schedules, accruing interest, posting to the GL.",
    memory: "Draft (IHLD) → blocked on override (INAO) → committed, needs authorising (INAU) → reversal pending (RNAU) → LIVE.",
    related: ["aa2overrides", "aa2authorise", "aa2findloan"], diagram: "aa2statusflow",
  },

  // ---- Section 3: Lending Arrangement Overview Enquiries ----
  aa2findloan: {
    title: "Find Loan & Statuses",
    simple: "The enquiry to locate arrangements, filtered by owner/product/status.",
    example: "The Authorised tab lists a customer's live loans; statuses show Not Disbursed, Current, Dormant, Delinquent.",
    why: "You need to find and open any loan quickly.",
    memory: "Find Loan tabs: Authorised · Unauthorised · Pending · New Offers.",
    temenos: "Filter by Owner/Arrangement/Product/Currency/Status; results show each arrangement's status.",
    related: ["aa2authorise", "aa2ovbasic"],
  },
  aa2ovbasic: {
    title: "Overview: Basic & Agent Details",
    simple: "The top of the Arrangement Overview — key identifiers plus any agent who brought the business.",
    example: "Shows Arrangement ID, Account, Currency, Product, Arrangement Date, Beneficial Owner, Status; plus Agent ID/role if applicable.",
    why: "A quick header telling you what and whose the loan is.",
    memory: "Basic Details = the loan's name badge.",
    temenos: "Arrangement Date = effective/start date; Status e.g. Not Disbursed / Current / Pending Closure; Agent Details show where an agent introduced the loan.",
    related: ["aa2findloan", "aa2ovconditions"],
  },
  aa2ovconditions: {
    title: "Overview: Arrangement Conditions",
    simple: "The Basic and Additional condition sections of the loan.",
    example: "Basic: account static, commitment, APR, interest, schedule. Additional: charges, statement, reporting.",
    why: "This is where you read (and, if negotiable, amend) the loan's terms.",
    memory: "Basic = money terms; Additional = fees & reporting.",
    temenos: "Basic shows commitment/interest/schedule; Additional shows charges (e.g. Ageing Bill Fee, Payoff Fee), statement details and IFRS reporting.",
    related: ["aa2properties", "aa2ovfinancial"],
  },
  aa2ovfinancial: {
    title: "Overview: Financial Summary & Payoff/Holiday",
    simple: "Balances and dates, plus actions to pay the loan off or take a payment holiday.",
    example: "Shows Commitment (Total), Available Commitment, Total Principal, and Start/Cooling/Maturity dates.",
    why: "It's the loan's financial dashboard and self-service actions.",
    memory: "Available Commitment = approved minus drawn.",
    temenos: "Request Payoff includes remaining accrued interest; Payment Holiday (from R18) can skip payments or set flexible limits.",
    related: ["aa2ovconditions", "aa2accrued"],
  },
  aa2accrued: {
    title: "Overview: Accrued Interest",
    simple: "Sections showing interest accrued this period, posted last period, and year-to-date.",
    example: "Principal interest accrued 43.87 this period; total interest YTD 84.97.",
    why: "Lets you see exactly how interest is building up.",
    memory: "Current · Previous · YTD.",
    temenos: "Accrued Interest – Current Period, Interest Posted – Previous Period, Total Interest – YTD, per interest type.",
    related: ["aa2ovfinancial", "aa2additional"],
  },
  aa2additional: {
    title: "Overview: Additional Details",
    simple: "Drop-down sub-views: activity log, bills, messages, correspondence, schedule, overdue stats.",
    example: "The Schedule sub-view shows the full payment plan; Messages shows SWIFT confirmations.",
    why: "Everything else about the loan's life, on demand.",
    memory: "Activity · Bills · Messages · Schedule · Overdue.",
    temenos: "Messages include MT320/330/350/935; Schedule is generated at runtime (a Nofile enquiry); Overdue shows statistics; Bills are generated when payments fall due.",
    related: ["aa2accrued", "aa2ovbasic"],
  },

  // ============ COURSE 3 · AA Lending Foundation Part 2 ============
  // ---- Section 1: Dependencies & Interest Rate Types ----
  aa3deps: {
    title: "AA Dependencies (Account-Based)",
    simple: "AA lending leans on other modules and static tables, and is account-based — opening a loan auto-creates a loan account.",
    example: "Creating a loan arrangement instantly creates an account that holds the loan's balances.",
    why: "The loan's money must live somewhere; the auto-created account is its home.",
    memory: "Open an arrangement → get an account for free.",
    temenos: "Depends on Customer, Accounts, Delivery, Accounting, Limits and static tables (Country, Region, Holiday, Currency).",
    related: ["aa3ratetypes", "aa3daybasis"],
  },
  aa3ratetypes: {
    title: "The Four Interest Rate Types",
    simple: "AA supports Fixed, Floating, Periodic and Risk-Free (RFR) rates — each stored differently.",
    example: "Fixed 4.5% never changes; floating tracks a base rate; periodic resets on a schedule.",
    why: "Loans price risk differently; the rate type controls how and when the rate changes.",
    memory: "Fixed · Floating · Periodic · RFR.",
    temenos: "Fixed changes only by manual amendment; the others read from rate tables (see Floating and Periodic).",
    related: ["aa3floating", "aa3periodic", "aa3rfr"],
  },
  aa3floating: {
    title: "Floating Rates (BASIC.INTEREST)",
    simple: "Rates tied to a market indicator that change as the market moves.",
    example: "A loan priced at 'base rate + 0.5%' moves whenever the base rate changes.",
    why: "Lets pricing follow the market automatically.",
    memory: "Floating lives in BASIC.INTEREST, keyed 1+CCY+date.",
    temenos: "Configured via BASIC.RATE.TEXT + BASIC.INTEREST; the index is set in FLOATING.INDEX; key = 1 + currency + most-recent date; a margin can be added/deducted.",
    related: ["aa3ratetypes", "aa3periodic"],
  },
  aa3periodic: {
    title: "Periodic & Interpolation (PERIODIC.INTEREST)",
    simple: "LIBOR-type rates looked up by index + currency + term + date, resetting on schedule.",
    example: "A 3-month periodic loan takes the offered rate for that period and resets at each review.",
    why: "Supports term-based reference rates common in lending.",
    memory: "Periodic lives in PERIODIC.INTEREST; if the term doesn't match, interpolate.",
    temenos: "Keys are system-generated; PERIODIC.AUTOMATIC schedules reviews; feed can auto-update daily; interpolation: default / NEXT / PREVIOUS / CLOSEST; PERIODIC.PERIOD defaults to TERM.",
    related: ["aa3floating", "aa3rfr"],
  },
  aa3rfr: {
    title: "Risk-Free Rates (RFR)",
    simple: "Lookback reference rates (post-LIBOR), stored alongside periodic rates.",
    example: "A loan priced off a compounded overnight risk-free rate observed in arrears.",
    why: "Regulators moved lending benchmarks from LIBOR to risk-free rates.",
    memory: "RFR = lookback rates, in PERIODIC.INTEREST.",
    temenos: "Held in PERIODIC.INTEREST via RFR.Rate and RFR.Date.Received (from R21).",
    related: ["aa3periodic", "aa3ratetypes"],
  },
  aa3daybasis: {
    title: "Interest Day Basis",
    simple: "The day-count convention deciding how many days are in a period and a year for interest.",
    example: "Basis A treats each month as 30 days over a 360-day year; basis E uses actual days over 365.",
    why: "Interest amounts depend entirely on how days are counted.",
    memory: "A = 30/360 · B = actual/360 · E = actual/365 · S = special.",
    temenos: "Set at currency or product-condition level; S lets you state total interest and derive a rate; CURRENCY.MARKET allows up to 99 market rates per currency.",
    related: ["aa3ratetypes", "aa3deps"],
  },

  // ---- Section 2: Lending Concepts ----
  aa3schedules: {
    title: "Repayment Schedule Types",
    simple: "How a loan repays: Constant, Linear, Actual, Fixed Equal or User-defined.",
    example: "Fixed Equal: the customer picks the instalment and the system derives the term.",
    why: "Products and customers need different repayment shapes.",
    memory: "Constant = level payment · Linear = level principal · Fixed Equal = you set the payment.",
    temenos: "The system generates a date-wise schedule splitting each instalment into principal/interest/charges; Constant is also called EMI.",
    related: ["aa3tiers", "aa3commitment"],
  },
  aa3tiers: {
    title: "Tiered Interest (Single/Level/Banded)",
    simple: "How interest applies across balance sizes: one rate, a rate by balance, or a blended per-portion rate.",
    example: "Banded: 5.5% up to 100k, base+1.5% on the 100k–200k slice, base+1.8% above — each slice at its own rate.",
    why: "Banks price larger balances differently; tiers encode that.",
    memory: "Single = one rate · Level = whole balance at its tier · Banded = portion-by-portion (no compounding).",
    temenos: "Set by RATE.TIER.TYPE = Single / Level / Banded; margins and min/max rates per tier.",
    related: ["aa3ratetypes", "aa3schedules"],
  },
  aa3charges: {
    title: "Charges",
    simple: "Fees on a loan — fixed or calculated, applied flat, by percentage or by unit.",
    example: "A fixed $100 arrangement fee, a 1% calculated fee, or a per-transaction unit charge.",
    why: "Fees are core bank revenue and must be flexible per product.",
    memory: "FIXED or CALCULATED; FLAT / PERCENTAGE / UNIT.",
    temenos: "CHARGE.TYPE = FIXED/CALCULATED; tiers via TIER.GROUPS (BANDS/LEVELS); a BONUS/rebate charge credits the customer instead of debiting.",
    related: ["aa3schedules", "aa3overdue"],
  },
  aa3overdue: {
    title: "Overdue Rules (GRC → DEL → NAB)",
    simple: "When instalments aren't paid, the loan moves through overdue statuses with escalating action.",
    example: "Grace after 1 day, Delinquent after 5 (chaser every 2 weeks), Non-Accrual after 60 (income suspended).",
    why: "Banks must track non-performing loans and stop booking income they may not receive.",
    memory: "GRC → DEL → NAB = Grace → Delinquent → Non-Accrual.",
    temenos: "Statuses are user-defined via EB.LOOKUP against AA.OVERDUE.STATUS; in NAB, interest posts to a suspense account, not P&L.",
    related: ["aa3charges", "aa3suspend"], diagram: "aa3overdueflow",
  },
  aa3commitment: {
    title: "Commitment & Revolving",
    simple: "The approved facility amount, and whether repayments free it up to draw again.",
    example: "On a revolving line, repaying principal lets you borrow again; on a term loan it doesn't.",
    why: "Lines of credit and term loans behave differently; the flag captures it.",
    memory: "NO = term loan · PAYMENT/REPAYMENT = revolving.",
    temenos: "Available Commitment = approved minus drawn (reported contingent); Revolving = NO / PAYMENT / REPAYMENT; Commitment Reversal = None / On Maturity / On Closure.",
    related: ["aa3schedules", "aa3limits"],
  },

  // ---- Section 3: Capturing Financial Activities ----
  aa3activity: {
    title: "Activity",
    simple: "The only way to change an arrangement — disburse, repay, accrue, amend. Viewing is not an activity.",
    example: "Disbursing, accruing interest overnight, or changing the term are activities; opening the overview to look is not.",
    why: "Forcing all changes through activities gives a complete, reversible audit trail.",
    memory: "Changes it = activity; just looks = not.",
    temenos: "Defined by Temenos; five launch methods (Overview, transaction, COB, integration, secondary); recorded newest-first in the Activity Log.",
    related: ["aa3disburse", "aa3amend"],
  },
  aa3disburse: {
    title: "Disbursement & Repayment (Payment Order)",
    simple: "Releasing loan money, and collecting repayments, via a Payment Order mapped to a lending activity.",
    example: "A Payment Order pays out $15,000; another collects $1,515, allocated to the oldest bill first.",
    why: "Payment Orders are the standard channel for moving loan money in and out.",
    memory: "PO out = disburse; PO in = repay (oldest bill first).",
    temenos: "TSM=START and BNK/PAYMENT.STPFLOW.HEAVY=AUTO; repayment follows product-level allocation rules.",
    related: ["aa3activity", "aa3limits"],
  },
  aa3limits: {
    title: "Limits",
    simple: "A ceiling on the bank's exposure to a borrower, checked when money is disbursed.",
    example: "A $50k limit is attached; a disbursement that would exceed it triggers an override.",
    why: "Limits control credit risk and must exist before they're attached.",
    memory: "Limit = the ceiling the loan can't quietly break.",
    temenos: "Named in LIMIT.REFERENCE; UPDATE.COMMT.LIMIT checks the limit at creation, not just disbursal; limits are created manually and attached via an update activity.",
    related: ["aa3disburse", "aa3commitment"],
  },
  aa3suspend: {
    title: "Suspend / Resume Arrangement",
    simple: "Stopping (and later restarting) recognition of a loan's income when it goes bad.",
    example: "A loan enters non-accrual; you suspend it so interest posts to suspense, then resume when it recovers.",
    why: "Banks shouldn't book income they may never collect (accounting prudence).",
    memory: "Suspend = stop counting income; Resume = start again.",
    temenos: "Suspend diverts accruals to a suspense balance (e.g. ACC.LOAN.INT.SP); accrual status becomes Suspended.",
    related: ["aa3overdue", "aa3activity"],
  },

  // ---- Section 4: Amendment & Update Activities ----
  aa3amend: {
    title: "Amendment Activities",
    simple: "Changing a live loan — customer, commitment, term, schedule, interest, charges — but only where negotiable.",
    example: "Extend the term from 2 to 7 years and the instalment drops; or waive a negotiable charge to zero.",
    why: "Real loans change; the system allows controlled amendments with authorisation.",
    memory: "You can only change what was made negotiable at product level.",
    temenos: "Each amendment is its own activity needing authorisation; Change Commitment can auto-disburse the increase (Drawdown=Auto); Change Customer needs no relationship but the new customer must own any limit.",
    related: ["aa3activity", "aa3holiday"],
  },
  aa3holiday: {
    title: "Payment Holiday",
    simple: "Letting a customer skip instalments, with the schedule recalculated to compensate.",
    example: "A customer skips Oct/Nov/Dec; remaining instalments rise, or the term extends, to make up for it.",
    why: "It helps customers through hardship without defaulting.",
    memory: "Skip now, pay more later (or for longer).",
    temenos: "From 'Request Payment Holidays'; recalculation method = spread payment / extend term / lump onto the final instalment.",
    related: ["aa3amend", "aa3schedules"],
  },

  // ---- Section 5: Hands-On ----
  aa3hands: {
    title: "Hands-On: Manual Loan & Limit",
    simple: "The manual (non-auto-disburse) path, and creating then attaching a limit.",
    example: "Set disbursement Active=No so the loan doesn't auto-disburse; create a limit, authorise it, then attach it via an update activity.",
    why: "Real setups often disburse manually and require a limit first.",
    memory: "Active=No → no auto-disburse; limit must exist before you attach it.",
    temenos: "Overrides (working-day, overdraft, fee-vs-limit, loan-agreement-received) are normal; attach a limit with 'Update Activity for Limit' using its transaction reference.",
    related: ["aa3limits", "aa3amend"],
  },

  // ---- Section 6: Simulations & Reverse and Replay ----
  aa3sim: {
    title: "Simulation (What-If)",
    simple: "Testing an activity or arrangement without touching live data.",
    example: "Show a customer their instalment at different amounts and rates before committing.",
    why: "It supports decisions and quotes with zero risk to live records.",
    memory: "Simulate = rehearse; execute = perform for real.",
    temenos: "Writes to SIM files; found under NEW OFFERS; status 'Simulated'; convertible to live; uses AA.SIMULATION.SERVICE (Capture → Runner).",
    related: ["aa3reverse", "aa3activity"],
  },
  aa3reverse: {
    title: "Reverse & Replay",
    simple: "Inserting a back-dated change: the system reverses activities back to that date, then replays forward.",
    example: "A rate change effective last month is entered today; the system unwinds to last month and re-runs everything since.",
    why: "It keeps balances and accounting correct after back-dated corrections.",
    memory: "Reverse back to the date, then replay forward to today.",
    temenos: "Enabled by LIFE.ATTRIBUTE=REPLAY on the product line; accounting entries pass for both reversal and replay; flags NOREVERSE/NOREPLAY/NORR.",
    related: ["aa3sim", "aa3activity"], diagram: "aa3reverseflow",
  },

  // ============ COURSE 4 · AA Implementation Part 1 ============
  // ---- Section 1: Building Blocks ----
  aai1silo: {
    title: "Product Silos (the problem AA solves)",
    simple: "The old model where each module had its own tables and logic, so one product often needed several modules.",
    example: "Servicing a product used to mean implementing AC plus local developments for simple things like availability.",
    why: "Silos limit reuse and make innovation slow — the reason AA exists.",
    memory: "Silos = separate boxes; AA = shared building blocks.",
    temenos: "Modules like AC, MG, LD, AZ each had their own parameter/transaction tables and processing.",
    related: ["aai1propclass", "aai1hierarchy"],
  },
  aai1propclass: {
    title: "Property Class",
    simple: "A reusable building block released by Temenos (Interest, Charge, Account…) with attributes and actions.",
    example: "The Interest property class is the reusable block behind every interest-bearing product.",
    why: "Property classes are the fundamental Lego bricks of AA.",
    memory: "Class = the block Temenos ships; you can only rename its description.",
    temenos: "AA.PROPERTY.CLASS — released by Temenos, only the description is editable; has balance prefixes/suffixes and actions.",
    related: ["aai1property", "aai1prodcond", "aa2buscomp"], diagram: "aai1buildchain",
  },
  aai1property: {
    title: "Property",
    simple: "A named instance of a property class that you actually use in products.",
    example: "The Interest class gives two properties: Principal Interest and Penalty Interest — same attributes, different values.",
    why: "You build products from properties, not raw classes.",
    memory: "Class = the mould; Property = the named copy poured from it.",
    temenos: "AA.PROPERTY — client-defined; PROPERTY.TYPE flags special behaviour (e.g. PRODUCT.ONLY hides it at arrangement level).",
    related: ["aai1propclass", "aai1prodcond", "aai1proptype"],
  },
  aai1prodcond: {
    title: "Product Condition (Rules & Effective Date)",
    simple: "A set of values and rules for a property class, linked to a property at product level.",
    example: "An Interest condition: type=Fixed, rate=5%, with negotiation rules and an effective date.",
    why: "Conditions carry not just values but the rules (negotiation, dating) that govern them.",
    memory: "Condition = values + rules + effective date.",
    temenos: "Holds default attribute values plus negotiation/periodic/access rules; a product = an assembly of product conditions.",
    related: ["aai1property", "aai1arr"],
  },

  // ---- Section 2: Hierarchy & Account Types ----
  aai1hierarchy: {
    title: "Product Hierarchy & Tables",
    simple: "Three levels — Product Line → Product Group → Product — with fixed ownership.",
    example: "Lending line (Temenos) → Mortgages group (client) → 5-Year Fixed product (client).",
    why: "A clear hierarchy lets banks reuse building blocks and create products fast.",
    memory: "Line (Temenos) → Group (client) → Product (client).",
    temenos: "Tables AA.PRODUCT.LINE / .GROUP / AA.PRODUCT; a line is a combination of property classes; a group keeps all mandatory classes.",
    related: ["aai1inherit", "aai1propclass"], diagram: "aai1buildchain",
  },
  aai1inherit: {
    title: "Inheritance (Saleable vs Inheritance-Only)",
    simple: "Products can inherit conditions from a parent, so you build variations without redefining everything.",
    example: "Mortgage → Flexible Mortgage → Capped Mortgage; the lowest is saleable and inherits the rest.",
    why: "It avoids rebuilding all conditions for each small product variation.",
    memory: "One parent, many children, same group; lower level wins.",
    temenos: "Saleable (complete) vs Inheritance-only (parent template); a level inherits only properties it doesn't define; lower-level conditions override.",
    related: ["aai1hierarchy", "aai1arr"],
  },
  aai1acctcontract: {
    title: "Account-Based vs Contract-Based",
    simple: "Account products can flip positive/negative; contract products (loans/deposits) keep a fixed nature.",
    example: "A current account swings into overdraft; a term loan is always a loan until repaid.",
    why: "The distinction shapes how balances and accounting behave.",
    memory: "Account = sign can flip; Contract = nature is fixed.",
    temenos: "AA gives arrangements a term + maturity, unifying these worlds under one architecture.",
    related: ["aai1nostro", "aai1hierarchy"],
  },
  aai1nostro: {
    title: "Nostro / Vostro Accounts",
    simple: "Nostro = our account held at another bank; Vostro = their account held with us.",
    example: "An Ethiopian bank keeps USD at a US bank — from the Ethiopian bank's view that's a Nostro account.",
    why: "They make cross-border payments and foreign-currency settlement possible.",
    memory: "NOSTRO = OUR account; VOSTRO = YOUR account.",
    temenos: "Both are account-based products; classification depends on whose books you're viewing from.",
    related: ["aai1acctcontract"], diagram: "aai1nostro",
  },
  aai1arr: {
    title: "Products & Arrangements (Implementation View)",
    simple: "An arrangement is an instance of a product for a customer, created as a copy of the product's conditions.",
    example: "A mortgage's standard 0.5% margin is reduced to 0.25% for one customer — an arrangement condition.",
    why: "It lets banks tailor deals per customer, but only where negotiation is allowed.",
    memory: "Arrangement = a copy of conditions you can negotiate.",
    temenos: "Creating an arrangement = negotiating changes; modified conditions become Arrangement Conditions where the negotiation rules permit.",
    related: ["aai1prodcond", "aai1inherit"],
  },

  // ---- Section 3: The Product Builder ----
  aai1builder: {
    title: "AA Product Builder",
    simple: "The single tool to define an AA product end to end, replacing scattered module parameters.",
    example: "From one screen you browse lines, create groups, build products, then proof and publish.",
    why: "One mechanism and one catalog beat setting different parameters in different modules.",
    memory: "One builder, one catalog, whole product start to finish.",
    temenos: "AA.PRODUCT.DESIGNER; the config screen spans AA.PRODUCTLINE / .GROUP / AA.PRODUCT / AA.PROPERTY / AA.PROPERTY.CLASS.",
    related: ["aai1proof", "aai1variation"],
  },
  aai1proof: {
    title: "Proof → Publish",
    simple: "The two-step release: proofing validates the product; publishing adds it to the catalog for sale.",
    example: "You design a personal loan, proof it (validation passes), then publish it so arrangements can open under it.",
    why: "Proofing is the safety check that all mandatory conditions and accounting are in place.",
    memory: "Proof = pass the test; Publish = go live in the catalog.",
    temenos: "At mere definition time completeness isn't checked — only proofing validates conditions, accounting and calculation sources.",
    related: ["aai1builder", "aai1hierarchy"], diagram: "aai1proofflow",
  },
  aai1variation: {
    title: "Variation",
    simple: "An extra component in a product condition enabling preferential pricing by channel or scheme.",
    example: "The same product offers a better interest condition to customers who apply through 'Internet'.",
    why: "Banks want one product with different pricing per channel, not many near-identical products.",
    memory: "Variation = same product, special pricing per channel/scheme.",
    temenos: "Named variations live in AA.PRODUCT.VARIATION; the variation component must be a valid EB.LOOKUP entry.",
    related: ["aai1builder", "aai1proptype"],
  },
  aai1proptype: {
    title: "PROPERTY.TYPE Flags",
    simple: "Multi-valued flags on a property that switch on special behaviour.",
    example: "PRODUCT.ONLY hides accounting properties at arrangement level; INFO records informational charges.",
    why: "Properties need special behaviours (hide, suspend, rebate) without new code.",
    memory: "Type flags = the property's special powers.",
    temenos: "Includes PRODUCT.ONLY, VARIATION, FORWARD.DATED, the SUSPEND family, REBATE.UNAMORTISED, INFO.",
    related: ["aai1property", "aai1balances"],
  },
  aai1balances: {
    title: "Balance Prefixes & Suffixes",
    simple: "Codes on balance types that describe where a loan is in its lifecycle.",
    example: "CUR = current/live, ACC = accrued, DUE = due, AGE = aged by overdue status; SP suffix = suspended.",
    why: "One balance type can move through stages; the codes track that movement.",
    memory: "CUR/ACC/DUE/AGE (prefix) + SP/CO/CUST/INF (suffix).",
    temenos: "Held per property class; AC.BALANCE.TYPE stores all IDs; virtual balances are sums of several types.",
    related: ["aai1proptype", "aai1propclass"],
  },

  // ============ COURSE 5 · AA Implementation Part 2 ============
  // ---- Section 1: Arrangement Internals ----
  aai2storage: {
    title: "Where Arrangement Data Lives",
    simple: "An arrangement isn't one record — its values are spread across a table per property class.",
    example: "Customer values sit in AA.ARR.CUSTOMER; interest values in AA.ARR.INTEREST; base data in AA.ARRANGEMENT.",
    why: "Because products are built from property classes, arrangement data mirrors that structure.",
    memory: "One arrangement, many AA.ARR.<CLASS> records.",
    temenos: "Record ID in AA.ARR.<CLASS> = Arrangement-Property-Date-Serial; conditions in AA.PRD.CAT.<CLASS>; sims in AA.SIM.<CLASS>.",
    related: ["aai2altid", "aai2actclass"],
  },
  aai2altid: {
    title: "Alternate ID",
    simple: "An alternative reference for an arrangement, usable instead of the arrangement number.",
    example: "A bank tags a loan with an external reference and finds the loan by it later.",
    why: "External systems and staff often prefer their own reference.",
    memory: "Alternate ID = the loan's nickname, unique everywhere.",
    temenos: "Unique across all product lines and companies; amend/unlink via the <Line>-AMEND.ALT.ID-ARRANGEMENT activity.",
    related: ["aai2storage"],
  },

  // ---- Section 2: Activities & Activity Classes ----
  aai2actclass: {
    title: "Activity Class",
    simple: "The template that holds an activity's logic; activities are named instances of it.",
    example: "The class LENDING-DISBURSE-TERM.AMOUNT produces the activity LENDING-DISBURSE-COMMITMENT.",
    why: "Logic lives once in the class and is reused by every property's activity.",
    memory: "Class = Line-Process-Class; Activity = Line-Process-Property.",
    temenos: "The Action tab lists background actions (ACCRUE, EVALUATE, CALCULATE, SEND.MESSAGE); routines follow AA.<Class>.<Action>.",
    related: ["aai2rebuild", "aai2launch", "aai2storage"],
  },
  aai2rebuild: {
    title: "REBUILD.ACTIVITIES",
    simple: "The switch that auto-generates all an arrangement's activities when you build a product group.",
    example: "Add a property to a product group with rebuild set to Yes, and its standard activities are created.",
    why: "Hand-creating every activity would be error-prone; the system builds them from the classes.",
    memory: "Rebuild = auto-generate the activity set.",
    temenos: "Set REBUILD.ACTIVITIES=YES in the product group; only classes with TYPE=User appear as user-selectable activities.",
    related: ["aai2actclass", "aai2launch"],
  },
  aai2launch: {
    title: "Five Ways to Launch an Activity",
    simple: "An activity can start from the Overview, a transaction, COB, another system, or as a secondary activity.",
    example: "Interest accrues via COB; a disbursement runs via a transaction; a term change runs from the Overview.",
    why: "Activities happen in many contexts, so there are several entry points.",
    memory: "Overview · Transaction · COB · Integration · Secondary.",
    temenos: "Running a transaction on an AA account auto-invokes the matching activity via a mapping keyed on transaction code.",
    related: ["aai2actclass", "aa3activity"],
  },

  // ---- Section 3: Reverse & Replay, Other Features, Simulation ----
  aai2reverse: {
    title: "Reverse & Replay (Product Line)",
    simple: "Inserting a back-dated change: the system reverses activities back to that date, then replays forward.",
    example: "A rate change effective last month is entered today; the system unwinds to last month and re-runs everything since.",
    why: "It keeps balances and accounting correct after back-dated corrections.",
    memory: "Reverse back to the date, then replay forward.",
    temenos: "Enabled by LIFE.ATTRIBUTE=REPLAY on the product line; flags NOREVERSE / NOREPLAY / NORR control per-activity behaviour.",
    related: ["aai2company", "aa3reverse"], diagram: "aa3reverseflow",
  },
  aai2company: {
    title: "Company Change",
    simple: "Moving an arrangement (with its account and balances) to another company.",
    example: "A loan booked under one branch/company is reassigned to another that shares the same financial files.",
    why: "Reorganisations and corrections sometimes require moving arrangements between companies.",
    memory: "Change company = move the whole arrangement's home.",
    temenos: "Uses EB.COMPANY.CHANGE; both companies must share the same financial files; the change happens at COB.",
    related: ["aai2reverse", "aai2alerts"],
  },
  aai2alerts: {
    title: "Alerts",
    simple: "Automatic notifications triggered when a chosen activity happens on an arrangement.",
    example: "When a loan is disbursed, an alert is generated for the customer.",
    why: "Customers and staff need to be told when key events occur.",
    memory: "Alert = 'tell someone when this activity fires'.",
    temenos: "Add the ALERTS property class to the group + property; a disburse activity triggers LENDING-SUBSCRIBE-AA.ALERTS, writing to AA.ARR.ALERTS.",
    related: ["aai2company", "aai2external"],
  },
  aai2external: {
    title: "External Product Lines",
    simple: "Client-created product lines that act as placeholders, holding data but no financial balances.",
    example: "A bank models a non-core product to store and display data without full financial processing.",
    why: "Banks want to represent products Temenos didn't build, with limited functionality.",
    memory: "External = your own line, data only, no money balances.",
    temenos: "From R17; designated External with limited functionality; arrangements under them can't hold financial balances.",
    related: ["aai2company", "aai2sim"],
  },
  aai2sim: {
    title: "Simulation Storage & IGNORE.SIM",
    simple: "Simulations store results in SIM files; IGNORE.SIM skips storage for high-volume API calls.",
    example: "A front-office system fires thousands of quote simulations; IGNORE.SIM returns results without saving them.",
    why: "Most simulations never become loans, so storing them all wastes resources.",
    memory: "IGNORE.SIM = 'quote it, don't keep it'.",
    temenos: "Controlled in AA.PARAMETER (Simulation tab); Capture → Runner; can suppress/assign account numbers; MORTGAGE.ARM still stores COMMITMENT/SCHEDULE.",
    related: ["aa3sim", "aai2storage"],
  },

  // ============ COURSE 6 · AA Common Building Blocks Implementation — Part 1 ============
  // ---- Section 1: Product Overview & Dependencies ----
  cb1overview: {
    title: "Lending, Deposit & Account Arrangements",
    simple: "The same Arrangement Architecture engine builds three arrangement families — Lending, Deposits and Accounts — from shared components.",
    example: "A personal loan, a term deposit and a current account are all AA arrangements; they reuse the same property classes for interest, charges and accounting.",
    why: "One reusable engine means a new deposit product costs a fraction of building a separate module.",
    memory: "One engine, three arrangement families.",
    temenos: "Each family has its own Product Line (LENDING, DEPOSITS, ACCOUNTS) but draws on the same common property classes and activities.",
    related: ["cb1deps", "cb1tables", "aa2prodline"],
  },
  cb1deps: {
    title: "AA Dependencies",
    simple: "AA relies on other Transact modules and static tables to work: CUSTOMER, ACCOUNT, Delivery, Accounting and Limits, plus currency and calendar tables.",
    example: "Opening a loan needs a CUSTOMER record for the borrower, creates an ACCOUNT, posts entries through Accounting and can check a Limit.",
    why: "AA is a product engine, not a whole core — it plugs into the rest of Transact.",
    memory: "AA borrows: Customer, Account, Delivery, Accounting, Limits.",
    temenos: "Limits apply to the Lending and Accounts product lines; Delivery handles advices; currency conditions read CURRENCY, CURRENCY.PARAM and CURRENCY.MARKET.",
    related: ["cb1overview", "cb1currency", "aa3deps"],
  },
  cb1daybasis: {
    title: "Interest Day Basis",
    simple: "A code that fixes how many days are in an interest period and in a year for interest calculation.",
    example: "Basis 'A' = 30/360; 'E' = actual/365. The same rate gives a different amount depending on the basis.",
    why: "Interest maths must be unambiguous and consistent with the market convention for the product.",
    memory: "Day basis = the calendar rule for interest.",
    temenos: "Codes A (30/360), B (actual/360), E (actual/365), plus regional variants; set on the interest property condition.",
    related: ["cb1deps", "aa3daybasis"],
  },
  cb1currency: {
    title: "Currency, Countries & Calendars",
    simple: "Product conditions can be made currency-specific, and holidays for named countries/regions are checked when an arrangement runs.",
    example: "A USD condition set differs from the GBP one; a payment due on a US holiday is moved because USD is linked to US BUS.DAY.CENTRES.",
    why: "Global products need per-currency terms and must respect each market's working calendar.",
    memory: "Currency drives the terms; BUS.DAY.CENTRES drives the dates.",
    temenos: "BUS.DAY.CENTRES field in the Account product condition; CURRENCY field in AA.PRODUCT.DESIGNER sets the default currency (also from COMPANY).",
    related: ["cb1deps", "cb1daybasis"],
  },

  // ---- Section 2: Reusable Component Tables ----
  cb1tables: {
    title: "Tables for Building Reusable Components",
    simple: "A fixed set of tables holds the building blocks: AA.PROPERTY.CLASS, AA.PROPERTY, AA.PERIODIC.ATTRIBUTE.CLASS, AA.PERIODIC.ATTRIBUTE, AA.ACTIVITY.CLASS, AA.ACTIVITY and AA.PRD.DES.<class>.",
    example: "To add a new negotiable field you create an AA.PROPERTY of an existing class, then reference it in AA.PRD.DES.<class> product conditions.",
    why: "Knowing which table holds what lets an implementer extend a product without touching code.",
    memory: "Class = Temenos block; Property/Attribute/Activity = client-named instances.",
    temenos: "Temenos releases the *.CLASS tables; clients create instances. AA.SOURCE.CALC.TYPE and AA.PROPERTY.CLASS.ACTION support them.",
    related: ["cb1propclass", "cb1property", "cb1prodcond", "aai1buildchain"],
  },
  cb1propclass: {
    title: "AA.PROPERTY.CLASS",
    simple: "A Temenos-released block that defines the Actions and Attributes available to any Property built from it.",
    example: "The INTEREST property class defines attributes like rate, day basis and tier type, and actions like ACCRUE and CAPITALISE.",
    why: "It's the contract: every property of that class shares the same fields and behaviour.",
    memory: "Property Class = the mould; Property = the casting.",
    temenos: "Attributes are governed by the TYPE field (e.g. DATED, TRACKING, VARIATION, TRIGGER); clients may only edit the description.",
    related: ["cb1property", "cb1prodcond", "aai1propclass"],
  },
  cb1property: {
    title: "AA.PROPERTY",
    simple: "A client-named instance of a property class, attached to the Product Group where it is first used.",
    example: "PRINCIPALINT and PENALTYINT are two properties of the INTEREST class on the same lending product.",
    why: "Multiple properties of one class let a product carry, say, several interest streams.",
    memory: "Same class, different names, different balances.",
    temenos: "Property types include Suspend, Suspend Overdue, Residual, Variation, Forward Dated, Unamortised, Credit, Trigger, Commission, Accrual by Bills — or null (normal).",
    related: ["cb1propclass", "cb1prodcond", "aai1property"],
  },
  cb1prodcond: {
    title: "Product Condition (Reusable Components)",
    simple: "The record that assigns real values to a property class's attributes for one product; its ID carries currency, variation and effective date.",
    example: "Product Conditions - INTEREST_PRINCIPALINT-USD-20200102 holds the USD rate and rules for the principal-interest property.",
    why: "Product conditions are what make one product differ from another.",
    memory: "Product Condition = the filled-in form for one property.",
    temenos: "Stored per property class in AA.PRD.DES.<class>; ID = <class>_<property>-<currency>-<yyyymmdd>; fields mirror the class's attributes.",
    related: ["cb1propclass", "cb1negotiable", "cb1attropt"],
  },

  // ---- Section 3: Product Condition Options ----
  cb1negotiable: {
    title: "DEFAULT.NEGOTIABLE",
    simple: "A mandatory Yes/No on each product condition saying whether the arrangement-maker can change its attribute values.",
    example: "DEFAULT.NEGOTIABLE = No on the term means users take the product term as-is; Yes lets them negotiate within any rules set.",
    why: "It's the master switch for how much freedom the front office has on a product.",
    memory: "Negotiable = 'can the user touch this?'",
    temenos: "Attribute-level negotiation rules (NR.*) always override this class-wide default.",
    related: ["cb1prodcond", "cb1nrrules", "aai1prodcond"],
  },
  cb1attropt: {
    title: "DEFAULT.ATTR.OPTION (Resetting / Non-Resetting)",
    simple: "Controls whether negotiated arrangement values are wiped back to the product on rollover/reset, or kept.",
    example: "RESETTING — at renewal the arrangement's rate reverts to the product rate; NON-RESETTING — the negotiated rate stays.",
    why: "Decides whether a special deal is a one-off or sticks for the life of the arrangement.",
    memory: "Resetting = snap back to product; Non-resetting = keep the deal.",
    temenos: "Optional field on the product condition; applies at rollover, reset and change-product activities.",
    related: ["cb1prodcond", "cb1negotiable"],
  },
  cb1nrrules: {
    title: "Negotiation Rules (NR.* fields)",
    simple: "Per-attribute rules that define exactly how a value may be changed in an arrangement: negotiable, mandatory, override, fix-value and the comparison to apply.",
    example: "Amount is NEGOTIABLE with MAXIMUM 500,000 (ERROR) and MINIMUM 25,000 (OVERRIDE) — above 500k is blocked, below 25k warns.",
    why: "Fine-grained control: some fields locked, some free within a band, some just warn.",
    memory: "NR = the rulebook for each field's wiggle room.",
    temenos: "NR.ATTRIBUTE / NR.OPTION / NR.TYPE(MAX,MIN,SINGLE) / NR.VALUE / NR.MESSAGE(ERROR,OVERRIDE); NR.VALUE.SOURCE reads a balance dynamically (BALANCE.TYPE>Name); NR.TYPE values validate against EB.COMPARISON.TYPE.",
    related: ["cb1negotiable", "cb1prodcond"],
  },

  // ---- Section 4: Customer Property Class ----
  cb1customer: {
    title: "CUSTOMER Property Class",
    simple: "The common property class that links customers to an arrangement and holds their roles and limits.",
    example: "On a joint loan the CUSTOMER property records both applicants, marks one as the first beneficial owner and sets each one's limit reference.",
    why: "Every arrangement needs to know who owns it and in what capacity.",
    memory: "CUSTOMER property = who's on the deal.",
    temenos: "Attributes governed by TYPE (DATED, TRACKING, VARIATION, ENABLE.EXTERNAL, ENABLE.EXTERNAL.FINANCIAL); balance prefix null.",
    related: ["cb1custrole", "cb1benefowner", "aa2roles"],
  },
  cb1custrole: {
    title: "AA.CUSTOMER.ROLE",
    simple: "Defines each customer role that can sit on an arrangement — Applicant, Guarantor, Beneficiary, etc. — and its rules.",
    example: "The APPLICANT role is a taxable customer, may have a limit, and its max tax-liability percentage can be set.",
    why: "Roles carry different rights and accounting/tax treatment.",
    memory: "One record per role, per arrangement type.",
    temenos: "Fields include Taxable Customer, Has Tax Liab Perc, Limit Customer, Min/Max Limit Perc, Relationship Pricing Customer, Delivery Customer, Exclude Dormancy, Maintain Info.",
    related: ["cb1customer", "cb1benefowner", "cb1relpricing"],
  },
  cb1benefowner: {
    title: "Beneficial vs Non-Beneficial Owner",
    simple: "The first beneficial owner on an arrangement is the one used for accounting, tax and limits; others can be indicated too.",
    example: "A trust arrangement lists the trustee as applicant but the beneficiary as first beneficial owner — that's whose tax position applies.",
    why: "Regulation and accounting need one clear 'real' owner even when several parties are named.",
    memory: "First beneficial owner = the one the books care about.",
    temenos: "Set on AA.CUSTOMER.ROLE / the CUSTOMER product condition; typically Negotiable at arrangement level; the owner can be changed by an activity.",
    related: ["cb1custrole", "cb1customer"],
  },
  cb1relpricing: {
    title: "Relationship Pricing Customer",
    simple: "A flag marking which customer role feeds Relationship (House-Holding) Pricing, so the group's overall business earns better rates.",
    example: "A family's total deposits across accounts lift them a pricing tier — only roles flagged Relationship Pricing Customer are counted.",
    why: "Banks reward the whole relationship, not just one product.",
    memory: "Flag it in, or it doesn't count toward the household deal.",
    temenos: "Set on AA.CUSTOMER.ROLE; the customer is included in pricing evaluation only if the Preferential/Relationship Pricing flag is on.",
    related: ["cb1custrole", "cb1pricing"],
  },

  // ---- Section 5: Eligibility ----
  cb1eligibility: {
    title: "ELIGIBILITY Property Class",
    simple: "An optional property class (Lending, Deposits, Accounts) that decides whether a customer may have a given product.",
    example: "A student loan's eligibility says the customer must be under 25, a local resident and in full-time education.",
    why: "Stops the wrong products being sold and filters the catalogue to what a customer can actually take.",
    memory: "Eligibility = 'is this customer allowed this product?'",
    temenos: "Product condition is Tracking Only, Date-specific; criteria are defined in the product designer and evaluated against customer attributes; returns error/override on failure.",
    related: ["cb1elrules", "cb1variation", "cb1pricing"],
  },
  cb1elrules: {
    title: "Eligibility Rules (ER.RULES / Rules Manager)",
    simple: "Reusable rules — built in the Rules Manager and stored in ER.RULES / ER.RULES.VERSION — that express eligibility logic like 'CUSTOMER.AGE < 18'.",
    example: "Rule CUSTOMER.AGE.LT.18 checks a customer's date of birth; it's versioned and referenced by the eligibility product condition.",
    why: "Write a rule once, reuse it across many products and keep a version history.",
    memory: "Rules Manager builds it; the product condition points at it.",
    temenos: "Rules read context tables (e.g. CUSTOMER via ER.CONTEXT), have Content and Rule Variables, and are proofed like products; EB.RULE.GATEWAY links them.",
    related: ["cb1eligibility", "cb1variation"],
  },
  cb1variation: {
    title: "Product Variation",
    simple: "A version of a product with different terms (often pricing), chosen automatically by matching the customer against each variation's eligibility.",
    example: "A Premium Personal Loan variation gives a lower rate; customers who pass its eligibility see that version in their catalogue.",
    why: "One product, many priced flavours, without building separate products.",
    memory: "Variation = same product, better (or worse) deal for some customers.",
    temenos: "Held in multi-value fields on the property vs AA.PRODUCT.VARIATION; evaluated in priority order at new-arrangement time; a default product covers failed eligibility; channels can be variation criteria.",
    related: ["cb1eligibility", "cb1pricing", "cb1channelpricing"],
  },
  cb1pricing: {
    title: "Pricing Options",
    simple: "The ways a bank prices differently: Product Variation, Relationship (House-Holding) Pricing, Promotional Pricing and Channel Pricing.",
    example: "A client gets a lower loan rate through Relationship Pricing for holding large deposits, plus a promo discount for opening online.",
    why: "Pricing is a competitive lever pulled per customer, per channel and per relationship.",
    memory: "Four levers: Variation, Relationship, Promotion, Channel.",
    temenos: "Preferential pricing refers to using any of these methods; each is configured through eligibility/pricing product conditions.",
    related: ["cb1variation", "cb1relpricing", "cb1channelpricing"],
  },
  cb1channelpricing: {
    title: "Channel Pricing",
    simple: "A product variation priced by the channel the customer uses — e.g. a better rate for internet-only products.",
    example: "The same deposit pays 0.25% more when opened and operated through the mobile app.",
    why: "Encourages customers onto cheaper self-service channels.",
    memory: "Channel Pricing = discount for doing it yourself.",
    temenos: "A form of Product Variation; CHANNEL is used as a variation eligibility criterion; differs from Relationship Pricing, which follows the customer relationship.",
    related: ["cb1variation", "cb1pricing"],
  },

  // ---- Section 6: Officers, Activity Mapping & Consolidation ----
  cb1officers: {
    title: "OFFICERS Property Class",
    simple: "An optional common property class holding the Primary Officer and any Other Officers responsible for an arrangement.",
    example: "A corporate loan names a Primary Officer for servicing and a separate collections officer as an Other Officer.",
    why: "Management information and workflow routing need to know who owns each arrangement.",
    memory: "OFFICERS property = who's accountable for this deal.",
    temenos: "Officer IDs must be valid in DEPT.ACCT.OFFICER; Other Officer roles must be valid in AA.CUSTOMER.ROLE virtual table; property can be Tracking; no accounting entry; default Primary Officer comes from the CUSTOMER record.",
    related: ["cb1customer", "dao", "cb1actmap"],
  },
  cb1actmap: {
    title: "Activity Mapping (ACTIVITY.MAP.PNG)",
    simple: "A mandatory common property class that maps external transaction codes (from Payment Order, Teller, AC.CASH.POOL…) to the AA activities they should trigger.",
    example: "A teller cash repayment posts with a transaction code; Activity Mapping turns that into the LENDING-DISBURSE-COMMITMENT / repayment activity on the loan.",
    why: "Account-based transactions from the rest of Transact must drive the right arrangement activity.",
    memory: "Activity Mapping = transaction code → AA activity.",
    temenos: "One property per Product Group; values track at arrangement level only; uses FT.TXN.TYPE.CONDITION and similar (AC.CASH.POOL, TELLER.TRANSACTION); default activities can be set for unmapped codes.",
    related: ["cb1consol", "cb1prodcond"],
  },
  cb1consol: {
    title: "Consolidation & Reporting",
    simple: "Common property classes that map AA balances and asset types to the fields other Transact reporting expects (Consol key, RE.STAT.REP.LINE, asset/balance types).",
    example: "AA's CURACCOUNT balance is reported as the current principal; accrued interest maps to ACCLOANINT for the P&L category.",
    why: "Regulatory and management reports read standard fields — AA must feed them.",
    memory: "Consolidation = translate AA balances into report-speak.",
    temenos: "CONSOLIDATE.COND accepts fields from AA.ACCOUNT.DETAILS; value date = REPORT.END.DATE; principal asset types double as balance types (CURACCOUNT, CURCOMMITMENT, LIVECMT/LIVECMTDL, ACCLOANINT).",
    related: ["cb1actmap", "cb1deps"],
  },

  // ============ COURSE 7 · AA Common Building Blocks Implementation — Part 2 ============
  // ---- Section 1: AA Accounting Concepts ----
  cb2acctevents: {
    title: "Accounting Events & Core Accounting",
    simple: "AA activities raise accounting events; Core Accounting turns them into ledger entries (STMT.ENTRY, CATEG.ENTRY, RE.CONSOL.SPEC.ENTRY).",
    example: "A disbursement activity fires an event that debits the loan account and credits the customer's account via allocation rules.",
    why: "Every financial movement on an arrangement must hit the general ledger correctly.",
    memory: "Activity → accounting event → ledger entries.",
    temenos: "Allocation rules take an event and produce entries; posting detail defines each entry (type, references, narrative); AA removes the need for accounting logic in the business application.",
    related: ["cb2balances", "cb2acctpc", "cb2acctrule"],
  },
  cb2balances: {
    title: "Arrangement Balances",
    simple: "Each property can hold several balances that change with the arrangement's life-cycle stage — Committed, Available, Due, Overdue buckets, Not Accrued.",
    example: "The PRINCIPAL property shows Committed, Available and Outstanding; PENALTYINT shows Due, Overdue 30/60/90 days and Non Accrual.",
    why: "Interest and charge calculations, aging and reporting all read specific balances.",
    memory: "One property, many balances — one per state.",
    temenos: "Balances update through Temenos Transact Accounting; used in financial reporting, interest/charge calculation and periodic restriction.",
    related: ["cb2baltype", "cb2balprefix", "aa2accrued"],
  },
  cb2baltype: {
    title: "Balance Type (AC.BALANCE.TYPE)",
    simple: "A named financial component of a product — e.g. ACCPRINCIPALINT — with a Reporting Type of Contingent, Non-Contingent or Internal.",
    example: "ACCPRINCIPALINT is the accrued-principal-interest balance type; a virtual balance type sums several real ones for calculation.",
    why: "Balance types are the vocabulary the product and the ledger share.",
    memory: "Balance Type = the name of a pot of money on the product.",
    temenos: "Some are hard-coded in the property class; AC.BALANCE.TYPE lets you add more. Virtual types sum specified balances; can update dated historical balances; Suspend option halts P&L posting.",
    related: ["cb2balances", "cb2balprefix"],
  },
  cb2balprefix: {
    title: "Balance Prefix & Suffix",
    simple: "A prefix on a balance type marks its life-cycle stage (CUR current, DUE due, ACC accrued, AGE aged); a suffix like SP marks suspended (non-accrual) balances.",
    example: "CURPRINCIPALINT is the live principal-interest balance; PRINCIPALINTSP is the same amount once suspended.",
    why: "The prefix/suffix lets one property expose current, due, accrued and suspended views of the same money.",
    memory: "Prefix = which stage; suffix SP = suspended.",
    temenos: "Prefixes controlled via BALANCE.PREFIX (CUR, ACC, DUE, AGE…); differ by product line (Lending / Deposits / Accounts).",
    related: ["cb2baltype", "cb2balances", "aai1balances"],
  },

  // ---- Section 2: Accounting Product Condition ----
  cb2acctpc: {
    title: "ACCOUNTING Property Class",
    simple: "A mandatory common property class that holds the soft accounting rules for a product — which action of which property posts what.",
    example: "It says the ACCRUE action of PRINCIPALINT books to the interest-income category, using a named allocation rule.",
    why: "Soft rules mean accounting behaviour is configured, not coded, and can differ per product.",
    memory: "ACCOUNTING property = the product's posting rulebook.",
    temenos: "Mandatory (Lending, Deposits, Accounts); ACCT.ACTION.CLASS names the action, ACCTRULE names the allocation rule, ACCTRULE Field links them; not viewable/editable at arrangement level; no accounting entry of its own.",
    related: ["cb2acctrule", "cb2acctevents", "cb1actmap"],
  },
  cb2acctrule: {
    title: "Allocation Rule (AC.ALLOCATION.RULE)",
    simple: "Takes one accounting event and produces the ledger entries: target balance, contra balance, transaction codes and movement detail.",
    example: "The disbursement allocation rule moves the amount from the commitment balance to the customer's account and passes the FT transaction code.",
    why: "It's the reusable recipe that converts a business event into balanced double entry.",
    memory: "Allocation rule = event in, balanced entries out.",
    temenos: "Multiple target/contra targets from one event; AC.POSTING.DETAIL defines entry type, references and narratives; copy-and-modify a supplied rule for new interest/charge properties.",
    related: ["cb2acctpc", "cb2acctevents", "cb2suspense"],
  },
  cb2ncfc: {
    title: "Non-Customer-Facing Charges",
    simple: "Fees and costs tied to a loan that must not be shown to the customer — booked and amortised between the bank's internal account and P&L.",
    example: "Salary expense, attorney fees and origination costs are accrued against each loan under FASB rules and amortised to maturity.",
    why: "Regulation requires these costs recognised over the loan's life, separately from customer charges.",
    memory: "Non-customer-facing = the bank's own cost of the loan.",
    temenos: "Bill Type Internal; ACCRUE/AMORT and ACCRUE.PERIOD fields set accrual vs schedule frequency; INTERNAL.BOOKING checked on the property; back-dated changes reverse and rebook the accruals.",
    related: ["cb2acctpc", "aa3charges"],
  },
  cb2suspense: {
    title: "AASUSPENSE",
    simple: "When a loan or deposit arrangement is debited or credited, the original entry moves to a suspense account and the opposite entry is created there — then cleared during the real processing activity.",
    example: "A repayment lands in AASUSPENSE, then the applied-payment activity moves it onto the loan and clears suspense.",
    why: "Decouples the money arriving from the arrangement processing it — improves performance and reconciliation.",
    memory: "AASUSPENSE = the holding bay between cash and arrangement.",
    temenos: "Internal balance type AASUSPENSE used in both core and soft accounting; supports 'Process Dated Accounting' for Lending, Deposits and Accounts.",
    related: ["cb2acctrule", "cb2acctevents"],
  },
  cb2txnentry: {
    title: "TXN.ENTRY.MB Enquiry",
    simple: "An enquiry that shows the ledger entries an external application raised, matched to the arrangement activity reference.",
    example: "Entries posted by an external teller system don't store IDs in ECB for the contract, so TXN.ENTRY.MB is used to display them by activity reference.",
    why: "You still need to trace external-application postings back to the arrangement.",
    memory: "TXN.ENTRY.MB = 'show me what that external system posted here'.",
    temenos: "Enhanced enquiry keyed on transaction reference input with arrangement activity reference.",
    related: ["cb2acctevents", "cb1actmap"],
  },

  // ---- Section 3: Balance Maintenance ----
  cb2balmaint: {
    title: "BALANCE.MAINTENANCE Property Class",
    simple: "An optional common property class used to capture bills and balances, and to adjust or write off balances — mainly for migrating loans/deposits into AA.",
    example: "Taking over an overdraft from a legacy system: capture its historical balances, outstanding principal, overdue bills and current accruals.",
    why: "Migration needs to load an in-flight arrangement's real position without re-running its whole history.",
    memory: "Balance Maintenance = load / fix balances for takeovers.",
    temenos: "Optional (Lending, Deposits, Accounts); attributes governed by TYPE (DATED, NON.TRACKING, CCY, MULTIPLE, ARRANGEMENT); the 'other side' of every movement is handled by allocation rules (usually suspense/wash).",
    related: ["cb2capture", "cb2adjust", "cb2hisbalance"],
  },
  cb2capture: {
    title: "Capture Bill / Balance / Historical Balance",
    simple: "Activities that load a single bill, a set of balances, or capitalised historical interest bills onto a migrated arrangement.",
    example: "Capture Bill posts a due amount with an effective date before the arrangement's Transact start date; it's then aged by the same activity.",
    why: "A taken-over loan must show its outstanding bills and accruals from day one.",
    memory: "Capture = put the legacy position onto the AA arrangement.",
    temenos: "Capture Historical Balance is Accounts-product-line only; interest property mandatory for Capture Historical Bill; Capitalize option allowed in the payment method.",
    related: ["cb2balmaint", "cb2adjust", "cb2hisbalance"],
  },
  cb2adjust: {
    title: "Adjust & Write-Off Activities",
    simple: "Adjust Bill, Adjust Balance, Adjust All and Write Off Bill/Balance let you increase, decrease or zero existing bills and balances in one transaction.",
    example: "Adjust All corrects both bills and non-bill balances after a migration error; Write Off Bill sets an existing bill's amount to zero.",
    why: "Post-migration corrections and genuine write-offs need controlled, auditable activities.",
    memory: "Adjust = nudge up/down; Write Off = zero it.",
    temenos: "Multiple bills per transaction; balances shown as at the adjustment activity's effective date; net movement can be zero; Adjust Balance for Upfront Profit uses LENDING-RESTRUCTURE-BALANCE-MAINTENANCE and recalculates profit.",
    related: ["cb2balmaint", "cb2capture"],
  },
  cb2hisbalance: {
    title: "Historical Balances (HIS-<ACCOUNT>)",
    simple: "Memo balance types with the HIS prefix that hold a migrated account's past positions so daily closing balances, limits and interest can be recalculated.",
    example: "HIS-ACCOUNT holds the historical current balance; HIS-LIMIT*CUR the historical available limit — used for back-value-dated changes after takeover.",
    why: "Back-dated activity beyond the Transact takeover date needs the old balances to replay correctly.",
    memory: "HIS- balances = the arrangement's past, kept for replay.",
    temenos: "Types include HIS-ACCOUNT, HIS-LIMIT*UTL, HIS-LIMIT*CUR, HIS-LIMIT*TOT, HIS-LIMIT*OVD; interest movements from historical bills adjust running account and limit balances.",
    related: ["cb2balmaint", "cb2capture"],
  },

  // ---- Section 4: Statement Narratives ----
  cb2narrative: {
    title: "Statement Narratives (AA.NARRATIVE)",
    simple: "Configurable free-format, multi-language descriptions of arrangement activities that appear on customer statements and online enquiries.",
    example: "A repayment shows as 'Loan repayment received - thank you' instead of a raw activity code.",
    why: "Customers need statements they can read, in their language.",
    memory: "Narrative = human-readable label for an activity on a statement.",
    temenos: "Narrative is extracted from AC.POSTING.DETAIL, AA.PROPERTY and AA.ACTIVITY; STMT-AA record maps activity → narrative; mapping is triggered by the Event in the 'Value Source' field.",
    related: ["cb2narrparam", "cb2narrformat", "cb2printstmt"],
  },
  cb2narrparam: {
    title: "AA.STATEMENT.NARR.PARAM",
    simple: "Links arrangement activities to narrative formats, keyed by system ID + activity ID (e.g. LENDING-NEW-ARRANGEMENT).",
    example: "The parameter record for LENDING-NEW-ARRANGEMENT points at the format used when a loan is opened.",
    why: "Each activity type needs its own narrative wording and layout.",
    memory: "NARR.PARAM = which format for which activity.",
    temenos: "Transaction-specific parameters take precedence over the application's main parameter; tabbed fields for narrative formats, organised by display-selection field operand value.",
    related: ["cb2narrative", "cb2narrformat"],
  },
  cb2narrformat: {
    title: "AA.STATEMENT.NARR.FORMAT",
    simple: "Defines the actual narrative text and the conversion rules applied to each token (dates, amounts, function names, related customer).",
    example: "A format string '{activity} of {amount} on {date}' with conversion types that format the amount and spell out the date.",
    why: "Separating format from parameter lets one wording be reused across activities.",
    memory: "NARR.FORMAT = the template string + how each field is rendered.",
    temenos: "Linked to the Narrative Parameter via the Statement Format attribute; conversion types include VALUE, ATTRIBUTE, DATE.TIME, DENOM, EXTRACT, TXT, ACCT.NAME.CUSTOMER, etc.; categorised into Text for Display / Field / Balance Types tabs.",
    related: ["cb2narrative", "cb2narrparam"],
  },
  cb2printstmt: {
    title: "PRINT.STATEMENT",
    simple: "The application that configures requests for printing or reprinting AA account statements, integrating the AA.NARRATIVE wording.",
    example: "A monthly statement run for a loan account pulls its activity narratives and prints them via the Statement Type.",
    why: "The readable narrative has to reach the printed/PDF statement, not just the online enquiry.",
    memory: "PRINT.STATEMENT = the narrative on paper.",
    temenos: "Can be invoked during COB or online; record ID must be linked as Statement Type; needs Statement ID, Acct ID, Processing Date, Mask Print, Show Reversal; components tab hides zero-value lines etc.",
    related: ["cb2narrative", "cb2narrparam"],
  },

  // ---- Section 5: COB & Data Lifecycle ----
  cb2cob: {
    title: "COB Processing for AA",
    simple: "During Close of Business, unauthorised debit/credit arrangements in account products can be skipped from delete-and-recreate to improve performance.",
    example: "A batch of unauthorised repayment activities is left in place at COB instead of being torn down and rebuilt.",
    why: "Rebuilding thousands of pending activities every night is expensive.",
    memory: "COB skip = leave the unauthorised ones alone overnight.",
    temenos: "Configurable by Product Line, Product Group, Product, Company, Activity Class or Activity; AA.DECISION.PARAMETER = 'Ignore Transaction Activities/Accounts' or Default Decision.",
    related: ["cb2decision", "cb2dlm"],
  },
  cb2decision: {
    title: "AA.DECISION.PARAMETER",
    simple: "Controls what COB does with unauthorised activities: the Default Decision deletes and recreates them; 'Ignore' leaves them.",
    example: "Set to Ignore for a high-volume product so overnight COB doesn't churn its pending activities.",
    why: "One switch tunes the performance/consistency trade-off for COB.",
    memory: "Decision parameter = delete-and-rebuild, or ignore.",
    temenos: "When configured to use Default Decision, unauthorised activities are deleted and recreated during COB (the system's existing behaviour).",
    related: ["cb2cob"],
  },
  cb2dlm: {
    title: "Data Lifecycle Management (DLM)",
    simple: "Moves aged data from the live database to a non-volatile (read-only) database before purging, keeping the live system small and fast.",
    example: "Loan activity history older than the retention period is shifted to the OLTP database; queries can still reach it.",
    why: "Years of arrangement, activity and history records would otherwise bloat the live system.",
    memory: "DLM = retire old data to a read-only shelf, still readable.",
    temenos: "Archivable: AA.ARRANGEMENT.ACTIVITY, AA.PROCESS.DETAILS, AA.ARR.<property>; time-based partitioning + configurable data transfers; framework still lets you read aged data.",
    related: ["cb2archive", "cb2nolog"],
  },
  cb2archive: {
    title: "Archiving (ARCHIVE application)",
    simple: "The ARCHIVE / AA.ARRANGEMENT record holds a closed arrangement's archival definition — Purge Date and Retention Period — driving what gets deleted or moved to read-only.",
    example: "A closed loan past its Purge Date is deleted; one past only its Retention Period is moved to the read-only database.",
    why: "Closed arrangements should not sit in the live system forever.",
    memory: "Purge Date = delete; Retention Period = move to read-only.",
    temenos: "Purge/Retention set in ARCHIVE (or AA.PARAMETER/SYSTEM); Closed Date in AA.ARRANGEMENT; Archive Activities can set a per-activity threshold; also works for live arrangements (Retain/Act Retain Period); a background AUTO service manages the split.",
    related: ["cb2dlm", "cb2nolog"],
  },
  cb2nolog: {
    title: "NOLOG Activities & AAACN Prefix",
    simple: "Activities flagged NOLOG aren't written to AA.ARRANGEMENT.ACTIVITY, cutting growth; their AA IDs get an AAACN prefix instead of AAACT.",
    example: "A high-frequency alert-subscribe activity is set NOLOG so it doesn't bloat the activity table.",
    why: "Not every activity needs a permanent audit record; skipping the log speeds things up.",
    memory: "NOLOG = don't record it; AAACN = the 'not logged' ID.",
    temenos: "Set NOLOG on the Activity Class TYPE; NOLOG and Restrict Log are mutually exclusive; if forced manually the AAACN prefix must be forced too; Restrict Log activities use AAACT-prefixed IDs and limited detail.",
    related: ["cb2archive", "cb2dlm", "aai2reverse"],
  },

  // ============ COURSE 8 · AA Lending Product Building Implementation — Part 1 ============
  // ---- Section 1: Term Amount ----
  lpb1termamt: {
    title: "TERM.AMOUNT Property Class",
    simple: "A mandatory Lending property class that carries both the Commitment Amount (what's approved to lend) and the Term (how long to repay).",
    example: "A personal loan's TERM.AMOUNT holds 150,000 USD over 12 months.",
    why: "Every loan needs an approved amount and a repayment horizon before anything else is calculated.",
    memory: "TERM.AMOUNT = how much, for how long.",
    temenos: "Currency-specific; attributes governed by TYPE (DATED, CCY, MULTI.TRACKING, VARIATION); balance prefix from CUR/TOT/DIS/LTL.",
    related: ["lpb1commit", "lpb1maturity", "aa2commit"],
  },
  lpb1commit: {
    title: "Commitment Amount & Change Amount",
    simple: "The Committed Amount is what's available to be lent; a Change Amount activity increases or decreases it during the arrangement's life.",
    example: "A top-up raises the commitment from 150k to 200k; a partial cancellation lowers it.",
    why: "Loan sizes change — extensions, restructures, cancellations — without a new arrangement.",
    memory: "Commitment = the ceiling; Change Amount moves the ceiling.",
    temenos: "Update Limits option decides whether the LIMIT record follows the commitment change; Commitment Drawdown / Utilisation control how disbursed vs undrawn amounts are tracked (UTLXXX balance).",
    related: ["lpb1termamt", "lpb1revolving", "lpb1limit"],
  },
  lpb1maturity: {
    title: "Maturity Date & Term of Contract",
    simple: "Maturity is derived from Term (or entered directly); a Mat Date Convention decides whether it's adjusted when it lands on a non-working day.",
    example: "A 12-month loan from 15 Jan matures 15 Jan next year; if that's a holiday and the convention is Yes, it shifts.",
    why: "The maturity date anchors the schedule, accrual end and payoff.",
    memory: "Term → Maturity; convention handles the holiday.",
    temenos: "Mat Date Convention on the Account property class is followed; if maturity moves beyond TERM.TOL.DAYS the term is recalculated; a Call product has no fixed maturity.",
    related: ["lpb1termamt", "lpb1payschedule"],
  },
  lpb1revolving: {
    title: "Revolving Commitment",
    simple: "Controls whether repayments restore the available commitment — None, Payment (any principal repayment restores) or Prepayment (only early repayment restores).",
    example: "A revolving credit line set to Payment lets the customer redraw whatever principal they repay.",
    why: "Revolving facilities behave completely differently from term loans on availability.",
    memory: "Revolving = do repayments give you your headroom back?",
    temenos: "Options None / Payment / Prepayment; 'Whether to update the LIMIT record with the commitment amount' governs limit interaction.",
    related: ["lpb1commit", "aa3commitment"],
  },
  lpb1tranche: {
    title: "Tranche Disbursement & Drawdown",
    simple: "One commitment can be released in named tranches, each with its own start date and amount, disbursed on a schedule or manually.",
    example: "A construction loan of 1M is drawn as 3 tranches tied to build milestones.",
    why: "Project and development finance releases money in stages, not one lump.",
    memory: "Tranche = a slice of the commitment with its own drawdown.",
    temenos: "A Tranche Bill is created on each tranche's start date; unutilised tranche amounts can be reversed; Automatic Scheduled Disbursement transfers funds to a specified account, triggered by a 'disbursement' transaction code subject to available commitment and Activity Restrictions.",
    related: ["lpb1commit", "aa3disburse"],
  },

  // ---- Section 2: Account ----
  lpb1account: {
    title: "ACCOUNT Property Class",
    simple: "A mandatory property class that holds the principal balance of the arrangement and its account-level settings.",
    example: "The ACCOUNT property is where the loan's CURACCOUNT balance lives and where the Account Category, base date and posting rules are set.",
    why: "Every AA arrangement is account-based — opening it creates an account that holds the balances.",
    memory: "ACCOUNT property = the arrangement's own account.",
    temenos: "ACCOUNT.TYPE attributes are DATED and VARIATION; CUR/DUE/AGE/AVL/UNC/UND balance prefixes for Lending; allowed suffix *INP/*CO/*CLIST/*CLST.",
    related: ["lpb1dormancy", "lpb1basedate", "lpb1posting"],
  },
  lpb1dormancy: {
    title: "Dormancy",
    simple: "The number of inactive months after which an arrangement account is treated as dormant.",
    example: "An account with no customer activity for 12 months is flagged dormant, restricting further movements.",
    why: "Dormant accounts carry fraud and regulatory risk and need special handling.",
    memory: "Dormancy = 'no activity for N months → freeze it'.",
    temenos: "Set on the ACCOUNT product condition (or the Dormancy property class); can be configured to update the dormancy status automatically.",
    related: ["lpb1account", "lpb1basedate"],
  },
  lpb1basedate: {
    title: "Base Date Key & Date Base Type",
    simple: "The Base Date is the anchor for deriving event dates (charging, rollover, periodic interest); Base vs Previous decides whether cycling uses the un-adjusted base date or the last actual cycle date.",
    example: "Monthly interest cycles from the 15th (base) even if a payment landed on the 14th because the 15th was a weekend.",
    why: "Schedules must cycle predictably regardless of holidays and off-cycle payments.",
    memory: "Base = the fixed anchor; Previous = follow the last real date.",
    temenos: "BASE.DATE.KEY stores the base day; Base Date Type option determines the calculation start date; 'Start' works from the first Disbursement Date.",
    related: ["lpb1account", "lpb1payfreq"],
  },
  lpb1posting: {
    title: "Posting Restrictions",
    simple: "Rules that block debits and/or credits on an arrangement account for a date range, with a reason code.",
    example: "A disputed loan has a Posting Restriction blocking debits until the dispute is resolved.",
    why: "Operations need to freeze movement on an account without closing it.",
    memory: "Posting Restriction = a temporary lock with a reason.",
    temenos: "Multiple restrictions with start/end dates; blocking codes via virtual tables BLOCK.REASON.CODES / UNBLOCK.REASON.CODES; <PRODUCTLINE>-START.RESTRICTION-ACCOUNT / END.RESTRICTION-ACCOUNT; pre-notice configurable.",
    related: ["lpb1account", "lpb1dormancy"],
  },

  // ---- Section 3: Limit ----
  lpb1limit: {
    title: "LIMIT Property Class",
    simple: "An optional Lending property class that links an arrangement to a limit defined in the LIMIT module.",
    example: "A loan draws against a customer's approved 500,000 credit limit; the arrangement consumes part of it.",
    why: "Banks approve credit at customer/group level; individual loans draw it down.",
    memory: "LIMIT property = 'which approved limit does this loan use?'",
    temenos: "Optional; Limit Product must be indicated in LIMIT.REFERENCE.FIELD; typically Arrangement Level and Non-Tracking; an override is generated when DISBURSE runs without a limit attached.",
    related: ["lpb1limitref", "lpb1netting", "lpb1commit"],
  },
  lpb1limitref: {
    title: "Limit Reference & Single Limit",
    simple: "Limit Reference is the limit record ID in the arrangement; Single Limit = Yes locks that limit to this one arrangement, No lets other arrangements of the same customer share it.",
    example: "A mortgage uses a Single Limit; a customer's revolving facilities share one limit with Single Limit = No.",
    why: "Some facilities are ring-fenced; others pool against a shared limit.",
    memory: "Single Limit = mine only; not single = shared by the customer.",
    temenos: "Limit Reference must relate to the Primary Owner; the option for shared use is indicated with No.",
    related: ["lpb1limit", "lpb1netting"],
  },
  lpb1netting: {
    title: "Netting",
    simple: "Lets an arrangement's credit balance offset another arrangement's overdraft when they share the same Limit.",
    example: "A customer's positive current account nets against their overdraft limit usage, cutting interest.",
    why: "Customers with cash and borrowing shouldn't pay gross interest on both.",
    memory: "Netting = credit here cancels debit there, same limit.",
    temenos: "Applicable only for shared limits; the credit balance is added to the overdraft limit for use in other arrangement accounts using the same Limit.",
    related: ["lpb1limit", "lpb1limitref"],
  },

  // ---- Section 4: Interest ----
  lpb1interest: {
    title: "INTEREST Property Class",
    simple: "An optional property class; a product can carry several INTEREST properties — principal interest, penalty interest — each with its own rate, conditions and balance.",
    example: "PRINCIPALINT at 5% and PENALTYINT at 6% are two INTEREST properties on one loan.",
    why: "Loans charge interest on different bases; each needs separate configuration and accounting.",
    memory: "One INTEREST property per interest stream.",
    temenos: "Attributes DATED, CCY, MULTI.TRACKING, FORWARD.DATED, VARIATION; balance prefixes ACC/DUE/AGE/RES/DEF/REC/INV; allowed suffix SP*CO*CUST for Lending.",
    related: ["lpb1inttypes", "lpb1tiered", "aa3ratetypes"],
  },
  lpb1inttypes: {
    title: "Interest Types (Fixed / Floating / Periodic)",
    simple: "Fixed = a rate you type; Floating = read from BASIC.INTEREST (± spread); Periodic = read from PERIODIC.INTEREST for a defined period, refreshed on a cycle.",
    example: "A tracker mortgage is Floating (base + 1.5%); a 2-year fix is Periodic with a reset date.",
    why: "The rate mechanism drives how and when the customer's rate changes.",
    memory: "Fixed = typed; Floating = live index; Periodic = index for a period.",
    temenos: "Periodic Method interpolates (or NEXT/PREVIOUS/CLOSEST) when the term doesn't match a period; PERIODIC.RESET.DATE schedules the first reset; custom rate calculation is also possible.",
    related: ["lpb1interest", "lpb1rfr", "aa3floating"],
  },
  lpb1rfr: {
    title: "Risk-Free Rates (RFR)",
    simple: "Compounded overnight rates (SOFR, SONIA…) replacing LIBOR, with conventions for look-back, observation shift, day count and spread treatment.",
    example: "A loan uses compounded SONIA with a 5-day look-back and an inclusive credit spread.",
    why: "The market moved off LIBOR; AA has to compound a daily rate correctly.",
    memory: "RFR = compound yesterday's overnight rate, with a rulebook.",
    temenos: "RFR Convention, Lookback (Narrow Definition / Observation Shift), RFR Look Back Days (1–10), Calculation Method (Simple/Compound/Amount), Period Day Count (Today/Full), Spread Treatment (Inclusive/Exclusive), RFR Rounding Rule, No. of Decimals (default 4), RFR Flooring on the Tier Negative Rate attribute.",
    related: ["lpb1inttypes", "aa3rfr"],
  },
  lpb1tiered: {
    title: "Tiered Interest Rates",
    simple: "Different rates by balance band — Level (one tier's rate on the whole balance), Banded (each rate only on its slice), or Group.",
    example: "0–10k at 2%, 10k–50k at 3%: Banded charges 2% on the first 10k and 3% on the rest; Level charges 3% on all of it.",
    why: "Products reward or penalise size; the tier method changes the amount materially.",
    memory: "Banded = per slice; Level = whole balance at the reached tier.",
    temenos: "Tier Amount vs Tier Percent (one or the other, not both); negative rates allowed with a Floor; Block margin adds a margin when the reference rate is negative; min/max rate per tier.",
    related: ["lpb1interest", "aa3tiers"],
  },
  lpb1rateadj: {
    title: "Rate Adjustment & Adjustment of Interest Rates",
    simple: "RATE.ADJUSTMENT changes a periodic rate at arrangement level after publish; ADJUST.TYPE/OPERAND/MARGIN tweak the picked rate by a margin or override it entirely.",
    example: "A retention deal knocks 0.25% off the customer's periodic rate without changing the product.",
    why: "Front office needs to negotiate a rate for one customer without a product change.",
    memory: "Rate Adjustment = bend this arrangement's rate.",
    temenos: "RATE.ADJUSTMENT set at arrangement level, not the product condition; ADJUST.OPERAND {ADD, SUBTRACT, MULTIPLY}; ADJUST.OVERRIDE.RATE is the final rate if override/ignore; AA.ADJUST.REASON virtual table; ADJUST.EXPIRY.DATE reverts to the original rate.",
    related: ["lpb1inttypes", "lpb1linked"],
  },
  lpb1linked: {
    title: "Linked Rates",
    simple: "One arrangement's rate is derived from another arrangement's Interest property — used when a deposit is collateral for a loan/overdraft.",
    example: "An overdraft priced at 'the pledged deposit's rate + 2%' via a Linked Rate to the deposit arrangement.",
    why: "Secured lending is often priced directly off the security's own rate.",
    memory: "Linked Rate = 'my rate = that arrangement's rate + margin'.",
    temenos: "Linked Rate = Yes on a tier; specify Linked Arrangement and Linked Property; with a Banded linked condition the returned rate is a pre-rated/blended rate; an error is raised for more than one collateral right attached.",
    related: ["lpb1rateadj", "lpb1interest"],
  },

  // ---- Section 5: Tax ----
  lpb1tax: {
    title: "TAX Property Class",
    simple: "An optional property class that calculates tax (e.g. withholding) on the interest and charges of a named property.",
    example: "A WHT property taxes deposit interest at 15% and posts it to the tax authority.",
    why: "Many jurisdictions require tax withheld at source on interest.",
    memory: "TAX property = withhold tax on this property's interest/charges.",
    temenos: "Multiple TAX properties allowed; Currency and Dated; DUE and AGE balance prefixes (Lending); Tax Code (TAX.CODE or TAX.CONDITION), Property Tax Code (PROP.TAX.CODE or PROP.TAX.COND); tax can optionally be included in the payment schedule.",
    related: ["lpb1taxsplit", "lpb1interest"],
  },
  lpb1taxsplit: {
    title: "Tax Splits & Proportional Tax",
    simple: "Tax can be split between related customers (by percentage), and calculated proportionally to the interest actually earned in a period.",
    example: "Joint account interest tax is split 50/50 via CUSTOMER.RELATIONSHIP; a mid-period rate change makes tax proportional.",
    why: "Regulation can require tax apportioned per owner and per earning period.",
    memory: "Split = per owner; Proportional = per amount earned.",
    temenos: "Split via AA.CUSTOMER.ROLE / CUSTOMER.RELATIONSHIP; ST.CUST.RELATIONSHIP.DATES holds the split dates; TAX.CODE.PARAMETER switches on Proportional Tax Calculation per tax code; ST.TAX.CALC.DETAILS holds the breakup.",
    related: ["lpb1tax", "cb1relpricing"],
  },

  // ---- Section 6: Charges ----
  lpb1activitycharge: {
    title: "ACTIVITY.CHARGES Property Class",
    simple: "An optional property class that levies a charge when a specific AA activity is triggered.",
    example: "An early-repayment activity fires an ACTIVITY.CHARGES property that bills a break fee.",
    why: "Some fees are event-driven — they should only apply when the customer does a particular thing.",
    memory: "ACTIVITY.CHARGES = fee when activity X happens.",
    temenos: "DATED, FORWARD.DATED and TRACKING type; the activity attracting the charge (Activity ID) must be a valid AA.ACTIVITY record; APP.METHOD = Due/Cap/Defer/Pay; can defer by days after occurrence.",
    related: ["lpb1charge", "lpb1triggercharge"],
  },
  lpb1charge: {
    title: "CHARGE Property Class",
    simple: "The general charging property class — Fixed, Percentage or Unit charges, on specified balances, with tiers and currency handling.",
    example: "An arrangement fee of 1% of the commitment, minimum 100 USD.",
    why: "Most loan and account fees are configured here rather than coded.",
    memory: "CHARGE = the product's fee engine.",
    temenos: "Optional (Lending); multiple CHARGE properties; ACC/DUE/AGE/PAY/DEF/INV balance prefixes, suffix SP; Calculation Type Flat/Percentage/Unit; Charge Currency defaults from the CHARGE property; tiers Level/Banded/Groups; Charge Tier exclusive/inclusive threshold and Calculation Threshold.",
    related: ["lpb1chargeoverride", "lpb1periodiccharge", "aa3charges"],
  },
  lpb1chargeoverride: {
    title: "CHARGE.OVERRIDE Property Class",
    simple: "Lets a user waive or modify charges when an activity is triggered or a rule is broken.",
    example: "A manager waives the late fee on a good customer's missed payment via CHARGE.OVERRIDE.",
    why: "Front-line staff need controlled discretion over fees.",
    memory: "CHARGE.OVERRIDE = the 'waive this fee' switch.",
    temenos: "Optional; DATED and non-tracking; appears in an arrangement after an Activity Charge is triggered and validated; the waive reason is stored; user can modify or waive all where more than one charge for the same activity is attached.",
    related: ["lpb1charge", "lpb1activitycharge"],
  },
  lpb1periodiccharge: {
    title: "PERIODIC.CHARGES Property Class",
    simple: "Charges that fall due at regular intervals — a monthly service fee, a quarterly facility fee.",
    example: "A 25 USD monthly account maintenance charge billed every cycle.",
    why: "Recurring fees need their own scheduled mechanism, separate from event charges.",
    memory: "PERIODIC.CHARGES = the standing-order fee.",
    temenos: "Optional (Lending); Dated; Currency optional; DUE/PAY/AGE/DEF balance prefixes, suffix SP/CO/CUST; 'Include All Deferred Charges' decides whether deferred charges are made due; both attributes settable at product or arrangement level.",
    related: ["lpb1charge", "lpb1triggercharge"],
  },
  lpb1triggercharge: {
    title: "Triggering & Deferring Charges",
    simple: "Charges trigger event-based (an activity runs), rule-based (a rule is broken) or schedule-based (a schedule date is reached), and can be deferred, capitalised or paid.",
    example: "An overdraft fee is rule-based (limit exceeded); a documentation fee is event-based (new arrangement); a facility fee is schedule-based.",
    why: "Knowing the trigger type tells you when and why a fee appears.",
    memory: "Three triggers: event, rule, schedule.",
    temenos: "APP.METHOD (Due/Cap/Defer/Pay) sets the application method; Calculation Types Fixed/Percentage/Unit with Source.Type (TXN.AMOUNT/COUNT) and Source.Balance; charges can be deferred by days after occurrence.",
    related: ["lpb1charge", "lpb1activitycharge", "lpb1periodiccharge"],
  },

  // ---- Section 7: Payment Schedule ----
  lpb1payschedule: {
    title: "PAYMENT.SCHEDULE Property Class",
    simple: "A mandatory Lending property class that defines the rules and defaults for the repayment schedule of a loan.",
    example: "It says 'monthly, constant instalments, principal + interest, first payment one month after disbursement'.",
    why: "The schedule is the heart of a loan — when and how much the customer pays.",
    memory: "PAYMENT.SCHEDULE = the repayment plan's rulebook.",
    temenos: "Mandatory; Dated, Forward-dated and Currency-specific; values can be viewed and edited; the schedule enquiry is generated at runtime (Nofile).",
    related: ["lpb1paytypes", "lpb1payfreq", "aa2repaystruct"],
  },
  lpb1paytypes: {
    title: "Payment Types (AA.PAYMENT.TYPE)",
    simple: "Named repayment behaviours: ACTUAL (repay calculated property classes), CONSTANT (level instalment), LINEAR (level principal), PERCENTAGE (a % of the balance), DOWNPAYMENT, plus one-off/special types.",
    example: "A standard amortising loan uses CONSTANT; a bullet loan uses ACTUAL with a final principal payment.",
    why: "The payment type shapes the whole repayment curve.",
    memory: "CONSTANT = level total; LINEAR = level principal; ACTUAL = pay what's calculated.",
    temenos: "Defined in AA.PAYMENT.TYPE (Model Bank); Rule of 78 payment type allocates pre-calculated interest; can be pre-constructed via AA.PAYMENT.TYPE and defaulted onto the schedule conditions at arrangement creation.",
    related: ["lpb1payschedule", "aa2repaytypes"],
  },
  lpb1payfreq: {
    title: "Payment Frequency & Generating Bills",
    simple: "How often payments fall due, and how many working days before the due date the bill is produced.",
    example: "Monthly frequency, bill generated 5 working days in advance so the customer sees it coming.",
    why: "Billing has to run ahead of the due date for notices and direct debits.",
    memory: "Frequency = how often; In Advance = how early the bill.",
    temenos: "Relative dates for start/end via events (START, MATURITY, RENEWAL, DISBURSEMENT) with R,XXXX offsets; Defer.By defers a payment, keeping bill status DEFER; system can run ISSUEBILL and MAKEDUE separately or together.",
    related: ["lpb1payschedule", "lpb1basedate"],
  },
  lpb1recalc: {
    title: "Recalculating the Payment Schedule",
    simple: "Certain activities (change amount/term/rate) recalculate the schedule; recalculation type can be Payment, Term, Residual, Nothing or Progressive.",
    example: "A rate rise with recalculation type Payment raises the instalment; with type Term it extends the loan instead.",
    why: "When loan terms change, something has to give — the payment, the term, or a balloon.",
    memory: "Recalc type = which lever moves when terms change.",
    temenos: "Can be scheduled or triggered by an activity; 'Maturity then Payment' recalculates term first, then payment if the recalculated term exceeds the max; runs at predefined frequency (weekly/monthly/yearly).",
    related: ["lpb1payschedule", "lpb1maturity"],
  },
  lpb1holidays: {
    title: "Payment Holidays (Moratoriums)",
    simple: "Rules letting a customer skip or reduce payments for a period, within caps set at product and arrangement level.",
    example: "A borrower takes a 3-month payment holiday; accrued interest is capitalised and the schedule recalculated.",
    why: "Forbearance and promotional 'no payments for 6 months' offers need controlled rules.",
    memory: "Payment holiday = permission to skip, within limits.",
    temenos: "Activity LENDING-UPDATE-PAYMENT.HOLIDAY; Payment Date, Number of Installments, Payment Type, Repay Type (collected immediately after / deferred); Repayment Holiday Limit caps the holiday; excess payment updates the Holiday Limit Available.",
    related: ["lpb1payschedule", "lpb1recalc"],
  },

  // ---- Section 8: Settlement ----
  lpb1settlement: {
    title: "SETTLEMENT Property Class",
    simple: "An optional property class that defines how money is received (Pay In) and paid out (Pay Out) for an arrangement, via mandates in the Direct Debit module.",
    example: "Repayments are collected by direct debit from the customer's current account; disbursement pays out to their nominated account.",
    why: "A loan is nothing without the plumbing that moves money in and out.",
    memory: "SETTLEMENT = the arrangement's payment instructions.",
    temenos: "Optional; date-specific; mandate defined in Direct Debit (DD); Receive/Payout are multi-value by Payment Type and related activity; default via DEFAULT.SETTLEMENT.ACCOUNT; PAYIN.SETTLEMENT / PAYIN.ACTIVITY / PAYOUT.ACTIVITY fields; default activity from Activity Mapping (R17).",
    related: ["lpb1receiving", "lpb1directdebit", "lpb1offset"],
  },
  lpb1receiving: {
    title: "Receiving Funds",
    simple: "How incoming money is matched to bills: Full (only settle if the whole bill is covered), Partial (settle to the extent of funds), or None.",
    example: "A partial payment on a 1,000 bill: with Partial, 600 settles 600 of it; with Full, nothing settles until 1,000 arrives.",
    why: "Underpayments need a clear, configurable rule.",
    memory: "Full = all or nothing; Partial = whatever's there.",
    temenos: "The system combines due bill amounts into a single settlement when the Account Settlement field is Combined; Combine Bills field on the Account property; automatic settlement account is a Transact Account or single DD mandate.",
    related: ["lpb1settlement", "lpb1directdebit"],
  },
  lpb1directdebit: {
    title: "Direct Debits, Transaction Recycler & Cycler",
    simple: "Direct Debit collects repayments; the Transaction Recycler retries movements that couldn't complete; the Transaction Cycler retries per a recycling condition and frequency.",
    example: "A failed direct debit is picked up by the Recycler and retried; after N attempts it's handed to Made-Due processing.",
    why: "Payments fail — insufficient funds, timing — and the system must retry sensibly.",
    memory: "Recycler/Cycler = keep trying the failed collection.",
    temenos: "DD Transaction Code mapped via ACTIVITY:MAPPING and specified in APPLY.PAYMENT; RC.CAPTURE condition and frequency; bills prioritised (oldest first or as configured); AA Bills Made-Due at COB can skip AA processing and hand to RC if configured.",
    related: ["lpb1settlement", "lpb1receiving"],
  },
  lpb1offset: {
    title: "Offsetting Bills (Settlement Part 2)",
    simple: "Nets a Pay bill against a Due bill on the same or a linked property so the customer only moves the net amount.",
    example: "A cashback Pay bill of 50 offsets a fee Due bill of 200; the customer is billed 150.",
    why: "Raising and collecting gross bills that partly cancel wastes movements and confuses statements.",
    memory: "Offset = cancel Pay against Due, move the net.",
    temenos: "Offset Property Class/Property indicates which balance to offset; Offset Required Yes/No; Offset Pay Activity / Offset Payout Activity name the activities; from an accounting view the net is settled — no separate P&L impact.",
    related: ["lpb1settlement", "lpb1receiving"],
  },

  // ============ COURSE 9 · AA Lending Product Building Implementation — Part 2 ============
  // ---- Section 1: Payment Rules ----
  lpb2payrules: {
    title: "PAYMENT.RULES Property Class",
    simple: "A mandatory Lending property class that decides how a single incoming payment is allocated across multiple bills and multiple properties.",
    example: "A 2,000 payment is spread: oldest bill first, and within a bill principal before interest before the maintenance fee.",
    why: "When one payment must clear several debts, the order and priority matter for interest and aging.",
    memory: "PAYMENT.RULES = which bill, which property, gets paid first.",
    temenos: "Mandatory; DATED, MULTIPLE, TRACKING, MEMO; Application order (Age-wise / Oldest first / Latest first / not CURRENT payment rule type); Repayment Order sets priority by property; Tax settlement method PRO.RATE or SEPARATE.",
    related: ["lpb2payruletype", "lpb2remainder", "lpb1payschedule"],
  },
  lpb2payruletype: {
    title: "AA.PAYMENT.RULE.TYPE",
    simple: "Defines a named payment rule — which bills it applies to (Current / Advance), the property application type, and the payment method (Full or Partial).",
    example: "An 'advance' rule type collects bills before their due date; a 'current' type pays what's due now.",
    why: "Different collection scenarios (direct debit, ad-hoc overpayment, make-due) need different rules.",
    memory: "RULE.TYPE = a recipe for one payment scenario.",
    temenos: "Make Due / Advance Settle Date fields; Property Application Type balances vs current/reached property; Payment Method Full/Partial (Partial can settle bills in advance and update AA.ACCOUNT.DETAILS).",
    related: ["lpb2payrules", "lpb2makedue"],
  },
  lpb2remainder: {
    title: "Remainder Activity",
    simple: "Says what to do with money left over after all bills and ad-hoc payments are satisfied.",
    example: "After clearing every bill, 150 is left; the remainder activity credits it to the ADVACCOUNT (advance) balance.",
    why: "Overpayments need a defined home, not to be rejected or lost.",
    memory: "Remainder = 'where does the leftover go?'",
    temenos: "Triggers the Payment Rules property; must be defined in the product; subject to Transaction rules; can be applied to a bill even before the due date has been reached, based on an allocation rule that reads the arrangement's financial status (Performing / Suspended / Both / Restructured).",
    related: ["lpb2payrules", "lpb2payruletype"],
  },
  lpb2makedue: {
    title: "Make Bill Due",
    simple: "Forces bills to be treated as due — and settled — even when they aren't yet, so an early payment can clear them.",
    example: "MAKE.BILL.DUE = Yes lets a lump-sum payment settle the next two bills before they fall due.",
    why: "Customers who pay ahead expect their future instalments cleared.",
    memory: "Make Due = 'pull the next bills forward and pay them'.",
    temenos: "When set to Yes, advance bills are generated even if partially settled; Advance Payment Restriction sets how many bills ahead (Null = create and settle all until the payment amount is used; a number = that many).",
    related: ["lpb2payruletype", "lpb2payrules"],
  },

  // ---- Section 2: Payout & Overdue ----
  lpb2payout: {
    title: "PAYOUT.RULES Property Class",
    simple: "An optional property class defining the method and order in which money is paid out to customers from various arrangement balances.",
    example: "A rebate is paid from the CURACCOUNT balance; a scheduled disbursement from undrawn commitment — the payout rule sets the order.",
    why: "Just as payments in need rules, payments out need a defined source and sequence.",
    memory: "PAYOUT.RULES = which balance the money leaves from, in what order.",
    temenos: "Optional (Lending); Dated, Multiple, Tracking; payment application types CURRENT.PAY, PAY, DEPOSIT.PAY; LENDING.RULE.PAYOUT is used to pay out balances; property sequence must be a valid property of Interest, Charge or Principal amount.",
    related: ["lpb2payrules", "lpb1settlement"],
  },
  lpb2overdue: {
    title: "OVERDUE Property Class",
    simple: "An optional property class that governs ageing statuses, chaser notices, suspensions and balance movements for delinquent loans.",
    example: "An unpaid loan moves Grace → Delinquent → Non-Accrual, with notices and income suspension defined here.",
    why: "Every bank needs a controlled, configurable delinquency process.",
    memory: "OVERDUE = the delinquency rulebook.",
    temenos: "Optional (Lending); DATED, TRACKING, MEMO; overdue statuses defined in Virtual table AA.OVERDUE.STATUS via EB.LOOKUP; Bill Type overdue rule definition; Arrangement Bill Type drives the overall arrangement status.",
    related: ["lpb2ageing", "lpb2chaser", "aa3overdue"],
  },
  lpb2ageing: {
    title: "Ageing Status & Basis",
    simple: "A status (GRC/DEL/NAB…) that denotes how overdue an arrangement is; ageing can be by Days, by Bills, or a combination.",
    example: "Ageing by Days: 1 day overdue = Grace, 30 = Delinquent, 90 = Non-Accrual, moving all bills to the NAB status.",
    why: "The status drives accounting (income suspension), notices and reporting.",
    memory: "Ageing = the label that says how bad the arrears are.",
    temenos: "Ageing by Days (calendar days/months or a combination + a minimum count); Ageing by Bills (suffixed 'B', e.g. 1B, 2B); value '0' can't be set to more than one overdue status; Suspend Arrangement stops P&L accrual (AGE.ALL.BILLS = YES) to a special CRF category.",
    related: ["lpb2overdue", "lpb2suspend"],
  },
  lpb2chaser: {
    title: "Chaser Notice",
    simple: "A dunning notice generated a set number of days after an ageing status is reached, then repeated at a frequency.",
    example: "3 days into Delinquent a first notice goes out; another every 7 days thereafter.",
    why: "Automated, timed reminders are the front line of collections.",
    memory: "Chaser = the automatic 'you're behind' letter.",
    temenos: "Notice can be generated a specified number of days post an ageing status; frequency set for recurrence; Age all Bills option ages bills less than a status to a specified status.",
    related: ["lpb2overdue", "lpb2ageing"],
  },
  lpb2suspend: {
    title: "Suspend Arrangement & Delinquent Settlement",
    simple: "At a chosen status the arrangement is suspended (no further P&L accrual, entries to a special CRF category); Status Mvmt controls how repayments then move bills back.",
    example: "In NAB, all bills move to that status; as the customer repays, the oldest bill's paid portion is reassigned back to Current.",
    why: "Non-accrual accounting is a regulatory requirement for bad loans.",
    memory: "Suspend = freeze the income; settlement un-freezes bill by bill.",
    temenos: "AGE.ALL.BILLS field = YES to suspend; recalculation can happen during delinquent settlement; basis for ageing = Delinquent / Financial balance; deemed settled only when actual balances within a bill are settled.",
    related: ["lpb2ageing", "lpb2overdue"],
  },

  // ---- Section 3: Restructure Rules ----
  lpb2restructure: {
    title: "RESTRUCTURE.RULES Property Class",
    simple: "An optional property class defining stage-specific rules for suppressing/resuming interest and charges while a loan is being restructured.",
    example: "During restructuring, penalty interest is suppressed from the original suppress date; on approval it resumes.",
    why: "Debt restructuring under financial hardship needs the loan's normal charging paused in a controlled way.",
    memory: "RESTRUCTURE.RULES = pause and resume charges during a workout.",
    temenos: "Optional (Lending); Dated, Tracking; balance prefix Null; 3-stage process (In-progress / Reject / Approve) with matching functions; users create restructured statuses ('Inprog', 'Reject', 'Approved') via AA.RESTRUCTURE.STATUS.",
    related: ["lpb2technicalloan", "lpb2rulestatus"],
  },
  lpb2technicalloan: {
    title: "Technical Loan",
    simple: "A parallel loan created during restructuring that carries the amended terms; repayments hit it and are redirected to the original loan's payment rules.",
    example: "A hardship restructure opens a Technical Loan at a lower rate; the customer pays that, and the money flows to the original contract.",
    why: "The original contract must stay intact for audit while the customer pays revised terms.",
    memory: "Technical Loan = the 'new deal' shell over the real loan.",
    temenos: "Both the Original loan and the Technical Loan currencies must be the same; a repayment on the technical loan is parked in the suspense account (UNC) then applied to the underlying original loan via its payment rules.",
    related: ["lpb2restructure", "lpb2payrules"],
  },
  lpb2rulestatus: {
    title: "Rule Status Type & Effective Date",
    simple: "Indicates the type of restriction a restructure rule applies (against interest/charges) and when the suppress or resume action takes effect.",
    example: "A rule suppresses PENALINTEREST with effect from 'Activity Date'; the resume rule uses 'Suppress Date' so it back-dates.",
    why: "Restructuring outcomes depend precisely on which charges pause and from when.",
    memory: "Rule Status Type = what's restricted; Effective Date = from when.",
    temenos: "Rule Status Type indicates the type of restriction; Rule Action = SUPPRESS / RESUME; for a resume the Effective Date can be 'Activity Date' or 'Suppress Date'.",
    related: ["lpb2restructure", "lpb2technicalloan"],
  },

  // ---- Section 4: Charge Off ----
  lpb2chargeoff: {
    title: "CHARGEOFF Property Class",
    simple: "An optional property class that writes off a loan while keeping separate bank, customer and charge-off balance types for the same amounts.",
    example: "A defaulted loan is charged off: the bank recognises the loss, but the customer still owes it — tracked in customer balances.",
    why: "Accounting writes the loss off; the debt legally still exists and must be tracked.",
    memory: "Charge-off = loss recognised, debt still remembered.",
    temenos: "Optional (Lending); DATED, TRACKING; handles Charge-Off of Arrangement; when charged off, customer balances stay Regular; charge-off details stored in AA.ACCOUNT.DETAILS; AA.BILL.DETAILS holds customer due & bank information; overdue processing is triggered per the regular process.",
    related: ["lpb2coallocation", "lpb2overdue"],
  },
  lpb2coallocation: {
    title: "Charge-Off Allocation",
    simple: "How balances move on a charge-off activity: allocation can follow the loan status (Regular/NPA), and target CUR<ACCOUNT> then bills (new to old) — NEWEST.FIRST — or OLDEST.FIRST.",
    example: "A partial recovery on a charged-off loan is applied NEWEST.FIRST to the current account balance, then to bills latest-to-oldest.",
    why: "Recoveries and further write-downs need a defined order across bank and customer balances.",
    memory: "Charge-off allocation = which balance the movement hits, in what order.",
    temenos: "Allocation based on status Property and Balance Type; NEWEST.FIRST allocates to DUE<ACCOUNT> ChargeOff balances, bills newest to oldest; if the recovery amount is negative, Decrease Charge-Off is triggered; each Account and Interest property can specify billed vs live vs charge-off balances.",
    related: ["lpb2chargeoff", "lpb2payrules"],
  },

  // ---- Section 5: Constraint ----
  lpb2constraint: {
    title: "CONSTRAINT Property Class",
    simple: "An optional property class that restricts how far back-dated activities may be performed — by a specific date, period, financial year, interest period, renewal or statement period.",
    example: "A constraint blocks any back-value activity before the start of the current financial year.",
    why: "Late back-dated changes reopen closed accounting periods and must be controlled.",
    memory: "CONSTRAINT = 'you can't back-date past this line'.",
    temenos: "Optional (Lending, Deposits, Accounts); Tracking, Dated; Constraint Type Date / Financial Year / Interest Period / Period / Renewal / Statement Period; RESULT = Error or Override with ERROR.MESSAGE / OVERRIDE.MESSAGE; multiple constraints resolve with 'Override' taking precedence; Exclude Activity field 'YES' in AA.ACTIVITY excludes an activity from constraint evaluation.",
    related: ["lpb2periodicclass", "aai2reverse"],
  },

  // ---- Section 6: Periodic Attributes ----
  lpb2periodicclass: {
    title: "AA.PERIODIC.ATTRIBUTE.CLASS",
    simple: "A Temenos-released (or user-defined) block that defines the Action, Comparison Type, Data Type and Source for a periodic rule — logic that changes product behaviour over time.",
    example: "A periodic attribute class for 'interest rate ceiling' evaluates monthly and compares the current rate against a cap.",
    why: "Some product behaviour must be re-checked on a cycle, not just at arrangement creation.",
    memory: "Periodic Attribute Class = the mould for a time-based rule.",
    temenos: "Released by Temenos; Action (AA.ACTIVITY.RESTRICTION, CHANGE, INTEREST/PAYMENT SCHEDULE, PAY.OFF, PRICING, RULES and ERRORMSGACT); Comparison Types via EB.COMPARISON.THR table (MINIMUM, MAXIMUM, RANGE); Data Types AMT/PERCID/N/R/N.DAO; Source Routine a valid EB.API entry.",
    related: ["lpb2periodicattr", "lpb2periodicrules"],
  },
  lpb2periodicattr: {
    title: "AA.PERIODIC.ATTRIBUTE",
    simple: "A named instance of a periodic attribute class, referenced in a product condition, that fixes the rule the arrangement follows over time.",
    example: "PERIODIC.ATTRIBUTE 'RATE.DECREASE' is used in the INTEREST product condition to restrict rate cuts during year 1.",
    why: "The class is the logic; the attribute is the specific rule this product uses.",
    memory: "Periodic Attribute = the class, filled in for one product.",
    temenos: "Used in Product Condition; a rule that needs to be applied on a specific period or life-time of Arrangement is controlled by PERIODIC.TYPE (INITIAL, REPEATING, ROLLING, ASSESSMENT.PERIOD.CURRENT); PERIOD field controls the exact period for which the Rule is defined (01D, 1M, 7Y…).",
    related: ["lpb2periodicclass", "lpb2periodicrules"],
  },
  lpb2periodicrules: {
    title: "Periodic Rules Structure",
    simple: "A rule tying a Property Class + Comparison Type + Routine to a time element, with a comparison value, break result and break charges.",
    example: "'Interest rate increased more than 1% in any 1-year period' → break result 'error', break charge 10 USD.",
    why: "Products need guardrails that trigger only when a change over a period crosses a threshold.",
    memory: "Periodic Rule = threshold + period → consequence.",
    temenos: "Interest & Charges: Maximum/Minimum Rate, Rate Decrease/Increase, Maximum/Minimum Charge rules; Transaction Amount & Count: Maximum/Minimum/Multiple, Totals per period; Balance: Maximum/Minimum Balance, Balance Increase, Minimum Initial Balance.",
    related: ["lpb2periodicattr", "lpb2breakcharges"],
  },
  lpb2breakcharges: {
    title: "Break Result & Break Charges",
    simple: "When a periodic rule is broken, the Break Result (error / override) decides whether the action is blocked, and a Break Charge can be levied.",
    example: "Breaking the early-repayment periodic rule overrides with a message and applies a 1% break fee.",
    why: "Some limits are hard stops; others are 'allowed, but it'll cost you'.",
    memory: "Break = error or override, plus maybe a fee.",
    temenos: "Break Result and Break Charges defined per rule; charges link to a Charge Property; can be fixed or calculated on a base amount; defined in specific Product Conditions or based on failure of Periodic Attributes.",
    related: ["lpb2periodicrules", "lpb1charge"],
  },

  // ---- Section 7: Activity Restrictions ----
  lpb2actrestrict: {
    title: "ACTIVITY.RESTRICTION Property Class",
    simple: "An optional property class that limits, regulates or conditionally allows arrangement activities based on balance, transaction amount or count.",
    example: "Block change-of-product entirely; or allow more than one repayment per year only after an override.",
    why: "Products need rules about what customers and staff may and may not do to an arrangement.",
    memory: "ACTIVITY.RESTRICTION = what's allowed, blocked, or allowed-with-override.",
    temenos: "Optional; DATED, CCY, TRACKING, MULTIPLE, FORWARD.DATED, VARIATION; Complete restriction (Not to allow…), Partial/conditional (allow > override), Override message mandatory; Product Condition per currency; Periodic Rules enable time-element rules.",
    related: ["lpb2restricttypes", "lpb2qualifier"],
  },
  lpb2restricttypes: {
    title: "Restriction Types (Balance / Amount / Count · Rule / Activity / Property based)",
    simple: "Restrictions key off Balance Rules, Transaction Amount or Transaction Count; and are Rule-based, Activity-based or Property-based.",
    example: "Property-based: waive the interest on a Charge Property amount and apply an alternate interest; Activity-based: block the disbursement activity when the count exceeds a limit.",
    why: "The same activity can be restricted many ways depending on the product's risk appetite.",
    memory: "Three keys (balance/amount/count) × three bases (rule/activity/property).",
    temenos: "Rules Tab (rule name, periodic attribute, source, value, activity class/activity, balance); Property Tab (property, run the rule, evaluation break/satisfy, apply/waive/alternate); scheduled interest and charge properties can be restricted via the Payment Schedule property.",
    related: ["lpb2actrestrict", "lpb2qualifier"],
  },
  lpb2qualifier: {
    title: "Product Qualifier Rules",
    simple: "Rules evaluated to decide whether an activity should PASS or FAIL (or trigger a subsequent action), using a Rule Set with AND/OR/EQUAL logic and a frequency.",
    example: "A qualifier rule set says a top-up is allowed only if arrears = 0 AND the product is CURRENT; otherwise it fails.",
    why: "Complex 'allowed only if…' conditions need a proper rule engine, not a single flag.",
    memory: "Qualifier = a mini rules engine gating an activity.",
    temenos: "Rules Set Tab combines single/multiple rules; Action from AA.ACTION; Rule Expression uses AND/OR/EQUAL TO/NOT EQUAL TO; Rule Evaluation PASS/FAIL; Default Result; Review Run Rule Set for periodic evaluation.",
    related: ["lpb2restricttypes", "lpb2actrestrict"],
  },

  // ---- Section 8: Change Product & Payoff ----
  lpb2changeproduct: {
    title: "CHANGE.PRODUCT Property Class",
    simple: "An optional property class letting an arrangement switch to a different product — manually, automatically, or on a scheduled date/period/condition.",
    example: "A promotional-rate loan automatically switches to the standard product at the end of the 2-year intro period.",
    why: "Products with intro offers or lifecycle stages need a controlled switch mechanism.",
    memory: "CHANGE.PRODUCT = swap this arrangement onto another product.",
    temenos: "Optional; Date-specific, TRACKING; Allowed Product lists valid switch targets (same product group); Change Date field / Change Period field / Prior Days field; switch Automatic or Manual; scheduled switch can be relative to the customer's birth date.",
    related: ["lpb2rollover", "aai1variation"],
  },
  lpb2rollover: {
    title: "Rollover, Reset & Renegotiate",
    simple: "Change activities: ROLLOVER renews with existing or revised conditions; RESET reapplies the product-level values; RENEGOTIATE changes conditions of different properties in one stretch.",
    example: "At maturity a deposit ROLLOVERs for another term; a periodic mortgage RESETs to the current product rate.",
    why: "Renewals and re-pricing are routine and must be predictable.",
    memory: "Rollover = renew; Reset = snap to product; Renegotiate = change several at once.",
    temenos: "RENEWAL.ACTIVITIES / CHANGE.PRODUCT; DEFAULT.ATTR.OPTION on the CHANGE.CONDITION activity — RESETTING reapplies product values, NON-RESETTING / NONE keeps negotiated ones; Loan Renewal may recalculate Renewal Date and Maturity Date.",
    related: ["lpb2changeproduct", "lpb1recalc"],
  },
  lpb2payoff: {
    title: "PAYOFF Property Class",
    simple: "An optional property class that defines rules to simulate and process the full payoff (early settlement) of a lending arrangement.",
    example: "A customer asks to clear a loan early; PAYOFF produces a quote including remaining accrued interest and any prepayment charge.",
    why: "Early settlement is common and the quote must be exact and auditable.",
    memory: "PAYOFF = the 'what would it cost to clear this today' engine.",
    temenos: "Optional (Lending); Dated; expiry days for the payoff bill; Settlement Activity auto-invoked when payoff is simulated or paid; Tolerance Per cent / Amount / Action for shortfalls; SIMULATION.RUNNER front-end drives the Lending-Calculate-Payoff activity; prepayment charge as an activity or periodic rule charge.",
    related: ["lpb2payoffstmt", "aa2additional"],
  },
  lpb2payoffstmt: {
    title: "Payoff Statement & Calculation",
    simple: "The payoff calculation totals dues for Account, Interest and Charge properties linked to the arrangement, plus balances not yet due, as at the payoff date.",
    example: "The statement shows outstanding principal, accrued-but-unbilled interest, and a break fee — netting to the payoff figure.",
    why: "The customer and the bank both need the settlement figure itemised.",
    memory: "Payoff statement = every bucket totalled to one number.",
    temenos: "Bills for regular payments and any rule (Periodic Rules, Activity Charges) break-rule charges may be settled or written off; credit in UNC of the Account property auto-settles dues; loan payoff settlement possible via a Payment Order directly from the payoff statement in the loan overview.",
    related: ["lpb2payoff", "aa2findloan"],
  },

  // ---- Section 9: Closure & Reporting ----
  lpb2closure: {
    title: "CLOSURE Property Class",
    simple: "An optional property class controlling how and when an arrangement closes — automated or manual, and on what trigger.",
    example: "A term loan closes automatically once all balances reach zero on the maturity date.",
    why: "Closed loans must stop accruing, release limits and archive cleanly.",
    memory: "CLOSURE = the rules for shutting the arrangement down.",
    temenos: "Optional (Lending); DATED, TRACKING, EXTERNAL, EXTERNAL FINANCIAL, MEMO; Closure Method Automatic / Manual / Online; Posting Restriction code and Close Online (Accounts product line only).",
    related: ["lpb2closuretype", "lpb2cooling"],
  },
  lpb2closuretype: {
    title: "Closure Type (Maturity / Balance / Defer)",
    simple: "MATURITY = closure depends on the maturity date; BALANCE = closure activity is scheduled when balances reach zero; DEFER.CLOSURE = closure processing waits on the deferred maturity date.",
    example: "An overdraft uses BALANCE closure — it shuts when it's paid off, whenever that is.",
    why: "Different products reach 'finished' in different ways.",
    memory: "Maturity = by date; Balance = when it hits zero; Defer = wait for the deferred date.",
    temenos: "Closure Period indicates when the CLOSURE activity is processed for automatic closure.",
    related: ["lpb2closure", "lpb2cooling"],
  },
  lpb2cooling: {
    title: "Cooling Period (at Closure)",
    simple: "A window after opening during which the customer can cancel the loan with charges waived; the cooling date can be date-adjusted for non-working days.",
    example: "A borrower cancels within the 14-day cooling period; interest and charges booked so far are reversed.",
    why: "Consumer-credit regulation gives borrowers a right to withdraw.",
    memory: "Cooling period = the no-questions cancellation window.",
    temenos: "Set on the TERM.AMOUNT property class or the CLOSURE property class; Cooling Date Adjustment Forward / Null / Calendar; Waive Bill Type should be 'All' for charge property class; enabled only in the Lending product line.",
    related: ["lpb2closure", "lpb1termamt"],
  },
  lpb2reporting: {
    title: "REPORTING Property Class",
    simple: "An optional property class that integrates an arrangement with Position Management and IFRS reporting, and supports APR and IFRS charge-off.",
    example: "A loan feeds the bank's interest-rate-gap and currency positions, and its effective interest rate for IFRS.",
    why: "Treasury and IFRS reporting need arrangement-level data consolidated into time bands.",
    memory: "REPORTING property = plug the loan into Treasury and IFRS.",
    temenos: "Optional (Lending); IFRS accounting via the Reporting property class; Product Conditions tabs Reporting / IFRS Details / Position Management / Annual Percentage; IFRS Charge Off updates CHARGEOFF.STATUS in AA.ACCOUNT.DETAILS.",
    related: ["lpb2position", "lpb2apr"],
  },
  lpb2position: {
    title: "Position Management (PM)",
    simple: "A framework helping banks manage liquidity (cash flow / CAS), interest-rate risk (GAP) and currency risk (FXP) from arrangement data.",
    example: "PM.GAP shows the mismatch between rate-sensitive assets and liabilities in each maturity band.",
    why: "The Treasury desk needs real-time behavioural and contractual cash flows by time band.",
    memory: "PM = liquidity, rate gap, FX — the Treasury view of the book.",
    temenos: "Enquiries PM.CAS (Cash Flow Position), PM.GAP (Interest Mismatch / GAP), PM.FXPOS (Forex Position and Break-Even); cash flows consolidated into user-defined time periods.",
    related: ["lpb2reporting", "lpb2apr"],
  },
  lpb2apr: {
    title: "APR Calculation",
    simple: "The Annual Percentage Rate can be calculated by Cashflow or by Interest, across Lending, Deposits and Accounts product lines, and recalculated when cash flow changes.",
    example: "Adding a fee to a loan changes its APR; the system recalculates it at new-arrangement time and at each interest-frequency instance.",
    why: "Regulators require a single comparable rate that includes fees.",
    memory: "APR = the all-in rate, by cashflow or by interest.",
    temenos: "APR Type on the product; Exclude Property / Linked Interest Property fields; multiple APR types via AA.PAYMENT.TYPE; enabled for simulation contracts; recalculated whenever cash flow is affected by an eligible activity (UPDATE.APR.ACTIVITY).",
    related: ["lpb2reporting", "lpb2position"],
  },

  // ---- Section 10: Building Lending Products ----
  lpb2prodline: {
    title: "AA.PRODUCT.LINE (Implementation)",
    simple: "The high-level definition of a business line (Lending, Deposits, Accounts); only Temenos releases these and only some fields can be modified.",
    example: "The LENDING product line carries LINE.ATTRIBUTE, currency and REPLAY settings shared by every lending product.",
    why: "The line sets what's common to a whole family before any client configuration.",
    memory: "Product Line = the family, Temenos-owned.",
    temenos: "Pre-defined by TEMENOS; only the description is modifiable; LINE.ATTRIBUTE field for CCY and REPLAY; for other lines, Internet Services should be left blank; property classes present at line level must be Mandatory or Optional.",
    related: ["lpb2prodgroup", "aai1hierarchy"],
  },
  lpb2prodgroup: {
    title: "AA.PRODUCT.GROUP (Implementation)",
    simple: "A client-defined grouping of products under a line; it fixes which property classes are Mandatory or Optional and holds the mandatory Properties.",
    example: "A 'Personal Loans' group makes INTEREST, ACCOUNT and PAYMENT.SCHEDULE mandatory and adds the client's named Properties.",
    why: "The group is where a client first shapes the product family for its own use.",
    memory: "Product Group = the client's shelf of related products.",
    temenos: "Group Type Internal / External; a mandatory Property must be defined at product level; REBUILD.ACTIVITIES = Yes generates the activity set; Properties for a Property are generated automatically when it's added to a group.",
    related: ["lpb2prodline", "lpb2designer"],
  },
  lpb2designer: {
    title: "AA.PRODUCT.DESIGNER (Implementation)",
    simple: "The table where a product is designed under its group — its currencies, which optional properties apply, and their effective dates.",
    example: "The designer for 'Staff Personal Loan' enables the optional CHARGE.OVERRIDE property and sets the product currency to USD.",
    why: "This is where an actual sellable product takes shape from the group's components.",
    memory: "Product Designer = assemble the product from the group's parts.",
    temenos: "Product Currency multi-value; calculation-related features (Source Type / Source Property / calculation frequency); PARENT.PRODUCT defines a parent whose properties are inherited; non-saleable acts only as a parent; must pass Proofing before it can be published.",
    related: ["lpb2prodgroup", "lpb2proofpublish"],
  },
  lpb2proofpublish: {
    title: "Proofing & Publishing",
    simple: "A three-stage process — Design, Proof, Publish. Proofing validates conditions, accounting and mandatory properties; publishing adds the product to the catalog and cascades from parent to children.",
    example: "A designed product fails proof for a missing accounting rule; fixed and re-proofed, it publishes to the catalog.",
    why: "No product should reach customers with configuration errors.",
    memory: "Design → Proof → Publish.",
    temenos: "Product Designer → Proofed Products → Product Catalog; Available Date / Expiry Date govern when the product is sellable; proofing lists errors and suggests fixes; publishing performs proof top-down to all children.",
    related: ["lpb2designer", "lpb2catalog"],
  },
  lpb2catalog: {
    title: "Product Catalogue",
    simple: "The list of live, published products from which new arrangements are created; a product must be proofed, published and within its Available/Expiry dates to appear.",
    example: "A relationship manager opens the catalogue and sees only the products the customer is eligible for.",
    why: "The catalogue is the single source of what can actually be sold today.",
    memory: "Catalogue = the menu customers can order from.",
    temenos: "Populated by publishing; eligibility and variation filter what each customer sees; existing arrangements continue on the product version they were created from even after it expires.",
    related: ["lpb2proofpublish", "aa2catalog"],
  },
};

const DIAGRAMS = {
  roleaccess: {
    title: "Role-Based Access", caption: "What a user can reach flows from their role through their security profile.",
    steps: [
      { label: "User", sub: "logs in" },
      { label: "Role", sub: "e.g. Teller, Loan Officer" },
      { label: "USSP", sub: "controls reachable applications" },
      { label: "RBHP", sub: "the tailored home page" },
      { label: "Functions", sub: "only what the role needs" },
    ],
  },
  custhub: {
    title: "Customer at the Centre", caption: "One customer record feeds everything else in Transact.",
    steps: [
      { label: "Customer Record", sub: "core, customer-centric", tag: "CUSTOMER" },
      { label: "Accounts & Loans", sub: "reference the customer" },
      { label: "Relationships", sub: "linked parties", tag: "RELATION" },
      { label: "Account Officer", sub: "on every transaction", tag: "DEPT.ACCT.OFFICER" },
    ],
  },
  centre: {
    title: "Group → Centre", caption: "Members join a group; several groups form a centre.",
    steps: [
      { label: "Member", sub: "joins a group (not a centre)" },
      { label: "Group", sub: "5+ members, mutual guarantee" },
      { label: "Centre", sub: "up to 10–12 groups (~50–60 members)" },
      { label: "Centre meeting", sub: "groups submit savings & repayments" },
    ],
  },
  dividend: {
    title: "Dividend Calculation", caption: "Points build daily from balance, then convert to a dividend.",
    steps: [
      { label: "Daily balance", sub: "added to points if above the minimum" },
      { label: "Dividend Points", sub: "sum of daily balances (average daily balance)" },
      { label: "Apply formula", sub: "(Points ÷ Days in Year) × Rate" },
      { label: "Post dividend", sub: "Dividend Runner posts + issues a note", tag: "EM.DIVIDEND.RUN.DETAILS" },
    ],
  },
  psos: {
    title: "Payment Source → Obligation → Split", caption: "Money in is qualified as a source, then divided across obligations.",
    steps: [
      { label: "Payment Source", sub: "what money coming in triggers a split", tag: "EB.ALERT.REQUEST" },
      { label: "Payment Obligation", sub: "what the money is set aside for", tag: "EM.PS.OBLIGATION.INPUT" },
      { label: "Payment Split", sub: "how incoming funds are divided", tag: "EM.PS.PAYMENT.SPLIT" },
      { label: "Action at COB", sub: "obligation pays out on its run date" },
    ],
  },
  aa2hierarchy: {
    title: "AA Product Hierarchy", caption: "Temenos owns the line; clients own groups and products; a product + customer = an arrangement.",
    steps: [
      { label: "Product Line", sub: "Temenos-defined · reusable components", tag: "AA.PRODUCT.LINE" },
      { label: "Product Group", sub: "client-defined subset", tag: "AA.PRODUCT.GROUP" },
      { label: "Product", sub: "client-defined · product conditions", tag: "AA.PRODUCT" },
      { label: "Arrangement", sub: "product + customer = one instance", tag: "AA.ARRANGEMENT" },
    ],
  },
  aa2statusflow: {
    title: "Record Status Lifecycle", caption: "From a half-filled draft to a fully live record — each step is a checkpoint. RNAU branches off later, when someone reverses an already-live record.",
    steps: [
      { label: "IHLD", sub: "Input Held — saved as a draft, not yet in the validation queue" },
      { label: "INAO", sub: "Input Authorised, Overrides — blocked on a policy warning until accepted" },
      { label: "INAU", sub: "Input Authorised, Needs Authorisation — committed, waiting on a supervisor" },
      { label: "LIVE", sub: "All checks passed, overrides accepted, supervisor authorised — active in production" },
      { label: "RNAU (branch)", sub: "Someone later reverses this live record — the reversal itself now waits on supervisor sign-off" },
    ],
  },
  aa2createflow: {
    title: "Create → Authorise a Loan", caption: "The path from a new arrangement to a live, disbursed loan.",
    steps: [
      { label: "New Arrangement", sub: "from the Product Catalog; ID starts as NEW" },
      { label: "Validate", sub: "generates Activity ID then Arrangement ID + Account ID" },
      { label: "Capture & Commit", sub: "amount, term, settlement" },
      { label: "Accept Overrides", sub: "loan agreement received, etc. → Txn Complete" },
      { label: "Authorise", sub: "Find Loan → Unauthorised → Approve → status Current" },
    ],
  },
  aa3overdueflow: {
    title: "Overdue Escalation", caption: "An unpaid loan moves through statuses with escalating action.",
    steps: [
      { label: "Grace (GRC)", sub: "just overdue; short grace period" },
      { label: "Delinquent (DEL)", sub: "chaser notices begin" },
      { label: "Non-Accrual (NAB)", sub: "income suspended to a suspense account" },
    ],
  },
  aa3reverseflow: {
    title: "Reverse & Replay", caption: "A back-dated change unwinds to its date, then re-runs forward.",
    steps: [
      { label: "Back-dated activity", sub: "entered today, effective in the past" },
      { label: "Reverse", sub: "unwind activities from today back to the value date" },
      { label: "Replay", sub: "re-run activities forward to today" },
      { label: "Correct balances", sub: "accounting entries pass for both", tag: "LIFE.ATTRIBUTE=REPLAY" },
    ],
  },
  aai1buildchain: {
    title: "Building-Block Chain", caption: "Temenos ships classes; clients name properties, set conditions, assemble products.",
    steps: [
      { label: "Property Class", sub: "Temenos-released block", tag: "AA.PROPERTY.CLASS" },
      { label: "Property", sub: "client-named instance", tag: "AA.PROPERTY" },
      { label: "Product Condition", sub: "values + rules" },
      { label: "Product", sub: "assembly of conditions", tag: "AA.PRODUCT" },
      { label: "Arrangement", sub: "product + customer" },
    ],
  },
  aai1proofflow: {
    title: "Design → Proof → Publish", caption: "A product only reaches the catalog after it passes proofing.",
    steps: [
      { label: "Design", sub: "define conditions", tag: "AA.PRODUCT.DESIGNER" },
      { label: "Proof", sub: "validate conditions, accounting, mandatory properties" },
      { label: "Publish", sub: "add the product to the Product Catalog" },
    ],
  },
  aai1nostro: {
    title: "Nostro / Vostro", caption: "Same account, named from whichever bank's point of view.",
    steps: [
      { label: "Bank A (Ethiopia)", sub: "keeps USD at Bank B" },
      { label: "Account at Bank B", sub: "from A's view = NOSTRO (our account)" },
      { label: "Same account", sub: "from B's view = VOSTRO (your account)" },
    ],
  },
  aai2activity: {
    title: "Activity Class → Activity", caption: "Logic lives in the class; each property gets a named activity.",
    steps: [
      { label: "Activity Class", sub: "holds the logic (Action tab)", tag: "LENDING-DISBURSE-TERM.AMOUNT" },
      { label: "Activity", sub: "named per property", tag: "LENDING-DISBURSE-COMMITMENT" },
      { label: "Auto-generated", sub: "when the product group is built", tag: "REBUILD.ACTIVITIES=YES" },
      { label: "Arrangement data", sub: "written per property class", tag: "AA.ARR.<CLASS>" },
    ],
  },
};

// ---- Sandbox drills: step-by-step things to try in a Temenos training sandbox.
// Paths/labels are Temenos Model Bank defaults in the classic Browser UI — verify
// the exact menu/tile names in your own sandbox and correct them as you go.
// Add a drill = append here; each `related` id must exist in CONCEPTS.
const LABS = [
  {
    id: "lab-rbhp", courseId: "fif", section: "fif-1",
    title: "Explore your Role-Based Home Page",
    goal: "See how role → USSP → RBHP → functions works by navigating your own home page.",
    app: "—", menu: "Log in with your training user",
    prereq: "A training user with a role assigned, and at least one customer in the system.",
    steps: [
      { do: "Log in and note which home page loads.", expect: "A landing page whose menus/tiles are limited to your role — this is your RBHP." },
      { do: "Open the Single Customer View (SCV) and search a customer by name or mnemonic.", expect: "One screen with the customer's record, accounts, loans, documents and relationships tabs." },
      { do: "From the dashboard open the Work List / pending items.", expect: "A list of unauthorised records (driven by the EXCEPTION enquiry) you can click through to action." },
      { do: "Try to open an application that is not on your menu (type its name in the command line).", expect: "Access denied if it is outside your USSP." },
    ],
    verify: "You can state your role and name two functions your RBHP gives you and one it hides.",
    related: ["rbhp", "ussp", "scv", "worklist"],
  },
  {
    id: "lab-customer", courseId: "fif", section: "fif-2",
    title: "Create and authorise a customer",
    goal: "Create a customer-centric record end to end, including the input → authorise cycle.",
    app: "CUSTOMER", menu: "Customer > Create Customer  (RBHP tile may be 'Customer' or 'New Customer')",
    prereq: "Two users: one to input, one to authorise.",
    steps: [
      { do: "Open Create Customer.", expect: "A blank customer input screen; the numeric ID (7–10 digits) is reserved / auto-generated." },
      { do: "Enter Mnemonic, Short Name and Name(s).", expect: "Accepted; the mnemonic → ID link is written to MNEMONIC.CUSTOMER." },
      { do: "Enter address (Street, Town/Country) and the Sector and Target.", expect: "Sector drives downstream processing; Target is the segmentation code." },
      { do: "Set Customer Status, Account Officer (DAO), Language, Nationality, Residence.", expect: "The Account Officer you set will default onto every transaction for MIS by officer." },
      { do: "Commit the record.", expect: "Status INAU (input, unauthorised)." },
      { do: "Log in as the second user, open the Work List, find the customer and authorise.", expect: "Status becomes live; the record can be amended anytime but never reversed." },
    ],
    verify: "You can find the customer again by its mnemonic in the SCV.",
    related: ["custrec", "custcentric", "custid", "mnemonic", "dao", "custtabs"],
  },
  {
    id: "lab-relation", courseId: "fif", section: "fif-2",
    title: "Link a relationship between two customers",
    goal: "See that only one side of a relationship is entered — the reverse auto-defaults.",
    app: "RELATION", menu: "Open customer in amend mode > Relationship section",
    prereq: "Two authorised customers.",
    steps: [
      { do: "Open the first customer in amend mode and go to the Relationship section.", expect: "A table for related customer ID + relation code." },
      { do: "Add the second customer's ID and a relation code (e.g. spouse). Commit and authorise.", expect: "Relationship saved on the first customer." },
      { do: "Open the second customer and check its relationships.", expect: "The reverse relationship has auto-defaulted — you did not enter it." },
    ],
    verify: "Both customers show the relationship; only one side was set up.",
    related: ["relation", "counterparty"],
  },
  {
    id: "lab-group", courseId: "fif", section: "fif-4",
    title: "Create a lending group",
    goal: "Build a group, add members, and read it back in the Single Group View.",
    app: "GROUP", menu: "Group Management > Create Group",
    prereq: "5+ authorised customers to use as members.",
    steps: [
      { do: "Open Create Group and select the Group Type.", expect: "The group type sets limits, product eligibility and meeting rules." },
      { do: "Enter the group name and link the Centre.", expect: "A group links to only one centre." },
      { do: "Add members (each must already exist as a customer; 5+ members, mutual guarantee).", expect: "Members added to the group's member table." },
      { do: "Set the meeting / centre-meeting schedule. Commit and authorise.", expect: "Group is live." },
      { do: "Open the Single Group View (SGV) for the group.", expect: "360° view — members, meeting details, available limit, member transfers." },
    ],
    verify: "The group is authorised and appears in the SGV with its members.",
    note: "Applying a Credit Block to a member sets the BLOCKED field on that customer.",
    related: ["creategroup", "grouptype", "grouplimits", "centre", "grouplending", "groupenq"],
  },
  {
    id: "lab-psos", courseId: "fif", section: "fif-6",
    title: "Set up a Payment Source, Obligation and Split",
    goal: "Build the money-management chain and watch it act at COB.",
    app: "EB.ALERT.REQUEST (source) · EM.PS.OBLIGATION.INPUT (obligation) · EM.PS.PAYMENT.SPLIT (split)",
    menu: "All three are set up from the customer's SCV",
    prereq: "An authorised customer with an account; EVENT (Business Events) service running in AUTO.",
    steps: [
      { do: "From the SCV create a Payment Source — what incoming money triggers a split (e.g. a salary credit).", expect: "Source recorded via EB.ALERT.REQUEST." },
      { do: "Create a Payment Obligation — what the money is for, with an amount type (User Defined / Track Loan Repayment / Track Loan Arrears) and a next run date.", expect: "Obligation saved via EM.PS.OBLIGATION.INPUT." },
      { do: "Create a Payment Split — how incoming funds are divided across obligations. Commit and authorise all three.", expect: "Split saved via EM.PS.PAYMENT.SPLIT." },
      { do: "Credit the account with an incoming payment, then run COB (or wait for the obligation's next run date).", expect: "At COB the funds are split per the obligation; a split to an inactive obligation is skipped." },
    ],
    verify: "After COB the incoming payment has been divided per your split — check the obligation balances.",
    related: ["psos", "paymentsource", "paymentobligation", "paymentsplit", "psprocessing"],
  },
  {
    id: "lab-dividend", courseId: "fif", section: "fif-5",
    title: "Run the Dividend Runner",
    goal: "Simulate then post a dividend and read the results table.",
    app: "EM.DIVIDEND.RUN", menu: "Dividend Processing > Dividend Runner",
    prereq: "Savings accounts with balance history and DVND.CALC = Yes.",
    steps: [
      { do: "Confirm eligible accounts have DVND.CALC = Yes.", expect: "Accounts with DVND.CALC = No are excluded from the run." },
      { do: "Open the Dividend Runner, set the period and the Rate, and run in Simulation mode.", expect: "Per account: dividend = (Dividend Points ÷ Days in Year) × Rate, points from the average daily balance above the minimum." },
      { do: "Review the simulation in EM.DIVIDEND.RUN.DETAILS.", expect: "Per-account points, balance and dividend amount." },
      { do: "If correct, run in Post mode.", expect: "Dividends posted to accounts and a note issued to each member." },
    ],
    verify: "EM.DIVIDEND.RUN.DETAILS shows the posted dividends and account balances have increased.",
    related: ["dividend", "divrunner", "divformula", "divminbal", "divconfig"],
  },
  {
    id: "lab-bulkao", courseId: "fif", section: "fif-3",
    title: "Bulk account-officer transfer via file upload",
    goal: "Move a portfolio between officers using the DFE file-upload path.",
    app: "File Upload (DFE) + SG.BA.CHANGE.DAO", menu: "Task Management / File Upload",
    prereq: "TM.PROCESS and EVENT services in AUTO; a file of customers + the new officer.",
    steps: [
      { do: "Check the column-to-field mapping in DFE.MAPPING matches your file's columns.", expect: "Each file column maps to the right system field." },
      { do: "Upload the file.", expect: "One record per row lands in INAU (input, unauthorised)." },
      { do: "Authorise the bulk change.", expect: "The SG.BA.CHANGE.DAO service auto-starts and reassigns the portfolios." },
    ],
    verify: "The selected customers now show the new Account Officer.",
    related: ["dfe", "fileuploadproc", "fileuploadtables", "bulkao"],
  },
];

// Screenshot per concept, cropped from the course slide decks (public/slides/<course>/).
const SLIDE_IMG = {
  rbhp: "rbhp", allinone: "allinone", scv: "scv", sgv: "sgv", worklist: "worklist",
  landingpages: "landingpages", roles: "roles",
  custcentric: "custcentric", custrec: "custrec", relation: "relation", dao: "dao", prospect: "prospect",
  custtabs: "custtabs", shadowlimit: "shadowlimit", nonindiv: "nonindiv", scvtabs: "scvtabs", bankcust: "bankcust",
  taskmgmt: "taskmgmt", taskstruct: "taskstruct", taskactions: "taskactions", notifications: "notifications",
  taskdelegates: "taskdelegates", taskservices: "taskservices", dfe: "dfe", fileuploadtables: "fileuploadtables",
  fileuploadproc: "fileuploadproc", bulkao: "bulkao",
  groupapp: "groupapp", grouptype: "grouptype", grouplimits: "grouplimits", groupparams: "groupparams",
  creategroup: "creategroup", groupmaint: "groupmaint", centre: "centre",
  divformula: "divformula", divminbal: "divminbal", divconfig: "divconfig", divrunner: "divrunner",
  paymenttypes: "paymenttypes", obligationaction: "obligationaction", obligationtype: "obligationtype",
  paymentsource: "paymentsource", paymentobligation: "paymentobligation", paymentsplit: "paymentsplit",
  psprocessing: "psprocessing",
  // Course 2 — AA Lending Foundation Part 1
  aa2overview: "aa2overview", aa2repaystruct: "aa2repaystruct", aa2repaytypes: "aa2repaytypes",
  aa2ratetypes: "aa2ratetypes", aa2prodline: "aa2prodline", aa2prodgroup: "aa2prodgroup",
  aa2product: "aa2product", aa2buscomp: "aa2buscomp", aa2prodcond: "aa2prodcond",
  aa2prodvsarr: "aa2prodvsarr", aa2catalog: "aa2catalog", aa2ids: "aa2ids", aa2roles: "aa2roles",
  aa2commit: "aa2commit", aa2repayfreq: "aa2repayfreq", aa2settle: "aa2settle",
  aa2properties: "aa2properties", aa2create: "aa2create", aa2overrides: "aa2overrides",
  aa2authorise: "aa2authorise", aa2findloan: "aa2findloan", aa2ovbasic: "aa2ovbasic",
  aa2ovconditions: "aa2ovconditions", aa2ovfinancial: "aa2ovfinancial", aa2accrued: "aa2accrued",
  aa2additional: "aa2additional",
  // Course 3 — AA Lending Foundation Part 2
  aa3deps: "aa3deps", aa3ratetypes: "aa3ratetypes", aa3floating: "aa3floating",
  aa3periodic: "aa3periodic", aa3rfr: "aa3rfr", aa3daybasis: "aa3daybasis",
  aa3schedules: "aa3schedules", aa3tiers: "aa3tiers", aa3charges: "aa3charges",
  aa3overdue: "aa3overdue", aa3commitment: "aa3commitment", aa3activity: "aa3activity",
  aa3disburse: "aa3disburse", aa3limits: "aa3limits", aa3suspend: "aa3suspend",
  aa3amend: "aa3amend", aa3holiday: "aa3holiday", aa3hands: "aa3hands",
  aa3sim: "aa3sim", aa3reverse: "aa3reverse",
  // Course 4 — AA Implementation Part 1
  aai1silo: "aai1silo", aai1propclass: "aai1propclass", aai1property: "aai1property",
  aai1prodcond: "aai1prodcond", aai1hierarchy: "aai1hierarchy", aai1inherit: "aai1inherit",
  aai1acctcontract: "aai1acctcontract", aai1arr: "aai1arr", aai1builder: "aai1builder",
  aai1proof: "aai1proof", aai1variation: "aai1variation", aai1proptype: "aai1proptype",
  // Course 5 — AA Implementation Part 2
  aai2storage: "aai2storage", aai2altid: "aai2altid", aai2actclass: "aai2actclass",
  aai2rebuild: "aai2rebuild", aai2launch: "aai2launch", aai2reverse: "aai2reverse",
  aai2company: "aai2company", aai2alerts: "aai2alerts", aai2external: "aai2external",
  aai2sim: "aai2sim",
  // Course 6 — AA Common Building Blocks Part 1
  cb1overview: "cb1overview", cb1deps: "cb1deps", cb1daybasis: "cb1daybasis", cb1currency: "cb1currency",
  cb1tables: "cb1tables", cb1propclass: "cb1propclass", cb1property: "cb1property", cb1prodcond: "cb1prodcond",
  cb1negotiable: "cb1negotiable", cb1attropt: "cb1attropt", cb1nrrules: "cb1nrrules",
  cb1customer: "cb1customer", cb1custrole: "cb1custrole", cb1benefowner: "cb1benefowner", cb1relpricing: "cb1relpricing",
  cb1eligibility: "cb1eligibility", cb1elrules: "cb1elrules", cb1variation: "cb1variation", cb1pricing: "cb1pricing",
  cb1channelpricing: "cb1channelpricing",
  cb1officers: "cb1officers", cb1actmap: "cb1actmap", cb1consol: "cb1consol",
  // Course 7 — AA Common Building Blocks Part 2
  cb2acctevents: "cb2acctevents", cb2balances: "cb2balances", cb2baltype: "cb2baltype", cb2balprefix: "cb2balprefix",
  cb2acctpc: "cb2acctpc", cb2acctrule: "cb2acctrule", cb2ncfc: "cb2ncfc", cb2suspense: "cb2suspense", cb2txnentry: "cb2txnentry",
  cb2balmaint: "cb2balmaint", cb2capture: "cb2capture", cb2adjust: "cb2adjust", cb2hisbalance: "cb2hisbalance",
  cb2narrative: "cb2narrative", cb2narrparam: "cb2narrparam", cb2narrformat: "cb2narrformat", cb2printstmt: "cb2printstmt",
  cb2cob: "cb2cob", cb2decision: "cb2decision", cb2dlm: "cb2dlm", cb2archive: "cb2archive", cb2nolog: "cb2nolog",
  // Course 8 — AA Lending Product Building Part 1
  lpb1termamt: "lpb1termamt", lpb1commit: "lpb1commit", lpb1maturity: "lpb1maturity", lpb1revolving: "lpb1revolving", lpb1tranche: "lpb1tranche",
  lpb1account: "lpb1account", lpb1dormancy: "lpb1dormancy", lpb1basedate: "lpb1basedate", lpb1posting: "lpb1posting",
  lpb1limit: "lpb1limit", lpb1limitref: "lpb1limitref", lpb1netting: "lpb1netting",
  lpb1interest: "lpb1interest", lpb1inttypes: "lpb1inttypes", lpb1rfr: "lpb1rfr", lpb1tiered: "lpb1tiered",
  lpb1rateadj: "lpb1rateadj", lpb1linked: "lpb1linked",
  lpb1tax: "lpb1tax", lpb1taxsplit: "lpb1taxsplit",
  lpb1activitycharge: "lpb1activitycharge", lpb1charge: "lpb1charge", lpb1chargeoverride: "lpb1chargeoverride",
  lpb1periodiccharge: "lpb1periodiccharge", lpb1triggercharge: "lpb1triggercharge",
  lpb1payschedule: "lpb1payschedule", lpb1paytypes: "lpb1paytypes", lpb1payfreq: "lpb1payfreq",
  lpb1recalc: "lpb1recalc", lpb1holidays: "lpb1holidays",
  lpb1settlement: "lpb1settlement", lpb1receiving: "lpb1receiving", lpb1directdebit: "lpb1directdebit", lpb1offset: "lpb1offset",
  // Course 9 — AA Lending Product Building Part 2
  lpb2payrules: "lpb2payrules", lpb2payruletype: "lpb2payruletype", lpb2remainder: "lpb2remainder", lpb2makedue: "lpb2makedue",
  lpb2payout: "lpb2payout", lpb2overdue: "lpb2overdue", lpb2ageing: "lpb2ageing", lpb2chaser: "lpb2chaser", lpb2suspend: "lpb2suspend",
  lpb2restructure: "lpb2restructure", lpb2technicalloan: "lpb2technicalloan", lpb2rulestatus: "lpb2rulestatus",
  lpb2chargeoff: "lpb2chargeoff", lpb2coallocation: "lpb2coallocation",
  lpb2constraint: "lpb2constraint",
  lpb2periodicclass: "lpb2periodicclass", lpb2periodicattr: "lpb2periodicattr", lpb2periodicrules: "lpb2periodicrules", lpb2breakcharges: "lpb2breakcharges",
  lpb2actrestrict: "lpb2actrestrict", lpb2restricttypes: "lpb2restricttypes", lpb2qualifier: "lpb2qualifier",
  lpb2changeproduct: "lpb2changeproduct", lpb2rollover: "lpb2rollover", lpb2payoff: "lpb2payoff", lpb2payoffstmt: "lpb2payoffstmt",
  lpb2closure: "lpb2closure", lpb2closuretype: "lpb2closuretype", lpb2cooling: "lpb2cooling",
  lpb2reporting: "lpb2reporting", lpb2position: "lpb2position", lpb2apr: "lpb2apr",
  lpb2prodline: "lpb2prodline", lpb2prodgroup: "lpb2prodgroup", lpb2designer: "lpb2designer",
  lpb2proofpublish: "lpb2proofpublish", lpb2catalog: "lpb2catalog",
};
const slideImgSrc = (conceptId) => {
  const f = SLIDE_IMG[conceptId];
  const course = conceptCourse[conceptId];
  return f && course ? `/slides/${course}/${f}.jpg` : null;
};

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });

const COURSES = [
  {
    id: "fif",
    code: "TR1PRFIF",
    title: "Transact Financial Inclusion Foundation",
    description: "Role-based delivery, the customer record, operations, group lending, dividends and payment obligations — full course depth.",
    sections: [
      {
        id: "fif-1", title: "Introduction & Role-Based Home Pages",
        description: "How Financial Inclusion delivers each user a home page tailored to their job.",
        concepts: ["rbhp", "allinone", "ussp", "scv", "sgv", "worklist", "landingpages", "roles"],
        quiz: [
          q("What is a Role-Based Home Page (RBHP)?", ["A page each user builds from scratch", "A page predefined by Temenos giving a user single-screen access to their role's functions", "A report of user logins", "The customer's online banking portal"], 1, "An RBHP is predefined by Temenos per role, so a user reaches the functions relevant to them on one screen."),
          q("Which page is the widest catch-all?", ["Teller", "All-in-One", "Branch Manager", "System Admin"], 1, "The All-in-One page has the broadest set of applications; role pages are trimmed versions of it."),
          q("What controls which applications a user can navigate to?", ["The All-in-One page", "The User Security Profile (USSP)", "The mnemonic", "The RELATION table"], 1, "The USSP is the access layer; edit it with care because it restricts real users."),
          q("The Work List of pending items (e.g. unauthorised records) is based on which enquiry?", ["RELATION", "EXCEPTION", "DIVIDEND", "AGENCY"], 1, "The Work List is driven by the EXCEPTION enquiry."),
          q("A user needs one customer's accounts, statements and relationships in one place. Where do they go?", ["EXCEPTION enquiry", "Single Customer View (SCV)", "System Parameters", "Head Teller"], 1, "The SCV is the 360° customer screen."),
          q("Role pages relate to the All-in-One page how?", ["Role pages add extra applications on top", "Role pages are trimmed-down versions of the All-in-One page", "They are unrelated", "The All-in-One page is per customer"], 1, "Every role page is a cut-down view of the All-in-One page."),
          q("Who defines the content of a Role-Based Home Page?", ["Each user, from scratch", "Temenos, predefined per role", "The customer", "The COB batch"], 1, "RBHPs ship predefined by Temenos for each role."),
          q("The Single Group View (SGV) shows…", ["One customer's 360° view", "A lending group's members, meetings, limits and transfers", "Pending authorisations", "The COB schedule"], 1, "The SGV is the group equivalent of the SCV."),
          q("Editing the User Security Profile (USSP) is risky because…", ["It changes interest rates", "It restricts what real users can access", "It deletes customers", "It reruns COB"], 1, "The USSP is a live access-control layer for real users."),
          q("The Work List lets a user…", ["Only view pending items", "Click through and action pending items such as unauthorised records", "Change their own role", "Post dividends"], 1, "Items in the Work List are actionable, not just visible."),
        ],
      },
      {
        id: "fif-2", title: "Customer",
        description: "The core, customer-centric record; IDs, tabs, relationships, officers and bank customers.",
        concepts: ["custrec", "custcentric", "counterparty", "relation", "dao", "prospect", "custid", "mnemonic", "custtabs", "autofields", "shadowlimit", "nonindiv", "scvtabs", "bankcust"],
        quiz: [
          q("Once authorised, a customer record can be…", ["reversed", "amended but not reversed", "deleted", "merged automatically"], 1, "It can be amended anytime but never reversed."),
          q("You link a husband and wife in RELATION. The reverse relationship…", ["must be entered manually", "auto-defaults", "is not stored", "needs a new customer"], 1, "Only one side needs setup; the reverse auto-defaults."),
          q("Why is the Account Officer (DAO) defaulted onto all transactions?", ["to speed login", "to enable MIS at officer level", "to set interest rates", "to generate the mnemonic"], 1, "It enables management information by officer."),
          q("The mnemonic is stored in…", ["CUSTOMER only", "MNEMONIC.CUSTOMER", "RELATION", "COMPANY"], 1, "The mnemonic→ID link lives in MNEMONIC.CUSTOMER."),
          q("A customer is flagged as a BANK using…", ["a mnemonic", "Sector 8001 in ACCOUNT.CLASS", "the RELATION table", "DVND.CALC"], 1, "Sector 8001 in ACCOUNT.CLASS marks a customer as a bank, affecting payment processing."),
          q("The Customer ID length is…", ["exactly 6 digits", "7–10 digits, can be auto-generated", "always 12 digits", "alphabetic"], 1, "The numeric ID is 7–10 digits and can be auto-generated."),
          q("The customer record is best described as…", ["Account-centric", "Customer-centric — one record supporting many products", "Transaction-centric", "Branch-centric"], 1, "Financial Inclusion is built around a single customer-centric record."),
          q("A prospect is…", ["An authorised customer", "A potential customer captured before full onboarding", "A blocked customer", "A bank (Sector 8001) customer"], 1, "Prospects are captured early and converted to full customers later."),
          q("A non-individual (company) customer differs by capturing…", ["No mnemonic", "Incorporation / registration details instead of personal ones", "No address", "No account officer"], 1, "Non-individual customers record registration data rather than personal data."),
          q("The Sector field on the customer…", ["Sets the mnemonic", "Drives downstream processing and classification", "Is optional and unused", "Is the account officer"], 1, "Sector feeds reporting and downstream processing rules."),
          q("A customer flagged as a BANK (Sector 8001) affects…", ["Login speed", "Payment processing behaviour", "The mnemonic format", "Dividend points"], 1, "Bank customers are treated differently in payment processing."),
        ],
      },
      {
        id: "fif-3", title: "Task Management, File Upload & AO Transfer",
        description: "Bringing work to the user, bulk file upload via the DFE, and moving portfolios between officers.",
        concepts: ["taskmgmt", "taskstruct", "taskactions", "notifications", "taskdelegates", "taskservices", "dfe", "fileuploadtables", "fileuploadproc", "bulkao"],
        quiz: [
          q("The three task actions are…", ["Open / Close / Print", "Execute / Reassign / View", "Create / Delete / Merge", "Approve / Reject / Hold"], 1, "Execute runs it, Reassign delegates, View inspects."),
          q("File Upload is built on which framework?", ["the Delivery module", "the Data Formatting Engine (DFE)", "the EXCEPTION enquiry", "RELATION"], 1, "File Upload runs on the DFE; column-to-field mapping lives in DFE.MAPPING."),
          q("Uploaded file records first land in which status?", ["Authorised", "INAU (input, unauthorised)", "Current", "Reversed"], 1, "They await authorisation in INAU."),
          q("Which service auto-starts on authorising a bulk account-officer change?", ["TM.PROCESS", "SG.BA.CHANGE.DAO", "EVENT", "BNK/EM.DFE.FILE.PROCESS"], 1, "SG.BA.CHANGE.DAO runs the portfolio transfer and starts automatically on authorisation."),
          q("For full task functionality, which must run in AUTO?", ["only DFE", "TM.PROCESS and EVENT", "only SG.BA.CHANGE.DAO", "none"], 1, "TM.PROCESS and the EVENT service must run in AUTO."),
          q("Task Management brings work to the user by…", ["Emailing them", "Creating tasks with actions in their work list", "Printing reports", "Running COB"], 1, "Tasks land in the user's list with Execute / Reassign / View actions."),
          q("DFE stands for…", ["Data Formatting Engine", "Delivery File Export", "Dividend Formula Engine", "Direct Feed Entry"], 0, "The Data Formatting Engine underpins File Upload."),
          q("To delegate a task to another user you…", ["Execute it", "Reassign it", "View it", "Delete it"], 1, "Reassign hands the task to another user."),
          q("SG.BA.CHANGE.DAO…", ["Changes the dividend rate", "Reassigns customer portfolios to a new account officer", "Authorises customers in bulk", "Maps file columns"], 1, "It performs the portfolio transfer on authorisation."),
        ],
      },
      {
        id: "fif-4", title: "Group Management",
        description: "Group lending, group types and limits, creation, maintenance and centres.",
        concepts: ["grouplending", "groupapp", "grouptype", "grouplimits", "groupparams", "creategroup", "groupmaint", "centre", "groupenq"],
        quiz: [
          q("In group lending, what usually replaces collateral?", ["a cash deposit equal to the loan", "mutual guarantee among members", "a government grant", "a second mortgage"], 1, "Members guarantee each other's repayment."),
          q("What is a Centre?", ["a single very large loan", "a grouping of several small groups that meet together", "a type of account", "a parameter table"], 1, "A centre is a group of groups (up to ~10–12)."),
          q("A Credit Block on a member updates which customer field?", ["DVND.CALC", "BLOCKED", "MULTI.GROUPS", "MNEMONIC"], 1, "Credit Block sets the BLOCKED field on the customer."),
          q("How many groups can a single group link to as a centre?", ["unlimited", "only one", "up to three", "none"], 1, "A group can link to only one centre."),
          q("Group lending typically needs…", ["1–2 members", "5+ members with ~3 months saving discipline", "50 members minimum", "no members"], 1, "Five or more members, saving discipline ~3 months, mutual guarantee."),
          q("The Group Type controls…", ["Only the group name", "Limits, product eligibility and meeting rules", "The account officer", "The dividend rate"], 1, "Group Type is the parameter that shapes the group's behaviour."),
          q("A member of a lending group must…", ["Be a prospect", "Already exist as an authorised customer", "Belong to no other group", "Be a company"], 1, "Members are added by customer ID and must be authorised customers first."),
          q("Mutual guarantee means…", ["The bank guarantees each member", "Members guarantee each other's repayment", "A government grant covers default", "No guarantee is needed"], 1, "Peer guarantee replaces traditional collateral."),
          q("The Single Group View does NOT show…", ["Members", "Meeting details", "Available limit", "An individual customer's full statement history"], 3, "The SGV is group-level; individual statements live in the SCV."),
        ],
      },
      {
        id: "fif-5", title: "Dividend Processing",
        description: "Credit-union profit share: the formula, points, configuration and running the posting.",
        concepts: ["dividend", "divfeatures", "divformula", "divminbal", "divconfig", "divrunner"],
        quiz: [
          q("How is a dividend calculated?", ["a flat amount per member", "(Dividend Points ÷ Days in Year) × Rate", "a fixed % of the loan", "Points × number of members"], 1, "Points come from the average daily balance; dividend = (Points ÷ Days in Year) × Rate."),
          q("Setting DVND.CALC = No on an account means…", ["tax is applied", "dividends are not calculated", "the account is closed", "points double"], 1, "DVND.CALC=No excludes the account from dividend calculation."),
          q("Dividend points use which method?", ["closing balance", "average daily balance (above a minimum)", "opening balance", "highest balance"], 1, "Points accrue from the average daily balance, subject to a minimum."),
          q("Which application runs the simulation and posting?", ["Dividend Runner", "Task Manager", "DFE", "Find Loan"], 0, "The Dividend Runner simulates, then Posts; outcomes are in EM.DIVIDEND.RUN.DETAILS."),
          q("Simulation mode in the Dividend Runner…", ["Posts dividends immediately", "Calculates results without posting them", "Closes the accounts", "Is not available"], 1, "Simulation lets you review figures before running Post."),
          q("Dividend points accrue on balance…", ["Below the minimum", "Above the configured minimum balance", "At month end only", "On the loan account"], 1, "Only the average daily balance above the minimum earns points."),
          q("On Post, each member receives…", ["A new account", "A note / advice of the dividend", "A loan", "Nothing"], 1, "Posting issues an advice to each member."),
          q("'Days in Year' in the formula is…", ["The account's age", "The day-basis divisor for the period", "The number of members", "The COB count"], 1, "It is the day-count divisor applied to the points."),
        ],
      },
      {
        id: "fif-6", title: "Payment Obligations & Splits",
        description: "The money-management chain from incoming sources to obligations and splits.",
        concepts: ["psos", "paymenttypes", "obligationaction", "obligationtype", "paymentsource", "paymentobligation", "paymentsplit", "psprocessing"],
        quiz: [
          q("What is the correct chain?", ["Split → Source → Obligation", "Payment Source → Obligation → Split", "Obligation → Split → Source", "Source → Split → Obligation"], 1, "Money in (source) is qualified, then divided (split) across what it's for (obligations)."),
          q("Where are sources, obligations and splits set up?", ["System Parameters", "the Single Customer View (SCV)", "the Teller page", "RELATION"], 1, "All three are configured from the customer's SCV."),
          q("Obligation amount types include…", ["Fixed only", "User Defined / Track Loan Repayment / Track Loan Arrears", "Percentage only", "None"], 1, "Amount can be user-defined or track loan repayment/arrears."),
          q("Obligation actions are processed…", ["instantly online", "during COB on the next run date", "only at year-end", "never automatically"], 1, "Actions run at COB based on the obligation's next run date; the EVENT service must be AUTO."),
          q("A payment split to an inactive obligation is…", ["forced through", "skipped", "queued forever", "converted to a source"], 1, "Splits to inactive obligations are skipped."),
          q("A Payment Source represents…", ["What the money is for", "The incoming money that triggers a split", "The split percentages", "The COB date"], 1, "The source is the qualifying inbound credit."),
          q("A Payment Obligation represents…", ["Incoming money", "What the money is for, e.g. a loan repayment", "The customer's address", "A relationship"], 1, "The obligation is the target the money is applied to."),
          q("'Track Loan Repayment' as an amount type means…", ["A fixed amount each run", "The obligation amount follows the loan's due repayment", "Interest only", "The full loan balance"], 1, "The obligation amount is derived from the loan's repayment due."),
          q("For payment-split processing to run, which service must be AUTO?", ["TM.PROCESS only", "EVENT (Business Events)", "SG.BA.CHANGE.DAO", "None"], 1, "The EVENT service drives obligation actions at COB."),
        ],
      },
    ],
    assessment: [
      q("RBHP stands for…", ["Rule-Based Home Portal", "Role-Based Home Page", "Retail Banking Home Page", "Role-Based Hierarchy Profile"], 1, "Role-Based Home Page — predefined by Temenos per role."),
      q("The 360° view of one customer is the…", ["Single Group View", "Single Customer View", "All-in-One page", "Work List"], 1, "SCV = Single Customer View."),
      q("A customer record, once authorised, can be…", ["reversed", "deleted", "amended but not reversed", "merged automatically"], 2, "Amend anytime, never reverse."),
      q("The mnemonic is stored in…", ["CUSTOMER", "MNEMONIC.CUSTOMER", "RELATION", "DFE.MAPPING"], 1, "MNEMONIC.CUSTOMER holds the mnemonic→ID link."),
      q("Uploaded file records first appear in status…", ["Authorised", "INAU", "Current", "Reversed"], 1, "Input, unauthorised — awaiting authorisation."),
      q("Column-to-field mapping for uploads lives in…", ["FILE.UPLOAD.PARAM", "DFE.MAPPING", "EB.FILE.UPLOAD.TYPE", "EM.TM.PARAMETER"], 1, "DFE.MAPPING maps file columns to system fields."),
      q("Bulk account-officer transfer uses service…", ["TM.PROCESS", "SG.BA.CHANGE.DAO", "EVENT", "BNK/EM.DIV.PROCESS.DIVIDENDS"], 1, "SG.BA.CHANGE.DAO auto-starts on authorisation."),
      q("Group lending usually needs…", ["1–2 members", "5+ members with ~3 months saving discipline", "50 members", "no members"], 1, "Five or more, saving discipline, mutual guarantee."),
      q("A member Credit Block updates…", ["DVND.CALC", "the BLOCKED field on the customer", "MNEMONIC.CUSTOMER", "the RELATION table"], 1, "Credit Block sets BLOCKED on the customer."),
      q("Dividend = …", ["Points × members", "(Points ÷ Days in Year) × Rate", "flat per member", "% of the loan"], 1, "Average-daily-balance points drive the formula."),
      q("Payment obligations are set up from…", ["the Teller page", "the SCV", "System Admin", "the EXCEPTION enquiry"], 1, "From the Single Customer View."),
      q("The EVENT service (Business Events) must run in AUTO to…", ["post dividends", "qualify payment sources and run split processing", "authorise customers", "generate mnemonics"], 1, "Business Events qualifies sources; actions then run at COB."),
      q("Every role page is…", ["built by the user", "a trimmed-down version of the All-in-One page", "stored in RELATION", "generated at COB"], 1, "Role pages are cut-down views of the All-in-One page."),
      q("The 360° view of a lending group is the…", ["SCV", "SGV (Single Group View)", "Work List", "All-in-One page"], 1, "SGV shows members, meetings, limits and transfers."),
      q("A prospect is…", ["an authorised customer", "a potential customer captured before onboarding", "a blocked customer", "a bank customer"], 1, "Prospects convert to full customers later."),
      q("The Account Officer (DAO) defaults onto transactions to enable…", ["faster login", "MIS / reporting by officer", "interest calculation", "mnemonic generation"], 1, "It drives management information at officer level."),
      q("Group members must…", ["be prospects", "already be authorised customers", "belong to no other group", "be non-individuals"], 1, "Members are added by customer ID."),
      q("Dividend simulation mode…", ["posts immediately", "calculates without posting", "closes accounts", "is unavailable"], 1, "Review figures before Post."),
      q("The payment-management chain is…", ["Split → Source → Obligation", "Source → Obligation → Split", "Obligation → Source → Split", "Source → Split → Obligation"], 1, "Money in (source) → what it's for (obligation) → how it's divided (split)."),
    ],
  },
  {
    id: "aalf1",
    code: "TR1PRAAL",
    title: "AA Lending Foundation — Part 1",
    description: "How a lending product is structured, how an arrangement is created and authorised, and how to read it — full course depth.",
    sections: [
      {
        id: "aalf1-1", title: "Basics of the Lending Product Line",
        description: "Arrangement Architecture, the product hierarchy, reusable components and product-vs-arrangement.",
        concepts: ["aa2overview", "aa2repaystruct", "aa2repaytypes", "aa2ratetypes", "aa2prodline", "aa2prodgroup", "aa2product", "aa2buscomp", "aa2prodcond", "aa2prodvsarr", "aa2catalog"],
        quiz: [
          q("Who defines the Product Line?", ["the client", "Temenos", "the branch manager", "the customer"], 1, "Temenos owns the product line; clients define groups and products."),
          q("A Product sold to a customer becomes a(n)…", ["Product Group", "Arrangement", "Business Component", "Product Line"], 1, "An arrangement is an instance of a product for a customer."),
          q("Values assigned to a component's fields at product level are…", ["Arrangement Conditions", "Product Conditions", "Business Components", "Properties"], 1, "Product Conditions are what make one product differ from another."),
          q("Constant repayment keeps which amount level?", ["the principal portion", "the instalment (total payment)", "the interest portion", "the charges"], 1, "Constant = level instalment; Linear keeps the principal level."),
          q("Bullet repayment means…", ["equal instalments throughout", "interest during the loan, principal as a lump at the end", "no interest at all", "principal first, interest last"], 1, "Bullet repays principal as one lump at maturity."),
        ],
      },
      {
        id: "aalf1-2", title: "Creating & Authorising Lending Arrangements",
        description: "The three IDs, customer roles, commitment/term, settlement, and the create-authorise flow.",
        concepts: ["aa2ids", "aa2roles", "aa2commit", "aa2repayfreq", "aa2settle", "aa2properties", "aa2create", "aa2overrides", "aa2authorise", "aa2recordstatus"],
        quiz: [
          q("Which ID is generated when the activity is validated?", ["Activity ID (AAACT…)", "Arrangement ID (AA…)", "Account ID", "Customer ID"], 1, "AAACT… is at attempt; AA… (Arrangement ID) is at validation; plus an Account ID."),
          q("The initial arrangement ID before generation is…", ["AA…", "AAACT…", "NEW", "0000"], 2, "It starts as NEW, then IDs are generated."),
          q("Customer roles on an arrangement are held in…", ["CUSTOMER", "AA.CUSTOMER.ROLE", "RELATION", "AA.ARRANGEMENT"], 1, "AA.CUSTOMER.ROLE holds Applicant/Guarantor/Beneficiary; the first beneficial owner drives accounting/tax/limits."),
          q("The Pay Out account is where…", ["repayments are collected", "the loan is disbursed to", "charges are booked", "interest accrues"], 1, "Pay Out = disbursed-to; Pay In = repayments-from."),
          q("Commitment can be entered using which shortcuts?", ["K and B", "T (thousands) and M (millions)", "H and G", "none"], 1, "T = thousands, M = millions; also, either term or maturity is required."),
          q("After accepting overrides on commit, the arrangement is…", ["Current", "Unauthorised", "Closed", "Simulated"], 1, "It's Unauthorised until a second user authorises it."),
          q("A record saved as a draft, not yet submitted to the validation queue, is…", ["INAU", "IHLD", "LIVE", "RNAU"], 1, "IHLD = Input Held — a half-filled draft kept aside."),
          q("A commit that triggers an unaccepted policy warning (e.g. 'Maximum discount exceeded') puts the record in…", ["INAO", "IHLD", "LIVE", "INAU"], 0, "INAO = Input Authorised - Overrides: blocked until the override is accepted."),
          q("An operator commits an arrangement and gets 'Txn Complete'. Its status is now…", ["IHLD", "LIVE", "INAU", "RNAU"], 2, "INAU = fully committed, waiting for a supervisor to authorise."),
          q("An operator reverses a live record made by mistake; while pending supervisor sign-off it is…", ["RNAU", "INAO", "IHLD", "LIVE"], 0, "RNAU = Reverse Unauthorised — the reversal itself needs authorising."),
          q("A record that has passed all checks, had overrides accepted, and been authorised is…", ["INAU", "IHLD", "LIVE", "INAO"], 2, "LIVE = active in production — schedules run, interest accrues, GL entries post."),
        ],
      },
      {
        id: "aalf1-3", title: "Lending Arrangement Overview Enquiries",
        description: "Finding a loan and reading every section of the Arrangement Overview.",
        concepts: ["aa2findloan", "aa2ovbasic", "aa2ovconditions", "aa2ovfinancial", "aa2accrued", "aa2additional"],
        quiz: [
          q("The Arrangement Overview's payment schedule is generated…", ["and stored permanently", "at runtime (a Nofile enquiry)", "only at COB", "by the customer"], 1, "The schedule is a runtime Nofile enquiry."),
          q("'Available Commitment' means…", ["the original approved amount", "approved amount minus what's been drawn", "total repayments made", "the penalty balance"], 1, "It's the undrawn portion of the commitment."),
          q("A Request Payoff bill includes…", ["only the principal", "the total outstanding plus remaining accrued interest", "charges only", "nothing extra"], 1, "Payoff includes remaining accrued interest to close the contract."),
          q("SWIFT messages shown under Additional Details include…", ["MT101 only", "MT320/330/350/935", "none", "only emails"], 1, "Loan confirmations, rate changes and advices use these MT types."),
          q("Loan statuses in Find Loan include…", ["only Open/Closed", "Not Disbursed / Current / Dormant / Delinquent", "Draft only", "Simulated only"], 1, "These statuses show how far along and how healthy the loan is."),
        ],
      },
    ],
    assessment: [
      q("The AA hierarchy is…", ["Product → Group → Line", "Product Line → Group → Product", "Group → Line → Product", "Line → Product → Group"], 1, "Line (Temenos) → Group (client) → Product (client)."),
      q("A negotiated value at arrangement level is a(n)…", ["Product Condition", "Arrangement Condition", "Business Component", "Property Class"], 1, "It becomes an Arrangement Condition."),
      q("Linear repayment keeps level the…", ["instalment", "principal portion", "interest", "charges"], 1, "Linear = level principal; Constant = level instalment."),
      q("The three auto-generated IDs are…", ["Customer/Account/Loan", "Activity/Arrangement/Account", "NEW/OLD/FINAL", "Line/Group/Product"], 1, "Activity ID (AAACT…), Arrangement ID (AA…), Account ID."),
      q("AA ID dates use which format?", ["ISO 8601", "Julian (YYDDD)", "Unix time", "DD/MM/YYYY"], 1, "AA IDs embed a Julian YYDDD date."),
      q("Auto-disbursement on authorisation makes the status…", ["Not Disbursed", "Current", "Dormant", "Pending Closure"], 1, "It becomes Current once disbursed."),
      q("An arrangement's body is…", ["a single record", "a set of arrangement conditions, one per property", "just the account", "only the customer record"], 1, "It's spread across property records; use composite screens."),
      q("The Account Officer on an arrangement defaults from…", ["the branch", "the ACCOUNT.OFFICER on the CUSTOMER record", "the product only", "nowhere"], 1, "If not entered, it defaults from the customer record."),
      q("You authorise a new loan via…", ["System Admin", "Find Loan → Unauthorised → Approve", "the Teller page", "the Product Catalog"], 1, "Retail Operations → Find Loan → Unauthorised → Approve."),
      q("The payment schedule enquiry is…", ["stored in a file", "generated at runtime (Nofile)", "emailed nightly", "manual"], 1, "It's a runtime Nofile enquiry."),
    ],
  },
  {
    id: "aalf2",
    code: "TR2PRAAL",
    title: "AA Lending Foundation — Part 2",
    description: "Deep mechanics: rate configuration, lending concepts, financial activities, amendments, simulation and reverse & replay.",
    sections: [
      {
        id: "aalf2-1", title: "Dependencies & Interest Rate Types",
        description: "What AA depends on, the four rate types and where each is stored, and day-count basis.",
        concepts: ["aa3deps", "aa3ratetypes", "aa3floating", "aa3periodic", "aa3rfr", "aa3daybasis"],
        quiz: [
          q("AA is account-based, meaning…", ["accounts can be deleted freely", "opening an arrangement auto-creates a loan account", "no account is created", "interest is optional"], 1, "The auto-created loan account holds the loan's balances."),
          q("Floating rates are stored in…", ["PERIODIC.INTEREST", "BASIC.INTEREST", "AA.PRODUCT", "EB.LOOKUP"], 1, "Floating lives in BASIC.INTEREST, keyed 1+currency+date via FLOATING.INDEX."),
          q("Periodic and RFR rates both live in…", ["BASIC.INTEREST", "PERIODIC.INTEREST", "CURRENCY.MARKET", "AA.OVERDUE.STATUS"], 1, "Both periodic and risk-free rates are stored in PERIODIC.INTEREST."),
          q("Interest day basis 'A' means…", ["actual/365", "30/360", "actual/360", "special"], 1, "A = 30/360; B = actual/360; E = actual/365; S = special."),
          q("When a term doesn't match a periodic period, the system…", ["errors out", "interpolates (or NEXT/PREVIOUS/CLOSEST)", "uses zero", "waits for COB"], 1, "Interpolation options handle a non-matching term."),
        ],
      },
      {
        id: "aalf2-2", title: "Lending Concepts",
        description: "Repayment schedules, tiered rates, charges, overdue statuses and the revolving attribute.",
        concepts: ["aa3schedules", "aa3tiers", "aa3charges", "aa3overdue", "aa3commitment"],
        quiz: [
          q("A Banded interest tier applies each rate to…", ["the whole balance", "only the portion within that tier", "the first tier only", "nothing"], 1, "Banded is portion-based (no compounding); Level applies one tier's rate to the whole balance."),
          q("The overdue escalation order is…", ["DEL → GRC → NAB", "GRC → DEL → NAB", "NAB → DEL → GRC", "GRC → NAB → DEL"], 1, "Grace → Delinquent → Non-Accrual Basis."),
          q("In NAB status, interest is…", ["posted to profit as normal", "posted to a suspense account, not P&L", "waived", "doubled"], 1, "Income is suspended in non-accrual."),
          q("Overdue statuses are defined via…", ["AA.PRODUCT", "EB.LOOKUP against AA.OVERDUE.STATUS", "CURRENCY.MARKET", "DFE.MAPPING"], 1, "Codes like GRC/DEL/NAB are user-defined via EB.LOOKUP."),
          q("A revolving type of PAYMENT means…", ["repayments never restore the limit", "any principal repayment restores the available amount", "only overdue amounts restore it", "the loan can't be drawn"], 1, "PAYMENT restores on any principal repayment; REPAYMENT only on not-yet-due repayments."),
        ],
      },
      {
        id: "aalf2-3", title: "Capturing Financial Activities",
        description: "The activity concept, disbursement/repayment, limits and suspend/resume.",
        concepts: ["aa3activity", "aa3disburse", "aa3limits", "aa3suspend"],
        quiz: [
          q("Which is NOT an activity?", ["Disburse loan", "Accrue interest", "Viewing the overview", "Apply payment"], 2, "Enquiries (just viewing) are not activities."),
          q("Disbursement and repayment run through a…", ["direct debit", "Payment Order", "standing order only", "manual journal"], 1, "A Payment Order mapped to a lending activity."),
          q("A limit is named on the arrangement in…", ["DVND.CALC", "LIMIT.REFERENCE", "FLOATING.INDEX", "MNEMONIC"], 1, "LIMIT.REFERENCE links the limit; UPDATE.COMMT.LIMIT checks it at creation."),
          q("Suspending an arrangement diverts accruals to…", ["profit", "a suspense balance (e.g. ACC.LOAN.INT.SP)", "the customer", "charges"], 1, "Income posts to suspense until resumed."),
        ],
      },
      {
        id: "aalf2-4", title: "Amendment & Update Activities",
        description: "Changing a live loan where negotiable, and payment holidays.",
        concepts: ["aa3amend", "aa3holiday"],
        quiz: [
          q("An amendment (e.g. change term) is possible only if…", ["the branch approves", "the field was made negotiable at product level", "it's after COB", "the customer is a bank"], 1, "Only negotiable fields can be amended at arrangement level."),
          q("A payment holiday's shortfall can be handled by…", ["writing it off", "spreading payments, extending term, or lumping onto the final instalment", "closing the loan", "doubling interest"], 1, "Those are the recalculation methods."),
          q("Changing the customer on an arrangement…", ["needs a relationship between them", "needs no relationship, but the new customer must own any limit", "is impossible", "auto-closes the loan"], 1, "No relationship needed; any assigned limit must exist for the new customer."),
        ],
      },
      {
        id: "aalf2-5", title: "Hands-On",
        description: "The manual disbursement path and creating & attaching a limit.",
        concepts: ["aa3hands"],
        quiz: [
          q("To stop a loan auto-disbursing on creation, set…", ["Revolving=Yes", "disbursement Active=No", "DVND.CALC=No", "LIFE.ATTRIBUTE=REPLAY"], 1, "Active=No on disbursement means no auto-disburse."),
          q("Before attaching a limit to a loan you must…", ["disburse first", "create and authorise the limit", "close the loan", "run COB"], 1, "The limit must exist and be authorised, then attach via an update activity."),
        ],
      },
      {
        id: "aalf2-6", title: "Simulations & Reverse and Replay",
        description: "What-if simulation and back-dated reverse & replay.",
        concepts: ["aa3sim", "aa3reverse"],
        quiz: [
          q("A simulation stores its results in…", ["live AA.ARR tables", "SIM files", "the customer record", "the Activity Log only"], 1, "Simulations write to SIM files and don't touch live records."),
          q("Simulated arrangements are found under…", ["Authorised", "NEW OFFERS", "Pending closure", "Dormant"], 1, "Under Find Loan → NEW OFFERS; status 'Simulated'."),
          q("Reverse & Replay works by…", ["deleting the loan", "reversing back to the value date, then replaying forward", "only reversing", "only replaying"], 1, "It unwinds to the back-value date then replays forward, with accounting for both."),
          q("Reverse & Replay is enabled by…", ["DVND.CALC", "LIFE.ATTRIBUTE=REPLAY on the product line", "WHT.TAX", "REBUILD.ACTIVITIES"], 1, "Set on the product line."),
        ],
      },
    ],
    assessment: [
      q("Floating rates live in ___; Periodic/RFR live in ___.", ["PERIODIC.INTEREST / BASIC.INTEREST", "BASIC.INTEREST / PERIODIC.INTEREST", "both BASIC.INTEREST", "both PERIODIC.INTEREST"], 1, "Floating = BASIC.INTEREST; Periodic and RFR = PERIODIC.INTEREST."),
      q("Interest day basis E is…", ["30/360", "actual/360", "actual/365", "special"], 2, "E = actual/365."),
      q("Banded tiering means…", ["one rate for all", "each portion at its own rate, no compounding", "whole balance at top tier", "no interest"], 1, "Portion-by-portion pricing."),
      q("Overdue statuses escalate…", ["NAB → DEL → GRC", "GRC → DEL → NAB", "DEL → NAB → GRC", "random"], 1, "Grace → Delinquent → Non-Accrual."),
      q("In non-accrual, interest posts to…", ["profit", "a suspense account", "the customer", "charges"], 1, "Income is suspended."),
      q("Revolving NO means…", ["repayments restore the limit", "repayments do not restore the limit (term loan)", "the loan revolves monthly", "no repayments"], 1, "NO = non-revolving term loan."),
      q("The only way to change an arrangement is via a(n)…", ["enquiry", "activity", "report", "override"], 1, "Activities change arrangements; enquiries only view."),
      q("Disbursement/repayment use a…", ["journal", "Payment Order", "standing order", "direct posting"], 1, "A Payment Order mapped to a lending activity."),
      q("Reverse & Replay is enabled by…", ["DVND.CALC", "LIFE.ATTRIBUTE=REPLAY", "WHT.TAX", "TSM=START"], 1, "Set on the product line."),
      q("Simulations are stored in… and found under…", ["live tables / Authorised", "SIM files / NEW OFFERS", "customer / Pending", "the log / Dormant"], 1, "SIM files; found under NEW OFFERS."),
    ],
  },
  {
    id: "aai1",
    code: "TR3PRAAF1",
    title: "AA Implementation — Part 1",
    description: "The builder's course: property classes, the hierarchy, inheritance, and the Product Builder (proof & publish).",
    sections: [
      {
        id: "aai1-1", title: "Building Blocks",
        description: "Why AA replaced silos, and the class → property → condition chain.",
        concepts: ["aai1silo", "aai1propclass", "aai1property", "aai1prodcond"],
        quiz: [
          q("A Property Class is released by…", ["the client", "Temenos (edit description only)", "the branch", "the customer"], 1, "Property classes are Temenos-released blocks; clients only amend the description."),
          q("A Property is…", ["a raw class", "a named instance of a property class", "a whole product", "an arrangement"], 1, "E.g. the Interest class gives Principal and Penalty Interest properties."),
          q("What problem did AA solve?", ["too many customers", "product silos — each module had its own tables/logic", "slow networks", "no reporting"], 1, "AA replaced siloed modules with shared building blocks."),
          q("A Product Condition holds…", ["only a rate", "values plus rules (negotiation, dating)", "just the customer", "the account number"], 1, "Conditions carry values and the rules governing them."),
        ],
      },
      {
        id: "aai1-2", title: "Hierarchy & Account Types",
        description: "The three levels, inheritance, and account-based vs contract-based with Nostro/Vostro.",
        concepts: ["aai1hierarchy", "aai1inherit", "aai1acctcontract", "aai1nostro", "aai1arr"],
        quiz: [
          q("From an Ethiopian bank's view, its USD account at a US bank is a…", ["Vostro account", "Nostro account", "Suspense account", "Clearing account"], 1, "NOSTRO = OUR account held at another bank."),
          q("Account-based products differ from contract-based ones because…", ["they can't hold balances", "their balance can switch sign", "they never accrue interest", "they have no owner"], 1, "Accounts flip sign (e.g. overdraft); contracts keep a fixed nature."),
          q("If a condition is defined at both a lower and higher product level…", ["the higher level wins", "the lower level prevails", "both apply", "an error occurs"], 1, "Lower-level conditions override inherited ones."),
          q("A product that is complete and can be sold is…", ["inheritance-only", "saleable", "a template", "external"], 1, "Saleable = all properties have conditions."),
        ],
      },
      {
        id: "aai1-3", title: "The Product Builder",
        description: "Designing, proofing and publishing products; variations, property-type flags and balances.",
        concepts: ["aai1builder", "aai1proof", "aai1variation", "aai1proptype", "aai1balances"],
        quiz: [
          q("Which step validates that all mandatory conditions and accounting are in place?", ["Definition", "Proofing", "Publishing", "Authorising"], 1, "Only proofing validates completeness; plain definition does not."),
          q("After successful proofing, publishing…", ["deletes the product", "adds it to the Product Catalog", "reverses it", "creates an arrangement"], 1, "Publishing makes the product available for sale."),
          q("A Variation enables…", ["a new product line", "preferential pricing by channel or scheme", "a new customer", "a suspense balance"], 1, "Named variations live in AA.PRODUCT.VARIATION."),
          q("PRODUCT.ONLY as a property type means the property is…", ["shown at arrangement level", "hidden at arrangement level", "always negotiable", "a charge"], 1, "e.g. accounting properties are hidden at arrangement level."),
          q("Balance prefix ACC indicates…", ["current value", "accrued balance", "due balance", "aged balance"], 1, "CUR/ACC/DUE/AGE = current/accrued/due/aged."),
        ],
      },
    ],
    assessment: [
      q("The building-block chain is…", ["Property → Class → Condition", "Property Class → Property → Product Condition", "Condition → Property → Class", "Product → Property → Class"], 1, "Class (Temenos) → Property (client) → Product Condition (client)."),
      q("The application used to design products is…", ["AA.ARRANGEMENT", "AA.PRODUCT.DESIGNER", "AA.PROPERTY.CLASS", "EB.LOOKUP"], 1, "AA.PRODUCT.DESIGNER."),
      q("NOSTRO means…", ["your account with us", "our account at another bank", "a suspense account", "an overdraft"], 1, "NOSTRO = OUR account."),
      q("Proofing checks…", ["nothing", "conditions, accounting and mandatory properties", "only the description", "the customer"], 1, "It validates completeness before publishing."),
      q("A product has how many parents?", ["many", "exactly one", "none", "two"], 1, "One parent, many children, same group."),
      q("PRODUCT.ONLY hides a property…", ["from Temenos", "at arrangement level", "from reports", "always"], 1, "It's hidden at arrangement level (e.g. accounting)."),
      q("Balance suffix SP means…", ["current", "suspended", "charge-off", "off-balance"], 1, "SP = suspended interest/charges."),
      q("A Property Class is editable by clients only in its…", ["rate", "description", "actions", "balances"], 1, "Clients can only change the description."),
    ],
  },
  {
    id: "aai2",
    code: "TR3PRAAF2",
    title: "AA Implementation — Part 2",
    description: "Arrangement internals, activities and activity classes, reverse & replay, other features and simulation.",
    sections: [
      {
        id: "aai2-1", title: "Arrangement Internals",
        description: "Where arrangement data lives and the alternate ID.",
        concepts: ["aai2storage", "aai2altid"],
        quiz: [
          q("Arrangement condition values are stored in…", ["AA.ARRANGEMENT only", "AA.ARR.<PROPERTY.CLASS> tables", "the customer record", "DFE.MAPPING"], 1, "One table per property class; base data sits in AA.ARRANGEMENT."),
          q("The record ID in AA.ARR.<class> is…", ["just the arrangement number", "Arrangement-Property-Date-Serial", "the customer ID", "the activity ID"], 1, "Multiple same-day changes become serial numbers."),
          q("The Alternate ID is unique…", ["within one branch", "across all product lines and companies", "per customer only", "per day"], 1, "It can be used in place of the arrangement reference anywhere."),
        ],
      },
      {
        id: "aai2-2", title: "Activities & Activity Classes",
        description: "How activity classes are named and auto-generated, and how activities launch.",
        concepts: ["aai2actclass", "aai2rebuild", "aai2launch"],
        quiz: [
          q("An Activity Class name pattern is…", ["Line-Process-Property", "Line-Process-Class", "Property-Process-Line", "Class-Property-Line"], 1, "Class = Line-Process-Class; the activity = Line-Process-Property."),
          q("Activities are auto-generated when…", ["you authorise a loan", "you build a product group with REBUILD.ACTIVITIES=YES", "COB runs", "you create a customer"], 1, "The rebuild flag generates the standard activity set."),
          q("Only activity classes with TYPE = ___ appear as user-selectable.", ["System", "User", "Secondary", "Scheduled"], 1, "TYPE=User makes them user-selectable on the arrangement."),
          q("Running a transaction on an AA account…", ["does nothing", "auto-invokes the matching activity via a transaction-code mapping", "closes the loan", "requires COB"], 1, "A mapping keyed on transaction code invokes the right activity."),
        ],
      },
      {
        id: "aai2-3", title: "Reverse & Replay, Other Features, Simulation",
        description: "Product-line replay, company change, alerts, external lines, and simulation storage.",
        concepts: ["aai2reverse", "aai2company", "aai2alerts", "aai2external", "aai2sim"],
        quiz: [
          q("Reverse & Replay is enabled when…", ["DVND.CALC=Yes", "LIFE.ATTRIBUTE=REPLAY on the product line", "WHT.TAX=Yes", "the loan is in NAB"], 1, "The product line's LIFE.ATTRIBUTE must be REPLAY."),
          q("Company change is done via…", ["EB.COMPANY.CHANGE (at COB)", "AA.PRODUCT.DESIGNER", "RELATION", "DFE.MAPPING"], 0, "Both companies must share financial files; it happens at COB."),
          q("External product lines (R17)…", ["hold full financial balances", "act as placeholders and can't hold financial balances", "are Temenos-only", "replace the catalog"], 1, "They store/display data with limited functionality and no financial balances."),
          q("IGNORE.SIM=YES is used to…", ["delete arrangements", "skip storing high-volume API simulations for performance", "publish products", "reverse activities"], 1, "Results return via API without being stored (MORTGAGE.ARM still stores COMMITMENT/SCHEDULE)."),
          q("Alerts, once triggered, write a record to…", ["AA.ARRANGEMENT", "AA.ARR.ALERTS", "EB.LOOKUP", "AC.BALANCE.TYPE"], 1, "A subscribe activity writes to AA.ARR.ALERTS."),
        ],
      },
    ],
    assessment: [
      q("The record ID in AA.ARR.<class> is…", ["the arrangement number", "Arrangement-Property-Date-Serial", "the customer ID", "the activity ID"], 1, "Same-day changes become serial numbers."),
      q("Arrangement condition values live in…", ["AA.ARRANGEMENT", "AA.ARR.<PROPERTY.CLASS>", "AA.PRD.CAT only", "the customer record"], 1, "One table per property class."),
      q("An Activity Class holds…", ["only a name", "the logic (Action tab)", "the customer", "the balance"], 1, "Logic lives in the class, reused by each property's activity."),
      q("Activities are auto-generated via…", ["DVND.CALC", "REBUILD.ACTIVITIES=YES", "LIFE.ATTRIBUTE", "IGNORE.SIM"], 1, "Set on the product group build."),
      q("Company change happens…", ["online instantly", "at COB via EB.COMPANY.CHANGE", "never", "only at year-end"], 1, "At COB; both companies share financial files."),
      q("An activity that won't trigger reversal/replay of others is flagged…", ["NOREVERSE", "NOREPLAY", "NORR", "RESTRICT.LOG"], 2, "NORR = no reverse/replay of other activities."),
      q("External product lines cannot…", ["store data", "hold financial balances", "be published", "display data"], 1, "They're placeholders with no financial balances."),
      q("Simulation data is stored in…", ["AA.ARR.<class>", "AA.SIM.<class>", "AA.PRD.CAT.<class>", "AA.ARRANGEMENT"], 1, "SIM files mirror the live ARR tables (unless IGNORE.SIM)."),
    ],
  },
  {
    id: "acbb1",
    code: "TR3PRCBB1",
    title: "AA Common Building Blocks — Part 1",
    description: "The components shared across Lending, Deposits and Accounts: reusable tables, product conditions, the Customer and Eligibility property classes, pricing, officers, activity mapping and reporting.",
    sections: [
      {
        id: "acbb1-1", title: "Product Overview & Dependencies",
        description: "How one AA engine builds three arrangement families, and what it depends on.",
        concepts: ["cb1overview", "cb1deps", "cb1daybasis", "cb1currency"],
        quiz: [
          q("Lending, Deposit and Account arrangements are…", ["three separate Transact modules", "built by the same AA engine from shared components", "unrelated to AA", "only for loans"], 1, "One engine, three arrangement families, common components."),
          q("Which does AA NOT depend on?", ["CUSTOMER", "ACCOUNT", "Accounting", "the SWIFT network directly"], 3, "AA uses CUSTOMER, ACCOUNT, Delivery, Accounting and Limits."),
          q("Interest day basis 'A' means…", ["actual/365", "30/360", "actual/360", "special"], 1, "A = 30/360; E = actual/365; B = actual/360."),
          q("Holidays for a currency are checked via…", ["DVND.CALC", "BUS.DAY.CENTRES linked to the currency", "the customer record", "DFE.MAPPING"], 1, "BUS.DAY.CENTRES on the Account product condition; due dates move around them."),
          q("Limits apply to which product lines?", ["Deposits only", "Lending and Accounts", "all three equally", "none"], 1, "Limits are relevant to the Lending and Accounts product lines."),
        ],
      },
      {
        id: "acbb1-2", title: "Reusable Component Tables",
        description: "The tables that hold the building blocks and how class vs instance works.",
        concepts: ["cb1tables", "cb1propclass", "cb1property", "cb1prodcond"],
        quiz: [
          q("Which table does Temenos release (not the client)?", ["AA.PROPERTY", "AA.PROPERTY.CLASS", "AA.PRD.DES.<class>", "AA.ACTIVITY"], 1, "The *.CLASS tables are Temenos-released; clients create instances."),
          q("A Property is attached to the…", ["Product Line", "Product Group where it is first used", "Arrangement", "Customer"], 1, "Properties attach at the Product Group."),
          q("What can a client change on a Property Class?", ["its actions", "its attributes", "only the description", "its balances"], 2, "Clients may only edit the description."),
          q("A Product Condition's ID typically includes…", ["only the class name", "class, property, currency and effective date", "the customer ID", "the activity reference"], 1, "e.g. INTEREST_PRINCIPALINT-USD-20200102."),
          q("Two properties of the same class on one product…", ["are not allowed", "carry separate values and balances", "must share a balance", "merge automatically"], 1, "e.g. PRINCIPALINT and PENALTYINT of the INTEREST class."),
        ],
      },
      {
        id: "acbb1-3", title: "Product Condition Options",
        description: "Negotiability, resetting behaviour and per-attribute negotiation rules.",
        concepts: ["cb1negotiable", "cb1attropt", "cb1nrrules"],
        quiz: [
          q("DEFAULT.NEGOTIABLE controls…", ["the interest rate", "whether the arrangement-maker can change attribute values", "the currency", "the effective date"], 1, "It's the class-wide switch for user freedom."),
          q("A RESETTING attribute option means at rollover the value…", ["stays as negotiated", "reverts to the product", "is deleted", "doubles"], 1, "RESETTING snaps back to product; NON-RESETTING keeps the deal."),
          q("Which overrides the class-wide negotiable default?", ["nothing", "per-attribute NR.* rules", "the customer", "COB"], 1, "Attribute-level negotiation rules always win."),
          q("NR.TYPE = MAXIMUM with NR.MESSAGE = ERROR means a higher value is…", ["allowed with a warning", "blocked", "rounded down", "ignored"], 1, "ERROR blocks it; OVERRIDE would just warn."),
          q("NR.VALUE.SOURCE lets a rule limit be…", ["a fixed number only", "read dynamically from a balance", "set by the customer", "random"], 1, "Format BALANCE.TYPE>Name reads a live balance."),
        ],
      },
      {
        id: "acbb1-4", title: "Customer Property Class",
        description: "Linking customers to arrangements: roles, beneficial owners and relationship pricing.",
        concepts: ["cb1customer", "cb1custrole", "cb1benefowner", "cb1relpricing"],
        quiz: [
          q("The CUSTOMER property class holds…", ["the loan balance", "the customers on the arrangement and their roles/limits", "the product design", "the accounting entries"], 1, "Who's on the deal, in what capacity."),
          q("Roles like Applicant and Guarantor are defined in…", ["CUSTOMER", "AA.CUSTOMER.ROLE", "RELATION", "AA.ARRANGEMENT"], 1, "One record per role, with its rules."),
          q("The first beneficial owner is used for…", ["nothing", "accounting, tax and limits", "delivery only", "the mnemonic"], 1, "It's the 'real' owner the books care about."),
          q("A customer counts toward household pricing only if…", ["they have a loan", "their role is flagged Relationship Pricing Customer", "they are the guarantor", "COB has run"], 1, "The flag on AA.CUSTOMER.ROLE includes them in pricing evaluation."),
          q("Can the owner of an arrangement be changed?", ["never", "yes, via an activity", "only at COB", "only by Temenos"], 1, "An activity can change the beneficial owner."),
        ],
      },
      {
        id: "acbb1-5", title: "Eligibility & Pricing",
        description: "Deciding who can have a product, and pricing it differently per customer and channel.",
        concepts: ["cb1eligibility", "cb1elrules", "cb1variation", "cb1pricing", "cb1channelpricing"],
        quiz: [
          q("The ELIGIBILITY property class decides…", ["the interest rate", "whether a customer may have the product", "the repayment schedule", "the officer"], 1, "It filters the catalogue and blocks wrong sales."),
          q("Reusable eligibility logic is built in…", ["AA.PRODUCT.DESIGNER", "the Rules Manager (ER.RULES)", "DFE.MAPPING", "the Teller page"], 1, "Rules are versioned and referenced by the product condition."),
          q("A Product Variation is chosen by…", ["the branch manager", "matching the customer against each variation's eligibility in priority order", "random", "the customer typing a code"], 1, "Pass the eligibility, get that priced version."),
          q("Which is NOT a pricing method here?", ["Product Variation", "Relationship Pricing", "Promotional Pricing", "Manual ledger posting"], 3, "The four levers are Variation, Relationship, Promotion, Channel."),
          q("Channel Pricing gives a better rate for…", ["large deposits", "using a specific channel e.g. mobile", "being a guarantor", "paying early"], 1, "CHANNEL is used as a variation eligibility criterion."),
        ],
      },
      {
        id: "acbb1-6", title: "Officers, Activity Mapping & Consolidation",
        description: "Who owns an arrangement, turning transaction codes into activities, and feeding reports.",
        concepts: ["cb1officers", "cb1actmap", "cb1consol"],
        quiz: [
          q("Officer IDs on the OFFICERS property must be valid in…", ["AA.CUSTOMER.ROLE", "DEPT.ACCT.OFFICER", "CUSTOMER", "EB.LOOKUP"], 1, "Primary/Other officers validate against DEPT.ACCT.OFFICER."),
          q("Activity Mapping turns a __ into an AA activity.", ["customer ID", "transaction code", "balance", "rate"], 1, "External transaction codes map to the activity they trigger."),
          q("The Activity Mapping property class is…", ["optional", "mandatory, one property per Product Group", "per arrangement", "Temenos-only"], 1, "Mandatory; values track at arrangement level only."),
          q("CONSOLIDATE.COND accepts fields from…", ["AA.ARRANGEMENT", "AA.ACCOUNT.DETAILS", "the customer record", "DFE.MAPPING"], 1, "It maps AA balances into standard reporting fields."),
          q("AA's principal asset types also serve as…", ["activity codes", "balance types", "customer roles", "currencies"], 1, "e.g. CURACCOUNT, CURCOMMITMENT, ACCLOANINT."),
        ],
      },
    ],
    assessment: [
      q("Lending, Deposits and Accounts arrangements…", ["are separate modules", "share one AA engine and common components", "don't use AA", "are Temenos-only"], 1, "One engine, three families."),
      q("The *.CLASS building-block tables are released by…", ["clients", "Temenos", "the regulator", "the branch"], 1, "Clients create instances (Property, Activity, etc.)."),
      q("A Property attaches at the…", ["Product Line", "Product Group", "Arrangement", "Company"], 1, "The Product Group where it is first used."),
      q("A client may change which part of a Property Class?", ["actions", "attributes", "description only", "balance prefix"], 2, "Only the description."),
      q("DEFAULT.NEGOTIABLE is overridden by…", ["nothing", "per-attribute NR.* rules", "the currency", "the officer"], 1, "Attribute-level negotiation rules always win."),
      q("NON-RESETTING means a negotiated value…", ["reverts at rollover", "is kept at rollover", "is deleted", "warns"], 1, "RESETTING reverts; NON-RESETTING keeps it."),
      q("The first beneficial owner drives…", ["delivery", "accounting, tax and limits", "the mnemonic", "nothing"], 1, "It's the owner the books use."),
      q("Reusable eligibility rules live in…", ["AA.PRODUCT.DESIGNER", "ER.RULES / ER.RULES.VERSION", "RELATION", "CUSTOMER"], 1, "Built in the Rules Manager, versioned, proofed."),
      q("A Product Variation is selected by…", ["a promo code", "the customer passing its eligibility, in priority order", "the teller", "COB"], 1, "Default product covers failed eligibility."),
      q("Activity Mapping maps…", ["customers to roles", "transaction codes to AA activities", "balances to reports", "rates to tiers"], 1, "So account-based transactions drive the right activity."),
      q("Officer IDs validate against…", ["AA.CUSTOMER.ROLE", "DEPT.ACCT.OFFICER", "EB.LOOKUP", "COMPANY"], 1, "Primary and Other officers."),
      q("Consolidation maps AA balances into fields from…", ["AA.ARRANGEMENT", "AA.ACCOUNT.DETAILS", "the customer record", "SWIFT"], 1, "CONSOLIDATE.COND; value date = REPORT.END.DATE."),
    ],
  },
  {
    id: "acbb2",
    code: "TR3PRCBB2",
    title: "AA Common Building Blocks — Part 2",
    description: "AA accounting concepts, the Accounting and Balance Maintenance property classes, statement narratives, COB processing and Data Lifecycle Management.",
    sections: [
      {
        id: "acbb2-1", title: "AA Accounting Concepts",
        description: "Accounting events, arrangement balances, balance types and prefixes.",
        concepts: ["cb2acctevents", "cb2balances", "cb2baltype", "cb2balprefix"],
        quiz: [
          q("An AA activity produces ledger entries by…", ["writing to CUSTOMER", "raising an accounting event that allocation rules turn into entries", "calling SWIFT", "editing AA.PRODUCT.DESIGNER"], 1, "Activity → event → allocation rule → entries."),
          q("A single property can hold…", ["exactly one balance", "several balances, one per life-cycle state", "no balances", "only a due balance"], 1, "Committed, Available, Due, Overdue buckets, Not Accrued, etc."),
          q("Additional balance types are created in…", ["AA.PRODUCT", "AC.BALANCE.TYPE", "EB.LOOKUP", "RELATION"], 1, "Some are hard-coded in the property class; AC.BALANCE.TYPE adds more."),
          q("The balance suffix SP indicates…", ["current", "suspended (non-accrual)", "accrued", "aged"], 1, "SP marks suspended balances; prefixes (CUR/DUE/ACC/AGE) mark the stage."),
          q("A virtual balance type…", ["can't be reported", "sums specified real balances for calculation", "is customer-facing only", "replaces the ledger"], 1, "Virtual types aggregate for calculation purposes."),
        ],
      },
      {
        id: "acbb2-2", title: "Accounting Product Condition",
        description: "The ACCOUNTING property class, allocation rules, internal charges and suspense.",
        concepts: ["cb2acctpc", "cb2acctrule", "cb2ncfc", "cb2suspense", "cb2txnentry"],
        quiz: [
          q("The ACCOUNTING property class is…", ["optional", "mandatory and holds the soft accounting rules", "customer-facing", "editable at arrangement level"], 1, "Mandatory for Lending, Deposits, Accounts; no entry of its own."),
          q("An allocation rule turns one event into…", ["a customer record", "balanced ledger entries (target, contra, movement)", "a new product", "an activity class"], 1, "AC.ALLOCATION.RULE + AC.POSTING.DETAIL."),
          q("Non-customer-facing charges are…", ["shown on the statement", "booked internally and amortised between the bank's account and P&L", "waived", "customer fees"], 1, "e.g. origination costs under FASB — amortised to maturity."),
          q("AASUSPENSE is used to…", ["hide balances", "hold a movement between cash arriving and the arrangement processing it", "close loans", "print statements"], 1, "Improves performance and reconciliation; supports Process Dated Accounting."),
          q("TXN.ENTRY.MB shows…", ["customer relationships", "ledger entries raised by an external application, by activity reference", "the product catalogue", "overdue bills"], 1, "External postings don't store contract IDs in ECB."),
        ],
      },
      {
        id: "acbb2-3", title: "Balance Maintenance",
        description: "Capturing, adjusting and writing off balances — mainly for migration.",
        concepts: ["cb2balmaint", "cb2capture", "cb2adjust", "cb2hisbalance"],
        quiz: [
          q("The BALANCE.MAINTENANCE property class is mainly for…", ["daily interest", "migrating existing loans/deposits into AA", "printing statements", "COB"], 1, "Capture bills/balances and adjust for takeovers."),
          q("Capture Bill posts an amount with an effective date…", ["today only", "before the arrangement's Transact start date, then ages it", "after maturity", "never"], 1, "The legacy position is loaded then aged by the same activity."),
          q("Capture Historical Balance is available for which product line?", ["Lending only", "Accounts only", "Deposits only", "all three"], 1, "It's an Accounts-product-line feature."),
          q("Write Off Bill sets an existing bill's amount to…", ["double", "zero", "the product default", "the customer limit"], 1, "Adjust nudges up/down; Write Off zeroes it."),
          q("The 'other side' of a Balance Maintenance movement is handled by…", ["the customer", "allocation rules (usually suspense/wash)", "SWIFT", "nothing"], 1, "Net movement from bills can be zero."),
        ],
      },
      {
        id: "acbb2-4", title: "Statement Narratives",
        description: "Turning activity codes into readable, multi-language statement text.",
        concepts: ["cb2narrative", "cb2narrparam", "cb2narrformat", "cb2printstmt"],
        quiz: [
          q("Statement narratives are extracted from…", ["only AA.ACTIVITY", "AC.POSTING.DETAIL, AA.PROPERTY and AA.ACTIVITY", "the customer record", "SWIFT messages"], 1, "STMT-AA record maps activity → narrative."),
          q("AA.STATEMENT.NARR.PARAM links…", ["customers to roles", "an activity (system ID + activity ID) to a narrative format", "balances to reports", "rates to tiers"], 1, "e.g. LENDING-NEW-ARRANGEMENT → its format."),
          q("AA.STATEMENT.NARR.FORMAT holds…", ["the activity logic", "the narrative template text and per-token conversion rules", "the accounting rule", "the product design"], 1, "Conversion types format dates, amounts, names, etc."),
          q("Transaction-specific narrative parameters…", ["are ignored", "take precedence over the application's main parameter", "only work at COB", "need SWIFT"], 1, "Specific beats general."),
          q("PRINT.STATEMENT can be invoked…", ["only online", "during COB or online", "only by Temenos", "never"], 1, "Its record must be linked as a Statement Type."),
        ],
      },
      {
        id: "acbb2-5", title: "COB & Data Lifecycle",
        description: "Tuning COB for AA, archiving and Data Lifecycle Management.",
        concepts: ["cb2cob", "cb2decision", "cb2dlm", "cb2archive", "cb2nolog"],
        quiz: [
          q("At COB, unauthorised account-product activities can be…", ["always deleted", "skipped from delete-and-recreate to improve performance", "authorised automatically", "sent to SWIFT"], 1, "Configurable by product line, group, product, company, activity class or activity."),
          q("AA.DECISION.PARAMETER's Default Decision…", ["ignores unauthorised activities", "deletes and recreates unauthorised activities during COB", "closes arrangements", "prints statements"], 1, "'Ignore' leaves them instead."),
          q("Data Lifecycle Management moves aged data to…", ["SWIFT", "a non-volatile read-only database, still queryable", "the customer record", "the bin immediately"], 1, "Keeps the live system small; framework still reads aged data."),
          q("In archiving, the Purge Date means the record is…", ["moved to read-only", "deleted", "kept forever", "reversed"], 1, "Retention Period = move to read-only; Purge Date = delete."),
          q("A NOLOG activity…", ["is written to AA.ARRANGEMENT.ACTIVITY as normal", "is not logged, and gets an AAACN-prefixed ID", "can't be run", "is customer-facing"], 1, "NOLOG and Restrict Log are mutually exclusive."),
        ],
      },
    ],
    assessment: [
      q("AA activities create ledger entries via…", ["direct posting", "accounting events processed by allocation rules", "the customer record", "SWIFT"], 1, "Activity → event → allocation rule → entries."),
      q("Additional balance types are defined in…", ["AA.PRODUCT", "AC.BALANCE.TYPE", "EB.LOOKUP", "RELATION"], 1, "Virtual types sum real balances for calculation."),
      q("The balance suffix SP marks a balance as…", ["current", "suspended", "aged", "accrued"], 1, "Non-accrual basis."),
      q("The ACCOUNTING property class is…", ["optional", "mandatory, holding soft accounting rules", "arrangement-editable", "customer-facing"], 1, "ACCT.ACTION.CLASS + ACCTRULE."),
      q("Non-customer-facing charges are…", ["shown to the customer", "booked internally and amortised to P&L", "waived", "the same as penalty interest"], 1, "e.g. FASB origination costs."),
      q("AASUSPENSE decouples…", ["customers from products", "money arriving from the arrangement processing it", "COB from online", "print from display"], 1, "Improves performance and reconciliation."),
      q("BALANCE.MAINTENANCE is used mainly for…", ["daily accrual", "migrating arrangements into AA", "statement printing", "eligibility"], 1, "Capture and adjust balances/bills on takeover."),
      q("HIS-<ACCOUNT> balances exist so that…", ["statements print faster", "back-dated changes beyond the takeover date can be replayed", "interest is waived", "COB is skipped"], 1, "They hold the migrated account's past positions."),
      q("AA.STATEMENT.NARR.PARAM is keyed on…", ["customer ID", "system ID + activity ID", "balance type", "currency"], 1, "e.g. LENDING-NEW-ARRANGEMENT."),
      q("PRINT.STATEMENT integrates the wording from…", ["RELATION", "AA.NARRATIVE", "DFE.MAPPING", "CUSTOMER"], 1, "Its record links as a Statement Type."),
      q("AA.DECISION.PARAMETER set to 'Ignore' means COB…", ["deletes unauthorised activities", "leaves unauthorised activities in place", "authorises them", "archives them"], 1, "Default Decision would delete and recreate."),
      q("A NOLOG activity's AA ID is prefixed…", ["AAACT", "AAACN", "AA", "HIS"], 1, "AAACN = 'not logged'; NOLOG and Restrict Log are mutually exclusive."),
    ],
  },
  {
    id: "alpb1",
    code: "TR3PRLPB1",
    title: "AA Lending Product Building — Part 1",
    description: "Building a lending product property class by property class: Term Amount, Account, Limit, Interest, Tax, Charges, Payment Schedule and Settlement.",
    sections: [
      {
        id: "alpb1-1", title: "Term Amount",
        description: "The commitment amount, term, maturity, revolving behaviour and tranche disbursement.",
        concepts: ["lpb1termamt", "lpb1commit", "lpb1maturity", "lpb1revolving", "lpb1tranche"],
        quiz: [
          q("TERM.AMOUNT carries…", ["only the interest rate", "the commitment amount and the term", "the customer roles", "the accounting rules"], 1, "How much, for how long — a mandatory Lending property class."),
          q("A Change Amount activity…", ["closes the loan", "increases or decreases the commitment during the arrangement", "changes the currency", "recalculates tax"], 1, "Top-ups and partial cancellations without a new arrangement."),
          q("Revolving = Payment means…", ["repayments never restore availability", "any principal repayment restores the available amount", "only prepayment restores it", "the loan can't be drawn"], 1, "Prepayment restores only on early repayment; None never restores."),
          q("A tranche is…", ["a type of interest", "a slice of the commitment with its own start date and amount", "a customer role", "a balance type"], 1, "A Tranche Bill is created on each tranche's start date."),
          q("If maturity lands on a holiday and the Mat Date Convention is Yes…", ["nothing happens", "the maturity date is adjusted", "the loan is cancelled", "term doubles"], 1, "Beyond TERM.TOL.DAYS the term is recalculated."),
        ],
      },
      {
        id: "alpb1-2", title: "Account",
        description: "The arrangement's own account: dormancy, base dates and posting restrictions.",
        concepts: ["lpb1account", "lpb1dormancy", "lpb1basedate", "lpb1posting"],
        quiz: [
          q("The ACCOUNT property class is…", ["optional", "mandatory and holds the principal balance", "customer-facing only", "Temenos-only"], 1, "AA is account-based; opening an arrangement creates its account."),
          q("Dormancy is measured in…", ["days since disbursement", "inactive months", "missed payments", "overdue bills"], 1, "After N inactive months the account is dormant."),
          q("Base vs Previous base date type decides…", ["the currency", "whether cycling uses the un-adjusted base date or the last actual cycle date", "the interest rate", "the tax split"], 1, "Base = fixed anchor; Previous = follow the last real date."),
          q("A Posting Restriction…", ["closes the account", "blocks debits and/or credits for a date range with a reason", "waives charges", "changes the officer"], 1, "Blocking codes via BLOCK.REASON.CODES / UNBLOCK.REASON.CODES."),
          q("Allowed balance prefixes for the Lending ACCOUNT property include…", ["only CUR", "CUR, DUE, AGE, AVL, UNC, UND", "SP only", "none"], 1, "Suffix *INP/*CO/*CLIST/*CLST."),
        ],
      },
      {
        id: "alpb1-3", title: "Limit",
        description: "Linking an arrangement to a credit limit, single vs shared, and netting.",
        concepts: ["lpb1limit", "lpb1limitref", "lpb1netting"],
        quiz: [
          q("The LIMIT property class is…", ["mandatory", "optional, linking the arrangement to a LIMIT-module limit", "the interest engine", "the schedule"], 1, "Banks approve credit at customer/group level; loans draw it down."),
          q("Single Limit = Yes means the limit is…", ["shared by all the customer's arrangements", "locked to this one arrangement", "unlimited", "not tracked"], 1, "No lets other arrangements of the same customer share it."),
          q("Netting lets…", ["two customers merge", "a credit balance offset another arrangement's overdraft on the same Limit", "charges be waived", "COB be skipped"], 1, "Applicable only for shared limits."),
          q("The Limit Reference must relate to…", ["any customer", "the Primary Owner", "the guarantor", "the branch"], 1, "It's the limit record ID in the arrangement."),
          q("If DISBURSE runs without a limit attached…", ["it fails", "an override is generated", "the loan closes", "interest stops"], 1, "Limit is typically Arrangement Level and Non-Tracking."),
        ],
      },
      {
        id: "alpb1-4", title: "Interest",
        description: "Interest types, RFR, tiered rates and rate adjustment.",
        concepts: ["lpb1interest", "lpb1inttypes", "lpb1rfr", "lpb1tiered", "lpb1rateadj", "lpb1linked"],
        quiz: [
          q("A product can carry…", ["one interest property only", "several INTEREST properties, each with its own rate and balance", "no interest", "interest only via tax"], 1, "e.g. PRINCIPALINT and PENALTYINT."),
          q("A Floating interest rate is…", ["typed by the user", "read from BASIC.INTEREST plus a spread", "always zero", "read from the customer record"], 1, "Periodic reads PERIODIC.INTEREST for a defined period."),
          q("Banded tiered interest applies each rate to…", ["the whole balance", "only the portion within that tier", "the first tier only", "nothing"], 1, "Level applies the reached tier's rate to the whole balance."),
          q("RFR rates are…", ["a single published rate", "compounded overnight rates with look-back and day-count conventions", "always fixed", "customer-set"], 1, "SOFR/SONIA replacing LIBOR; RFR Look Back Days 1–10."),
          q("RATE.ADJUSTMENT is set at…", ["the product condition", "the arrangement level", "COB", "the customer record"], 1, "So one customer's rate is bent without a product change."),
          q("A Linked Rate derives an arrangement's rate from…", ["the branch", "another arrangement's Interest property", "the tax code", "the schedule"], 1, "Used when a deposit is collateral for a loan/overdraft."),
        ],
      },
      {
        id: "alpb1-5", title: "Tax",
        description: "Withholding tax on interest and charges, tax splits and proportional tax.",
        concepts: ["lpb1tax", "lpb1taxsplit"],
        quiz: [
          q("The TAX property class calculates tax on…", ["the commitment amount", "the interest and charges of a named property", "the customer's salary", "the schedule"], 1, "Multiple TAX properties allowed; Currency and Dated."),
          q("Tax splits between related customers use…", ["the branch code", "CUSTOMER.RELATIONSHIP / AA.CUSTOMER.ROLE with a percentage", "the tax code alone", "COB"], 1, "ST.CUST.RELATIONSHIP.DATES holds the split dates."),
          q("Proportional tax calculation is switched on in…", ["AA.PRODUCT.DESIGNER", "TAX.CODE.PARAMETER per tax code", "RELATION", "the customer record"], 1, "ST.TAX.CALC.DETAILS holds the breakup."),
          q("Tax can optionally be…", ["ignored entirely", "included in the payment schedule", "paid by Temenos", "negative"], 1, "For loan annuity payment calculations."),
          q("The Property Tax Code uses…", ["TAX.CODE only", "PROP.TAX.CODE or PROP.TAX.COND", "the mnemonic", "DEPT.ACCT.OFFICER"], 1, "Tax Code uses TAX.CODE or TAX.CONDITION."),
        ],
      },
      {
        id: "alpb1-6", title: "Charges",
        description: "Activity charges, the general CHARGE class, overrides, periodic charges and how charges trigger.",
        concepts: ["lpb1activitycharge", "lpb1charge", "lpb1chargeoverride", "lpb1periodiccharge", "lpb1triggercharge"],
        quiz: [
          q("ACTIVITY.CHARGES levies a charge when…", ["a bill is due", "a specific AA activity is triggered", "COB runs", "the customer logs in"], 1, "The Activity ID must be a valid AA.ACTIVITY record."),
          q("The CHARGE property class calculation types are…", ["only Fixed", "Flat, Percentage, Unit", "Level and Banded only", "none"], 1, "On specified balances, with tiers Level/Banded/Groups."),
          q("CHARGE.OVERRIDE is used to…", ["add a fee", "waive or modify charges when an activity triggers or a rule breaks", "change the rate", "close the loan"], 1, "The waive reason is stored; it's DATED and non-tracking."),
          q("PERIODIC.CHARGES are…", ["event-based fees", "charges that fall due at regular intervals", "tax", "interest"], 1, "e.g. a monthly maintenance fee."),
          q("The three charge trigger types are…", ["Fixed, Percentage, Unit", "event-based, rule-based, schedule-based", "Due, Cap, Defer", "Level, Banded, Group"], 1, "APP.METHOD (Due/Cap/Defer/Pay) then sets the application method."),
        ],
      },
      {
        id: "alpb1-7", title: "Payment Schedule",
        description: "The repayment plan: payment types, frequency, recalculation and payment holidays.",
        concepts: ["lpb1payschedule", "lpb1paytypes", "lpb1payfreq", "lpb1recalc", "lpb1holidays"],
        quiz: [
          q("PAYMENT.SCHEDULE is…", ["optional", "a mandatory Lending property class defining the repayment rules", "the interest engine", "a tax table"], 1, "Dated, forward-dated and currency-specific; schedule enquiry is runtime Nofile."),
          q("CONSTANT payment type keeps level the…", ["principal portion", "total instalment", "interest portion", "charges"], 1, "LINEAR keeps the principal portion level; ACTUAL pays what's calculated."),
          q("Bills are generated…", ["on the due date", "a number of working days in advance of the due date", "only at maturity", "never automatically"], 1, "So notices and direct debits can run ahead."),
          q("Recalculation type Term means a rate change…", ["raises the instalment", "extends (or shortens) the loan term", "is ignored", "creates a balloon"], 1, "Type Payment moves the instalment instead."),
          q("A payment holiday is set up via activity…", ["LENDING-DISBURSE-COMMITMENT", "LENDING-UPDATE-PAYMENT.HOLIDAY", "LENDING-APPLYPAYMENT", "COB"], 1, "Repayment Holiday Limit caps the holiday."),
        ],
      },
      {
        id: "alpb1-8", title: "Settlement",
        description: "Moving money in and out: pay-in/pay-out, receiving funds, direct debits and offsetting bills.",
        concepts: ["lpb1settlement", "lpb1receiving", "lpb1directdebit", "lpb1offset"],
        quiz: [
          q("The SETTLEMENT property class defines…", ["the interest rate", "how money is received (Pay In) and paid out (Pay Out)", "the customer roles", "the tax split"], 1, "Mandates defined in the Direct Debit module."),
          q("Receiving Funds = Partial means an underpayment…", ["is rejected", "settles bills to the extent of the funds available", "is capitalised", "closes the loan"], 1, "Full = all or nothing; None = don't settle."),
          q("The Transaction Recycler / Cycler…", ["prints statements", "retries movements/collections that couldn't complete", "calculates tax", "archives data"], 1, "Bills are prioritised (oldest first or as configured)."),
          q("Offsetting bills nets…", ["two customers", "a Pay bill against a Due bill so only the net moves", "interest against principal automatically", "COB against online"], 1, "From an accounting view the net is settled — no separate P&L impact."),
          q("The default settlement account comes from…", ["the branch", "DEFAULT.SETTLEMENT.ACCOUNT", "the mnemonic", "the tax code"], 1, "Default activity from Activity Mapping (R17)."),
        ],
      },
    ],
    assessment: [
      q("TERM.AMOUNT is…", ["optional", "mandatory, carrying commitment amount and term", "the tax engine", "the schedule"], 1, "How much, for how long."),
      q("Revolving = Payment means repayments…", ["never restore availability", "restore the available commitment", "only restore on prepayment", "block drawing"], 1, "None never restores; Prepayment only on early repayment."),
      q("The ACCOUNT property class holds…", ["the customer roles", "the principal balance and account-level settings", "the accounting rules", "the officers"], 1, "AA is account-based."),
      q("Single Limit = No means the limit is…", ["locked to one arrangement", "shared by the customer's arrangements", "unlimited", "not tracked"], 1, "Yes ring-fences it to one arrangement."),
      q("Netting requires…", ["a single limit", "a shared limit", "no limit", "two customers"], 1, "Credit balance offsets another arrangement's overdraft on the same Limit."),
      q("Periodic interest is read from…", ["BASIC.INTEREST", "PERIODIC.INTEREST for a defined period", "the customer record", "the tax table"], 1, "Floating reads BASIC.INTEREST + spread."),
      q("Banded tiered interest charges each rate on…", ["the whole balance", "only its slice of the balance", "the top tier", "nothing"], 1, "Level charges the reached tier's rate on everything."),
      q("RATE.ADJUSTMENT is applied at…", ["the product condition", "the arrangement level", "the product line", "COB"], 1, "To bend one arrangement's rate."),
      q("Tax splits between owners use…", ["the branch", "CUSTOMER.RELATIONSHIP with percentages", "the officer", "COB"], 1, "ST.CUST.RELATIONSHIP.DATES holds split dates."),
      q("CHARGE.OVERRIDE is used to…", ["add fees", "waive or modify charges on an activity/broken rule", "change rates", "close loans"], 1, "The waive reason is stored."),
      q("CONSTANT payment type keeps level the…", ["principal", "total instalment", "interest", "charges"], 1, "LINEAR keeps principal level."),
      q("Recalculation type Payment means a rate change…", ["extends the term", "raises the instalment", "is ignored", "creates a balloon"], 1, "Type Term extends the loan instead."),
      q("A payment holiday uses activity…", ["LENDING-DISBURSE-COMMITMENT", "LENDING-UPDATE-PAYMENT.HOLIDAY", "COB", "MAKEDUE"], 1, "Capped by the Repayment Holiday Limit."),
      q("The SETTLEMENT property class defines…", ["interest", "pay-in and pay-out instructions via DD mandates", "the schedule", "tax"], 1, "Default via DEFAULT.SETTLEMENT.ACCOUNT."),
      q("Offsetting bills means the customer moves…", ["the gross of both bills", "only the net of Pay against Due", "nothing", "double"], 1, "Offset Property Class/Property indicates the balance to offset."),
    ],
  },
  {
    id: "alpb2",
    code: "TR3PRLPB2",
    title: "AA Lending Product Building — Part 2",
    description: "The rest of the lending property classes — Payment/Payout Rules, Overdue, Restructure, Charge Off, Constraint, Periodic Attributes, Activity Restrictions, Change Product, Payoff, Closure, Reporting — and how a product is built, proofed and published.",
    sections: [
      {
        id: "alpb2-1", title: "Payment Rules",
        description: "Allocating one payment across many bills and properties.",
        concepts: ["lpb2payrules", "lpb2payruletype", "lpb2remainder", "lpb2makedue"],
        quiz: [
          q("PAYMENT.RULES decides…", ["the interest rate", "how one payment is allocated across bills and properties", "the maturity date", "the officer"], 1, "Mandatory Lending property class; order and priority matter."),
          q("AA.PAYMENT.RULE.TYPE payment method Partial…", ["rejects underpayments", "can settle bills to the extent of funds and in advance", "doubles the payment", "closes the loan"], 1, "Full = all or nothing."),
          q("The Remainder Activity handles…", ["overdue bills", "money left over after all bills are satisfied", "tax", "the schedule"], 1, "e.g. credit it to the advance balance."),
          q("MAKE.BILL.DUE = Yes lets a payment…", ["skip bills", "settle bills that aren't due yet", "waive charges", "reverse accounting"], 1, "Advance Payment Restriction sets how many bills ahead."),
          q("Tax settlement method on payment rules is…", ["always separate", "PRO.RATE or SEPARATE", "ignored", "customer-set"], 1, "PRO.RATE settles tax on a pro-rata basis with repayment."),
        ],
      },
      {
        id: "alpb2-2", title: "Payout & Overdue",
        description: "Paying money out, and the delinquency / ageing process.",
        concepts: ["lpb2payout", "lpb2overdue", "lpb2ageing", "lpb2chaser", "lpb2suspend"],
        quiz: [
          q("PAYOUT.RULES defines…", ["how payments in are allocated", "the method and order money is paid out from balances", "the interest rate", "the schedule"], 1, "LENDING.RULE.PAYOUT pays out balances."),
          q("Overdue statuses (GRC/DEL/NAB) are defined in…", ["AA.PRODUCT", "the virtual table AA.OVERDUE.STATUS via EB.LOOKUP", "RELATION", "the customer record"], 1, "The OVERDUE property class governs the process."),
          q("Ageing by Bills is denoted by…", ["a 'D' suffix", "a 'B' suffix e.g. 1B, 2B", "a percentage", "nothing"], 1, "Ageing by Days uses calendar days/months."),
          q("A chaser notice is…", ["a legal writ", "a dunning notice generated a set number of days after an ageing status, then repeated", "an accounting entry", "a customer role"], 1, "Automated timed reminders."),
          q("Suspending an arrangement (AGE.ALL.BILLS = YES)…", ["waives the debt", "stops further P&L accrual and books to a special CRF category", "closes the loan", "resets the rate"], 1, "Non-accrual accounting for bad loans."),
        ],
      },
      {
        id: "alpb2-3", title: "Restructure Rules",
        description: "Suppressing and resuming charges during a debt restructure, and the Technical Loan.",
        concepts: ["lpb2restructure", "lpb2technicalloan", "lpb2rulestatus"],
        quiz: [
          q("RESTRUCTURE.RULES is used to…", ["change the currency", "suppress/resume interest and charges by restructuring stage", "close the loan", "print statements"], 1, "3-stage: In-progress / Reject / Approve."),
          q("A Technical Loan…", ["replaces the original loan", "carries the amended terms; repayments flow to the original loan", "is a Temenos internal account", "holds tax"], 1, "Both loans must be the same currency."),
          q("Restructured statuses ('Inprog', 'Reject', 'Approved') are created in…", ["AA.PRODUCT.DESIGNER", "AA.RESTRUCTURE.STATUS", "EB.LOOKUP", "RELATION"], 1, "Users define them."),
          q("For a resume rule, the Effective Date can be…", ["only today", "'Activity Date' or 'Suppress Date'", "only maturity", "customer birth date"], 1, "'Suppress Date' back-dates the resume."),
          q("A repayment on the technical loan is first…", ["applied to the original loan directly", "parked in the suspense account (UNC) then applied via the original's payment rules", "rejected", "capitalised"], 1, "Keeps the original contract intact for audit."),
        ],
      },
      {
        id: "alpb2-4", title: "Charge Off",
        description: "Writing off a loan while still tracking the customer's debt.",
        concepts: ["lpb2chargeoff", "lpb2coallocation"],
        quiz: [
          q("CHARGEOFF keeps separate…", ["currencies", "bank, customer and charge-off balance types for the same amounts", "officers", "schedules"], 1, "Accounting writes the loss off; the debt still exists."),
          q("After charge-off, customer balances stay…", ["zero", "Regular", "suspended", "hidden"], 1, "Charge-off details in AA.ACCOUNT.DETAILS; AA.BILL.DETAILS holds customer due & bank info."),
          q("NEWEST.FIRST allocation targets…", ["the oldest bill", "CUR<ACCOUNT> then bills newest to oldest", "tax", "the commitment"], 1, "OLDEST.FIRST does latest-to-oldest from CUR<ACCOUNT>."),
          q("A negative recovery amount triggers…", ["Increase Charge-Off", "Decrease Charge-Off", "closure", "a chaser notice"], 1, "Allocation follows status Property and Balance Type."),
          q("Overdue processing on a charged-off loan…", ["stops", "is triggered per the regular process", "waives interest", "doubles"], 1, "Charge-off doesn't halt aging."),
        ],
      },
      {
        id: "alpb2-5", title: "Constraint",
        description: "Restricting how far back-dated activities can go.",
        concepts: ["lpb2constraint"],
        quiz: [
          q("CONSTRAINT restricts…", ["future-dated activities", "how far back-dated activities may be performed", "the interest rate", "the officer"], 1, "By date, period, financial year, interest period, renewal or statement period."),
          q("When multiple constraints conflict, precedence goes to…", ["the earliest date", "constraints with RESULT = Override", "the customer", "none"], 1, "Error vs Override with messages."),
          q("An activity is excluded from constraint evaluation by…", ["deleting it", "marking Exclude Activity = YES in AA.ACTIVITY", "COB", "a periodic rule"], 1, "Field-level exclusion."),
          q("Constraint Type 'Financial Year' restricts back-dating before…", ["the last statement", "the start of the financial year", "maturity", "disbursement"], 1, "Protects closed accounting periods."),
          q("The CONSTRAINT property class is available for…", ["Lending only", "Lending, Deposits and Accounts", "Deposits only", "none"], 1, "Tracking, Dated."),
        ],
      },
      {
        id: "alpb2-6", title: "Periodic Attributes",
        description: "Rules that change product behaviour over time, and break charges.",
        concepts: ["lpb2periodicclass", "lpb2periodicattr", "lpb2periodicrules", "lpb2breakcharges"],
        quiz: [
          q("AA.PERIODIC.ATTRIBUTE.CLASS is released by…", ["clients", "Temenos (or user-defined)", "the regulator", "the branch"], 1, "Defines Action, Comparison Type, Data Type, Source."),
          q("AA.PERIODIC.ATTRIBUTE is…", ["the logic block", "a named instance used in a product condition", "an accounting rule", "a customer role"], 1, "PERIODIC.TYPE INITIAL / REPEATING / ROLLING / ASSESSMENT.PERIOD.CURRENT."),
          q("A periodic rule ties a Property Class + Comparison Type + Routine to…", ["a customer", "a time element, with a comparison value and break result", "a currency", "an officer"], 1, "e.g. 'rate up > 1% in any 1 year'."),
          q("When a periodic rule is broken, the Break Result decides…", ["the interest rate", "whether the action is blocked (error) or allowed (override)", "the maturity date", "the schedule"], 1, "A Break Charge can also be levied."),
          q("Comparison types come from…", ["AA.PRODUCT", "EB.COMPARISON.THR (MINIMUM, MAXIMUM, RANGE)", "the customer record", "DFE.MAPPING"], 1, "Data types AMT/PERCID/N/R/N.DAO."),
        ],
      },
      {
        id: "alpb2-7", title: "Activity Restrictions",
        description: "Limiting, regulating or conditionally allowing arrangement activities.",
        concepts: ["lpb2actrestrict", "lpb2restricttypes", "lpb2qualifier"],
        quiz: [
          q("ACTIVITY.RESTRICTION can…", ["only block activities", "limit, regulate or conditionally allow activities (override)", "only allow activities", "change the rate"], 1, "Override message is mandatory for partial restriction."),
          q("Restrictions key off…", ["only balance", "Balance Rules, Transaction Amount or Transaction Count", "only count", "the officer"], 1, "And are Rule-based, Activity-based or Property-based."),
          q("A Product Qualifier Rule Set evaluates to…", ["a rate", "PASS or FAIL (or a subsequent action)", "a balance", "a date"], 1, "Using AND/OR/EQUAL logic and a frequency."),
          q("Property-based restriction can…", ["only block", "waive interest/charge on a property amount and apply an alternate", "change the currency", "close the loan"], 1, "Evaluation break/satisfy on the Property tab."),
          q("Scheduled interest and charge properties are restricted via…", ["the customer record", "the Payment Schedule property", "EB.LOOKUP", "COB"], 1, "Transaction count/amount/balances."),
        ],
      },
      {
        id: "alpb2-8", title: "Change Product & Payoff",
        description: "Switching an arrangement to another product, and early settlement.",
        concepts: ["lpb2changeproduct", "lpb2rollover", "lpb2payoff", "lpb2payoffstmt"],
        quiz: [
          q("CHANGE.PRODUCT lets an arrangement switch product…", ["never", "manually, automatically, or on a scheduled date/period/condition", "only at maturity", "only by Temenos"], 1, "Allowed Product lists valid targets in the same product group."),
          q("RESET as a change activity…", ["renews with revised conditions", "reapplies the product-level values", "closes the loan", "changes currency"], 1, "ROLLOVER renews; RENEGOTIATE changes several properties at once."),
          q("DEFAULT.ATTR.OPTION = RESETTING on CHANGE.CONDITION means…", ["negotiated values are kept", "product values are reapplied", "the loan closes", "nothing"], 1, "NON-RESETTING / NONE keeps negotiated values."),
          q("PAYOFF produces…", ["a new loan", "a quote to clear the arrangement early, incl. accrued interest and any prepayment charge", "a chaser notice", "a tax record"], 1, "SIMULATION.RUNNER drives Lending-Calculate-Payoff."),
          q("The payoff calculation totals dues for…", ["only principal", "Account, Interest and Charge properties, plus balances not yet due", "only interest", "charges only"], 1, "Credit in UNC of the Account property auto-settles dues."),
        ],
      },
      {
        id: "alpb2-9", title: "Closure & Reporting",
        description: "Closing an arrangement, the cooling period, and Position/IFRS/APR reporting.",
        concepts: ["lpb2closure", "lpb2closuretype", "lpb2cooling", "lpb2reporting", "lpb2position", "lpb2apr"],
        quiz: [
          q("CLOSURE Method options are…", ["Fixed / Floating", "Automatic / Manual / Online", "Level / Banded", "Due / Cap / Defer"], 1, "Close Online is Accounts-product-line only."),
          q("Closure Type BALANCE means the arrangement closes…", ["on the maturity date", "when balances reach zero, whenever that is", "after a cooling period", "never"], 1, "MATURITY = by date; DEFER.CLOSURE waits on the deferred date."),
          q("The cooling period lets the customer…", ["extend the loan", "cancel within a window with charges waived", "skip a payment", "change product"], 1, "Set on TERM.AMOUNT or CLOSURE; Lending line only."),
          q("The REPORTING property class integrates the arrangement with…", ["the customer record", "Position Management and IFRS reporting", "the schedule", "the officer"], 1, "Also supports APR and IFRS charge-off."),
          q("PM.GAP shows…", ["cash flow position", "interest mismatch (rate gap) position", "forex position", "the payoff figure"], 1, "PM.CAS = cash flow; PM.FXPOS = forex/break-even."),
          q("APR can be calculated by…", ["only interest", "Cashflow or Interest", "the customer", "the branch"], 1, "Recalculated when cash flow changes via UPDATE.APR.ACTIVITY."),
        ],
      },
      {
        id: "alpb2-10", title: "Building Lending Products",
        description: "Product lines, groups, the designer, and proofing & publishing to the catalogue.",
        concepts: ["lpb2prodline", "lpb2prodgroup", "lpb2designer", "lpb2proofpublish", "lpb2catalog"],
        quiz: [
          q("AA.PRODUCT.LINE is…", ["client-defined", "released by Temenos, with only the description modifiable", "per arrangement", "per customer"], 1, "LINE.ATTRIBUTE holds CCY and REPLAY."),
          q("The Product Group fixes…", ["the interest rate", "which property classes are Mandatory or Optional and holds mandatory Properties", "the customer", "the schedule"], 1, "Group Type Internal / External."),
          q("AA.PRODUCT.DESIGNER is where…", ["limits are approved", "a product is designed under its group — currencies, optional properties, effective dates", "COB runs", "customers are created"], 1, "PARENT.PRODUCT allows inheritance; non-saleable acts only as a parent."),
          q("The product build process is…", ["Publish → Proof → Design", "Design → Proof → Publish", "Proof → Publish → Design", "one step"], 1, "Proofing validates conditions, accounting and mandatory properties."),
          q("A product appears in the Product Catalogue only if…", ["it is designed", "it is proofed, published and within its Available/Expiry dates", "a customer requests it", "COB has run"], 1, "Existing arrangements continue on their created version."),
        ],
      },
    ],
    assessment: [
      q("PAYMENT.RULES governs…", ["the rate", "allocation of one payment across bills and properties", "maturity", "closure"], 1, "Mandatory Lending property class."),
      q("The Remainder Activity sends leftover money to…", ["the customer's pocket", "a defined balance e.g. advance", "nowhere", "tax"], 1, "Overpayments need a defined home."),
      q("PAYOUT.RULES defines…", ["payments in", "the method and order money is paid out", "the rate", "the schedule"], 1, "LENDING.RULE.PAYOUT."),
      q("Overdue statuses are held in…", ["AA.PRODUCT", "AA.OVERDUE.STATUS via EB.LOOKUP", "RELATION", "CUSTOMER"], 1, "Governed by the OVERDUE property class."),
      q("Suspending an arrangement…", ["waives the debt", "stops P&L accrual to a special CRF category", "closes it", "resets the rate"], 1, "AGE.ALL.BILLS = YES."),
      q("A Technical Loan carries the __ terms.", ["original", "amended (restructured)", "product default", "Temenos"], 1, "Repayments flow to the original loan; same currency."),
      q("CHARGEOFF keeps…", ["one balance", "separate bank, customer and charge-off balances", "no balances", "only tax"], 1, "Loss recognised, debt still tracked."),
      q("CONSTRAINT restricts…", ["future dating", "back-dated activities by date/period/financial year/…", "the rate", "the officer"], 1, "Override precedence on conflicts."),
      q("AA.PERIODIC.ATTRIBUTE.CLASS is released by…", ["clients", "Temenos (or user-defined)", "the regulator", "the branch"], 1, "Action, Comparison Type, Data Type, Source."),
      q("A broken periodic rule's Break Result is…", ["always an error", "error or override, optionally with a Break Charge", "always ignored", "a rate cut"], 1, "Some limits are hard stops, others cost a fee."),
      q("ACTIVITY.RESTRICTION can…", ["only block", "limit, regulate or conditionally allow (override) activities", "only allow", "change currency"], 1, "Balance / amount / count keys × rule / activity / property bases."),
      q("A Product Qualifier Rule Set evaluates to…", ["a balance", "PASS or FAIL", "a date", "a rate"], 1, "AND/OR/EQUAL logic, with a frequency."),
      q("RESET as a change activity…", ["renews with revised terms", "reapplies product-level values", "closes the loan", "changes the officer"], 1, "DEFAULT.ATTR.OPTION RESETTING."),
      q("PAYOFF is driven by…", ["COB", "SIMULATION.RUNNER → Lending-Calculate-Payoff", "the customer record", "DFE"], 1, "Tolerance per cent / amount / action for shortfalls."),
      q("Closure Type MATURITY means closure depends on…", ["balances reaching zero", "the maturity date", "a cooling period", "an override"], 1, "BALANCE closes when it hits zero."),
      q("The cooling period is set on…", ["INTEREST", "the TERM.AMOUNT or CLOSURE property class", "RELATION", "the officer"], 1, "Lending product line only."),
      q("Position Management enquiry PM.FXPOS shows…", ["cash flow", "rate gap", "forex position and break-even", "the payoff"], 1, "PM.CAS = cash flow; PM.GAP = rate gap."),
      q("The product build process is…", ["Publish → Proof → Design", "Design → Proof → Publish", "one step", "Proof → Design → Publish"], 1, "Publishing cascades proof from parent to children."),
      q("A product reaches the catalogue when…", ["it is designed", "proofed, published and within Available/Expiry dates", "a customer asks", "COB runs"], 1, "The catalogue is the menu customers order from."),
    ],
  },
];
const allConceptIds = COURSES.flatMap(c => c.sections.flatMap(s => s.concepts));
const conceptCourse = {};
const conceptSection = {};
COURSES.forEach(c => c.sections.forEach(s => s.concepts.forEach(id => { conceptCourse[id] = c.id; conceptSection[id] = s.id; })));

function usePersistentState(key, initial) {
  const [state, setState] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) setState(JSON.parse(saved));
    } catch (e) {
      // Keep the initial state if browser storage is unavailable or corrupted.
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      // Ignore storage quota/privacy-mode errors.
    }
  }, [state, loaded, key]);

  return [state, setState];
}

// ---- small UI atoms --------------------------------------------------------
const Mono = ({ children }) => (
  <code className="font-mono text-xs bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 break-words">{children}</code>
);

function BackButton({ label, onClick }) {
  return (
    <button onClick={onClick}
      className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
      <ChevronLeft size={15} /> {label}
    </button>
  );
}

function Bar({ pct }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Ring({ pct, size = 64 }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0d9488" strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} strokeLinecap="round"
        className="transition-all duration-700" />
    </svg>
  );
}

// ---- voice reader (Web Speech API) ---------------------------------------
// Reads the current page aloud. `getText` returns the text to speak; `resetKey`
// changes whenever the page content changes, so playback stops on navigation.

// Rank installed voices so the most natural-sounding one is picked by default.
// macOS/iOS "premium"/"enhanced" and Google/Microsoft Natural voices sound far
// less robotic than the default compact ones.
const VOICE_PREF = [
  /natural/i, /premium/i, /enhanced/i,
  /google (uk|us) english/i, /\bgoogle\b/i,
  /microsoft .*(natural|online)/i,
  /ava|samantha|serena|jenny|aria|libby|sonia|zira/i,
  /daniel|arthur|oliver|guy|ryan/i,
];
function rankVoice(v) {
  const name = `${v.name} ${v.voiceURI}`;
  let score = 0;
  VOICE_PREF.forEach((re, i) => { if (re.test(name)) score += (VOICE_PREF.length - i) * 10; });
  if (/^en(-|_)?(GB|US|AU|IE)?/i.test(v.lang)) score += 5;
  if (/compact|eloquence|fred|albert|zarvox|trinoids|whisper/i.test(name)) score -= 50;
  return score;
}

function useVoices() {
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const en = window.speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
      setVoices(en.sort((a, b) => rankVoice(b) - rankVoice(a)));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);
  return voices;
}

// Natural cloud voices via Puter.js (https://docs.puter.com/AI/txt2speech/).
// No API key: Puter bills the end user, with a free tier. Needs a network
// connection; the reader falls back to the device voice when unavailable.
const NATURAL_VOICES = [
  { id: "amy",    label: "Amy · UK female",   opts: { engine: "neural", voice: "Amy",    language: "en-GB" } },
  { id: "brian",  label: "Brian · UK male",   opts: { engine: "neural", voice: "Brian",  language: "en-GB" } },
  { id: "arthur", label: "Arthur · UK male",  opts: { engine: "neural", voice: "Arthur", language: "en-GB" } },
  { id: "joanna", label: "Joanna · US female",opts: { engine: "neural", voice: "Joanna", language: "en-US" } },
  { id: "matthew",label: "Matthew · US male", opts: { engine: "neural", voice: "Matthew",language: "en-US" } },
  { id: "nova",   label: "Nova · OpenAI",     opts: { provider: "openai", voice: "nova" } },
  { id: "onyx",   label: "Onyx · OpenAI",     opts: { provider: "openai", voice: "onyx" } },
];

// Split text into chunks at sentence boundaries, each under `max` characters.
function chunkText(text, max) {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  const out = [];
  let buf = "";
  for (const s of sentences) {
    if ((buf + s).length > max && buf) { out.push(buf.trim()); buf = ""; }
    buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function SpeakButton({ getText, resetKey, label = "Read aloud" }) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState("idle"); // idle | playing | paused | loading
  const [showOpts, setShowOpts] = useState(false);
  const [engine, setEngine] = useState("device"); // device | natural
  const voices = useVoices();
  const [voiceName, setVoiceName] = useState(null);
  const [naturalId, setNaturalId] = useState("amy");
  const [rate, setRate] = useState(0.95);
  const [note, setNote] = useState("");

  const audioRef = useRef(null);   // current <audio> for the natural engine
  const cancelRef = useRef(false); // aborts the natural playback loop

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    try {
      const s = JSON.parse(localStorage.getItem("tsa.voice") || "{}");
      if (s.engine) setEngine(s.engine);
      if (s.name) setVoiceName(s.name);
      if (s.naturalId) setNaturalId(s.naturalId);
      if (s.rate) setRate(s.rate);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("tsa.voice", JSON.stringify({ engine, name: voiceName, naturalId, rate })); } catch {}
  }, [engine, voiceName, naturalId, rate]);

  const hardStop = () => {
    cancelRef.current = true;
    try { window.speechSynthesis?.cancel(); } catch {}
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setStatus("idle");
  };

  useEffect(() => () => hardStop(), []);      // unmount
  useEffect(() => { hardStop(); setNote(""); }, [resetKey]); // page changed

  if (!supported && engine === "device") return null;

  const chosen = voices.find(v => v.name === voiceName) || voices[0] || null;

  // ---- device engine (Web Speech API) ----
  const startDevice = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    chunkText(text, 220).forEach((chunk, i, arr) => {
      const u = new SpeechSynthesisUtterance(chunk);
      if (chosen) { u.voice = chosen; u.lang = chosen.lang; } else { u.lang = "en-GB"; }
      u.rate = rate; u.pitch = 1;
      if (i === arr.length - 1) u.onend = () => setStatus("idle");
      synth.speak(u);
    });
    setStatus("playing");
  };

  // ---- natural engine (Puter.js cloud TTS) ----
  const startNatural = async (text) => {
    if (!window.puter?.ai?.txt2speech) {
      setNote("Cloud voice unavailable — using device voice.");
      return startDevice(text);
    }
    const v = NATURAL_VOICES.find(x => x.id === naturalId) || NATURAL_VOICES[0];
    const parts = chunkText(text, 2800);
    cancelRef.current = false;
    setStatus("loading");
    try {
      for (let i = 0; i < parts.length; i++) {
        if (cancelRef.current) return;
        const audio = await window.puter.ai.txt2speech(parts[i], v.opts);
        if (cancelRef.current) return;
        audio.playbackRate = rate;
        audioRef.current = audio;
        setStatus("playing");
        await new Promise((res) => {
          audio.onended = res;
          audio.onerror = res;
          audio.play().catch(res);
        });
      }
      if (!cancelRef.current) setStatus("idle");
    } catch (e) {
      setNote("Cloud voice failed — using device voice.");
      hardStop();
      startDevice(text);
    }
  };

  const start = () => {
    setNote("");
    const text = (getText() || "").replace(/\s+/g, " ").trim();
    if (!text) return;
    cancelRef.current = false;
    engine === "natural" ? startNatural(text) : startDevice(text);
  };

  const toggle = () => {
    if (status === "idle") return start();
    if (status === "loading") return hardStop();
    if (status === "playing") {
      if (engine === "natural") audioRef.current?.pause();
      else window.speechSynthesis.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      if (engine === "natural") audioRef.current?.play();
      else window.speechSynthesis.resume();
      setStatus("playing");
    }
  };

  const btnLabel = status === "idle" ? label
    : status === "loading" ? "Loading…"
    : status === "playing" ? "Pause" : "Resume";

  return (
    <span className="relative inline-flex items-center gap-1">
      <button onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
          status === "idle"
            ? "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800"
            : "border-teal-300 bg-teal-50 text-teal-800"}`}
        aria-label={btnLabel}>
        {status === "playing" ? <Pause size={14} /> : status === "paused" ? <Play size={14} /> : <Volume2 size={14} />}
        {btnLabel}
      </button>
      {status !== "idle" && (
        <button onClick={hardStop}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-slate-800"
          aria-label="Stop reading">
          <Square size={13} />
        </button>
      )}
      <button onClick={() => setShowOpts(o => !o)}
        className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-slate-700"
        aria-label="Voice settings" title="Voice settings">
        <ChevronRight size={13} className={showOpts ? "rotate-90 transition-transform" : "transition-transform"} />
      </button>

      {showOpts && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg">
          <div className="mb-2 inline-flex rounded-lg border border-slate-200 p-0.5">
            {[["device", "Device"], ["natural", "Natural ★"]].map(([id, lbl]) => (
              <button key={id} onClick={() => { setEngine(id); hardStop(); }}
                className={`px-2.5 py-1 text-xs rounded-md ${engine === id ? "bg-teal-600 text-white" : "text-slate-600"}`}>
                {lbl}
              </button>
            ))}
          </div>

          {engine === "device" ? (
            <>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Voice</label>
              <select value={chosen?.name || ""} onChange={e => { setVoiceName(e.target.value); hardStop(); }}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                {voices.length === 0 && <option>Loading voices…</option>}
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name}{/natural|premium|enhanced|google/i.test(v.name + v.voiceURI) ? "  ★" : ""} — {v.lang}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-400">macOS: add an “(Enhanced)” voice in System Settings → Accessibility → Spoken Content → Manage Voices.</p>
            </>
          ) : (
            <>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Cloud voice</label>
              <select value={naturalId} onChange={e => { setNaturalId(e.target.value); hardStop(); }}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                {NATURAL_VOICES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
              <p className="mt-1.5 text-xs text-slate-400">Powered by Puter.js — needs internet; free tier, no sign-in for light use. Page text is sent to the voice provider.</p>
            </>
          )}

          <label className="mt-3 block text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Speed {rate.toFixed(2)}×</label>
          <input type="range" min="0.7" max="1.3" step="0.05" value={rate}
            onChange={e => setRate(parseFloat(e.target.value))} className="w-full" />
          {note && <p className="mt-2 text-xs text-amber-600">{note}</p>}
        </div>
      )}
    </span>
  );
}

// ---- the 5-step ladder + concept view -------------------------------------
const STEP_META = [
  { icon: Target, label: "Concept", field: "title", accent: "text-teal-700" },
  { icon: Brain, label: "Simple meaning", field: "simple" },
  { icon: Globe, label: "Real-world example", field: "example" },
  { icon: HelpCircle, label: "Why it matters", field: "why" },
  { icon: Lightbulb, label: "Memory trick", field: "memory" },
];

function ConceptView({ conceptId, onOpen, onDone, isRead, mode, setMode }) {
  const c = CONCEPTS[conceptId];
  if (!c) return null;
  const modes = [
    { id: "steps", label: "5-Step" },
    { id: "deep", label: "Understand deeply" },
    { id: "simply", label: "Explain simply" },
  ];
  const speakText = () => {
    const s = [`${c.title}.`];
    if (mode === "deep") {
      if (c.how) s.push(`How it works. ${c.how}`);
      if (c.example) s.push(`For example. ${c.example}`);
      if (c.why) s.push(`Why banks use it. ${c.why}`);
      if (c.temenos) s.push(`In Temenos. ${c.temenos}`);
      if (c.memory) s.push(`Memory trick. ${c.memory}`);
    } else if (mode === "simply") {
      if (c.simple) s.push(c.simple);
      if (c.example) s.push(`If you saw it in a real bank. ${c.example}`);
    } else {
      if (c.simple) s.push(c.simple);
      if (c.example) s.push(`For example. ${c.example}`);
      if (c.why) s.push(`This matters because. ${c.why}`);
      if (c.memory) s.push(`To remember it. ${c.memory}`);
    }
    return s.join(" ");
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
        <span>{COURSES.find(x => x.id === conceptCourse[conceptId])?.title}</span>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{c.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === m.id ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <SpeakButton getText={speakText} resetKey={`${conceptId}:${mode}`} />
      </div>

      {slideImgSrc(conceptId) && (
        <figure className="mt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slideImgSrc(conceptId)} alt={`${c.title} — screenshot from the course slides`}
            loading="lazy"
            className="w-full rounded-xl border border-slate-200 bg-white" />
          <figcaption className="mt-1.5 text-xs text-slate-400">Screenshot from the course slides</figcaption>
        </figure>
      )}

      {mode === "steps" && (
        <ol className="mt-6 space-y-3">
          {STEP_META.map((s, i) => {
            const Icon = s.icon;
            const val = s.field === "title" ? c.title : c[s.field];
            return (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 text-sm font-semibold ring-1 ring-teal-100">{i + 1}</div>
                  {i < 4 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Icon size={13} /> {s.label}
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${i === 0 ? "font-semibold text-teal-800" : "text-slate-700"}`}>{val}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {mode === "deep" && (
        <div className="mt-6 space-y-4">
          {c.how && <Field label="How it works">{c.how}</Field>}
          <Field label="Real-world example">{c.example}</Field>
          <Field label="Why banks use it">{c.why}</Field>
          <Field label="How Temenos relates to it">{c.temenos}</Field>
          <Field label="Memory trick">{c.memory}</Field>
        </div>
      )}

      {mode === "simply" && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-lg leading-relaxed text-slate-800">{c.simple}</p>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">If you saw it in a real bank</div>
            <p className="text-slate-700 leading-relaxed">{c.example}</p>
          </div>
        </div>
      )}

      {c.temenos && mode !== "deep" && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">
            <Layers size={13} /> In Temenos
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{withMono(c.temenos)}</p>
        </div>
      )}

      {c.diagram && (
        <button onClick={() => onOpen({ view: "diagram", diagramId: c.diagram })}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900">
          <GitBranch size={15} /> View diagram: {DIAGRAMS[c.diagram].title} <ChevronRight size={14} />
        </button>
      )}

      {LABS.filter(l => l.related?.includes(conceptId)).map(l => (
        <button key={l.id} onClick={() => onOpen({ view: "lab", labId: l.id })}
          className="mt-4 flex w-full items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900">
          <Wrench size={15} /> Practice in sandbox: {l.title} <ChevronRight size={14} />
        </button>
      ))}

      {c.related?.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Related concepts</div>
          <div className="flex flex-wrap gap-2">
            {c.related.filter(r => CONCEPTS[r]).map(r => (
              <button key={r} onClick={() => onOpen({ view: "concept", conceptId: r })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-teal-300 hover:text-teal-800 transition-colors">
                {CONCEPTS[r].title} <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button onClick={onDone}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isRead ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
          {isRead ? <><CheckCircle2 size={16} /> Marked as read</> : <><Check size={16} /> Mark as read</>}
        </button>
      </div>

      {(() => {
        const idx = allConceptIds.indexOf(conceptId);
        const prev = idx > 0 ? allConceptIds[idx - 1] : null;
        const next = idx >= 0 && idx < allConceptIds.length - 1 ? allConceptIds[idx + 1] : null;
        return (
          <div className="mt-6 flex items-stretch gap-3 border-t border-slate-200 pt-4">
            {prev ? (
              <button onClick={() => onOpen({ view: "concept", conceptId: prev })}
                className="group flex-1 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft size={12} /> Previous</div>
                <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-teal-800 line-clamp-1">{CONCEPTS[prev].title}</div>
              </button>
            ) : <div className="flex-1" />}
            {next ? (
              <button onClick={() => onOpen({ view: "concept", conceptId: next })}
                className="group flex-1 rounded-lg border border-slate-200 bg-white p-3 text-right hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-end gap-1 text-xs text-slate-400">Next <ArrowRight size={12} /></div>
                <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-teal-800 line-clamp-1">{CONCEPTS[next].title}</div>
              </button>
            ) : <div className="flex-1" />}
          </div>
        );
      })()}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">{label}</div>
      <p className="text-sm leading-relaxed text-slate-700">{withMono(children)}</p>
    </div>
  );
}

// turn dotted UPPERCASE identifiers into <Mono> chips
function withMono(text) {
  if (typeof text !== "string") return text;
  const parts = text.split(/(\b[A-Z][A-Z0-9]+(?:\.[A-Z0-9]+)+\b|\bAAACT\b|\bINAU\b|\bIHLD\b|\bINAO\b|\bRNAU\b|\bEMI\b|\bRFR\b|\bNAB\b|\bGRC\b|\bDEL\b|\bDAO\b|\bSCV\b|\bRBHP\b|\bUSSP\b|\bDFE\b|\bCOB\b)/g);
  return parts.map((p, i) =>
    /^[A-Z][A-Z0-9]+(\.[A-Z0-9]+)+$|^(AAACT|INAU|IHLD|INAO|RNAU|EMI|RFR|NAB|GRC|DEL|DAO|SCV|RBHP|USSP|DFE|COB)$/.test(p)
      ? <Mono key={i}>{p}</Mono> : <span key={i}>{p}</span>
  );
}

// ---- Quiz runner -----------------------------------------------------------
function QuizRunner({ title, questions, onFinish }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const cur = questions[i];
  const done = i >= questions.length;

  if (done) {
    const correct = answers.filter(a => a.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold text-slate-900">{title} — results</h2>
        <div className="mt-4 flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-5">
          <Ring pct={pct} />
          <div>
            <div className="text-3xl font-semibold text-slate-900">{pct}%</div>
            <div className="text-sm text-slate-500">{correct} of {questions.length} correct</div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {answers.map((a, idx) => (
            <div key={idx} className={`rounded-lg border p-3 text-sm ${a.correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
              <div className="flex items-start gap-2">
                {a.correct ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" /> : <X size={16} className="text-rose-600 mt-0.5 shrink-0" />}
                <div>
                  <div className="font-medium text-slate-800">{questions[idx].question}</div>
                  {!a.correct && <div className="text-slate-600 mt-0.5">Answer: {questions[idx].options[questions[idx].answer]}</div>}
                  <div className="text-slate-500 mt-0.5">{questions[idx].explanation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => onFinish(pct, correct, questions.length)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
          Done <Check size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{title}</span>
        <span>{i + 1} / {questions.length}</span>
      </div>
      <Bar pct={((i) / questions.length) * 100} />
      <h2 className="mt-5 text-lg font-medium text-slate-900 leading-snug">{withMono(cur.question)}</h2>
      <div className="mt-4 space-y-2">
        {cur.options.map((opt, oi) => {
          const chosen = picked === oi;
          const reveal = picked !== null;
          const isAns = oi === cur.answer;
          let cls = "border-slate-200 bg-white hover:border-slate-300";
          if (reveal && isAns) cls = "border-emerald-300 bg-emerald-50";
          else if (reveal && chosen && !isAns) cls = "border-rose-300 bg-rose-50";
          return (
            <button key={oi} disabled={reveal} onClick={() => setPicked(oi)}
              className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-colors ${cls}`}>
              <span className="text-slate-800">{withMono(opt)}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
          <div className={`font-medium ${picked === cur.answer ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === cur.answer ? "Correct" : "Not quite"}
          </div>
          <p className="mt-1 text-slate-600">{withMono(cur.explanation)}</p>
          <button onClick={() => {
            setAnswers(a => [...a, { correct: picked === cur.answer }]);
            setPicked(null); setI(i + 1);
          }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            {i + 1 < questions.length ? "Next question" : "See results"} <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Flashcards ------------------------------------------------------------
function Flashcards({ pool, flash, setFlash, title }) {
  const [order, setOrder] = useState(pool);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setOrder(pool); setI(0); setFlipped(false); }, [pool]);

  if (order.length === 0) return <p className="text-slate-500">No flashcards here yet.</p>;
  const id = order[i];
  const c = CONCEPTS[id];
  const status = flash[id];

  const go = (d) => { setFlipped(false); setI((i + d + order.length) % order.length); };
  const mark = (s) => { setFlash(f => ({ ...f, [id]: s })); go(1); };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-400">{title} · {i + 1}/{order.length}</div>
        <button onClick={() => { setOrder([...order].sort(() => Math.random() - 0.5)); setI(0); setFlipped(false); }}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
          <Shuffle size={14} /> Shuffle
        </button>
      </div>
      <button onClick={() => setFlipped(f => !f)}
        className="group w-full text-left rounded-2xl border border-slate-200 bg-white p-8 min-h-52 flex flex-col justify-center transition-shadow hover:shadow-sm">
        {!flipped ? (
          <>
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Question</div>
            <div className="text-xl font-medium text-slate-900">What is {c.title}?</div>
            <div className="mt-4 text-xs text-slate-400 inline-flex items-center gap-1"><RotateCcw size={12} /> tap to flip</div>
          </>
        ) : (
          <>
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Answer</div>
            <div className="text-slate-800 leading-relaxed">{c.simple}</div>
            <div className="mt-3 text-sm text-teal-800 bg-teal-50 rounded-lg px-3 py-2">{c.memory}</div>
          </>
        )}
      </button>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => go(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={16} /> Prev</button>
        <div className="flex gap-2">
          <button onClick={() => mark("review")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${status === "review" ? "bg-amber-100 text-amber-800" : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"}`}>
            <RotateCcw size={14} /> Need review
          </button>
          <button onClick={() => mark("known")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${status === "known" ? "bg-emerald-100 text-emerald-800" : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50"}`}>
            <Check size={14} /> Known
          </button>
        </div>
        <button onClick={() => go(1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">Next <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// ---- Diagram renderer ------------------------------------------------------
function DiagramFlow({ id }) {
  const d = DIAGRAMS[id];
  if (!d) return null;
  const narrate = () => {
    const s = [`${d.title}.`, `${d.caption}`, `This flow has ${d.steps.length} stages.`];
    d.steps.forEach((st, i) => {
      const lead = i === 0 ? "First" : i === d.steps.length - 1 ? "Finally" : "Then";
      let line = `${lead}, ${st.label}`;
      if (st.sub) line += ` — ${st.sub}`;
      line += ".";
      if (st.tag) line += ` In Temenos this is ${st.tag.replace(/\./g, " dot ")}.`;
      s.push(line);
    });
    return s.join(" ");
  };
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-slate-900">{d.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{d.caption}</p>
      <div className="mt-3">
        <SpeakButton getText={narrate} resetKey={id} label="Walk me through it" />
      </div>
      <div className="mt-6 space-y-0">
        {d.steps.map((s, i) => (
          <div key={i}>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 text-sm font-semibold">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{s.label}</div>
                  {s.sub && <div className="text-sm text-slate-500">{s.sub}</div>}
                </div>
                {s.tag && <Mono>{s.tag}</Mono>}
              </div>
            </div>
            {i < d.steps.length - 1 && (
              <div className="flex justify-center py-1.5"><div className="text-slate-300">↓</div></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Sandbox drills ------------------------------------------------------
function LabsList({ go }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sandbox drills</h1>
      <p className="mt-1 text-sm text-slate-500">Step-by-step things to try in a Temenos training sandbox. Verify exact menu names in your own environment.</p>
      {COURSES.filter(c => LABS.some(l => l.courseId === c.id)).map(c => (
        <div key={c.id} className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">{c.title}</div>
          <div className="grid grid-cols-2 gap-3">
            {LABS.filter(l => l.courseId === c.id).map(l => (
              <button key={l.id} onClick={() => go({ view: "lab", labId: l.id })}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-teal-300 transition-colors">
                <Wrench size={18} className="text-teal-600" />
                <div className="mt-2 font-medium text-slate-900">{l.title}</div>
                <div className="text-sm text-slate-500 line-clamp-2">{l.goal}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LabView({ id, onOpen }) {
  const l = LABS.find(x => x.id === id);
  if (!l) return null;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{l.title}</h1>
      <p className="mt-2 text-slate-700 leading-relaxed">{l.goal}</p>

      <div className="mt-3">
        <SpeakButton
          getText={() => [
            l.title, l.goal,
            ...l.steps.flatMap((s, i) => [`Step ${i + 1}.`, s.do, s.expect ? `Expect: ${s.expect}` : ""]),
            l.verify ? `Done when: ${l.verify}` : "",
          ].filter(Boolean).join(". ")}
          resetKey={l.id} />
      </div>

      <div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
        <div><span className="text-slate-400 uppercase text-xs tracking-wide mr-2">Application</span>{withMono(l.app)}</div>
        <div><span className="text-slate-400 uppercase text-xs tracking-wide mr-2">Where</span>{withMono(l.menu)}</div>
        {l.prereq && <div><span className="text-slate-400 uppercase text-xs tracking-wide mr-2">Prereq</span>{withMono(l.prereq)}</div>}
      </div>

      <ol className="mt-6 space-y-3">
        {l.steps.map((s, i) => (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 text-sm font-semibold ring-1 ring-teal-100">{i + 1}</div>
              {i < l.steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
            </div>
            <div className="pb-1">
              <p className="text-sm leading-relaxed text-slate-800">{withMono(s.do)}</p>
              {s.expect && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  <span className="text-xs uppercase tracking-wide text-slate-400 mr-1.5">Expect</span>{withMono(s.expect)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {l.verify && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-600 mb-1.5"><Check size={13} /> Done when</div>
          <p className="text-sm leading-relaxed text-emerald-900">{withMono(l.verify)}</p>
        </div>
      )}
      {l.note && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5"><Lightbulb size={13} /> Note</div>
          <p className="text-sm leading-relaxed text-slate-700">{withMono(l.note)}</p>
        </div>
      )}

      {l.related?.filter(r => CONCEPTS[r]).length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Concepts this covers</div>
          <div className="flex flex-wrap gap-2">
            {l.related.filter(r => CONCEPTS[r]).map(r => (
              <button key={r} onClick={() => onOpen({ view: "concept", conceptId: r })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-teal-300 hover:text-teal-800 transition-colors">
                {CONCEPTS[r].title} <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
export default function App() {
  const [progress, setProgress] = usePersistentState("temenos-progress-v1", {
    read: {}, quiz: {}, assess: {}, flash: {}, last: null,
  });
  const [nav, setNav] = useState({ view: "dashboard" });
  const [conceptMode, setConceptMode] = useState("steps");
  const [query, setQuery] = useState("");

  const go = (n) => { setNav(n); if (n.view === "concept") setConceptMode("steps"); window.scrollTo?.(0, 0); };

  // progress helpers
  const isRead = (id) => !!progress.read[id];
  const markRead = (id) => setProgress(p => ({ ...p, read: { ...p.read, [id]: !p.read[id] } }));
  const coursePct = (c) => {
    const ids = c.sections.flatMap(s => s.concepts);
    const done = ids.filter(isRead).length;
    return Math.round((done / ids.length) * 100);
  };
  const overallPct = Math.round((allConceptIds.filter(isRead).length / allConceptIds.length) * 100);
  const conceptsLearned = allConceptIds.filter(isRead).length;
  const quizTaken = Object.keys(progress.quiz).length;
  const avgQuiz = quizTaken ? Math.round(Object.values(progress.quiz).reduce((a, b) => a + b.pct, 0) / quizTaken) : 0;
  const dueFlash = allConceptIds.filter(id => progress.flash[id] === "review" || !progress.flash[id]).length;

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const t = query.toLowerCase();
    const cs = allConceptIds.filter(id => CONCEPTS[id].title.toLowerCase().includes(t) || CONCEPTS[id].simple.toLowerCase().includes(t))
      .map(id => ({ type: "concept", id }));
    const co = COURSES.filter(c => c.title.toLowerCase().includes(t)).map(c => ({ type: "course", id: c.id }));
    return [...co, ...cs].slice(0, 12);
  }, [query]);

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "flashcards", label: "Flashcards", icon: BookMarked },
    { id: "diagrams", label: "Diagrams", icon: GitBranch },
    { id: "labs", label: "Sandbox", icon: Wrench },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => go({ view: "dashboard" })} className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white"><GraduationCap size={16} /></div>
              <span className="font-semibold tracking-tight">Temenos Study</span>
            </button>
            <div className="ml-auto relative w-56">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={e => { setQuery(e.target.value); if (e.target.value) go({ view: "search" }); }}
                placeholder="Search…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-teal-400 focus:bg-white" />
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap items-center gap-1">
            {NAV.map(n => {
              const Icon = n.icon;
              const active = nav.view === n.id
                || (n.id === "courses" && ["course", "section", "concept", "quiz", "assessment"].includes(nav.view))
                || (n.id === "diagrams" && nav.view === "diagram")
                || (n.id === "labs" && nav.view === "lab");
              return (
                <button key={n.id} onClick={() => go({ view: n.id })}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${active ? "bg-teal-50 text-teal-800 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
                  <Icon size={15} /> {n.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Main */}
        <main className="min-w-0">
          {nav.view === "dashboard" && (
            <Dashboard {...{ overallPct, conceptsLearned, avgQuiz, dueFlash, quizTaken, coursePct, progress, go }} />
          )}
          {nav.view === "courses" && (
            <CoursesList {...{ coursePct, go }} />
          )}
          {nav.view === "course" && (
            <CourseView course={COURSES.find(c => c.id === nav.courseId)} {...{ isRead, coursePct, progress, go }} />
          )}
          {nav.view === "section" && (
            <SectionView nav={nav} {...{ isRead, progress, go }} />
          )}
          {nav.view === "concept" && (
            <div>
              <BackButton label={COURSES.find(c => c.id === conceptCourse[nav.conceptId])?.sections.find(s => s.id === conceptSection[nav.conceptId])?.title || "Back"}
                onClick={() => go({ view: "section", courseId: conceptCourse[nav.conceptId], sectionId: conceptSection[nav.conceptId] })} />
              <ConceptView conceptId={nav.conceptId} onOpen={go} isRead={isRead(nav.conceptId)}
                mode={conceptMode} setMode={setConceptMode}
                onDone={() => { markRead(nav.conceptId); setProgress(p => ({ ...p, last: nav.conceptId })); }} />
            </div>
          )}
          {nav.view === "quiz" && (() => {
            const course = COURSES.find(c => c.id === nav.courseId);
            const section = course.sections.find(s => s.id === nav.sectionId);
            return (
              <div>
                <BackButton label={`Exit to ${section.title}`} onClick={() => go({ view: "section", courseId: course.id, sectionId: section.id })} />
                <QuizRunner title={`${section.title} quiz`} questions={section.quiz}
                  onFinish={(pct) => { setProgress(p => ({ ...p, quiz: { ...p.quiz, [section.id]: { pct } } })); go({ view: "section", courseId: course.id, sectionId: section.id }); }} />
              </div>
            );
          })()}
          {nav.view === "assessment" && (() => {
            const course = COURSES.find(c => c.id === nav.courseId);
            return (
              <div>
                <BackButton label={`Exit to ${course.title}`} onClick={() => go({ view: "course", courseId: course.id })} />
                <QuizRunner title={`${course.title} — assessment`} questions={course.assessment}
                  onFinish={(pct) => { setProgress(p => ({ ...p, assess: { ...p.assess, [course.id]: { pct } } })); go({ view: "course", courseId: course.id }); }} />
              </div>
            );
          })()}
          {nav.view === "flashcards" && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
              <p className="mt-1 text-sm text-slate-500">Flip, then mark each Known or Need review.</p>
              <FlashcardPicker flash={progress.flash} setFlash={fn => setProgress(p => ({ ...p, flash: typeof fn === "function" ? fn(p.flash) : fn }))} />
            </div>
          )}
          {nav.view === "diagrams" && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Diagrams</h1>
              <p className="mt-1 text-sm text-slate-500">Key Temenos processes as simple flows.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {Object.entries(DIAGRAMS).map(([k, d]) => (
                  <button key={k} onClick={() => go({ view: "diagram", diagramId: k })}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-teal-300 transition-colors">
                    <GitBranch size={18} className="text-teal-600" />
                    <div className="mt-2 font-medium text-slate-900">{d.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-2">{d.caption}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {nav.view === "diagram" && (
            <div>
              <button onClick={() => go({ view: "diagrams" })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> Diagrams</button>
              <DiagramFlow id={nav.diagramId} />
            </div>
          )}
          {nav.view === "labs" && <LabsList go={go} />}
          {nav.view === "lab" && (
            <div>
              <button onClick={() => go({ view: "labs" })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> Sandbox drills</button>
              <LabView id={nav.labId} onOpen={go} />
            </div>
          )}
          {nav.view === "progress" && (
            <ProgressView {...{ overallPct, conceptsLearned, coursePct, progress }} />
          )}
          {nav.view === "search" && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
              {query.trim() === "" ? <p className="mt-2 text-slate-500">Type above to search concepts and courses.</p> : (
                <div className="mt-4 space-y-2">
                  {searchResults.length === 0 && <p className="text-slate-500">Nothing found for "{query}".</p>}
                  {searchResults.map((r, i) => r.type === "concept" ? (
                    <button key={i} onClick={() => go({ view: "concept", conceptId: r.id })}
                      className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300">
                      <div className="text-xs text-slate-400">Concept · {COURSES.find(c => c.id === conceptCourse[r.id])?.title}</div>
                      <div className="font-medium text-slate-900">{CONCEPTS[r.id].title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{CONCEPTS[r.id].simple}</div>
                    </button>
                  ) : (
                    <button key={i} onClick={() => go({ view: "course", courseId: r.id })}
                      className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300">
                      <div className="text-xs text-slate-400">Course</div>
                      <div className="font-medium text-slate-900">{COURSES.find(c => c.id === r.id).title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ---- Dashboard -------------------------------------------------------------
function Dashboard({ overallPct, conceptsLearned, avgQuiz, dueFlash, quizTaken, coursePct, progress, go }) {
  const nextConcept = allConceptIds.find(id => !progress.read[id]);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Understanding over memorization. Learn → test → review → connect → recall.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard label="Overall progress" value={`${overallPct}%`} sub={`${conceptsLearned}/${allConceptIds.length} concepts`} ring={overallPct} />
        <StatCard label="Quiz average" value={quizTaken ? `${avgQuiz}%` : "—"} sub={`${quizTaken} quizzes taken`} />
        <StatCard label="Flashcards due" value={dueFlash} sub="to review" />
        <StatCard label="Courses" value={COURSES.length} sub="4 more can be added" />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">What to study next</div>
            <div className="mt-1 text-lg font-medium text-slate-900">
              {nextConcept ? CONCEPTS[nextConcept].title : "All concepts read — revise with flashcards"}
            </div>
          </div>
          {nextConcept && (
            <button onClick={() => go({ view: "concept", conceptId: nextConcept })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
              Continue <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">Your courses</h2>
      <div className="grid grid-cols-2 gap-3">
        {COURSES.map(c => (
          <CourseCard key={c.id} course={c} pct={coursePct(c)} go={go} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, ring }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      {ring !== undefined && <Ring pct={ring} size={52} />}
    </div>
  );
}

function CourseCard({ course, pct, go }) {
  const conceptCount = course.sections.flatMap(s => s.concepts).length;
  const quizCount = course.sections.length;
  return (
    <button onClick={() => go({ view: "course", courseId: course.id })}
      className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-teal-300 transition-colors">
      <div className="flex items-center justify-between">
        <Mono>{course.code}</Mono>
        <span className="text-xs text-slate-400">{pct}%</span>
      </div>
      <div className="mt-2 font-medium text-slate-900 leading-snug">{course.title}</div>
      <div className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description}</div>
      <div className="mt-3"><Bar pct={pct} /></div>
      <div className="mt-2 text-xs text-slate-400">{course.sections.length} sections · {conceptCount} concepts · {quizCount} quizzes</div>
    </button>
  );
}

function CoursesList({ coursePct, go }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
      <p className="mt-1 text-sm text-slate-500">{COURSES.length} available. The architecture supports adding the remaining 4 as data.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {COURSES.map(c => <CourseCard key={c.id} course={c} pct={coursePct(c)} go={go} />)}
      </div>
    </div>
  );
}

function CourseView({ course, isRead, coursePct, progress, go }) {
  return (
    <div>
      <button onClick={() => go({ view: "courses" })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> Courses</button>
      <div className="flex items-center gap-2"><Mono>{course.code}</Mono></div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-1 text-sm text-slate-500 max-w-2xl">{course.description}</p>
      <div className="mt-3 max-w-xs"><Bar pct={coursePct(course)} /></div>

      <div className="mt-6 space-y-3">
        {course.sections.map((s, i) => {
          const done = s.concepts.filter(isRead).length;
          const quizScore = progress.quiz[s.id]?.pct;
          return (
            <button key={s.id} onClick={() => go({ view: "section", courseId: course.id, sectionId: s.id })}
              className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 text-sm font-medium">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900">{s.title}</div>
                  <div className="text-sm text-slate-500 line-clamp-1">{s.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">{done}/{s.concepts.length} concepts</div>
                  {quizScore !== undefined && <div className="text-xs text-teal-700 font-medium">Quiz {quizScore}%</div>}
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-medium text-slate-900"><Award size={18} className="text-teal-600" /> End-of-course assessment</div>
          <div className="text-sm text-slate-500 mt-0.5">{course.assessment.length} questions across knowledge, understanding and application.
            {progress.assess[course.id] && <span className="text-teal-700 font-medium"> Last: {progress.assess[course.id].pct}%</span>}
          </div>
        </div>
        <button onClick={() => go({ view: "assessment", courseId: course.id })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Start <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}

function SectionView({ nav, isRead, progress, go }) {
  const course = COURSES.find(c => c.id === nav.courseId);
  const section = course.sections.find(s => s.id === nav.sectionId);
  const quizScore = progress.quiz[section.id]?.pct;
  return (
    <div>
      <button onClick={() => go({ view: "course", courseId: course.id })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> {course.title}</button>
      <h1 className="text-2xl font-semibold tracking-tight">{section.title}</h1>
      <p className="mt-1 text-sm text-slate-500 max-w-2xl">{section.description}</p>

      <h2 className="mt-6 mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Concepts</h2>
      <div className="space-y-2">
        {section.concepts.map(id => (
          <button key={id} onClick={() => go({ view: "concept", conceptId: id })}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300 transition-colors">
            {isRead(id) ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> : <Circle size={18} className="text-slate-300 shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900">{CONCEPTS[id].title}</div>
              <div className="text-sm text-slate-500 line-clamp-1">{CONCEPTS[id].simple}</div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-medium text-slate-900"><ListChecks size={18} className="text-teal-600" /> Section quiz</div>
          <div className="text-sm text-slate-500 mt-0.5">{section.quiz.length} questions.{quizScore !== undefined && <span className="text-teal-700 font-medium"> Last: {quizScore}%</span>}</div>
        </div>
        <button onClick={() => go({ view: "quiz", courseId: course.id, sectionId: section.id })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">Take quiz <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}

function FlashcardPicker({ flash, setFlash }) {
  const [scope, setScope] = useState("all");
  const pool = scope === "all" ? allConceptIds
    : scope === "due" ? allConceptIds.filter(id => flash[id] === "review" || !flash[id])
    : COURSES.find(c => c.id === scope).sections.flatMap(s => s.concepts);
  return (
    <div className="mt-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <ScopeBtn active={scope === "all"} onClick={() => setScope("all")}>All ({allConceptIds.length})</ScopeBtn>
        <ScopeBtn active={scope === "due"} onClick={() => setScope("due")}>Due for review</ScopeBtn>
        {COURSES.map(c => <ScopeBtn key={c.id} active={scope === c.id} onClick={() => setScope(c.id)}>{c.code}</ScopeBtn>)}
      </div>
      <Flashcards pool={pool} flash={flash} setFlash={setFlash} title={scope === "all" ? "All courses" : scope === "due" ? "Due for review" : COURSES.find(c => c.id === scope).title} />
    </div>
  );
}

function ScopeBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${active ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
      {children}
    </button>
  );
}

function ProgressView({ overallPct, conceptsLearned, coursePct, progress }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
      <div className="mt-5 flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-5">
        <Ring pct={overallPct} size={72} />
        <div>
          <div className="text-3xl font-semibold text-slate-900">{overallPct}%</div>
          <div className="text-sm text-slate-500">{conceptsLearned} of {allConceptIds.length} concepts read across {COURSES.length} courses</div>
        </div>
      </div>
      <h2 className="mt-6 mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">By course</h2>
      <div className="space-y-3">
        {COURSES.map(c => {
          const pct = coursePct(c);
          const secDone = c.sections.filter(s => s.concepts.every(id => progress.read[id])).length;
          const assess = progress.assess[c.id]?.pct;
          return (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-900">{c.title}</div>
                <span className="text-sm text-slate-400">{pct}%</span>
              </div>
              <div className="mt-2"><Bar pct={pct} /></div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{secDone}/{c.sections.length} sections complete</span>
                <span>{c.sections.filter(s => progress.quiz[s.id] !== undefined).length}/{c.sections.length} quizzes taken</span>
                {assess !== undefined && <span className="text-teal-700 font-medium">Assessment {assess}%</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
