"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Home, BookOpen, Layers, GitBranch, BarChart3, Search, ChevronRight,
  ChevronLeft, Check, X, RotateCcw, Shuffle, ArrowRight, ArrowLeft,
  CheckCircle2, Circle, Target, Brain, Globe, HelpCircle, Lightbulb,
  GraduationCap, ListChecks, Menu, BookMarked, Award, Wrench
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
    related: ["aa2overrides", "aa2findloan"], diagram: "aa2createflow",
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
        concepts: ["aa2ids", "aa2roles", "aa2commit", "aa2repayfreq", "aa2settle", "aa2properties", "aa2create", "aa2overrides", "aa2authorise"],
        quiz: [
          q("Which ID is generated when the activity is validated?", ["Activity ID (AAACT…)", "Arrangement ID (AA…)", "Account ID", "Customer ID"], 1, "AAACT… is at attempt; AA… (Arrangement ID) is at validation; plus an Account ID."),
          q("The initial arrangement ID before generation is…", ["AA…", "AAACT…", "NEW", "0000"], 2, "It starts as NEW, then IDs are generated."),
          q("Customer roles on an arrangement are held in…", ["CUSTOMER", "AA.CUSTOMER.ROLE", "RELATION", "AA.ARRANGEMENT"], 1, "AA.CUSTOMER.ROLE holds Applicant/Guarantor/Beneficiary; the first beneficial owner drives accounting/tax/limits."),
          q("The Pay Out account is where…", ["repayments are collected", "the loan is disbursed to", "charges are booked", "interest accrues"], 1, "Pay Out = disbursed-to; Pay In = repayments-from."),
          q("Commitment can be entered using which shortcuts?", ["K and B", "T (thousands) and M (millions)", "H and G", "none"], 1, "T = thousands, M = millions; also, either term or maturity is required."),
          q("After accepting overrides on commit, the arrangement is…", ["Current", "Unauthorised", "Closed", "Simulated"], 1, "It's Unauthorised until a second user authorises it."),
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
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
        <span>{COURSES.find(x => x.id === conceptCourse[conceptId])?.title}</span>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{c.title}</h1>

      <div className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === m.id ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>
            {m.label}
          </button>
        ))}
      </div>

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
  const parts = text.split(/(\b[A-Z][A-Z0-9]+(?:\.[A-Z0-9]+)+\b|\bAAACT\b|\bINAU\b|\bEMI\b|\bRFR\b|\bNAB\b|\bGRC\b|\bDEL\b|\bDAO\b|\bSCV\b|\bRBHP\b|\bUSSP\b|\bDFE\b|\bCOB\b)/g);
  return parts.map((p, i) =>
    /^[A-Z][A-Z0-9]+(\.[A-Z0-9]+)+$|^(AAACT|INAU|EMI|RFR|NAB|GRC|DEL|DAO|SCV|RBHP|USSP|DFE|COB)$/.test(p)
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
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-slate-900">{d.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{d.caption}</p>
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
                || (n.id === "diagrams" && nav.view === "diagram");
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
