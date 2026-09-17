"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home, BookOpen, Layers, GitBranch, BarChart3, Search, ChevronRight,
  ChevronLeft, Check, X, RotateCcw, Shuffle, ArrowRight, ArrowLeft,
  CheckCircle2, Circle, Target, Brain, Globe, HelpCircle, Lightbulb,
  GraduationCap, ListChecks, Menu, BookMarked, Award, Wrench,
  Volume2, Square, Pause, Play, ClipboardList, Palette, Sun, Moon, Monitor, Calculator
} from "lucide-react";
import { UAT_MODULES } from "./uatData";

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
    how: "DAO codes are set up as a hierarchy, not a flat list: each organisational level (Head Office, Province/Region, Branch, Department, individual officer) is given its own numeric code range, and each range records a Level and a Parent Level so the codes roll up — a Branch's parent level points to its Province, a Department's parent level points to its Branch, and so on. Creating a new officer means picking the next free code in the right range under the correct parent.",
    memory: "DAO = default account owner, stamped on every transaction. Ranges roll up: Head Office → Province → Branch → Department → Officer.",
    temenos: "DEPT.ACCT.OFFICER; typically banded by range per level, e.g. 1000s = Head Office, 2000s = Provinces, 3000s = Branches, 4000s = Departments, 5000s–6000s = individual T24 users/staff — each record's Level and Parent Level field link it up the hierarchy. Can link to a USER ID to auto-subscribe that user to the officer's tasks; bulk transfers move a whole portfolio between DAOs.",
    related: ["custrec", "relation", "bulkao"], diagram: "daohierarchy",
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
    temenos: "Internal product lines are created by Temenos; clients can only change the description. The LENDING line (\"Retail Lending Product such as Mortgages, Lines of Credit\") lists ~27 property classes with a Mandatory Y/N flag each — mandatory ones include ACCOUNT, ACCOUNTING, ACTIVITY.MAPPING, CUSTOMER, ELIGIBILITY, PAYMENT.RULES and PAYMENT.SCHEDULE.",
    related: ["aa2prodgroup", "aa2buscomp"], diagram: "aa2hierarchy",
  },
  aa2prodgroup: {
    title: "Product Group",
    simple: "The second level — a user-definable subset of a product line.",
    example: "Under Lending: Mortgages, Working Capital Loans, Personal Loans.",
    why: "It organises products into meaningful families the bank controls.",
    memory: "Group = a family of products the client defines.",
    temenos: "User-definable; any number under a line. The BUSINESS.BANKING.LOAN group narrows the line to ~13 property classes and names the specific properties, e.g. Interest Calculation → PRINCIPALINT + PENALTYINT, Charge → NEWARRFEE / PAYOFFFEE / DRAWINGFEE, Payment Rules → PR.REPAYMENT / PR.PRINCIPAL.DECREASE / PR.PAYOFF.",
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
    temenos: "Values assigned to business-component fields at product level; determine the differences between products. Example: BB.TERM.LOANS.BR.ANNUITY (\"Base Rate Linked + Annuity\", Status Published) carries 27 Cat Properties (Principal Interest, Penalty Interest, Schedule, Overdue Ageing Rules, Pricing Grid, Charge-Off, Covenants…) plus Available / Last Published dates. In View mode you see the property list; drilling into a property's actual values needs input rights.",
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
    temenos: "Model Bank path: User Menu → Business Banking Operations → Product Catalog, then drill line → group → product (e.g. Lending → Base Rate Linked → Annuity/Bullet/Straight Line). The New Arrangement icon starts the sale; Simulate is also available.",
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
    temenos: "Filter by Owner/Arrangement/Product/Currency/Status; results show each arrangement's status. To list real internal loans, search AA.ARRANGEMENT on the Live File filtered by Product Line = LENDING. Note: the 'Find Pricing Arrangements' / AA.FIND.ARRANGEMENT.AX enquiry returns External Products (insurance, cards) only — not internal AA loans.",
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
    temenos: "Statuses are user-defined via EB.LOOKUP against AA.OVERDUE.STATUS; in NAB, interest posts to a suspense account, not P&L. The setup lives in AA.PRD.DES.OVERDUE — records such as BB.DAYS.WITH.TOLERANCE (\"Ageing by Days with Tolerance\") or BILLS.WITH.TOLERANCE (\"Ageing by Bills\"); each names which bill types are aged (INSTALLMENT, ACT.CHARGE, PAYMENT).",
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
    temenos: "Balances update through Temenos Transact Accounting; used in financial reporting, interest/charge calculation and periodic restriction. Live balances are held in EB.CONTRACT.BALANCES, keyed by contract id (e.g. 100109.0008100.01), each row a balance type with a date suffix — for a LIMIT contract you see UTIL / LINE / UTILBL / LINEBL (utilisation, line, and their blocked variants) with a value date and maturity date.",
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

  // ============ INSTRUCTOR TRAINING · DAY 1 ============
  // ---- Navigation & Commands ----
  t24command: {
    title: "The Command Line",
    simple: "The box at the top where you type an instruction directly instead of clicking through menus.",
    example: "Typing `S CUSTOMER 100343` opens customer 100343 in See (view) mode; `I CUSTOMER` starts a new one.",
    why: "Menus are for discovery; the command line is faster once you know the function and table you want.",
    how: "A command is usually FUNCTION + APPLICATION + (record id). Common functions: S = See (read-only view), I = Input (create/amend), A = Authorise, D = Delete/Reverse, C = Copy, P = Print, L = List. Add a record id to go straight to it, or leave it blank to be prompted.",
    memory: "Function · Application · Id  →  e.g. S CUSTOMER 100343.",
    temenos: "Same syntax as classic T24; the Browser command box accepts it directly. Versions are called as APPLICATION,VERSION (e.g. CUSTOMER,INPUT). Enquiries use ENQ <name>.",
    related: ["menufields", "fieldhelp", "enqcommand", "rbhp"],
  },
  menufields: {
    title: "Menus, Menu Items & Fields",
    simple: "How the classic tree menu is organised, and how an input screen is laid out into fields, multi-values and tabs.",
    example: "Customer sits under User Menu > Customer Relationship > Customer; the input screen groups fields onto tabs like Personal, Address, Officer.",
    why: "Knowing the menu path and the field layout is what lets you find and complete a record without guesswork.",
    how: "Menu items are shortcuts to a function+version. On a screen: single-value fields hold one value; multi-value fields (marked with + / arrows) repeat; associated multi-values move together; tabs group related fields. Mandatory fields must be filled before commit.",
    memory: "Menu item = a saved command; screen = fields on tabs, some repeating.",
    temenos: "Menu items are held in the menu design; each maps to an application and version. Field behaviour comes from the application's dictionary (STANDARD.SELECTION).",
    related: ["t24command", "fieldhelp", "custrec"],
  },
  fieldhelp: {
    title: "Field Help & Technical Names",
    simple: "Every field can tell you its underlying table, its technical field name and the data model behind it.",
    example: "The ⓘ info icon on the 'Search Customers' screen shows Title: Search Customers, Enquiry: SSI.YMB.EN.TE.CUSTOMERS.SEARCH, Command: ENQ SSI.YMB.EN.TE.CUSTOMERS.SEARCH — the real name and the exact command to run it.",
    why: "Business labels differ from the technical names you need for enquiries, DFE mappings, APIs and support tickets.",
    how: "The screen/enquiry ⓘ info action reveals its Title, technical name (enquiry / version / application) and the Command to reach it directly. Field-level help reveals the field's application (table), technical field name, field number and data type. The command line and enquiry designer use those technical names, not the on-screen labels.",
    memory: "Label is for people; the ⓘ info shows the name and command the system uses.",
    temenos: "Field technical names come from STANDARD.SELECTION for the application; the ⓘ popup gives the enquiry/version name and its ENQ/command string; enquiries, versions and the API all reference them.",
    related: ["menufields", "enqcommand", "t24command"],
  },
  enqcommand: {
    title: "Enquiry Command & Selection",
    simple: "Running an enquiry from the command line and narrowing it with selection criteria on technical fields.",
    example: "`ENQ CUSTOMER.LIST` lists customers; you add a selection like SECTOR EQ 1001 to filter, using the technical field name.",
    why: "Enquiries are the main way to read data in bulk; selection criteria let you answer a specific question fast.",
    how: "Type ENQ <enquiry name>, then optionally add selection lines (field, operator, value). Operators include EQ, NE, GT, LT, RG (range), LK (like). Results can be sorted and drilled into. The field names used are the technical ones from field help.",
    memory: "ENQ <name> → add field + operator + value to filter.",
    temenos: "Enquiries are defined in the ENQUIRY application (thousands of them); each names the FILE.NAME it reads. The record selector filters with Filter by / Operand / Value. Unauthorised-data variants read $NAU files (e.g. AA.AC.ARRANGEMENT.IHLD → AA.ARRANGEMENT.ACTIVITY$NAU). NOFILE enquiries build their rows at runtime.",
    related: ["fieldhelp", "t24command", "worklist"],
  },
  // ---- Security & Access ----
  companybranch: {
    title: "Company / Branch Management & Access",
    simple: "Transact can run many companies (branches/entities) in one system; a user's access is defined per company.",
    example: "A head-office user may see all provinces; a branch user only their own company's customers and accounts.",
    why: "One installation serves a whole banking group, so access and reporting must be scoped by company.",
    how: "Each company has its own code and mnemonic. A user record names the companies they can sign into and their home company. Branch/organisational structure also drives the DAO code hierarchy and MIS roll-up.",
    memory: "One system, many companies; access is granted company by company.",
    temenos: "COMPANY holds each entity; the USER record lists Company Restriction / allowed companies; see also USER.SMS.GROUP for grouping that access.",
    related: ["usersmsgroup", "ussp", "dao"],
  },
  usersmsgroup: {
    title: "USER.SMS.GROUP (Multi-Application / Multi-Company Access)",
    simple: "A reusable bundle of which applications and which companies a user is allowed — or not allowed — to use.",
    example: "A 'Branch Officer' SMS group allows CUSTOMER, ACCOUNT and AA applications across all province companies, and is attached to every branch officer's USER record.",
    why: "Setting application and company access on every user individually is slow and inconsistent; a group is defined once and reused.",
    how: "The group holds an Allowed list and a Not Allowed list for applications and for companies. Attach the group to a USER record instead of listing every permission on the user. What the user can actually reach = their SMS group(s) combined with their USSP.",
    memory: "USER.SMS.GROUP = a shared permission set: Allowed vs Not Allowed, apps × companies.",
    temenos: "USER.SMS.GROUP is referenced from USER; works alongside the User Security Profile (USSP) that governs the RBHP.",
    related: ["companybranch", "ussp", "rbhp", "usermaint"],
  },
  usermaint: {
    title: "Maintaining Users & Security Groups",
    simple: "Creating and amending the USER records staff sign in with, and the security groups those users are attached to.",
    example: "Onboarding a new branch officer: create their USER record, set sign-on name and initial password, home company and department, attach the 'Branch Officer' USER.SMS.GROUP, and authorise it.",
    why: "Every person who touches Transact needs a controlled, auditable identity with exactly the right access — no more, no less.",
    how: "A USER record carries: sign-on name, password (and a forced change on first login), start/end date, home company and the companies they may sign into, department/DAO code, language, classification (INPUTTER / AUTHORISER / etc.), and one or more USER.SMS.GROUP references. Status can be set to closed to suspend access without deleting history. Maintaining the groups themselves (adding an application or company to the Allowed list) instantly changes access for every user attached to that group. All of it is input-and-authorise.",
    memory: "USER = who signs in + their companies + their SMS group(s); close, don't delete, to suspend.",
    temenos: "USER application; classification drives input vs authorise rights; SMS group changes cascade to all attached users; run under the appropriate admin sign-on.",
    related: ["usersmsgroup", "companybranch", "ussp", "dao", "spf"],
  },
  spf: {
    title: "System Parameter File (SPF)",
    simple: "The single system-wide record that holds bank-wide settings, including the password policy every user must meet.",
    example: "SPF/SYSTEM sets Password Min Length, whether passwords need upper/lower/numeric/other characters, and how many past passwords can't be reused (Pwd Repetition).",
    why: "Security rules and system behaviour should be set once, centrally, not per user.",
    how: "SPF holds fields like Pwd Min Length, Pass Upper Alpha / Lower Alpha / Numeric / Other, Pwd Repetition, Autolog Time (idle sign-off), Version Auth Ctrl and Branch Id. The password fields are enforced whenever a USER record's password is set or changed. It is one record (SYSTEM), amended and authorised like any other.",
    memory: "SPF = the one record of bank-wide rules; the password policy lives here, not on the user.",
    temenos: "SPF, record SYSTEM; password composition rules apply to every USER; Autolog Time forces re-login after inactivity.",
    related: ["usermaint", "usersmsgroup", "ussp"],
  },
  recordlock: {
    title: "Record Locks & the $NAU File",
    simple: "While one user has a record open for input, it is locked; anyone else who opens it is told who holds it.",
    example: "You open customer 100154 to amend and get 'RECORD IS LOCKED BY USER YMBUSER5' — someone else is already editing it.",
    why: "Two people editing the same record at once would overwrite each other; the lock forces one-at-a-time input.",
    how: "The lock lives in RECORD.LOCK, keyed by file + record id, and carries the holding user, the window name, and an expire time so a crashed session's lock clears itself. Unauthorised versions of a record sit in a separate file suffixed $NAU (e.g. F.CUSTOMER$NAU) until authorised, when they move to the live file.",
    memory: "Open for input = locked; $NAU = the unauthorised copy waiting to be authorised.",
    temenos: "RECORD.LOCK holds active locks; $NAU (Not-Authorised) files hold INAU records; authorising moves the record to the live file and releases the lock.",
    related: ["aa2recordstatus", "usermaint", "menufields"],
  },
  // ---- Customer & Account Basics ----
  custindivnonindiv: {
    title: "Individual vs Non-Individual Customer",
    simple: "A customer record is either a person (Individual) or an organisation (Non-Individual); each captures different details.",
    example: "An Individual captures name, date of birth, gender and nationality; a Non-Individual (a company, SACCO or NGO) captures registration number, incorporation date and legal form.",
    why: "People and organisations are onboarded, KYC'd and reported differently, but both live in the same CUSTOMER application.",
    how: "The customer type drives which fields and tabs appear. Non-Individual customers can also be created automatically — e.g. an abbreviated group's members are held as lightweight Non-Individual records with only minimum details.",
    memory: "Individual = a person; Non-Individual = an organisation; same table, different fields.",
    temenos: "Both are CUSTOMER records; the type controls the field set; Sector 8001 additionally marks a customer as a bank.",
    related: ["custrec", "nonindiv", "custid", "abbrevgroup"],
  },
  abbrevgroup: {
    title: "Abbreviated vs Non-Abbreviated Groups",
    simple: "In an abbreviated group the members are captured as lightweight info-only records; in a non-abbreviated (standard) group each member is a full customer.",
    example: "An 'Organised/Registered Group' set up as ABBREVIATED lists its members with just name, designation and date of birth; a 'Joint Liability/Solidarity Group' set up as STANDARD requires each member to already exist as a full CUSTOMER.",
    why: "Registering every member of a large community group as a full customer is heavy; abbreviated groups let the bank record the structure without full onboarding.",
    how: "The Group Type sets the Group Class: ABBREVIATED or STANDARD (non-abbreviated). Abbreviated group members are held on the group record itself as multi-values (M Name.1, M Designation.1, M Date Of Birth.1 …) and, on authorisation, a lightweight Non-Individual customer is auto-created. Standard-group members are linked by their existing customer id. The abbreviated group is captured through a dedicated version (…MAIN.ABBR).",
    memory: "Abbreviated group = members are info-only lines on the group; Standard group = members are real customers.",
    temenos: "Group Class ABBREVIATED vs STANDARD comes from the Group Type; abbreviated members auto-create a Non-Individual CUSTOMER with minimum details; group types seen: YMB.REG.GRP, YMB.SOL.GRP, YMB.NONABR.GRP.",
    related: ["custindivnonindiv", "creategroup", "grouptype", "centre"],
  },

  // ---- Day 2: Accounts the New Way (Arrangement Architecture) ----
  aaaccount: {
    title: "Accounts as Arrangements — \"the New Way\"",
    simple: "In the current release a current/savings account is built as an AA arrangement on the Accounts product line, not as a classic ACCOUNT record keyed straight in.",
    example: "A 'Yehulu Ordinary Savings' account is a published product; opening one for a customer creates an arrangement (AA…) plus an account id — the same pattern as an AA loan.",
    why: "One product engine for loans, deposits and accounts means shared components (interest, charges, limits, statements) and controlled, parameter-driven product design.",
    how: "The account still has an account number and behaves like an account day-to-day, but underneath it is an arrangement made of property classes. Products are designed, proofed and published, then sold from the Product Catalog / Role Based Accounts Page. The old direct-input ACCOUNT application still exists for non-AA accounts (nostro, internal, suspense).",
    memory: "New way: Account = an arrangement on the Accounts product line, built and published like an AA product.",
    temenos: "AA Accounts product line; arrangement + account id generated on creation; account-line property classes include ACCOUNT, INTEREST, CHARGE, LIMIT, PAYMENT.SCHEDULE, DORMANCY, CLOSURE; classic ACCOUNT still used for bank/internal accounts. The FI menu item 'Account' is version SSI.YMB.TAB.AC.MAIN; in the Account Application Status enquiry the final origination stage shows as 'Arrangement Creation' — the tell that an account is an arrangement.",
    related: ["aoapplication", "aa2prodvsarr", "abbrevgroup", "custindivnonindiv"],
  },
  aoapplication: {
    title: "Account Origination (EM.AO.APPLICATION)",
    simple: "The staged workflow that takes an account application from capture to a live account.",
    example: "For customer 100082 on product YMPCompSav: Application Input, then Review/Approval (status 201 Approved), then Offer Production (status 701 Generate offer documents), then Arrangement Creation (status 901) — Txn Complete. 'Update Customer' was Not Required in this setup, so it was skipped.",
    why: "Account opening needs the same controlled, auditable, multi-step flow as lending — capture, check, approve, produce, create.",
    how: "The full stage set is: Application Input → Review / Approval → Update Customer → Offer Production → Account (Arrangement) Creation. Which stages apply is driven by the Account Origination parameter setup — each stage is Required, Optional, or Not Required per product / scenario, so a given application may run only 3 or 4 of them. Each stage is a tab on the application (Account Input, Interest and Charges, Settlement and Schedule, Eligibility Check, plus the stage's own tab and Audit). Origination is reached from the Single Customer View or the Role Based Accounts Page.",
    memory: "Input → Review/Approve → (Update Customer) → Offer → Create. Stages configured per Account Origination parameters; status codes 201 / 701 / 901.",
    temenos: "Application id prefixed AO…, activity id PA…; held in EM.AO.APPLICATION (final commit is version EM.AO.APPLICATION,ACCOUNT.CREATION); stage applicability from the Account Origination parameter record (Required / Optional / Not Required); Account Application Status enquiry shows each stage's Activity Status. Two entry points: the Role Based Accounts Page, or the customer's SCV → Portfolio tab → ⋯ menu → New Account Application (also New Deposit / New Loan Application there). A lean setup runs just Account Input + Online Application + Audit.",
    related: ["aaaccount", "acctrestriction", "scv", "custrec", "aa2create"], diagram: "aoflow",
  },
  acctrestriction: {
    title: "Account Restrictions & Pending Approvals",
    simple: "Ways to control an AA account after it's live — freeze posting for a period, and hold changes for a second person to approve.",
    example: "A disputed account gets a Posting Restriction blocking debits with a reason code until it's resolved; separately, an 'Update Account Details' activity sits in Pending Approval until a supervisor picks Approve / View / Edit / Delete.",
    why: "Operations must be able to freeze or amend an account without closing it, and every change is still two-person controlled.",
    how: "Posting Restrictions block debits and/or credits for a start/end date range, each with a block/unblock reason code — run as arrangement activities (<PRODUCTLINE>-START.RESTRICTION-ACCOUNT / END.RESTRICTION-ACCOUNT). Any activity you run on the account (update details, restriction, closure) is an Arrangement Activity (id AAACT…, e.g. AA.ARRANGEMENT.ACTIVITY,AA.DRILL) and, if it needs authorisation, shows in the account overview's Pending Approval list with an Approve / View / Edit / Delete menu.",
    memory: "Restriction = temporary posting freeze with a reason. Pending Approval = the account's own authorise queue.",
    temenos: "Block codes via virtual tables BLOCK.REASON.CODES / UNBLOCK.REASON.CODES; multiple restrictions with start/end dates and configurable pre-notice; the New User Activities menu groups every activity by property class — e.g. Balance Maintenance (Adjust Balances/Bills), Dormancy (Set / Reset Dormancy, Change Dormancy Condition), 'Release emergency block', Update Account Details; Limit Details, Facilities and Conditions and Pending Approval all sit on the account Overview.",
    related: ["lpb1posting", "aaaccount", "acctclosure", "aa2recordstatus"],
  },
  acctclosure: {
    title: "Account Closure",
    simple: "Closing an AA account: work out the settlement figure by simulation, produce a Closure Statement, choose how to pay the balance out, then perform the closure.",
    example: "A deceased customer's savings account (AA26062Q2V83): Calculate Payoff with Closure Reason 'Customer Has Passed Away', accept the 'settlement instruction not defined for PAYOFF$CURRENT' override, the simulation runs (Processing → Executed Successfully), the Closure Statement shows 60,000 to settle, choose Settle by Funds Transfer, then Perform Closure.",
    why: "Closing an account must be exact and auditable — every balance settled, the payout method recorded, and it can be dry-run first.",
    how: "From the account Overview → Facilities and Conditions → Simulate Closure (dry run) or Perform Closure (Live). Calculate Payoff creates a simulation (id AASIM…) with a Closure Reason and Payoff Date; it may raise overrides. When it executes, the Closure Statement lists the payoff amount itemised by property. Choose Closure Method decides how the balance leaves: Settle by Funds Transfer / Cash Payment / Draft / Official Cheque / Payment Order, or Write-Off to P&L. The live closure then runs the CLOSURE property's activities.",
    memory: "Calculate Payoff (simulate) → Closure Statement → Choose Closure Method → Perform Closure.",
    temenos: "Simulation id AASIM…, activity 'Calculate payoff for accounts', Simulation Status Processing → Executed - Successfully; Closure Reason from a lookup (e.g. DECEASED.CUSTOMER); PAYOFF$CURRENT payment type; Simulate vs Perform Closure (Live) on the account Overview; ties to the CLOSURE / CLOSURE Type property classes.",
    related: ["lpb2closure", "lpb2closuretype", "lpb2payoff", "aaaccount", "acctrestriction"], diagram: "acctclosureflow",
  },

  // ---- Day 2 (cont.): Teller & Cash Operations ----
  accountdeposit: {
    title: "Account Deposit",
    simple: "Paying money into a customer's account — a simple teller deposit is a cash/transfer transaction; a term deposit runs its own origination process.",
    example: "A cash deposit to a savings account posts immediately. Opening a fixed/term deposit runs Deposit Origination (EDO.DEPOSIT.ORIGINATION, a workflow process) with its own application-input stage. An account-to-account move can also go through a Payment Order (product ACOTHER - Account Transfer, id PI…).",
    why: "Deposits are the core inflow; term deposits need the same staged, auditable origination as loans and accounts.",
    how: "Simple deposit = a cash/transfer transaction against the account. A term deposit is an AA arrangement on the Deposits product line, opened via Customer Operations → Deposit Applications → Create Deposit / Simulate Deposit, or the customer's SCV Portfolio → New Deposit Application. The origination runs as a process (EDO.05.APPLICATION.INPUT…, Process Status RUNNING → complete), activity ids PA….",
    memory: "Cash in = a transaction; term deposit = an arrangement with its own origination (EDO…).",
    temenos: "Deposit origination = EDO.DEPOSIT.ORIGINATION run as PW.PROCESS,AUTO; Deposit Simulations tab for Simulate Deposit; Payment Order product ACOTHER for account transfers.",
    related: ["aaaccount", "aoapplication", "tillvault"],
  },
  denomination: {
    title: "Denomination",
    simple: "The note-and-coin breakdown recorded for a physical cash transaction, so the drawer's count always reconciles.",
    example: "A teller paying out 5,000 ETB records 10 × 500 notes. On a Till to Vault Transfer the Cash Paid Denom and Cash Received Denom tabs hold each side's breakdown.",
    why: "Physical cash must be counted by denomination for the till and the vault to balance.",
    how: "Attach Denomination sets up the denominations for a currency (from the Head Teller menu). Cash transactions — teller payments and receipts, till-to-vault transfers, vault load — carry Cash Paid Denom / Cash Received Denom sub-tabs where the count per denomination is entered; the totals must equal the transaction amount.",
    memory: "Denomination = how many of each note/coin — the count behind the amount.",
    temenos: "Attach Denomination on the Head Teller menu; Cash Paid Denom / Cash Received Denom tabs on cash transactions; totals reconcile against the transaction amount and the till/vault balance.",
    related: ["tillvault", "accountdeposit"],
  },
  tillvault: {
    title: "Till & Vault Cash Operations",
    simple: "How physical cash moves between a teller's till, other tills, and the branch vault.",
    example: "Start of day the Head Teller runs Load Vault; a teller running low gets a Till to Vault Transfer (or Till to Till from a colleague); end of day the teller raises a Till Closure Request and the Head Teller runs Unload Vault.",
    why: "Every branch note is tracked from vault to till to customer and back, always reconciled by denomination.",
    how: "From the Head Teller page: New Till (open a drawer), Attach Denomination, Load Vault / Unload Vault (cash in/out of the branch vault), Till to Vault Transfer (id TT…, move cash between a teller and the vault — vault is a special till, e.g. 9999), Till to Till (move cash between two tellers), Till Closure Request (a teller asks to close and hand back). Each carries From/To, Currency, Amount Local / Foreign and denomination detail.",
    memory: "Vault ↔ Till ↔ Till ↔ Customer — every move by denomination. Load/Unload Vault · Till to Vault · Till to Till.",
    temenos: "Head Teller / Teller Role Based Home Pages; Till to Vault Transfer id TT…; the vault is a special till (e.g. 9999); Currency Exchange Rates (Mid/Buy/Sell) on the Head Teller dashboard; Till Closure Request → Head Teller approval.",
    related: ["denomination", "accountdeposit"],
  },

  // ============ USER TRAINING (per the STRAJ / Pitron trainer modules) ============
  // ---- Module 1: Navigation & Sign-In ----
  signin: {
    title: "Signing In & the Landing Page",
    simple: "You reach Transact through a sign-in page (User Id + Password); after signing in you land on your Role-Based Home Page.",
    example: "A Customer Service Agent signs in and lands on a page with pending tasks, customers in branch, and quick links to the functions their role uses.",
    why: "The landing page is tailored to the job, so staff aren't hunting through menus they'll never use.",
    memory: "Sign in → your Role-Based Home Page (RBHP), not a blank menu.",
    temenos: "The front end is Transact Explorer; About (top-left Temenos icon) shows the release — e.g. UI 25, Transact R25. Password rules (length, character types) come from the SPF.",
    related: ["navicons", "companybranch", "rbhp"],
  },
  navicons: {
    title: "The Navigator Icons",
    simple: "The strip of icons down the left edge — how you reach menus, history, favourites, settings and your profile.",
    example: "You click Favourites, type the abbreviation you set for ACCOUNT, and jump straight there without walking the menu tree.",
    why: "Everything you do outside a record starts from one of these icons.",
    how: "Temenos icon → About / release version. Menu → the tree (menu → sub-menu → a version, enquiry or report). History → versions/enquiries you used this session (cleared on logout; you can re-run or create from them). Products → apps you're entitled to. Favourites → shortcuts you define with an abbreviation in USER.ABBREVIATION. Global Settings → General / Screen / Query preferences, including the Theme. User Profile → amend preferences, change password, switch company, deactivate profile.",
    memory: "Left strip: About · Menu · History · Products · Favourites · Settings · Profile.",
    temenos: "Themes out of the box: Magic Blue (system), Nature Green, Brinjal Purple, Space Dark. Favourites abbreviations are per-user via USER.ABBREVIATION. History clears automatically on sign-out.",
    related: ["signin", "t24command", "companybranch"],
  },
  screenbtns: {
    title: "Screen Buttons & the Input Box",
    simple: "The buttons on the top bar of any application and how you pull up a specific record.",
    example: "You open CUSTOMER, click View Full List, filter by name, pick the record, then use the gear button to authorise it.",
    why: "Every application uses the same handful of controls — learn them once.",
    how: "Top bar: + create a new contract · ✏️ edit · 👁 view · ⚙️ perform an action (commit, authorise, delete, reverse) · ▼ more actions (related enquiries) · help. The input box takes a record id directly; View Full List searches by any column with a Filter (default is the id). The record dropdown shows the current filtered record's details.",
    memory: "Create / Edit / View / Perform action / More actions / Help — plus the input box + View Full List.",
    temenos: "'Perform an action on the contract' is where Delete and Authorise live; More Actions carries context enquiries (Account Enquiries, KYC, Withholding Tax rates, etc.).",
    related: ["fieldbtns", "recordlock", "enqcommand"],
  },
  fieldbtns: {
    title: "Field Buttons & Assistance",
    simple: "The little buttons next to fields — calendar, language, dropdown, frequency, and the context enquiry.",
    example: "Beside the Currency field you click the context enquiry icon and pick 'Exchange rates' to see the rates for that currency without leaving the screen.",
    why: "They speed up input and let you check related information in place.",
    how: "Calendar → pick a date. Language → enter a field (e.g. a name) in several languages. Dropdown → choose from a list. Frequency → set a recurrence (e.g. 'every 6 months on day 1'); the same icon on a plain date field just opens a calendar. Hot validation → changing a hot-validation field and tabbing away revalidates the whole screen. Context enquiry → a value-specific popup (e.g. currency → Nostro position / Currency movements today / Exchange rates).",
    memory: "Calendar · Language · Dropdown · Frequency · Hot validation · Context enquiry.",
    temenos: "Context-sensitive enquiries are filtered to the field's value; hot fields trigger STANDARD.SELECTION validations across the screen.",
    related: ["screenbtns", "multivalue"],
  },
  multivalue: {
    title: "Multi-Value & Sub-Value Fields",
    simple: "Fields that can repeat — a set of fields (multi-value) or a single field within a set (sub-value).",
    example: "On a joint account you press + next to Joint Holder Id to add a second holder; the labels change from .1 to .2. Within that group, Relation Notes 1.1, 1.2… are sub-values.",
    why: "One arrangement often needs several of the same thing — holders, addresses, officers, charges.",
    how: "A + or vertical-ellipsis (kebab) marks a repeatable field. Press + → the first group (suffix .1) is replicated as .2; the + becomes a kebab menu: Insert another group (.3), Remove the group, Clone the group. Sub-values work the same within a group and also offer Move Forward / Move Back. No limit on repetitions.",
    memory: "+ = add a group (.1 → .2 → .3); kebab = Insert / Remove / Clone; sub-values also Move Forward / Back.",
    temenos: "Field suffixes .1 / .2 identify the group; associated multi-values move together.",
    related: ["fieldbtns", "screenbtns"],
  },
  // ---- Module 3: Customer ----
  custapplication: {
    title: "The Customer Application",
    simple: "The base record for anyone the bank deals with — account holders, guarantors, correspondent banks, brokers.",
    example: "Before opening an account for Mrs Anthony, a CUSTOMER record is created for her under Customer Management → New Individual Customer.",
    why: "Almost every other application points at a CUSTOMER record, so it must exist before any customer activity.",
    how: "Create from All-In-One → Customer → Customer Management → New Individual / Non-Individual Customer. An Individual record has tabs: Individual Customer, Address, Contact, ID Doc, Relation, Further Details, Education, Employment, Other Details, Audit. Bank / correspondent / agent records are usually set up at installation even if they aren't real customers.",
    memory: "Customer record first — everything else references it.",
    temenos: "CUSTOMER application; created via versions like New Individual Customer / New Non-Individual Customer; the mnemonic → id link lives in MNEMONIC.CUSTOMER.",
    related: ["custfields", "custindivnonindiv", "trscv"],
  },
  custfields: {
    title: "Key Customer Fields",
    simple: "The handful of fields that drive how the customer is treated downstream.",
    example: "Setting Blocked = Yes on a customer stops any new account being opened for them; Customer Type = PROSPECT marks a walk-in who isn't onboarded yet.",
    why: "These fields feed eligibility, reporting, marketing and payment processing.",
    how: "Customer Type — ACTIVE (ready for a business relationship), PROSPECT (potential customer), EXTERNAL.USER (can only be a signatory on select applications). Sector / Industry — classification from lookups. Target — how the customer fits the marketing strategy. Blocked — Yes stops new accounts. Account Officer (DAO) — defaults onto the customer's transactions for MIS.",
    memory: "Type · Sector · Industry · Target · Blocked · Account Officer.",
    temenos: "Customer Type values are ACTIVE / PROSPECT / EXTERNAL.USER; Sector 8001 marks a bank; Blocked drives the new-account check.",
    related: ["custapplication", "custindivnonindiv", "dao"],
  },
  trscv: {
    title: "Single Customer View (SCV)",
    simple: "The 360° screen for one customer — record, portfolio, documents, tasks and history in one place.",
    example: "An agent opens the SCV for a customer to see their accounts and loans, upload an ID document, and check pending tasks — without switching applications.",
    why: "Full context in one screen means better service and fewer mistakes.",
    how: "Access from All-In-One → Customer → Customer Management → Search Customer → Single Customer View. Left tabs: Person, Contact, KYC, Background. Right tabs: Tasks, Portfolio, Payments, Credit Security, Documents, History. Account and loan origination, document upload, and amendments all launch from here.",
    memory: "SCV = the customer's whole story: Person/Contact/KYC + Portfolio/Payments/Documents/History.",
    temenos: "The SCV is the landing page on the customer-facing RBHPs; new applications are launched from the Portfolio tab's ⋯ menu.",
    related: ["custapplication", "custdocs", "custamend"],
  },
  custdocs: {
    title: "Uploading Customer Documents & Images",
    simple: "Attaching a scan or photo — an ID, a mandate, a signature — to the customer record.",
    example: "You capture a document of type 'DOCUMENTS', describe it 'National Id', then upload the image file; it appears under the SCV's Documents tab.",
    why: "KYC and audit need the supporting paperwork held against the customer.",
    how: "From the SCV → Documents tab → ⋯ menu → Request Document / Upload Document / Upload Image. 'Capture a Document' records the Image Type, notes, description and expiry; then 'IM Image Upload' takes the actual file. Uploaded items list under the customer's Documents.",
    memory: "SCV → Documents → Upload: capture the metadata, then upload the file.",
    temenos: "Documents are held as IM (Image) records; also reachable from a completed origination's Offer Production stage.",
    related: ["trscv", "custamend"],
  },
  custamend: {
    title: "Amending a Customer Record",
    simple: "Changing a live customer's details — always by input-and-authorise, and never by reversal.",
    example: "A customer moves house; you open the record from the SCV, edit the address, commit, and a second user authorises it.",
    why: "Customer data changes constantly, but the record is central so every change is controlled and logged.",
    memory: "Amend anytime; never reverse. Edit → commit → authorise.",
    temenos: "From the SCV ⋯ menu: View Customer Record / Edit Customer Record / Upload Profile Image. Once authorised a customer can be amended at any time but never reversed.",
    related: ["trscv", "custapplication", "recordlock"],
  },
  // ---- Module 4: Accounts (see also aaaccount / aoapplication / acctclosure / acctrestriction) ----
  acctdormant: {
    title: "Inactive & Dormant Accounts",
    simple: "An account with no customer-initiated movement for the configured period is flagged Inactive, then Dormant — and can be reset.",
    example: "An account only receives interest postings for a year; at the configured period it's flagged Dormant, shown wherever the account appears. After a reset it goes back to active.",
    why: "Banks must ring-fence and control unused accounts; interest posting alone doesn't count as activity.",
    how: "The number of inactive months comes from the account product. Reset from the Arrangement Overview screen: pick the reset link, enter the reset date, validate and commit — the flag is removed. The Account Enquiries tab lists Inactive Accounts among Live / Pending / Opened Today / Closed / Account Statement.",
    memory: "No real movement → Inactive → Dormant. Reset from the Arrangement Overview (activity id AAACT…).",
    temenos: "Dormancy months are on the DORMANCY property / account product; reset via the Reset Dormancy/Inactivity activity from the account Overview.",
    related: ["aaaccount", "acctclosure", "acctrestriction"],
  },
  acctoverdraft: {
    title: "Account Overdraft & Limit Link",
    simple: "Linking an account to an approved overdraft limit, and the activities that change it.",
    example: "A current account is linked to a 10,000 ETB unsecured limit; later the branch runs 'Increase overdraft limit amount' to raise it.",
    why: "Only current-type accounts may go into debit, and only up to a controlled, approved limit.",
    how: "From Account Enquiries → Overview → New Activity → Update Limit Link. Related activities: Update Limit Link, Increase / Decrease overdraft limit amount, Renew overdraft limit on account, Update limit review action. The account Overview shows Limit Details (Type, Amount, Secured, Outstanding, Available/Excess).",
    figure: "Sam's current account has a 5,000 ETB approved limit and a 1,200 ETB credit balance. He withdraws 4,000 ETB → new balance = 1,200 − 4,000 = −2,800 ETB, still inside the 5,000 limit, so it goes through; Available on the limit is now 5,000 − 2,800 = 2,200 ETB. If he then tries to withdraw 3,000 more, that would need −5,800 ETB, past the 5,000 limit, so it's rejected — the exact rule that keeps every savings account from ever going negative at all.",
    memory: "Overdraft = an approved limit linked to the account; change it with the Limit Link activities.",
    temenos: "The LIMIT property links the arrangement to a LIMIT-module limit; savings/non-current products are barred from debit balances.",
    related: ["aaaccount", "acctrestriction", "lpb1limit"],
  },
  // ---- Module 5: Deposits ----
  depapplication: {
    title: "Deposit Origination (EM.DO.APPLICATION)",
    simple: "The staged workflow that takes a term-deposit application from capture to a live deposit.",
    example: "A customer places a fixed deposit: Application Input captures amount, term and rate; Review/Approval confirms the figures; Offer Production sets the funding; Deposit Creation opens the arrangement.",
    why: "A term deposit is an arrangement on the Deposits product line and needs the same controlled, auditable origination as a loan.",
    how: "Stages: Application Input → Review/Approval → Offer Production → Deposit Creation. Which apply is set by the DO parameters (mandatory / optional / not required). Access from Yehulu Financial Inclusion → Deposits → Create Deposits, or the customer's SCV Portfolio → New Deposit Application. The origination runs as a workflow process; commit at the end gives 'EM.DO.APPLICATION,DEPOSIT.CREATION'.",
    memory: "Input → Review/Approve → Offer → Create. Status codes 201 / 701 / 901.",
    temenos: "Application id prefixed DO…; the process definition is EDO.DEPOSIT.ORIGINATION run as PW.PROCESS,AUTO; Deposit Simulations tab for Simulate Deposit.",
    related: ["depmaturity", "depfunding", "aoapplication"], diagram: "doflow",
  },
  depmaturity: {
    title: "Maturity Instruction & Rollover",
    simple: "What happens to a deposit at the end of its term — close it, or roll it over, and if so what rolls over.",
    example: "A product defaults to Rollover; at maturity the principal rolls into a new term and the accrued interest is paid to the customer's account.",
    why: "Most deposits renew automatically; the bank needs the renewal behaviour fixed up front.",
    how: "Maturity Instruction — Rollover (default) or Close (exceptional, on customer request). Rollover Type — Principal only, or Principal and Interest. Int. Pay Method — with Rollover Type = Principal, set to 'Pay' (accrued interest paid at term end or on the Int. Pay Frequency); with Rollover Type = Principal and Interest, set to 'Capitalise'. Int. Pay Start Date only matters when the method is Pay.",
    figure: "Mihret places a 12-month term deposit of 20,000 ETB at 10% p.a. Rollover Type = Principal and Interest, so Int. Pay Method = Capitalise: at maturity the 2,000 ETB interest (20,000 × 10%) is added to the principal, and the new term starts at 22,000 ETB. If she'd chosen Rollover Type = Principal only with Int. Pay Method = Pay, the 2,000 ETB interest would instead be paid out to her account and only the original 20,000 ETB would roll over.",
    memory: "Rollover vs Close · roll Principal only or Principal+Interest · Pay vs Capitalise the interest.",
    temenos: "Set in the DEPOSITS product line; captured at Application Input; automatic rollover runs at COB on the maturity date.",
    related: ["depapplication", "depredemption"],
  },
  depfunding: {
    title: "Funding a Deposit (Offer Production)",
    simple: "At Offer Production the bank agrees how the deposit is funded — from an existing account, or by cash at the Teller.",
    example: "Funding Mode = Account, so origination shows the customer's accounts and one is chosen as the funding account; the payout account is set for maturity.",
    why: "The money has to come from somewhere and go somewhere at maturity — both are decided before creation.",
    how: "Offer Production sets Funding Start (and rollover/maturity date), Funding Mode (Account or Cash), Paying Mode, Funding Account and Payout Account. If Funding Mode = Account, the customer's accounts are shown; if Cash, that field is hidden and the deposit is funded via a teller cash transaction. Documents for the customer are produced here too.",
    memory: "Offer Production: funding date · Account or Cash · funding + payout accounts · documents.",
    temenos: "Status 701 – Generate offer documents; funding-mode Cash routes through the Teller.",
    related: ["depapplication", "tellercash"],
  },
  depwithdrawal: {
    title: "Deposit Withdrawal",
    simple: "Taking part of the money out of a live deposit before maturity, with the impact simulated first.",
    example: "A customer needs 1,000 back; you enter the amount and date, the simulation shows the new interest-at-maturity, then you complete the withdrawal from the Deposit Overview.",
    why: "Early access changes the interest the customer will earn — that has to be calculated and shown.",
    how: "From the deposit's Arrangement Overview → Withdraw Deposit. Enter the withdrawal amount and date; a simulation (id AASIM…) runs 'Partial Withdrawal of Deposit' and produces a Withdrawal Statement (current balance, amount, interest at maturity, new interest at maturity). Then go to SCV → Portfolio → Deposit Overview and complete it.",
    figure: "Mihret's 20,000 ETB deposit was tracking 2,000 ETB interest at maturity. She withdraws 5,000 ETB early: the simulation now shows the deposit's principal at 15,000 ETB and the projected interest at maturity dropping to roughly 1,500 ETB — the same 10% rate, just on a smaller base for the rest of the term.",
    memory: "Withdraw Deposit → simulate → check the new interest at maturity → complete from the Overview.",
    temenos: "Simulation Status Processing → Completed - Successfully; activity 'Partial Withdrawal of Deposit'.",
    related: ["depredemption", "depapplication"],
  },
  depredemption: {
    title: "Deposit Redemption (Pre-closure)",
    simple: "Closing a deposit early — the full balance is worked out, paid to the customer, and the contract set to pending closure.",
    example: "A customer redeems a deposit: the simulation shows the balance due, a pre-closure fee override is accepted, the customer is credited, and COB closes the account.",
    why: "Full early closure needs an exact settlement figure and any break fee, before the money moves.",
    how: "From the Arrangement Overview → Redeem Deposit. Enter the redemption date and a Closure Reason; a simulation runs 'Redeem Arrangement' and produces a Redemption Statement (itemised by property). A Charge Override tab may show a pre-closure fee to accept. Once accepted the customer is credited and the contract goes to Pending Closure; subsequent COBs close it.",
    figure: "Mihret redeems her 20,000 ETB deposit three months early. The Redemption Statement itemises: Principal 20,000 + accrued interest 500 − pre-closure fee 150 = 20,350 ETB credited to her account. The contract then sits in Pending Closure until the next COB closes it out.",
    memory: "Redeem Deposit → simulate → accept any pre-closure fee → credited → Pending Closure → COB closes.",
    temenos: "PRECLOSUREFEE activity charge; contract status Pending Closure; final closure at COB.",
    related: ["depwithdrawal", "depmaturity", "acctclosure"],
  },
  // ---- Module 6: Loans ----
  loanapplication: {
    title: "Loan Origination (EM.LO.APPLICATION)",
    simple: "The staged workflow from a loan application to a live, ready-to-disburse loan.",
    example: "A vehicle loan runs Application Input → Eligibility Check → Guarantor → Collateral → Credit Assessment → Review/Approval → Offer Production → Loan Creation.",
    why: "Lending is the highest-risk activity — each stage is a control, and which stages apply is set per product.",
    how: "Stages: Application Input, Eligibility Check, Guarantor Input, Collateral Input, Credit Assessment, Review/Approval, Offer Production, Loan Creation. Each stage can be mandatory, optional or not required per the product configuration. Access from Yehulu Financial Inclusion → Loans → Create Loans. Commit at Loan Creation gives 'EM.LO.APPLICATION,LOAN.CREATION'.",
    figure: "Sam applies for a 10,000 ETB vehicle loan over 12 months. Every later stage in this course is that same 10,000 ETB carried through Eligibility (checked against his age and deposit), Guarantor (Mihret locks 3,000 ETB), Collateral (his motorbike, Execution Value 9,500 ETB) and Credit Assessment (3,000 + 9,500 = 12,500 ETB security, a 25% buffer over the 10,000 requested) — see each stage's own worked example for the running numbers.",
    memory: "Input → Eligibility → Guarantor → Collateral → Credit Assessment → Review/Approve → Offer → Create.",
    temenos: "Application id prefixed LO…; stage status codes e.g. 101 input, 201 eligibility, 301 guarantor, 501 collateral, 701 credit assessment, 801 offer, 901 create.",
    related: ["loanappinput", "loaneligibility", "loanguarantor", "loancollateral", "loancreditassess"], diagram: "loflow",
  },
  loanappinput: {
    title: "Loan Application Input",
    simple: "The first stage — who is borrowing, what product, how much, over what term, and where the money moves.",
    example: "For customer 100001, product 'Yehulu Vehicle Loan', amount, term, payment frequency and purpose are captured; the Settlement tab names the disbursement, repayment and charge accounts.",
    why: "Everything downstream — eligibility, pricing, schedule — is driven by what's entered here.",
    how: "Key fields: Customer/Group Id, Loan Action (always NEW), Product, Currency (ETB unless configured), Amount Requested, Interest Rate, Term, Payment Frequency, Margin Rate/Operand, Installment Amount, Loan Purpose, Reason for Loan, Source of Funds. Asset Class shows the worst overdue status of the customer's existing loans. Settlement tab: Disburse Account, Repay Account 1 (+), Charge Account (falls back to the repay account if empty).",
    figure: "Sam requests 10,000 ETB over 12 months at 18% p.a., monthly frequency, product 'Yehulu Vehicle Loan'. Disburse and Repay are both set to his current account 1000000123; he leaves Charge Account blank, so charges will fall back to that same account.",
    memory: "Who · what product · how much · term · frequency · purpose — plus disburse / repay / charge accounts.",
    temenos: "Loan Action = NEW; Asset Class is the customer's worst overdue status; the Charge Account defaults to the repayment account when blank.",
    related: ["loanapplication", "loaneligibility"],
  },
  loaneligibility: {
    title: "Loan Eligibility Check",
    simple: "The system runs the product's eligibility rules against the borrower and shows pass/fail per rule.",
    example: "For a vehicle loan the rules Initial Deposit, Minimum Age and Nationality all return Passed, and the stage moves to '201 – Eligibility check complete'.",
    why: "Ineligible applications are stopped early, before effort is spent on guarantors and collateral.",
    how: "The stage shows the Subject (borrower), Check Required?, and a Rule/Result line per rule (e.g. Rule 1.1 Initial Deposit → Passed) with a Details line. Perform Check? controls whether the rules actually run. Notes capture the analyst's observations.",
    figure: "Sam's rules: Initial Deposit needs ≥500 ETB in his account — he has 600 ETB → Passed. Minimum Age needs ≥18 — he's 24 → Passed. Nationality needs Ethiopian — Passed. All three clear, so the stage moves to 201 – Eligibility check complete before anyone looks at guarantors or collateral.",
    memory: "Product rules → pass/fail per rule → stage complete (201).",
    temenos: "Eligibility rules are configured on the loan product; for accounts, the equivalent check is built into Application Input instead of a separate stage.",
    related: ["loanapplication", "loanappinput"],
  },
  loanguarantor: {
    title: "Loan Guarantor Input",
    simple: "Adding the people who guarantee the loan — either existing customers or new external guarantors.",
    example: "An existing customer is added as guarantor with an account and a guarantee amount; that amount is locked on their account until the loan is repaid.",
    why: "Group and unsecured lending leans on guarantees; the guarantee has to be recorded and, where it's cash, held.",
    how: "From the Guarantor Input stage → More Actions → Guarantors → Guarantor Actions. Two paths: Add Loan Guarantors (guarantor is already a customer — pick the customer, account and guarantee amount, which is locked until the loan completes) or New External Guarantor (capture name, ID, address, employment for a non-customer, then select them back on the guarantor screen). Stage completes at '301 – Guarantor input complete'.",
    figure: "Mihret, an existing customer, guarantees 3,000 ETB of Sam's 10,000 ETB loan. That 3,000 ETB is locked on her own account from this point on — she can't withdraw it — and stays locked until Sam's loan is fully repaid.",
    memory: "Existing customer → Add Loan Guarantor (amount locked). Non-customer → New External Guarantor.",
    temenos: "External guarantor id prefixed G…; the guarantee amount is held against the guarantor's account for the life of the loan.",
    related: ["loanapplication", "loancollateral"],
  },
  loancollateral: {
    title: "Loan Collateral Input",
    simple: "Recording the security behind the loan and its various valuations.",
    example: "A fixed property is added as collateral: Collateral Type 100 (Fixed Property), a nominal value of 60,000 and an execution value of 58,000.",
    why: "Secured lending needs the asset, its category, and a realistic recoverable value on record.",
    how: "From the Collateral Input stage: Applicant's Collateral Id and Guarantor's Collateral Id. Add via More Actions → Collaterals → Edit → Add. Set Collateral Type (broad category, e.g. 100 Fixed Property) and Collateral Code (finer classification). Values: Nominal (base/gross value), Maximum (policy cap the bank can recognise), Execution (estimated realisable value if enforced/sold), Third Party (external appraiser), Gen Ledger, Central Bank (regulatory value). Plus Currency, Country, Value Date, Review Frequency, Expiry Date, Address. Stage completes at '501 – Collateral input complete'.",
    figure: "Sam pledges his motorbike. Nominal Value (what it's stated to be worth) = 12,000 ETB. Maximum Value (the bank's policy cap, here 80% of nominal) = 0.8 × 12,000 = 9,600 ETB. Execution Value (what the bank realistically expects to recover if it had to sell it) = 9,500 ETB — the figure that actually counts toward covering his 10,000 ETB loan.",
    memory: "Type + Code, then the value stack: Nominal · Maximum · Execution · Third-Party · GL · Central-Bank.",
    temenos: "COLLATERAL / COLLATERAL.TYPE records; the arrangement links to the applicant's and any guarantor's collateral.",
    related: ["loanguarantor", "loancreditassess"],
  },
  loancreditassess: {
    title: "Credit Assessment & Review / Approval",
    simple: "The analyst's recommendation, then the approver's decision comparing what was applied for against what's approved.",
    example: "Credit Assessment records a recommendation of Approve; Review/Approval then sets the approved amount, term and rate, with a credit score and recommended limit, and the decision-maker signs off.",
    why: "The lending decision is two-step: a professional recommendation, then an authorised approval, both on the record.",
    how: "Credit Assessment: Recommendation = Approve (recommend for approval) / Decline (recommend rejection) / Wait (postpone — need more info); Assessment Notes; completes at '701 – Credit assessment complete'. Review/Approval: Status, Approval Notes, Applied vs Approved Amount / Term / Interest Rate, Credit Score, Recommended Limit, Decision By.",
    figure: "The cover check on Sam's loan: Mihret's guarantee (3,000 ETB) + the motorbike's Execution Value (9,500 ETB) = 12,500 ETB of security against the 10,000 ETB requested — a 25% buffer. Credit Assessment recommends Approve; Review/Approval then confirms Applied 10,000 / 12 months / 18% unchanged as Approved 10,000 / 12 months / 18%.",
    memory: "Assess → Approve / Decline / Wait. Approve → set Approved amount/term/rate vs Applied, decision by.",
    temenos: "The approval stage appears when the input user lacks approval authority or the product/limit needs it.",
    related: ["loancollateral", "loandisburse"],
  },
  loandisburse: {
    title: "Loan Disbursement",
    simple: "Paying out an approved loan — by cash at the teller, or by transfer into an account.",
    example: "A loan is disbursed by account transfer: the loan account is debited 40,000 and the customer's current account credited the same, with a customer rate and spread applied.",
    why: "A created loan isn't money in the customer's hands until it's disbursed.",
    how: "From SCV → Portfolio → Loans Overview → open the arrangement → Transactions ⋯ menu. Options include Disbursement to Account, Disbursement by Cash, by Cheque, by Payment Order; and Repayment from Account / by Cash / from Guarantor; Payoff from Account. By Cash: Loan Account, Disbursement Currency, LCY Amount, Value Date. By Account Transfer: Loan Account (debit), Credit Account, Debit Amount, Debit Value Date, Customer Rate and Spread.",
    figure: "Sam's 10,000 ETB loan is created with status Not Disbursed and Available for Withdrawal = 10,000 ETB. Disbursing by account transfer: the loan account is debited 10,000 ETB and his current account 1000000123 is credited 10,000 ETB — the same figure that was typed into Application Input, now actually in his hands.",
    memory: "Loans Overview → Transactions ⋯ → Disbursement by Cash / to Account.",
    temenos: "Cash disbursement id prefixed TT…; account transfer as an FT…; disbursement records against the loan arrangement.",
    related: ["loanapplication", "loanrepay"],
  },
  loanrepay: {
    title: "Loan Repayments & Payoff",
    simple: "Repayments are usually automatic; you can also repay manually or pay the loan off in full early.",
    example: "A customer clears a loan early: a payoff is calculated (principal + accrued interest + any prepayment charge) and settled from their account.",
    why: "Most repayments come from the repayment account at COB, but manual repayment and early payoff are common exceptions.",
    how: "Repayments run automatically against the repayment account. Manual: SCV → Portfolio → Loans Overview → Transactions ⋯ → Repayment from Account / by Cash / from Guarantor. Payoff: the Payoff activity calculates the full settlement figure via simulation and settles it (Payoff from Account, or a Payment Order from the payoff statement).",
    figure: "Six months in, Sam has 6,200 ETB principal left on his loan plus 140 ETB of interest accrued since the last bill. He asks to clear it today: Payoff = 6,200 + 140 = 6,340 ETB (plus any prepayment charge the product carries). That 6,340 ETB is debited from his account in one settlement instead of the remaining monthly instalments.",
    memory: "Auto by default · manual repayment via the arrangement · payoff = full early settlement, simulated first.",
    temenos: "Payoff is driven by SIMULATION.RUNNER → Lending-Calculate-Payoff; prepayment charge as an activity or periodic-rule charge.",
    related: ["loandisburse", "lpb2payoff", "acctclosure"],
  },
  // ---- Module 7: Groups ----
  grouptypes: {
    title: "Group Types",
    simple: "Financial-inclusion group lending supports four shapes of group.",
    example: "A registered SACCO is set up as a Full Membership group (every member is a customer); a village savings group is Abbreviated (members aren't customers).",
    why: "Different community structures need different member handling and different account/customer creation.",
    how: "Full Membership — each member is a customer of the institution. Abbreviated Membership — members are not customers (held as lightweight records). Nested Groups — groups within groups. Centres — a grouping of groups that meet together. Create from All-In-One → Customer → Groups → New Standard / Abbreviated Groups (or New Centre).",
    memory: "Full · Abbreviated · Nested · Centre.",
    temenos: "Standard vs Abbreviated group entry versions; a group links to only one Centre.",
    related: ["groupcreate", "abbrevgroup", "centre"],
  },
  groupcreate: {
    title: "Creating a Group",
    simple: "The group record — its identity, its linked customer/account, its officer, its type and its lifecycle fields.",
    example: "A new group is created; because Group Customer Auto Creation is set to Yes in the Group Parameter, the Group Customer and Group Account fields are left blank and the system allocates them.",
    why: "The group is the unit lending, meetings and reporting hang off — it has to be set up cleanly.",
    how: "Fields: Group Name, address, Opening Date. Group Customer / Group Account — leave blank when the Group Parameter has auto-creation = Yes, so the system allocates them. Group Type — from a dropdown. Group Account Officer — members and linked records must carry the same officer or an override is raised. Linked Centre. Group Status — Active by default, may auto-flip to Inactive if no Loan/Savings/Drawdown activity across all members for the parameter period. Group Cycle — the system-maintained lowest member cycle.",
    memory: "Name · linked Customer/Account (auto if configured) · Type · Account Officer · Centre · Status · Cycle.",
    temenos: "Group Customer/Account Auto Creation flags in Group Parameter; Group Status auto-inactivity from the parameter table; Group Cycle increments when the last member reaches the next cycle.",
    related: ["grouptypes", "groupmeeting", "groupmembers"],
  },
  groupmeeting: {
    title: "Group Meeting Schedule",
    simple: "The group's meeting date, time, place and frequency — the system advances the date automatically.",
    example: "A group meets monthly; you set the next meeting date and frequency, and at COB when that date is reached the system rolls it forward and moves the old entry into History.",
    why: "Group repayment and savings discipline is built around the meeting cycle.",
    how: "On the Group Meeting tab: 'Reschedule Group Loans in case of Meeting Date change?', Meeting Date & Frequency (calendar + recurrence), Meeting Time, Meeting Place, Notes. The COB process updates the next date when the specified date is reached and appends to the History section.",
    memory: "Set next date + frequency; COB rolls it forward and logs History.",
    temenos: "Meeting date advanced during COB; option to reschedule group loans when the date shifts.",
    related: ["groupcreate", "groupmembers"],
  },
  groupmembers: {
    title: "Group Members & Designations",
    simple: "Adding members to the group, each with a role (Chairperson, Secretary, Treasurer…) and a status.",
    example: "Four members are added; ETM is Chairperson, the others Members; all default to Active status.",
    why: "The group needs its people on record with their roles for governance and for member-level processing.",
    how: "On the Members tab: Member Id (search a Customer for a standard group — not used for an abbreviated group, where members aren't customers), Name (defaults from the Customer record, or keyed for abbreviated members), Designation (from a dropdown — Chairperson, Secretary, etc.), Status (default Active), Date (when a status change takes effect), Notes.",
    memory: "Member Id (standard only) · Name · Designation · Status · Date.",
    temenos: "Abbreviated-group members are keyed directly (no Customer id); standard-group members link by Customer id.",
    related: ["groupcreate", "grouptypes", "groupmaintain"],
  },
  groupmaintain: {
    title: "Maintaining Groups & Members",
    simple: "Changing group or member data after creation — including member actions like Block, Retire and Transfer.",
    example: "A member moves to another group: on Modify Group Members you set Action = Transfer and name the To Group, effective from a date, with a reason.",
    why: "Groups are living — members join, leave, change role, or move between groups.",
    how: "From All-In-One → Customer → Groups → Search Groups → Single Group View → Maintain Group / Maintain Members. The Single Group View shows the group, its members, portfolio and pending items, with a ⋯ menu (View Group, Maintain Group, Upload Group Image, Collect Payments). Modify Group Members: Action = Activate / Block / Deactivate / Retire / Transfer; Transfer also needs a To Group; plus Action Date and Action Reason.",
    memory: "Single Group View → Maintain Members → Action: Activate / Block / Deactivate / Retire / Transfer.",
    temenos: "Member maintenance and reinstatement from the SGV; Transfer requires the target group.",
    related: ["groupcreate", "groupmembers"],
  },
  // ---- Module 8: Teller & Vault ----
  tellermenu: {
    title: "The Teller Menu — Head Teller vs Teller",
    simple: "Teller functions split into two roles: the Head Teller runs the vault and the tills; the Teller serves customers.",
    example: "The Head Teller opens a till for a colleague and loads it from the vault; that colleague then takes cash deposits and withdrawals all day.",
    why: "Cash control needs separation — one role manages the branch cash position, another transacts.",
    how: "Head Teller: the vault, creating tills, transfers between tills and the vault, authorising till balances at closure, closing a till on a user's behalf, reassigning tills. Teller: cash and cheque transactions, deposit and loan transactions, passbook and cheque-book functions. Both are Role-Based Home Pages.",
    memory: "Head Teller = vault + tills + closure authorisation. Teller = customer cash transactions.",
    temenos: "Head Teller dashboard shows Till Position by Currency and Pending Till Transfers; teller landing page shows Till Status and Till Position.",
    related: ["tillmgmt", "cashmovement", "tellercash"],
  },
  tillmgmt: {
    title: "Till Management",
    simple: "Opening a till for a teller, reassigning it, and closing it at end of day.",
    example: "The Head Teller creates till 1999 for user AUTHORISER; at day end the teller raises a Till Closure Request and the Head Teller authorises the closing balance.",
    why: "Every teller drawer is a controlled cash position that must be opened, tracked and reconciled daily.",
    how: "Create: Head Teller → New Till → enter Till Id and User Id. Reassign: Head Teller → Till Management → Reassign Till (from the Open Tills list). Close: the teller raises Till Closure Request; the Head Teller closes it (with authorisation of the balance). The Head Teller can also close a till on behalf of an absent user. No till may be left open at close of business.",
    memory: "New Till (id + user) · Reassign Till · Till Closure Request → Head Teller authorises.",
    temenos: "Till versions: Create Till, TELLER,EM.CLOSE for closure; Open Tills / Closed Tills / Tills Pending Closure lists on the Head Teller page.",
    related: ["tellermenu", "cashmovement"],
  },
  cashmovement: {
    title: "Vault & Till Cash Movements",
    simple: "Moving physical cash: into the vault, from the vault to a till, between tills, and back to the vault.",
    example: "Start of day: Load Vault brings cash into the branch vault; Load Till moves some to a teller (Vault → Till); a teller running low gets a Till to Vault Transfer; between colleagues it's Till to Till.",
    why: "Notes are tracked at every hop, and each movement is counted by denomination.",
    how: "Load Vault — cash into the branch vault (from an account). Load Till (Vault to Till Transfer) — Head Teller moves cash from the vault (e.g. 9999) to a till. Till to Vault Transfer — a teller sends cash back to the vault. Till to Till — cash between two tellers. Each movement carries From/To, Currency, Amount (Local/Foreign) and Denomination Given / Denomination Taken tabs; the denomination totals must equal the amount.",
    memory: "Load Vault → Load Till (Vault→Till) → Till↔Till → Till→Vault. Every hop by denomination.",
    temenos: "Movement ids prefixed TT…; the vault is a special till (e.g. 9999); versions like TELLER,EM.TILL.INC.TRANSFER.",
    related: ["tillmgmt", "denomination", "tellercash"],
  },
  tellercash: {
    title: "Teller Cash Deposit & Withdrawal",
    simple: "Taking cash in or paying cash out over the counter, against a customer's account.",
    example: "A 5,000 ETB cash deposit to a savings account: the teller keys the account and amount, enters the note breakdown (units), and the account and till both update.",
    why: "This is the core teller transaction — it moves money between the customer's account and the till, with a receipt and GL entry.",
    how: "All-In-One → Teller → Cash Operations → Deposit Cash / Withdraw Cash. Fields: Value Date, Currency, Account, Amount (LCY / FCY), Exchange Rate, Narrative, Waive charges, Charge Code, and Unit lines for the denomination count. Withdrawal also captures a Signatory. High-value transactions route for supervisory approval.",
    memory: "Teller → Cash Operations → Deposit / Withdraw Cash: account + amount + denomination units.",
    temenos: "Versions TELLER,SSI.EM.CASH.DEPOSIT / TELLER,SSI.EM.CASH.WITHDRAW; transaction id prefixed TT…; denomination units must total the amount.",
    related: ["cashmovement", "denomination", "telleracctransfer"],
  },
  telleracctransfer: {
    title: "Customer Account Transfer",
    simple: "Moving money from one account to another over the counter — booked as a Payment Order.",
    example: "A customer transfers 50,000 from their current account to another account; the teller raises a Payment Order with the debit and credit accounts and the amount.",
    why: "Account-to-account moves at the counter are a Payment Order, not a cash transaction — no till involved.",
    how: "All-In-One → Teller → Other Operations → Customer Account Transfer. This opens a Payment Order: Payment Order Product (e.g. Account Transfer / ACOTHER), Debit Account Number, Debit Currency, Credit Account, Ordering Customer, Payment Amount.",
    memory: "Counter transfer = Payment Order (debit account → credit account), no till.",
    temenos: "PAYMENT.ORDER application, id prefixed PI…; product ACOTHER for account transfers.",
    related: ["tellercash", "aaaccount"],
  },

  // ============ COURSE · Temenos Functional Training (TFT) — Day 1 ============
  // ---- Section 1: Inclusive Banking Intro ----
  tftExclusion: {
    title: "Exclusion in Banking",
    simple: "The barriers — Access, Literacy, Income, Culture — that keep people out of formal financial services.",
    example: "A rural woman with irregular income and no financial education gets denied an account, not because she doesn't need one, but because the barriers were never designed around her.",
    why: "Before designing for inclusion, name what excludes: geography/channels (Access), formal & financial education (Literacy), irregular/low income (Income), and reputation-over-risk / loan-averse / gender profiling (Culture).",
    memory: "Exclusion = Access + Literacy + Income + Culture — four barriers, one 'Denied'.",
    temenos: "World Bank figure quoted in training: ~1.4 billion adults remain unbanked globally — disproportionately women, poorer, less educated, rural.",
    related: ["tftInclusion", "tftInstitutions"],
  },
  tftInclusion: {
    title: "Inclusion in Banking",
    simple: "Removing exclusion's barriers through four levers: Outreach, Training, Loans, Targeted Products.",
    example: "A loan officer or agent reaches a village (Outreach), teaches saving/investing basics (Training), then disburses a small, short-term loan (Loans) — sometimes a gender-based product designed specifically for women (Targeted Products).",
    why: "Inclusive Banking strives to remove the barriers that prevent people from taking advantage of financial services to improve their lives — and inclusion feeds economic growth: access → payments/credit/savings → spending → production → jobs → income.",
    memory: "Outreach (loan officers/agents) → Training (financial literacy) → Loans (small, short-term) → Targeted Products (e.g. gender-based).",
    temenos: "Source cited in training: Development Asia, an ADB initiative.",
    related: ["tftExclusion", "tftInstitutions", "tftProduct"],
  },
  tftInstitutions: {
    title: "Financial Institutions Engaging in Inclusive Banking",
    simple: "Two main institution types drive Inclusive Banking: Microfinance Institutions and Credit Unions.",
    example: "An MFI (private or NGO/social) offers small individual or group loans with flat interest and guarantors; a Credit Union is locally/member-owned, offers medium-sized loans to joint customers, with dividends/profit sharing.",
    why: "Each institution type shapes the product design differently — MFIs skew toward micro/group lending, Credit Unions toward member-owned savings and shared profit.",
    memory: "MFI = private/NGO, small loans, guarantors, group lending. Credit Union = member-owned, medium loans, dividends.",
    temenos: "Credit Unions are also known as Cooperative Societies / Credit Cooperative Societies / Savings & Credit Cooperative Societies depending on region.",
    related: ["tftExclusion", "tftInclusion", "tftMarkets"],
  },
  tftProduct: {
    title: "What Is the Temenos Inclusive Banking Product?",
    simple: "A pre-integrated, packaged 'Bank-in-a-Box' built on Temenos Transact, delivered through certified partners, on-premise or cloud.",
    example: "A new MFI deploys the Inclusive Banking solution and gets 80–95% of its functional needs out of the box — no bespoke core-banking build from scratch.",
    why: "Temenos's first-ever Model Bank (26+ years old) exists so institutions serving the underbanked don't have to build a core system themselves — trusted local/regional certified partners implement it, understanding local language, regulation and culture.",
    memory: "Pre-integrated + 80–95% fit OOTB + certified-partner implemented + on-prem/cloud = Inclusive Banking.",
    temenos: "First banking software on public cloud; 360+ clients in 54 countries — MFIs, Credit Unions, Community Banks, Retail Banks, Development Banks, Start-up Banks. Approved cloud stacks: Microsoft Azure, AWS, Google Cloud, Alibaba Cloud.",
    related: ["tftTiers", "tftMarkets", "tftFootprint", "tftPartners"],
  },
  tftTiers: {
    title: "Inclusive Banking — Bundled & Tiered Solution",
    simple: "Three tiers, all on the same Transact + Payment Platform foundation: Core, Advanced, Premium.",
    example: "A fast-growing microfinance startup launches on Core (speed, simplicity, standard products); a maturing bank later upgrades to Advanced for multi-currency and a wider product range, or to Premium for pricing, valuation and partner ecosystems.",
    why: "One foundation, capabilities added as needed — banks don't re-platform to grow, they add tier capability.",
    memory: "Core = speed & simplicity. Advanced = visibility, range, multi-currency. Premium = pricing, valuation, covenants, partner ecosystems.",
    temenos: "Entry tier: Inclusive Banking Core. Mid tier: Inclusive Banking Advanced. Top tier: Inclusive Banking Premium.",
    related: ["tftProduct", "tftMarkets"],
  },
  tftMarkets: {
    title: "Markets Served",
    simple: "Four markets: Microfinance Banks, Credit Unions, Retail Banks, Start-up Banks.",
    example: "A small retail bank with a limited budget adopts Inclusive Banking because it fits smaller institutions perfectly; a digital-first start-up bank launches quickly with a select product set.",
    why: "The product is pre-configured for the two primary markets (Microfinance, Credit Unions) but extends to Retail and Start-up banks via extension applications.",
    memory: "Primary: Microfinance + Credit Unions. Also serves: Retail Banks (smaller/limited budget), Start-up Banks (quick deploy, select products).",
    temenos: "Source cited in training: World Bank Global Findex.",
    related: ["tftInstitutions", "tftTiers"],
  },
  tftValue: {
    title: "Three Value Pillars: User, Customer, Efficiency",
    simple: "The Inclusive Banking solution and its extension apps are built on three pillars: the User (ease of use), Customers (satisfaction), Efficiency (fast/accurate processing).",
    example: "A Role Based Home Page and Process Guided Product Builder speed up the user; a Self Onboarding App and Account Statement serve the customer; Automated Approvals and Bulk File Processing drive efficiency.",
    why: "Satisfied users deliver good customer service; easy-to-understand customer-facing output grows the bank's business; workflow-guided efficiency gets fast, accurate service to customers — the market Inclusive Banking sells to demands it.",
    memory: "User: RBHP, Task Management, SCV, Process Guided Product Builder, Origination. Customer: Self Onboarding, Omnichannel App, Document Output, Statements, Alerts. Efficiency: Automated Approvals, External Reporting, Bulk File/Officer Processing, Teller Financial Services.",
    temenos: "Products spanning the pillars: Current Accounts, Savings, Term Deposits, Savings Plans, Secured & Unsecured Loans — for both Consumers and Businesses.",
    related: ["tftProduct", "tftCustomerNeeds"],
  },
  tftCustomerNeeds: {
    title: "Customer Needs (Evolving Demand)",
    simple: "Six growing demands Temenos responds to: MSME, Instant Decisions, ESG Investments, Financial Literacy, Digital Onboarding, Hybrid Self-Service.",
    example: "A Gen-Z customer expects Digital Onboarding and Hybrid Self-Service; a micro-SME needs fast Instant Decisions on credit; institutions must still deliver Financial Literacy alongside digital products.",
    why: "Customer demands are becoming more complex across both product and experience — Temenos responds by providing appropriate tools to banks to meet those requirements.",
    memory: "MSME · Instant Decisions · ESG Investments · Financial Literacy · Digital Onboarding · Hybrid Self-Service.",
    temenos: "Rise of Micro SMEs and millennial/Gen-Z customers is driving these six demand areas in Inclusive Banking deployments.",
    related: ["tftValue", "tftProduct"],
  },
  tftFootprint: {
    title: "Our Footprint",
    simple: "Inclusive Banking is trusted by 360 client sites in 54 countries.",
    example: "The very first implementation was Sinapi Aba in Ghana in 2000 — that client has since upgraded 5 times and has been live on R21 since October 2022.",
    why: "A 25+ year track record and a client that has upgraded five times is evidence the platform scales with a growing institution rather than needing replacement.",
    memory: "360 sites, 54 countries; first go-live 2000 (Sinapi Aba, Ghana, on G10/the 2000 AMR release of Globus); now R21 since Oct 2022.",
    temenos: "Client logos across four segments shown in training: Inclusive Finance, Community/Cooperative Banks, Credit Unions, Retail Banks.",
    related: ["tftProduct", "tftMarkets"],
  },

  // ---- Section 2: Partners & Implementation Methodology ----
  tftPartners: {
    title: "Partner Ecosystem & Certification Program",
    simple: "Temenos delivers Inclusive Banking through a carefully selected, trained, tested and certified partner network — not direct delivery alone.",
    example: "A local/regional System Integrator partner is onboarded, classroom-trained (at a Temenos or partner location), and certified before being allowed to implement Inclusive Banking for a client.",
    why: "Local/regional presence gives partners insight into market requirements and cultural nuance; certification ensures consistent delivery quality across 50+ countries.",
    memory: "Carefully Selected & Onboarded → Local/Regional Presence → Classroom Trained → Tested & Certified.",
    temenos: "The Partner Certification Program's Design step provides the skills needed for successful Inclusive Banking implementation; a certified partner organisation must maintain at least 8 Inclusive Banking certified consultants.",
    related: ["tftCertExams", "tftProduct", "tftMethodology"],
  },
  tftCertExams: {
    title: "Certification Exams & Validity",
    simple: "Trained consultants sit exams on two streams — Business and Technical — and certification is valid for 2 years.",
    example: "A business-stream consultant passes T3FIBU (Inclusive Banking Business), T3AAC (Arrangement Architecture Core) and T3TAAL (Arrangement Architecture Loans) among others; a technical-stream consultant adds T3DMG (Data Migration) and T3UPG (Upgrade).",
    why: "Splitting Business vs Technical streams matches the two different skill sets partners need on a project; the 2-year validity keeps certified knowledge current as the product evolves.",
    memory: "Business stream: T3FIBU, T3AAC, T3TAAL, T3TFI, T3TRE, T3TMC. Technical stream adds: T3FIUT, T3AACT, T3DMG, T3UPG.",
    temenos: "Training prerequisites before attending (must be TLC members): AA Implementation 1 & 2, AA Lending Foundation 1 & 2, AA Common Building Blocks Implementation, AA Lending Product Building, Inclusive Banking Foundation. Consultants are reminded 3 months before expiry.",
    related: ["tftPartners"],
  },
  tftMethodology: {
    title: "Temenos Implementation Methodology (TIM)",
    simple: "A seven-stage, process-driven implementation approach: Initiation → Analysis → Design → Build → Test → Deployment → Closure.",
    example: "Initiation is a 'show and tell' workshop; Analysis validates any gaps found during RFx/workshops; Build develops the solution; Deployment covers Install & Promote, SIT, UAT, then LIVE; Closure is formal sign-off.",
    why: "TIM follows CMMI principles and covers the entire implementation process from software selection through to project closure — unlike Model Bank's ARIS-based approach, Inclusive Banking uses a show-and-tell workshop to validate RFx gaps.",
    memory: "Initiation · Analysis · Design · Build · Test · Deployment · Closure — seven stages, CMMI-aligned.",
    temenos: "Test stage covers SIT/UAT; Deployment covers Install & Promote, SIT, UAT, LIVE.",
    related: ["tftPMControl", "tftDeployment"],
  },
  tftPMControl: {
    title: "TIM's Project Management Control Process",
    simple: "The second component of TIM, alongside the seven implementation stages: six control disciplines that run throughout the project.",
    example: "Risk Management flags a data-migration risk early; Change Management controls scope creep once Build starts; Quality Management and Project Audit check delivery against plan.",
    why: "Successful delivery of the seven TIM stages can only be achieved by ensuring these Project Control processes are adhered to.",
    memory: "Risk · Change · Communication · Quality Management · Project Audit · Resource Management.",
    temenos: "Runs in parallel with, not instead of, the seven implementation stages.",
    related: ["tftMethodology"],
  },
  tftDeployment: {
    title: "Deployment Options & Implementation Pricing",
    simple: "Three deployment options (On Premise, Hybrid Cloud, Shared Platform); pricing is bundled, not module-based.",
    example: "A bank without in-house infrastructure picks Shared Platform, where a Temenos partner runs the software (subject to availability) — estimated at 141 man-days / ~3 months. On Premise (bank runs its own infrastructure and software) is estimated at 200 man-days / ~4 months.",
    why: "Pricing isn't itemised per module because most of the 90+ modules the solution is configured from are never actually deployed at implementation time — bundled pricing reflects real usage, not theoretical scope.",
    memory: "On Premise: bank runs it. Hybrid Cloud: bank runs it, cloud backup. Shared Platform: partner runs it.",
    temenos: "No PLW, no CCE, no CIO billed; ISB itself is not billed; TPCS (Temenos Packaged Cloud Service) is offered as part of implementation costing. Product questions during implementation route to IBS_Partner_Support@temenos.com.",
    related: ["tftMethodology", "tftProduct"],
  },

  // ---- Section 3: Product Builder — Common Parameters ----
  tftPBIntro1: {
    title: "Product Builder Introduction 1",
    simple: "The Inclusive Banking Product Builder constructs AA Products and publishes them into one product Catalogue, via three builder workflows.",
    example: "Product Line 'Lending' → Product Group 'Consumer Loans (AL)' → Product 'Education Loan' — flows through the Loan Product Builder into the Catalogue.",
    why: "Product Lines are predefined by Temenos (Lending, Accounts, Deposits, etc.); the Inclusive Banking Product Builder supports these three lines, each with its own guided workflow.",
    memory: "Product Lines → Product Groups → Products → Catalogue, built via Loan / Deposit / Account Product Builder.",
    temenos: "Example groups: Consumer Loans (AL), Term Deposits (AD), Current Accounts (AR); example products: Education Loan, 5-Year Term Deposit, Current Account.",
    related: ["tftPBIntro2", "aai1builder", "tftPBWizard"],
  },
  tftPBIntro2: {
    title: "Product Builder Introduction 2",
    simple: "The Inclusive Banking Product Builder is a front end to the core AA Product Builder — a wizard that constructs, proofs and publishes AA Products for Loans, Deposits and Accounts.",
    example: "Using Inheritance Groups, a list of common/shared/parent product conditions is set up once and inherited during subsequent product design — or a product can be Fully Defined, with every condition unique to it.",
    why: "Proofing and publishing seldom fails when using the Inclusive Banking Product Builder, which supports ease of use and quick go-to-market for banks.",
    memory: "AA Products Hierarchy: Product Groups → Products → (Fully Defined or Default/Named Parent) → Products Catalogue → Saleable Products.",
    temenos: "Inheritance Groups hold Shared/Parent Conditions that flow into Default/Named Parent products.",
    related: ["tftPBIntro1", "tftPBWizard", "tftInheritGroup"],
  },
  tftPBWizard: {
    title: "The Inclusive Banking Product Wizard",
    simple: "A user-friendly, workflow-driven interface between the business user and the core AA Product Builder.",
    example: "A business user setting up a new loan product only fills in the conditions relevant to their requirement — they never touch raw AA architecture tables directly.",
    why: "To set up new products, business users only need to configure conditions relevant to business requirements — the wizard hides AA's complexity and adds workflow control.",
    memory: "Wizard = friendly front end to AA; organisation of products (groups → parent → child) is derived directly from AA.",
    temenos: "Main interface applications: EM.PRODUCT.GROUP, EM.PRODUCT.XXX (XXX = LOAN, DEPOSIT or ACCOUNT), EM.PRODUCT.PARAMETERS.",
    related: ["tftPBFlow", "tftPBIntro2"],
  },
  tftPBFlow: {
    title: "Product Wizard Process Flow",
    simple: "Four configuration steps, in order: Create Inheritance Groups → Define Shared Conditions → Create Product Groups → Create Products.",
    example: "Only if necessary, a new Inheritance Group first identifies which properties will be shared; then shared/parent conditions are defined for those properties; a Product Group is created choosing to inherit all, some, or none of them; finally child Products are created with their own unique conditions.",
    why: "This order lets common conditions (interest, settlement, overdue rules) be defined once and reused, instead of re-entered per product.",
    memory: "Inheritance Groups → Shared Conditions → Product Groups → Products.",
    temenos: "Creating an Inheritance Group is optional — 'only if necessary'; a Product Group can choose to inherit all, some, or none of the defined conditions.",
    related: ["tftPBWizard", "tftInheritGroup", "tftGroupCreation"],
  },
  tftInheritGroup: {
    title: "Product Inheritance — EM.PRODUCT.GROUP",
    simple: "Inheritance Groups select the most common properties in product building; their conditions become available for subsequent inheritance.",
    example: "Under Loans, EmConsumer covers Consumer Loans; under Deposits, EmTermDeps covers Term Deposits; under Accounts, EmSavings covers savings accounts.",
    why: "Delivered inheritance groups give every implementation a sensible starting point, amendable if the client's business requirements differ.",
    memory: "Loans: EmConsumer, EmBusiness, EmHome. Deposits: EmTermDeps, EmSavPlans. Accounts: EmSavings, EmCurrent, EmShares.",
    temenos: "The Condition Group Code field can be expanded to create different shared-condition sets under one inheritance group — e.g. under EmConsumer, Group Code 1: Personal, Group Code 2: Staff.",
    related: ["tftInheritComponents", "tftSharedCond", "tftPBFlow"],
  },
  tftInheritComponents: {
    title: "Inheritance Components — Define Now vs Define Later",
    simple: "At the Inheritance Group level, each component is flagged either 'Define Now' (Stage Level) or 'Define Later'.",
    example: "Penalty interest, settlement, overdue, payoff and closure are usually marked 'Define Now' since they're common across products; interest and term amount, which are usually unique per product, are marked 'Define Later'.",
    why: "'Define Now' components are set once at the inheritance-group level; 'Define Later' components stay open so each child product can define them individually.",
    memory: "Define Now = shared/set here. Define Later = deferred to the child product.",
    temenos: "Only components marked 'Define Now' are presented by the workflow when building the shared/parent conditions.",
    related: ["tftInheritGroup", "tftSharedCond"],
  },
  tftSharedCond: {
    title: "Parent (Shared) Product Conditions",
    simple: "When 'Launch Condition Builder' is set to Yes on an Inheritance Group, a workflow wizard defines the actual values for every 'Define Now' condition.",
    example: "For a Consumer Loans inheritance group, the Shared Condition Builder walks through Penalty Interest (fixed rate, negotiable?), Settlement (repayment/charge collection rules), Overdue (grace/delinquent/NAB day thresholds and chaser frequency), and Payoff/Closure (expiry days, settle-dues flag).",
    why: "It's recommended to define shared conditions per product group for ease of identification while maintaining the products later.",
    memory: "Launch Condition Builder = Yes → wizard walks Penalty Interest → Settlement → Overdue → Payoff/Closure.",
    temenos: "Settlement covers Repayment Collection and Charge Collection tabs (automatic?, negotiable?, collection rule, default account category); Overdue covers Basic Details, Grace Period, Delinquent Period, Non-Accrual Basis tabs.",
    related: ["tftInheritComponents", "tftInheritGroup", "tftGroupCreation"],
  },
  tftAccessGroups: {
    title: "Access to Product Groups",
    simple: "New Loan/Deposit/Account product groups are created from the Product Administrator screen, per product line tab.",
    example: "Administration > Products > Loan Products (tab) > New Product Group opens a fresh Loan Product Group; the 'meatballs' (…) menu on an existing group offers View Group, Amend Group, List Products, Proof and Publish, Create New Product.",
    why: "A few product groups ship with the ISB for use or reference only — actual business requirements determine what groups a client actually needs.",
    memory: "Administration → Products → <Line> Products tab → New Product Group; meatballs menu → Proof and Publish.",
    temenos: "The Product Administrator screen has separate tabs: Account Products, Account Origination, Facility Origination, Deposit Products, Deposit Origination, Loan Products, Loan Origination, Scoring & Profiling, Credit Security.",
    related: ["tftGroupCreation", "tftProofPublish"],
  },
  tftGroupCreation: {
    title: "Product Group Creation — EM.PRODUCT.GROUP",
    simple: "A three-step process: Group Details, Global Conditions, Shared Conditions.",
    example: "Agric Loans is set up with Product Line LENDING, category range 3400–3449, currencies USD/GBP, Group Start Date — up to 99 products can be created under that one group.",
    why: "Category ranges must be redesigned at implementation to accommodate the client's existing product groups and leave room for future groups.",
    memory: "Group Details (category range, currencies, start date) → Global Conditions → Shared Conditions.",
    temenos: "Example category ranges from training: 3100–3199 Consumer Loans, 3200–3299 Business Loans, 3300–3399 Home Loans, 3400–3499 Group Loans (where created separately).",
    related: ["tftGlobalCond", "tftParentCondTab", "tftAccessGroups"],
  },
  tftGlobalCond: {
    title: "Global Conditions Tab",
    simple: "Global Conditions are predefined in the ISB and are not to be amended without due care.",
    example: "Property classes like ACCOUNTING, ACTIVITY, ACTIVITY/MAPPING, ACTIVITY/MESSAGING, PRESENTATION appear here as global, technical conditions common to every product in the group.",
    why: "These are more technical, rarely-amended business classes — changing them affects every product built under the group.",
    memory: "Global Conditions = technical, predefined, handle with care.",
    temenos: "Refer to AA Lending training material for detail on properties and product conditions; during implementation, review and align model conditions with actual business requirements.",
    related: ["tftGroupCreation"],
  },
  tftParentCondTab: {
    title: "Parent (Shared) Conditions Tab — Inherit vs NoInherit",
    simple: "A product group can be defined with two parent product codes: one that inherits shared conditions, one that doesn't.",
    example: "'Inherit' parent product pulls in the previously built shared conditions (Customer, Limit, Term/Amount etc. marked 'inherit'); 'NoInherit' parent leaves every (non-global) condition to be defined while building the child product.",
    why: "This gives flexibility per product group: reuse common setup where products are genuinely similar, or start from scratch where they're not.",
    memory: "Inherit parent = reuse shared conditions. NoInherit parent = define everything per product.",
    temenos: "Fields like Customer/Account, Limit, Term/Amount, Payment Schedule each individually show 'Inherit' or 'Define Now/Later' per parent product code.",
    related: ["tftGroupCreation", "tftSharedCond"],
  },
  tftProofPublish: {
    title: "Proof and Publish Parent Products",
    simple: "Any change to a product group — including its parent conditions — must be proofed and published before it's usable.",
    example: "After building 'Inherit parent conditions' and 'NoInherit parent conditions' under Agric Loans, both are proofed and published; the Proof and Publish Monitor confirms 'Completed Successfully' for each.",
    why: "Proofing validates the setup is complete and consistent before it's published to the catalogue — the same safety check used by the core AA Product Builder.",
    memory: "Build → Proof → Publish → Monitor confirms 'Completed Successfully'.",
    temenos: "The Proof and Publish Monitor lists Product, Action (Proof/Publish), Available date, Status, and Child Products affected.",
    related: ["aai1proof", "tftAccessGroups", "tftParentCondTab"],
  },

  // ---- Section 4: Hands-On Practice ----
  tftHandsOn1: {
    title: "Hands-On: Building an Inheritance Group",
    simple: "Practice: create a new Loan Inheritance Group and define its shared conditions via the Condition Builder wizard.",
    example: "Path: Administration > Products > Loan Products (tab) > New Inheritance Group. Define shared conditions for Penalty Interest, Settlement, Overdue, Payoff & Closure; check 'Launch Condition Builder' and step through the wizard (training used record EmConsumer as the worked example).",
    why: "This is the first practical step of the Product Wizard Process Flow — nothing downstream (Product Groups, Products) can inherit conditions that don't exist yet.",
    memory: "New Inheritance Group → tick shared conditions → Launch Condition Builder → walk the wizard.",
    temenos: "Only items flagged 'Define Now' in the chosen Inheritance Group are presented by the workflow; each condition area (Penalty Interest, Settlement, Overdue, Payoff/Closure) has its own set of sub-tabs to complete.",
    related: ["tftInheritGroup", "tftSharedCond", "tftHandsOn2"],
  },
  tftHandsOn2: {
    title: "Hands-On: Building Product Groups",
    simple: "Practice: create a Loan Product Group with two parent product codes — one that inherits shared conditions, one that doesn't — then proof and publish.",
    example: "Path: Administration > Products > Loan Products (tab) > New Product Group. Create parent codes 'Inherit' and 'NoInherit'; on the Inherit parent, allocate the shared conditions built in the previous exercise (Penalty Interest, Settlement, Overdue, Payoff and Closure); proof and publish the record.",
    why: "Building both an Inherit and a NoInherit parent in the same exercise makes the difference between the two concrete — one pulls in prior work, the other starts blank.",
    memory: "New Product Group → two parent codes (Inherit / NoInherit) → allocate shared conditions on Inherit → Proof & Publish.",
    temenos: "Practice used category ranges like 3751–3760 (TrnAgric) through 3791–3800 (TrnPayroll), currency GBP.",
    related: ["tftGroupCreation", "tftParentCondTab", "tftProofPublish", "tftHandsOn1"],
  },

  // ============ COURSE · Temenos Functional Training (TFT) — Day 2 ============
  // ---- Section 1: Loan Product & Product Conditions ----
  tftLPCore: {
    title: "Building a Loan Product — EM.PRODUCT.LOAN",
    simple: "The first step in building a loan product is linking it to the product group and parent conditions record that were created earlier; the workflow then presents only the conditions still to be defined.",
    example: "Under Product Group 'AgricLoans' (category range 3400–3449), the Meatballs icon → Create New Product opens a new loan product; its category code (e.g. 3402) must fall inside the group's reserved range or it won't even appear in the dropdown.",
    why: "Linking to the group and parent first is what lets the wizard work out which conditions are already inherited and which still need defining for this specific product.",
    how: "Product Settings names the Product Group and Product Parent (inherited conditions come from here). Product Details then captures Name, Loan Type, Description, Category, Currency and Start/End Date — currencies are restricted to whatever the linked Product Group allows. A start date in the past allows back-dated arrangements; all dated product conditions then carry that start date as part of their record id.",
    memory: "Product name should be meaningful — product conditions are built using it. Category code must sit inside the group's reserved range.",
    temenos: "It's important to create the category code before starting product creation, via New Category. Product currencies are restricted as defined in the linked Product Group.",
    related: ["tftLPCustAcct", "tftLPLimit", "tftGroupCreation", "tftPBWizard"],
  },
  tftLPCustAcct: {
    title: "Customer/Account Conditions — EM.PRDL.CUST.ACCT",
    simple: "Customer and Account conditions — joint ownership, default account name, date convention and adjustment — are always defined per product and can never be inherited.",
    example: "EquipmentLoan disallows joint ownership, defaults new accounts to the name 'Equipment Loan', uses Forward Same Month date convention, and adjusts payment dates by Period (so the actual payment date itself gets cycled, not just its value date).",
    why: "Date Adjustment decides what actually happens when a scheduled payment date lands on a holiday — Value adjusts only the entries' value date (the scheduled date stays put); Period cycles the actual payment date itself.",
    how: "Fields: Allowed (joint ownership Yes/No), default account Name, Base Date Type (Agreement date vs first disbursement/Start — used with Periodic Attributes' Repeating/Rolling restrictions), Date Convention (any convention except Calendar), Convention Negotiable, and Date Adjustment (Value or Period).",
    memory: "Customer/Account conditions are always product-specific — never inherited.",
    temenos: "Base Date Type is a no-change field at the arrangement level, indicating whether the Anniversary field runs from the agreement date or the first disbursement (start) date.",
    related: ["tftLPCore", "tftLPLimit"],
  },
  tftLPLimit: {
    title: "Limit Conditions — EM.PRDL.LIMIT",
    simple: "Whether arrangements on this product check against an approved LIMIT, and if so, a Default or a fully User Defined one.",
    example: "Limit Type = Default needs no further setup — the Loan Origination (LO) and Direct Loan Input applications auto-create limits under predefined LIMIT.REFERENCE records: 8300 AA Non-Revolving Loan (Parent) / 8399 AA Loans Non-Revolving (Child), or 8400/8499 for Revolving.",
    why: "Limit processing checks the loan amount and duration against the limit details at creation — without it, an unauthorised-overdraft override message has to be accepted instead.",
    how: "Fields: Use Limit? (Yes/No), Secured Limit (Variable etc.), Limit Type (Default or User Defined), Limit Reference (for non-revolving products — revolving ones must use a reducing limit), Single Limit. If Limit Type = User Defined, LIMIT.PARAMETER and LIMIT.REFERENCE must be defined in full.",
    memory: "Default = auto-created under 8300–8499. User Defined = you define LIMIT.PARAMETER + LIMIT.REFERENCE yourself.",
    temenos: "Limit parameters are optional — when applied, they check amount and duration against the limit; otherwise a manual override is needed at loan creation.",
    related: ["tftLPCustAcct", "acctoverdraft", "lpb1limit"],
  },
  tftLPTermAmt: {
    title: "Term & Amount Conditions — EM.PRDL.TERM.AMOUNT",
    simple: "Default term and amount per currency of the product, each independently negotiable with its own minimum/maximum and breakage action, plus the cooling-off period and optional disbursement Tranches.",
    example: "EquipmentLoan-USD: default term 12M, negotiable between 3M (Error if broken) and 18M (Override if broken); default amount negotiable between 3,000 (Override) and 30,000 (Error); a 5-Day cooling period; Tranches = No.",
    why: "TERM.AMOUNT is currency-specific — a separate condition record exists for every currency the product allows, each with its own limits.",
    how: "Term Parameters: Default Term, Term Negotiable, Minimum/Maximum Term with a Breakage Action (Error blocks, Override allows with a message) each. Amount Parameters: same pattern for Default/Minimum/Maximum Amount, plus whether Tranches are enabled and, if the product is Revolving, whether it's a Payment type (any payment against outstanding increases the available amount) or Prepayment type (only payments not yet due do).",
    memory: "Cooling Period = the window the customer can cancel the contract penalty-free, stored in AA.ACCOUNT.DETAILS field COOLING.DATE. Tranches and scheduled Disbursement payment types are mutually exclusive.",
    temenos: "For a cooling period to actually stop interest being charged, LENDING-CALCULATE-PAYOFF must run during the cooling period and the arrangement repaid via LENDING-SETTLE-PAYOFF within it — controlled via AA.PERIODIC.ATTRIBUTE's RULE.START option COOLING-OFF. Charges for pre-closure after the cooling period use Activity Restriction under periodic attributes.",
    related: ["tftLPCore", "tftLPPaySchedule", "lpb1termamt"],
  },
  tftLPPaySchedule: {
    title: "Payment Schedule Conditions — EM.PRDL.PAY.SCHEDULE",
    simple: "How disbursement and repayment are scheduled, and which of four repayment types the product uses.",
    example: "EquipmentLoan-USD disburses in Full (not progressively), is automatically disbursed on authorisation, and repays Weekly using the Constant repayment type — equal instalments, calculated for 'Annuity' arrangements and requiring both an Account and an Interest property.",
    why: "The four repayment types shape the whole repayment experience differently, so picking the wrong one changes what the customer actually pays each period.",
    how: "Repayment types: Constant (equal repayments — Annuity; needs Account + Interest properties). Linear (Term Amount repayment stays fixed over the arrangement's life; Interest/Charge/Tax can be added on top). Full Bullet (both principal and accrued interest payable at maturity). Principal Bullet (principal due at maturity, but interest payable at the defined frequency). Custom uses the core table AA.PRD.DES.PAYMENT.SCHEDULE directly — e.g. a Crop Loan product with a 2-month repayment holiday after the first 8 weekly instalments.",
    memory: "Constant · Linear · Full Bullet · Principal Bullet · Custom (→ AA.PRD.DES.PAYMENT.SCHEDULE for anything irregular, like a seasonal repayment holiday).",
    temenos: "Disbursement can go to a T24 Account, Nostro/Internal account, or cash; in Inclusive Banking the first account of the customer matching the category set at Settlement stage is credited automatically. Custom requires Repayment Frequency to also be set to Custom.",
    related: ["tftLPTermAmt", "tftLPInterest"],
  },
  tftLPInterest: {
    title: "Principal & Penalty Interest Conditions — EM.PRDL.PRINCIPAL.INT / EM.PRDL.PENALTY.INT",
    simple: "How principal interest is calculated — day basis defaults from the payment frequency — plus four interest types, and a separate condition (auto-prefixed 'empen') for penalty interest.",
    example: "SalaryLoan-GBP is set to Reducing Balance on Current + Overdue Principal Balance, Fixed rate; a Constant Monthly product defaults Flat interest to day basis 'A' (360/360), while Constant Weekly/Bi-Weekly defaults to 'G' (366/364) — Constant Quarterly/Half-Yearly can't use Flat at all.",
    why: "Flat interest is calculated on the original commitment amount (TOTCOMMITMENT) regardless of what's been repaid; Reducing Balance recalculates on the actual outstanding balance (CURACCOUNT) — very different costs to the customer for the same nominal rate.",
    how: "Calculation Method: Flat or Reducing Balance, with the Calculation Source balance to use. Interest Type: Fixed (min/max rate + breakage action if negotiable), Floating (linked to a rate index + margin), Mixed/Tiered (opens AA.PRD.DES.INTEREST for tiered/negotiated definitions), or Periodic (a periodic-rate index and calculation method). Penalty Interest reuses this same structure on its own tab set (Penalty Selection, Basic Details, Fixed/Floating Rate) — pick an existing empen-prefixed condition or Create New; once an existing condition is selected, all its fields lock for input.",
    memory: "Flat = on original commitment. Reducing Balance = on outstanding balance. Fixed/Floating/Mixed-Tiered/Periodic. Penalty conditions are always named empen….",
    temenos: "Day Basis auto-defaults from the payment schedule frequency for Flat products (A=360/360 monthly, G=366/364 weekly/bi-weekly); Reducing Balance defaults to E (366/365).",
    related: ["tftLPPaySchedule", "tftLPCharge"],
  },

  // ---- Section 2: Additional Product Conditions ----
  tftLPCharge: {
    title: "Charge Conditions — EM.PRDL.CHARGE",
    simple: "Six charge properties are predefined for Lending — Ageing Bill, Disbursement, New Arrangement, Principal Decrease, Payoff and Maintenance Fee — each set to Yes, No, or Not Applicable per currency.",
    example: "SalaryLoan's Ageing Bill Fee is linked to activity 'Missed Payment', a fixed 10 charge, not negotiable. Its Disbursement Fee is linked to every Disbursement activity, calculated (not fixed) at a 1.50 rate on the transaction. Its New Arrangement Fee is a fixed 15 charge linked to LENDING-NEW-ARRANGEMENT, negotiable between 10 (Error) and 20 (Override).",
    why: "Whether a charge is negotiable, fixed or calculated, and which activity or restriction triggers it, drives exactly when and how much the customer is billed.",
    how: "Same Condition (ALL.CCY.SAME): Yes creates one default charge condition for every currency; No means separate conditions must be defined per currency; Not Applicable means the charge doesn't apply at all, so no conditions are defined for it. Each charge is linked either to an Activity (e.g. Missed Payment, Disbursement, New Arrangement) or to a Restriction (e.g. Payoff After Cooling Period, Principal Decrease Tolerance/Count/Total-in-Period), then a Charge Type of Fixed or Calculated with min/max amount and breakage action.",
    memory: "Ageing Bill · Disbursement · New Arrangement · Principal Decrease · Payoff · Maintenance Fee — each Yes / No / Not Applicable.",
    temenos: "Principal Decrease Fee is an example of a break-rule charge for prepaying more than the allowed percentage of the balance; Payoff Fee is an example of a restriction charge for pre-closing before maturity. Charges can be set for negotiation during Loan Origination or Direct Loan Input.",
    related: ["tftLPInterest", "tftLPSettleOverdue"],
  },
  tftLPSettleOverdue: {
    title: "Settlement & Overdue Conditions — EM.PRDL.SETTLEMENT / EM.PRDL.OVERDUE",
    simple: "Settlement decides which account category disbursements and repayments hit automatically; Overdue defines the grace, delinquent and non-accrual-basis thresholds.",
    example: "Where Automatic Disbursal was selected at the Payment Schedule stage, the loan disburses to the first account of the customer in the Disbursal Category set here; automatic repayments similarly debit the first account matching the Repayment Category. A Full repayment rule debits that account in full whether or not funds are actually sufficient.",
    why: "Automatic settlement removes manual intervention from routine disbursement/collection, but the bank must decide up front which account and how strict the collection rule is.",
    how: "Settlement has Settlement, Payout, Repayment Collection and Charge Collection tabs — automatic disbursal/repayment negotiable?, the Repayment Rule (Full vs Partial), and a default account category (with a same-or-different rule for charge vs repayment collection). Overdue defines Ageing Type (by Days or by number of missed payments), whether bills are settled in total (Bill Settlement) or aged individually, plus Grace Period, Delinquent Period (days before delinquent status, chaser advice frequency) and Non-Accrual Basis tabs.",
    memory: "Settlement = where the money automatically comes from / goes to. Overdue = Grace → Delinquent → Non-Accrual, with chaser frequency.",
    temenos: "The Transaction Cycler (RC) module enables partial repayment plus automatic retrials after the due date if funds are short; blocked funds are never reduced by a settlement activity. Activity Charges settle from UNC first, only falling to the Settlement property if there's a remaining balance and Auto Settle = Yes.",
    related: ["tftLPCharge", "tftLPPayoffClose"],
  },
  tftLPPayoffClose: {
    title: "Payoff & Closure Conditions — EM.PRDL.POFF.CLOSE",
    simple: "How long a payoff quote (bill) stays valid, whether dues before the payoff date are treated as settled, and the automatic closure trigger.",
    example: "SalaryLoan's Payoff Expiry Days = 3 means the payoff bill is shown for the effective payoff date plus 3 working days; once that expiry date is reached the payoff bill is purged (deleted) automatically. Closure Method = Automatic, Closure Type = Balance, Closure Period = 30 days after the balance reaches zero (or maturity, depending on Closure Type) before the closure action actually triggers.",
    why: "A payoff quote that never expired would sit stale in the system; a purge date keeps the bill list clean once the customer no longer acts on it.",
    how: "Payoff Parameters: Payoff Expiry Days (defines the working-day expiry/purge date for the bill), Settle Dues (Yes/No — treat pre-payoff-date dues as settled). Closure Parameters: Closure Method (Automatic/Manual), Closure Type (Balance or Maturity Date basis), Closure Period (days after the trigger before the closure action fires), and the account Posting Restriction code applied at closure.",
    memory: "Payoff Expiry Days = how long the quote stays valid, in working days. Closure Type: Balance (when it hits zero) vs Maturity (by date).",
    temenos: "Refer to the AA Loans training guide for the full functionality — this Inclusive Banking screen is a thin front end over the same AA payoff/closure property classes.",
    related: ["tftLPSettleOverdue", "loanrepay", "lpb2closuretype"],
  },
  tftLPEligibility: {
    title: "Eligibility Conditions — EM.PRDL.ELIGIBILITY",
    simple: "A local eligibility application (not the AA rules engine) checks Customer Type, age, gender, residence, nationality and profession — plus, separately, initial deposit and channel/intermediary rules.",
    example: "EquipmentLoan requires the customer to be Individual or Non-Individual ('Both'), minimum age 18 (Error if broken), maximum age 60 (Override if broken), any gender. Its Initial Deposit tab requires 15% of the loan amount, blocked on the customer's account — deposit blocking can even exceed 100% of the loan amount if required.",
    why: "Retail loan products aimed at individuals need very different eligibility criteria to products aimed at businesses or SMEs — at least one condition must always be defined.",
    how: "Eligibility tab sets Customer Type (Individual / Non-Individual / Both). Customer Restrictions set min/max age, gender, each with a Breakage Action. Period Restrictions cover minimum customer tenure and minimum savings-with-institution period. Initial Deposit sets Deposit Type (Individual per-loan or Product-driven), currency, amount or percentage of loan amount — blocked on the customer's account category defined in EM.PRODUCT.PARAMETERS via AC.LOCKED.EVENTS. Progressive Release lets the blocked amount reduce over the term as a percentage of the outstanding principal being repaid. Partial Blocking, if the initial-deposit breakage action is Override, can block just the account with the greatest balance, and optionally track/increase the blocked amount as more funds become available (or deduct the shortfall from the loan amount before disbursement). Channels sets which access channels (Internet, Mobile) and/or Intermediaries (e.g. Broker, needing the Agency/AG module) the product is sold through.",
    memory: "Eligibility runs locally (EM.PRDL.ELIGIBILITY), not the AA rules engine — though extra rules can still be layered on via the rules engine if needed. Initial Deposit can block more than 100% of the loan if required.",
    temenos: "Custom eligibility checks (e.g. maximum age at loan maturity) were expanded from R19. Category codes used for period restrictions and the initial-deposit account category come from EM.PRODUCT.PARAMETERS.",
    related: ["tftLPCharge", "loaneligibility", "tftLPMaintain"],
  },

  // ---- Section 3: Review, Publish & Maintenance ----
  tftLPReviewPublish: {
    title: "Product Review Report, Proofing & Publishing",
    simple: "Before publishing, a Product Review Report lists every condition set so far, tab by tab, for a final check — then the product is proofed and published exactly like a core AA product.",
    example: "EquipmentLoan's Review Report lists Customer/Account (Joint Ownership No, Base Date Start, Convention Forward Same Month…), then Limit (Default), then Term/Amount per currency (USD: Default Term 12M, Min 3M/Error, Max 18M/Override, Cooling 5D, Amount Min 3000/Override, Max 30000/Error, Tranches No) — all on one screen before Publish Product runs (Direct Publish = Yes, Process Method Online, Process Status Completed Successfully).",
    why: "Once published, the product wizard can no longer amend it — this review is the last chance to catch a wrong condition before it's locked into the wizard workflow.",
    how: "Publish Product captures GB Description, Action (Publish), Direct Publish (Yes/No), Available Date, Process Method (Online) and Process Status. Proofing (Designing → Proofing → Publishing) expands the product definition to include every inherited property, ensures a currency condition exists for each allowed currency, ensures a condition exists for every property, ensures all mandatory properties are included, and cross-validates every product condition for consistency and to avoid conflicts.",
    memory: "Review Report = the final checklist. Proofing = expand + validate + cross-check. Publish = go live, workflow ends.",
    temenos: "The product conditions created in AA are what actually become ready for sale once published — the wizard's job is done at that point.",
    related: ["tftLPMaintain", "tftProofPublish"],
  },
  tftLPMaintain: {
    title: "Product Maintenance, Global Parameters & Stage Owners",
    simple: "After publishing, the product wizard is create-only — changes go through the AA Core product builder instead, except Settlement, Eligibility and Limit, which keep their own dedicated maintenance versions.",
    example: "To change Term/Amount conditions on a published product you amend AA.PRD.DES.TERM.AMOUNT directly via Administration > Products > Classic Product Builder; but to change Settlement you use EM.PRDL.SETTLEMENT,CATEG.CHANGE, Eligibility uses EM.PRDL.ELIGIBILITY,EDIT.STANDALONE, and Limit uses EM.PRDL.LIMIT,LIMIT.CHANGE.",
    why: "Product changes are recommended right before COB so they take effect from the next day, instead of disrupting arrangements already processing that day.",
    how: "Global Product Parameters (EM.PRODUCT.PARAMETERS, record id always SYSTEM) define bank-wide settings shared across every loan product: category codes for initial deposit, savings age eligibility checks, the payment product id for direct loans, limit parameters for group lending, category codes for guarantee accounts, and the savings multiplier for individual borrowers. Product building is itself a Process Workflow — different stages (Basic Product Details, Customer/Account Parameters, Limit Parameters, Term/Amount Parameters, Payment Schedule Parameters, Principal/Penalty Interest, Charge, Settlement, Overdue, Payoff/Closure, Eligibility, Product Review, Publish Product) can each have their own owner — an individual user, a user group, or a department — defined via PW.PARTICIPANT (Owner / EPL.PRODUCT.BUILDER). The build can also be paused at any stage — closing the record leaves it 'Pending' so the next user can pick it up by clicking its action icon.",
    memory: "Post-publish: AA Core builder for most things; Settlement/Eligibility/Limit keep their own EM.PRDL.* maintenance versions. Global Product Parameters record id = SYSTEM. Stage owners via PW.PARTICIPANT.",
    temenos: "Path: Administration > Products > Loan Products > Global Product Parameters for EM.PRODUCT.PARAMETERS; Classic Product Builder menu for direct AA-table maintenance.",
    related: ["tftLPReviewPublish", "tftLPEligibility", "tftLPLimit"],
  },

  // ---- Section 4: Hands-On Practice ----
  tftLPHandsOn: {
    title: "Hands-On: Building a Loan Product End to End",
    simple: "Practice: create a category, then a full loan product — Customer/Account, Limit, Term/Amount — under your assigned product group.",
    example: "Practice Group 1: product group TrnAgric (category range 3751–3760), create category 3752 for product TrnSeed, currency GBP. Solution used product group 'Business', Product Parent 'Default – no inheritance', name 'Auto Loans', category 3202 'Auto Loans', currency USD, then Customer/Account (Joint Ownership No), Limit (Use Limit? Yes, Secure Limit Variable, Limit Type Default), and Term/Amount (Default Term 36M, negotiable 12M/Error–48M/Override; Default Amount negotiable 2000/Override–10000/Override; Tranches No, Revolving No).",
    why: "Building one product end to end — category, settings, details, then each condition tab — is what makes the whole Day 2 concept set click into a single workflow instead of a list of separate screens.",
    how: "Path: Administration > Products > Loan Products (tab): use New Category to create the category record for your product, identify your product group, then Meatballs icon → Create New Product. Afterwards, use Administration > Products > Loan Products > Classic Product Builder to view the product and its conditions as generated in AA.",
    memory: "New Category → Create New Product → Product Settings/Details → Customer/Account → Limit → Term/Amount — then verify it all landed correctly in AA via the Classic Product Builder.",
    temenos: "Five practice groups in the exercise (TrnAgric, TrnPerson, TrnSchool, TrnTrading, TrnPayroll) each get their own category range and product, all in GBP.",
    related: ["tftLPCore", "tftLPCustAcct", "tftLPLimit", "tftLPTermAmt"],
  },

  // ---- Section 5: Deposit & Savings Plans Product Builder (afternoon) ----
  tftDSOverview: {
    title: "Deposits Product Overview",
    simple: "Three deposit product types: Term Deposits (fixed sum, fixed duration), Call/Notice Deposits (instant-access, no fixed period — built on core AA Deposits, not this wizard), and Savings Plans (recurring deposits with a bonus incentive).",
    example: "Sample products: '18MonthFixed' (Term Deposit), '5YearMonthly' (Savings Plan); Call Deposits are flagged 'Back to Core' since they're built via the core AA Deposits collateral, not the Inclusive Banking wizard.",
    why: "Each type serves a different saving behaviour — lock funds for a known return, keep instant access, or build a discipline of regular small deposits with a reward for consistency.",
    how: "Term Deposits (Fixed Deposits): a particular sum invested for a fixed duration, typically 7 days to 10 years; the rate depends on the lock-in period. Savings Plans (recurring deposits): a fixed sum invested at a fixed interval, usually monthly; earns interest to maturity and may earn a bonus for consistency. Call Deposits: no fixed period, instant access, unlimited withdrawals/deposits — like a hybrid of savings and current.",
    memory: "Term = lock a lump sum. Savings Plan = recurring small deposits + bonus. Call = instant access, built on Core AA Deposits.",
    temenos: "Access the Deposits Product Builder and its parameter tables via the Deposit Products tab on the Product Administrator page.",
    related: ["tftDSInherit", "tftDSSavingsPlan", "tftLPCore"],
  },
  tftDSInherit: {
    title: "Deposit Product Groups & Inheritance — EM.PRODUCT.GROUP",
    simple: "The inheritance group, product group and its global conditions all live on the same table; Settlement, Tax, Renewal and Closure are the conditions most commonly shared across deposit products.",
    example: "Delivered groups: SavPlans (category range 6500–6599) and TermDeps (6700–6799), each holding up to 200 deposit/savings-plan products; a Product Type field on the group (Term Deposit / Savings Plan / Call Deposit) drives which workflow the wizard presents.",
    why: "Shared conditions can be mixed and matched per product group — reuse what's genuinely common, define the rest fresh — exactly like the Loan Product Builder's inheritance model.",
    how: "Deposit Inheritance Group Details capture Name, Description, Product Line (Deposits) and Product Type. Shared Conditions are optional — for deposits, Settlement, Tax, Renewal and Closure are commonly defined here, each independently 'Define Now' or 'Define Later', and can differ between Term Deposit and Savings Plan product types. Global Conditions (ACCOUNTING, ACTIVITY/API, ACTIVITY/MAPPING, MESSAGING, PRESENTATION, CHARGE.OVERRIDE) are predefined in the ISB — handle with care.",
    memory: "SavPlans 6500–6599 · TermDeps 6700–6799. Settlement/Tax/Renewal/Closure = the usual shared conditions.",
    temenos: "Up to 200 deposit and savings-plan products can be created based on the Inclusive Banking setup.",
    related: ["tftDSOverview", "tftDSSavingsPlan", "tftLPMaintain"],
  },
  tftDSSavingsPlan: {
    title: "Savings Plans — EM.PRODUCT.DEPOSIT",
    simple: "A savings plan is a recurring-deposit agreement — the customer commits to depositing a fixed sum on a periodic basis, usually earning a bonus for keeping to that schedule.",
    example: "A commitment plan pays a bonus at the end of the committed period, or at agreed intervals, if delinquency stays under agreed thresholds — e.g. the average delinquency amount for a status stays below 'x', and total days in a delinquent status stays below 'x'. The bonus is generally payable on the Savings Plan's maturity date.",
    why: "The bonus is the mechanism that actually enforces the 'regular small deposits' discipline the product is designed around — break the schedule too often and the bonus is reduced or withheld.",
    how: "The whole product-build workflow is driven by the PRODUCT.TYPE field set at Product Group creation — choosing Savings Plan (vs Term Deposit or Call Deposit) changes which stages and tabs the wizard presents afterward. Building a Savings Plan product is otherwise the same process as building a Loan product — link to a group and parent, then work through each condition stage.",
    memory: "Savings Plan = recurring deposit + bonus for consistency. PRODUCT.TYPE on the group picks the whole workflow.",
    temenos: "Building Savings Plan products follows the same overall process as Loan products (as covered in the prior lesson) — this lesson focuses only on the differences.",
    related: ["tftDSOverview", "tftDSTermAmt", "tftDSCharge"],
  },
  tftDSTermAmt: {
    title: "Savings Plans Term & Amount — EM.PRDD.TERM.AMOUNT",
    simple: "Unlike other deposit products, the amount set at the Term/Amount stage maps to Payment Schedule's ACTUAL.AMT field — it's the recurring commitment amount, not a one-off principal.",
    example: "WeeklyPlan-GBP defaults the deposit amount to 500, not negotiable; the system generates an EXPECTED bill online for settlement on each regular deposit date, based on that committed amount.",
    why: "Because savings plans are built from many small recurring deposits rather than one lump sum, the 'amount' condition has to describe the recurring commitment, not a single principal figure.",
    how: "Term can be defaulted and negotiated at arrangement level, indicating the term of the commitment savings plan. If an amount is entered here it's treated as the initial deposit; the term amount field may be left blank instead, with the actual commitment amount specified in Payment Schedule's ACTUAL.AMT field. Permitted terms can be listed under the Negotiation tab. Cooling Period and Cancel Period fields apply to Savings Plans exactly as they do to other deposit/loan products.",
    memory: "Term Amount here ≠ one-off principal — it maps to the recurring ACTUAL.AMT in Payment Schedule; bills generate as EXPECTED online.",
    temenos: "Bills are generated during COB on the regular deposit schedule date, based on the committed amount.",
    related: ["tftDSSavingsPlan", "tftDSPaySchedOverdue", "tftLPTermAmt"],
  },
  tftDSCharge: {
    title: "Savings Plans Bonus & Charge Conditions — EM.PRDD.CHARGE",
    simple: "Bonus is a scheduled charge paid on the maturity date, conditional on the customer keeping to the plan; a separate Bonus Restriction charge triggers — waiving or reducing the bonus — whenever those conditions are actually broken.",
    example: "NewSP-BONUS-ALL: a Calculated charge linked to the Renewal Date schedule, frequency every 1 year, rate 1.5 on the Deposit Amount. NewSP-BONUSRESTRICT-ALL: linked to Restriction 'Maximum No. Of Delinquent Payments' (Number = 3), Charge Action = Replace, Charge Property = BONUS.",
    why: "Paying the bonus is easy; the harder, more valuable half of the design is defining exactly when it gets clawed back — and by how much — when the customer misses the schedule.",
    how: "Bonus may be conditional on: no partial withdrawal during the term, no late payments during the term, or the number of missed payments staying under a pre-defined tolerance. Bonus Restriction (payable-charge) triggers whenever the bonus conditions are broken, and can be set to Waive the bonus completely or pay it at a lower rate. An Overdue product condition must be defined to actually monitor delinquent payments for this to work. Deposit Ageing Fee is a separate, optional penalty charge for late payment of the regular deposit amount, also selected at the Charge stage.",
    memory: "Bonus = reward, scheduled at maturity. Bonus Restriction = the clawback, triggered by a broken restriction. Both need Overdue defined to track delinquency.",
    temenos: "Bonus and Bonus Restricted selection are opted for at the Charge selection stage, alongside the standard Deposit Ageing Fee.",
    related: ["tftDSSavingsPlan", "tftDSPaySchedOverdue", "tftLPCharge"],
  },
  tftDSPaySchedOverdue: {
    title: "Savings Plans — Payment Schedule & Overdue",
    simple: "Savings Plans get an extra Payment Schedule tab for the regular deposit frequency, plus an Overdue stage that only becomes mandatory once ageing-based charges or bonus restrictions are actually defined.",
    example: "NewSP-GBP: Interest Method 'Pay', Interest Frequency Monthly, Bonus Method 'Capitalise'; the Savings Plan Settings tab separately sets Deposit Frequency Monthly, not negotiable. Overdue: Grace Days/Bills 1 (chaser every 2 weeks), Delinquent Days/Bills 5 (chaser every 1 month).",
    why: "Interest/bonus payment and the deposit-taking schedule are genuinely different cadences — a monthly-paid bonus doesn't have to match a weekly deposit commitment, so they're configured on separate tabs.",
    how: "Payment Schedule stage: Interest and Bonus Settings tab (default interest/bonus payment method and frequency — e.g. Pay vs Capitalise), plus a Savings Plan Settings tab unique to this product type (deposit frequency, negotiable?). Overdue stage is presented for optional definition — but becomes mandatory if overdue-based charges (like Deposit Ageing Fee) or overdue-based bonus restrictions have been defined; if no such restriction exists, the system instead asks 'Apply Overdues?' and only triggers the Overdue definition fields if Yes is chosen.",
    memory: "Payment Schedule: Interest/Bonus tab + Savings Plan Settings tab (deposit frequency). Overdue: optional, unless ageing charges/bonus restrictions force it mandatory.",
    temenos: "Grace Period and Delinquent Period tabs mirror the same Basic Details / Grace / Delinquent Period shape used on Loan Overdue conditions.",
    related: ["tftDSTermAmt", "tftDSCharge", "tftLPSettleOverdue"],
  },
  tftDSHandsOn: {
    title: "Hands-On: Building a Savings Plan End to End",
    simple: "Practice: configure a full Savings Plan product — Target Savings — against eight client requirements covering amount, interest, bonus, redemption fee, withdrawal fee and auto-closure.",
    example: "Client brief: deposits 100–1000 biweekly, 18-month term, 5-day free cancellation; fixed non-negotiable 2% interest paid monthly, subject to withholding tax; 0.5% bonus at maturity if no more than 2 overdue deposits (else waived); 1% early-redemption fee if terminated before maturity; USD 10 partial-withdrawal fee; USD 5 penalty per missed payment (overdue after 2 days late); funded manually (cash/cheque/account transfer) but interest/fees/proceeds pay out automatically; auto-close 3 days after zero balance.",
    why: "This exercise forces every Savings Plan concept from this section — Term/Amount, Charge (Bonus + Bonus Restriction + fees), Payment Schedule, Overdue — into one coherent, realistic product, the same way the Loans hands-on did for lending.",
    how: "Path: Administration > Products > Deposit Products > Product Groups > SavPlans > Create New Product. In the worked solution 'TargetSav': Product Details set Deposit type, category 6506, currency GBP; Customer/Account set Base Date Agreement, Convention Forward, Date Adjustment Period; Deposit Interest set Reducing/Current Account balance basis, Fixed 2% not negotiable, day basis E; Tax applied with code WHT; Charges defined PRECLOSUREFEE (Restriction-linked, 'Early Redemp. After Cooling Period', Calculated 1% of Deposit Amount), WITHDRAWALFEES (Restriction-linked, fixed 10), and DEPAGEINGFEE (Activity-linked to Overdue Payment, fixed 5).",
    memory: "TargetSav walkthrough: Product Details → Customer/Account → Deposit Interest → Tax → Charges (Preclosure, Withdrawal, Ageing) → Payment Schedule/Bonus → Overdue.",
    temenos: "Verify the finished product and its conditions as generated in AA via Administration > Products > Deposit Products > Classic Product Builder.",
    related: ["tftDSTermAmt", "tftDSCharge", "tftDSPaySchedOverdue"],
  },

  // ---- Section 6: Account Product Builder & Overdraft Facilities (afternoon) ----
  tftAPOverview: {
    title: "Retail Accounts Overview & Product Groups",
    simple: "Three retail account types — Savings, Current and Share accounts — each with its own delivered inheritance group and reserved category range.",
    example: "Sample products: Savings(Child), Current(Student), Regular Share Ac. Delivered groups: Current (category range 1000–1099), Savings (6000–6099), Shares (7300–7399) — up to 300 account products can be created across them.",
    why: "Overdraft facilities only make sense on transactional (current-type) accounts, so keeping the three account types on separate inheritance groups keeps overdraft-only conditions from leaking into savings/share products.",
    how: "Access via the Account Products tab on the Product Administrator page — the process mirrors building Loan and Deposit products; this section covers only the differences unique to accounts.",
    memory: "Current 1000–1099 · Savings 6000–6099 · Shares 7300–7399. Up to 300 account products total.",
    temenos: "Inheritance groups and shared conditions for Current, Savings and Share Accounts are delivered with the Inclusive Banking ISB and can be amended suitably if necessary.",
    related: ["tftAPInherit", "tftAPLimit", "tftDSOverview"],
  },
  tftAPInherit: {
    title: "Account Inheritance Components & Group Conditions",
    simple: "Statement, Tax, Dormancy, Payoff and Closure are the conditions most commonly shared across retail account products, defined on the same Inheritance Group table as its Global and Shared Conditions.",
    example: "EmSavings inheritance group: Parent Product Code default 'LIMIT: Define Now', Statement 'Define Now', Settlement 'Define Now', Dormancy 'Define Now', Change Product 'Define Now', Closure 'Define Now', Balance Availability 'Define Later' — a different mix to what a Current-account group would set.",
    why: "As with Loans and Deposits, this shared/parent layer is what stops every individual account product having to redefine the same statement, tax and dormancy rules from scratch.",
    how: "Global Conditions here are predefined ISB technical classes (ACCOUNTING, PAYOUT.RULES, ACCOUNTS/PAYMENT.RULES, CONSTRAINT, ALERTS, CHARGE.OVERRIDE, AGENT.COMMISSION, FACILITY, PRICING.RULES) — not to be amended without due care. Shared Conditions cover things like Tax, Customer, Officers, Account, Credit/Debit Interest — each flagged Define Now (set at the shared level) or Define Later (deferred to the child product).",
    memory: "Statement · Tax · Dormancy · Payoff · Closure = the usual shared conditions for accounts.",
    temenos: "The Account Product builder and its parameter tables are accessible through the Account Products area on the Product Parameters / Product Administrator page.",
    related: ["tftAPOverview", "tftAPAvailDormancy", "tftLPMaintain"],
  },
  tftAPLimit: {
    title: "Account Limit Conditions (Overdraft) — EM.PRDA.LIMIT",
    simple: "The mechanism that actually gives a retail account (typically Current) an overdraft facility — the system auto-creates the limit record as part of account opening, managed through AA with limit Serial set to NEW.",
    example: "CurrentOD product: Use Limit? Yes, Default Limit Amount, Minimum Amount 1000 (Breakage Action Override), Maximum Amount 5000 (Breakage Action Override), Limit Reference 200, Limit Ref Negotiable Yes, Limit Serial NEW, Single Limit Yes.",
    why: "Providing an overdraft is really just providing the account with an automatically-created, AA-managed limit — the same limit machinery used elsewhere in Transact, not a bespoke overdraft feature.",
    how: "Use Limit? (Yes/No). If Yes: a Default Limit Amount can be set, or Minimum/Maximum amounts each with a Breakage Action (Override etc.) to allow negotiation within a range at account opening. Limit Reference identifies the limit type for contracts opened under this product; Limit Serial is always set to NEW so a fresh limit is created per account. Single Limit decides whether the account uses one limit record.",
    memory: "Overdraft = an auto-created AA limit, Serial always NEW. Min/Max amount + Breakage Action controls the negotiable range.",
    temenos: "The limit record is created automatically as part of the account-opening process — limit handling itself is then done through and managed by AA.",
    related: ["tftAPOverdraftOther", "acctoverdraft", "tftLPLimit"],
  },
  tftAPOverdraftOther: {
    title: "Overdraft — Other Parameters, Renewal & Compliance Checks",
    simple: "A separate application workflow, single-vs-all-account checking, joint-liability handling, and two regulatory checks — 30-day credit return and unauthorised overnight debit events — govern how an overdraft is actually operated and reviewed.",
    example: "CurrentOD: Separate Application? ticked, Check Type Single, Include Joint Accounts ticked with Split liability, Review Frequency Annually, Renewal Type Conditional (e.g. 'Min.30d.credit', 'No.unauth.debit').",
    why: "These parameters exist largely for regulatory conduct requirements — an overdraft that's never reviewed, or that lets a joint holder dodge liability, or that tolerates repeated unauthorised debits unchecked, is a compliance problem.",
    how: "Separate Application?: Yes routes overdraft creation through its own application workflow. Check Type: Single (the maximum-limit check applies to one account) or All (applies across every account the customer holds). Joint Accounts: Full check (joint holders are fully liable) or Split check (liability is split equally between them). Overdraft Review Frequency: Monthly / Quarterly / Yearly. Renewal Type can be Automatic, User-triggered, or Conditional on named conditions such as MIN.30D.CREDIT and NO.UNAUTH.DEBIT.",
    memory: "MIN.30D.CREDIT: the account must return to credit for ≥30 days within any 12-month rolling period, or the overdraft can't auto-renew and must be reviewed (review can happen up to 30 days before the renewal date). NO.UNAUTH.DEBIT: the facility is queued for immediate review after 3 out-of-order (unauthorised overnight debit) events — payment items like referrals don't count toward this.",
    temenos: "Both conditions are currently maintained in EB.PARAM > ALL-EM.ACCT.LIMIT.REVIEW. The NO.UNAUTH.DEBIT rule mirrors an Irish MPCAS regulatory requirement: after more than three over-limit balances within the overdraft term or a 12-month period (whichever is shorter), the institution must review whether the facility should be amended, withdrawn, or the account closed.",
    related: ["tftAPLimit", "acctoverdraft"],
  },
  tftAPAvailDormancy: {
    title: "Account Availability (Notice) & Dormancy Conditions",
    simple: "Balance Availability defines notice-account withdrawal rules (amount, notice period, availability delay); Dormancy defines how long an account can sit inactive before it's flagged Inactive, then Dormant, then Unclaimed.",
    example: "PremiumSavings (a Notice account): Default Notice Amount 0 (nothing withdrawable without notice), Default Notice Period 7D, Notice Availability 1D. CurrentOD dormancy: Inactive after 6M (notice every 1 month), Dormant after 12M (notice every 1 month, charge every 1 day).",
    why: "Notice accounts trade a withdrawal delay for a better rate; dormancy protects both the bank and the customer by flagging — and eventually restricting — accounts nobody is actually using.",
    how: "Balance Availability Parameters: Notice Amount (max withdrawable without notice), Notice Period (days/months' notice needed for anything above that), Notice Availability (how long after notice is served before the funds are actually available) — the notice account product's category code must exist in ACCOUNT.CLASS record SAVINGS. Dormancy has Inactive / Dormant / Unclaimed stages, each with its own Period, Notice Days and Notice/Charge Frequency; user-defined dormancy statuses here are mutually exclusive with the Inactivity Months field on the COMPANY record. Qualifying Activities (which financial/non-financial customer activities reset or count toward dormancy) are configured per Activity Class.",
    memory: "Availability = notice-account withdrawal rules. Dormancy = Inactive → Dormant → Unclaimed, each with its own period/notice/charge.",
    temenos: "The Inactivity Months field on the COMPANY record marks an account Inactive at COB if no financial/non-financial customer activity is seen; ACCT.INACTIVE.RESET removes that flag. Auto-closure of dormant accounts is additionally supported via Product Qualifier and Activity Restriction conditions.",
    related: ["tftAPInherit", "acctdormant"],
  },
  tftAPChargesRestrict: {
    title: "Account Charges, Restrictions & Change Product",
    simple: "General (Ledger) charges bill the customer based on account activity or balances over a period via Periodic Charges; Restrictions block or restrict specified transactions; Change Product automatically migrates an account from one product to another when a defined condition is met.",
    example: "Ledger charge types: No. of Debits, No. of Credits, Highest Debit Fee, Turnover Debit, Turnover Credit, Transaction Fee. A Restriction example: block any transaction that would overdraw an account with no overdraft facility, Restriction Value 10000, Breakage Action Override. A Change Product example: automatically switch a Children's Savings account to a Regular Savings product on the customer's 18th birthday (Change Period 'R_BIRTH + 18Y'), giving 30 prior days' notice.",
    why: "These three conditions cover what happens to an account after it's opened: what it costs to run, what it's allowed to do, and when it should automatically graduate to a different product.",
    how: "General Charges: optionally defined via the Accounts product builder, collected based on activities or balances over a period, that period set as a Periodic Charges frequency in the Payment Schedule. Periodic Charges (EM.PRDA.PERIODICCHARGES) let the bank set overall min/max ledger fee, free-charge/free-transaction counts, and which Charge Groups (AA.CHARGE.GROUP virtual table) are assessed or exempted. Restrictions (EM.PRDA.ACCOUNT.RESTRICT): Complete Restriction of specified transaction types (Error or Override), Periodic Rules (transaction limits over time, e.g. max 3 cash withdrawals a quarter), Property Rules (restriction rules evaluated against Payment Schedule properties, e.g. waive Credit Interest after more than three withdrawals a year). Change Product (EM.PRDA.CHANGE.PRODUCT): defines the target product and the change-period trigger; both products must belong to the same product group.",
    memory: "Charges = what it costs (Ledger + Periodic). Restrictions = what's blocked (Complete/Periodic/Property). Change Product = automatic product migration on a trigger condition.",
    temenos: "Charge groups can only be defined for charges calculated based on activities. Restrictions and Change Product both sit under the account's own product conditions, alongside Charge.",
    related: ["tftAPAvailDormancy", "tftAPLimit", "lpb1posting"],
  },
  tftAPHandsOn: {
    title: "Hands-On: Building an Account Product End to End",
    simple: "Practice: review the delivered Account product groups, then configure a full Savings account — Tangerine Savings — against seven client requirements covering age eligibility, minimum balance, withdrawal limits, dormancy, tiered interest and reporting.",
    example: "Client brief: voluntary savings account for individuals and joint holders aged 18–65; USD 100 minimum balance (0.5% charge if it falls below at any time); 3 free quarterly withdrawals on demand (interest waived if exceeded), never allowed to overdraw; dormant after 12 months' inactivity (USD 20 monthly fee, chaser at day 5 then monthly); tiered non-negotiable interest — central bank rate +0.5% on the first USD 1000, +1% beyond — capitalised monthly, subject to withholding tax; no other ledger/maintenance fees; quarterly statements.",
    why: "Same purpose as the Loans and Savings-Plan hands-on exercises — one realistic product forces Customer/Account, Limit-type restrictions, Dormancy, tiered Interest and Charges into a single coherent build.",
    how: "Path: Administration > Products > Account Products > Product Groups > Savings > Create New Product. In the worked 'StandardSavings' solution: Product Details set Account Type 'Savings Account', category 6004; Customer/Account set Joint Ownership No, Base Date Agreement, Calendar convention, Generate IBAN No, Passbook No; Balance Availability Parameters set Notice Account Product? No (not a notice account).",
    memory: "Practice 1 first reviews existing groups; Practice 2 builds 'Tangerine Savings' end to end — age/balance rules, withdrawal restriction, dormancy, tiered interest, no extra fees, quarterly statements.",
    temenos: "Verify the finished product and its conditions as generated in AA via Administration > Products > Account Products > Classic Product Builder.",
    related: ["tftAPOverview", "tftAPLimit", "tftAPAvailDormancy", "tftAPChargesRestrict"],
  },

  // ============ COURSE · Temenos Functional Training (TFT) — Day 3 ============
  // ---- Section 1: Origination Overview & Common Parameters ----
  tftOROverview: {
    title: "Origination Overview — Products, Customers & Processing",
    simple: "Inclusive Banking Origination is a workflow-driven, customer-centred application process covering Loans, Deposits and Accounts, with configurable stage ownership.",
    example: "Loans support all three customer types (Individuals, Groups, SMEs); Deposits support Individuals and SMEs only (no group deposits); Accounts support all three again. On approval, accounts can auto-create for every product; loans can auto- or manually-disburse; deposits can auto-fund or be funded manually via cash.",
    why: "Being customer-centred means processing runs in the context of the identified customer, combining their record with other relevant data so results are applied fairly and consistently for every applicant.",
    how: "Loan groups supported: Consumer, Business, Home Loans. Deposit groups: Term Deposits, Savings Plans. Account groups: Current, Savings, Share (credit unions). Stage ownership lets one group of users initiate/complete some stages while another group (e.g. approvers) handles others.",
    memory: "Loans/Accounts = Individuals + Groups + SMEs. Deposits = Individuals + SMEs only, no Groups.",
    temenos: "Origination is workflow-driven — users are guided stage to stage through preconfigured stages, and processing runs in the context of the identified customer once known.",
    related: ["tftORParamTables", "tftORStage", "tftLPCore"],
  },
  tftORParamTables: {
    title: "Origination Parameter Tables — EM.XX.*",
    simple: "Seven parameter tables (prefixed EM.XX, where XX = LO/DO/AO/FO for Loan/Deposit/Account/Facility Origination) must be configured for origination to function.",
    example: "EM.LO.STAGE defines loan origination's workflow stages; EM.LO.APPLICATION.STATUS defines the statuses within each stage; EM.LO.PARAMETERS is the main table tying everything together for a given loan product or group.",
    why: "Each table handles one layer of the workflow — stage, status, main parameters, approval, checklist, documents, and the underlying Process Workflow (PW) tables — so origination behaviour is fully data-driven rather than hard-coded.",
    how: "Origination Stage: EM.XX.STAGE. Application Status: EM.XX.APPLICATION.STATUS. Main Parameters: EM.XX.PARAMETERS. Approval: EM.XX.APPROVAL. Checklist Items: EM.XX.STAGE.CHECKLIST. Documents: EM.XX.DOCUMENT. Underlying it all: PW.ACTIVITY and PW.PARTICIPANT (Process Workflow tables, shared across all origination lines).",
    memory: "EM.XX.* — XX = LO (Loan) / DO (Deposit) / AO (Account) / FO (Facility) Origination.",
    temenos: "Path: Administration > Products > Loan Origination / Deposit Origination / Account Origination — each origination line has its own tab on the Product Administrator screen, alongside Scoring & Profiling and Credit Security.",
    related: ["tftOROverview", "tftORStage", "tftORLDAParams"],
  },
  tftORStage: {
    title: "Origination Stage & SLA — EM.XX.STAGE",
    simple: "Each workflow stage can be marked Optional (user decides) or left blank (required, cannot be skipped); an SLA in days plus tolerance tracks how long the bank expects each stage to take.",
    example: "Loan stages: Application Input, Eligibility Check, Guarantor Input, Credit Check, Collateral Input, Credit Scoring, Credit Assessment, Review/Approval, Offer Production, Loan Creation. On the Loan Application Stage record for Application Input, an SLA of 1 day is set with an SLA Escalation path pointing to a PW.PARTICIPANT record.",
    why: "SLA breach escalation ensures a group of the institution's officers is automatically notified via Task Management if a stage overruns its target processing time — the bank's own in-house target for customer applications.",
    how: "Stage fields: Description, SLA Estimated (days), SLA Tolerance (optional extra days), SLA Escalation (must be a valid PW.PARTICIPANT record). A stage left blank in the Stage Option field of EM.XX.PARAMETERS is Required; explicitly set to Optional, the user can skip it; set to Not Required, it isn't presented at all.",
    memory: "Blank in EM.XX.STAGE = required, can't skip. SLA Estimated + Tolerance → breach → SLA Escalation notifies via Task Management.",
    temenos: "SLA is currently tracked in days only. The escalation field value must resolve to a valid PW.PARTICIPANT record — an individual, group, or department.",
    related: ["tftORParamTables", "tftORAppStatus"],
  },
  tftORAppStatus: {
    title: "Application Status — EM.XX.APPLICATION.STATUS",
    simple: "A status-within-status model: each overall Process Status (e.g. Applied, Approved, Disbursed) contains a set of Application Statuses scoped to specific stages.",
    example: "Under Process Status 'Applied', Application Input has status 101 'Loan application input complete'; Eligibility Check has 201 'Eligibility check complete'; other statuses like 106 'Pending customer interview' put the application on Hold. Status 712 'Referred to CEO' spans both Credit Assessment and Review/Approval stages, with Action = Hold and Refer To = CEO.",
    why: "Splitting statuses this way lets one status genuinely mean the same thing across every stage it's valid for, while still tracking exactly where in the process an application sits.",
    how: "Fields per status: Description, Stage(s) it applies to, Action (Complete / Hold / Cancel / Skip), Notes Required (Yes/No), Process Status, and optionally Next Application Status (what should be selectable next within the same stage) plus Refer To (a valid PW.PARTICIPANT — e.g. a Loan Approver referring to CEO) and Dual Approval Route.",
    memory: "Process Status = the big picture (Applied/Approved/Disbursed…). Application Status = the fine-grained status inside a stage. Refer To lets a user hand off processing to a different participant role.",
    temenos: "The 'Refer To' set of statuses lets users transfer application processing to a valid PW.PARTICIPANT role — e.g. an approving officer referring to CEO or Branch Operations Manager for higher-level sign-off.",
    related: ["tftORStage", "tftORLDAParams"],
  },
  tftORLDAParams: {
    title: "Loan, Deposit & Account Parameters — EM.XX.PARAMETERS",
    simple: "The main parameters table brings everything together per product or product group, adding line-specific fields: Group loan handling for Loans, Prospects Allowed and Skip Approval for Deposits/Accounts.",
    example: "Loan EquipmentLoan record: Group Allow Yes, Group Amount Flexible, Group Term Flexible, Expiry Before/After Approval 5/2 days, Allow Delinquent Yes, Allow Written Off Yes. Deposit 12MonthsDeposit record: Prospects Allowed Yes, Documents Required for All Amounts No, Term Change Break-Rule Override, Skip Approval for Authorized Users Yes.",
    why: "The table's id is the product or product group (or SYSTEM/Branch Mnemonic for Accounts), so the same institution can configure different rules per product — or share one record across a whole product group.",
    how: "Loan-only: Group Allow, Group Amount (None/Divide Evenly/Flexible), Group Term (Uniform/Flexible), Capitalise Property (for Top-Up/Reschedule). Deposit/Account: Prospects Allowed, Documents Required for All Amounts, Term Change Break-Rule, Skip Approval for Authorized Users (No = approval stage never skipped; Yes = approval stage never marked Required — the stage is skipped whenever the application amount is within the current user's own approval limit). All three share Expiry Before/After Approval (days of inactivity before an application expires, notified via Task Management to the SLA Escalation path).",
    memory: "Divide Evenly = forced equal shares, no user changes. Flexible = evenly split by default but the user can redistribute, as long as the group total still tallies. Skip Approval Yes → REVIEW.APPROVAL stage can never be marked Required.",
    temenos: "For Facilities (e.g. Overdrafts, Debit Cards), the id structure is <PRODUCT ID>-<FACILITY>-<ACTION>, e.g. Current-Overdraft-New; records can also be defined per EM.PRODUCT.GROUP, COMPANY or SYSTEM.",
    related: ["tftORStage", "tftORWorkflowSLA", "tftORGlobalParams"],
  },

  // ---- Section 2: Workflow, SLA, Facility & Approval Parameters ----
  tftORWorkflowSLA: {
    title: "Workflow & SLA Parameters — EM.XX.PARAMETERS tabs",
    simple: "The Workflow Parameters tab combines each stage's Stage Option and Default Status; the SLA Parameters tab repeats the same stage list with per-stage SLA estimate, tolerance and escalation.",
    example: "Loan EquipmentLoan: stage Application Input is Required with Default Status 101; Guarantor Input is Optional with Default Status 301; Credit Check is Not Required (no default status shown); Review/Approval is Required but deliberately has no Default Status at all.",
    why: "Leaving Review/Approval's Default Status blank is deliberate: it forces the approving officer to actively choose Approved, Provisionally Approved or Declined, rather than a status defaulting in unnoticed.",
    how: "Stage Option: Required (can't be skipped), Not Required (not even presented to the inputter), Optional (user decides to run it or skip it). Default Status: applied automatically as soon as the user commits the stage, but can still be changed manually (e.g. to hold for more information) — behaviour of each status code comes from its Action field in EM.XX.APPLICATION.STATUS.",
    memory: "Required / Not Required / Optional. Default Status auto-applies but is always user-overridable — except Review/Approval, which is deliberately left blank.",
    temenos: "SLA and tolerance estimates entered here automatically pick up the escalation path already defined in EM.XX.STAGE — the two tabs work together, not independently.",
    related: ["tftORStage", "tftOROther", "tftORApproval"],
  },
  tftOROther: {
    title: "Other Parameters — Refer, Documents, Deal Slip & Payment Products",
    simple: "The Other Parameters tab wires up automatic referral, document production, printed deal slips (Loans), and which payment product handles disbursement/payout and repayment/payin.",
    example: "EquipmentLoan's Other Parameters: Document Available = LoanApplication (Mandatory Yes), Payout Payment Product = LOANDISB (Loan Disbursement Payments), Approval Deal Slip and Print Deal Slip both configurable for credit-committee sign-off. Deposits/Accounts instead use a single Payment Order Product field (e.g. DEPPAYOUT, DOMESTIC).",
    why: "Refer Status + Refer To lets the system automatically hand off an application stage to the right PW.PARTICIPANT the moment a user selects that status, instead of relying on the user to manually reassign it.",
    how: "Refer Status / Refer To: auto-refers the stage to the indicated participant when that status is selected. Document Available / Mandatory: if set, the document is auto-produced at Offer Production stage; left blank, the user can optionally select documents there instead. Approval Deal Slip (Loans only): prints a physical signature slip when credit committee or an individual approves. Payout/Payin Payment Product: which payment order product handles disbursement (Loans) or general payout/payin (Deposits/Accounts). Completed Stage / Exclusive Stage / Super User (Other Parameters, segregation of duties — see Stage Owners).",
    memory: "Document Available + Mandatory = auto-produced at Offer Production. No mandatory flag = optional at that stage instead.",
    temenos: "For payment order disbursements (Loans) or other payout of funds (Deposits/Accounts), the payment order product to be used must be selected here.",
    related: ["tftORWorkflowSLA", "tftORDocuments", "tftORStageOwners"],
  },
  tftORFacilityEligibility: {
    title: "Facility Origination & Eligibility Parameters — EM.FO.PARAMETERS",
    simple: "Facility applications (e.g. Overdrafts, Debit Cards) use their own id convention and add an Eligibility Parameters tab covering Customer Classification and Minimum Customer Age.",
    example: "Record CurrentOD-OVERDRAFT-NEW: Eligibility Check Type 1 'Member Classification' with Breakage Type Override; Eligibility Check Type 2 'Minimum Customer Age', min_age_with_consent 16, min_age_no_consent 18, consent_checklist_id 30 (Parental Consent to Open Account) — meaning a 16–17-year-old can open an overdraft facility only with parental consent, captured as checklist item 30 at Application Input.",
    why: "Facilities piggyback on an existing account/product rather than being a standalone product, so their eligibility rules need their own dedicated tab rather than reusing the Loan/Deposit/Account eligibility structure.",
    how: "Id convention: <PRODUCT ID>-<FACILITY>-<ACTION>, e.g. Current-Overdraft-New. Eligibility Check Type: Customer Classification (e.g. only Full customers qualify) or Minimum Customer Age (min_age_with_consent, min_age_no_consent, consent_checklist_id parameters). Eligibility Check Breakage Type (Error/Override) plus a linked error/override message id.",
    memory: "Facility id = <PRODUCT>-<FACILITY>-<ACTION>. Minimum Customer Age has two thresholds — with and without parental consent — plus which checklist item captures that consent.",
    temenos: "Records can also be defined per Product group, Company or SYSTEM, same pattern as the main parameters table.",
    related: ["tftORLDAParams", "tftORChecklist"],
  },
  tftORApproval: {
    title: "Application Approvals — EM.XX.APPROVAL",
    simple: "Multi-tier approval levels are defined per currency: an amount threshold, the approving role (PW.PARTICIPANT), and — for group loans — whether the check compares the group total or each member's individual amount.",
    example: "Loan EquipmentLoan (GBP): Amount Above 0 → ELO.LOAN.APPROVER; Amount Above 10,000 → RETAIL.CREDIT.MANAGER; Amount Above 20,000 → BRANCH.OPERATION.MANAGER. Group Approval = Group Amount Approval, meaning the total group loan amount (not each member's share) is compared against these thresholds. Account approval amounts represent the Overdraft Limit being approved, not a deposit balance.",
    why: "Layering thresholds this way means small, routine applications clear at the lowest level while only genuinely large exposures escalate to senior roles — without hard-coding a single fixed limit.",
    how: "Currency (blank = local currency). Amount Above: the threshold this approver level covers, up to the next tier's Amount Above value. Approver: a PW.PARTICIPANT record (user, group of users, or DEPT.ACCT.OFFICER). Group Amount Approval vs Member Amount Approval (Loans, group applications only) — compares either the total group amount or each individual member's amount against the thresholds. Where product and product-group records both exist, the product-level definition takes priority.",
    memory: "Amount Above = the floor of each tier, up to the next tier's floor. Group Amount Approval = compares the group total; Member Amount Approval = compares each member's own share.",
    temenos: "For Accounts, Amount Above in the Account Approval table represents the Overdraft Limit amount being approved for the customer, not a deposit or balance figure.",
    related: ["tftORLDAParams", "tftORSingleDualApproval"],
  },
  tftORSingleDualApproval: {
    title: "Single & Dual Loan Approvals — EM.LO.APPROVAL",
    simple: "Loans support two approval methods on the same table: Single (any one member of an approval level can approve alone, up to their limit) or Dual (two members jointly approve, up to a higher joint limit).",
    example: "Approval Level 1: Single (individual) approval permission 2,000; Dual (2 individuals) approval permission 5,000. A 4,500 loan is beyond any one member's single limit, so a first officer refers it to a colleague in the same group for joint (dual) approval — technically the first officer doesn't approve at all, just refers; if the amount exceeds even the dual limit, the application routes via Task Management to a higher group entirely.",
    why: "Dual approval lets two members of the same level jointly clear amounts beyond what either could approve alone, without needing a whole extra approval tier — useful for amounts just above a single officer's individual limit.",
    how: "Which method is used is selected at the top of the table in the Approval Check Rule field, since EM.LO.APPROVAL serves both. Dual Approval fields: Underwriter Group (a PW.PARTICIPANT record — created/listed via Administration > Loan Origination > New Approval Group), Single Limit (max any one member may approve alone), Dual Limit (max two members may jointly approve).",
    memory: "Approval Check Rule field picks Single vs Dual for the table. Single Limit < Dual Limit, always for the same Underwriter Group.",
    temenos: "Where the amount is beyond the dual limit, the user must select the group able to approve it and the loan routes to that group via Task Management.",
    related: ["tftORApproval", "tftORLDAParams"],
  },

  // ---- Section 3: Checklist, Documents, Stage Owners & Global Parameters ----
  tftORChecklist: {
    title: "Application Stage Checklist & Master Items — EM.XX.STAGE.CHECKLIST / GIC.CHECKLIST.MASTER",
    simple: "The Stage Checklist table lists which documentation items an applicant must present at each stage, whether a user can override an item, and who (main holder, joint holder, guarantor, group member) it applies to; each item id itself is a predefined record in GIC.CHECKLIST.MASTER.",
    example: "EquipmentLoan's Application Input stage requires checklist item 1 'Positive Identification' (applicable to Main Holder, Group Member, Joint Holder, External and Internal Guarantor — Item Override left blank, so it cannot be skipped) and item 23 'Declaration of Health'. GIC.CHECKLIST.MASTER item 'Evidence of Funds' additionally carries currency-specific Applicable Amount thresholds (e.g. GBP 40,000 / USD 50,000) to trigger deposit anti-money-laundering documentation.",
    why: "Item Override left blank means the item can never be skipped and the inputter must confirm it was actually received; setting it to Yes lets a user override the item with a mandatory note explaining why it's no longer required.",
    how: "Loan-only extra fields: Default Not Required (No = held until received; Yes = can proceed once all other items are received/overridden; Override = required but can progress without it, and if the item has GIC.CHECKLIST.MASTER's Bring Forward attribute, it moves to the next stage) and Skip if Auto Approved (item not added at all once auto-approval rules pass — only relevant to stages after Credit Assessment). GIC.CHECKLIST.MASTER fields for Loans: Verify Routine (an API hook checking if the item is already satisfied), Auto Override (lets the automatic approval process bypass an unsatisfied item), Bring Forward (carries an unsatisfied item to the next stage instead of blocking). For Deposits: Currency + Applicable Amount, triggering the item once a deposit reaches that threshold in that currency.",
    memory: "Item Override blank = mandatory, can't skip. Bring Forward = unsatisfied item carries to the next stage rather than blocking. Applicable Amount (Deposits) = the AML documentation trigger threshold.",
    temenos: "Facility applications (e.g. Overdraft) typically mark items like 'Parental Consent to Open Account' as Default Not Required, so the item isn't mandatory for adult applicants.",
    related: ["tftORFacilityEligibility", "tftORDocuments"],
  },
  tftORDocuments: {
    title: "Application Documents — EM.XX.DOCUMENT",
    simple: "Defines which documents the origination workflow produces, how (via Document Output or the Delivery module), and the routine and parameters used to generate each one.",
    example: "LoanOriginationDocument 'LoanApplication': Production Method = Document Output; Document Type 1 = LoanApplicationForm, Request Routine = EM.XX.REQ.DOCUMENT, Request Parameters = CustomerId + LoanApplicationId.",
    why: "Because Request Parameters are configurable per document type, the same generic request routine can pull together completely different data sets for a loan application form versus, say, an offer letter.",
    how: "Production Method: Document Output or Delivery module. Document Type: a document the workflow can produce. Request Routine: the routine that actually requests and generates it (documents land in the customer's Document repository, viewable from the Document tab of SCV). Request Parameters: values passed to the routine — full details in the Document Output training material.",
    memory: "Documents generated this way land in the customer's Document repository — viewable from the Document tab of Single Customer View.",
    temenos: "Production Method determines whether generation goes through Document Output or the Delivery module — refer to the Document Output user guide for the full routine/parameter reference.",
    related: ["tftORChecklist", "tftOROther"],
  },
  tftORStageOwners: {
    title: "Stage Owners & Segregation of Duties",
    simple: "Every origination stage can have an assigned owner (an individual or group of users via PW.ACTIVITY / PW.PARTICIPANT); segregation-of-duties fields on the parameters table can further stop the same user completing certain combinations of stages.",
    example: "Loan Origination Workflow Stage Owners: Application Input → ELO.APP.INPUTTER; Eligibility Check → ELO.ELIG.CHECKER; Credit Scoring → ELO.CREDIT.SCORER; Review/Approval → ELO.LOAN.APPROVER. In practice, one owner (ELO.APP.INPUTTER) might cover everything from Application Input through Credit Scoring, a second (ELO.CREDIT.ASSESSOR) covers Credit Assessment, and a third (ELO.LOAN.APPROVER) covers Review/Approval through Arrangement Creation — only three owners actually need maintaining.",
    why: "Small institutions often can't afford separate teams for every stage, but still need maker-checker controls — segregation of duties closes that gap without requiring a large headcount.",
    how: "Stage owners: via the Meatballs menu on Workflow Stage Owners — Change Stage Owner (points a stage at a different PW.ACTIVITY record) or Amend Owner Details (edits the PW.PARTICIPANT membership of that owner, e.g. adding User 1/User 2). Segregation of duties (Other Parameters tab of EM.XX.PARAMETERS): Completed Stage (what a user group can complete) and Exclusive Stage (what that same group cannot complete) fields, plus Super User(s) who are exempt from the rule entirely.",
    memory: "PW.ACTIVITY = which stage; PW.PARTICIPANT = who occupies that role. Completed Stage + Exclusive Stage enforce maker-checker even in a small team; Super Users bypass it.",
    temenos: "PW.PARTICIPANT — Default List provides a fuller set of potential application participants usable across Loan, Deposit and Account applications (e.g. AF.EXTUSER, ARC.ADMIN.USER, BRANCH.OPERATION.MANAGER, CEO, CORPORATE.CREDIT.OFFICER, CREDIT.COMMITTEE).",
    related: ["tftOROther", "tftORGlobalParams"],
  },
  tftORGlobalParams: {
    title: "Global Product Parameters — EM.PRODUCT.PARAMETERS",
    simple: "One SYSTEM-level table of miscellaneous, cross-cutting settings that affect many Inclusive Banking applications at once: eligibility category ranges, reschedule term rules, group-limit shadow limits, guarantor account-locking ranges, and the savings multiplier.",
    example: "SYSTEM record: initial deposit eligibility check category range 7312–7313 (Special/Regular Share); savings-age eligibility check range 7310–7313; reschedule Term Input Type 'Amend Original Term'; Start Date Source 'Contract Next Due Date'; Payout Payment Product LOANDISB; Group Limit Parameters savings-based group-limit category range 7313–7313; Savings Multiplier: account category 6002 'Savings Account', Limit Multiplier 3, Limit Error Type Override, applied to loan products 3101/3401 (Medical/Student Loan).",
    why: "Keeping these settings on one bank-wide SYSTEM record means every loan/deposit/account product shares the same eligibility, reschedule and shadow-limit rules by default, instead of repeating them per product.",
    how: "Product Parameters tab: initial-deposit eligibility category range, savings-age category range, reschedule Term Input Type (Amend Original Term extends/reduces on the existing anniversary; Define From Today resets the anniversary to today) and Start Date Source (Contract Next Due Date vs Product), Term as Number of Payments flag, History Update Routine, Payout/Payin Payment Products, share-account category ranges (Credit Unions). Group Limit Parameters tab: category ranges for savings-based group-limit calculation and for the Single Group View savings report. Guarantor Parameters tab: category ranges used for guarantor account locking. Savings Multiplier tab: account category, limit multiplier factor, error type, and which loan products the resulting shadow limit applies to.",
    memory: "Shadow limits (Group Limit + Savings Multiplier) are Inclusive Banking's lighter-weight alternative to the full Transact limit module — a savings balance × a multiplier factor.",
    temenos: "Path: Product Administrator > any product tab > Global Product Parameters (or WOF Recovery Parameters / Guarantor Parameters, listed alongside it).",
    related: ["tftORLDAParams", "tftGUParams"],
  },

  // ---- Section 4: Common Origination Hands-On ----
  tftORHandsOn: {
    title: "Hands-On: Loan & Deposit Origination Parameters",
    simple: "Practice: using a product already built in Product Builder, configure full loan origination parameters (group loans, SLA escalation, expiry, stage requirements, checklist) and deposit origination parameters (prospects, proof-of-funds threshold, approval skip).",
    example: "Loan practice (Practice 1): Group Allow Yes, Group Amount and Group Term both Flexible (so members share evenly but changes are permitted); SLA breaches escalate to the operations manager; applications expire after 2 days of inactivity; every stage Required except Collateral Input (Optional) and Credit Check (Not Required); delinquent and written-off customers still allowed to apply, with overrides; checklist items configured for Application Input, Credit Assessment and Review/Approval.",
    why: "Combining both a Loan and a Deposit exercise in one hands-on forces the same underlying pattern — Group/General Parameters, Workflow, SLA, Checklist — to be applied twice against two different sets of business rules.",
    how: "Path: Administration > Products > Loan Origination / Deposit Origination > Manage Origination. Deposit practice (Practice 2): Prospects Allowed Yes; proof of funds (Documents Required for All Amounts / GIC.CHECKLIST.MASTER Applicable Amount) required from USD 50,000; Term Change Break-Rule Override; Skip Approval for Authorized Users Yes (approval stage skipped whenever the deposit amount is within the origination user's own approval limit); SLA breaches escalate to the Branch Operations Manager; applications expire after 3 days of inactivity.",
    memory: "Loan practice: Group Flexible + stage requirements + checklist. Deposit practice: Prospects + proof-of-funds threshold + Skip Approval.",
    temenos: "'Group amount and term are always even among group members, but changes should be allowed' maps to Group Amount = Flexible and Group Term = Flexible — not Divide Evenly/Uniform, which would forbid any redistribution.",
    related: ["tftORLDAParams", "tftORChecklist", "tftORWorkflowSLA"],
  },

  // ---- Section 5: Guarantor Parameters ----
  tftGUOverview: {
    title: "Guarantor Overview — EM.LO.GUARANTOR.PARAM & Related Tables",
    simple: "Guarantor functionality lets a loan be secured by internal (customer) or external guarantors, with configurable rules on how many loans a guarantor can back, whether their account gets blocked, and what percentage of the loan must be covered.",
    example: "A guarantor parameter record configures: guarantor type (internal/external), maximum number of loans a guarantor can guarantee, whether guarantors' accounts are blocked by the amounts they guarantee, the minimum percentage of the loan amount that must be guaranteed, minimum number of guarantors per loan, and whether overdue amounts can be recovered directly from a guarantor's account.",
    why: "Requiring guarantors is a common risk-mitigation tool for MFIs and Credit Unions lending to customers without conventional collateral — the system needs to enforce both eligibility and financial-cover rules around it.",
    how: "Four tables deliver the feature: EM.LO.GUARANTOR.PARAM (the main rules table), EM.GU.CONDITION (conditions that exclude a person from guaranteeing), EM.GU.REASON.RELEASE (why a guarantor may later be released), EM.LO.GUARANTOR (the external-guarantor master file, non-customers). EM.LOAN.GUARANTORS is a system-maintained file recording which guarantors actually back which loan.",
    memory: "EM.LO.GUARANTOR.PARAM = the rules. EM.LO.GUARANTOR = the external-guarantor directory (non-customers). EM.LOAN.GUARANTORS = the system-maintained record of who's guaranteeing what.",
    temenos: "Access path: Administration > Products > Credit Security — Guarantor Parameters, Reason for Release, and Conditions Excluding Guarantors are all configured here.",
    related: ["tftGUParams", "tftGUExternal", "tftORGlobalParams"],
  },
  tftGUParams: {
    title: "Guarantor Parameters — Blocking & Recovery Rules",
    simple: "Configures whether a guarantor's account is blocked by the amount they guarantee, how much is blocked (percentage and Equal vs Proportional across multiple guarantors), and whether overdue amounts can later be recovered from those blocked accounts.",
    example: "Record GB0010001: Multiple Guarantees Allowed Yes, Maximum Number of Guarantees 2, Min Percent Cover Per Loan 100. Percentage to Block 20, Blocking Mode Proportional, Block Guarantor's Account 'On Loan Disbursement'. For a 10,000 loan guaranteed 5,000/3,000/2,000 by three guarantors, with Percentage to Block = 25, Proportional blocking blocks (5000/10000)×(10000×0.25)=1,250, (3000/10000)×2,500=750, and (2000/10000)×2,500=500 respectively — Equal mode would instead block the same amount in every guarantor's account. Recovery from Guarantor's Account: Allowed, Recovery Mode Proportional, Recovery Amount Negotiable Yes, Insufficient Balance Action 'Override And Adjust'.",
    why: "Percentage to Block can differ from the minimum percent cover per loan, giving the bank flexibility to actually block a smaller (or larger) amount than the guaranteed percentage requires.",
    how: "Whether it's mandatory for a customer guarantor to also supply an account. Accept Amt GT AC Bal: whether a guaranteed amount greater than the guarantor's account balance is accepted (Override) or rejected (Error). Percentage to Block, Blocking Mode (Equal/Proportional), Charges to Percentage to Affect (New Loans Only or existing too), Block Guarantor's Account (On Approval vs On Disbursement), Insufficient Funds Action. Min. No. of Guarantors per Loan (>0 makes the Guarantor stage mandatory), Min No. Guarantors Break Rule, Non Fellow Group Members as Guarantors (Yes/No), On Group Exit (Release Guarantor vs refuse exit until outstanding loans are repaid).",
    memory: "Equal = same amount blocked per guarantor. Proportional = blocked amount scales with each guarantor's share of the total guaranteed amount.",
    temenos: "Records can be created per product per company (e.g. BNK-CropLoan, CNK-CropLoan), letting the same product carry different guarantor rules by company/local requirement.",
    related: ["tftGUOverview", "tftGUExcludeRelease"],
  },
  tftGUExcludeRelease: {
    title: "Conditions Excluding Guarantors & Reasons for Release",
    simple: "EM.GU.CONDITION defines conditions (Blocked, Deceased, Inactive Account, Overdue Loan, Pending Closure, Post No Debit, Written-Off Loan) that disqualify a prospective guarantor; EM.GU.REASON.RELEASE lists reasons an existing guarantor may later be released from obligation.",
    example: "Condition 'Blocked': Action = Error, Message 'Guarantor (&) is blocked' — stops the application outright. Condition 'Deceased': Action = Override, Message 'Guarantor (&) is deceased' — allows proceeding with a warning. Release reasons: Guarantor is Deceased, Guarantor is Insolvent, Guarantor is Replaced, Guarantor is Late Borrower, Guarantors No Longer Required.",
    why: "Splitting these into Error vs Override conditions lets the bank decide, condition by condition, whether a disqualifying fact should hard-block the guarantor or just warn the user and let them proceed anyway.",
    how: "EM.GU.CONDITION fields: Description, Action (Error/Override), Message (with a placeholder for the guarantor's name), Condition Rtn (an optional routine for custom logic — clients/partners can introduce new conditions this way). EM.GU.REASON.RELEASE is a simple lookup table of release reasons, used later in Loan Operations when a guarantor is actually released — often requiring the borrower to supply a replacement guarantor first.",
    memory: "EM.GU.CONDITION = why someone can't guarantee a loan in the first place. EM.GU.REASON.RELEASE = why an existing guarantor is later let off the hook.",
    temenos: "Path: Administration > Products > Credit Security > Conditions Excluding Guarantors / Reason for Release.",
    related: ["tftGUParams", "tftGUExternal"],
  },
  tftGUExternal: {
    title: "External Guarantors, Account Locking & Pledges",
    simple: "Non-customer guarantors are recorded in EM.LO.GUARANTOR (id starts with 'G' + 6 characters, mnemonic-validated against CUSTOMER so a guarantor record can't duplicate an existing customer); guarantor account-locking uses savings-product category ranges configured in Global Product Parameters.",
    example: "External Guarantor record G253076HF0Q7 'Tony Stark': DOB 05 MAY 1970, ID Type Passport, plus business address and employer details captured for a non-customer. Global Product Parameters (Guarantor Parameters tab, SYSTEM record): category range 6000 'SavingAccStDDA' start to 6000 end — the savings account categories eligible to be used for guarantor blocking.",
    why: "Basic mnemonic validation against CUSTOMER prevents a bank accidentally creating a duplicate 'guarantor' record for someone who's actually already a customer of the bank.",
    how: "EM.LO.GUARANTOR captures First Name, Surname, Title, Date of Birth, ID Type, Identification Number, Expiry Date, Home/Business Address, Type of Business, Telephone, Occupation, Employer and Employer's Address. Guarantor pledge details are stored in a system-maintained file, EM.LO.GUARANTOR.PLEDGE. Category ranges used for guarantor account locking live under Global Product Parameters, validated by the guarantor functionality whenever funds need to be locked in a guarantor's savings account.",
    memory: "External guarantor id: G + 6 characters. EM.LO.GUARANTOR.PLEDGE is system-maintained — not directly edited.",
    temenos: "Path (external guarantors): Credit Officer application > Guarantors tab > New External Guarantor, within loan origination itself.",
    related: ["tftGUExcludeRelease", "tftORGlobalParams"],
  },

  // ---- Section 6: Credit Scoring Parameters ----
  tftCSTables: {
    title: "Credit Scoring Tables & Data Types — SA.DATA.TYPES / SA.DATA.GROUP / SA.RATIOS",
    simple: "Eight tables deliver Credit Scoring; Data Types define each individual scoring factor (Age, Income, Number of Dependents…), Data Groups combine two or more Data Types, and Ratios apply operators/constants to Data Groups for more advanced calculations.",
    example: "Data Type 'Age': Description 'Age of Customer', Data Type Numeric. Data Group 'AnnualIncome' combines Data Types like Annual Wages, Annual Commission and Annual Dividends into one group value. Data Groups and Ratios are not used in the delivered Inclusive Banking Model Bank configuration — they exist for institutions that need more elaborate scoring logic.",
    why: "Separating Data Types (raw inputs), Data Groups (combined inputs) and Ratios (formulas over groups) gives the scoring engine three layers of building blocks instead of one flat list of fields.",
    how: "SA.DATA.TYPES: Id, Description, Data Type (Alpha/Alphanumeric/Numeric/Amount), Checkfile, Zero Check. SA.DATA.GROUP: multi-valued Data Types field combining several data types into one named group. SA.RATIOS: Operator + Group ID + Constant, optionally multiple Mne Group/Operator/Constant sets, a Calc. Routine, and a Defined Formula for institutions needing custom ratio logic beyond the standard operators.",
    memory: "Data Types = raw factors. Data Groups = combined factors. Ratios = formulas over groups — the three building blocks feeding the Score Card.",
    temenos: "Path: Administration > Products > Scoring & Profiling. Full details on Data Group and Ratios usage are in the SALES.ADMINISTRATION user guide.",
    related: ["tftCSScoreCard", "tftORGlobalParams"],
  },
  tftCSScoreCard: {
    title: "Score Data & Score Card — SA.SCORE.DATA / SA.SCORE.CARD",
    simple: "Score Data lists which Data Types (and optionally Data Groups/Ratios) are used to score a given product or product group; the Score Card is the engine applying weighted scores to each value, combined via AND/OR operands into one aggregate score.",
    example: "Score Data 'Business' (Business Loans Group) lists NoOfGuarantors, Residence, BusinessType, LoanPurpose, CreditIndicator among its data types. On the Score Card, Operand 1 AND combines Ratio Type 1.1 (Data Group 1.1, TotalCountArrears — No of MI, Eq 0, Fx Score 20) with Operand 2 OR (Ratio Type 2.1, Data Group 2.1). If Age < 18, a decision rule assigns Fx Score = -100, guaranteeing failure regardless of every other factor — since the overall total is only 100.",
    why: "AND combines all data-type scores together into the overall total; OR is used within a single data type's different possible values (e.g. Age 18–26 OR Age 27–40) to arrive at that one data type's own score — mixing the two up produces a nonsensical result.",
    how: "Score Card decision criteria: e.g. 'If Age is between 18 and 26, assign a score of 6 OR if Age is between 27 and 40, assign a score of 10'; 'If Number of Dependents is LT 3, assign 5 OR if GE 3, assign 2'. Id of the Score Card can be a loan product, product group, or SYSTEM. There's no fixed rule for the total attainable score — some institutions use hundreds (e.g. 735), others tens (e.g. 87); the Model Bank example uses 100. A Calc. Routine field can replace the standard combination logic entirely if an institution's requirements can't be met by the standard configuration.",
    memory: "AND = across data types, to build the overall score. OR = across values within one data type. A -100 score is the standard workaround for an automatic-fail condition.",
    temenos: "Consultants must work with the institution to agree what scores and totals actually make sense — there's no universal standard total or weighting.",
    related: ["tftCSTables", "tftCSScoreLimitTxn"],
  },
  tftCSScoreLimitTxn: {
    title: "Score Limit & Score Transaction — SA.SCORE.LIMIT / SA.SCORE.TXN",
    simple: "The Score Limit table recommends a loan amount based on the applicant's credit score (a cumulative frequency table); the Score Transaction table is where an actual credit-scoring calculation runs for a specific loan application, and where the recommended limit is reported back.",
    example: "Score Limit 'Business' (id = product or product group): Upto Score 1 = 49 → Rec Limit 0.00; Upto Score 2 = 50 → Rec Limit 10,000.00; Upto Score 3 = 60 → Rec Limit 25,000.00; Upto Score 4 = 70 → 50,000.00; Upto Score 5 = REST → 75,000.00. Score Transaction SA/19154/00004 shows Loan Application, Customer, Currency, Product Name Business, each data type with its fetched Date Value, Perform calculation = Yes, Agg Score = 50.",
    why: "The last multi-value entry in Score Limit must always be REST — meaning 'any score above the last defined threshold' — so every possible score maps to some recommended limit.",
    how: "Score Limit: Id = product, product group or SYSTEM; Upto Score field (cumulative, last value REST); Rec Limit field (should stay within the product/group's allowed amount range, though this isn't system-enforced). A Calc. Routine can replace the standard limit calculation. Score Transaction: Id follows the generic Sales Administration module number + mnemonic-Julian date-serial pattern; needs Customer, Currency, Product; when Calc.Score = Yes, aggregate score (AGG.SCORE) and recommended limit (REC.LIMIT) are both generated by the system.",
    memory: "Score Limit's last band is always REST. Calc.Score = Yes on a transaction actually triggers the aggregate score + recommended limit calculation.",
    temenos: "If any mapped data value is empty when the transaction runs, an error or override fires according to the setting in EM.LO.CS.SA.DATA.MAPPING.",
    related: ["tftCSScoreCard", "tftCSDataMapping"],
  },
  tftCSDataMapping: {
    title: "Credit Scoring Data Mapping & Conversions — EM.LO.CS.SA.DATA.MAPPING",
    simple: "This SYSTEM-level table auto-populates the Score Transaction's data values straight from other T24 tables, so users don't manually re-enter data that's already recorded elsewhere.",
    example: "Data Type 'Age' maps from Source Field CUSTOMER.ID, Conversion 'CUSTOMER.AGE'. Data Type 'LoansOverdPeriod' maps from CUSTOMER.ID via Conversion 'LOANS.ARREARS.RG*AA.cat.start*AA.cat.end*cat.start*cat.end'. Data Type 'LoanPurpose' maps from APPLICATION.ID via Conversion 'LINK<EM.LO.APPLICATION>LOAN.PURPOSE'.",
    why: "Manual data entry is slow and error-prone; wherever a value can be reliably derived from an existing T24 table, mapping it here both speeds up credit scoring and removes that source of user error.",
    how: "Source Field accepts only CUSTOMER.ID, APPLICATION.ID, EM.INC.EXP.ID or EXTERNAL (manual entry at credit-scoring stage). Conversion operations: VALUE-x / SUBVALUE-x (extract a multi-value/sub-value), EXTRACT*x*y (substring), ABS, CDT*x, DDMMMYYYY, LINK>x>y (extract field y from application x), FIELD[x,y], FMT*x, @routine (custom conversion), COUNT-VM / COUNT-SM. Purpose-built aggregate conversions also exist: SAVINGS.TOTAL.RG, LOANS.PRINCIPAL.RG, LOANS.ARREARS.RG, LOANS.TOTAL.RG (each accepting AA and category-range arguments), LOANS.DISB.TOTAL.MTH*x, PAYMENTS.NO.MISSED.MTH*x, PAYMENTS.TOT.MISSED.MTH*x.",
    memory: "CUSTOMER.ID → link anywhere the Customer number is the key. APPLICATION.ID → only the current loan application. EM.INC.EXP.ID → the Income/Expenditure record. EXTERNAL → user enters manually.",
    temenos: "Data fields without a configured Source will simply not be mapped and must be entered manually at credit scoring stage of origination; full API/routine-writing details are in the Developer API section of the user guide.",
    related: ["tftCSScoreLimitTxn", "tftIETables"],
  },

  // ---- Section 7: Credit Scoring Hands-On ----
  tftCSHandsOn: {
    title: "Hands-On: Building a Credit Score Card",
    simple: "Practice: using seven data types (Age, Gender, MaritalStatus, NetIncome, NoOfGuarantors, TotalCountArrears, StressRatio), build a full score card totalling 100 points, plus a matching recommended-limit table that never exceeds the product's maximum loan amount.",
    example: "Solution 'PersonalLoan' Score Data lists all seven data types. On the Score Card: Age <18 → Fx Score -100 (automatic fail); Age 18–65 → a positive score. Gender Female vs Male scored differently. NoOfGuarantors ≥2 scores higher than <2. NetIncome ≥2000 scores higher than <2000. TotalCountArrears = 0 scores highest, decreasing as arrears rise. StressRatio below the bank's threshold scores higher than above it. Recommended limits: Upto Score 49 → 0.00; 50 → 5,000.00; 70 → 7,000.00; REST → 10,000.00.",
    why: "Deliberately assigning -100 for under-18 applicants guarantees automatic failure since the card's total is only 100 — the same 'unbeatable negative score' workaround used for any hard eligibility rule that credit scoring itself should enforce.",
    how: "Path: Administration > Products > Scoring & Profiling > Score Cards Data / Score Cards / Score Card Limits — New Data Type, New Score Card, New Score Card Limits. Verify the recommended limit table's top band never exceeds what the underlying loan product actually allows to be disbursed.",
    memory: "-100 for a disqualifying condition = guaranteed fail against a 100-point total. Score Limit's top band must respect the product's own maximum amount.",
    temenos: "Every Fx Score and every Rec Limit band in the worked solution was agreed with the institution beforehand — there's no universal 'correct' set of numbers, only what the business requires.",
    related: ["tftCSScoreCard", "tftCSScoreLimitTxn"],
  },

  // ---- Section 8: Income-Expenditure & Loan Stress Testing ----
  tftIETables: {
    title: "Income & Expenditure Parameter Tables",
    simple: "Six tables build up a loan applicant's income and expenditure profile — how much they earn, from where, what they spend, and what debts (primary and secondary) they already carry.",
    example: "EM.HOUSEHOLD.INC.TYPE record WAGE = 'Wages/Salary'. EM.HOUSEHOLD.EXP.TYPE record FOOD = 'Food'. EM.EXTERNAL.EXP.TYPE record EDSB = 'Educational – School Books' (non-household, so no direct subsistence impact). EM.PRIMARY.DEBT.TYPE record EARR = 'Electricity Arrears' (a debt the applicant directly owes). EM.SECONDARY.DEBT.TYPE record CCRD = 'Credit Cards Debt' (could equally be a debt the applicant guarantees for someone else).",
    why: "Before extending more credit, the institution wants to see how the applicant currently copes financially — separating income by source and expenditure by type gives a much clearer affordability picture than one lump income figure.",
    how: "EM.HOUSEHOLD.INC.TYPE / EM.HOUSEHOLD.EXP.TYPE: basic income/living-expense categories, typically 4-digit ids chosen by the user. EM.EXTERNAL.EXP.TYPE: non-household expenses (thin line between this and household expenses, judgement-based). EM.PRIMARY.DEBT.TYPE: debts directly owed by the applicant. EM.SECONDARY.DEBT.TYPE: debts owed by others that the applicant guarantees. EB.PARAM > ALL-LO.DEBT.TO.INCOME.RATIO.RULES: the stress-testing rules record. EM.INC.EXP: where all of it comes together per applicant.",
    memory: "Household = living expenses (food, rent, utilities). External = non-household. Primary debt = the applicant's own. Secondary debt = guaranteed on behalf of others.",
    temenos: "Path: Administration > Products > Scoring & Profiling — Manage Profiling Parameters, New Household Income/Expense Type, New External Expense Type, New Primary/Secondary Debt Type.",
    related: ["tftIEStressTesting", "tftCSDataMapping"],
  },
  tftIEStressTesting: {
    title: "Income Expenditure Table & Loan Stress Testing — EM.INC.EXP",
    simple: "EM.INC.EXP brings the profile together per applicant (or per loan application) and computes Debt-to-Income (DTI) and Mortgage Service Ratio (MSR) figures, both with and without stress testing (simulating a worse income/expenditure position or a rate rise).",
    example: "Without stress testing: House Inc Total 5,000, House Exp Total 1,500, Avbl Income 3,500, Debt Serv Ratio 10, Dti Ratio (unpopulated in this view). With stress testing: House Inc 5,000, House Exp 1,500, Dti Income 5,000 vs Dti Stress Income 4,500 (income stressed down), Dti Ratio 30 vs Dti Stress Ratio 41.11, Dti Expenditure 1,500 vs Dti Stress Expenditure 1,850 (expenditure stressed up).",
    why: "Stress testing exists to answer one question up front: if the borrower's income falls or their expenses rise — or, for mortgages, if interest rates rise — can they still meet their payment obligations, before that risk actually materialises?",
    how: "ALL-LO.DEBT.TO.INCOME.RATIO.RULES: DTI Loan Product Groups (which non-mortgage loan groups are tested), MSR Product Groups (which mortgage/home-loan groups are tested, with a provision for testing the effect of interest-rate increases — DTI testing has no rate-increase element), DTI Loan Amount Threshold (below which non-mortgage loans skip testing). Income stressing: e.g. HI-WAGE--90 (dashes '--' = 100% of unstressed wage included; 90 = stress factor, only 90% of income counted; a combined form like HI-WAGE-95-90 double-stresses, to 95% then 90% of that). Expenditure stressing works the same way but multiplies up, e.g. HE-FOOD-110-110 (increase by 10%, then by 10% again). DTI Use Current Monthly Payment (Yes/No — add the new loan's own repayment into the expenditure side) and DTI Stress Income Ratio (a single combined stress percentage for every income type, mutually exclusive with per-income-type stressing). Record id: auto-generated as Customer Number-Loan Application Number when created within a loan application, or just Customer Number if created outside one — records are created per application only when EB.PARAM > ALL-EM.INCOME.EXPENDITURE 'Create separate income/expenditure per application' is set to Y, which is also required for stress-testing calculations to run at all.",
    memory: "Dashes ('--') = 100% included, unstressed. A percentage = the stress factor applied to that portion. DTI = non-mortgage loans. MSR = mortgages, with an interest-rate stress element DTI doesn't have.",
    temenos: "Stress testing is optional but a regulatory requirement in some countries; results feed into credit scoring via the mapping table and are visible via a context enquiry at both Credit Assessment and Review/Approval stages of origination.",
    related: ["tftIETables", "tftCSDataMapping"],
  },

  // ============ COURSE · Temenos Functional Training (TFT) — Day 4 ============
  // ---- Section 1: Loan Application — Input & Custom Schedules ----
  tftLAOverview: {
    title: "Loan Application Overview — EM.LO.APPLICATION",
    simple: "Loan Origination runs on eight or nine interlocking parameter areas — Product Setup, LO Parameters, Guarantors, Credit Bureau, Collaterals, Income Expenditure, Credit Scoring and Checklist Items — feeding a single application record.",
    example: "The application itself runs through the origination stages set up in EM.LO.PARAMETERS: Application Input, Eligibility Check, Guarantor Input, Credit Check, Collateral Input, Credit Scoring, Credit Assessment, Review/Approval, Offer Production, Loan Creation.",
    why: "Each stage may be Required, Optional, or Not Required depending entirely on the loan origination parameter setup done in Product Builder — so the same EM.LO.APPLICATION record can present a completely different workflow for a different product.",
    how: "The Loan Application Processing course walks through each of those stages in turn, showing how a real applicant's data flows through them and what the user sees at each one.",
    memory: "EM.LO.APPLICATION is the single record the whole loan origination workflow is built on top of — nine stages, each switchable via EM.LO.PARAMETERS.",
    temenos: "Which stages actually show up, and in what order, is entirely data-driven by the same origination parameter tables covered in the Common Origination Parameters material.",
    related: ["tftORStage", "tftLAInputAccess", "tftLAInputTabs"],
  },
  tftLAInputAccess: {
    title: "Loan Application Input — User Access",
    simple: "Origination can be started from two places: the Single Customer View (New Loan Application, under Financial Products) or the dedicated Loan Service Agent page (New Loan Application / New Loan Input tile).",
    example: "From Mrs Monica Williams's SCV, the Portfolio tab's Meatballs menu offers New Account Application, New Deposit Application, New Loan Application, New Loan Input, and Loan Simulation. The Loan Service Agent page instead offers a dashboard with Pending Tasks, plus a direct 'New Loan Application' shortcut.",
    why: "Giving two entry points serves two different working styles — a relationship-centred user working from a specific customer's own record, versus a dedicated loan officer working from a task-driven queue across many customers.",
    how: "SCV path: open the customer, Portfolio tab, Meatballs menu, Financial Products, New Loan Application. Loan Service Agent path: the page's own dashboard tile, or the Customers/Loans tabs for existing applications.",
    memory: "SCV = customer-first. Loan Service Agent = queue-first.",
    temenos: "New Loan Input (as distinct from New Loan Application) is the entry point for Direct Loan — an alternate, non-origination way to book an already-approved loan.",
    related: ["tftLAOverview", "tftLADirectLoan"],
  },
  tftLAInputTabs: {
    title: "Application Input Stage — Customer Type, Loan Action & Loan Details",
    simple: "Application Input captures the application date, Customer Type (Group/Individual/Non-Individual), the Loan Action (New Loan/Refinance/Reschedule/Top-up), and then the core loan details — product, amount, term, and an auto-calculated instalment.",
    example: "LO25340CL0F716: Customer Type Individual, Customer 100044 Williams, Loan Action New Loan. Loan Details: Product PersonalLoan, Amount Requested 5,000.00, Term Requested 12M, Payment Frequency Monthly, Currency and Interest Rate defaulted from the product, Instalment Amount auto-calculated to 439.59.",
    why: "Only one Loan Action can be chosen per application — Refinance, Reschedule and Top-up all require picking the existing loan to be amended via the 'For Arrangement' field, and a Top-up's Term Requested value becomes the loan's new term.",
    how: "Asset Class field shows the worst overdue status across all the customer's existing loans, informing the user before they even pick a Loan Action. Loan Product and Currency/Interest Rate default once a product is chosen — only loan products or product groups actually set up in Loan Origination Parameters are selectable. Entering Amount and Term calculates the instalment automatically; alternatively, the user can enter the desired instalment and let the system derive the term. A free-text Notes field lets the inputter flag conditions for later decision-makers.",
    memory: "Asset Class = worst existing overdue status. Loan Action: New Loan / Refinance / Reschedule / Top-up — pick one, and Refinance/Reschedule/Top-up need 'For Arrangement'.",
    temenos: "Customer Id for an individual defaults automatically when origination is launched from SCV; loan product dropdown is restricted to whatever's configured in Loan Origination Parameters.",
    related: ["tftLAOverview", "tftLAAppStatusOverride", "tftLACustomSchedules"],
  },
  tftLASettlementChecklist: {
    title: "Application Input — Settlement, Checklist & Charges Tabs",
    simple: "The Settlement tab captures disbursement, repayment and charge account numbers; the Checklist tab records which supporting documents the applicant has actually provided; the Charges tab shows the fees configured for the product.",
    example: "Settlement: Disburse Account 1000000977 (Current, Indiv), Repay Account 1000000977, Charge Account 1000000977. Checklist: Subject 100044, Item 1 'Positive Identification', Item Status 'Yes'. Charges: Disbursement Fee (rate 0.60) and New Arrangement Fee (amount 15.00).",
    why: "Leaving any Settlement account field empty means that activity runs manually instead of automatically — and if the loan product itself was built for automatic disbursement but no disbursement account is supplied, the system generates an override warning that automatic disbursement will be disabled for that customer.",
    how: "Settlement: an empty field = manual processing for that activity; a filled field = automatic processing when it falls due. Checklist: items are presented per stage exactly as parameterised for the product (some stages may show none); the inputter can override an item only if permitted, and overriding requires a note explaining why; if an item genuinely can't be satisfied and can't be overridden, the inputter picks a suitable status code from the Application Status dropdown instead, or the system defaults one per EM.LO.PARAMETERS.",
    memory: "Empty Settlement field = manual. Filled = automatic. Override an unmet checklist item only where permitted, always with a note.",
    temenos: "If the product is built for manual disbursement but the user does supply a disbursement account anyway, the reverse override fires: a message saying automatic disbursement will be triggered instead.",
    related: ["tftLAInputTabs", "tftORChecklist", "tftLAAppStatusOverride"],
  },
  tftLACustomSchedules: {
    title: "Application Input — Custom Payment Schedules",
    simple: "Selecting 'Custom' as Repayment Frequency opens a temporary Arrangement so the user can negotiate a bespoke payment schedule via AA.ARR.PAYMENT.SCHEDULE, before the real Arrangement is created at Loan Creation.",
    example: "A ShortTermLoan product pre-configured for Custom schedules defaults Payment Frequency to 'Custom' and won't allow it to be changed. Committing the stage opens AA.ARR.PAYMENT.SCHEDULE for arrangement AA26340xxx, showing two payment rows for ACCOUNT and PRINCIPAL/INT properties, each with its own frequency and percentage.",
    why: "Building the schedule against a genuine (if temporary) Arrangement lets the user use the full AA scheduling engine — relative start dates, a fixed number of payments, then a gap, then more payments — rather than a simplified custom-schedule mini-editor.",
    how: "Selecting YES on the resulting Override/Warning message takes the workflow into AA.ARR.PAYMENT.SCHEDULES to actually negotiate it. There, a relative Start Date plus optional Number of Payments defines when repayment activity kicks in and for how long; the repayment row can be multi-valued to add a second start date further out — e.g. pay 3 times starting 1 month after disbursement, then a 4-month payment holiday, then resume from month 8. The temporary Arrangement is automatically deleted at the Loan Creation stage; the negotiated custom schedule is transferred onto the real, substantive Arrangement. From any later stage, the Loan Details tab's 'More details' link reopens the Arrangement Overview screen for further edits.",
    memory: "Custom schedule → temporary Arrangement → AA.ARR.PAYMENT.SCHEDULE → deleted at Loan Creation, schedule carried onto the real Arrangement.",
    temenos: "If the loan product itself was configured for Custom schedules, 'Custom' is defaulted into Payment Frequency at Application Input and cannot be changed by the user.",
    related: ["tftLAInputTabs", "tftLPPaySchedule"],
  },
  tftLAAppStatusOverride: {
    title: "Application Status & Override/Error Messages",
    simple: "Every origination stage has its own dropdown list of status codes, each with parameterised behaviour (some put the process on hold); committing a stage also triggers any configured override or error checks against the loan product's rules.",
    example: "Application Input's status list includes 101 'Loan application input complete', 102 'Applied for on the web', 103 'Waiting for information', 105 'Pending customer interview' — codes 103 and 105 put the process on hold until the expected action completes. Committing a different application triggered: 'Warning: delinquent loans (1000000589, 1000000608…) exist for customer 100003' and 'Automatic disbursement will be disabled for customer 100003.'",
    why: "Which specific codes exist and what each one does is entirely configured in EM.LO.APPLICATION.STATUS, so different institutions — or even different products at the same institution — can have completely different status vocabularies.",
    how: "Status behaviour is described under EM.LO.APPLICATION.STATUS (see the Common Origination Parameters material). At commit, origination separately checks the loan product's own configured rules (e.g. Allow Delinquent, Allow Written Off) and raises an Override (user can accept and continue) or Error (blocks progress) as parameterised.",
    memory: "Status dropdown = where you are / what happens next. Override/Error banner = did this application just break a configured product rule?",
    temenos: "Users can step back one stage at a time, from any stage to the one before it, to correct a value that's producing an unwanted override or error further down the workflow.",
    related: ["tftLAInputTabs", "tftORAppStatus"],
  },
  tftLAGroupApplicant: {
    title: "Application Input — Group Applicant",
    simple: "Setting Customer Type to Group presents a Group Id field and a 'Group Application Details' tab; the total amount requested is shared among group members, and settlement accounts get defaulted per member.",
    example: "Group 000007 'Daytona Teachers' applies for WorkingCapitalLoan, Amount Requested 15,000.00, Term 12M, Weekly. On the Group Application Details tab, three members (Milosz Czeslaw, Wanda Niemiec, Bobby Brandys) each get Amount 5,000.00, Term 12M, and an auto-calculated Instalment. On Settlement, each member's Disburse/Repay/Charge accounts default from their own settlement product condition.",
    why: "How the total amount is actually divided among members follows the product's own Group Amount setting (Divide Evenly vs Flexible) — configured back in the loan's origination parameters, not something decided fresh at application time.",
    how: "Entering Group Id auto-populates member details from the group record. Entering Amount and Term Requested causes origination to split the amount among members and default the same term to each; each member's own instalment is calculated and shown individually. A 'Capitalize Arrears' checkbox is available at Application Input for group loans.",
    memory: "Group Application Details = per-member Amount/Term/Instalment. Settlement (group) = each member's own account defaults, arranged per member.",
    temenos: "The processing rules for how a group's amount and term actually split among members come from the Loan Origination Parameters set on the product — see EM.LO.PARAMETERS' Group Amount / Group Term fields.",
    related: ["tftLAInputTabs", "tftORLDAParams", "tftLAEligibilityCheck"],
  },

  // ---- Section 2: Eligibility, Guarantor & Collateral Input ----
  tftLAEligibilityCheck: {
    title: "Eligibility Check Stage — Individual & Group",
    simple: "The system runs every criterion defined in EM.PRDL.ELIGIBILITY for the product, listing each as 'Passed' or 'Warning' with a message; for groups, every member is checked and results shown per member.",
    example: "Individual: Subject 100044 Williams — Rule/Result 'Minimum Age' Passed, 'Maximum Age' Passed. Group: three subjects each checked for Initial Deposit ('Warning' — Customer has no sufficient funds), Loan Purpose (Passed), Minimum/Maximum Age (Passed), Min Saving Months and Min Customer Period (Warning) — committing the group stage surfaced three separate override messages, one per failing subject's Initial Deposit rule.",
    why: "Depending on how the eligibility table itself was parameterised (Error vs Override per rule), a failed item either blocks the application outright or lets the user accept an override and continue.",
    how: "For failed items, the workflow can be put on hold while the underlying issue is corrected in another table, or the user can step back one stage at a time to fix whatever produced the wrong eligibility result.",
    memory: "Passed = met the rule. Warning = didn't, with the exact reason as the message. Whether that Warning actually blocks progress depends on the rule's own Error/Override setting.",
    temenos: "Refer to the Inclusive Banking Product Builder course for the full EM.PRDL.ELIGIBILITY configuration — this stage just executes what's already configured there.",
    related: ["tftLPEligibility", "tftLAGroupApplicant", "tftLAGuarantorInput"],
  },
  tftLAGuarantorInput: {
    title: "Guarantor Input — Individual & Group Applicants",
    simple: "Guarantors can be added from two sources — existing customers, or the external guarantor table (EM.LO.GUARANTOR, for people who aren't customers) — via 'Add Loan Guarantors', which opens EM.LOAN.GUARANTORS.",
    example: "Guarantor Input / LO253407L55437: clicking 'Add Loan Guarantors' opens the record with id 100044-LO253407L55437 (CustomerNumber-LoanOriginationId). A new external guarantor is created as G25340CHL2RK 'Matthew Warinii', ID Type Driver's Licence, with home address and business details captured.",
    why: "External guarantor ids always start with 'G' precisely so the system (and users) can immediately distinguish a non-customer guarantor from a real customer id — and a basic mnemonic check stops a duplicate record being created for someone who's actually already a customer.",
    how: "Multi-value the Guarantor Id field to add as many guarantors as needed. Guarantor details are checked against EM.LO.GUARANTOR.PARAM and its break-rule messages. For internal (customer) guarantors, the system filters to only accounts in the customer-category range set in EM.PRODUCT.PARAMETERS, then shows how much will actually be blocked in that account, based on the Equal/Proportional setting.",
    memory: "External guarantor id always starts with 'G'. Add Loan Guarantors → EM.LOAN.GUARANTORS, id CustomerNumber-LoanOriginationId.",
    temenos: "Guarantee funds are locked via AC.LOCKED.EVENTS, each carrying an expiry date equal to the loan's maturity date so funds release automatically once it matures — a guarantor's account can carry multiple such locks at once, one per loan guaranteed.",
    related: ["tftGUParams", "tftGUExternal", "tftLAGuarantorDocs"],
  },
  tftLAGuarantorDocs: {
    title: "Guarantor Input — Checklist, Supporting Documents & Group Guarantors",
    simple: "Guarantor checklist items appear in their own tab when configured for the Guarantor stage in Loan Origination; non-cash guarantees (chattels, promissory notes) can be scanned and stored via ELO.GU.DOCUMENT; the guarantor record must be Active to be valid.",
    example: "Checklist: Internal Guarantor item 1 'Guarantor Consent' Status Yes; External Guarantor item 2 'Guarantor Consent' Status Yes. Document repository: IM1928005074 'Promissory Notes', one scanned image usable to guarantee more than one loan. Group applicants: field EACH.MEMBER.GUARANTOR set to Yes auto-presents every group member's own guarantor-detail fields for input.",
    why: "For external guarantors, any amount shown to be blocked is informational only — there's no account to actually block against, since they're not a customer of the bank.",
    how: "Group guarantor commit runs the same parameter checks as an individual — e.g. 'Percentage to Block is greater than 0 so amount cannot be empty' — surfacing one error per affected guarantor if the rule isn't satisfied.",
    memory: "EACH.MEMBER.GUARANTOR = Yes → every group member gets their own guarantor-detail fields shown automatically.",
    temenos: "One scanned document (via the scan icon) can be linked to guarantee more than one loan; view it in origination through the ELO.GU.DOCUMENT enquiry.",
    related: ["tftLAGuarantorInput", "tftGUExcludeRelease"],
  },
  tftLACreditCheck: {
    title: "Credit Check Stage",
    simple: "Credit Check is only relevant where the institution has a local credit bureau interface plugged into origination; otherwise the stage should simply be marked Not Required in EM.LO.PARAMETERS.",
    example: "Group applicant Credit Check / LO253405355QD6: each subject (e.g. 100038) shows Check Required? Yes, with a Result field ready to display whatever the bureau interface returns.",
    why: "There's no generic 'do nothing' credit check built in — an institution without a bureau interface that leaves the stage as Required would simply be presenting an empty, meaningless step to every applicant.",
    how: "Set Check Required? per subject; the bureau interface (built specific to the local credit bureau) populates the Result field once queried.",
    memory: "No bureau interface in place → mark Credit Check Not Required in EM.LO.PARAMETERS, don't leave it presented with nothing behind it.",
    temenos: "This stage's actual bureau-query logic is institution- and country-specific — the training material covers only the workflow slot it occupies, not a specific bureau's API.",
    related: ["tftLAGuarantorInput", "tftLACollateralInput", "tftORStage"],
  },
  tftLACollateralInput: {
    title: "Collateral Input Stage — Individual & Group Applicants",
    simple: "Users can select existing collateral records or add new ones via 'New Collateral', which walks them through COLLATERAL.RIGHT then COLLATERAL in one flow without leaving the origination workflow.",
    example: "Applicant's Collateral Id shows only collateral relevant to that applicant, in context. New Collateral record: Collat.Right 100044.1 (Code 102 'Vacant Land', Company, Limit Reference, Percentage Allocation, Percentage Cover, Validity Date); Collateral 100044.1.1 (Type 100 'Fixed Property', Description 'Landed Property', Country GB, Nominal Value 15,000.00, Maximum Value 15,000.00, Execution Value 15,000.00).",
    why: "Once committed, a newly-created collateral record becomes immediately available for selection without exiting the origination workflow — so a consultant never has to abandon an in-progress application just to set up collateral first.",
    how: "For group loans, all collateral records across every group member are shown, and the system allocates each to the correct customer by matching Collateral Ids. The Collateral Right number uniquely identifies each member's own collateral record within the group.",
    memory: "New Collateral link → COLLATERAL.RIGHT then COLLATERAL, both in one guided flow. Group: collateral matched to owner via the Collateral Id.",
    temenos: "Only collaterals actually relevant to the applicants already on the application record are ever presented for selection — the dropdown is filtered by applicant, not a flat list of everything in the system.",
    related: ["tftLAGuarantorInput", "tftLACreditCheck"],
  },

  // ---- Section 3: Credit Scoring & Income/Expenditure ----
  tftLACreditScoringStage: {
    title: "Credit Scoring Stage — Individual & Group Applicants",
    simple: "Credit scoring can run for both the loan applicant and any guarantors who are existing customers; by default 'Scoring Required?' is Yes for the applicant and No for guarantors, and for groups, every member is listed.",
    example: "Credit Scoring / LO253407L55437: Subject 100044 Williams, Scoring Required? Yes, Perform Check? Yes, resulting Application Status 601 'Credit scoring complete'.",
    why: "Guarantor scoring defaults to No because a guarantor isn't the one being assessed for repayment capacity by default — but if the institution does want to score guarantors too, the user must deliberately flip that default to Yes.",
    how: "When Credit Scoring is set as 'Optional' in EM.LO.PARAMETERS, the Perform Check? field is left blank so the user can choose Yes to score, or simply commit to skip it.",
    memory: "Scoring Required? defaults Yes for the applicant, No for guarantors — deliberately flip it if guarantor scoring is wanted too.",
    temenos: "For groups, every member is listed individually for scoring, exactly the same pattern used for eligibility and guarantor checks.",
    related: ["tftCSScoreCard", "tftLAIncomeExpDetails", "tftLAScoreCalc"],
  },
  tftLAIncomeExpDetails: {
    title: "Credit Scoring — Adding Income/Expenditure Details",
    simple: "The 'New Income/Expenditure' link on the credit scoring screen opens EM.INC.EXP to capture an applicant's income-expenditure profile, which the score data/card can then use as scoring criteria.",
    example: "Income And Expenditure Details / 100044-LO253407L55437: Household Income Total 4,583.00, Household Expenditure Total 1,900.00, External Expenditure Total 3,000.00, Available Income Total 3,083.00, Primary/Secondary Debt Repayments, Surplus Income Total 3,083.00, Included Income 4,583.33, Stressed Income 3,362.50, Included Expenditure 1,500.00, Stressed Expenditure 1,850.00, DTI Ratio 33.73, DTI Stressed Ratio 49.60.",
    why: "If an existing EM.INC.EXP record is simply reused for a new application, its figures may already be stale — the applicant's actual situation can have changed since it was created — so standard practice is to update it before scoring runs each time.",
    how: "To avoid ever scoring against stale figures, configure Income and Expenditure records to be created per loan application (rather than once per customer) — the same EB.PARAM setting covered in the Income-Expenditure material.",
    memory: "Always update (or, better, auto-create per application) the Income/Expenditure record before scoring — never trust an old one to still be accurate.",
    temenos: "SA.SCORE.DATA and SA.SCORE.CARD can both be defined to draw directly on this income-expenditure profile as scoring criteria — see the notes on EM.INC.EXP for the full field reference.",
    related: ["tftIETables", "tftIEStressTesting", "tftLACreditScoringStage"],
  },
  tftLAScoreCalc: {
    title: "Credit Scoring — Selecting the Product & Calculating the Score",
    simple: "Committing the credit scoring screen moves to SA.SCORE.TXN, where the user first selects the Product Name (filtered to only records relevant to the applied-for product or its group, or SYSTEM), then the score is calculated when that record is committed.",
    example: "Calculate Score / SA/25340/00004: Product Name field shows only 'PersonalLoan' as an in-context option. Calculate Score / SA/25340/00006 then lists each Data Type (Age, Gender, NoOfGuarantors, NetIncome, TotalCountArrears, StressRatio) with its Data Value — most 'Field value defaulted' automatically, but a field like Loan Officer Score has no default source and is entered manually by the officer — and shows the resulting Agg Score once committed.",
    why: "Restricting the Product Name dropdown to only in-context records (product, its product group, or SYSTEM) stops a user from accidentally scoring an application against a completely unrelated product's score card.",
    how: "Most Data Type values are auto-fetched per the mapping configured in EM.LO.CS.SA.DATA.MAPPING and marked 'Field value defaulted'; any data type with no configured Source Field (i.e. mapped as EXTERNAL) must be entered by hand at this exact screen — as with a subjective Loan Officer Score.",
    memory: "SA.SCORE.TXN's Product Name field = only records relevant to the actual applied-for product/group/SYSTEM. 'Field value defaulted' = auto-mapped; a blank, editable field = EXTERNAL, entered by the user.",
    temenos: "The aggregate score (Agg Score) only calculates once the SA.SCORE.TXN record is actually committed — it isn't a live preview as fields are filled in.",
    figure: "The training material's own 'Credit Scoring Example' spreadsheet gives the points budget behind these same six Data Types — each factor's maximum achievable score, summing to 100 across the whole card: Age 15, Gender 20, NoOfGuarantors 10, NetIncome 15, TotalCountArrears 20, DTIStressedRatio 20. That's the same six data types (Age, Gender, NoOfGuarantors, NetIncome, TotalCountArrears, plus a DTI/stress-ratio factor) shown defaulting into SA.SCORE.TXN above, producing the Agg Score 90 / Agg Score 80 results seen in this material's screenshots. Allocating the actual decision rules per value/range within each factor's own budget follows the same AND/OR pattern as the Credit Scoring Parameters course's Score Card.",
    related: ["tftLACreditScoringStage", "tftCSDataMapping", "tftCSScoreLimitTxn", "tftCSScoreCard"],
  },

  // ---- Section 4: Credit Assessment, Review/Approval & Offer Production ----
  tftLACreditAssessment: {
    title: "Credit Assessment Stage & Loan History Reports",
    simple: "Credit Assessment is where the officer applies real credit judgement, aided by Customer Loan History / Group Loan History context enquiries showing the applicant's past loans, overdue balances, and any provisioned or written-off amounts.",
    example: "Customer Loan History for customer 100002: eight past loans listed with Date Approved/Disbursed, Amount Disbursed, Current/Overdue Balance, Times in OD, Arr Status (Grace/Delinquent/Current/Non-Accrual), Prov/WOF Amount, and Tot Sav Bal for context. A Group Loan History does the same across every member of a group.",
    why: "Seeing a customer's full history of late payments, provisions and write-offs in one report gives the assessing officer far more signal than the current application's data alone could ever provide.",
    how: "Accessed via the Meatballs menu's 'Assessment Enquiries' — Customer Loan History, Group Loan History, Approval Rules Results, Collateral Report, Debt to Income Ratios — plus values carried over from every earlier origination stage, arranged in tabs across the top of the screen.",
    memory: "Arr Status column = Grace / Delinquent / Current / Non-Accrual, per past loan — the fastest signal of how well this customer actually paid before.",
    temenos: "This is the same Non-Accrual Basis (NAB) and delinquency vocabulary configured back in the product's own Overdue conditions.",
    related: ["tftLPSettleOverdue", "tftLAAssessmentScoreRec", "tftLAReports"],
  },
  tftLAAssessmentScoreRec: {
    title: "Credit Assessment — Credit Scores & Recommendation",
    simple: "The officer's Recommendation (Approve/Decline/etc.) is passed to the approving officer at Review/Approval, but a recommendation never binds the approver to the same decision.",
    example: "Credit Assessment / LO253407L55437: Credit Scoring tab shows Score Reference SA25340000006, Credit Score 90, Recommended Limit 10,000.00. Credit Assessment tab: Recommendation Approve, Assessment Notes 'Recommended for approval in view of excellent credit score.'",
    why: "Keeping the recommendation and the final decision as two genuinely separate steps, made by two different roles, is a basic maker-checker control against a single officer's judgement (or error) being the sole gate to a loan being disbursed.",
    how: "The credit score and recommended limit calculated earlier at Credit Scoring are surfaced directly on this screen (via its own Credit Scoring tab) so the assessment officer doesn't have to go hunting for them elsewhere.",
    memory: "Recommend ≠ Decide. The approver at Review/Approval can always land on a different outcome than what was recommended here.",
    temenos: "Assessment Notes is mandatory whenever a recommendation is entered, giving the next decision-maker the officer's actual reasoning, not just a bare Approve/Decline flag.",
    related: ["tftLACreditAssessment", "tftLAReviewApproval"],
  },
  tftLAReviewApproval: {
    title: "Review/Approval Stage — Individual & Group",
    simple: "The approver sees every value from every prior stage plus the credit assessment recommendation, then deliberately picks a status — it is never defaulted — and can approve a different amount and/or term than either the applicant applied for or the assessor recommended.",
    example: "Review/Approval / LO253407L55437: Status options include 711 'Referred to Credit Committee', 712 'Referred to CEO', 713 'Referred to Board of Directors', 801 'Approved', 802 'Funding approved', 851 'Provisionally approved'. Applied Amount 6,500.00 / Approved Amount 6,500.00; Applied Term 12M / Approved Term 12M; Credit Score 90, Recommended Limit 10,000.00.",
    why: "Leaving Application Status un-defaulted at this one stage — unlike every earlier stage — exists specifically to prevent a mistake or a moment of doubt slipping through as an accidental approval.",
    how: "If Approved Amount/Term are left blank, the system simply assumes the applied-for values — the approver only needs to type something there if actually changing them. A Decision By field auto-defaults to the current officer's own account officer code. Declining the application, or selecting 'Client Withdrawal,' makes the Notes field mandatory so the reason is captured.",
    memory: "Status is never defaulted here — the approver must always choose it deliberately. Blank Approved Amount/Term = 'same as applied for.'",
    temenos: "For group loans, every member's own Applied vs Approved Amount and Term are arranged vertically, and it's entirely acceptable for them to differ from each other — group members needn't get identical outcomes.",
    related: ["tftLAAssessmentScoreRec", "tftLADealSlips", "tftORApproval"],
  },
  tftLADealSlips: {
    title: "Review/Approval — Deal Slips",
    simple: "Approval deal slips can be printed for decision officers to physically sign — relevant wherever a bank requires wet signatures, or a credit committee's individual members must each sign off.",
    example: "Review/Approval / LO260863K29Q5C (IB Core): committing the stage triggers an Override/Warning 'Print Approval Deal Slip now?' with Clear / YES / NO options.",
    why: "This only ever fires if the product's own Origination Parameters (Other Parameters tab) were configured to expect it — it's not a universal prompt shown on every approval regardless of setup.",
    how: "Selecting YES prints the deal slip immediately at that point in the workflow, showing Applied vs Approved Amount, Term and Interest Rate for the signer to verify against.",
    memory: "No deal slip prompt without the Other Parameters tab configuration behind it — check EM.LO.PARAMETERS first if a slip isn't appearing when expected.",
    temenos: "This is the same Approval Deal Slip field documented under Loans Other Parameters in the Common Origination Parameters material.",
    related: ["tftLAReviewApproval", "tftOROther"],
  },
  tftLAOfferProduction: {
    title: "Offer Production Stage — Individual & Group",
    simple: "Offer documents are generated using the Document Output module, prepopulated per the setup in the Loan Origination product parameters table, and stored in the Documents tab of SCV; only the loan application template ships with the Inclusive Banking Model Bank.",
    example: "Offer Production / LO253407L55437: For 100044 Williams (Main Holder), Produce Document 1 'Loan Application' Yes, Channel 1.1 selectable. Repayment Start date is auto-calculated but can be amended. Committing moves the Application Status to 901 'Generate offer documents'.",
    why: "While several documents may be configured for production, only the loan application form itself is delivered out of the box — anything beyond that (offer letters, terms sheets) needs separate Document Output configuration at implementation.",
    how: "For groups, each member gets their own 'For' block with its own Produce Document / Do Option / Channel fields, all still prepopulated from the same Loan Origination product parameters. Once generated, documents land in the customer's Documents tab in SCV, viewable via the view icon next to each entry.",
    memory: "Only the loan application document ships pre-built. Repayment Start date auto-calculates but stays editable.",
    temenos: "Documents produced this way are stored per-customer in SCV's Documents tab — searchable by Document Type, Date Created and Transaction Ref.",
    related: ["tftORDocuments", "tftLAReviewApproval", "tftLALoanCreation"],
  },

  // ---- Section 5: Loan Creation, Disbursement & Group Bulk Disbursement ----
  tftLALoanCreation: {
    title: "Loan Creation Stage — Automatic Disbursement",
    simple: "Loan Creation is origination's final stage: if the product was built for automatic disbursement, committing this stage both creates and disburses the loan in one action — for groups, every member's loan is created and disbursed together.",
    example: "Loan Creation / LO253407L55437: Customer 100044, Loan Product PersonalLoan, Repayment Start 06 JAN 2026, Application Status 911. Once created, the loan appears in the Loans tab of SCV, and the Arrangement Overview screen can be opened from there.",
    why: "Keeping loan creation as origination's very last stage means nothing downstream — Loan Details, Settlement, Charges, Eligibility, Guarantors — can still change once the actual AA arrangement exists; everything upstream had to be finalised first.",
    how: "The finished loan is viewable from the 'Loans' tab of Single Customer View — from there the Arrangement Overview screen (summary or detailed version) can be opened for further inspection or action.",
    memory: "Automatic disbursement product + committed Loan Creation = loan created and disbursed in the same step, no separate action needed.",
    temenos: "Group loans follow the exact same automatic pattern — all members' loans are created and disbursed together when the stage is committed.",
    related: ["tftLAOfferProduction", "tftLAManualDisbursement", "tftLAArrangementOverview"],
  },
  tftLAManualDisbursement: {
    title: "Loan Creation — Manual Disbursement & Options",
    simple: "A loan is created for manual disbursement whenever the Disburse Account field at Loan Creation is left empty; it then sits in SCV's Portfolio tab with status 'Not Disbursed' until actioned separately.",
    example: "An undisbursed Personal Loan shows Commitment 5,000.00 and Principal 0.00 in the Portfolio tab. From the arrangement's Transactions Meatballs menu, disbursement options include Disbursement to Account, by Cash, or by Payment Order; repayment options similarly include from Account, by Cash, Payoff from Account, or Repayment by Guarantor.",
    why: "For cash disbursement the Teller's cash account is credited instead of a customer account, and for the account-transfer option the customer's own disbursement account (e.g. a Savings Account, category 6002) is credited directly — the same loan can use whichever option actually fits how that customer is being paid.",
    how: "Account Transfer input screen (AA – Disbursement): select the Credit Account from the customer's own accounts; Debit Amount, Debit Value Date and other fields auto-populate; committing moves the loan's status in SCV from 'Not Disbursed' to 'Current.'",
    memory: "Empty Disburse Account at Loan Creation = manual, sits as 'Not Disbursed' until actioned. Account Transfer, Cash, and Payment Order are the three manual disbursement routes.",
    temenos: "Partial manual disbursement is also possible, depending on how the product itself was set up — the full amount need not always be released in a single action.",
    related: ["tftLALoanCreation", "tftLAArrangementOverview"],
  },
  tftLAArrangementOverview: {
    title: "Arrangement Overview — Summary & Detailed Versions",
    simple: "Once a loan exists, its Arrangement Overview can be viewed as a compact Summary (product, parties, financial summary, interest/charges, recent transactions) or a fuller Detailed version (adding account dates, limit/collateral details, and a complete activity log).",
    example: "Summary version for 1000001038 GBP Personal Loan: Total Principal 5,000.00, Total Commitment 5,000.00, Penalty Interest Fixed 2.00%, Principal Interest Fixed 10.00%, recent Transactions (Opening balance, New contract fee -15.00, Closing balance). Detailed version adds Start/Cooling/Effective/Next Payment/Maturity dates, Limit Details (Unsecured, GBP, Amount, Outstanding, Available/Excess), and a full Activity Log (New Arrangement, Issue Bill, New Arrangement Fee Due, Settle Fee Instructions, Apply Repayment).",
    why: "The Summary view is enough for a quick balance/rate check, but the Detailed view's Activity Log is what actually shows the sequence of system-driven events (fee due, settlement instructions, repayment applied) behind that balance.",
    how: "Reached via the arrangement's own Transactions Meatballs menu, option 'Arrangement Overview' — available from both the loan's own screen and the customer's Loans tab in SCV.",
    memory: "Summary = balances + recent transactions. Detailed = adds dates, limit/collateral, and the full activity log.",
    temenos: "Collateral Details on the Detailed view (Description, Ccy, Execution value, 3rd Party flag, Net Amount, Expiry) reflect exactly what was captured back at the Collateral Input stage of origination.",
    related: ["tftLALoanCreation", "tftLAManualDisbursement", "tftLACollateralInput"],
  },
  tftLAGroupBulkDisb: {
    title: "Group Bulk Disbursements — Configuration & Operations",
    simple: "Rather than disbursing each group member's loan one at a time, EM.FT.BULK.INPUT,DISBURSE posts every member's disbursement together from one screen, governed by the parameter table EM.FT.BULK.PARAM.",
    example: "EM.FT.BULK.PARAM record 'Group Disbursement': Default FT OFS Version FUNDS.TRANSFER,EM.DISB.BULK.OFS; Default Process Value 2 Yes; Payment Type DISBURSEMENT; Transaction Type ACDI; Allowed Credit Categories 6000-7313, 1001, 5001, 10000; Default Credit Account Yes. On the Group Disbursement screen for group 000007, each of three members shows their own Arrangement, Risk Account, and Amount, all defaulted, with a running Total Amount at the bottom.",
    why: "Institution-specific flexibility (which FT OFS version, which categories are even allowed as disbursement accounts, whether accounts auto-default) all lives in EM.FT.BULK.PARAM precisely so this one bulk screen can be reshaped per bank without a code change.",
    how: "Steps: (1) select Group Service Agent from the menu, (2) Groups > Find > select the desired group, (3) via the group's Meatballs icon choose Disburse Loans — all relevant values default, (4) change Disburse to No for any member whose loan should not be disbursed this round, (5) commit — the system generates all entries and sets every included loan's status to Current in SCV's Loans tab. Default Credit Account Yes/No/All Loans/Grp Loan decides whether the first account in Allowed Credit Categories auto-populates as the credit account.",
    memory: "EM.FT.BULK.PARAM = the rules (which categories, which OFS version, auto-default or not). EM.FT.BULK.INPUT,DISBURSE = the actual bulk-posting screen.",
    temenos: "It's also possible to partially disburse (per the product's own setup) or disburse through an internal account if desired — the internal account's category must itself be one of the Allowed Credit Categories in EM.FT.BULK.PARAM. Once authorised, FT records generate via OFS; any that fail to process can be reviewed and resubmitted via 'Resubmit FT.'",
    related: ["tftLAManualDisbursement", "tftLAGroupApplicant", "tftORLDAParams"],
  },

  // ---- Section 6: Reports & Direct Loan ----
  tftLAReports: {
    title: "Loan Origination Reports — Application, SLA Escalation & Loan History",
    simple: "Three reports support loan origination day to day: the Loan Application Report (every application's current status and processing days), the SLA Escalation Report (which applications breached their configured SLA), and Customer/Group Loan History (an officer's full picture of an applicant's past loans).",
    example: "Loan Application Report, Home Pages > Branch Manager > Loans > Search Loan Application: lists Application Id, Customer, Applied/Approved Amount, Process Status (Disbursed/Applied), Stage, and Proc. Days. SLA Escalation Report (ENQ EM.LO.SLA.ESC, since it isn't yet on the TE menu): for customer 100001, shows Standard SLA, SLA Tolerance, Time Spent, Time Above Standard/Tolerance and Stage Status per stage — e.g. Credit Assessment shows 34 days spent against a tolerance of 22, flagged Pending.",
    why: "Proc. Days on the Loan Application Report is deliberately the number of days taken to process the loan up to today (or until the loan record is actually created) — a live, ongoing processing-time metric, not a fixed historical figure.",
    how: "Customer/Group Loan History (accessible from Credit Assessment, or standalone via ENQ EM.CUS.LOAN.LIST / ENQ EM.GRP.LOAN.LIST) shows every past loan's Date Approved/Disbursed, Current/Overdue Balance, Times in OD, Arr Status, and any provisioned or written-off amount.",
    memory: "Loan Application Report = where every application stands today. SLA Escalation Report = who's over their processing-time target and by how much. Loan History = the customer/group's track record.",
    temenos: "SLA Escalation and the two Loan History reports aren't yet on the TE menu as of this release — access them via the command line with ENQ EM.LO.SLA.ESC, ENQ EM.CUS.LOAN.LIST, or ENQ EM.GRP.LOAN.LIST.",
    related: ["tftORStage", "tftLACreditAssessment", "tftLASummary"],
  },
  tftLASummary: {
    title: "Loan Application Summary",
    simple: "For loan origination to work at all, four groups of parameter tables must be fully set up: Origination Parameters, Guarantor, Credit Scoring Parameters, and Income and Expenditure Parameters.",
    example: "Once all four are configured, origination supports both individual and group loans, either automatically or manually disbursed, with any number of documents produced via Document Output, and reporting via the Loan Application Report, Customer/Group/Loan Officer Loan History Report, and SLA Escalation Report.",
    why: "This is the recap tying together everything covered across the Loan Application Processing material — every stage the applicant walks through ultimately draws on one of these four parameter groups.",
    how: "Origination Parameters (Common Origination Parameters course) → the workflow itself. Guarantor → who can secure a loan and how. Credit Scoring Parameters → how applicants are scored. Income and Expenditure Parameters → the affordability profile feeding that scoring.",
    memory: "Four parameter groups: Origination, Guarantor, Credit Scoring, Income & Expenditure — miss one and origination can't run end to end.",
    temenos: "This same four-group structure is exactly why the training material itself is split across the Common Origination Parameters, Guarantor Parameters, Credit Scoring Parameters, and Income-Expenditure courses.",
    related: ["tftORLDAParams", "tftGUOverview", "tftCSTables", "tftIETables"],
  },
  tftLADirectLoan: {
    title: "Direct Loan — Alternate Loan Input Method",
    simple: "Direct Loan is an alternate way to book an already-approved loan directly, bypassing the full origination workflow — ideal when a bank already runs a separate origination system, or for group loans that are usually processed manually anyway.",
    example: "Direct Loan – Loan Input / DL2534088006: Input Date, Customer Type Individual, Customer Id 100002 Kioko, Effective Date Type Application Date, Loan Action New Loan, then the same Loan Details fields as Application Input (Product, Currency, Amount Requested, Term, Payment Frequency, Instalment Amount). Tabs: Loan Input, Settlement, Guarantor Input, Collateral Input, Audit.",
    why: "Building Direct Loan's screens the same way as Loan Origination's Application Input screens is a deliberate design choice — so a user trained on one experience needs almost no retraining to use the other.",
    how: "After a user completes a Direct Loan input, an approver must review and authorise it — accessible via the dashboard's Pending Tasks, or from the customer's own Tasks tab in SCV. Once approved, the loan is disbursed and managed exactly like a normally-originated loan.",
    memory: "Direct Loan = same screens as Application Input, but skips the multi-stage origination workflow entirely — book it once, then just approve.",
    temenos: "Direct Loan is reached via 'New Loan Input' (as distinct from 'New Loan Application') from either SCV or the Loan Service Agent page.",
    related: ["tftLAInputAccess", "tftLAInputTabs", "tftLASummary"],
  },

  // ---- Section 7: Loan Application Processing Hands-On ----
  tftLAHandsOn: {
    title: "Hands-On: Processing Individual & Group Loan Applications",
    simple: "Practice 1 processes a full individual application end to end — input, eligibility, guarantor, collateral, credit scoring, credit assessment, review/approval, offer production, loan creation and disbursement. Practice 2 does the same for a 52-week, USD 4,000-per-member group loan, disbursed via Group Bulk Disbursement.",
    example: "Practice 1 solution (customer Kariuki, PersonalLoan, 6,500.00 over 12M): Application Input triggered an override for an existing delinquent loan (accepted); Eligibility passed both Minimum and Maximum Age; a guarantor (Collins) and collateral were added; Credit Scoring returned Agg Score 90; Credit Assessment recommended Approve; Review/Approval approved as recommended (6,500.00, 12M); Offer Production generated the Loan Application document; Loan Creation disbursed automatically, and the resulting Payment Schedule showed 12 monthly instalments of 571.46 reducing the balance to zero.",
    why: "Running one application through literally every stage in sequence is what actually cements how the stages chain together — each one's output (a recommendation, a score, an approved amount) becomes the next stage's input.",
    how: "Practice 2 solution (Group 000007 'Daytona Teachers', EquipmentLoan, 12,000.00 total / 4,000.00 per member, Weekly): Eligibility ran per member with several 'Warning' results (e.g. Min Saving Months, Min Customer Period) that were accepted as overrides; Guarantor Input, Collateral Input and Credit Assessment were completed per member; Review/Approval showed all three members approved as recommended; Loan Creation then created all three loans together. Disbursement used Group Bulk Disbursement rather than each member's own Loan Creation screen — Group Service Agent > Groups > Find group > Meatballs > Disburse Loans.",
    memory: "Practice 1 = one applicant, every stage, start to finish. Practice 2 = a group loan, same stages per member, then bulk-disbursed in one action rather than member by member.",
    temenos: "Verify the finished loan the same way as prior hands-on exercises: from SCV's Loans tab, open the Arrangement Overview and check the Payment Schedule matches what was applied for and approved.",
    related: ["tftLAInputTabs", "tftLAEligibilityCheck", "tftLAGroupBulkDisb", "tftLAArrangementOverview"],
  },

  // ============ COURSE · Temenos Functional Training (TFT) — Day 5 ============
  // ---- Section 1: Loan Repayment & Overdue Payments ----
  tftLRTypes: {
    title: "Loan Repayment Types — AA Loan Transactions",
    simple: "Repayments fall into four types: Scheduled Repayment of regular due amounts, Payoff (full early redemption), Principal Decrease (a prepayment of part of the capital), and Credit to the arrangement (an advance deposit set aside for future dues, if the product allows).",
    example: "A GBP Asset Financing arrangement's Transactions Meatballs menu offers Disbursement to Account/Cash/Payment Order, and — for repayment — Repayment from Account, Repayment by Cash, Payoff from Account, and Repayment by Guarantor.",
    why: "Each type behaves differently for the customer and for accounting — a Scheduled Repayment just settles what's already due, while a Principal Decrease actually shrinks the outstanding capital ahead of schedule, and a Payoff closes the whole contract.",
    how: "As with group loan disbursements, group loan repayments are also supported in Inclusive Banking via the bulk payments feature — collecting many members' loan repayments together from one screen.",
    memory: "Scheduled = the regular due bill. Payoff = the whole loan, early. Principal Decrease = part of the capital, early. Credit to Arrangement = money set aside for future dues.",
    temenos: "All four types are ultimately AA activities — the mechanics differ, but each posts through the arrangement's own Transactions screen.",
    related: ["tftLRGroupRepay", "tftLRPrincipalDecrease", "tftLRPayoff"],
  },
  tftLRGroupRepay: {
    title: "Group Loan Repayment — Configuration & Operations",
    simple: "EM.FT.BULK.PARAM configures how group repayments (Group Collection) behave — allowed accounts, default credit account, and default repayment amounts — while EM.FT.BULK.INPUT,GCS is the screen that actually posts many members' repayments in bulk.",
    example: "Bulk Payments Parameters / SYSTEM, Bulk Type 'Group Collection': Payment Type 1.1 LOANREPAY, Transaction Type ACRP, Allowed Credit Categories 3000-3999, Default Credit Account 'Grp Loan', Default Loan Repayment Amt Yes. On the collection screen for group 'Daytona Teachers', three members each show Process Payments? Yes, Payment Type Loan Repayment with an amount and a second Payment Type Savings row, each with its own narrative.",
    why: "Default Loan Repayment Amount = Yes matters because it saves the teller re-typing every member's due amount by hand — the system defaults it, and the teller just confirms or overrides per member.",
    how: "Table Id can be SYSTEM or branch-wise. Payment Type is configurable, not hardcoded — each payment item on the collections screen is parameterised in the PAYMENT.TYPE sub-value fields. Default Credit Account (Yes/No/All Loans/Grp Loan): for loan repayments, All Loans should be selected so every loan the customer holds is displayed to choose from; if Yes, the first account of the ALLOWED.CATEG field auto-populates. Per member, setting Process Payments? to No skips that member for this collection run. After authorisation, the Group History tab shows Processed Group Collections and Processed Group Disbursements, each with a Bulk Status of 'Processed Successfully'.",
    memory: "EM.FT.BULK.PARAM = the rules (categories, default account, default amount). EM.FT.BULK.INPUT,GCS = the actual bulk-collection screen, same pattern as Group Bulk Disbursement.",
    temenos: "FT.MASTER.OFS.VER is the version used to post the individual FT payments using OFS — bank-specific versions can replace the default here too.",
    related: ["tftLRTypes", "tftLAGroupBulkDisb", "tftORLDAParams"],
  },
  tftLROverpayment: {
    title: "Overpayment — Manual-Only Overpay",
    simple: "Some loan products allow a customer to pay more than the scheduled due amount ('overpay'); this is only possible through manual repayments, since automatic settlement via the Settlement product condition only ever pays amounts actually due.",
    example: "Emergency Loan MEA (2000000082): a manual repayment posts several entries — 'Repayment from Current Account MEA' and a 'Balance adjustment' — with the excess handled per the product's own overpayment setting.",
    why: "Whether that excess reduces the principal outright or just sits as a credit balance depends entirely on the product's own configuration — an overpayment isn't automatically one or the other.",
    how: "Depending on the product's settings, an overpayment either leads to a Principal Decrease, or to the arrangement being credited with an 'unallocated amount' instead — in the unallocated case, any future regular due payments are made from that amount first, before touching the customer's own funds again.",
    memory: "Overpay = manual only. Excess either shrinks principal now (Principal Decrease) or sits as unallocated credit consumed by future dues first.",
    temenos: "This is a product-configuration decision, not a universal system default — check the specific loan product to know which behaviour applies.",
    related: ["tftLRTypes", "tftLRPrincipalDecrease"],
  },
  tftLRPrincipalDecrease: {
    title: "Principal Decrease — Repaying Capital Early",
    simple: "The Principal Decrease payment rule lets part of the outstanding capital be repaid ahead of the loan's maturity date; it's an Arrangement Activity, effected via an FT or Teller transaction, and the system can automatically recalculate either the future repayment amounts or the new loan term afterward.",
    example: "Product Conditions — PAYMENT RULES / EmLendingPrPrincDecrease-20260325: Financial Status 'Both', Application Type 'CURRENT – Current Balances', Sequence CURACCOUNT/Balances, Remainder Activity 'LENDING-CREDIT-ARRANGEMENT', Make Bill Due? No.",
    why: "Choosing to recalculate the repayment amount versus the term changes the customer's experience very differently for the same prepayment — same or different instalments, but a shorter loan, versus the same term with smaller instalments going forward.",
    how: "Configured under the product's Payment Rules feature class; the transaction code used to credit the loan account with the prepayment determines that Principal Decrease actually fires (see the official quiz note: crediting the loan account, not the settlement account, with the right code is what triggers it).",
    memory: "Principal Decrease = credit the loan account with the right transaction code → capital drops early → system recalculates term OR instalment amount, per the product's own configuration.",
    temenos: "This is the same 'Principal Decrease Fee' break-rule charge referenced in the Loan Product Builder material — the fee and the payment rule work together.",
    related: ["tftLRTypes", "tftLROverpayment", "tftLPCharge"],
  },
  tftLRPayoff: {
    title: "Early Redemption of a Loan — Payoff",
    simple: "The AA Payoff Activity allows total early redemption of a loan arrangement; the Simulation engine calculates the exact total redemption amount (outstanding capital plus any accrued interest and charges), and that simulated amount is what's actually paid via an FT or Teller transaction.",
    example: "Repayment options for an arrangement include 'Payoff from Account'. A Payoff can be requested at any point during the arrangement's life, from the left side of the summary loan overview screen, leading into the payoff simulation.",
    why: "Using the simulation first, rather than just totalling the visible outstanding balance, is what correctly captures interest and charges still accruing right up to the effective payoff date — a manual total would likely be short.",
    how: "The effective date for a payoff can be either today's system date or a date in the future. A Payoff statement is produced for the customer's information. An early redemption fee can be applied automatically if configured for an early repayment. If any overpayments were made previously on the contract, they're factored into the payoff amount calculation too.",
    memory: "Simulation calculates the true total-redemption figure (capital + accrued interest + charges) → that figure is then paid via an AA Payoff activity (FT or Teller).",
    temenos: "This is the concept behind the earlier 'Cooling Period' payoff mechanics in the Loan Product Builder material — the same underlying Simulation + Payoff Activity pattern, just without a cooling-period discount applied.",
    related: ["tftLRTypes", "tftLROverpayment"],
  },
  tftLROverdueRules: {
    title: "Overdue Payments — Rules, Statuses & Account Debit Behaviour",
    simple: "When a scheduled or due payment isn't met on time, AA manages it as 'overdue' per the bank's own overdue rules configured on the product — moving through stages like Grace, Delinquent and Non-Accrual Basis, with penalty interest and fees applied as configured.",
    example: "Advanced Pay In screen: Payment Type INTERESTONLY, Rule 'PARTIAL' on Account 1000000031 — meaning if funds fall short, the available amount is taken and the remaining unpaid part is moved into overdue status, rather than either overdrawing the account or taking nothing at all.",
    why: "The Account Debit Rule decides exactly what happens the moment funds run short: Full still debits the servicing account in full even if it causes an overdraw; Partial takes what's available and moves the shortfall to overdue; None takes nothing at all and the entire due amount goes overdue.",
    how: "AA allows overdue payments to progress through various stages/periods based on the number of days bills remain unpaid, the number of payments missed, or IFRS impairment rules — typically Grace (no penalty interest), Delinquent (penalties apply), and Non-Accrual Basis (interest income is suspended). AA automatically assigns and tracks these statuses, and can send reminder notices at predefined intervals for each one.",
    memory: "Full = debit anyway, even if overdrawn. Partial = take what's there, rest goes overdue. None = take nothing, all goes overdue. Grace → Delinquent → Non-Accrual, each with its own interest/notice behaviour.",
    temenos: "This is the exact same Grace/Delinquent/Non-Accrual Basis vocabulary configured back in the product's own Overdue conditions in the Loan Product Builder material.",
    related: ["tftLPSettleOverdue", "tftLROverdueMonitoring"],
  },
  tftLROverdueMonitoring: {
    title: "Overdue Payment Monitoring — Details, Statistics & Advices",
    simple: "The Overdue Status is shown clearly on the Arrangement Overview screen; drilling into Due and Overdue Details breaks out exactly what's owed (Principal Delinquent, Principal Interest Delinquent, Penalty Interest Accrued), and Overdue Statistics tracks how long each status has actually lasted and its average amount.",
    example: "Working Capital Overview: Overdue Status 'Delinquent'; Total Amount Due 1,192.60 = Principal (Delinquent) 1,161.40 + Principal Interest (Delinquent) 30.92 + Penalty Interest (Accrued) 0.28. Overdue Statistics for the same account: Grace status ran 4 days from 10-14 Dec (average 596.16 over 3 occurrences), Delinquent status ran 6 and 13 days across two periods.",
    why: "Separating the outstanding amount by property (Principal, Principal Interest, Penalty Interest) rather than one lump 'amount overdue' figure lets the bank see exactly which component is driving the shortfall.",
    how: "Overdue Payment Advices are generated automatically whenever a payment becomes overdue or reaches a new overdue status — each advice logs its Activity (e.g. 'Age Bill to Delinquent Status', 'Issue Bill (Constant Repayment)'), Delivery Reference and Carrier Address.",
    memory: "Overdue Status is always visible right on the Arrangement Overview. Statistics table = status, start date, average overdue amount, days overdue — one row per period.",
    temenos: "Under 'Bills' in the account's Additional Details, every payment that has actually reached overdue status is listed with its own outstanding amount and status.",
    related: ["tftLROverdueRules"],
  },

  // ---- Section 2: Loan Maintenance Activities ----
  tftLMActivities: {
    title: "Loan Maintenance — AA Lending Transactions & Activities",
    simple: "Any modification to an existing arrangement is done through Activities — actions that let a bank change a loan's principal amount, interest, duration, or adjust a bill amount, all initiated from the Arrangement Overview's 'New Activity' link.",
    example: "The New Activity dropdown lists categories including Activity, Charges, Messages, Correspondence, Schedule, Evidence, Overdue, Sims, Payment Orders, Evaluation, Overpayment, Loan Trades — each opening the relevant set of specific activities.",
    why: "Routing every modification through Activities (rather than editing the arrangement's fields directly) keeps a full, auditable Activity Log of exactly what changed on the loan and when.",
    how: "In Inclusive Banking, principal increase (Top-up) and change in loan duration (Reschedule) specifically can be processed using either Direct Loan Input or the Loan Origination application, rather than needing a raw AA activity screen.",
    memory: "New Activity link = the doorway to every loan modification. Top-up (principal increase) and Reschedule (term change) have their own dedicated Inclusive Banking screens.",
    temenos: "For each individual element of the loan (e.g. Term Amount, Repayment Schedule), only the actions relevant to that element are ever offered — the menu is context-sensitive.",
    related: ["tftLMTopupReschedule", "tftLMBulkReschedule", "tftLMClosure"],
  },
  tftLMTopupReschedule: {
    title: "Top-up & Reschedule via Direct Loan Input",
    simple: "Selecting Reschedule or Topup as the Loan Action on a Direct Loan Input record presents a drop-down of all the customer's existing loans to pick the one being amended, plus an auto-generated context enquiry showing its current details.",
    example: "Loan Input / DL2535664404: Customer Type Individual, Customer Id 100001 Kariuki, Loan Action Topup, For Arrangement selectable from AA2535078nWv2Y (1000000584) or AA2535071CNMy0 (1000000687).",
    why: "Top-up operations can be done with or without changing the loan's term — entering the new total term (not the change in term) on the Term Requested field is what actually amends the contract length, so leaving it as-is keeps the original term.",
    how: "The top-up transaction requires due approval in exactly the same way as a brand-new Direct Loan transaction — it doesn't bypass the maker-checker cycle just because it's a modification rather than a new loan.",
    memory: "Term Requested on a Top-up = the loan's new total term, not a delta. Leave unchanged to keep the original term while only increasing the principal.",
    temenos: "The same Loan Input screens used here mirror Loan Origination's Application Input tabs — Loan Input, Guarantor Input, Collateral Input, Audit.",
    related: ["tftLMActivities", "tftLMGuarantorUpdate", "tftLMCapitalizeArrears"],
  },
  tftLMGuarantorUpdate: {
    title: "Top-up & Reschedule — Updating Guarantors",
    simple: "Guarantors can be added or removed during a top-up or reschedule by selecting the Guarantor Input tab and the 'Update Loan Guarantor' or 'New External Guarantor' link; releasing an existing guarantor requires changing their status from Current to Released with a valid Reason for Release.",
    example: "Loan Input / DL2535664404, Guarantor Input tab: Guarantor Id 100007, Account 1000000988, Amount 4,000.00 — Status dropdown offers Current or Released, with Reason for Release required if changed to Released.",
    why: "A guarantor may become ineligible over time — e.g. by taking on an overdue loan of their own — which is exactly what the Conditions Excluding Guarantors table checks for automatically during a top-up or reschedule.",
    how: "New guarantors are added by multi-valuing the Guarantor Id field and entering their details, same as at original loan input. If a guarantor's eligibility has changed (e.g. 'Guarantor has overdue loan (100002)'), committing the record raises an error that must be resolved before the top-up/reschedule can proceed — and the same alert is posted in the borrower's own Single Customer View, under the Loan Guarantor's tab, so the bank can address it per policy even outside a top-up/reschedule.",
    memory: "Update Loan Guarantor (Current→Released, needs Reason) or New External Guarantor. Eligibility re-checked live against the same Conditions Excluding Guarantors table used at origination.",
    temenos: "The Guarantors Report in the Single Customer View's Loan Guarantor's tab surfaces exactly this kind of alert — e.g. 'Guarantor has overdue loan (100001) [ERROR]' — for the bank to review.",
    related: ["tftLMTopupReschedule", "tftLMGuarantorStandalone", "tftGUExcludeRelease"],
  },
  tftLMGuarantorStandalone: {
    title: "Guarantor Maintenance — Standalone",
    simple: "The guarantor table can be maintained for any reason a bank sees fit, without needing to trigger a top-up or reschedule at all — via 'Maintain Guarantors' from the Loan Guarantors tab.",
    example: "Credit Security tab (Single Customer View), Guarantors list: Customer Id 100006 (Mrs Minenhle Jomo-Gbomo) and G253406HL2RK (Matthew Wamiti), each showing Loan Balance, Arrears, Maturity Date, Guarantee Amount, and Blocked Account — Meatballs menu offers Single Customer View, Loan Overview, and Manage Guarantors.",
    why: "Decoupling guarantor maintenance from top-up/reschedule means the bank can, for instance, release a guarantor mid-term as a goodwill gesture, or swap one out, without needing any change to the loan's own term or amount.",
    how: "Selecting Maintain Guarantors opens the same guarantor table used everywhere else in origination and maintenance — view or make changes as necessary, following the bank's own policy.",
    memory: "Maintain Guarantors = guarantor-table access with zero side effects on the loan itself — no top-up, no reschedule, just the guarantor record.",
    temenos: "Reached from Credit Security > Guarantors > Meatballs > Manage Guarantors on the customer's own record, not from the loan arrangement screen.",
    related: ["tftLMGuarantorUpdate", "tftGUOverview"],
  },
  tftLMCapitalizeArrears: {
    title: "Capitalization of Arrears",
    simple: "This functionality lets overdue balances on a non-expired loan be rolled into (capitalised on) the loan itself during a Top-up or Reschedule — the bill balances eligible for capitalisation are configured in EM.LO.PARAMETERS-TOPUP or EM.LO.PARAMETERS-RESCHEDULE, and the balance prefixes to be capitalised are set in EB.PARAM > ALL-EM.CAPITALISE.ARREARS.",
    example: "General Parameters / PersonalLoan: Capitalise Property 1 ACCOUNT, Capitalise Property 2 PRINCIPALINT. EB.PARAM / ALL-EM.CAPITALISE.ARREARS: Balance Prefixes GRC, DEL, NAB (Grace, Delinquent, Non-Accrual Basis).",
    why: "Capitalising arrears rolls what the customer already owes into the new loan structure — useful for a genuinely distressed borrower — rather than leaving those overdue amounts to sit separately and keep accruing penalties on top of the fresh top-up.",
    how: "During a top-up/reschedule on an overdue loan that qualifies, the total amount to be capitalised is displayed on screen and factored directly into the loan calculation — a pop-up enquiry shows Overdue, Capitalise Arrears, Total Refinanced, and the resulting Status (e.g. 'BeDeposit').",
    memory: "EM.LO.PARAMETERS-TOPUP/RESCHEDULE = which bill properties (balances) are capitalised. EB.PARAM ALL-EM.CAPITALISE.ARREARS = which overdue-status prefixes (GRC/DEL/NAB) qualify.",
    temenos: "This only applies to a loan that is not yet expired — it's specifically a top-up/reschedule-time feature, not a standalone activity.",
    related: ["tftLMTopupReschedule", "tftLROverdueRules"],
  },
  tftLMBulkReschedule: {
    title: "Bulk Rescheduling",
    simple: "Used to reschedule many loans at once for ad-hoc events like public holidays or crises — where the repayment date falls within a defined holiday period, loan instalments are automatically skipped and rescheduled past it.",
    example: "Bulk Loan Reschedule / 20260716142503: Reason 'Drought Relieve', Holiday Date From 23 DEC 2025, Holiday Date To 31 DEC 2025, Number Of Periods To Skip 3, Simulate Short; scoped to Account Officer, Group 000007 'Teachers Group', Product, or a specific Arrangement Id.",
    why: "Rescheduling as early as the next business day (never on the actual due date itself) and excluding any loan already maturing within the holiday window are both deliberate guardrails against the bulk job accidentally reworking a loan that's about to close anyway.",
    how: "Two ways to define which instalments are skipped: Holiday Range (instalments falling between the holiday start and end dates are rescheduled) or Number of Periods to Skip (if dates aren't entered, skips that many payments from tomorrow; if both are entered, reschedules only up to the number of payments within that date range). Other selection criteria: specific Account Officer(s), Loan product type(s), Customer Group(s), or All Active Loans (Number of Periods to skip must then be defined). Whether interest is forgiven during the skipped cycle is configurable — Yes means no interest calculated/accrued during the skip; No means interest still accrues and is folded into subsequent instalments.",
    memory: "Holiday Range = date-window skip. Number of Periods to Skip = count-based skip from tomorrow. Interest forgiveness during the skip is a separate Yes/No switch, either way.",
    temenos: "Before authorising, the job can be simulated to preview affected loans: Full (also runs Validate on each loan to check for contract issues — slower, thorough) or Short (lists matching loans with no extra validation — faster, better for a large portfolio). Workflow: Input selection criteria → Check the simulation result → Authorise the request → Final Check of results.",
    related: ["tftLMActivities", "tftLMClosure"],
  },
  tftLMClosure: {
    title: "Loan Closure",
    simple: "Every loan arrangement has an underlying account storing its balances; Loan Closure closes that account once the loan reaches maturity or its balances hit zero — LENDING-CLOSE-ARRANGEMENT is the activity that actually performs it.",
    example: "New Activity list on an Arrangement Overview includes 'Close Arrangement' directly under Balance Maintenance — closure can also be effected manually from there when appropriate.",
    why: "Manual loan closure is only allowed where CLOSURE.METHOD is set to MANUAL or NONE on the Closure product condition — for a product set to AUTOMATIC, the bank relies entirely on the maturity-date or zero-balance trigger instead.",
    how: "LENDING-CLOSE-ARRANGEMENT triggers automatically once the arrangement is identified for closure under the closure settings in the Closure product condition, if Closure Method = AUTOMATIC; for MANUAL, it must be triggered by a user via the New Activity link.",
    memory: "Closure Method AUTOMATIC = system-triggered at maturity/zero balance. MANUAL or NONE = a user must trigger Close Arrangement themselves. Closure can also happen if a loan is cancelled within its initial cancellation period.",
    temenos: "This is the same Closure Type (Balance vs Maturity) and Closure Method configured back in the product's own Payoff & Closure conditions in the Loan Product Builder material.",
    related: ["tftLMActivities", "tftLPPayoffClose"],
  },

  // ---- Section 3: CGAP Reports ----
  tftCGAPOverview: {
    title: "CGAP Reports — Overview",
    simple: "CGAP (the Consultative Group to Assist the Poor) is a global partnership of 34 organisations that developed standardised report templates — classes A through E — for reporting microfinance lending and savings activity; Inclusive Banking delivers classes A, B and C as part of the Model Bank.",
    example: "Report codes combine a class letter and a number: B1, B2, C4, C9. The actual reports included are contained in the parameter file EB.PARAM, record ALL-EM.CGAP.REPORT.",
    why: "These are delivered exactly as CGAP templates them, which means implementations may make only minimal changes (e.g. adding a column) — or in some cases none at all — rather than freely redesigning the report layout.",
    how: "For the reports to run, the customer record indicated in field Param Value.2.1 must exist in the environment, the TSM service must be started, and EM.CGAP.REPORT.RUN service must be set to Auto mode.",
    memory: "CGAP = the standards body; A/B/C/D/E = its report classes; Inclusive Banking ships A, B, C. Reports are templated, not freely customisable.",
    temenos: "TSM + EM.CGAP.REPORT.RUN (Auto) + a valid customer record in Param Value.2.1 are the three preconditions for these reports to actually generate.",
    related: ["tftCGAPAccess", "tftCGAPReportSamples"],
  },
  tftCGAPAccess: {
    title: "CGAP Reports — Accessing Classes B and C",
    simple: "Classes B and C are reached via Credit Manager > Reports; generating one is a three-step Meatballs-menu flow: Request Report, then List Reports, then View.",
    example: "Credit Manager, Reports tab: B1 Loan Repayment Schedule, B2 Loan Account Activity, B3 Customer Status Report, B4 Group Membership Report, B5 Teller Loan Report, B6 Active Loans by Loan Officer, B7 Pending Clients by Loan Officer, B8 Daily payments Report, B9 Portfolio Concentration Report, C1 Detailed Aging of Portfolio At Risk, C2 Delinquent Loans by Branch and Loan Officer, C3 Delinquent Loans by Branch and Product, C4 Portfolio Summary At Risk by Loan Officer, C5 Summary Portfolio at Risk by Branch Prod.",
    why: "Splitting generation into Request then List then View means a report can be requested once and reviewed multiple times afterward — the record persists in CGAP Report List rather than the report being a one-shot, throwaway output.",
    how: "Click the Meatballs icon for the desired report → Request Report → complete the displayed form if necessary and commit. Click the Meatballs icon again → List Reports, to show the report record. Click the View icon to display the actual report.",
    memory: "Request Report → List Reports → View — three clicks, not one, and the requested report stays available afterward.",
    temenos: "Report Variants and Scheduled Report Runs both appear on the same Reports screen, alongside the CGAP Report List.",
    related: ["tftCGAPOverview", "tftCGAPReportSamples"],
  },
  tftCGAPReportSamples: {
    title: "CGAP Reports — Worked Examples (B2, B3, B8, B9, C2, C5)",
    simple: "Each CGAP report answers a different operational question: B2 shows one loan account's activity history, B3 shows a customer's full loan/savings status, B8 lists a day's payments, B9 and C5 look at portfolio-level risk, and C2 lists delinquent loans by branch and officer.",
    example: "B2 Loan Account Activity for Mrs Anne Kioko's Murabaha Finance loan: disbursement -20,000.00, a payment received of 1,594.50 (Interest 160.65), then the 'Amount required to close account' block (Loan Balance, Interest Due, Fees Due, Penalties Due, Total to Close). B9 Portfolio Concentration Report groups Dairy/Agriculture and Organic Farming/Agriculture by sector and industry, showing Contracts, Portfolio amount, and Delinquency, each as both a number and a percentage.",
    why: "B9 and C5 exist specifically because regulators and stakeholders often want portfolio risk shown by sector/industry or by delinquency-day bucket, not just a flat total — these reports are the standard shape for that kind of oversight reporting.",
    how: "C2 Delinquent Loans by Branch & LO groups delinquent contracts first by branch, then by loan officer, showing Disbursement Amount, Loan Balance, Due Principal/Interest, Last Payment Date and Days Without Payment. C5 Summary Portfolio at Risk groups by branch then product, breaking the outstanding portfolio into on-time and 1-30/31-60/61-90/90+ day delinquency buckets, both in count and amount.",
    memory: "B2 = one loan's activity. B3 = one customer's whole picture. B8 = one day's payments. B9/C5 = portfolio risk by sector or by delinquency bucket. C2 = delinquent loans by branch/officer.",
    temenos: "B9 is usually a regulatory report — showing loan concentration by sector and industry is a common central-bank requirement for lenders.",
    related: ["tftCGAPAccess", "tftLACreditAssessment"],
  },

  // ---- Section 4: Standard Loan Provisioning ----
  tftPVOverview: {
    title: "Financial Asset Provisioning — Overview & the Transact Provisioning Module",
    simple: "Provision is money a bank sets aside to cover potential loan losses, built on three steps — Classification (assessing each asset's default/loss likelihood), Calculation (turning that classification into a provision amount), and Posting (booking it: Dr P&L, Cr an internal account) — all supported by Transact's Provisioning (PV) module.",
    example: "Banks set their own classes, e.g. Standard, Sub-Standard, Doubtful, Loss/Write Off — each with its own risk percentage. A COB job runs Calculation at whatever frequency the bank sets, then a further COB job posts the calculated amounts.",
    why: "This guarantees a bank's solvency and capitalisation if and when defaults actually occur — booking expected losses as an expense ahead of time, against pre-tax income, rather than being caught out when a loan actually goes bad.",
    how: "Classification is done via the module's PV.LOAN.CLASSIFICATION table, at either Customer level (a customer's worst-classified loan classifies all their loans) or Asset level (each loan classified in its own right) — configured in PV.MANAGEMENT. Calculation uses PV.PROFILE, where provision percentages per asset class are entered at whatever frequency the bank sets. It's possible to override the automated classification or provision amount manually — once overridden, the asset stays on manual until the bank deliberately returns it to automated. Posting can be delayed by a minimum of one day after classification.",
    memory: "Classification → Calculation → Posting. Overdues with different age groups get different classifications and risk percentages. Manual override sticks until deliberately reverted.",
    temenos: "The Provisioning Module can commonly be used for contracts held across AA, LD, MM, SL and PD — see the coverage concept for the full list.",
    related: ["tftPVCoverage", "tftPVComponents"],
  },
  tftPVCoverage: {
    title: "Provisioning (PV) Module — Coverage & the Expected Loss Model",
    simple: "The PV module supports provisioning for five Transact application modules — Arrangement Architecture (AA), Loans and Deposits (LD), Money Market (MM), Syndicated Lending (SL), and Past Due (PD) — with heavy flexibility via the T24 Rules Engine and APIs.",
    example: "Standard provisioning follows an Expected Loss Model: each asset is classed based on its perceived risk, and the provision amount is calculated as a percentage of the asset's balance — an asset with low perceived risk carries a lower provision than one at higher risk, for the same nominal balance.",
    why: "Basing the amount on the balance means any change in the underlying asset — a partial repayment, a reclassification — automatically triggers a fresh recalculation, so the provision never quietly goes stale relative to the actual exposure.",
    how: "It's also possible to use the value of a loan's collateral to mitigate (reduce) the calculated provision amount — covered fully under the Provisioning Profile's collateral methods.",
    memory: "Coverage = AA + LD + MM + SL + PD. Standard Provisioning = Expected Loss Model, balance-based, recalculated on any change.",
    temenos: "This is 'Standard Provisioning' specifically — separate from IFRS provisioning, which the same PV module also supports but with its own posting-detail records.",
    related: ["tftPVOverview", "tftPVComponents"],
  },
  tftPVComponents: {
    title: "PV Module Components",
    simple: "Process Management (PV.MANAGEMENT) drives the frequency, product selection, classification method and posting delay; Provisioning Definition (PV.PROFILE) holds the actual calculation method, classification parameters, accounting and posting details — together they classify and provision every contract.",
    example: "PV.MANAGEMENT feeds PV.ASSET.DETAIL and PV.CUSTOMER.DETAIL (the classification results, per asset or per customer); PV.PROFILE links out to EB.LOOKUP, AC.BALANCE.TYPE and IFRS.POSTING.DETAILS for its supporting configuration.",
    why: "Splitting 'how often and which contracts' (Management) from 'what percentage and how to post it' (Profile) means the same profile can be reused across multiple management records running at different frequencies for different products.",
    how: "The T24 Rules Engine (or an API, if the Rules Engine isn't used) provides classification using any criteria from the Asset or the Customer — e.g. Past Due status, Sector, Residence — deriving the classification stored in PV.ASSET.DETAIL / PV.CUSTOMER.DETAIL. There's a posting delay between the Calculation process and the Posting process; the provision is recalculated and posted at contract level once that delay elapses.",
    memory: "PV.MANAGEMENT = the 'when and which.' PV.PROFILE = the 'how much and how to post.' PV.ASSET.DETAIL / PV.CUSTOMER.DETAIL = where the actual classification results land.",
    temenos: "AC.BALANCE.TYPE specifically is the table used for Standard Provisioning's balance definitions.",
    related: ["tftPVOverview", "tftPVClassification", "tftPVManagement"],
  },
  tftPVClassification: {
    title: "Loan Classification — PV.LOAN.CLASSIFICATION & EM.PV.PARAMETER",
    simple: "PV.LOAN.CLASSIFICATION defines the bank's own alphanumeric classification codes and a unique numeric Rank per code (the higher the rank, the higher the risk); Inclusive Banking's EM.PV.PARAMETER simplifies this down to classifying loans purely by number of days overdue.",
    example: "PV.LOAN.CLASSIFICATION: DOUBTFUL rank 60, STANDARD rank 10, SUB-STANDARD rank 30, WATCHLIST rank 20, WRITEOFF rank 90. EM.PV.PARAMETER / SYSTEM: Days Overdue 1 → Asset Class STANDARD; Days Overdue 2 (30) → WATCHLIST; Days Overdue 3 (60) → SUB-STANDARD; Days Overdue 4 (90) → DOUBTFUL; Days Overdue 5 → WRITEOFF.",
    why: "A concatenate file (PV.RANK.CLASS) keeps every rank unique across classifications specifically so the Rules Engine can reference ranks unambiguously when writing classification rules.",
    how: "If using the Rules Engine, criteria with similar credit-risk characteristics might include past-due status, sector, residence, or customer rating — classification can legitimately differ across countries and institutions, so this is a flexible mechanism rather than a fixed formula. Local reference fields or an API can also supply criteria not otherwise available in T24 tables (e.g. customer age).",
    memory: "PV.LOAN.CLASSIFICATION = the bank's own classes + unique rank. EM.PV.PARAMETER (Inclusive Banking) = a simplified, days-overdue-only version of the same idea.",
    temenos: "For clients whose requirements aren't met by EM.PV.PARAMETER's simple days-late criterion, the full Rules Engine can instead be used to define other criteria as needed.",
    related: ["tftPVComponents", "tftPVProfile"],
  },
  tftPVProfile: {
    title: "Provisioning Profile — PV.PROFILE",
    simple: "PV.PROFILE holds, for each classification, the provisioning percentage to apply, the calculation method (Percentage/Standard, IFRS, or API), which balance(s) to provision for (e.g. principal, interest separately), and whether/how collateral reduces the provision.",
    example: "Input Provision Profile / STANDARD-20150611: Provision Type 1 'For Total Principal', Provision Calc 1 Percentage, Source Balance 1 PROVPRINCIPAL, with per-classification percentages (STANDARD 0.00-10, WATCHLIST 10.00-20, SUB-STANDARD 25.00-30, DOUBTFUL 50.00-60, WRITEOFF 100.00-90); Provision Type 2 'For Int And Chg' uses Source Balance PROVINTCHG.",
    why: "Because there are no global standards for how contracts/assets should be classified under credit risk, this table is deliberately flexible — multiple Provisioning Types (e.g. Principal vs Interest/Charges) can each carry their own calculation method and percentages.",
    how: "Multiple Provisioning types are defined with Source Balance Types (configured in EB.LOOKUP > PV.PROVISION.TYPE) for different balance categories. A contract can only use one calculation method at a time. Only one PV.PROFILE record is actually used per date — this is an FTD-type file, and any number of dated records can exist; the profile with the latest applicable date is picked up by the calculator on the calculation date. A reference file, PV.PROFILE.XREF, holds the list of dates for the profile. For Standard Provision, only the 'PV' module needs installing; for IFRS, both 'PV' and 'IA' are required.",
    memory: "PV.PROFILE is FTD (dated) — only one record applies on any given date, the latest one on or before it. Multiple Provisioning Types can exist per profile for different balance categories.",
    temenos: "Two records ship in the Model Bank: one for IFRS, one for Standard Provisioning.",
    related: ["tftPVClassification", "tftPVCollateralExamples", "tftPVAccountingLink"],
  },
  tftPVCollateralExamples: {
    title: "Collateral Mitigation & Secured/Unsecured — Worked Examples",
    simple: "Two methods apply collateral to a provision calculation: Mitigate (subtracting the collateral value from the balance before applying the rate — Provision = (Balance − Collateral) × Rate) and Secured/Unsecured (applying a lower rate to the collateral-covered portion and a higher rate to the uncovered remainder).",
    example: "Mitigate example: a Watchlist loan with Principal 100,000 (rate 10%) and Interest 5,000 (rate 5%), Collateral 102,000. The collateral fully covers the 100,000 Principal (provision £0), leaving 2,000 of collateral to cover 2,000 of the 5,000 Interest balance (provision £0 on that portion); the remaining 3,000 of Interest is unmitigated, so provision = 3,000 × 5% = £150 total. Secured/Unsecured example: same loan, Secured rate 5% / Standard (unsecured) rate 10% for Watchlist. Principal fully secured by the 102,000 collateral: 100,000 × 5% = £5,000. Interest: 2,000 secured (2,000 × 5% = £100) + 3,000 unsecured (3,000 × 10% = £300) = £400. Total provision = £5,400.",
    why: "The same loan, same collateral, and the same nominal Watchlist classification produce very different total provisions (£150 vs £5,400) purely because of which of the two collateral methods is configured — a critical modelling choice, not a cosmetic one.",
    how: "Mitigate: field COLLATERAL.USE must be set to Mitigate and PROV.CALC to Percentage; Provision Amount = (Loan Balance − Collateral Value) × Provision Rate. Secured/Unsecured: COLLATERAL.USE set to Secured/Unsecured and PROV.CALC to Percentage; field SEC.PERCENT gives the rate applied to the secured portion, STD.PERCENT the rate for the unsecured portion.",
    memory: "Mitigate: collateral shrinks the balance first, then one rate applies. Secured/Unsecured: two different rates apply to the covered vs uncovered portions of the same balance — and this is why it can produce a much larger total provision even with full collateral cover.",
    temenos: "The collateral itself is held in Transact, and a separate process allocates the Collateral to the underlying contracts before the provision calculator ever runs.",
    related: ["tftPVProfile", "tftLPCharge"],
  },
  tftPVAccountingLink: {
    title: "Provisioning Profile — Accounting Level & Link to Other Tables",
    simple: "Though assets may be classified at Customer or Asset level, accounting only ever happens at the Asset (loan) level; PV.PROFILE links out to EB.LOOKUP (defining Provision Type source balances), AC.BALANCE.TYPE (the actual balance definitions for those source balances), and IFRS.POSTING.DETAILS (how the accounting entries post).",
    example: "PV.PROFILE / STANDARD-20150611: Accounting 'Deal' level, Posting Details 'DEFAULT.PERCENTAGE' (linking to IFRS.POSTING.DETAILS). AC.BALANCE.TYPE / PROVPRINCIPAL: virtual balances CURACCOUNT, DUEACCOUNT, ARRACCOUNT, DELACCOUNT, NABACCOUNT. AC.BALANCE.TYPE / PROVINTCHG: virtual balances DELPRINCIPALINT, DELPRINCIPALCHG, DUEPRINCIPALINT, OVERDUEPRINCIPALINT.",
    why: "Accounting always at Asset level — never at Customer level, even when classification itself runs at Customer level — because that's the only level at which an actual GL entry against a real balance makes sense.",
    how: "The COLLATERAL.USE field ('Mitigate' in a Standard Provision example) indicates that the balance used for provision needs to be mitigated by whatever collateral amount has been allocated to that contract — tying directly back into the collateral examples.",
    memory: "Classification can run at Customer or Asset level. Accounting always runs at Asset (Deal) level, regardless.",
    temenos: "PV.PROFILE.XREF (an FTD reference file) is required alongside PV.PROFILE to hold the list of dates the profile has been defined for.",
    related: ["tftPVProfile", "tftPVPostingDetails"],
  },
  tftPVPostingDetails: {
    title: "PV Posting Details — IFRS.POSTING.DETAILS",
    simple: "IFRS.POSTING.DETAILS stores how accounting entries for provision will actually be generated, so contracts stay compatible with reporting requirements; separate records exist for Standard Provisioning (Position Type 'TR') and IFRS (Position Type 'IF'), since each needs a different Position Type.",
    example: "IFRS.POSTING.DETAILS / DEFAULT.PERCENTAGE: Position Type TR (Trading Position), Entry Type 'Both', Debit Category 'PL – Provision Expense', Credit Category 'MISC – Provision Reserve', Contra Debit/Credit categories also defined.",
    why: "ENTRY.TYPE being settable to PROFIT, LOSS, or BOTH matters because it decides which category a provision entry actually posts to — with BOTH, profit and loss amounts both post to the same category rather than being split apart.",
    how: "ENTRY.TARGET captures the debit side of the provision entry, CONTRA.ENTRY the credit side — credit can post to either RE.CONSOL.SPEC.ENTRY (CRF) or an Internal Account. CATEGORY gives the P&L category the provision debit posts to; CONTRA.CATEGORY gives the Internal Account category for the credit leg (which must be a valid entry in an ACCOUNT.CLASS record with class U-AAWOF). POSTING.STYLE picks ADJUST (post the difference between yesterday's and today's IFRS balance) or I/O (reverse yesterday's value and repost the new one entirely).",
    memory: "Position Type TR = Standard Provisioning. Position Type IF = IFRS. ADJUST = post the delta. I/O = reverse and repost in full.",
    temenos: "Valid transaction codes are provided to describe the P&L and Account entries as necessary — these aren't free-text, they come from a defined list.",
    related: ["tftPVAccountingLink", "tftPVProfile"],
  },
  tftPVManagement: {
    title: "The Provisioning Process — PV.MANAGEMENT, Asset/Customer Records & Manual Adjustment",
    simple: "PV.MANAGEMENT controls the whole process's parameters (run frequency, product selection, classification level, posting delay); the resulting classification and provision figures land in PV.ASSET.DETAIL (per loan) or PV.CUSTOMER.DETAIL (per customer, if classified at that level) — and either can be manually overridden.",
    example: "PV.MANAGEMENT / AA.LOANS: Job Frequency M01D1, Posting Timing Delay, Posting Delay 1, Profile Id STANDARD-20150801, Class Level Customer, Product AA-Arrangement Architecture, Class Api EM.XX.PVCLASSIFICATION.RULE, Product Line LENDING. A single 'SYSTEM' (or any other id) PV.MANAGEMENT record is allowed per lead company, and can be shared within a multi-company environment.",
    why: "Multiple PV.MANAGEMENT records let a bank set different classification/calculation rules — and different job frequencies — per product, e.g. Personal Loans at 12% provisioning for Watchlist versus Mortgage Loans at 8% for the same classification, rather than one blanket rate for everything.",
    how: "PV.ASSET.DETAIL (keyed by Asset/Contract Id) holds current and previous Classification/Calculation details, updated the first time the classification job processes that contract, along with static Product/Currency/Customer/Category information; its Previous fields are multi-valued, and once more than 31 exist, the oldest are moved to PV.ASSET.DETAIL.HIST. PV.CUSTOMER.DETAIL (keyed by Customer Id) holds the worst classification across all the customer's contracts processed by that job, updated only when Class Level = Customer in PV.MANAGEMENT. Manual Adjustment: at Customer level, the classification code can be manually overwritten in PV.CUSTOMER.DETAIL (with Reason for Manual adjustment); at Contract level, both the classification code and the provision amount can be manually overwritten in PV.ASSET.DETAIL — a manual amount is then what actually posts as provision, and it stays that way until the bank returns the asset to automated.",
    memory: "PV.MANAGEMENT: one record can serve many products, or many records can each serve a different product with its own profile/frequency. Manual override at Customer level touches only the classification code; at Contract level it can touch both classification AND the provision amount.",
    temenos: "A product group may only be specified in one PV.MANAGEMENT record — the concat file PV.MGMT.PRODUCT.LIST holds the Category Range/Product Group/Product Line already claimed by each application, and a record id of 'SYSTEM' must first be reversed before any individual per-product record can be entered.",
    related: ["tftPVComponents", "tftPVClassification"],
  },

  // ---- Section 5: Standard Loan Provisioning Hands-On ----
  tftPVHandsOn: {
    title: "Hands-On: Provision Details, Manual Classification & Provision Summary",
    simple: "Practice 1 views a contract's provisioning record via the Credit Manager's Provision Details Report and PV.ASSET.DETAIL. Practice 2 attempts a manual classification override at Contract level (which fails, since classification for that asset is done at Customer level), then successfully overrides it at Customer level instead — and checks the resulting Provision Summary Report.",
    example: "Practice 1 solution: Credit Manager > Portfolio Monitoring > Provision Details lists contracts (e.g. loan 1000000497, customer Kioko, GBP, classified Standard, Loan Outstanding, Provision Type PROVPRINCIPAL/PROVINTCHG with their own Base Amt/Provision figures) — View Report Detail opens PV – Asset Details / 1000000538, showing Product AC, PV Management Id AA.LOANS - Provisioning fo…, PV Profile Id STANDARD, Last/Auto Classification, and Provision Details (Base amount, Provision, Last Post Date).",
    why: "The Practice 2 error — 'Manual Classification: INPUT NOT ALLOWED WITH CLASSIFICATION AT CUSTOMER' — exists precisely because PV.MANAGEMENT for this contract has Class Level set to Customer, so an asset-level manual override is meaningless: the customer's worst-loan classification governs, not this one contract in isolation.",
    how: "Practice 2 solution: editing the Provision Details Report record and setting Manual Classification directly on PV – Asset Details fails with that error; instead, editing the Customer Classification record (via Credit Manager > Customer Classification) and setting Manual Class 1 (e.g. DOUBTFUL – 60) with a Reason succeeds on authorisation. The Provision Summary Report (Credit Manager > Portfolio Monitoring > Provision Summary) then shows totals grouped by Currency and Auto Classification — Rank, Number of contracts, Loan Outstanding, Base Amt, Posted Provision, Calc. Provision and any Man. Correction.",
    memory: "Classification level (Customer vs Asset, set in PV.MANAGEMENT) decides exactly where a manual override must be entered — get the level wrong and the system blocks it with a clear error rather than silently ignoring it.",
    temenos: "Verify via the Provision Summary Report — it's the fastest way to see the effect of a manual reclassification across an entire currency/classification bucket, not just the one contract touched.",
    related: ["tftPVManagement", "tftPVClassification"],
  },

  // ---- Section 6: Guarantor Recoveries & Loan Write-off ----
  tftGRRecoveryConfig: {
    title: "Recovery From Guarantors — Configuration & Mechanics",
    simple: "Before a loan is written off, a bank can recover overdue amounts from its guarantors' accounts, provided the guarantor parameter table's 'Recovery from Guarantor's Account' field is set to Allowed; with multiple guarantors, the Recovery Mode (Equal or Proportional) decides how the amount is split between them.",
    example: "For a customer with three guarantors and an outstanding overdue amount, recovery might split as Amt to Recover 1 = 0.00 (already fully at their guaranteed limit), Amt to Recover 2 = 36.88, Amt to Recover 3 = 36.88 — split according to Proportional mode and each guarantor's own guaranteed amount and account balance.",
    why: "The recovery amount can be negotiated per guarantor if the parameter table allows it, and if there simply aren't enough funds across the guarantors' accounts for full recovery, the Insufficient Balance Action field decides whether to overdraw those accounts or recover only up to their current balance.",
    how: "This reuses the exact same Recovery Mode, Percentage to Block-style logic, and Insufficient Balance Action fields already configured in EM.LO.GUARANTOR.PARAM for blocking — recovery is just that same mechanism, run in reverse, to actually collect the overdue amount rather than merely hold it.",
    memory: "Recovery from Guarantor's Account = Allowed (a switch that must be on). Recovery Mode = Equal or Proportional, same pattern as blocking.",
    temenos: "This directly reuses concepts from the Guarantor Parameters course — the same parameter table, just a different field for a different moment in the loan's life.",
    related: ["tftGUParams", "tftGRRecoveryOps"],
  },
  tftGRRecoveryOps: {
    title: "Recovery From Guarantors — Operations & Reports",
    simple: "To recover from guarantors, a user drills down on the late loan in the borrower's Single Customer View Portfolio tab, opens Transactions, and selects 'Repayment by Guarantor' to reach the recovery dashboard; recovering manually requires authorisation, landing in the Tasks tab of SCV.",
    example: "Manual Recovery from Guarantor's Account / AA25340VYVJB-20260720181748: Customer Loan Acct No 1000001948, Customer Overdue Amt 110.68, Customer Loan Balance 4,905.80, Total Amt Recovered 73.76; three guarantors each with Guar Acct No, Guar Acct Balance, Amt Guaranteed, and an editable Amt to Recover field.",
    why: "Requiring authorisation on a manual guarantor recovery is a maker-checker control against a single officer being able to unilaterally debit a guarantor's account without independent sign-off.",
    how: "Using Browser access, the resulting recovery activity appears in the report path Loans AA > Limits and Collateral Reports > Guarantor Reports > 'Loans Recovered from Guarantor's Accounts' — listing Loan Id, Loan Account, Customer, Overdue Amount, Guarantor's Account/Id/Name, Amount Recovered, Recovery Date and Officer.",
    memory: "Repayment by Guarantor (from the loan's own Transactions menu) → recovery dashboard → authorisation required → shows up in the Guarantor Reports' 'Loans Recovered from Guarantor's Accounts' listing.",
    temenos: "This report will be appropriately relocated within Transact Explorer in a later release — for now it's accessed via Browser.",
    related: ["tftGRRecoveryConfig", "tftWOReport"],
  },
  tftWOArrangementWriteOff: {
    title: "Write-off Procedure — Arrangement, Balances & Bills",
    simple: "Arrangement Write-off is supported by the Balance Maintenance Property class, with three distinct write-off functions: write off the whole arrangement (both current and due balances), write off only balances (issued bills remain), or write off only bills (current balances remain) — actioned via the 'New Activity' link's Balance Maintenance options.",
    example: "New Activity list includes Balance Maintenance options: Adjust Balances and Bills, Adjust arrears Balance Maintenance, Adjust Balances, Adjust Bills, Write-off Balance Maintenance, Write Off Arrangement, Write Off Balances, Write Off Bills. Selecting 'Write Off Arrangement' presents Arrangement Activity (Activity: Write Off Arrangement, Effective Date) and Balance Adjustment (Adjust Property, Adjust Balance Type, Original Balance Amount, New Balance Amount 0.00, Write Off amount) screens.",
    why: "The three options exist because a bank might want to write off a genuinely dead loan entirely, versus keeping any already-issued bills on record for collection purposes while just writing off the underlying balances, versus the reverse.",
    how: "Contra entries from a write-off post to the category code defined in AC.ALLOCATION.RULE — a write-off category must be defined for every payment property in the allocation rules, and the same category code should be parameterised for provisioning, so write-off and provision stay aligned in the general ledger.",
    memory: "Write off Arrangement = everything (current + due). Write off Balances = current only, bills survive. Write off Bills = issued bills only, current balances survive.",
    temenos: "Once written off, the arrangement's Status shows Closed (or Pending Closure); the write-off activity requires approval before it takes final effect, exactly like a top-up or reschedule.",
    related: ["tftWOCustomerAccountUpdates", "tftLMClosure"],
  },
  tftWOCustomerAccountUpdates: {
    title: "Arrangement Write-off — Customer & Account Updates",
    simple: "Customer records with any written-off loan are flagged (AA Loans Written Off = Yes); the underlying account is flagged Financial Write Off if a provision amount already existed against it, or simply Write Off otherwise.",
    example: "Customer record for Lucy Xemas: AA Loans Written Off field set to 'Yes'. AA.ARR.ACCOUNT record for the written-off arrangement shows Ref Status 'Financial Write Off' with Local Ref 1 'Write Off'.",
    why: "Flagging the customer (not just the account) makes it immediately visible on the customer's own record that they have a write-off history — useful context for any future lending decision, without needing to dig through their full account list.",
    how: "Which flag the account gets — Financial Write Off vs plain Write Off — depends purely on whether a provision amount existed against that account at the time of write-off, not on any other factor.",
    memory: "Customer flag: 'AA Loans Written Off' = Yes. Account flag: 'Financial Write Off' (had provision) vs 'Write Off' (didn't).",
    temenos: "This is a passive, informational flag — it doesn't itself block further transactions, though other controls (like the WOF Customers with Credit Balances Report) exist to actively surface related situations.",
    related: ["tftWOArrangementWriteOff", "tftWOReport"],
  },
  tftWOReport: {
    title: "Loans Written Off Report",
    simple: "This report, reached via Home Pages > Credit Manager > Loans Written Off, lists every written-off loan with its write-off amount, loan balance at write-off, days in arrears up to the write-off date, and the provision amount as at write-off — displayable per Account Officer or per Group.",
    example: "Loans Written Off list: Customer Mrs Anne Kioko, Officer 20, Loan Account 1000000775, Loan Amount 7,000.00, Date Disbursed 04 NOV 2025, WOF Date 18 NOV 2025, WOF Full Amount 6,376.80, WOF Type Arrangement, Outstanding Balance 0.00, Arrears/PIC 0.00, Days in Arrears 0, Provision Amt 0.00.",
    why: "Showing the provision amount as at write-off alongside the write-off figure lets the bank see exactly how much of the write-off had already been provisioned for versus how much hits P&L fresh at the moment of write-off.",
    how: "WOF Type distinguishes what was actually written off (e.g. 'Arrangement' for a full write-off), matching the three Balance Maintenance write-off functions covered earlier.",
    memory: "One-stop report for everything a write-off needs recorded: amount, balance, arrears history, and provision at the moment it happened.",
    temenos: "Path: Home Pages > Credit Manager > Loans Written Off — same Credit Manager home page used for the Provision and CGAP reports.",
    related: ["tftWOArrangementWriteOff", "tftWOCustomerAccountUpdates"],
  },

  // ---- Section 7: Loan Recovery ----
  tftLRecOverview: {
    title: "Loan Recovery — Contingent Accounts & WOF Recovery Parameters",
    simple: "After a loan is written off, the system still provides access to the written-off items via contingent accounts — a customer contingent account (mnemonic W + WOF Loan Account Number + W) warehousing the amounts written off, and a contingent control contra account (per customer or per branch) warehousing the second leg of every write-off.",
    example: "WOF Recovery Parameters / SYSTEM (GIC.BD.PARAMETERS): Recovery Category '54150 – Bad Debt Recovered', Contingent Cust Category '9000 – Customer Contingent Funds', Contingent Internal Category '19001 – Contingent Control Account', Contingent Acct Level 'Branch', Recovery Order 1 'DISBURSEMENTFEE – Disbursement Fee' through Recovery Order 5 'ACCOUNT – Account'.",
    why: "Recovery Category (a P&L category) is where recovered funds are credited as income — separating this cleanly from the original loan income category is what lets a bank track 'money we got back after write-off' as its own distinct figure.",
    how: "Recovery Order defines the sequence in which recovered funds are applied against the written-off balances (e.g. Disbursement Fee, then New Arrangement Fee, then Penalty Interest, then Principal Interest, then Account/Principal last) — balances are maintained property-wise on the WOF loan contingent account, exactly as they were captured in the balance maintenance arrangement condition at the time of write-off.",
    memory: "Contingent Customer Account = W+LoanAcctNo+W, holds the written-off amounts. Contingent Control Account = the contra side, per customer or per branch. Recovery Order = which balance gets paid down first as money comes back in.",
    temenos: "Contingent Acct Level (Customer vs Branch) and Customer Control Acct Category are mutually exclusive with Contingent Internal Category — only one path is configured, matching the chosen level.",
    related: ["tftGRRecoveryConfig", "tftLRecContingentSetup"],
  },
  tftLRecContingentSetup: {
    title: "Contingent Accounts Setup & the Write-off-to-Recovery Process",
    simple: "For contingent accounts to open automatically, an account product must exist whose category falls within the contingent category range on ACCOUNT.PARAMETER, marked Contingent in the CATEGORY table; the whole write-off-to-contingent-account flow runs via the service BNK/EM.WOF.PROCESS.",
    example: "ACCOUNT.PARAMETER / SYSTEM: Cont Desc 1 'Contingent Customer Accounts', Cont Cat Rn 1 9000-9099; Cont Desc 2 'Contingent Internal Accounts', Cont Cat Rn 2 19000-19099. CATEGORY / 9-000: GB Description 'Customer Contingent Funds', Ac Contingent = CONTINGENT.",
    why: "T24 core deliberately does not allow accounting transactions to pass directly between contingent and non-contingent accounts — this separation is precisely what keeps written-off exposure visibly quarantined from a bank's live, performing book.",
    how: "The process fires when a loan write-off activity is authorised: the arrangement is set to PENDING.CLOSURE or CLOSED; BNK/EM.WOF.PROCESS then closes both the AA arrangement and its underlying account, taking two COBs to fully close. It opens the Loan Recovery (Contingent) Account for the customer, using the WOF loan account as its alternate id, shown under category 9000 in SCV's Portfolio tab; if not already present, it opens the matching Control account too (per customer or per branch, per GIC.BD.PARAMETERS). The contingent account is debited and the contingent control account credited. OFS messages generated along the way are logged in a work file, EM.WOF.RECOVERY.WRK, showing results and any failure reasons.",
    memory: "T24 never lets money move directly between contingent and non-contingent accounts. BNK/EM.WOF.PROCESS = the service that closes the old arrangement/account and opens the new contingent one(s), over 2 COBs.",
    temenos: "EM.WOF.RECOVERY.WRK is the place to check first if a contingent account failed to open as expected — it logs the OFS attempt and its failure reason.",
    related: ["tftLRecOverview", "tftLRecAccountUpdate"],
  },
  tftLRecAccountUpdate: {
    title: "Write-off Procedures — Recovery Account Update",
    simple: "Beyond just transferring the total written-off balance to the contingent account, WOF balances are also stored on the account property-wise, exactly as they were contained in the balance maintenance property at the moment of write-off.",
    example: "ACCOUNT / 1000001224: Wof Bal Type 1 'ACCOUNT', Wof Bal Amt 1 -9000; Wof Bal Type 2 'PRINCIPALINT – Principal Interest', Wof Bal Amt 2 -88.63; Wof Bal Type 3 'PENALTYINT – Penalty Interest', Wof Bal Amt 3 -1.68.",
    why: "Keeping the property-wise breakdown (not just one lump written-off total) is what lets the Recovery Order sequence actually apply incoming recovered funds against the right specific balance first, rather than an undifferentiated total.",
    how: "These Wof Bal Type/Amt fields populate directly onto the ACCOUNT record for the newly-opened contingent account, mirroring whatever the arrangement's own balance maintenance property held right before write-off.",
    memory: "The contingent account's balances aren't one number — they're a property-by-property breakdown (Account/Principal, Principal Interest, Penalty Interest…), preserved from write-off time.",
    temenos: "This property-wise detail is exactly what the Recovery Order field (in WOF Recovery Parameters) walks through, one property at a time, as recovered money comes in.",
    related: ["tftLRecOverview", "tftLRecTransactions"],
  },
  tftLRecTransactions: {
    title: "WOF Loan Recovery Transactions",
    simple: "Recoveries against a written-off loan can be made in Cash, Cheque, or Account transfer, via AIO RBHP > Teller > Loan Operations > Deposits into Written off Loan; the loan's written-off account number can be used as an alternate id to directly find the correct contingent recovery account.",
    example: "Cash Deposit Written Off Account / FT/26002/H081V: Customer Details Kioko, Account Balance -4,090.23 GBP, Recovery Account 1000001224, Credit Their Ref RECOVERY, Total Credit Amount GBP1,090.00; Debit side shows the correct Debit Account/Currency/Amount auto-populated based on the debit currency selected.",
    why: "Accounting entries for a cash recovery are two-legged and largely automatic: Dr Cash, Cr Bad Debt Recovered PL Category (recognising the recovery as income), plus a second entry — Dr Contingent Control Account, Cr Customer Contingent Account — posted automatically via OFS, so the officer only ever keys the first (customer-facing) leg.",
    how: "The id of the secondary FT (the automatic second leg) is stored in the PAYMENT.DETAILS field of the primary FT, and vice versa, linking the two transactions together for audit purposes. Once the full written-off amount has been recovered, the recovery (contingent) account is closed; if the control account is maintained at Customer level and there are no other written-off loans left to recover for that customer, the control account closes too.",
    memory: "Deposits into Written off Loan menu = Cash / Cheque / Account transfer. Two-legged posting: customer-facing leg (keyed) + Contingent Control ↔ Customer Contingent leg (automatic via OFS).",
    temenos: "The loan written-off account may be used as an alternate account id to the loan contingent recovery account — keying the original loan account number auto-populates the correct recovery account.",
    related: ["tftLRecAccountUpdate", "tftLRecEntriesIllustration"],
  },
  tftLRecEntriesIllustration: {
    title: "WOF & Recovery Entries — Worked Illustration",
    simple: "A worked example ties the whole write-off and recovery accounting together: writing off a 10,000 loan first reverses the 10,000 provision entry already booked, then opens the contingent accounts at 10,000; recovering 2,000 later reduces the WOF Balance to 8,000.",
    example: "Start WOF: Provision Entries (Dr P&L Categ 10,000, Cr Provision Acct 10,000) reverse via WOF Loan – 10,000 (Dr Provision Acct 10,000, Cr Loan Acct 10,000), simultaneously opening the contingent side (Dr Loan Cont Acct 10,000, Cr Branch Cont Acct 10,000) — WOF Balance now 10,000. Start Recovery: Recover Loan – 2,000 posts Dr Teller Acct 2,000 / Cr P&L Categ 2,000 (the income leg) and Dr Branch Cont Acct 2,000 / Cr Loan Cont Acct 2,000 (the contingent leg) — WOF Balance now 8,000.",
    why: "Reversing the original provision entry at write-off time (rather than leaving it sitting there alongside a new write-off entry) is what keeps the general ledger from double-counting the same expected loss twice.",
    how: "The WOF Balance figure tracked throughout is simply the running total still outstanding on the contingent (written-off) side — it starts at the full written-off amount and decreases by exactly whatever is subsequently recovered.",
    memory: "WOF: reverse the provision, open the contingent pair at the full written-off amount. Recovery: book income + reduce the contingent pair by the recovered amount. WOF Balance = what's still outstanding on the contingent side.",
    temenos: "This illustration ties directly back to the Standard Loan Provisioning material — a provision must exist before it can be reversed at write-off, which is exactly why provisioning and write-off share the same category code configuration.",
    related: ["tftLRecTransactions", "tftPVOverview"],
  },
  tftLRecReversalReports: {
    title: "Reversal & Reporting — Recovery Entries, WOF Reports & Other Enquiries",
    simple: "Recovery entries can be reversed via the transaction reversal version on the menu; the WOF Loan Recovered Report and WOF Customers with Credit Balances Report round out oversight, alongside general Overdues and Closed/Matured Loans reports.",
    example: "WOF Loans Recovered (Credit Manager > Portfolio Monitoring > WOF Loans Recovered): Customer 100001 Mr Mark Kariuki, Loan Account 1000000643, WOF Date 04 NOV 2025, WOF Sum Amount 6,608.86, Recovery Acct 1000000858, Recovered Amt 1,346.00, WOF Amt Balance 5,460.86, Status Open.",
    why: "The WOF Customers with Credit Balances Report exists because a customer with a written-off loan might still hold other accounts in credit — and whenever any transaction is attempted on such an account, the system deliberately displays an override message to alert the user to that customer's write-off history first.",
    how: "Written Off Account Txn Reversal reverses a recovery's debit/credit entries using the same reference (e.g. FT/26002/H081V). Other Enquiries include the Overdues Report (Credit Manager) and the Closed/Matured Loans report (Loan Service Agent), both useful alongside the write-off-specific reports for a full loan-operations picture.",
    memory: "WOF Loans Recovered = tracks recovery progress per loan. WOF Customers with Cr Bal = flags write-off customers who still hold money elsewhere at the bank — with an override warning on any transaction against those accounts.",
    temenos: "Both WOF reports can be displayed per Customer, per Account Officer, or per Group — the same filtering pattern used across the other Credit Manager reports in this material.",
    related: ["tftLRecTransactions", "tftWOReport"],
  },

  // ---- Section 8: Loan Write-off & Recovery Hands-On ----
  tftWORecHandsOn: {
    title: "Hands-On: Top-up, Write-off & Recovery End to End",
    simple: "Four linked practices: Practice 1 tops up an existing loan by USD 1,500 and disburses it; Practice 2 writes off one of the customer's loans via New Activity; Practice 3 observes the newly-opened customer contingent account in SCV; Practice 4 records a WOF loan recovery cash deposit and checks the PL Account Statement.",
    example: "Practice 1 solution: before top-up, Total Commitment 8,500.08, Available Commitment 0, Term 12M (Medical loan); Loan Input / DL2600280293 processes a Topup of 2,000.00 with Notes 'Topup of 2,000 and new term of 18 weeks as agreed with customer'; after authorisation and disbursement (AA Loan Disbursement, LCY Disbursement Amount 2,000.00), Total Commitment becomes 10,500.00, Available Commitment 2,000.00, Term unchanged at 12W.",
    why: "Running Top-up → Write-off → Observe → Recover as one connected sequence on the same or related loans is what makes the full lifecycle concrete — money going in (top-up), a loan going bad (write-off), the resulting contingent bookkeeping (observe), and money coming back (recovery).",
    how: "Practice 2 solution: Arrangement Overview > New Activities > Balance Maintenance > Write Off Arrangement, on an arrangement already showing Non-Accrual status; committing raises a Pending Approval item, and once approved the arrangement shows Status 'Closed', with Write Off details itemising Account (Current/Billed), Principal Interest (Current/Billed), Ageing Bill Fee and Penalty Interest. Practice 3 solution: the customer's Accounts (AC) list now shows a new 9000-category 'Customer Contingent Funds' account, e.g. 1000001232, with an Available Balance matching the written-off amount. Practice 4 solution: Cash Deposit Written Off Account posts a recovery (e.g. GBP 224.41) crediting the recovery account 1000001232; the accounts list confirms the reduced balance, and a PL Account Statement filtered to Category 54150 'Bad Debt Recovered' shows the recovered amount posted on the value date.",
    memory: "Top-up (money in) → Write-off (loan goes bad, arrangement closes, contingent account opens) → Observe (confirm the contingent account exists with the right balance) → Recovery (cash deposit reduces the contingent balance, income posts to category 54150).",
    temenos: "Practice 4's PL Account Statement check (Category = the Recovery Category from WOF Recovery Parameters, Booking Date = today) is the fastest way to confirm a recovery actually posted as income, separate from checking the contingent account balance itself.",
    related: ["tftLMTopupReschedule", "tftWOArrangementWriteOff", "tftLRecContingentSetup", "tftLRecTransactions"],
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
  daohierarchy: {
    title: "DAO Code Hierarchy", caption: "Officer codes are banded by organisational level; each level's Parent Level rolls it up to the one above.",
    steps: [
      { label: "Head Office", sub: "e.g. code range 1000–1999", tag: "DEPT.ACCT.OFFICER" },
      { label: "Provinces / Regions", sub: "e.g. 2000–2999, parent level = Head Office" },
      { label: "Branch", sub: "e.g. 3000–3999, parent level = its Province" },
      { label: "Department", sub: "e.g. 4000–4999, parent level = its Branch" },
      { label: "T24 Users / General Staff", sub: "e.g. 5000–6999 — individual officer codes, parent level = their Department" },
    ],
  },
  loflow: {
    title: "Loan Origination Flow", caption: "EM.LO.APPLICATION runs a loan from application to a ready-to-disburse loan; each stage is Required, Optional or Not Required per the product.",
    steps: [
      { label: "Application Input", sub: "customer, product, amount, term, frequency, purpose; disburse/repay/charge accounts", tag: "EM.LO.APPLICATION" },
      { label: "Eligibility Check", sub: "run the product's rules against the borrower — pass/fail per rule" },
      { label: "Guarantor Input", sub: "add existing-customer guarantors (amount locked) or new external guarantors" },
      { label: "Collateral Input", sub: "record security — type, code, and the value stack (nominal / execution / …)" },
      { label: "Credit Assessment", sub: "analyst recommendation: Approve / Decline / Wait" },
      { label: "Review / Approval", sub: "approved amount / term / rate vs applied; decision by" },
      { label: "Offer Production", sub: "produce offer documents; set repayment start" },
      { label: "Loan Creation", sub: "commit — the live loan is created, ready to disburse" },
    ],
  },
  doflow: {
    title: "Deposit Origination Flow", caption: "EM.DO.APPLICATION runs a term deposit from application to a live deposit; each stage is Required, Optional or Not Required per the DO parameters.",
    steps: [
      { label: "Application Input", sub: "product, amount, term, rate; maturity instruction & rollover type", tag: "EM.DO.APPLICATION" },
      { label: "Review / Approval", sub: "approved amount / term / rate vs applied; decision by" },
      { label: "Offer Production", sub: "funding date; fund from an Account or by Cash; payout account; documents" },
      { label: "Deposit Creation", sub: "commit — the live deposit arrangement is created" },
    ],
  },
  aoflow: {
    title: "Account Origination Flow", caption: "EM.AO.APPLICATION runs an account from capture to creation; each stage is Required, Optional or Not Required per the Account Origination parameters.",
    steps: [
      { label: "Application Input", sub: "capture the request — from the SCV or Role Based Accounts Page", tag: "EM.AO.APPLICATION" },
      { label: "Review / Approval", sub: "a second party checks and approves — status 201 Approved" },
      { label: "Update Customer", sub: "(optional / not-required stage) top up the customer record" },
      { label: "Offer Production", sub: "produce offer documents — status 701" },
      { label: "Arrangement Creation", sub: "the live account (arrangement + account id) is created — status 901" },
    ],
  },
  acctclosureflow: {
    title: "Account Closure Flow", caption: "Closing an AA account — dry-run the figure, produce the statement, settle the balance, then close it for real.",
    steps: [
      { label: "Calculate Payoff", sub: "simulation (id AASIM…) — set Closure Reason + Payoff Date", tag: "PAYOFF$CURRENT" },
      { label: "Accept overrides", sub: "e.g. 'settlement instruction not defined for PAYOFF$CURRENT'" },
      { label: "Simulation executes", sub: "Simulation Status: Processing → Executed - Successfully" },
      { label: "Closure Statement", sub: "the payoff amount, itemised by property" },
      { label: "Choose Closure Method", sub: "Funds Transfer · Cash · Draft · Official Cheque · Payment Order · Write-Off to P&L" },
      { label: "Perform Closure (Live)", sub: "from the account Overview → Facilities and Conditions" },
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
    id: "lab-daocode", courseId: "fif", section: "fif-2",
    title: "Create a new Officer Code (DAO)",
    goal: "Add a new account-officer code in the right place in the DAO hierarchy.",
    app: "DEPT.ACCT.OFFICER", menu: "Admin Menu > (Account Officer / DAO setup)",
    prereq: "Know which Branch/Department the new officer sits under, and the next free code in that range.",
    steps: [
      { do: "Open DEPT.ACCT.OFFICER and review the existing hierarchy — Head Office, Provinces, Branch, Department ranges.", expect: "Each level has its own code range (e.g. 1000s Head Office, 2000s Provinces, 3000s Branch, 4000s Department)." },
      { do: "Pick the next free code inside the correct range for the new officer's level.", expect: "Codes are not reused across levels — a Branch code must come from the Branch range, not the Department range." },
      { do: "Set the Parent Level to the code of the Branch/Department the officer reports into.", expect: "This is what rolls the new officer's MIS up into their branch and province." },
      { do: "Commit and authorise the new officer code.", expect: "Status INAU until a supervisor authorises; then LIVE." },
    ],
    verify: "The new officer code appears under the correct parent in the hierarchy, and can be assigned as a customer's DAO.",
    related: ["dao"],
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
    note: "Applying a Credit Block to a member sets the BLOCKED field on that customer. Verified environment: the Financial Inclusion module (this GROUP app, dividends, payment obligations) runs on the FI Transact build, not the classic Model Bank — the classic build only has 'Customer Group' hierarchy, which is a different thing.",
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
    note: "FI module only — EB.ALERT.REQUEST, EM.PS.OBLIGATION.INPUT and EM.PS.PAYMENT.SPLIT are not in the classic Model Bank; run this on the FI Transact build.",
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
    note: "FI module only — EM.DIVIDEND.RUN is not in the classic Model Bank; run this on the FI Transact build.",
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
    note: "FI module only — SG.BA.CHANGE.DAO and the FI File Upload path are not in the classic Model Bank; run this on the FI Transact build.",
    related: ["dfe", "fileuploadproc", "fileuploadtables", "bulkao"],
  },
];

// ---- Practice Lab: scenario-based configuration exercises, straight from the
// trainer decks' "Practice N" hands-on slides — a business requirement list,
// then the worked solution as it actually appears on the "Practice N - Solution"
// slide. Different from LABS (click-path sandbox drills) and from quiz (recall
// MCQs about the process) — this is "translate requirements into configuration."
const SCENARIOS = [
  {
    id: "scn-loanOriginParams", courseId: "tft-day3", section: "tftD3-4", image: "scn-loanOriginParams",
    title: "Configure: Loan Origination Parameters",
    source: "03-3.1 Hands-on – Common Origination Parameters, Practice 1 (Loans)",
    brief: "Using the product you created in Product Builder, configure loan origination parameters via Administration > Products > Loan Origination > Manage Origination.",
    requirements: [
      "Group loan processing is enabled.",
      "Group loan amount and term are always even among group members.",
      "SLA breaches are escalated to the operations manager.",
      "Loan applications would expire after 2 days of inactivity.",
      "All origination stages are required except for Collateral Input, which is optional, and Credit Check, which is not required.",
      "Loan applications are allowed for customers with delinquent and written-off loans, with overrides.",
      "Checklist items are set up for the Application Input, Credit Assessment and Review/Approval stages.",
    ],
    solution: [
      { field: "General Parameters — Group Allow", value: "Yes" },
      { field: "General Parameters — Group Amount", value: "Flexible", note: "Divides evenly by default but still allows user redistribution — matches 'always even among group members.'" },
      { field: "General Parameters — Group Term", value: "Flexible" },
      { field: "General Parameters — Expiry Before/After Approval", value: "5 / 2 days" },
      { field: "General Parameters — Allow Delinquent / Allow Written Off", value: "Yes / Yes", note: "With override messages, since overrides were required rather than an outright block." },
      { field: "Workflow Parameters — Stage Option, Collateral Input", value: "Optional" },
      { field: "Workflow Parameters — Stage Option, Credit Check", value: "Not Required" },
      { field: "Workflow Parameters — every other stage", value: "Required" },
      { field: "SLA Parameters — SLA Escalation", value: "A PW.PARTICIPANT record for the Operations Manager role" },
      { field: "Loan Stage Checklist — Application Input", value: "Item 1 'Positive Identification' + Item 23 'Declaration of Health', applicable to Main Holder, Group Member, Joint Holder, and both Guarantor types" },
      { field: "Loan Stage Checklist — Credit Assessment & Review/Approval", value: "Checklist items configured at those stages too, following the same Loan Stage Checklist pattern" },
    ],
    memory: "Group Amount/Term = Flexible for 'shared evenly, changes allowed.' Blank Stage Option = Required by default — only Collateral Input and Credit Check deviate from that.",
    related: ["tftORLDAParams", "tftORWorkflowSLA", "tftORChecklist", "tftORHandsOn"],
  },
  {
    id: "scn-depositOriginParams", courseId: "tft-day3", section: "tftD3-4", image: "scn-depositOriginParams",
    title: "Configure: Deposit Origination Parameters",
    source: "03-3.1 Hands-on – Common Origination Parameters, Practice 2 (Deposits)",
    brief: "Using the deposit product you created in Product Builder, configure deposit origination parameters via Administration > Products > Deposit Origination > Manage Origination.",
    requirements: [
      "Application is permitted for prospect customers.",
      "Proof of funds is required for deposit amounts from USD 50,000 and above.",
      "An override message is to be displayed if the user amends the defaulted deposit term.",
      "If the deposit amount is within the approval limit of the origination user, the approval stage is to be skipped.",
      "SLA breaches are escalated to the branch operations manager.",
      "Deposit applications would expire after 3 days of inactivity.",
    ],
    solution: [
      { field: "General Parameters — Prospects Allowed", value: "Yes" },
      { field: "Checklist item 'Evidence of Funds' (GIC.CHECKLIST.MASTER)", value: "Applicable Amount: USD 50,000 (worked example also carried a GBP 40,000 threshold for that currency)", note: "This is what actually triggers proof-of-funds documentation once the deposit reaches the threshold." },
      { field: "Deposit Stage Checklist — Application Input", value: "Item 1 'Positive Identification' + Item 24 'Evidence of Funds', applicable to Main Holder and Joint Holder" },
      { field: "General Parameters — Term Change Break-Rule", value: "Override" },
      { field: "General Parameters — Skip Approval for Authorized Users", value: "Yes", note: "REVIEW.APPROVAL is then never marked Required — it's skipped whenever the amount is within the current user's own approval limit." },
      { field: "SLA Parameters — SLA Escalation", value: "A PW.PARTICIPANT record for the Branch Operations Manager role" },
      { field: "General Parameters — Expiry After Approval", value: "3 days" },
    ],
    memory: "Proof-of-funds threshold lives on the checklist item (GIC.CHECKLIST.MASTER Applicable Amount), not on the parameters table itself. Skip Approval for Authorized Users = Yes → approval never forced, only ever skipped when in-limit.",
    related: ["tftORLDAParams", "tftORChecklist", "tftORHandsOn"],
  },
  {
    id: "scn-creditScoreCard", courseId: "tft-day3", section: "tftD3-7", image: "scn-creditScoreCard",
    title: "Configure: A Personal Loan Credit Score Card",
    source: "03-5.1 Hands-on – Credit Scoring Parameters, Practice 1",
    brief: "Using seven named data types, set up credit scoring for your loan product so the total obtainable score is 100 and the recommended limit never exceeds the maximum amount the product allows.",
    requirements: [
      "Data types to use: Age, Gender, MaritalStatus, NetIncome, NoOfGuarantors, TotalCountArrears, StressRatio.",
      "The total obtainable score across the whole score card must be exactly 100.",
      "The recommended limit at the top score band must not exceed the maximum amount grantable under the product.",
    ],
    solution: [
      { field: "Score Data ('PersonalLoan')", value: "All seven data types listed, each linked to its SA.DATA.TYPES record (Age, Gender, MaritalStatus, NetIncome, NoOfGuarantors, TotalCountArrears, StressRatio)" },
      { field: "Score Card — Age", value: "Under 18 scores -100 (guaranteed fail against the 100-point total); 18–65 scores a solid positive weight" },
      { field: "Score Card — Gender, MaritalStatus, NetIncome, NoOfGuarantors, TotalCountArrears, StressRatio", value: "Each assigned its own weighted score per value/range, all combined with AND across data types and OR across each data type's own value ranges, so the achievable total sums to 100" },
      { field: "Score Limit ('PersonalLoan')", value: "Upto Score 49 → Rec Limit 0.00; Upto Score 50 → 5,000.00; Upto Score 70 → 7,000.00; REST → 10,000.00" },
      { field: "Verification", value: "The top Rec Limit band (10,000.00) was checked against the underlying loan product's own Term/Amount conditions to confirm it doesn't exceed what the product allows to be disbursed" },
    ],
    memory: "-100 for a disqualifying condition (age <18) is the standard 'guaranteed fail' trick against a 100-point total. AND combines across data types; OR combines within one data type's value ranges.",
    related: ["tftCSTables", "tftCSScoreCard", "tftCSScoreLimitTxn", "tftCSHandsOn"],
  },
  {
    id: "scn-autoLoans", courseId: "tft-day2", section: "tftD2-4", image: "scn-autoLoans",
    title: "Configure: Auto Loans (Business Loan Product)",
    source: "02-4.1 Hands-on – Loan Product Builder, Practice 1",
    brief: "Build a full business loan product — 'Auto Loans' — end to end via the FI product builder wizard, under Product Group 'Business' with no inheritance.",
    requirements: [
      "Product Group: Business (Product Parent: Default — no inheritance).",
      "Name 'Auto Loans', description 'Loans for vehicles used for commercial businesses,' category 3202, currency USD, start date set to today.",
      "No joint ownership; accounts default to the name 'Auto Loans'; contract anniversary from the Start date; Forward Same Month date convention, negotiable; payment dates adjust by Period.",
      "Limit processing applies, with a Variable secured limit and Default limit type.",
      "Default term 36 months, negotiable between 12 months (Error) and 48 months (Override); amount negotiable between 2,000 (Override) and 10,000 (Override); no tranches, not revolving.",
      "Full disbursement, not automatic on authorisation but negotiable; weekly repayment frequency, negotiable; Constant repayment type; prepayment recalculates the term.",
      "Reducing-balance principal interest on Current + Overdue Principal Balance, Fixed rate 10% negotiable between 7% (Error) and 15% (Override); a new penalty interest condition at a fixed, non-negotiable 2%.",
      "Loan Processing Fee (fixed 15, non-negotiable, tied to New Arrangement) and Disbursement Fee (calculated at 0.50 on the transaction, tied to Disbursement); Maintenance, Payoff and Principal Decrease fees not applicable.",
      "Automatic partial repayment and charge collection from account category 6001; ageing tracked in days with a 2-day grace period, 15-day delinquent threshold, and weekly chaser notices.",
      "Payoff bills expire after 3 days with dues treated as settled; automatic closure 3 days after balance reaches zero.",
      "Eligibility: both Individual and Non-Individual customers, age 18 (Error) to 70 (Error), minimum 3-month customer/savings history (Override); initial deposit of 15% of the loan amount blocked on the customer's account, with progressive release and partial blocking as funds become available.",
    ],
    solution: [
      { field: "Product Settings", value: "Product Group Business; Product Parent 'Default – Default parent – no inheritance'" },
      { field: "Product Details", value: "Name Auto Loans; Description 'Loans for vehicles used for commercial businesses.'; Category 3202 – Auto Loans; Currency USD; Start Date set to build date" },
      { field: "Customer/Account", value: "Joint Ownership Allowed No; default account Name 'Auto Loans'; Base Date Type Start; Convention Forward Same Month, Negotiable Yes; Date Adjustment Period" },
      { field: "Limit", value: "Use Limit Yes; Secure Limit Variable; Limit Type Default" },
      { field: "Term/Amount — Term", value: "Default Term 36M; Negotiable Yes; Minimum 12M/Error; Maximum 48M/Override" },
      { field: "Term/Amount — Amount", value: "Negotiable Yes; Minimum 2,000/Override; Maximum 10,000/Override; Tranches No; Revolving No" },
      { field: "Payment Schedule", value: "Disbursement Type Full; Automatic Disbursal No (Negotiable Yes); Repayment Frequency Weekly (Negotiable Yes); Repayment Type Constant; Prepayment Action Recalculate Term" },
      { field: "Principal Interest", value: "Reducing Balance on Current + Overdue Principal Balance; Fixed 10%, Day Basis E, Accrual Rule LAST; negotiable 7%/Error to 15%/Override" },
      { field: "Penalty Interest", value: "Calculate Yes; Create New condition 'AutoLoans'; Fixed 2%, not negotiable" },
      { field: "Charges", value: "Loan Processing Fee — Activity/New Arrangement, Fixed 15, not negotiable. Disbursement Fee — Activity/Disbursement, Calculated, rate 0.50 on Transaction, not negotiable. Maintenance/Payoff/Principal Decrease Fee — Not Applicable" },
      { field: "Settlement", value: "Disbursal Category 6001; Automatic Repayments Yes, Repayment Rule Partial (negotiable), Repayment Category 6001; Charge Collection uses the same rules, Automatic, Partial, Collection Category 6001" },
      { field: "Overdue", value: "Ageing Type Days; Bill Settlement Bill Total; Grace 2 days; Delinquent 15 days, weekly chaser notices; Non-Accrual (NAB) at 21 days with twice-weekly notices" },
      { field: "Payoff/Closure", value: "Payoff Expiry Days 3, Settle Dues Yes; Closure Method Automatic, Closure Type Balance, Closure Period 3D, Posting Restriction 90" },
      { field: "Eligibility", value: "Customer Type Both; Age 18/Error to 70/Error; Minimum Customer Period & Minimum Saving Months both 3M/Override; Initial Deposit: Product-driven, 15% of loan amount, Breakage Action Error, Progressive Release Yes, Partial Blocking Allowed with Increase on Fund Availability" },
      { field: "Publish", value: "Proof then Publish, Direct Publish Yes — Proof and Publish Monitor confirms 'Completed Successfully'" },
    ],
    memory: "Product Parent 'Default – no inheritance' means every condition is built fresh — nothing inherited from a shared parent.",
    related: ["tftLPCore", "tftLPTermAmt", "tftLPInterest", "tftLPCharge", "tftLPEligibility", "tftLPHandsOn"],
  },
  {
    id: "scn-autoLoansAmend", courseId: "tft-day2", section: "tftD2-4", image: "scn-autoLoansAmend",
    title: "Amend: Auto Loans Term/Amount Conditions",
    source: "02-4.1 Hands-on – Loan Product Builder, Practice 2",
    brief: "Using Administration > Products > Loan Products > Classic Product Builder > Product Conditions, amend the published Auto Loans product's Term/Amount (TERM.AMOUNT) condition directly in AA — the post-publish maintenance route, since the wizard itself is create-only.",
    requirements: [
      "Increase the maximum product term.",
      "Set a default product amount.",
    ],
    solution: [
      { field: "TERM.AMOUNT — MAXIMUM (amount restriction)", value: "15,000, Override — raised from the original 10,000" },
      { field: "TERM.AMOUNT — MAXPERIOD (term restriction)", value: "48M, Override" },
      { field: "TERM.AMOUNT — MINPERIOD (term restriction)", value: "12M, Error (unchanged)" },
      { field: "TERM.AMOUNT — MINIMUM (amount restriction)", value: "2,000, Override (unchanged)" },
      { field: "TERM.AMOUNT — Amount", value: "10,000 — the newly set default product amount" },
    ],
    memory: "This is the AA Core product builder route — matches the concept that Term/Amount can only be changed post-publish via the Classic Product Builder, not the wizard.",
    related: ["tftLPMaintain", "tftLPTermAmt", "tftLPHandsOn"],
  },
  {
    id: "scn-targetSavings", courseId: "tft-day2", section: "tftD2-7", image: "scn-targetSavings",
    title: "Configure: Target Savings",
    source: "02-5.1 Hands-on – Savings Plans Product Builder, Practice 1",
    brief: "Your client has presented you with the following set of requirements for their new Target Savings product, to be introduced in the market as soon as possible. Configure the product using the FI product builder.",
    requirements: [
      "Regular deposit between 100 and 1000 biweekly for a fixed term of 18 months. The customer may cancel the contract free of penalties during the first 5 days.",
      "The product attracts a fixed but non-negotiable interest rate of 2%. Interest is to be paid out every month, subject to withholding tax. Alternate interest is not applicable.",
      "For regular and timely deposits, a bonus of 0.5% will be paid out on maturity date on condition that no more than 2 deposit payments become overdue. Else, bonus is to be waived.",
      "If the deposit contract is terminated before maturity date, an early redemption fee of 1% of the deposit amount will be applied.",
      "Partial withdrawals may be allowed at USD 10 per withdrawal.",
      "For every missed payment, a penalty of USD 5 is applicable. An expected payment will be considered overdue if late for 2 days.",
      "The deposit is to be funded manually through cash, cheque or account transfers but interest, fees and other proceeds are to be paid out automatically.",
      "Deposit accounts to be closed automatically 3 days after zero balance.",
    ],
    solution: [
      { field: "Product Settings", value: "Name TargetSav; Notice Processing unchecked; Description 'Target Savings'; Category 6500 – Target Sav; Currency GBP" },
      { field: "Customer/Account", value: "Base Date Type Agreement; Convention Forward, not negotiable; Date Adjustment Period" },
      { field: "Term/Amount — Term", value: "Default Term 18M, Negotiable No; Cooling Period 5D", note: "Req. 1 — fixed 18-month term, 5-day free cancellation." },
      { field: "Term/Amount — Amount", value: "Negotiable Yes; Minimum 100/Override; Maximum 1000/Override", note: "Req. 1 — deposit between 100 and 1000." },
      { field: "Payment Schedule — Savings Plan Settings", value: "Deposit Frequency Bi-weekly, Negotiable Yes", note: "Req. 1 — biweekly deposits." },
      { field: "Deposit Interest", value: "Calculation Source CURACCOUNT; Fixed rate 2%, Rate Negotiable No; Day Basis E, Accrual Rule FIRST", note: "Req. 2 — fixed, non-negotiable 2%; no floating/alternate interest defined." },
      { field: "Payment Schedule — Interest & Bonus Settings", value: "Interest Method Pay, Interest Frequency Monthly, Frequency Negotiable Yes; Bonus method Pay", note: "Req. 2 — interest paid out monthly." },
      { field: "Tax", value: "Applied Yes; Tax Property CRINTEREST; Tax Condition WHT", note: "Req. 2 — interest subject to withholding tax." },
      { field: "Charge — BONUS", value: "Charge Link Schedule, Date Maturity Date; Calculated, Calculation Source Deposit Amount, Rate 0.5", note: "Req. 3 — 0.5% bonus paid at maturity." },
      { field: "Charge — BONUSRESTRICT", value: "Charge Link Restriction, Restriction 'Maximum No. Of Delinquent Payments', Number 2, Charge Action Waive", note: "Req. 3 — bonus waived once more than 2 payments are overdue." },
      { field: "Charge — PRECLOSUREFEE", value: "Charge Link Restriction, Restriction 'Early Redemp. After Cooling Period'; Calculated, Calculation Source Deposit Amount, Rate 1", note: "Req. 4 — 1% early redemption fee." },
      { field: "Charge — WITHDRAWALFEES", value: "Charge Link Restriction, Restriction 'Withdrawal After Cooling Period'; Fixed, Charge Amount 10", note: "Req. 5 — USD 10 per partial withdrawal." },
      { field: "Charge — DEPAGEINGFEE", value: "Charge Link Activity, Linked Activity Overdue Payment; Fixed, Charge Amount 5", note: "Req. 6 — USD 5 penalty per missed payment." },
      { field: "Overdue", value: "Delinquent Days/Bills 2", note: "Req. 6 — late by 2 days = overdue." },
      { field: "Settlement — Deposit Payout", value: "Automatic Payout Yes, Negotiable Yes, Payout Category set", note: "Req. 7 — proceeds paid out automatically." },
      { field: "Settlement — Deposit Funding", value: "Automatic Funding No, Negotiable Yes, Funding Rule None", note: "Req. 7 — funded manually (cash/cheque/transfer), not auto-funded." },
      { field: "Closure", value: "Closure Method Automatic; Closure Type Balance; Closure Period 3D", note: "Req. 8 — auto-closed 3 days after zero balance." },
    ],
    memory: "Charge conditions map 1:1 onto the 8 requirements — Bonus/BonusRestrict = req 3, PreclosureFee = req 4, WithdrawalFees = req 5, DepAgeingFee = req 6. Deposit Funding ≠ Deposit Payout — this product is manually funded but automatically paid out.",
    related: ["tftDSSavingsPlan", "tftDSCharge", "tftDSPaySchedOverdue", "tftDSHandsOn"],
  },
  {
    id: "scn-tangerineSavings", courseId: "tft-day2", section: "tftD2-7", image: "scn-tangerineSavings",
    title: "Configure: Tangerine Savings",
    source: "02-6.1 Hands-on – Account Product Builder & Overdraft Facilities, Practice 2",
    brief: "Your client has presented you with the following set of requirements for their new Tangerine Savings product, to be introduced in the market as soon as possible. Configure the product using the FI product builder. (Worked solution shown under a demonstration product, 'Standard Savings'.)",
    requirements: [
      "A voluntary savings account designed for the discerning saver looking to grow their savings. Available to individuals and joint account holders aged 18–65.",
      "USD 100 minimum balance. If the balance falls below USD 100 at any time, a charge of 0.5% is assessed on the account.",
      "Three quarterly withdrawals allowed on demand. Interest is waived if more than 3 withdrawals occur in a quarter. Account must never be overdrawn.",
      "Account is considered dormant if no customer transactions for 12 months. Dormant accounts attract a monthly fee of USD 20. The system should generate chaser advices after 5 days of dormancy, and thereafter monthly.",
      "Attractive interest rates — central bank rate +0.5% margin for the first USD 1,000 and +1% for the remaining balance. Interest is added to the same account monthly and is subject to withholding tax. These conditions are non-negotiable.",
      "No other ledger or account maintenance fees.",
      "Statements available on a quarterly basis.",
    ],
    solution: [
      { field: "Product Settings", value: "Account type Savings Account; Description Standard Savings; Category 6004; Currency GBP" },
      { field: "Customer/Account", value: "Base Date Type Agreement; Convention Calendar; Generate IBAN No; Passbook No; Balance Availability — Notice Account Product? No", note: "The worked slide shows Joint Ownership 'No' on the demonstration product — for the actual Tangerine Savings requirement (individuals AND joint holders), this should be set to Yes." },
      { field: "Credit Interest", value: "Apply Credit Interest Yes; Floating rate, margin Add; Tier 1 margin +0.5 up to USD 1,000, next tier +1 on the remainder; Tier Type Level; Index and Margin both not negotiable", note: "Req. 5 — tiered, non-negotiable margin over the central bank floating index." },
      { field: "Payment Schedule — Credit Interest", value: "Interest Method Capitalise; Interest Negotiable No; Frequency Every 1 Month(s), not negotiable", note: "Req. 5 — interest added monthly." },
      { field: "Tax", value: "Applied Yes; Tax Property CRINTEREST; Tax Condition WHT", note: "Req. 5 — subject to withholding tax." },
      { field: "Debit Interest", value: "Apply Debit Interest No" },
      { field: "Dormancy", value: "Period 12M; Notice Days 5; Notice Frequency Every 1 Month(s); Charge Frequency Every 1 Month(s)", note: "Req. 4 — dormant after 12 months, first chaser at day 5 then monthly." },
      { field: "Charge — Dormancy Fee", value: "Fixed charge, worked example shows Charge Amount 10", note: "Req. 4 asks for USD 20/month — double-check and adjust this charge amount to 20 to match the actual client requirement; the worked slide's figure is illustrative." },
      { field: "Charge — Minimum Balance Fee (MINBALFEE)", value: "Charge Link Restriction, Restriction 'Account Balance Below Threshold', Value 100, Balance Type Daily Debit Balance; Calculated, Tier Percentage 0.5", note: "Req. 2 — 0.5% charge once balance falls below 100." },
      { field: "Charge Selection", value: "Ledger Charges Applicable No; Closure Fee Not Applicable", note: "Req. 6 — no other ledger/maintenance fees." },
      { field: "Restrictions", value: "Restriction 1 'Minimum Opening Balance', Period Life, Breakage Action Error; Restriction 2 'No Overdraft', Period Life, Breakage Action Error", note: "Req. 3 — account must never be overdrawn." },
      { field: "Eligibility", value: "Minimum Age 18/Error; Maximum Age 75/Error (adjust to 65/Error to match this product's exact age cap)", note: "Req. 1." },
      { field: "Statement", value: "Produce statement Yes; Frequency every 3 months (quarterly); Statement if no movement Yes; Descriptive Statement Yes", note: "Req. 7 — quarterly statements." },
      { field: "Closure", value: "Closure Method Automatic; Closure Type Balance; Closure Period 3D; Online Closure Yes" },
      { field: "Publish", value: "Proof then Publish, Direct Publish Yes" },
    ],
    memory: "Three quarterly withdrawals with interest waived beyond that (req 3) is enforced as a Restriction tied to Credit Interest, not shown in full on the read slides — configure it the same way as the other restriction-linked charges here.",
    related: ["tftAPOverview", "tftAPChargesRestrict", "tftAPAvailDormancy", "tftAPHandsOn"],
  },
  {
    id: "scn-currentOverdraft", courseId: "tft-day2", section: "tftD2-7",
    title: "Configure: Current Account Overdraft Facility",
    source: "02-6.1 Hands-on – Account Product Builder & Overdraft Facilities, Practice 3",
    brief: "Create a new current account product with a separate application workflow to process overdraft facilities, via Administration > Products > Account Products > Product Groups > Current > Create New Product.",
    requirements: [
      "Overdraft limits should permit a minimum of USD 500 and a maximum of USD 5,000, with override messages if the limits are broken.",
      "Set other conditions as desired.",
    ],
    solution: [
      { field: "Facility Origination Parameters", value: "New Facility Origination Parameters record for the current account product's Overdraft facility (id pattern <PRODUCT>-Overdraft-New)" },
      { field: "Minimum Overdraft Limit", value: "USD 500, Breakage Action Override" },
      { field: "Maximum Overdraft Limit", value: "USD 5,000, Breakage Action Override" },
    ],
    memory: "This is the lightest of the three Account hands-on exercises — it only fixes the overdraft's min/max limit, leaving everything else to the consultant's judgement ('set other conditions as desired').",
    related: ["tftAPOverdraftOther", "tftAPHandsOn", "tftORFacilityEligibility"],
  },
  {
    id: "scn-inheritanceGroup", courseId: "tft-day1", section: "tft-4", image: "scn-inheritanceGroup",
    title: "Configure: A Loan Inheritance Group",
    source: "02-1.1 Hands-on – Common Product Parameters, Practice 1",
    brief: "Using Administration > Products > Loan Products (tab) > New Inheritance Group, create a new Inheritance Group record and define its shared conditions via the Shared Condition Builder wizard.",
    requirements: [
      "Create the Inheritance Group record for your assigned practice group (e.g. TrnLoan1, currency GBP).",
      "Define the following shared conditions: Penalty Interest, Settlement, Overdue, Payoff & Closure.",
      "Check the 'Launch Condition Builder' box and follow the on-screen steps to define each of those conditions.",
    ],
    solution: [
      { field: "Inheritance Group Details", value: "Name 'Agric Loans Inheritance'; Description 'Agric Loans Inheritance'; Product Line LENDING; Currencies USD + GBP; Group Start Date set to build date" },
      { field: "Shared Conditions tab — which properties are Define Now vs Define Later", value: "Penalty Interest, Settlement, Overdue, Payoff/Closure = Define Now (built by this wizard); Payment Schedule and Eligibility = Define Later (deferred to the child product)" },
      { field: "Shared Condition Builder — Shared Condition Details", value: "Name AgricLoansInheritance; Currency 1 USD, Currency 2 GBP; Start Date set to build date" },
      { field: "Shared Condition Builder — Penalty Interest", value: "Fixed Rate 2.00, not negotiable" },
      { field: "Shared Condition Builder — Payoff/Closure", value: "Payoff Expiry Days 3; Settle Dues Yes" },
      { field: "Shared Condition Builder — Settlement (Repayment Collection)", value: "Automatic Repayments Yes, negotiable; Repayment Rule Partial, negotiable; Repayment Category 6001" },
      { field: "Shared Condition Builder — Settlement (Charge Collection)", value: "Same Charge Rules as repayment Yes; Automatic Charges Yes, negotiable; Collection Rule Partial, negotiable" },
      { field: "Shared Condition Builder — Overdue (Basic/Grace/Delinquent/NAB)", value: "Ageing Type Days, Bill Settlement Bill Total; Grace 3 days; Delinquent status at 18 days with a chaser notice; Non-Accrual Basis status a few days further out with its own chaser notice", note: "The exact chaser-frequency day codes were too small to read reliably on the source slide — configure them to match your institution's own weekday chaser policy." },
    ],
    memory: "Only items marked 'Define Now' in the Inheritance Group are presented by the Shared Condition Builder workflow — 'Define Later' items (here, Payment Schedule and Eligibility) are deferred to the child product instead.",
    related: ["tftInheritGroup", "tftSharedCond", "tftHandsOn1"],
  },
  {
    id: "scn-productGroups", courseId: "tft-day1", section: "tft-4", image: "scn-productGroups",
    title: "Configure: Loan Product Groups (Inherit vs NoInherit)",
    source: "02-1.1 Hands-on – Common Product Parameters, Practice 2",
    brief: "Using Administration > Products > Loan Products (tab) > New Product Group, create a Loan Product Group with two parent product codes — one that inherits the shared conditions from Practice 1, one that doesn't — then proof and publish.",
    requirements: [
      "Define your Product Group for your assigned practice group (e.g. TrnAgric, category range 3751–3760, currency GBP).",
      "Create two parent product codes: Inherit and NoInherit.",
      "On the Inherit parent, the following conditions are to be inherited: Penalty Interest, Settlement, Overdue, Payoff and Closure — allocate the shared conditions created in the previous exercise.",
      "Proof and publish the record.",
    ],
    solution: [
      { field: "Loan Product Group Details", value: "Name 'Agric Loans'; Description 'Agriculture Loans'; Product Line LENDING; Category range 3400–3448; Currencies USD + GBP; Group Start Date set to build date" },
      { field: "Parent Product Code 1 — Inherit", value: "'Parent with inheritance'; Customer/Account, Limit and Term/Amount all set to Define Now, each pointing at the shared condition (CUSTOMER/OFFICERS/ACCOUNT, LIMIT, TERM/AMOUNT) built in Practice 1" },
      { field: "Parent Product Code 2 — NoInherit", value: "'Parent without inheritance'; Customer/Account, Limit and Term/Amount also Define Now, but with fresh (not shared) conditions — plus Payment Schedule and Principal Interest defined fresh too, since those were 'Define Later' items never built centrally" },
      { field: "Proof & Publish", value: "Run Proof, then Publish, on the AgricLoans product group record" },
    ],
    memory: "Both parents look almost identical in the wizard (Customer/Account, Limit, Term/Amount all 'Define Now') — the real difference is which underlying condition each one actually resolves to: the Inherit parent reuses Practice 1's shared conditions, the NoInherit parent builds its own from scratch.",
    related: ["tftGroupCreation", "tftParentCondTab", "tftProofPublish", "tftHandsOn2"],
  },
  {
    id: "scn-loanApp1", courseId: "tft-day4", section: "tftD4-7", image: "scn-loanApp1",
    title: "Process: An Individual Loan Application End to End",
    source: "04-4.1 Hands-on – Loan Application Processing, Practice 1",
    brief: "Your individual customer has applied for a loan amount under your new loan product and a term within the allowed term range. Using the relevant origination and credit scoring parameters, process the application, view the loan agreement, verify disbursement, and accept overrides where necessary.",
    requirements: [
      "Process the application.",
      "View the loan agreement.",
      "Verify that the loan has disbursed.",
      "Accept overrides where necessary.",
    ],
    solution: [
      { field: "Application Input", value: "Customer 100001 Kariuki, Loan Action New Loan, Loan Product PersonalLoan, Amount Requested 6,500.00, Term 12M, Monthly — override accepted for an existing delinquent loan on the customer, and automatic disbursement was flagged as disabled pending a disbursement account" },
      { field: "Settlement", value: "Repay Account 1000000031 (Current, Indiv); Charge Account 1000000031; Disburse Account left blank at this point" },
      { field: "Checklist", value: "Item 1 'Positive Identification' required a mandatory Item Status before the stage could proceed — an empty status raised a validation error" },
      { field: "Eligibility Check", value: "Minimum Age and Maximum Age both Passed" },
      { field: "Guarantor Input & Collateral Input", value: "Guarantor added (Collins, savings account, amount blocked); Collateral added against the applicant's own collateral id, no pledged shares" },
      { field: "Credit Scoring", value: "Data Types Age, Gender, NoOfGuarantors, NetIncome, TotalCountArrears all defaulted; Agg Score 90" },
      { field: "Credit Assessment", value: "Recommendation Approve, Assessment Notes 'Recommended for approval.'" },
      { field: "Review/Approval", value: "Status 801 Approved; Approval Notes 'Approved as recommended'; Applied Amount 6,500.00 / Approved Amount 6,500.00; Applied Term 12M / Approved Term 12M" },
      { field: "Offer Production", value: "Produce Document 'Loan Application' Yes; Status 901 'Generate offer documents'" },
      { field: "Loan Creation", value: "Repayment Start 06 JAN 2026; Status 911 — loan created" },
      { field: "Verification", value: "Arrangement Overview for 1000001151 GBP Personal Loan: Commitment 6,500.00, Fixed Penalty 2.00% / Principal 10.00%, Constant Repayment schedule, Collateral 'Vehicle for Auto Loans' listed under Limit/Collateral Details. Payment Schedule confirmed 12 monthly instalments of 571.46, reducing Outstanding to 0.00 by 06 DEC 2026." },
    ],
    memory: "The full stage chain in one pass: Input → Settlement/Checklist → Eligibility → Guarantor/Collateral → Credit Scoring → Credit Assessment → Review/Approval → Offer Production → Loan Creation — verify at the end via Arrangement Overview + Payment Schedule.",
    related: ["tftLAInputTabs", "tftLAEligibilityCheck", "tftLACreditAssessment", "tftLAArrangementOverview"],
  },
  {
    id: "scn-loanApp2", courseId: "tft-day4", section: "tftD4-7", image: "scn-loanApp2",
    title: "Process: A Group Loan Application via Bulk Disbursement",
    source: "04-4.1 Hands-on – Loan Application Processing, Practice 2",
    brief: "Using existing parameters for any loan product, originate a group loan for 52 weeks and USD 4,000 per group member, then disburse the loan using the Group Disbursement functionality.",
    requirements: [
      "Originate a group loan for 52 weeks and USD 4,000 per group member, using existing parameters for any loan product.",
      "Disburse the loan using the Group Disbursement functionality.",
    ],
    solution: [
      { field: "Application Input", value: "Customer Type Group, Group Id 000007 'Daytona Teachers', Loan Product EquipmentLoan, Amount Requested 12,000.00, Term 12M (weekly frequency), Margin Rate 1.60, Margin Operand Add" },
      { field: "Group Application Details", value: "Three members (Milosz Czeslaw, Wanda Niemiec, Bobby Brandys) each defaulted to Amount 4,000.00, Term 12M, with their own auto-calculated Instalment" },
      { field: "Eligibility Check", value: "Per-member results: Loan Purpose, Minimum/Maximum Age all Passed; Min Saving Months and Min Customer Period showed Warning (insufficient savings history) — accepted as overrides for each member" },
      { field: "Guarantor Input & Collateral Input", value: "Each member's own guarantor and collateral records added — Guarantor For Member and Applicant's Collateral Id fields kept each member's records distinct" },
      { field: "Credit Assessment", value: "Group Id 000007, Loan Product EquipmentLoan, Recommendation Approve, Assessment Notes 'Recommended for approval'" },
      { field: "Review/Approval", value: "All three Group Members approved as recommended — each with their own Applied/Approved Amount and Term shown vertically" },
      { field: "Offer Production", value: "Produce Document 'Loan Application' set per member (For 1/2/3), each with its own Channel" },
      { field: "Loan Creation", value: "Group Id 000007, Loan Product EquipmentLoan, Repayment Start 05 JAN 2026, Status 911 — all three members' loans created together" },
      { field: "Disbursement — Group Bulk Disbursement", value: "Group Service Agent > Groups > Find '000007 Daytona Teachers' > Meatballs > Disburse Loans; all three members' Arrangement, Risk Account and Amount defaulted; committed to disburse all three loans in one action" },
    ],
    memory: "Group loans repeat the same per-member stage pattern as an individual application, but the final disbursement step is different: one Group Bulk Disbursement action instead of three separate Loan Creation disbursements.",
    related: ["tftLAGroupApplicant", "tftLAEligibilityCheck", "tftLAGroupBulkDisb"],
  },
  {
    id: "scn-provisionOverride", courseId: "tft-day5", section: "tftD5-5", image: "scn-provisionOverride",
    title: "Correct a Manual Loan Classification",
    source: "05-5.1 Hands-on – Standard Loan Provisioning, Practice 2",
    brief: "Using Home Pages > Credit Manager > Provision Details Report, edit the contract used in the earlier workshop and set a Manual Classification with a Reason. Make a note of any error raised. Then, using Home Pages > Credit Manager > Customer Classification, edit the customer record of the same loan asset and set a Manual Classification with a Reason there instead, and authorise the record.",
    requirements: [
      "Edit the Provision Details record used in the earlier workshop; update the field Manual Classification with a desirable value and Reason for Classification with relevant details.",
      "Make a note of the error raised.",
      "Edit the Customer Classification record of the loan asset above; update the field Manual Classification with a desirable value and Reason for Classification with relevant details.",
      "Authorise the record.",
    ],
    solution: [
      { field: "Attempt at Contract level (PV – Asset Details)", value: "Setting Manual Classification to DOUBTFUL fails on commit" },
      { field: "Error raised", value: "\"Manual Classification: INPUT NOT ALLOWED WITH CLASSIFICATION AT CUSTOMER\"", note: "This contract's PV.MANAGEMENT record has Class Level = Customer, so an asset-level override is rejected outright." },
      { field: "Correct route: Customer Classification record", value: "PV Management Id 'AA.LOANS – Provisioning fo…'; Auto Class 'WATCHLIST – 20'; Manual Class set to 'DOUBTFUL – 60' with a Reason entered" },
      { field: "Authorisation", value: "Record submitted for authorisation, then authorised — the manual classification now overrides the automated one for this customer's worst-loan classification" },
      { field: "Verification — Provision Summary Report", value: "Credit Manager > Portfolio Monitoring > Provision Summary now reflects the reclassified totals grouped by Currency and Auto Classification, including Rank, Number of contracts, Loan Outstanding, Base Amt, Posted/Calc. Provision and any Man. Correction" },
    ],
    memory: "Where a contract overrides at the Customer level, only Customer Classification accepts a manual override — PV – Asset Details refuses it with a clear error rather than silently ignoring it.",
    related: ["tftPVManagement", "tftPVClassification", "tftPVHandsOn"],
  },
  {
    id: "scn-loanTopupW5", courseId: "tft-day5", section: "tftD5-8", image: "scn-loanTopupW5",
    title: "Top-up an Existing Loan",
    source: "05-7.1 Hands-on – Loan Write-off and Recovery, Practice 1",
    brief: "Using Home Pages > Credit Officer > New Loan Input, select a loan previously created for your customer, process a Top-Up of USD 1,500 and increase the loan term by between 3 and 6 additional instalments (e.g. from 6M to 9M, or from 24W to 30W), get the record authorised, then disburse the top-up amount to your client.",
    requirements: [
      "Select a loan previously created for your customer.",
      "Process a Top-Up of USD 1,500 and increase the loan term by between 3 and 6 additional instalments — e.g. from 6M to 9M or from 24W to 30W.",
      "Get the record authorised.",
      "Disburse the top-up amount to your client.",
    ],
    solution: [
      { field: "Before top-up (Arrangement Overview)", value: "Total Commitment 8,500.08; Available Commitment 0.00; Term 12M — no headroom left on the existing Medical loan" },
      { field: "Loan Input — Direct Loan", value: "Customer Id 100002 Kioko; Loan Action Topup; For Arrangement pointing at the existing loan (1000000608); Amount Requested 2,000.00; Payment Frequency Weekly; Notes 'Topup of 2,000 and new term of 18 weeks as agreed with customer'", note: "The worked solution used 2,000 as the top-up amount and 18 weeks as the new term — adjust to the exact USD 1,500 / 3–6 extra instalments this exercise specifies." },
      { field: "Authorisation", value: "Record approved, same maker-checker cycle as a new Direct Loan transaction" },
      { field: "AA Loan Disbursement", value: "LCY Disbursement Amount 2,000.00 (adjust to your top-up amount), Value Date set, disbursed to the customer" },
      { field: "After top-up (Arrangement Overview)", value: "Total Commitment increases to 10,500.00; Available Commitment 2,000.00; Term remains at the value entered on Term Requested (unchanged if not amended, or the new total term if changed)" },
    ],
    memory: "Term Requested on a Top-up is always the loan's new TOTAL term, not the number of extra instalments — enter the full new figure, not a delta.",
    related: ["tftLMTopupReschedule", "tftLMCapitalizeArrears", "tftWORecHandsOn"],
  },
  {
    id: "scn-loanWriteOff", courseId: "tft-day5", section: "tftD5-8", image: "scn-loanWriteOff",
    title: "Write Off a Loan Arrangement",
    source: "05-7.1 Hands-on – Loan Write-off and Recovery, Practice 2 & 3",
    brief: "Select one of the loans created in the previous workshops, open the Arrangement Overview, select New Activities, and write off the loan. Then open the Single Customer View of that customer and observe the newly-opened contingent account and its details.",
    requirements: [
      "Select one of the loans created in the previous workshops.",
      "Open the Arrangement Overview, select New Activities, and write off the loan.",
      "Open the Single Customer View of the customer whose loan was written off, and observe the newly opened contingent account.",
      "On the Customer contingent account, drill down to observe the account details.",
    ],
    solution: [
      { field: "Before write-off", value: "Overdue Status 'Non-Accrual Basis'; Accrual Status 'Suspended'; Total Delinquent Balance 898.74; Penalty Interest (Accrued) 1,617.24" },
      { field: "New Activity path", value: "Arrangement Overview > New Activities > Balance Maintenance > Write Off Arrangement" },
      { field: "Arrangement Activity screen", value: "Activity 'Write Off Arrangement', Product/Pricing Selection defaulted, Currency shown" },
      { field: "Approval", value: "Committing raises a Pending Approval item; once approved (via the Meatballs menu's Approve action), the arrangement Status shows 'Closed' (or Pending Closure)" },
      { field: "Write Off details (Additional Details tab)", value: "Account Current 1,617.24 / Billed 432.76; Principal Interest Current 0.00 / Billed 23.88; Ageing Bill Fee Billed 60.00; Penalty Interest Billed 0.43" },
      { field: "Observe — Single Customer View, Accounts (AC)", value: "A new 9000-category 'Customer Contingent Funds' account appears (e.g. 1000001232), Available Balance matching the total written-off amount" },
      { field: "Drill into the contingent account", value: "ACCOUNT record shows Wof Bal Type 1 'ACCOUNT' (e.g. -2200), Wof Bal Type 2 'AGEINGFEE – Ageing Bill Fee' (e.g. -60), Wof Bal Type 3 'PRINCIPALINT – Principal Interest' (e.g. -23.88), Wof Bal Type 4 'PENALTYINT – Penalty Interest' (e.g. -0.43); Condition Group '8 – Contingent Accounts'" },
    ],
    memory: "Write-off balances land on the new contingent account property-wise (Account, Ageing Fee, Principal Interest, Penalty Interest each separately) — not as one lump figure — exactly mirroring the balance maintenance property at the moment of write-off.",
    related: ["tftWOArrangementWriteOff", "tftLRecContingentSetup", "tftLRecAccountUpdate"],
  },
  {
    id: "scn-wofRecovery", courseId: "tft-day5", section: "tftD5-8", image: "scn-wofRecovery",
    title: "Record a WOF Loan Recovery",
    source: "05-7.1 Hands-on – Loan Write-off and Recovery, Practice 4",
    brief: "Using All in One Role RBHP > Teller > Loan Operations > Deposits into Written off Loan > Cash deposit into Written off Loan, record a loan recovery cash deposit and commit the record. Then, using Customers > Search Customer > Single Customer View > Accounts, drill down to the Customer's contingent account and view the updated balances.",
    requirements: [
      "Record a loan recovery cash deposit against the written-off loan.",
      "Commit the record.",
      "Drill down to the Customer's contingent account and view the updated balances.",
    ],
    solution: [
      { field: "Cash Deposit Written Off Account", value: "Customer Details Kioko; Account Balance shown as the current negative contingent balance; Recovery Account (the loan account, used as an alternate id, auto-populates the correct contingent account); Total Credit Amount e.g. GBP 224.41" },
      { field: "Debit side (auto-populated)", value: "Debit Account = teller cash record; Debit Currency GBP; Debit Amount matches the credit amount; Debit Value Date set" },
      { field: "Accounting entries posted", value: "Dr Cash / Cr Bad Debt Recovered PL Category (the income leg, keyed by the officer) — plus an automatic second leg via OFS: Dr Contingent Control Account / Cr Customer Contingent Account" },
      { field: "Observe — Accounts (AC) list", value: "The contingent account's Online Balance and Available Balance both reduced by the recovered amount (e.g. from -2,324.41 to a smaller negative figure)" },
      { field: "Verification — PL Account Statement", value: "Filtered to Category 54150 'Bad Debt Recovered', Booking Date = today: shows the recovered amount posted as a Transfer, with Balance at Period End increased by that amount" },
    ],
    memory: "Two-legged posting on every recovery: the officer only keys the customer-facing Cash/PL leg — the Contingent Control ↔ Customer Contingent leg posts automatically via OFS. Verify income separately via a PL Account Statement on the Recovery Category, not just the contingent account balance.",
    related: ["tftLRecTransactions", "tftLRecAccountUpdate", "tftLRecEntriesIllustration", "tftWORecHandsOn"],
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
  // Yehulu User Training — live-system screenshots + trainer-module page images
  usermaint: "users", usersmsgroup: "smsgroup", spf: "spf",
  enqcommand: "enquiry", custindivnonindiv: "custnonindiv", menufields: "custindiv",
  recordlock: "doc_recordlock", t24command: "command", fieldhelp: "fieldhelp",
  companybranch: "welcome", abbrevgroup: "abbrevacc",
  aaaccount: "aaaccount", aoapplication: "aoapplication", acctrestriction: "acctrestriction",
  acctclosure: "acctclosure", accountdeposit: "deposit", denomination: "denom", tillvault: "tellermenu",
  aa2recordstatus: "aa2recordstatus",
  // Module 1–2: navigation & screen
  signin: "doc_signin", navicons: "doc_navicons", screenbtns: "doc_screenbtns",
  fieldbtns: "doc_fieldbtns", multivalue: "doc_multivalue",
  // Module 3: customer
  custapplication: "doc_custapp", trscv: "doc_scv", custdocs: "doc_custdocs",
  // Module 4: accounts
  acctdormant: "doc_acctdormant", acctoverdraft: "doc_overdraft",
  // Module 5: deposits
  depapplication: "doc_dep_input", depmaturity: "doc_dep_maturity", depfunding: "doc_dep_funding",
  depwithdrawal: "doc_dep_withdrawal", depredemption: "doc_dep_redemption",
  // Module 6: loans
  loanapplication: "doc_loan_input", loanappinput: "doc_loan_input", loaneligibility: "doc_loan_elig",
  loanguarantor: "doc_loan_guar", loancollateral: "doc_loan_collvals", loancreditassess: "doc_loan_credit",
  loandisburse: "doc_loan_disburse2",
  // Module 7: groups
  grouptypes: "doc_group_create", groupcreate: "doc_group_fields", groupmeeting: "doc_group_members",
  groupmembers: "doc_group_members", groupmaintain: "doc_group_memberactions",
  // Module 8: teller
  tellermenu: "doc_headteller", tillmgmt: "doc_tillmgmt", cashmovement: "doc_cashmove",
  tellercash: "doc_cashdep", telleracctransfer: "doc_acctxfer",
  // Course · Temenos Functional Training (TFT) — Day 1
  tftExclusion: "tftExclusion", tftInclusion: "tftInclusion", tftInstitutions: "tftInstitutions",
  tftProduct: "tftProduct", tftTiers: "tftTiers", tftMarkets: "tftMarkets", tftValue: "tftValue",
  tftCustomerNeeds: "tftCustomerNeeds", tftFootprint: "tftFootprint",
  tftPartners: "tftPartners", tftCertExams: "tftCertExams", tftMethodology: "tftMethodology",
  tftPMControl: "tftPMControl", tftDeployment: "tftDeployment",
  tftPBIntro1: "tftPBIntro1", tftPBIntro2: "tftPBIntro2", tftPBWizard: "tftPBWizard", tftPBFlow: "tftPBFlow",
  tftInheritGroup: "tftInheritGroup", tftInheritComponents: "tftInheritComponents", tftSharedCond: "tftSharedCond",
  tftAccessGroups: "tftAccessGroups", tftGroupCreation: "tftGroupCreation", tftGlobalCond: "tftGlobalCond",
  tftParentCondTab: "tftParentCondTab", tftProofPublish: "tftProofPublish",
  tftHandsOn1: "tftHandsOn1", tftHandsOn2: "tftHandsOn2",
  // Course · Temenos Functional Training (TFT) — Day 2
  tftLPCore: "tftLPCore", tftLPCustAcct: "tftLPCustAcct", tftLPLimit: "tftLPLimit",
  tftLPTermAmt: "tftLPTermAmt", tftLPPaySchedule: "tftLPPaySchedule", tftLPInterest: "tftLPInterest",
  tftLPCharge: "tftLPCharge", tftLPSettleOverdue: "tftLPSettleOverdue", tftLPPayoffClose: "tftLPPayoffClose",
  tftLPEligibility: "tftLPEligibility", tftLPReviewPublish: "tftLPReviewPublish", tftLPMaintain: "tftLPMaintain",
  tftLPHandsOn: "tftLPHandsOn",
  tftDSOverview: "tftDSOverview", tftDSInherit: "tftDSInherit", tftDSSavingsPlan: "tftDSSavingsPlan",
  tftDSTermAmt: "tftDSTermAmt", tftDSCharge: "tftDSCharge", tftDSPaySchedOverdue: "tftDSPaySchedOverdue",
  tftDSHandsOn: "tftDSHandsOn",
  tftAPOverview: "tftAPOverview", tftAPInherit: "tftAPInherit", tftAPLimit: "tftAPLimit",
  tftAPOverdraftOther: "tftAPOverdraftOther", tftAPAvailDormancy: "tftAPAvailDormancy",
  tftAPChargesRestrict: "tftAPChargesRestrict", tftAPHandsOn: "tftAPHandsOn",
  tftOROverview: "tftOROverview", tftORParamTables: "tftORParamTables", tftORStage: "tftORStage",
  tftORAppStatus: "tftORAppStatus", tftORLDAParams: "tftORLDAParams",
  tftORWorkflowSLA: "tftORWorkflowSLA", tftOROther: "tftOROther",
  tftORFacilityEligibility: "tftORFacilityEligibility", tftORApproval: "tftORApproval",
  tftORSingleDualApproval: "tftORSingleDualApproval",
  tftORChecklist: "tftORChecklist", tftORDocuments: "tftORDocuments", tftORStageOwners: "tftORStageOwners",
  tftORGlobalParams: "tftORGlobalParams", tftORHandsOn: "tftORHandsOn",
  tftGUOverview: "tftGUOverview", tftGUParams: "tftGUParams",
  tftGUExcludeRelease: "tftGUExcludeRelease", tftGUExternal: "tftGUExternal",
  tftCSTables: "tftCSTables", tftCSScoreCard: "tftCSScoreCard",
  tftCSScoreLimitTxn: "tftCSScoreLimitTxn", tftCSDataMapping: "tftCSDataMapping", tftCSHandsOn: "tftCSHandsOn",
  tftIETables: "tftIETables", tftIEStressTesting: "tftIEStressTesting",
  tftLAOverview: "tftLAOverview", tftLAInputAccess: "tftLAInputAccess", tftLAInputTabs: "tftLAInputTabs",
  tftLASettlementChecklist: "tftLASettlementChecklist", tftLACustomSchedules: "tftLACustomSchedules",
  tftLAAppStatusOverride: "tftLAAppStatusOverride", tftLAGroupApplicant: "tftLAGroupApplicant",
  tftLAEligibilityCheck: "tftLAEligibilityCheck", tftLAGuarantorInput: "tftLAGuarantorInput",
  tftLAGuarantorDocs: "tftLAGuarantorDocs", tftLACreditCheck: "tftLACreditCheck",
  tftLACollateralInput: "tftLACollateralInput", tftLACreditScoringStage: "tftLACreditScoringStage",
  tftLAIncomeExpDetails: "tftLAIncomeExpDetails", tftLAScoreCalc: "tftLAScoreCalc",
  tftLACreditAssessment: "tftLACreditAssessment", tftLAAssessmentScoreRec: "tftLAAssessmentScoreRec",
  tftLAReviewApproval: "tftLAReviewApproval", tftLADealSlips: "tftLADealSlips",
  tftLAOfferProduction: "tftLAOfferProduction", tftLALoanCreation: "tftLALoanCreation",
  tftLAManualDisbursement: "tftLAManualDisbursement", tftLAArrangementOverview: "tftLAArrangementOverview",
  tftLAGroupBulkDisb: "tftLAGroupBulkDisb", tftLAReports: "tftLAReports", tftLASummary: "tftLASummary",
  tftLADirectLoan: "tftLADirectLoan", tftLAHandsOn: "tftLAHandsOn",
  tftLRTypes: "tftLRTypes", tftLRGroupRepay: "tftLRGroupRepay", tftLROverpayment: "tftLROverpayment",
  tftLRPrincipalDecrease: "tftLRPrincipalDecrease", tftLRPayoff: "tftLRPayoff",
  tftLROverdueRules: "tftLROverdueRules", tftLROverdueMonitoring: "tftLROverdueMonitoring",
  tftLMActivities: "tftLMActivities", tftLMTopupReschedule: "tftLMTopupReschedule",
  tftLMGuarantorUpdate: "tftLMGuarantorUpdate", tftLMGuarantorStandalone: "tftLMGuarantorStandalone",
  tftLMCapitalizeArrears: "tftLMCapitalizeArrears", tftLMBulkReschedule: "tftLMBulkReschedule",
  tftLMClosure: "tftLMClosure",
  tftCGAPAccess: "tftCGAPAccess", tftCGAPReportSamples: "tftCGAPReportSamples",
  tftPVOverview: "tftPVOverview", tftPVComponents: "tftPVComponents", tftPVClassification: "tftPVClassification",
  tftPVProfile: "tftPVProfile", tftPVCollateralExamples: "tftPVCollateralExamples",
  tftPVAccountingLink: "tftPVAccountingLink", tftPVPostingDetails: "tftPVPostingDetails",
  tftPVManagement: "tftPVManagement", tftPVHandsOn: "tftPVHandsOn",
  tftGRRecoveryConfig: "tftGRRecoveryConfig", tftGRRecoveryOps: "tftGRRecoveryOps",
  tftWOArrangementWriteOff: "tftWOArrangementWriteOff", tftWOCustomerAccountUpdates: "tftWOCustomerAccountUpdates",
  tftWOReport: "tftWOReport",
  tftLRecOverview: "tftLRecOverview", tftLRecContingentSetup: "tftLRecContingentSetup",
  tftLRecAccountUpdate: "tftLRecAccountUpdate", tftLRecTransactions: "tftLRecTransactions",
  tftLRecEntriesIllustration: "tftLRecEntriesIllustration", tftLRecReversalReports: "tftLRecReversalReports",
  tftWORecHandsOn: "tftWORecHandsOn",
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
          q("DAO codes are set up as…", ["A flat, unordered list", "A hierarchy with a code range and Parent Level per organisational level", "One code for the whole bank", "A random number per customer"], 1, "Head Office, Province, Branch and Department each get their own range, linked via Parent Level."),
          q("A new Branch-level officer code should come from…", ["Any unused code bank-wide", "The Branch range, with Parent Level set to its Province/parent", "The Department range", "The Head Office range"], 1, "Codes stay within their level's range; Parent Level rolls the code up to its owner."),
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
  {
    id: "training1",
    code: "YEHULU · USER TRAINING",
    title: "Yehulu User Training",
    description: "The user-training curriculum: navigation, screen mechanics, customer, accounts, deposits, loans, groups and teller — built from the trainer modules and the training environment.",
    sections: [
      {
        id: "training1-nav", title: "Navigation & Sign-In",
        description: "Signing in, the Role-Based Home Page, the navigator icons, themes, favourites, company switch and the command line.",
        concepts: ["signin", "navicons", "companybranch", "t24command", "usersmsgroup", "usermaint", "spf"],
        quiz: [
          q("After signing in you land on…", ["a blank command line", "your Role-Based Home Page (RBHP)", "the System Admin menu", "the Product Catalog"], 1, "Tailored to the user's role."),
          q("Favourites shortcuts are defined with an abbreviation in…", ["USER.SMS.GROUP", "USER.ABBREVIATION", "the SPF", "RECORD.LOCK"], 1, "Per-user; e.g. an 'ACCT' abbreviation for the ACCOUNT application."),
          q("The History icon shows…", ["every user's logins", "versions and enquiries you used this session, cleared on logout", "pending authorisations", "the COB schedule"], 1, "You can re-run them or create new records from them."),
          q("Out-of-the-box themes include…", ["only light and dark", "Magic Blue, Nature Green, Brinjal Purple, Space Dark", "one per role", "none — theme is fixed"], 1, "Set under Global Settings → General."),
          q("Switching between companies (branches) is permitted by…", ["any user freely", "the Security Management System (SMS)", "the customer", "COB"], 1, "Company access is granted at User/Role setup."),
          q("USER.SMS.GROUP is…", ["a customer group", "a reusable Allowed / Not Allowed set of applications and companies for users", "a lending group", "a menu item"], 1, "Attached to USER; works with the USSP."),
        ],
      },
      {
        id: "training1-screen", title: "Screen Navigation & Records",
        description: "The screen buttons, the input box, field assistance, multi-value fields, exiting cleanly and record locks, field help and enquiries.",
        concepts: ["screenbtns", "fieldbtns", "multivalue", "menufields", "recordlock", "fieldhelp", "enqcommand"],
        quiz: [
          q("Delete and Authorise live under which screen button?", ["+ create", "the gear — 'perform an action on the contract'", "help", "the input box"], 1, "The + creates, ✏️ edits, 👁 views."),
          q("View Full List lets you find a record by…", ["id only", "any column, with a Filter (default is the id)", "the mnemonic only", "the version name"], 1, "The record dropdown shows the current filtered record."),
          q("A context-sensitive enquiry beside the Currency field shows…", ["all customers", "enquiries relevant to that currency (Nostro position, Exchange rates…)", "the COB time", "the user's rights"], 1, "Filtered to the field's value."),
          q("Pressing + on a multi-value field…", ["deletes the group", "replicates the first group (.1) as .2 and turns + into a kebab menu", "closes the record", "reverses it"], 1, "Kebab menu: Insert / Remove / Clone the group."),
          q("A record left without exiting properly becomes…", ["deleted", "locked until it's unlocked via RECORD.LOCK", "authorised", "dormant"], 1, "Unlock: RECORD.LOCK → list live file → pick it → verify deal → unlock."),
          q("Hot validation triggers when you…", ["open the record", "change a hot-validation field and tab away — the whole screen revalidates", "commit", "close all tabs"], 1, "Catches errors early."),
        ],
      },
      {
        id: "training1-cust", title: "Customer",
        description: "The Customer base record, key fields, individual vs non-individual, the Single Customer View, document upload and amendment.",
        concepts: ["custapplication", "custfields", "custindivnonindiv", "trscv", "custdocs", "custamend"],
        quiz: [
          q("The Customer record must exist…", ["only for loan customers", "before any customer activity — most applications reference it", "only at year end", "only for banks"], 1, "Account holders, guarantors, correspondent banks, brokers all get one."),
          q("Customer Type EXTERNAL.USER means the customer…", ["is a bank", "can only be a signatory on select applications", "is blocked", "is dormant"], 1, "ACTIVE = ready for business; PROSPECT = potential."),
          q("Blocked = Yes on a customer…", ["closes their accounts", "stops any new account being opened for them", "waives charges", "changes the officer"], 1, "A hard gate on new business."),
          q("The Single Customer View's right-hand tabs include…", ["Design / Proof / Publish", "Tasks, Portfolio, Payments, Credit Security, Documents, History", "GRC / DEL / NAB", "only Balances"], 1, "Left tabs: Person / Contact / KYC / Background."),
          q("A document is attached to a customer via…", ["the command line only", "SCV → Documents → Upload: capture the metadata, then upload the file", "the Product Catalog", "RECORD.LOCK"], 1, "Held as IM (Image) records."),
          q("An authorised customer record can be…", ["reversed", "amended anytime but never reversed", "deleted only", "merged automatically"], 1, "Edit → commit → authorise."),
        ],
      },
      {
        id: "training1-acct", title: "Accounts",
        description: "Accounts as arrangements, account origination (EM.AO.APPLICATION), restrictions, dormancy reset, overdraft and online closure.",
        concepts: ["aaaccount", "aoapplication", "acctrestriction", "acctdormant", "acctoverdraft", "acctclosure"],
        quiz: [
          q("In the current release a current/savings account is…", ["a classic ACCOUNT keyed directly", "an AA arrangement on the Accounts product line", "a customer group", "a limit"], 1, "The account Overview shows the Arrangement and the account number together."),
          q("Account origination is held in…", ["ACCOUNT", "EM.AO.APPLICATION", "AA.PRODUCT", "CUSTOMER"], 1, "Stages: Application Input → Review/Approval → Update Customer → Offer Production → Account Creation."),
          q("Unlike loans and deposits, the account's eligibility check is…", ["a separate first stage", "built into the Application Input stage", "run at COB", "skipped"], 1, "An application can be discontinued early if the customer is ineligible."),
          q("An account flagged Dormant is reset from…", ["the Product Catalog", "the Arrangement Overview screen — pick the reset link, enter the date, validate, commit", "USER.SMS.GROUP", "the command line only"], 1, "Interest posting alone doesn't count as activity."),
          q("Overdraft on an account is…", ["a product", "an approved LIMIT linked to the account, changed via the Limit Link activities", "a customer type", "a closure reason"], 1, "Only current-type accounts may go into debit."),
          q("Before closing an account it's recommended to…", ["delete pending activities", "simulate closure so accruals and settlement-account use are shown", "reverse the arrangement", "write off to P&L"], 1, "Then Perform Closure (Live)."),
        ],
      },
      {
        id: "training1-dep", title: "Deposits",
        description: "Term-deposit origination (EM.DO.APPLICATION), maturity instruction and rollover, funding, withdrawal and redemption.",
        concepts: ["depapplication", "depmaturity", "depfunding", "depwithdrawal", "depredemption"],
        quiz: [
          q("A term/fixed deposit is…", ["a cash transaction", "an arrangement on the Deposits product line, opened via EM.DO.APPLICATION", "a customer group", "a till"], 1, "Stages: Input → Review/Approval → Offer Production → Deposit Creation."),
          q("The default Maturity Instruction is…", ["Close", "Rollover", "Withdraw", "Redeem"], 1, "'Close' is selected exceptionally on customer request."),
          q("With Rollover Type = Principal, the Int. Pay Method should be…", ["Capitalise", "Pay — accrued interest is paid to the customer", "Waive", "Defer"], 1, "With Principal and Interest, set it to Capitalise."),
          q("At Offer Production a deposit can be funded…", ["only by cash", "from an existing account, or by cash via the Teller", "only from another deposit", "only at COB"], 1, "If 'Account', the customer's accounts are shown; if 'Cash', that field is hidden."),
          q("A deposit withdrawal before maturity…", ["is blocked", "is simulated first so the new interest-at-maturity is shown, then completed from the Overview", "closes the deposit", "needs a Payment Order"], 1, "Activity 'Partial Withdrawal of Deposit'."),
          q("On redemption (early full closure) the contract goes to…", ["Active", "Pending Closure — subsequent COBs close it", "Dormant", "Reversed"], 1, "The customer is credited the proceeds; a pre-closure fee override may apply."),
        ],
      },
      {
        id: "training1-loan", title: "Loans",
        description: "Loan origination (EM.LO.APPLICATION) — application input, eligibility, guarantors, collateral, credit assessment, approval — then disbursement, repayment and payoff.",
        concepts: ["loanapplication", "loanappinput", "loaneligibility", "loanguarantor", "loancollateral", "loancreditassess", "loandisburse", "loanrepay"],
        quiz: [
          q("The loan origination stages are…", ["Input → Authorise", "Input → Eligibility → Guarantor → Collateral → Credit Assessment → Review/Approval → Offer → Creation", "Design → Proof → Publish", "GRC → DEL → NAB"], 1, "Each stage is mandatory / optional / not required per the product."),
          q("Loan Action must always be…", ["AMEND", "NEW (for Yehulu)", "REVERSE", "RENEW"], 1, "Set on Application Input."),
          q("Asset Class on the loan application shows…", ["the interest rate", "the worst overdue status of the customer's existing loans", "the collateral value", "the branch"], 1, "A quick risk read on the borrower."),
          q("An existing-customer guarantor's guarantee amount is…", ["ignored", "locked on their account until the loan is repaid", "paid to the bank", "refunded at disbursement"], 1, "A non-customer uses New External Guarantor instead."),
          q("Collateral Execution Value is…", ["the purchase price", "the estimated realisable amount if the collateral had to be enforced/sold", "the loan amount", "the insurance value"], 1, "Nominal is the base/gross value; Maximum is the policy cap."),
          q("Credit Assessment recommendation options are…", ["Pass / Fail", "Approve / Decline / Wait", "Open / Closed", "Debit / Credit"], 1, "Wait = postpone, need more information."),
          q("A created loan becomes money in the customer's hands only after…", ["authorisation", "disbursement (by cash or account transfer, from Loans Overview → Transactions)", "the offer", "COB"], 1, "Repayments then run automatically against the repayment account."),
          q("Paying a loan off early…", ["is not allowed", "is calculated by simulation (principal + accrued interest + any prepayment charge) then settled", "just deletes the loan", "waives all interest"], 1, "Payoff from Account, or a Payment Order from the payoff statement."),
        ],
      },
      {
        id: "training1-group", title: "Groups",
        description: "Group types, group creation and lifecycle fields, meeting schedule, members and designations, and group/member maintenance.",
        concepts: ["grouptypes", "groupcreate", "groupmeeting", "groupmembers", "groupmaintain", "abbrevgroup"],
        quiz: [
          q("The four group types are…", ["Retail / Corporate / SME / Private", "Full Membership, Abbreviated Membership, Nested Groups, Centres", "Standard / Premium / Basic / Youth", "Active / Dormant / Closed / Pending"], 1, "Full = members are customers; Abbreviated = members aren't."),
          q("When Group Customer Auto Creation is Yes in the Group Parameter, you should…", ["type the customer id manually", "leave Group Customer/Account blank so the system allocates them", "skip the group type", "close the group"], 1, "The system allocates the linked records."),
          q("Group Status may auto-flip to Inactive when…", ["a member changes role", "there's no Loan/Savings/Drawdown activity across all members for the parameter period", "the officer changes", "COB runs"], 1, "The dormancy period comes from the parameter table."),
          q("The Group Meeting date is advanced…", ["manually every time", "automatically at COB when the specified date is reached, with the old entry moved to History", "never", "by the customer"], 1, "You set the next date and frequency."),
          q("Member Id is NOT used when adding members to…", ["a standard group", "an abbreviated group (members aren't customers)", "a nested group", "a centre"], 1, "Abbreviated members are keyed directly."),
          q("Member maintenance Actions include…", ["Design / Proof / Publish", "Activate, Block, Deactivate, Retire, Transfer", "Pass / Fail / Wait", "Debit / Credit"], 1, "Transfer also needs a To Group."),
        ],
      },
      {
        id: "training1-teller", title: "Teller & Vault",
        description: "Head Teller vs Teller, till management, vault and till cash movements, denomination, cash deposit/withdrawal and counter account transfer.",
        concepts: ["tellermenu", "tillmgmt", "cashmovement", "denomination", "tellercash", "telleracctransfer", "accountdeposit", "tillvault"],
        quiz: [
          q("The Head Teller is responsible for…", ["taking customer deposits", "the vault, creating and reassigning tills, and authorising till balances at closure", "loan origination", "customer onboarding"], 1, "The Teller does the customer cash transactions."),
          q("Opening a till needs…", ["a customer id", "a Till Id and a User Id (via Head Teller → New Till)", "a Payment Order", "COB"], 1, "No till may be left open at close of business."),
          q("Moving cash from the vault to a teller's drawer is…", ["Load Vault", "Load Till (Vault to Till Transfer)", "Till to Till", "a Payment Order"], 1, "Load Vault brings cash into the branch vault itself."),
          q("On a cash transaction the denomination units must…", ["be optional", "total exactly the transaction amount", "match the exchange rate", "be entered by the customer"], 1, "Denomination Given / Denomination Taken tabs."),
          q("A teller cash deposit updates…", ["only the account", "the customer's account and the till balance, with a receipt and GL entry", "only the till", "nothing until COB"], 1, "Teller → Cash Operations → Deposit Cash."),
          q("A counter transfer between two accounts is booked as…", ["a cash transaction", "a Payment Order (debit account → credit account) — no till involved", "a till transfer", "a closure"], 1, "Teller → Other Operations → Customer Account Transfer."),
        ],
      },
    ],
    assessment: [
      q("After signing in you land on…", ["a blank menu", "your Role-Based Home Page", "the command line", "the Product Catalog"], 1, "Tailored to your role."),
      q("A record left without exiting properly is…", ["deleted", "locked until unlocked via RECORD.LOCK", "authorised", "reversed"], 1, "Use the exit button to leave cleanly."),
      q("The Customer record must exist…", ["only for banks", "before any customer activity", "only at year end", "only for loans"], 1, "Most applications reference it."),
      q("An AA account is…", ["a classic ACCOUNT keyed directly", "an arrangement on the Accounts product line", "a customer type", "a limit"], 1, "One engine for loans, deposits, accounts."),
      q("Account origination and its stages come from…", ["fixed code", "EM.AO.APPLICATION, stages per the AO parameters (required/optional/not required)", "the Product Catalog", "COB"], 1, "Input → Review/Approval → Update Customer → Offer → Creation."),
      q("A term deposit's default Maturity Instruction is…", ["Close", "Rollover", "Withdraw", "Redeem"], 1, "Close is exceptional, on request."),
      q("The loan origination stages are…", ["Input → Authorise", "Input → Eligibility → Guarantor → Collateral → Credit Assessment → Review/Approval → Offer → Creation", "Design → Proof → Publish", "GRC → DEL → NAB"], 1, "Per EM.LO.APPLICATION."),
      q("Collateral Execution Value is…", ["the purchase price", "the estimated realisable amount if enforced/sold", "the loan amount", "the GL value"], 1, "Nominal is the base value; Maximum is the policy cap."),
      q("The four group types are…", ["Retail/Corporate/SME/Private", "Full Membership, Abbreviated Membership, Nested Groups, Centres", "Active/Dormant/Closed/Pending", "Standard/Premium/Basic/Youth"], 1, "Full = members are customers; Abbreviated = not."),
      q("Group member maintenance Actions include…", ["Design/Proof/Publish", "Activate, Block, Deactivate, Retire, Transfer", "Pass/Fail/Wait", "Debit/Credit"], 1, "Transfer needs a To Group."),
      q("The Head Teller is responsible for…", ["customer deposits", "the vault, tills, and authorising till balances at closure", "loan origination", "onboarding"], 1, "The Teller does customer cash transactions."),
      q("A counter transfer between two accounts is…", ["a cash transaction", "a Payment Order — no till involved", "a till transfer", "a closure"], 1, "Teller → Other Operations → Customer Account Transfer."),
    ],
  },
  {
    id: "tft-day1",
    code: "TFT-D1",
    title: "Temenos Functional Training (TFT) — Day 1",
    description: "Inclusive Banking intro, partners & implementation methodology, and Product Builder Common Parameters — concept + hands-on, straight from the Sep 2026 TLC materials.",
    sections: [
      {
        id: "tft-1", title: "Inclusive Banking Intro",
        description: "Exclusion vs Inclusion, who Temenos serves, what the Inclusive Banking product is, and its footprint.",
        concepts: ["tftExclusion", "tftInclusion", "tftInstitutions", "tftProduct", "tftTiers", "tftMarkets", "tftValue", "tftCustomerNeeds", "tftFootprint"],
        quiz: [
          q("The four barriers behind Exclusion in Banking are…", ["Cost, Speed, Trust, Risk", "Access, Literacy, Income, Culture", "Branch, Digital, Agent, Mobile", "Product, Price, Place, Promotion"], 1, "Access, Literacy, Income and Culture — leading to 'Denied'."),
          q("Roughly how many adults remain unbanked globally (per the training's World Bank figure)?", ["140 million", "1.4 billion", "14 billion", "400 million"], 1, "~1.4 billion, disproportionately women, poorer, less educated, rural."),
          q("The four levers of Inclusion in Banking are…", ["Sales, Marketing, Risk, Compliance", "Outreach, Training, Loans, Targeted Products", "Branch, ATM, Mobile, Agent", "Design, Build, Test, Deploy"], 1, "Outreach reaches people; Training builds literacy; Loans are small/short-term; Targeted Products serve specific groups (e.g. gender-based)."),
          q("An MFI typically differs from a Credit Union by…", ["being locally owned with dividends", "being private/NGO-run with small loans, guarantors and group lending", "serving only large corporates", "not offering loans at all"], 1, "Credit Unions are locally owned, medium-sized loans, joint customers, dividends/profit sharing."),
          q("Temenos's Inclusive Banking solution is best described as…", ["a bespoke build per client", "a pre-integrated, packaged 'Bank-in-a-Box' aiming for 80–95% fit out of the box", "a spreadsheet-based toolkit", "a consulting methodology only"], 1, "Built on Temenos Transact, delivered by certified partners, on-prem or cloud."),
          q("The three Inclusive Banking tiers are…", ["Basic, Standard, Pro", "Core, Advanced, Premium", "Bronze, Silver, Gold", "Starter, Growth, Enterprise"], 1, "All built on the same Transact + Payment Platform foundation."),
          q("Inclusive Banking's two primary markets are…", ["Retail Banks and Investment Banks", "Microfinance Institutions and Credit Unions", "Start-ups and Corporates", "Central Banks and Regulators"], 1, "Pre-configured for MFIs and Credit Unions; also serves Retail and Start-up banks."),
          q("The three value pillars the solution is built on are…", ["Sales, Risk, Compliance", "User, Customers, Efficiency", "Speed, Cost, Quality", "Design, Build, Test"], 1, "User (ease of use) · Customers (satisfaction) · Efficiency (fast, accurate processing)."),
          q("Which is NOT one of the six evolving customer needs named in training?", ["MSME", "Instant Decisions", "Digital Onboarding", "Branch Expansion"], 3, "The six are MSME, Instant Decisions, ESG Investments, Financial Literacy, Digital Onboarding, Hybrid Self-Service."),
          q("Inclusive Banking's footprint, per the training, is…", ["50 client sites in 10 countries", "360 client sites in 54 countries, first live in 2000 (Sinapi Aba, Ghana)", "1000 client sites globally", "Only deployed in East Africa"], 1, "That first client has upgraded 5 times and is live on R21 since Oct 2022."),
        ],
      },
      {
        id: "tft-2", title: "Partners & Implementation Methodology",
        description: "The Partner Certification Program, certification exams, and the seven-stage Temenos Implementation Methodology (TIM).",
        concepts: ["tftPartners", "tftCertExams", "tftMethodology", "tftPMControl", "tftDeployment"],
        quiz: [
          q("Temenos delivers Inclusive Banking implementations mainly through…", ["direct delivery by Temenos staff only", "a carefully selected, trained, tested and certified partner network", "third-party consultancies with no certification", "the client's own in-house team"], 1, "Selected & onboarded → local/regional presence → classroom trained → tested & certified."),
          q("A certified partner organisation must maintain at least how many Inclusive Banking certified consultants?", ["2", "4", "8", "20"], 2, "At least 8, per the Partner Certification Program."),
          q("Inclusive Banking certification is valid for…", ["6 months", "1 year", "2 years", "indefinitely"], 2, "Consultants are reminded 3 months before expiry."),
          q("The seven stages of the Temenos Implementation Methodology (TIM) are…", ["Plan, Do, Check, Act", "Initiation, Analysis, Design, Build, Test, Deployment, Closure", "Sales, Design, Build, Sell, Support", "Discover, Design, Develop, Deliver"], 1, "CMMI-aligned, process-driven, start to formal sign-off."),
          q("TIM's second component, running alongside the seven stages, is…", ["a pricing calculator", "the Project Management Control Process (Risk, Change, Communication, Quality, Audit, Resource)", "the Product Catalog", "the Partner Certification Program"], 1, "Successful delivery needs both the stages and this control process."),
          q("Unlike Model Bank, Inclusive Banking's implementation process uses…", ["ARIS process modelling", "a show-and-tell workshop to validate RFx gaps", "no analysis stage at all", "only technical exams"], 1, "Model Bank uses ARIS; Inclusive Banking does not."),
          q("The three deployment options are…", ["Free, Paid, Enterprise", "On Premise, Hybrid Cloud, Shared Platform", "Web, Mobile, Desktop", "Single-tenant, Multi-tenant, Serverless"], 1, "Shared Platform = a Temenos partner runs the software, subject to availability."),
          q("Inclusive Banking implementation pricing is…", ["module-by-module", "bundled, not module-based, since most of the 90+ modules are never actually deployed", "billed per user seat only", "free for certified partners"], 1, "TPCS is offered as part of implementation costing; ISB itself is not billed."),
          q("Estimated effort for a Shared Platform implementation is roughly…", ["20 man-days / 2 weeks", "141 man-days / ~3 months", "500 man-days / 2 years", "1000 man-days"], 1, "On Premise is higher, ~200 man-days / ~4 months, since the bank runs its own infrastructure."),
        ],
      },
      {
        id: "tft-3", title: "Product Builder — Common Parameters",
        description: "How the Inclusive Banking Product Builder wraps AA: inheritance groups, shared conditions, product groups, and proof/publish.",
        concepts: ["tftPBIntro1", "tftPBIntro2", "tftPBWizard", "tftPBFlow", "tftInheritGroup", "tftInheritComponents", "tftSharedCond", "tftAccessGroups", "tftGroupCreation", "tftGlobalCond", "tftParentCondTab", "tftProofPublish"],
        quiz: [
          q("The Inclusive Banking Product Builder supports which three product lines?", ["Cards, Payments, FX", "Loans, Deposits, Accounts", "Retail, Corporate, SME", "Input, Review, Authorise"], 1, "Via Loan / Deposit / Account Product Builder workflows."),
          q("The Inclusive Banking Product Builder is best described as…", ["a replacement for AA", "a user-friendly front end/wizard to the core AA Product Builder", "a reporting tool only", "unrelated to AA"], 1, "It hides AA's architecture; the org of products is derived directly from AA."),
          q("The main interface applications used for product building are…", ["CUSTOMER, ACCOUNT, RELATION", "EM.PRODUCT.GROUP, EM.PRODUCT.XXX (Loan/Deposit/Account), EM.PRODUCT.PARAMETERS", "AA.ARRANGEMENT, AA.PRODUCT", "TELLER, EM.CASH.DEPOSIT"], 1, "XXX = LOAN, DEPOSIT or ACCOUNT."),
          q("The Product Wizard Process Flow, in order, is…", ["Products → Groups → Shared Conditions → Inheritance Groups", "Create Inheritance Groups → Define Shared Conditions → Create Product Groups → Create Products", "Proof → Publish → Design → Build", "Global Conditions → Products → Groups → Catalogue"], 1, "Creating an Inheritance Group is optional — only if necessary."),
          q("Delivered Loan inheritance groups include…", ["EmTermDeps, EmSavPlans", "EmConsumer, EmBusiness, EmHome", "EmSavings, EmCurrent, EmShares", "AgInherit only"], 1, "Deposits use EmTermDeps/EmSavPlans; Accounts use EmSavings/EmCurrent/EmShares."),
          q("At Inheritance Group level, a component marked 'Define Now'…", ["is skipped entirely", "is set at the shared/parent level (Stage Level)", "must be re-entered on every child product", "is a global condition"], 1, "'Define Later' components are deferred to the child product instead."),
          q("The Shared Condition Builder wizard is launched by…", ["proofing the product", "setting 'Launch Condition Builder' to Yes on the Inheritance Group", "creating a new customer", "the Global Conditions tab"], 1, "It then walks through each 'Define Now' condition, e.g. Penalty Interest, Settlement, Overdue, Payoff/Closure."),
          q("New product groups are created from…", ["the Teller page", "Administration > Products > <Line> Products tab > New Product Group", "System Parameters only", "the Single Customer View"], 1, "The Product Administrator screen has separate tabs per product line (Loan, Deposit, Account, plus Origination tabs)."),
          q("Product Group Creation is a three-step process of…", ["Design, Proof, Publish", "Group Details, Global Conditions, Shared Conditions", "Input, Authorise, Live", "Customer, Account, Limit"], 1, "Group Details sets the category range, currencies and start date; up to 99 products per group."),
          q("Global Conditions on a product group are…", ["freely editable by any user", "predefined in the ISB and not to be amended without due care", "the same as Shared Conditions", "only relevant to Deposits"], 1, "More technical/rarely-amended business classes like ACCOUNTING, ACTIVITY, PRESENTATION."),
          q("A product group's 'NoInherit' parent product code means…", ["all conditions are inherited automatically", "all (non-global) conditions must be defined while building the child product", "the group cannot be published", "it only applies to Deposits"], 1, "The 'Inherit' parent pulls in the previously built shared conditions instead."),
          q("Before a product group or its parent conditions can be used, they must be…", ["archived", "proofed and published", "converted to arrangements", "authorised by the customer"], 1, "The Proof and Publish Monitor confirms 'Completed Successfully' per product/action."),
        ],
      },
      {
        id: "tft-4", title: "Hands-On Practice",
        description: "The two workshop exercises: building an Inheritance Group, then building Product Groups with Inherit vs NoInherit parents.",
        concepts: ["tftHandsOn1", "tftHandsOn2"],
        quiz: [
          q("Practice 1 (Inheritance Group) is created via which path?", ["Administration > Products > Loan Products (tab) > New Inheritance Group", "System Parameters > New Group", "Teller > New Inheritance Group", "Origination > New Inheritance Group"], 0, "This creates a new Inheritance Group record for a chosen product line."),
          q("In Practice 1, which four shared conditions are defined?", ["Interest, Term, Amount, Currency", "Penalty Interest, Settlement, Overdue, Payoff & Closure", "Customer, Account, Officer, Limit", "Design, Proof, Publish, Audit"], 1, "With 'Launch Condition Builder' checked to walk the wizard; record EmConsumer was the worked example."),
          q("In Practice 1's solution, only which items are presented by the Shared Condition Builder workflow?", ["Every field on the product", "Only items marked 'Define Now' in the Inheritance Group", "Only global conditions", "Only fields with a default value"], 1, "'Define Later' items are deferred to the child product instead."),
          q("Practice 2 (Product Groups) asks you to create two parent product codes named…", ["Consumer and Business", "Inherit and NoInherit", "Loan and Deposit", "Draft and Live"], 1, "On the Inherit parent, the shared conditions from Practice 1 are allocated."),
          q("After building the Practice 2 product group, the required last step is to…", ["email the trainer", "proof and publish the record", "delete the NoInherit parent", "archive the inheritance group"], 1, "Nothing is usable by origination/products until proofed and published."),
          q("Practice 2's example category ranges (e.g. TrnAgric 3751–3760) use which currency?", ["USD", "GBP", "ETB", "EUR"], 1, "All five practice groups in the exercise use GBP."),
        ],
      },
    ],
    assessment: [
      q("Inclusive Banking's four exclusion barriers are…", ["Cost, Speed, Trust, Risk", "Access, Literacy, Income, Culture", "Branch, Digital, Agent, Mobile", "Design, Build, Test, Deploy"], 1, "Leading to people being 'Denied' access to financial services."),
      q("The four Inclusion levers are…", ["Sales, Marketing, Risk, Compliance", "Outreach, Training, Loans, Targeted Products", "Branch, ATM, Mobile, Agent", "Plan, Do, Check, Act"], 1, "Outreach → Training → Loans → Targeted Products."),
      q("Inclusive Banking's two primary markets are…", ["Retail and Investment Banks", "Microfinance Institutions and Credit Unions", "Start-ups and Corporates", "Central Banks and Regulators"], 1, "Also extends to Retail and Start-up banks."),
      q("The three Inclusive Banking tiers, entry to top, are…", ["Basic, Standard, Pro", "Core, Advanced, Premium", "Bronze, Silver, Gold", "Starter, Growth, Enterprise"], 1, "All on the same Transact + Payment Platform foundation."),
      q("The first-ever Inclusive Banking implementation went live in…", ["1995, Kenya", "2000, Ghana (Sinapi Aba)", "2010, India", "2022, Ethiopia"], 1, "Now live on R21 since October 2022, after 5 upgrades."),
      q("A certified Inclusive Banking partner organisation must maintain at least…", ["2 certified consultants", "8 certified consultants", "20 certified consultants", "no minimum"], 1, "Certification itself is valid for 2 years per consultant."),
      q("TIM's seven implementation stages are…", ["Sales, Design, Build, Sell, Support", "Initiation, Analysis, Design, Build, Test, Deployment, Closure", "Discover, Design, Develop, Deliver", "Plan, Do, Check, Act"], 1, "CMMI-aligned, run alongside the Project Management Control Process."),
      q("Unlike the classic Model Bank approach, Inclusive Banking implementation validates RFx gaps via…", ["ARIS modelling", "a show-and-tell workshop", "a written exam", "COB reports"], 1, "That's the Analysis-stage approach specific to Inclusive Banking."),
      q("Inclusive Banking implementation pricing is…", ["itemised per module", "bundled, not module-based, since most modules are never deployed", "billed per branch", "always free"], 1, "TPCS is offered as part of the implementation costing."),
      q("The Inclusive Banking Product Builder supports which three product lines?", ["Cards, Payments, FX", "Loans, Deposits, Accounts", "Retail, Corporate, SME", "Input, Review, Authorise"], 1, "Built via Loan / Deposit / Account Product Builder workflows."),
      q("The four steps of the Product Wizard Process Flow are…", ["Products → Groups → Conditions → Inheritance", "Create Inheritance Groups → Define Shared Conditions → Create Product Groups → Create Products", "Design → Build → Test → Deploy", "Global → Shared → Parent → Child"], 1, "Creating an Inheritance Group is optional, only if necessary."),
      q("A component marked 'Define Now' at Inheritance Group level is…", ["skipped", "set at the shared/parent level", "always negotiable", "a global condition"], 1, "'Define Later' components are deferred to the child product."),
      q("New product groups are created from…", ["the Teller page", "Administration > Products > <Line> Products tab > New Product Group", "System Parameters only", "the SCV"], 1, "Then via the meatballs menu: View Group, Amend Group, List Products, Proof and Publish."),
      q("Product Group Creation's three steps are…", ["Design, Proof, Publish", "Group Details, Global Conditions, Shared Conditions", "Input, Authorise, Live", "Customer, Account, Limit"], 1, "Up to 99 products can be created per group, within its category range."),
      q("A 'NoInherit' parent product code on a group means…", ["conditions are auto-inherited", "all non-global conditions must be defined while building the child product", "the group can't be published", "it applies only to Deposits"], 1, "The 'Inherit' parent instead pulls in previously built shared conditions."),
      q("Before a product group is usable, it must be…", ["archived", "proofed and published", "converted to an arrangement", "authorised by a customer"], 1, "The Proof and Publish Monitor confirms 'Completed Successfully'."),
      q("In the hands-on Practice 1, the four shared conditions built were…", ["Interest, Term, Amount, Currency", "Penalty Interest, Settlement, Overdue, Payoff & Closure", "Customer, Account, Officer, Limit", "Design, Proof, Publish, Audit"], 1, "Via the Shared Condition Builder wizard, using EmConsumer as the worked example."),
      q("In hands-on Practice 2, the two parent product codes created were named…", ["Consumer and Business", "Inherit and NoInherit", "Loan and Deposit", "Draft and Live"], 1, "The Inherit parent reused the shared conditions from Practice 1."),
    ],
  },
  {
    id: "tft-day2",
    code: "TFT-D2",
    title: "Temenos Functional Training (TFT) — Day 2",
    description: "Morning: the full Inclusive Banking Loan Product Builder — Product Conditions, Additional Conditions, Review/Publish/Maintenance, hands-on. Afternoon: Deposit & Savings Plans Product Builder, then Account Product Builder & Overdraft Facilities, each with hands-on — straight from the Sep 2026 TLC materials.",
    sections: [
      {
        id: "tftD2-1", title: "Loan Product & Product Conditions",
        description: "Building the product itself, then its Customer/Account, Limit, Term/Amount, Payment Schedule and Principal/Penalty Interest conditions.",
        concepts: ["tftLPCore", "tftLPCustAcct", "tftLPLimit", "tftLPTermAmt", "tftLPPaySchedule", "tftLPInterest"],
        quiz: [
          q("The first step in building a loan product is…", ["setting the interest rate", "linking it to its Product Group and Product Parent", "publishing it", "assigning an account officer"], 1, "That's what lets the wizard work out what's already inherited."),
          q("A product's category code must…", ["be globally unique", "fall inside its Product Group's reserved category range", "start with 'AA'", "match the currency code"], 1, "Otherwise it won't appear in the dropdown when creating the product."),
          q("Customer/Account conditions (EM.PRDL.CUST.ACCT) are…", ["inherited from the product group", "always defined per product, never inherited", "optional", "the same as Global Conditions"], 1, "Joint ownership, default account name, date convention and adjustment."),
          q("Date Adjustment = Period (vs Value) means a holiday-hit payment date…", ["only the value date of the entries adjusts", "the actual scheduled payment date itself gets cycled", "the payment is skipped entirely", "nothing changes"], 1, "Value adjustment leaves the scheduled date itself untouched."),
          q("Limit Type = Default on a loan product means…", ["no limit processing at all", "limits auto-create under predefined LIMIT.REFERENCE records (8300–8499)", "the user must define LIMIT.PARAMETER manually", "only revolving products qualify"], 1, "User Defined is the alternative, needing full LIMIT.PARAMETER + LIMIT.REFERENCE setup."),
          q("TERM.AMOUNT conditions are defined…", ["once for the whole product", "per currency the product allows", "per customer", "per branch"], 1, "Each currency gets its own default/min/max term and amount."),
          q("The Cooling Period is stored in AA.ACCOUNT.DETAILS field…", ["COOLING.DATE", "TERM.AMOUNT", "GRACE.PERIOD", "PAYOFF.DATE"], 0, "The window in which the customer can cancel penalty-free."),
          q("Tranches and scheduled Disbursement payment types are…", ["always used together", "mutually exclusive", "unrelated to Term/Amount", "only for deposits"], 1, "If Tranches = Yes, disbursement type isn't defined in the payment schedule stage."),
          q("Which repayment type results in equal instalments and needs both an Account and Interest property?", ["Linear", "Full Bullet", "Constant", "Principal Bullet"], 2, "Used for 'Annuity' arrangements."),
          q("Custom repayment schedules (e.g. a seasonal repayment holiday) are defined via…", ["EM.PRDL.CHARGE", "the core table AA.PRD.DES.PAYMENT.SCHEDULE", "EM.PRDL.LIMIT", "the Eligibility tab"], 1, "Repayment Frequency must also be set to Custom."),
          q("Flat interest is calculated on…", ["the current outstanding balance", "the original commitment amount (TOTCOMMITMENT)", "the penalty balance", "the collateral value"], 1, "Reducing Balance instead recalculates on CURACCOUNT, the actual outstanding balance."),
          q("A penalty interest condition name is always…", ["identical to the principal interest condition", "auto-prefixed 'empen'", "left blank", "a random code"], 1, "So principal and penalty condition names never collide."),
        ],
      },
      {
        id: "tftD2-2", title: "Additional Product Conditions",
        description: "Charge, Settlement, Overdue, Payoff & Closure, and Eligibility conditions — everything beyond the core product build.",
        concepts: ["tftLPCharge", "tftLPSettleOverdue", "tftLPPayoffClose", "tftLPEligibility"],
        quiz: [
          q("How many charge properties are predefined for Lending in the Inclusive Banking wizard?", ["Three", "Four", "Six", "Ten"], 2, "Ageing Bill, Disbursement, New Arrangement, Principal Decrease, Payoff and Maintenance Fee."),
          q("Setting a charge's Same Condition (ALL.CCY.SAME) field to 'Not Applicable' means…", ["one condition covers all currencies", "separate conditions are needed per currency", "the charge doesn't apply to the product at all", "the charge becomes mandatory"], 2, "'Yes' = one default condition for all currencies; 'No' = separate conditions per currency."),
          q("The Principal Decrease Fee is an example of a charge linked to…", ["an Activity", "a Restriction (prepaying more than the allowed % of balance)", "the Eligibility tab", "the Limit condition"], 1, "A break-rule charge tied to a Restriction, not an Activity."),
          q("Where Automatic Disbursal is set at the Payment Schedule stage, funds go to…", ["a suspense account", "the first account of the customer matching the Disbursal Category set in Settlement", "the branch's nostro account", "cash only"], 1, "Repayment collection works the same way, via the Repayment Category."),
          q("A Full repayment rule means the repayment account is debited…", ["only if funds are sufficient", "in full regardless of whether funds are enough", "never automatically", "only on the due date"], 1, "Partial is the alternative, settling only what funds allow."),
          q("Overdue Ageing Type can be based on…", ["only calendar days", "Days or number of missed payments", "only bill amount", "the customer's age"], 1, "Grace Period and Delinquent Period (with chaser advice frequency) follow from this."),
          q("Payoff Expiry Days controls…", ["the loan term", "how long a payoff bill stays valid before it's purged", "the cooling period", "the interest rate"], 1, "e.g. 3 working days past the effective payoff date."),
          q("Closure Type = Balance means the automatic closure fires…", ["on a fixed date", "when the balance reaches zero (plus the Closure Period)", "at COB every night", "only on manual request"], 1, "Closure Type = Maturity fires by date instead."),
          q("Eligibility Conditions (EM.PRDL.ELIGIBILITY) run through…", ["the AA rules engine only", "a local Inclusive Banking application, not the AA rules engine", "the Teller module", "COB"], 1, "Extra rules can still be layered on via the rules engine if needed."),
          q("Initial Deposit blocking on the customer's account can…", ["never exceed the loan amount", "exceed 100% of the loan amount if required", "only apply to Non-Individual customers", "only be a fixed currency amount"], 1, "Deposit Type can be Individual (per loan) or Product-driven; amount or percentage."),
          q("Progressive Release on the initial deposit…", ["blocks more funds over time", "reduces the blocked amount over the term as the outstanding principal is repaid", "has nothing to do with blocking", "only applies to Partial Blocking"], 1, "The two eligibility features work together: Progressive Release reduces the block over time; Partial Blocking controls which account(s) it applies to up front."),
          q("Selling a loan product through a Broker requires…", ["nothing extra", "the Agency (AG) module to be available", "a separate product line", "Progressive Release"], 1, "Set on the Eligibility → Channels tab, alongside Internet/Mobile."),
        ],
      },
      {
        id: "tftD2-3", title: "Review, Publish & Maintenance",
        description: "The Product Review Report, Designing → Proofing → Publishing, and how a published product is maintained afterward.",
        concepts: ["tftLPReviewPublish", "tftLPMaintain"],
        quiz: [
          q("The Product Review Report is used to…", ["publish the product", "give a final tab-by-tab check of every condition before publishing", "delete a product", "create a new category"], 1, "The last chance to catch a wrong condition before the product is live."),
          q("Proofing a product does all of the following EXCEPT…", ["expand the definition to include inherited properties", "ensure a currency condition exists for each allowed currency", "ensure every mandatory property has a condition", "change the product's category code"], 3, "Proofing validates and cross-checks — it doesn't change core identifiers like the category code."),
          q("Once a product is published, the product wizard can…", ["still amend any condition freely", "no longer amend it — changes use the AA Core product builder instead", "only be deleted", "still change the category code"], 1, "Except Settlement, Eligibility and Limit, which keep their own dedicated maintenance versions."),
          q("Post-publish, Settlement conditions are maintained via…", ["the AA Core builder only", "EM.PRDL.SETTLEMENT,CATEG.CHANGE", "deleting and recreating the product", "the Teller menu"], 1, "Eligibility uses EDIT.STANDALONE; Limit uses LIMIT.CHANGE — each keeps its own version."),
          q("Global Product Parameters (EM.PRODUCT.PARAMETERS) record id is always…", ["the product code", "SYSTEM", "the branch code", "the user id"], 1, "One bank-wide record shared by every loan product."),
          q("Global Product Parameters define…", ["individual customer limits", "bank-wide settings like initial deposit category codes and savings age eligibility checks, shared across products", "the interest rate", "the collateral value"], 1, "Also the payment product id for direct loans and the savings multiplier for individual borrowers."),
          q("Stage owners for the product-build workflow (who can action each stage) are defined via…", ["PW.PARTICIPANT", "EM.PRODUCT.PARAMETERS", "AA.PRD.DES.TERM.AMOUNT", "the Eligibility tab"], 0, "An owner can be an individual user, a user group, or a department."),
          q("If a product build is paused mid-workflow, the current stage record is marked…", ["Deleted", "Pending, so the next user can pick it up via the action icon", "Published", "Rejected"], 1, "This may be a deliberate pause or an abrupt disruption — either way, work resumes from there."),
          q("Product-related changes are recommended to be made…", ["at any time of day", "just before COB, so they take effect from the following day", "only on weekends", "immediately, regardless of timing"], 1, "So the change doesn't disrupt arrangements already processing that day."),
        ],
      },
      {
        id: "tftD2-4", title: "Loan Hands-On Practice",
        description: "Building a complete loan product — category, product, then Customer/Account, Limit and Term/Amount conditions.",
        concepts: ["tftLPHandsOn"],
        quiz: [
          q("The hands-on practice starts with…", ["publishing a product", "using New Category to create a category record inside your product group's range", "defining Eligibility", "creating a customer"], 1, "Administration > Products > Loan Products (tab)."),
          q("After building your product, you verify it via…", ["deleting and rebuilding it", "Administration > Products > Loan Products > Classic Product Builder, to view it as generated in AA", "the Teller menu", "COB"], 1, "Confirms the product and its conditions actually landed correctly in AA."),
          q("In the worked solution, Product Parent 'Default – no inheritance' means…", ["conditions are shared from another product", "every (non-global) condition is defined fresh for this product", "the product can't be published", "it only applies to deposits"], 1, "The opposite of linking to an Inherit-type parent."),
        ],
      },
      {
        id: "tftD2-5", title: "Deposit & Savings Plans Product Builder",
        description: "Afternoon session 1: Term Deposits, Call Deposits and Savings Plans, and everything unique to building a Savings Plan — Term/Amount, Bonus/Charge, Payment Schedule and Overdue.",
        concepts: ["tftDSOverview", "tftDSInherit", "tftDSSavingsPlan", "tftDSTermAmt", "tftDSCharge", "tftDSPaySchedOverdue"],
        quiz: [
          q("The three deposit product types are…", ["Fixed, Variable, Hybrid", "Term Deposits, Call/Notice Deposits, Savings Plans", "Current, Savings, Share", "Individual, Joint, Group"], 1, "Call Deposits are built via core AA Deposits, flagged 'Back to Core'."),
          q("Delivered deposit category ranges are…", ["SavPlans 6500–6599, TermDeps 6700–6799", "SavPlans 6700–6799, TermDeps 6500–6599", "both 6000–6099", "both 7300–7399"], 0, "Up to 200 products across the two groups."),
          q("A Savings Plan's product-build workflow is driven by…", ["the currency", "the PRODUCT.TYPE field set at Product Group creation", "the customer's age", "the interest rate"], 1, "Choosing Savings Plan (vs Term/Call Deposit) changes which stages/tabs the wizard presents."),
          q("At the Term/Amount stage, a Savings Plan's amount maps to…", ["the loan's TOTCOMMITMENT", "Payment Schedule's ACTUAL.AMT field, the recurring commitment", "the collateral value", "nothing — it's ignored"], 1, "Bills generate as EXPECTED online during COB on the regular deposit date."),
          q("A Savings Plan Bonus charge is typically…", ["paid immediately on each deposit", "a scheduled charge paid on maturity, conditional on keeping to the plan", "never conditional", "unrelated to Overdue"], 1, "e.g. no partial withdrawal, no late payments, or missed payments under a tolerance."),
          q("Bonus Restriction, when triggered, can…", ["only cancel the whole product", "waive the bonus completely or pay it at a lower rate", "increase the bonus", "close the account"], 1, "Requires an Overdue product condition to actually monitor delinquent payments."),
          q("On a Savings Plan, the Overdue stage becomes mandatory when…", ["never — it's always optional", "ageing-based charges or bonus restrictions have been defined", "the product is Term Deposit type", "the customer requests it"], 1, "Otherwise the system just asks 'Apply Overdues?'."),
          q("The Savings Plan Settings tab (unique to this product type) sets…", ["the interest rate", "the deposit frequency, and whether it's negotiable", "the collateral type", "the branch code"], 1, "Separate from the Interest and Bonus Settings tab."),
        ],
      },
      {
        id: "tftD2-6", title: "Account Product Builder & Overdraft Facilities",
        description: "Afternoon session 2: Retail account types, Account Limit (overdraft), Overdraft's other parameters and compliance checks, Availability/Dormancy, and Charges/Restrictions/Change Product.",
        concepts: ["tftAPOverview", "tftAPInherit", "tftAPLimit", "tftAPOverdraftOther", "tftAPAvailDormancy", "tftAPChargesRestrict"],
        quiz: [
          q("The three retail account types and their category ranges are…", ["Current 1000–1099, Savings 6000–6099, Shares 7300–7399", "all share one range", "Current 6000–6099, Savings 1000–1099, Shares 7300–7399", "Savings 7300–7399, Current 6000–6099, Shares 1000–1099"], 0, "Up to 300 account products across them."),
          q("Shared conditions most commonly defined for retail accounts are…", ["Interest, Term, Amount", "Statement, Tax, Dormancy, Payoff, Closure", "Guarantor, Collateral, Eligibility", "Denomination, Till, Vault"], 1, "Global Conditions cover the more technical, rarely-amended classes."),
          q("An account's overdraft limit record is…", ["manually created by the user every time", "auto-created as part of account opening, with Limit Serial always NEW", "only possible on Savings accounts", "unrelated to AA"], 1, "Limit handling is then done through and managed by AA."),
          q("Check Type = Single on an overdraft means…", ["the max-limit check applies across all the customer's accounts", "the max-limit check applies to one account only", "only one customer can hold the product", "no check is performed"], 1, "Check Type = All applies the check across every account the customer holds."),
          q("MIN.30D.CREDIT requires the account to…", ["never go into debit", "return to credit for at least 30 days within any 12-month rolling period, or the overdraft can't auto-renew", "close after 30 days", "pay a fee every 30 days"], 1, "The review can happen up to 30 days before the renewal date."),
          q("NO.UNAUTH.DEBIT queues the overdraft for immediate review after…", ["1 unauthorised overnight debit", "3 out-of-order (unauthorised overnight debit) events", "10 events", "any payment item like a referral"], 1, "Payment items such as referrals don't count toward this — only actual unauthorised overnight debit balances."),
          q("A Notice account's Notice Period defines…", ["the account's dormancy period", "how much notice is needed before withdrawing above the Notice Amount", "the overdraft review frequency", "the statement frequency"], 1, "Notice Availability then sets how long after notice before funds are actually available."),
          q("An account is flagged Inactive at COB based on…", ["the Dormancy stage only", "the Inactivity Months field on the COMPANY record (if no user-defined dormancy statuses are configured)", "the Overdraft Review Frequency", "the Change Product condition"], 1, "ACCT.INACTIVE.RESET removes the inactive flag; user-defined statuses and Inactivity Months are mutually exclusive."),
          q("Periodic Charges on an account can be exempted or assessed by…", ["Charge Group (AA.CHARGE.GROUP), only for activity-based charges", "the customer's age", "the branch code", "nothing — Periodic Charges can't be exempted"], 0, "The system auto-presents Periodic Charges once ledger charges are defined."),
          q("A Change Product condition (e.g. Children's Savings → Regular Savings at 18)…", ["can target any product in any group", "requires both products to belong to the same product group", "only works on Current accounts", "happens instantly with no notice"], 1, "e.g. Change Period 'R_BIRTH + 18Y' with a configurable prior-days notice."),
        ],
      },
      {
        id: "tftD2-7", title: "Afternoon Hands-On Practice",
        description: "The two afternoon workshop exercises: building a Savings Plan (Target Savings) end to end, then an Account product (Tangerine Savings) end to end.",
        concepts: ["tftDSHandsOn", "tftAPHandsOn"],
        quiz: [
          q("The Savings Plan hands-on (Target Savings) exercise includes a fee for…", ["only late deposits", "early redemption before maturity, partial withdrawals, and missed/late payments", "opening the account", "nothing — it's fee-free"], 1, "PRECLOSUREFEE, WITHDRAWALFEES and DEPAGEINGFEE respectively."),
          q("In the Target Savings solution, the Preclosure Fee is linked to…", ["an Activity", "a Restriction ('Early Redemp. After Cooling Period')", "the Eligibility tab", "nothing — it's automatic"], 1, "Calculated at 1% of the Deposit Amount."),
          q("The Account hands-on (Tangerine Savings) requirements include…", ["a fixed flat interest rate for everyone", "tiered interest — a base margin on the first USD 1000, a higher margin beyond", "no minimum balance", "unlimited free withdrawals"], 1, "Central bank rate +0.5% on the first 1000, +1% on the remainder, both non-negotiable."),
          q("Both hands-on exercises are verified afterward via…", ["deleting and rebuilding the product", "the relevant Classic Product Builder menu, to view the product and conditions as generated in AA", "the Teller menu", "a support ticket"], 1, "Same pattern as the morning's Loan hands-on."),
        ],
      },
    ],
    assessment: [
      q("Building a loan product starts by linking it to…", ["a customer", "its Product Group and Product Parent", "a limit", "a branch"], 1, "This determines what's inherited vs still to be defined."),
      q("Customer/Account conditions (EM.PRDL.CUST.ACCT) are…", ["inherited automatically", "always defined per product", "optional", "set at Global Conditions level"], 1, "Never inherited."),
      q("Limit Type = Default auto-creates limits under…", ["a single fixed reference", "predefined LIMIT.REFERENCE records 8300–8499", "the customer's own reference", "no reference at all"], 1, "8300/8399 non-revolving; 8400/8499 revolving."),
      q("TERM.AMOUNT conditions are defined…", ["once per product", "once per currency the product allows", "once per customer", "once per branch"], 1, "Each currency has its own default/min/max term and amount."),
      q("Constant repayment type requires…", ["only an Interest property", "both an Account and an Interest property", "no properties", "a Charge property"], 1, "Used for 'Annuity' arrangements — equal instalments."),
      q("Flat interest is calculated on…", ["the outstanding balance", "the original commitment amount (TOTCOMMITMENT)", "the penalty balance", "the collateral value"], 1, "Reducing Balance instead uses CURACCOUNT, the actual outstanding balance."),
      q("A penalty interest condition name is always prefixed…", ["'pen'", "'empen'", "'penint'", "no prefix"], 1, "Keeps it visually distinct from principal interest condition names."),
      q("Six predefined Lending charge properties include…", ["Ageing Bill, Disbursement, New Arrangement, Principal Decrease, Payoff, Maintenance Fee", "Interest, Term, Amount, Currency, Limit, Eligibility", "Customer, Account, Officer, Branch, Product, Group", "Design, Build, Test, Deploy, Review, Publish"], 0, "Each set to Yes / No / Not Applicable, optionally per currency."),
      q("Eligibility Conditions (EM.PRDL.ELIGIBILITY) run via…", ["the AA rules engine", "a local Inclusive Banking application", "the Teller module", "COB"], 1, "Extra rules can still layer on the AA rules engine if genuinely needed."),
      q("Once published, most product conditions are maintained via…", ["the product wizard", "the AA Core product builder — except Settlement, Eligibility and Limit, which keep their own maintenance versions", "deleting and recreating the product", "the Teller menu"], 1, "EM.PRDL.SETTLEMENT,CATEG.CHANGE / EDIT.STANDALONE / LIMIT.CHANGE respectively."),
      q("Global Product Parameters (EM.PRODUCT.PARAMETERS) record id is…", ["the product code", "SYSTEM", "the branch code", "the currency code"], 1, "One bank-wide record for every loan product."),
      q("Product build stage owners are assigned via…", ["PW.PARTICIPANT", "EM.PRODUCT.PARAMETERS", "AA.PRD.DES.TERM.AMOUNT", "the Eligibility tab"], 0, "An individual user, a user group, or a department."),
      q("The three deposit product types are…", ["Fixed, Variable, Hybrid", "Term Deposits, Call/Notice Deposits, Savings Plans", "Current, Savings, Share", "Individual, Joint, Group"], 1, "Call Deposits are built via core AA Deposits."),
      q("A Savings Plan's amount at the Term/Amount stage maps to…", ["TOTCOMMITMENT", "Payment Schedule's ACTUAL.AMT field", "the collateral value", "nothing"], 1, "Bills generate as EXPECTED online at COB on the regular deposit date."),
      q("A Savings Plan Bonus Restriction charge can…", ["only cancel the product", "waive the bonus completely or pay it at a lower rate", "increase the bonus", "close the account"], 1, "Needs an Overdue product condition to monitor delinquency."),
      q("Retail account category ranges are…", ["Current 1000–1099, Savings 6000–6099, Shares 7300–7399", "one shared range", "reversed from Loans", "set per branch"], 0, "Up to 300 account products across them."),
      q("An account's overdraft limit record is…", ["created manually every time", "auto-created at account opening, Limit Serial always NEW", "only for Savings accounts", "unrelated to AA"], 1, "Managed through AA thereafter."),
      q("NO.UNAUTH.DEBIT queues an overdraft for review after…", ["1 event", "3 out-of-order (unauthorised overnight debit) events", "10 events", "any referral"], 1, "Payment items like referrals don't count."),
      q("An account is flagged Inactive at COB via…", ["the Dormancy stage only", "the COMPANY record's Inactivity Months field (if no user-defined statuses exist)", "the Review Frequency", "Change Product"], 1, "ACCT.INACTIVE.RESET removes the flag."),
      q("A Change Product condition requires…", ["nothing special", "both products to belong to the same product group", "a separate product line", "manual customer consent every time"], 1, "e.g. Children's Savings → Regular Savings on the 18th birthday."),
    ],
  },
  {
    id: "tft-day3",
    code: "TFT-D3",
    title: "Temenos Functional Training (TFT) — Day 3",
    description: "Origination Overview & Common Parameters (Loans/Deposits/Accounts), Guarantor Parameters, Credit Scoring, and Income-Expenditure & Loan Stress Testing — straight from the Sep 2026 TLC materials, including both official trainer quizzes.",
    sections: [
      {
        id: "tftD3-1", title: "Origination Overview & Common Parameters",
        description: "How Origination is structured across Loans, Deposits and Accounts, and the core Stage, Application Status and main Parameters tables that drive it.",
        concepts: ["tftOROverview", "tftORParamTables", "tftORStage", "tftORAppStatus", "tftORLDAParams"],
        quiz: [
          q("Loan and Account origination support which customer types?", ["Individuals only", "Individuals, Groups and SMEs", "SMEs only", "Groups only"], 1, "Deposits support only Individuals and SMEs — no group deposit origination."),
          q("The seven origination parameter tables are prefixed EM.XX, where XX means…", ["a random 2-letter code", "LO/DO/AO/FO for Loan/Deposit/Account/Facility Origination", "the branch code", "the currency code"], 1, "EM.XX.STAGE, EM.XX.APPLICATION.STATUS, EM.XX.PARAMETERS, EM.XX.APPROVAL, EM.XX.STAGE.CHECKLIST, EM.XX.DOCUMENT, plus PW.ACTIVITY/PW.PARTICIPANT."),
          q("If an origination stage is marked 'Optional,' which of the following is correct?", ["The stage could be marked as Required, Optional or Not Required on the Origination Parameters table.", "The stage could be marked only as Not Required on the Origination Parameter table.", "The stage could be marked only as Optional on the Origination Parameter table."], 0, "Official trainer quiz (Common Origination Parameters, Q1) — Required / Not Required / Optional are all valid Stage Option settings."),
          q("A bank requires that when a group applies for a loan, the amount applied for should be shared equally among group members, but changes should be allowed. How can this be achieved?", ["By setting Group Amount field in Origination Parameter table to 'Divide Evenly'.", "By setting Group Amount field in Origination Parameter table to 'Flexible'.", "By setting Group Amount field in Origination Parameter table to 'None'."], 1, "Official trainer quiz (Common Origination Parameters, Q2) — Flexible divides evenly by default but still allows user redistribution, as long as the group total tallies; Divide Evenly forbids any change."),
          q("Each stage in the origination workflow, if left blank in the Stage Option field, means…", ["it is skipped entirely", "it is required and cannot be skipped", "it is optional", "none of the above"], 1, "A blank Stage Option is treated as Required."),
          q("SLA in origination is currently tracked in…", ["hours", "days", "weeks", "business quarters"], 1, "With an optional SLA Tolerance and an SLA Escalation path to a PW.PARTICIPANT record."),
          q("A status-within-status model means…", ["Process Status is the lower level, Application Status the higher", "Process Status is the higher level, Application Status is scoped within it", "the two are identical", "only one status exists per application"], 1, "e.g. under Process Status 'Applied', Application Input has its own statuses like 101 'input complete'."),
          q("The 'Refer To' field on an Application Status record…", ["deletes the application", "transfers processing of that stage to a valid PW.PARTICIPANT role", "is only used for Deposits", "closes the loan"], 1, "e.g. an approving officer referring a decision up to CEO or Branch Operations Manager."),
          q("Group Amount = 'Divide Evenly' on EM.LO.PARAMETERS means…", ["members can redistribute the amount freely", "every group member gets an equal, fixed share with no user changes allowed", "group processing is disabled", "only the total group amount matters, not individual shares"], 1, "Flexible is the alternative — evenly split by default, but redistribution is allowed as long as the group total still tallies."),
          q("Deposit/Account 'Skip Approval for Authorized Users' set to Yes means…", ["the approval stage is never presented, regardless of amount", "REVIEW.APPROVAL can never be marked Required — it's skipped whenever the amount is within the current user's own approval limit", "all deposits skip approval unconditionally", "approval always requires two users"], 1, "Set to No, the approval stage can never be skipped."),
        ],
      },
      {
        id: "tftD3-2", title: "Workflow, SLA, Facility & Approval Parameters",
        description: "How Workflow/SLA/Other Parameters tabs combine, Facility Origination's own eligibility tab, and single/dual approval tiers for loans, deposits and accounts.",
        concepts: ["tftORWorkflowSLA", "tftOROther", "tftORFacilityEligibility", "tftORApproval", "tftORSingleDualApproval"],
        quiz: [
          q("When SLA is breached, origination can escalate this to a group of officers in the bank. Where is the group of officers defined in the system?", ["In the ESCALATION.OFFICERS table.", "In the SLA.DAO table.", "In the PW.ACTIVITIES table.", "In the PW.PARTICIPANT table."], 3, "Official trainer quiz (Common Origination Parameters, Q3) — the SLA Escalation field must resolve to a valid PW.PARTICIPANT record."),
          q("In the current release of the system, when an application is marked as 'Expired Before Approval,' what actions can the bank take on the application?", ["Nothing, the system has already closed the application.", "The bank can decide to close the application or process it further.", "The application must be referred to CEO as he or she is the only person who can approve further processing.", "None of the above."], 1, "Official trainer quiz (Common Origination Parameters, Q4)."),
          q("A bank requires that if a user selects an application status that puts origination on hold at any stage in the process, then the user should be made to enter the reason for selecting such a status. How can this be implemented in Financial Inclusion?", ["The user should be trained to enter notes.", "The field 'Notes Required' should be checked in EM.XX.APPLICATION.STATUS table.", "The 'Refer To' field in EM.XX.APPLICATION.STATUS table should dynamically open and allow user to enter notes.", "This is impossible since EM.XX.APPLICATION does not support user notes."], 1, "Official trainer quiz (Common Origination Parameters, Q5)."),
          q("Leaving Review/Approval's Default Status blank on the Workflow Parameters tab is deliberate because…", ["it's a system bug", "it forces the approving officer to actively choose Approved / Provisionally Approved / Declined rather than letting a status default in unnoticed", "approval doesn't need a status", "it disables the stage"], 1, "Every other stage may carry a sensible default; approval decisions must always be an intentional choice."),
          q("Refer Status + Refer To on the Other Parameters tab…", ["has no automated effect", "auto-refers the stage to the indicated PW.PARTICIPANT the moment that status is selected", "only applies to Deposits", "requires a manual email to be sent"], 1, "Removes the need for the user to manually reassign the stage."),
          q("A Facility Origination record id (e.g. for an Overdraft) follows the convention…", ["<FACILITY>-<PRODUCT>-<DATE>", "<PRODUCT ID>-<FACILITY>-<ACTION>", "<ACTION>-<PRODUCT ID>", "a random 6-digit code"], 1, "e.g. Current-Overdraft-New."),
          q("Facility Eligibility's Minimum Customer Age check type can require…", ["only one universal minimum age for everyone", "different minimum ages with vs without parental consent, each optionally tied to a checklist item", "no age checks at all", "a maximum age only"], 1, "e.g. min_age_with_consent 16 (with a Parental Consent checklist item) vs min_age_no_consent 18."),
          q("Application Approval thresholds are defined per…", ["branch", "currency, with tiered Amount Above bands and a PW.PARTICIPANT approver at each tier", "customer type only", "product group only, never per product"], 1, "Where both product and product-group records exist, the product-level definition takes priority."),
          q("Group Amount Approval vs Member Amount Approval (group loans) determines whether the approval check compares…", ["the branch limit vs the bank limit", "the total group loan amount vs each individual member's amount, against the approval thresholds", "the interest rate vs the fee", "nothing — they're identical"], 1, "Set on the EM.XX.APPROVAL record's Group Approval field."),
          q("In Single vs Dual Loan Approval, when an amount exceeds a single member's limit but not the dual limit…", ["the loan is automatically rejected", "the first officer refers it to a colleague in the same approval group for joint approval", "it must go to the CEO", "it is automatically approved"], 1, "Technically the first officer doesn't approve at all — just refers to a colleague for dual sign-off."),
        ],
      },
      {
        id: "tftD3-3", title: "Checklist, Documents, Stage Owners & Global Parameters",
        description: "Stage checklists and the checklist master file, application document production, stage ownership and segregation of duties, and the SYSTEM-wide Global Product Parameters table.",
        concepts: ["tftORChecklist", "tftORDocuments", "tftORStageOwners", "tftORGlobalParams"],
        quiz: [
          q("When the deposit amount applied for by any customer reaches a particular threshold, the bank wants Deposit Origination to automatically require applicable supporting documents from customers. Is this possible in Financial Inclusion?", ["No, the user must manually manage this requirement.", "Yes, the system can manage the requirement, but it will not automatically require the documents.", "Yes, the threshold can be configured in GIC.CHECKLIST.MASTER and the appropriate field must be checked in EM.DO.PARAMETERS.", "Yes, only achieved through a local development at implementation time."], 2, "Official trainer quiz (Common Origination Parameters, Q6) — GIC.CHECKLIST.MASTER's Applicable Amount field drives this."),
          q("In Financial Inclusion Deposit Origination, what does the field 'Skip Approval for Authorized Users' mean on the table EM.DO.PARAMETERS?", ["When an application is being processed, authorized users are not allowed to approve the application.", "The approval stage will be presented to authorized users and they can then decide to skip it or execute it.", "If this field is checked, then Origination will not present the approval stage to the user if the user has permission to authorize the amount of the deposit.", "If this field is not checked, then the current user will be allowed to approve all deposit applications irrespective of the amount."], 2, "Official trainer quiz (Common Origination Parameters, Q7)."),
          q("A checklist item's 'Item Override' field left blank means…", ["the item can be freely skipped", "the item can never be skipped — the inputter must confirm it was actually received", "the item is optional for guarantors only", "the item is auto-generated"], 1, "Set to Yes, a user can override it, but must enter a mandatory note explaining why."),
          q("GIC.CHECKLIST.MASTER's 'Bring Forward' attribute means an unsatisfied checklist item…", ["blocks the application permanently", "moves forward to the next stage instead of blocking, if overridden", "is deleted", "triggers an SLA breach immediately"], 1, "Paired with Item Override = Override at stage level."),
          q("Document production via EM.XX.DOCUMENT can go through…", ["only the Delivery module", "Document Output or the Delivery module, per Production Method", "email only", "SMS only"], 1, "Generated documents land in the customer's Document repository, viewable from the Document tab of SCV."),
          q("Stage Owners are managed via the Meatballs menu using…", ["Change Stage Owner and Amend Owner Details", "Delete Stage and Rebuild Stage", "Publish and Proof", "Approve and Reject"], 0, "Change Stage Owner points a stage at a different PW.ACTIVITY record; Amend Owner Details edits that owner's PW.PARTICIPANT membership."),
          q("Segregation of duties (Completed Stage / Exclusive Stage fields) exists mainly for…", ["large institutions with dedicated teams per stage", "small institutions where the same small team handles all stages but still needs maker-checker controls", "removing all approval requirements", "customer self-service only"], 1, "Identified Super Users are exempt from the rule and can complete all stages."),
          q("Global Product Parameters (EM.PRODUCT.PARAMETERS) record id is always…", ["the product code", "SYSTEM", "the branch mnemonic", "the customer number"], 1, "One bank-wide record shared across every loan/deposit/account product."),
          q("The Savings Multiplier tab of Global Product Parameters is used to…", ["set the interest rate", "configure shadow limits — a savings balance × multiplier factor — as a lighter alternative to the full Transact limit module", "block guarantor accounts", "define checklist items"], 1, "Configured per account category, with a limit multiplier, error type, and the loan products it applies to."),
        ],
      },
      {
        id: "tftD3-4", title: "Common Origination Hands-On",
        description: "Configuring full loan and deposit origination parameters end to end, against a set of realistic business requirements.",
        concepts: ["tftORHandsOn"],
        quiz: [
          q("The hands-on Loan practice starts from…", ["a blank product", "a product already built in the Product Builder course, then origination parameters are layered on via Manage Origination", "the Credit Scoring module", "the Guarantor module"], 1, "Path: Administration > Products > Loan Origination > Manage Origination."),
          q("'Group amount and term always even among group members, but changes should be allowed' maps to…", ["Group Amount = Divide Evenly, Group Term = Uniform", "Group Amount = Flexible, Group Term = Flexible", "Group Amount = None", "no configuration needed"], 1, "Divide Evenly/Uniform would forbid any redistribution, which contradicts 'changes should be allowed'."),
          q("The Deposit practice's proof-of-funds requirement is configured via…", ["a hard-coded system rule", "GIC.CHECKLIST.MASTER's Applicable Amount plus the matching field in EM.DO.PARAMETERS", "the Guarantor module", "the Credit Scoring score card"], 1, "Triggered once the deposit amount reaches the configured threshold (e.g. USD 50,000)."),
        ],
      },
      {
        id: "tftD3-5", title: "Guarantor Parameters",
        description: "Configuring who can guarantee a loan, how much of their account gets blocked, and how guarantors are excluded, released and recorded.",
        concepts: ["tftGUOverview", "tftGUParams", "tftGUExcludeRelease", "tftGUExternal"],
        quiz: [
          q("Guarantor functionality's four delivered tables include EM.LO.GUARANTOR.PARAM plus…", ["EM.GU.CONDITION, EM.GU.REASON.RELEASE, EM.LO.GUARANTOR", "EM.LOAN.CONDITIONS, EM.LOAN.REASONS, EM.LOAN.GUARANTOR.MASTER", "just one other table", "AA.GUARANTOR only"], 0, "EM.LOAN.GUARANTORS is the fifth, system-maintained file recording who actually guarantees which loan."),
          q("Blocking Mode 'Proportional' on EM.LO.GUARANTOR.PARAM means…", ["every guarantor's account is blocked by the same amount", "each guarantor's blocked amount scales with their share of the total guaranteed amount", "no blocking occurs", "only the largest guarantor is blocked"], 1, "Equal mode is the alternative — same amount blocked in every guarantor's account."),
          q("'Accept Amt GT AC Bal' set to Override means…", ["the system rejects a guaranteed amount greater than the guarantor's balance", "the system allows it, with a warning message", "the guarantor's account is automatically topped up", "guarantors can never guarantee more than their balance"], 1, "Set to Error, the amount would instead be rejected."),
          q("A condition in EM.GU.CONDITION set to Action = Error…", ["stops the application outright if the condition is true for a prospective guarantor", "just shows a warning and lets the user continue", "only applies to internal guarantors", "has no effect"], 0, "Action = Override instead shows a warning message but still allows the user to proceed."),
          q("Min. No. of Guarantors per Loan greater than 0…", ["has no effect on the workflow", "makes the Guarantor stage of Loan Origination (or the Guarantor tab of Direct Loan) mandatory", "disables guarantors entirely", "only applies to group loans"], 1, "A significant figure here is what actually turns on the mandatory guarantor requirement."),
          q("On Group Exit, if a group member (implicit guarantor) has unpaid approved loans, the bank can configure the system to…", ["always release the guarantor regardless", "release the guarantor (if no unpaid loan) or refuse the exit until outstanding loans are paid", "automatically write off the loan", "transfer the loan to another group member"], 1, "Configured via the On Group Exit field of EM.LO.GUARANTOR.PARAM."),
          q("External guarantor record ids in EM.LO.GUARANTOR…", ["are free-text with no validation", "start with 'G' followed by 6 characters, mnemonic-validated against CUSTOMER", "must match the loan's category code", "are auto-generated sequential numbers"], 1, "Basic mnemonic validation ensures a new external guarantor doesn't already exist as a customer."),
          q("Category ranges used for guarantor account locking are configured in…", ["EM.GU.CONDITION", "Global Product Parameters (EM.PRODUCT.PARAMETERS), Guarantor Parameters tab", "the Credit Scoring module", "PW.PARTICIPANT"], 1, "This is the same SYSTEM-level table used for eligibility, reschedule, group-limit and savings-multiplier settings."),
        ],
      },
      {
        id: "tftD3-6", title: "Credit Scoring Parameters",
        description: "How Data Types, Data Groups, Ratios, Score Data, the Score Card, Score Limit and Score Transaction tables work together, and how values are auto-mapped from T24.",
        concepts: ["tftCSTables", "tftCSScoreCard", "tftCSScoreLimitTxn", "tftCSDataMapping"],
        quiz: [
          q("A bank wants to ensure that if a customer fails a particular data type test, he does not pass credit scoring. How can this be achieved?", ["By setting the score for that data type to -100", "By making sure the data type is the first to be defined in the score card so the user can quickly see the score and fail the customer if necessary", "By setting the score of the data type as low as possible to ensure the entire result is a failure", "This cannot be achieved with credit scoring, a local development is required"], 0, "Official trainer quiz (Credit Scoring, Q1) — with a 100-point total, -100 guarantees the aggregate score cannot pass."),
          q("A bank wants Loan Origination to suggest amount values to approve for each client's loan application. How should the consultant set this up?", ["Configure credit scoring and set up the SA.LIMIT.RECOMMEND table", "Configure credit scoring and set up the SA.SCORE.LIMIT table", "Configure credit scoring and set up the EM.LIMIT.SUGGEST table", "Discourage the bank from doing this because the system could suggest misleading figures and the bank's books may be negatively affected"], 1, "Official trainer quiz (Credit Scoring, Q2) — SA.SCORE.LIMIT is the cumulative-frequency recommended-limit table."),
          q("What is the significance of the Credit Scoring Data Mapping Table?", ["To ensure that the user does not have to manually enter data that can be obtained from Financial Inclusion tables", "To minimize the chances of errors in manual data input by users", "To quicken the process of credit scoring by reducing the time in finding the right data values for each data type", "All of the above"], 3, "Official trainer quiz (Credit Scoring, Q3)."),
          q("Data Groups and Ratios (SA.DATA.GROUP / SA.RATIOS) in the Inclusive Banking Model Bank configuration are…", ["heavily used for every product", "not used — they exist for institutions needing more elaborate scoring logic than the standard Data Types", "mandatory for every score card", "only for deposits"], 1, "Refer to the SALES.ADMINISTRATION user guide for how to use them if an institution needs to."),
          q("On the Score Card, AND is used to…", ["evaluate different possible values within a single data type", "combine all data-type scores together into the overall aggregate score", "disable a data type", "reverse the sign of a score"], 1, "OR is used within one data type's different value ranges, e.g. Age 18–26 OR Age 27–40."),
          q("Score Limit's last multi-value entry in the Upto Score field must be…", ["the highest possible numeric score", "REST — meaning any score above the last defined threshold", "left blank", "0"], 1, "So every possible score, however high, always maps to a recommended limit."),
          q("Calc.Score = Yes on a Score Transaction (SA.SCORE.TXN) record triggers…", ["nothing until manually run", "the system to generate the aggregate score (AGG.SCORE) and recommended limit (REC.LIMIT)", "deletion of the transaction", "an SLA escalation"], 1, "The data values feeding it come from the data types defined for that product's Score Data."),
          q("EM.LO.CS.SA.DATA.MAPPING's Source Field accepts…", ["any T24 field name", "CUSTOMER.ID, APPLICATION.ID, EM.INC.EXP.ID or EXTERNAL", "only CUSTOMER.ID", "only EXTERNAL"], 1, "EXTERNAL means the value is entered manually at credit scoring stage rather than auto-mapped."),
        ],
      },
      {
        id: "tftD3-7", title: "Credit Scoring Hands-On",
        description: "Building a full six-data-type score card and matching recommended-limit table for a personal loan product.",
        concepts: ["tftCSHandsOn"],
        quiz: [
          q("The hands-on Credit Scoring practice uses which seven data types?", ["Age, Gender, MaritalStatus, NetIncome, NoOfGuarantors, TotalCountArrears, StressRatio", "Income, Expenditure, Debt, Collateral, Term, Amount, Currency", "Only Age and Income", "Residence, BusinessType, LoanPurpose, CreditIndicator, CollateralValue, NetIncome, Age"], 0, "Solution built under product Id 'PersonalLoan'."),
          q("In the worked solution, an applicant under 18 receives…", ["a low positive score", "Fx Score -100, guaranteeing automatic failure against the 100-point total", "no score at all", "an override message only, no score change"], 1, "The same '-100 workaround' explained in the official quiz's Q1."),
          q("The practice's Score Limit table's top band (REST) must…", ["exceed the product's maximum loan amount", "not exceed the maximum amount the underlying loan product actually allows", "always equal exactly 10,000", "be left at 0.00"], 1, "Verified by checking the recommended limit against the product's own Term/Amount conditions."),
        ],
      },
      {
        id: "tftD3-8", title: "Income-Expenditure & Loan Stress Testing",
        description: "Building an applicant's income/expenditure profile, and stress-testing it against a worse financial position or a mortgage rate rise for Debt-to-Income and Mortgage Service Ratio calculations.",
        concepts: ["tftIETables", "tftIEStressTesting"],
        quiz: [
          q("Household income and expenditure types are basic tables used to…", ["set interest rates", "break down an applicant's income and expenditure profile as finely as the institution needs", "define checklist items", "configure the Guarantor module"], 1, "e.g. separating Wages/Salary from Grants, or Food from Housing-Mortgage."),
          q("Secondary Debt Type differs from Primary Debt Type in that it covers…", ["debts directly owed by the applicant", "debts owed by others that the applicant guarantees (e.g. as a co-signer)", "only mortgage debt", "only business debt"], 1, "Primary = the applicant's own debt (e.g. Electricity Arrears)."),
          q("Loan Stress Testing rules are configured in…", ["EM.INC.EXP directly", "EB.PARAM > ALL-LO.DEBT.TO.INCOME.RATIO.RULES", "the Guarantor module", "the Credit Scoring Score Card"], 1, "Covering both mortgage (MSR) and non-mortgage (DTI) loans."),
          q("The dashes ('--') notation in an income/expenditure stressing value (e.g. HI-WAGE--90) means…", ["0% of that income/expense is included", "100% of the (unstressed) portion is included for testing purposes", "the item is excluded from testing", "a data entry error"], 1, "The trailing number (90) is the stress factor applied — here, only 90% of wage income counted."),
          q("MSR (Mortgage Service Ratio) stress testing differs from DTI in that it…", ["never stresses income", "includes an interest-rate stress element (Stress MSR Repayment Interest) that DTI testing doesn't have", "only applies to consumer loans", "ignores expenditure entirely"], 1, "The rate is increased by the configured value and a new repayment recalculated to check affordability."),
          q("For stress-testing calculations to actually run, EB.PARAM > ALL-EM.INCOME.EXPENDITURE's 'Create separate income/expenditure per application' must be set to…", ["N", "Y", "either, it makes no difference", "SYSTEM"], 1, "Set to Y, records are created per loan application, which stress testing requires."),
          q("DTI Loan Amount Threshold is used to…", ["set the minimum guarantor cover", "exclude non-mortgage loans below a certain amount from DTI testing", "cap the mortgage interest rate", "define the checklist item threshold"], 1, "MSR (mortgage) product groups are tested regardless of a separate amount threshold."),
        ],
      },
    ],
    assessment: [
      q("Loan and Account origination support Individuals, Groups and SMEs; Deposit origination supports…", ["only Individuals", "only Individuals and SMEs — no Groups", "only Groups", "all four including corporates"], 1, "There is no group deposit origination in Inclusive Banking."),
      q("If an origination stage is marked 'Optional,' which is correct?", ["A stage could be Required, Optional or Not Required on the Origination Parameters table.", "A stage could be marked only Not Required.", "A stage could be marked only Optional."], 0, "From the official Common Origination Parameters quiz."),
      q("A bank wants a group loan amount split equally among members but still changeable. The correct Group Amount setting is…", ["Divide Evenly", "Flexible", "None"], 1, "Divide Evenly forbids any redistribution; Flexible allows it as long as the total tallies."),
      q("SLA breach escalation in origination notifies…", ["a fixed hard-coded email address", "the group of officers defined in the PW.PARTICIPANT table", "the customer directly", "no one automatically"], 1, "Via Task Management, per the SLA Escalation field on EM.XX.STAGE."),
      q("An application marked 'Expired Before Approval' can be…", ["only closed automatically, nothing else possible", "closed by the bank, or processed further at the bank's discretion", "only referred to the CEO", "reopened automatically after 24 hours"], 1, "From the official Common Origination Parameters quiz."),
      q("To require a user to explain why they put an application on hold, the bank should…", ["train users informally", "check 'Notes Required' on the relevant EM.XX.APPLICATION.STATUS record", "rely on the Refer To field alone", "disable the Hold action entirely"], 1, "From the official Common Origination Parameters quiz."),
      q("A Facility Origination (e.g. Overdraft) record id follows the pattern…", ["<ACTION>-<PRODUCT>", "<PRODUCT ID>-<FACILITY>-<ACTION>", "a random code", "<FACILITY>-<DATE>"], 1, "e.g. Current-Overdraft-New."),
      q("Auto-requiring supporting documents once a deposit reaches a threshold amount is achieved by…", ["manual user judgement only", "configuring the threshold in GIC.CHECKLIST.MASTER and checking the matching field in EM.DO.PARAMETERS", "a local development, always", "it cannot be configured"], 1, "From the official Common Origination Parameters quiz."),
      q("Deposit's 'Skip Approval for Authorized Users' checked means…", ["approval is skipped for every user regardless of amount", "the approval stage is not presented if the user's own authority already covers the deposit amount", "approval can never be skipped", "only branch managers can approve"], 1, "From the official Common Origination Parameters quiz."),
      q("Stage owners are assigned/amended via the Meatballs menu using…", ["Change Stage Owner and Amend Owner Details", "Publish and Proof", "Approve and Escalate", "Delete and Rebuild"], 0, "The first points at a different PW.ACTIVITY record; the second edits that owner's PW.PARTICIPANT membership."),
      q("Global Product Parameters (EM.PRODUCT.PARAMETERS) is always keyed by…", ["the product code", "SYSTEM", "the branch mnemonic", "the customer number"], 1, "One bank-wide record shared across every loan/deposit/account product."),
      q("The four Guarantor delivered tables include EM.LO.GUARANTOR.PARAM, EM.GU.CONDITION, EM.GU.REASON.RELEASE and…", ["EM.LO.GUARANTOR", "AA.GUARANTOR", "EM.LOAN.CONDITIONS", "EM.CS.GUARANTOR"], 0, "Plus the system-maintained EM.LOAN.GUARANTORS."),
      q("Blocking Mode 'Proportional' for guarantors means…", ["every guarantor blocks the same amount", "each guarantor's blocked amount scales with their share of the total guaranteed amount", "no blocking occurs", "only one guarantor is ever blocked"], 1, "Equal mode is the alternative."),
      q("A bank wants a customer to automatically fail credit scoring if a data type test fails. The correct approach is…", ["set the score for that data type to -100", "put the data type first on the score card", "set the score as low as possible", "this requires a local development"], 0, "From the official Credit Scoring quiz."),
      q("To have Loan Origination suggest a recommended amount per application, the consultant configures…", ["SA.LIMIT.RECOMMEND", "SA.SCORE.LIMIT", "EM.LIMIT.SUGGEST", "this is discouraged and not possible"], 1, "From the official Credit Scoring quiz — a cumulative frequency table of score bands to recommended limits."),
      q("The significance of the Credit Scoring Data Mapping Table is…", ["only to reduce manual entry", "only to reduce input errors", "only to speed up scoring", "all of the above"], 3, "From the official Credit Scoring quiz."),
      q("On a Score Card, AND combines…", ["values within one data type", "all data-type scores into the overall aggregate score", "nothing, it's unused", "only guarantor-related scores"], 1, "OR is instead used across a single data type's own value ranges."),
      q("Score Limit's final band must always be…", ["a specific number like 100", "REST, meaning any score above the last defined threshold", "left blank", "equal to the loan amount"], 1, "So every score maps to some recommended limit."),
      q("EM.LO.CS.SA.DATA.MAPPING's Source Field EXTERNAL means…", ["the value is fetched from an external bureau automatically", "the value must be entered manually at credit scoring stage", "the field is ignored", "it maps from APPLICATION.ID"], 1, "The other valid values are CUSTOMER.ID, APPLICATION.ID and EM.INC.EXP.ID."),
      q("DTI (Debt-to-Income) testing applies to…", ["mortgage loans only", "non-mortgage loan product groups configured in DTI Loan Product Groups", "every loan regardless of configuration", "deposits only"], 1, "MSR (Mortgage Service Ratio) testing is the separate, mortgage-specific counterpart, which also stresses the interest rate."),
      q("The dashes ('--') in a stressing value like HI-WAGE--90 mean…", ["0% of that income is included", "100% of the (unstressed) portion is included before the stress factor is applied", "the income type is excluded", "a formatting error"], 1, "The trailing 90 then stresses that included portion down to 90%."),
      q("For loan stress-testing calculations to run, EB.PARAM > ALL-EM.INCOME.EXPENDITURE's per-application flag must be set to…", ["N", "Y", "SYSTEM", "it doesn't matter"], 1, "Records must be created per loan application (not just per customer) for stress testing to calculate."),
    ],
  },
  {
    id: "tft-day4",
    code: "TFT-D4",
    title: "Temenos Functional Training (TFT) — Day 4",
    description: "Loan Application Processing end to end — Application Input, Eligibility, Guarantor, Collateral, Credit Scoring, Credit Assessment, Review/Approval, Offer Production, Loan Creation and Disbursement (individual and group), plus reports and Direct Loan — straight from the Sep 2026 TLC materials.",
    sections: [
      {
        id: "tftD4-1", title: "Loan Application — Input & Custom Schedules",
        description: "The Application Input stage's tabs, the loan action/customer type choices, custom payment schedules, application status/override behaviour, and group applicants.",
        concepts: ["tftLAOverview", "tftLAInputAccess", "tftLAInputTabs", "tftLASettlementChecklist", "tftLACustomSchedules", "tftLAAppStatusOverride", "tftLAGroupApplicant"],
        quiz: [
          q("The loan application process runs through the application called…", ["EM.LO.PARAMETERS", "EM.LO.APPLICATION", "AA.ARR.APPLICATION", "EM.LOAN.PROCESS"], 1, "Its nine possible stages are switched on/off per product via EM.LO.PARAMETERS."),
          q("Loan Origination can be launched from…", ["only the Single Customer View", "only the Loan Service Agent page", "either the Single Customer View or the Loan Service Agent page", "only the command line"], 2, "SCV's Portfolio tab (Financial Products > New Loan Application) or the Loan Service Agent's own dashboard tile."),
          q("The Loan Action field lets a user choose…", ["multiple actions per application", "exactly one of New Loan / Refinance / Reschedule / Top-up", "only New Loan, always", "the interest rate type"], 1, "Refinance, Reschedule and Top-up all require selecting the existing loan via 'For Arrangement'."),
          q("The Asset Class field on Application Input displays…", ["the loan's collateral type", "the worst overdue status across all the customer's existing loans", "the customer's credit score", "the product category"], 1, "Informs the user of risk context before a Loan Action is even chosen."),
          q("On the Settlement tab, leaving an account field (Disburse/Repay/Charge) empty means…", ["that activity errors out", "that activity is processed manually instead of automatically", "the application cannot be committed", "the account defaults to the branch's own account"], 1, "Filled fields = automatic processing when the activity falls due."),
          q("Selecting 'Custom' as Repayment Frequency at Application Input…", ["is rejected immediately", "opens a temporary Arrangement for negotiating a bespoke schedule via AA.ARR.PAYMENT.SCHEDULE", "skips the Loan Creation stage entirely", "only works for group loans"], 1, "The temporary Arrangement is deleted at Loan Creation; the negotiated schedule carries onto the real one."),
          q("Application Status codes like 103 'Waiting for information' or 105 'Pending customer interview'…", ["complete the stage automatically", "put the origination process on hold until the expected action completes", "cancel the application", "are only used for group loans"], 1, "Behaviour per code is configured in EM.LO.APPLICATION.STATUS."),
          q("For a Group applicant, the total Amount Requested is…", ["applied individually with no sharing logic", "shared among group members per the product's Group Amount setting", "always split exactly evenly with no exceptions", "not permitted — groups can't request one total"], 1, "Divide Evenly vs Flexible, configured back in the product's Loan Origination Parameters."),
          q("If a loan product was built for automatic disbursement but the user leaves Disburse Account empty…", ["nothing happens differently", "an override message says automatic disbursement will be disabled for that customer", "the application is rejected outright", "the loan disburses anyway"], 1, "The reverse also fires: manual products where an account IS supplied trigger an override that automatic disbursement will instead be triggered."),
        ],
      },
      {
        id: "tftD4-2", title: "Eligibility, Guarantor & Collateral Input",
        description: "How Eligibility Check, Guarantor Input (including external guarantors and documents), Credit Check, and Collateral Input behave for individual and group applicants.",
        concepts: ["tftLAEligibilityCheck", "tftLAGuarantorInput", "tftLAGuarantorDocs", "tftLACreditCheck", "tftLACollateralInput"],
        quiz: [
          q("Eligibility Check results are listed per criterion as…", ["Pass/Fail only", "Passed or Warning (with a message)", "Approved/Declined", "a single overall score"], 1, "Whether a Warning actually blocks progress depends on that rule's own Error/Override configuration."),
          q("For a group application's eligibility check…", ["only the first member is checked", "every member of the group is listed and checked individually", "the group is checked as one combined entity only", "eligibility doesn't apply to groups"], 1, "Committing can surface one override message per failing member."),
          q("External guarantor record ids in EM.LO.GUARANTOR always…", ["match the customer number format", "start with the letter 'G'", "are numeric only", "start with 'EXT'"], 1, "So an external (non-customer) guarantor is always visually distinct from a real customer id."),
          q("Add Loan Guarantors opens a new record in…", ["EM.LO.GUARANTOR.PARAM", "EM.LOAN.GUARANTORS, id CustomerNumber-LoanOriginationId", "EM.GU.CONDITION", "AC.LOCKED.EVENTS directly"], 1, "AC.LOCKED.EVENTS is instead where the actual fund-locking happens once an internal guarantor's account is blocked."),
          q("For external guarantors, an amount shown as 'to be blocked'…", ["actually blocks funds in a bank account", "is informational only — there's no account to block against", "triggers an SLA breach", "is always zero"], 1, "Only internal (customer) guarantors have an actual account that gets locked via AC.LOCKED.EVENTS."),
          q("EACH.MEMBER.GUARANTOR set to Yes on a group application…", ["disables guarantor input for the group", "auto-presents every group member's own guarantor-detail fields for input", "only applies to external guarantors", "requires a single shared guarantor for the whole group"], 1, "Each member gets their own set of fields rather than one shared guarantor record."),
          q("One scanned guarantee document (e.g. a promissory note) via ELO.GU.DOCUMENT…", ["can only ever guarantee one loan", "can be used to guarantee more than one loan", "must be re-scanned for every loan", "is only for external guarantors"], 1, "Useful for non-cash guarantees like chattels or promissory notes."),
          q("Credit Check should be marked Not Required in EM.LO.PARAMETERS when…", ["the applicant has bad credit", "the institution has no local credit bureau interface plugged into origination", "the loan amount is small", "the applicant is a returning customer"], 1, "There's no generic 'do nothing' bureau check — leaving it Required with nothing behind it just presents an empty step."),
          q("Collateral Input's 'New Collateral' link walks the user through…", ["only the COLLATERAL table", "COLLATERAL.RIGHT then COLLATERAL, in one guided flow", "a separate application outside origination", "the Guarantor tables"], 1, "Once committed, the new record is immediately selectable without leaving the origination workflow."),
        ],
      },
      {
        id: "tftD4-3", title: "Credit Scoring & Income/Expenditure",
        description: "Running credit scoring for applicants and guarantors, capturing an Income/Expenditure profile, and how the score is actually calculated at SA.SCORE.TXN.",
        concepts: ["tftLACreditScoringStage", "tftLAIncomeExpDetails", "tftLAScoreCalc"],
        quiz: [
          q("By default, 'Scoring Required?' at the Credit Scoring stage is…", ["Yes for both applicant and guarantors", "Yes for the applicant, No for guarantors", "No for both", "only relevant to group loans"], 1, "A user must deliberately flip a guarantor's default to Yes if guarantor scoring is also wanted."),
          q("Reusing an existing EM.INC.EXP record for a new application without updating it risks…", ["nothing, it's always current", "scoring against a stale income/expenditure profile", "an automatic application rejection", "duplicate customer records"], 1, "Best practice: update it, or better, configure Income/Expenditure records to be created per loan application."),
          q("At SA.SCORE.TXN, the Product Name dropdown shows…", ["every product in the system", "only records relevant to the applied-for product, its group, or SYSTEM", "only SYSTEM", "the customer's name"], 1, "Stops a user accidentally scoring against an unrelated product's score card."),
          q("A Data Type value shown as 'Field value defaulted' means…", ["the user must enter it manually", "it was auto-fetched per EM.LO.CS.SA.DATA.MAPPING", "it is always wrong", "it only applies to guarantors"], 1, "A value with no configured Source Field (EXTERNAL) is the one that must be entered by hand — e.g. a subjective Loan Officer Score."),
          q("The aggregate credit score (Agg Score) calculates…", ["live, as each field is filled in", "only once the SA.SCORE.TXN record is committed", "before the Product Name is even selected", "only for group applications"], 1, "It's not a running preview — it fires on commit."),
          q("Credit scoring for a group application…", ["scores only the group as one unit", "lists and scores every member individually", "is not supported", "requires all members to share one score"], 1, "Same per-member pattern used at Eligibility and Guarantor Input."),
        ],
      },
      {
        id: "tftD4-4", title: "Credit Assessment, Review/Approval & Offer Production",
        description: "Using loan history reports to inform a recommendation, the approver's deliberate decision at Review/Approval (including deal slips), and producing offer documents.",
        concepts: ["tftLACreditAssessment", "tftLAAssessmentScoreRec", "tftLAReviewApproval", "tftLADealSlips", "tftLAOfferProduction"],
        quiz: [
          q("Customer/Group Loan History reports, available at Credit Assessment, show…", ["only the current application", "the applicant's/group's past loans, overdue balances, and any provisioned/written-off amounts", "only future scheduled payments", "the product's own conditions"], 1, "Accessed via the Meatballs menu's Assessment Enquiries."),
          q("A credit assessment Recommendation of Approve…", ["binds the approver to also approve", "does not bind the approver — they may still decide differently", "skips the Review/Approval stage entirely", "is only advisory for group loans"], 1, "Recommendation and final decision are deliberately two separate maker-checker steps."),
          q("Unlike every other origination stage, Application Status at Review/Approval is…", ["always defaulted to Approved", "never defaulted — the approver must deliberately choose it", "hidden from the approver", "set automatically from the credit score"], 1, "Specifically to prevent an accidental approval slipping through undecided."),
          q("If Approved Amount and Approved Term are left blank by the approver…", ["the application is rejected", "the system assumes the values that were actually applied for", "the loan defaults to zero", "the approver must re-enter the applied values manually"], 1, "The approver only types something there if actually changing the amount/term."),
          q("Declining an application, or selecting 'Client Withdrawal,' at Review/Approval…", ["requires no further input", "makes the Notes field mandatory to capture the reason", "automatically deletes the application", "triggers an SLA escalation"], 1, "Ensures the reasoning behind a negative outcome is always recorded."),
          q("Approval deal slips print only when…", ["requested verbally by the customer", "the product's Origination Parameters (Other Parameters tab) were configured to expect one", "every application, automatically", "the loan amount exceeds a fixed threshold"], 1, "Not a universal prompt — it depends entirely on that product-level configuration."),
          q("Offer Production documents are generated using…", ["a hard-coded template", "the Document Output module, prepopulated per the Loan Origination product parameters", "manual typing by the officer", "the Credit Scoring module"], 1, "Only the loan application document template ships pre-built with the Inclusive Banking Model Bank."),
          q("Generated offer documents are stored and viewed via…", ["a shared network folder", "the Documents tab of Single Customer View", "the Credit Assessment screen", "email only"], 1, "Searchable there by Document Type, Date Created and Transaction Ref."),
        ],
      },
      {
        id: "tftD4-5", title: "Loan Creation, Disbursement & Group Bulk Disbursement",
        description: "Automatic vs manual disbursement at Loan Creation, the Arrangement Overview screens, and disbursing an entire group's loans together via Group Bulk Disbursement.",
        concepts: ["tftLALoanCreation", "tftLAManualDisbursement", "tftLAArrangementOverview", "tftLAGroupBulkDisb"],
        quiz: [
          q("Loan Creation is origination's…", ["first stage", "final stage", "optional stage, rarely used", "only relevant to groups"], 1, "Nothing upstream can change once the actual AA arrangement is created here."),
          q("A loan is created for manual disbursement whenever…", ["the customer requests it verbally", "the Disburse Account field at Loan Creation is left empty", "the loan amount exceeds a threshold", "the product has no interest rate"], 1, "It then sits in SCV's Portfolio tab with status 'Not Disbursed' until actioned."),
          q("Manual disbursement options include…", ["Disbursement to Account, by Cash, or by Payment Order", "only cash", "only account transfer", "email confirmation only"], 0, "Cash disbursement credits the Teller's cash account; account transfer credits the customer's own account."),
          q("The Arrangement Overview's Detailed version adds, beyond the Summary version…", ["nothing new", "account dates, limit/collateral details, and a full activity log", "only the interest rate", "only the customer's contact details"], 1, "The Activity Log shows the actual sequence of system-driven events behind the current balance."),
          q("Group Bulk Disbursement uses which application to post every member's disbursement together?", ["EM.LO.PARAMETERS", "EM.FT.BULK.INPUT,DISBURSE, governed by EM.FT.BULK.PARAM", "AA.ARR.PAYMENT.SCHEDULE", "EM.LOAN.GUARANTORS"], 1, "EM.FT.BULK.PARAM sets the allowed categories, FT OFS version, and default-account behaviour."),
          q("To skip disbursing one member's loan during a group bulk disbursement…", ["remove them from the group entirely", "change their Disburse field to No before committing", "delete their arrangement", "it isn't possible — all members must be disbursed together"], 1, "Everything else defaults; the user only needs to flip that one field for members to exclude."),
          q("Once a group bulk disbursement is authorised…", ["nothing further happens automatically", "FT records generate via OFS, and any that fail can be reviewed and resubmitted via 'Resubmit FT'", "the group is automatically closed", "only the first member's loan actually disburses"], 1, "Failed FTs don't silently vanish — they're recoverable."),
        ],
      },
      {
        id: "tftD4-6", title: "Reports & Direct Loan",
        description: "The Loan Application, SLA Escalation and Loan History reports, the four parameter groups loan origination depends on, and Direct Loan as an alternate booking method.",
        concepts: ["tftLAReports", "tftLASummary", "tftLADirectLoan"],
        quiz: [
          q("The Loan Application Report's 'Proc. Days' column measures…", ["the total loan term", "days taken to process the loan up to today, or until the loan record is created", "the SLA tolerance", "the number of guarantors"], 1, "A live, ongoing processing-time metric, not a fixed historical one."),
          q("The SLA Escalation Report, not yet on the TE menu, is accessed via…", ["a dedicated Home Page tile", "the command line, ENQ EM.LO.SLA.ESC", "the Credit Assessment screen only", "email notification only"], 1, "Same command-line pattern applies to ENQ EM.CUS.LOAN.LIST and ENQ EM.GRP.LOAN.LIST for loan history."),
          q("For loan origination to function end to end, the four parameter groups needed are…", ["Origination, Guarantor, Credit Scoring, Income & Expenditure", "Origination, Interest, Charges, Tax", "Guarantor, Collateral, Eligibility, Approval", "Product, Customer, Account, Limit"], 0, "Each one maps to a dedicated training course/material."),
          q("Direct Loan is best used when…", ["origination is fully in use and working well", "a bank already has a separate origination system, or for group loans usually processed manually anyway", "the loan amount is very small", "the customer has no credit history"], 1, "It books an already-approved loan directly, bypassing the multi-stage origination workflow."),
          q("Direct Loan's screens are deliberately built…", ["completely differently from Application Input", "the same way as Loan Origination's Application Input screens", "with fewer tabs than origination", "only for group loans"], 1, "So a user trained on one experience needs almost no retraining on the other."),
          q("After a Direct Loan input is completed, before disbursement…", ["it disburses immediately with no review", "an approver must review and authorise it", "it is automatically rejected", "it requires a full origination workflow re-run"], 1, "Accessible via Pending Tasks on the dashboard or the customer's Tasks tab in SCV."),
        ],
      },
      {
        id: "tftD4-7", title: "Loan Application Processing Hands-On",
        description: "Processing a full individual application end to end, then a group application disbursed via Group Bulk Disbursement.",
        concepts: ["tftLAHandsOn"],
        quiz: [
          q("Practice 1 processes a loan application for…", ["a group of five", "a single individual customer, end to end through every stage", "a deposit product", "an overdraft facility"], 1, "Input → Eligibility → Guarantor → Collateral → Credit Scoring → Credit Assessment → Review/Approval → Offer Production → Loan Creation."),
          q("Practice 2's group loan is configured for…", ["a 12-month term at a flat rate", "52 weeks at USD 4,000 per group member", "a single lump sum with no term", "quarterly repayments"], 1, "Disbursed afterward via Group Bulk Disbursement rather than each member's own Loan Creation screen."),
          q("Both hands-on exercises are verified afterward via…", ["deleting and rebuilding the application", "SCV's Loans tab → Arrangement Overview → checking the Payment Schedule", "the Teller menu", "a support ticket"], 1, "Same verification pattern used throughout the TFT hands-on exercises."),
        ],
      },
    ],
    assessment: [
      q("Loan application processing runs on the application called…", ["EM.LO.PARAMETERS", "EM.LO.APPLICATION", "AA.ARR.APPLICATION", "EM.LOAN.PROCESS"], 1, "Nine possible stages, switched per product via EM.LO.PARAMETERS."),
      q("The Asset Class field on Application Input shows…", ["the collateral type", "the worst overdue status across the customer's existing loans", "the credit score", "the branch code"], 1, "Informs the user before a Loan Action is even chosen."),
      q("Selecting 'Custom' as Repayment Frequency opens…", ["a permanent new Arrangement immediately", "a temporary Arrangement for negotiating via AA.ARR.PAYMENT.SCHEDULE, later deleted at Loan Creation", "the Guarantor stage early", "nothing — Custom isn't supported at Application Input"], 1, "The negotiated schedule is carried onto the real Arrangement created at Loan Creation."),
      q("For a Group applicant, the total amount requested is shared among members according to…", ["a fixed 50/50 rule", "the product's own Group Amount setting (Divide Evenly vs Flexible)", "whichever member applies first", "the guarantor's preference"], 1, "Configured in the product's own Loan Origination Parameters."),
      q("External guarantor ids in EM.LO.GUARANTOR always start with…", ["a customer number", "the letter G", "EXT", "a random 10-digit code"], 1, "Distinguishing a non-customer guarantor at a glance."),
      q("For external guarantors, a 'to be blocked' amount is…", ["actually locked in a bank account", "informational only, since there's no account to block", "always rejected", "converted to a guarantee fee"], 1, "Only internal (customer) guarantors have an account to actually lock via AC.LOCKED.EVENTS."),
      q("Credit Check should be Not Required when…", ["the applicant is high-risk", "there's no local credit bureau interface plugged into origination", "the loan is small", "the applicant is a repeat customer"], 1, "No generic bureau check exists without a real interface behind it."),
      q("By default, Scoring Required? at the Credit Scoring stage is…", ["Yes for guarantors, No for the applicant", "Yes for the applicant, No for guarantors", "No for both", "Yes for both, always"], 1, "A user must deliberately switch a guarantor's default to Yes if wanted."),
      q("At SA.SCORE.TXN, the Product Name dropdown is filtered to…", ["everything in the system", "only records relevant to the applied-for product, its group, or SYSTEM", "SYSTEM only", "products the customer previously held"], 1, "Prevents scoring against an unrelated product's score card."),
      q("A credit assessment Recommendation…", ["binds the approver to the same decision", "does not bind the approver, who may decide differently", "skips Review/Approval entirely", "is optional to enter"], 1, "Two deliberately separate maker-checker steps."),
      q("Application Status at Review/Approval is…", ["defaulted like every other stage", "never defaulted — deliberately chosen by the approver", "hidden from the user", "derived automatically from the credit score"], 1, "Prevents an accidental, undecided approval slipping through."),
      q("If Approved Amount/Term are left blank at Review/Approval…", ["the application is rejected", "the system assumes the applied-for values", "the loan amount defaults to zero", "the approver must retype the applied values"], 1, "Only typed if actually being changed."),
      q("Approval deal slips print only when…", ["requested by the customer verbally", "the product's Origination Parameters (Other Parameters) were configured for it", "every application, automatically", "the credit score is below a threshold"], 1, "Not a universal prompt."),
      q("Offer Production documents are produced using…", ["hard-coded templates", "the Document Output module, prepopulated per Loan Origination product parameters", "manual drafting only", "the Credit Scoring module"], 1, "Only the loan application document ships pre-built with the Model Bank."),
      q("Loan Creation is origination's…", ["first stage", "final stage", "an optional stage", "only relevant to groups"], 1, "Nothing upstream can change once the AA arrangement is actually created."),
      q("A loan sits as 'Not Disbursed' in SCV's Portfolio tab when…", ["the customer requests a delay", "the Disburse Account field was left empty at Loan Creation", "the loan amount exceeds a limit", "the product has no interest rate"], 1, "Manual disbursement is then actioned separately — to account, cash, or payment order."),
      q("Group Bulk Disbursement posts every member's disbursement together using…", ["EM.LO.PARAMETERS", "EM.FT.BULK.INPUT,DISBURSE, governed by EM.FT.BULK.PARAM", "AA.ARR.PAYMENT.SCHEDULE", "EM.LOAN.GUARANTORS"], 1, "EM.FT.BULK.PARAM sets allowed categories, FT OFS version, and default-account behaviour."),
      q("The Loan Application Report's 'Proc. Days' measures…", ["the loan term", "processing days up to today or until the loan record is created", "the SLA tolerance in days", "the number of guarantors"], 1, "A live, ongoing metric."),
      q("The four parameter groups loan origination depends on are…", ["Origination, Guarantor, Credit Scoring, Income & Expenditure", "Origination, Interest, Charges, Tax", "Guarantor, Collateral, Eligibility, Approval", "Product, Customer, Account, Limit"], 0, "Each maps to its own dedicated training material."),
      q("Direct Loan is ideal for…", ["banks with no existing origination system", "a bank already running a separate origination system, or group loans usually processed manually", "only first-time borrowers", "only deposit products"], 1, "Books an already-approved loan directly, skipping the multi-stage origination workflow."),
      q("After a Direct Loan input, before disbursement…", ["it disburses immediately", "an approver must review and authorise it", "it is auto-rejected", "the full origination workflow must re-run"], 1, "Same review/authorise pattern used throughout Inclusive Banking."),
    ],
  },
  {
    id: "tft-day5",
    code: "TFT-D5",
    title: "Temenos Functional Training (TFT) — Day 5",
    description: "Loan Operations end to end — Repayment & Overdue Payments, Loan Maintenance Activities, CGAP Reports (with the official Lending Operations quiz), Standard Loan Provisioning, Guarantor Recoveries & Loan Write-off, and Loan Recovery — straight from the Sep 2026 TLC materials.",
    sections: [
      {
        id: "tftD5-1", title: "Loan Repayment & Overdue Payments",
        description: "The four repayment types, group bulk repayments, overpayment, principal decrease, payoff, and how AA manages and monitors overdue payments.",
        concepts: ["tftLRTypes", "tftLRGroupRepay", "tftLROverpayment", "tftLRPrincipalDecrease", "tftLRPayoff", "tftLROverdueRules", "tftLROverdueMonitoring"],
        quiz: [
          q("The four types of loan repayment are…", ["Full, Partial, None, Custom", "Scheduled, Payoff, Principal Decrease, Credit to Arrangement", "Cash, Cheque, Transfer, Guarantor", "Grace, Delinquent, Non-Accrual, Written-off"], 1, "Group loan repayments are also supported via the bulk payments feature."),
          q("Settlement instructions are effected against the first Customer's account…", ["of the category code defined in the settlement stage of the Inclusive Banking product builder", "of the category code defined in the global product parameters file", "of category code 7313"], 0, "Official trainer quiz (Lending Operations, Q1)."),
          q("Flat interest is calculated on which source balance?", ["TOTCOMMITMENT", "CURACCOUNT", "CURCOMMITMENT"], 0, "Official trainer quiz (Lending Operations, Q2) — the original commitment amount, regardless of repayments made."),
          q("Weekly flat loans are configured using which interest day basis?", ["A", "E", "G"], 2, "Official trainer quiz (Lending Operations, Q3) — G = 366/364, the default for Constant Weekly/Bi-Weekly flat products."),
          q("Which of the following statements is correct?", ["Principal decrease is effected automatically when the prepayment is credited in the settlement account with the right transaction code.", "Principal decrease is effected automatically when the prepayment is credited in the loan account with the right transaction code.", "Both statements are correct."], 1, "Official trainer quiz (Lending Operations, Q4) — it's crediting the loan account itself, not the settlement account, that triggers Principal Decrease."),
          q("EM.FT.BULK.PARAM's Default Loan Repayment Amount field controls…", ["whether the due loan amount is auto-defaulted for the teller to confirm or override", "the interest rate applied", "the guarantor's share", "the branch code"], 0, "Saves the teller from re-typing every member's due amount by hand."),
          q("Overpayment (paying more than the scheduled due amount) is…", ["available through both manual and automatic settlement", "only available through manual repayments", "never allowed on any product", "only allowed on group loans"], 1, "Automatic settlement via the Settlement product condition only ever pays amounts actually due."),
          q("The AA Payoff Activity's total redemption amount is calculated using…", ["a manual sum of the visible balance", "the Simulation engine, capturing accrued interest and charges up to the effective date", "the original loan amount only", "the average of the last 3 instalments"], 1, "A manual total of the visible balance would typically be short."),
          q("Account Debit Rule 'Partial' on a Settlement Arrangement condition means…", ["the entire due amount is taken even if it overdraws the account", "the available amount is taken and the shortfall moves into overdue status", "nothing is taken and the whole due amount goes overdue", "the account is automatically closed"], 1, "Full and None are the other two options, taking the whole amount (even overdrawn) or nothing at all respectively."),
          q("Overdue Payment Advices are generated…", ["only once a year", "automatically whenever a payment becomes overdue or reaches a new overdue status", "only on manual request", "only for group loans"], 1, "Each advice logs its triggering Activity, Delivery Reference and Carrier Address."),
        ],
      },
      {
        id: "tftD5-2", title: "Loan Maintenance Activities",
        description: "AA Activities, Top-up & Reschedule (including guarantor changes and capitalising arrears), Bulk Rescheduling, and Loan Closure.",
        concepts: ["tftLMActivities", "tftLMTopupReschedule", "tftLMGuarantorUpdate", "tftLMGuarantorStandalone", "tftLMCapitalizeArrears", "tftLMBulkReschedule", "tftLMClosure"],
        quiz: [
          q("Any modification to an existing loan arrangement is done through…", ["direct field edits", "Activities, via the Arrangement Overview's New Activity link", "a brand-new application only", "the Teller module only"], 1, "Keeps a full, auditable Activity Log of every change."),
          q("In Inclusive Banking, principal increase (Top-up) and term change (Reschedule) can be processed using…", ["only raw AA activity screens", "Direct Loan Input or the Loan Origination application", "only a fresh loan application", "only the Classic Product Builder"], 1, "Both give a guided, origination-style screen for the change."),
          q("On a Top-up, the Term Requested field represents…", ["the change (delta) in term", "the loan's new total term", "the original term, always", "the number of missed payments"], 1, "Leaving it unchanged keeps the original term while only increasing the principal."),
          q("Releasing a guarantor during a top-up/reschedule requires…", ["nothing extra", "changing their status from Current to Released with a valid Reason for Release", "deleting the guarantor record entirely", "closing the loan first"], 1, "Guarantor eligibility is also re-checked live against the Conditions Excluding Guarantors table at this point."),
          q("Guarantor Maintenance can be accessed standalone via…", ["'Maintain Guarantors' on the Loan Guarantors tab, without triggering a top-up or reschedule", "only during a new loan application", "only during a top-up", "the Credit Scoring module"], 0, "Decouples guarantor changes from any change to the loan's own term or amount."),
          q("Capitalization of Arrears rolls overdue balances into…", ["a brand-new separate loan", "the loan itself, during a Top-up or Reschedule", "the guarantor's account", "a write-off"], 1, "Configured via EM.LO.PARAMETERS-TOPUP/RESCHEDULE and EB.PARAM ALL-EM.CAPITALISE.ARREARS."),
          q("Bulk Rescheduling's 'Number of Periods to Skip' option, with no dates entered, skips payments…", ["starting from the current date + 1 (tomorrow)", "from exactly one year ago", "retroactively, already-paid instalments", "only for group loans"], 0, "If dates are entered together with Number of Periods, only payments within that date range are rescheduled."),
          q("Bulk Rescheduling's 'Full' simulation option, compared to 'Short'…", ["is faster but skips validation", "additionally runs Validate on each loan to check for contract issues", "only works for group loans", "doesn't generate a list at all"], 1, "Short is faster and better suited to a large loan portfolio with no extra validation."),
          q("Manual loan closure (via Close Arrangement) is only allowed when…", ["CLOSURE.METHOD is set to AUTOMATIC", "CLOSURE.METHOD is set to MANUAL or NONE", "the loan has zero guarantors", "the customer requests it in writing"], 1, "For AUTOMATIC, closure relies entirely on the maturity-date or zero-balance trigger."),
        ],
      },
      {
        id: "tftD5-3", title: "CGAP Reports",
        description: "What CGAP is, how to access Classes B and C, and worked examples of the most commonly used reports.",
        concepts: ["tftCGAPOverview", "tftCGAPAccess", "tftCGAPReportSamples"],
        quiz: [
          q("CGAP report classes delivered as part of the Inclusive Banking Model Bank are…", ["A, B and C", "D and E only", "All five classes, A through E", "B and C only"], 0, "CGAP itself defines classes A through E; Inclusive Banking ships A, B, C."),
          q("For CGAP reports to run, which of the following is NOT a precondition?", ["TSM service must be started", "EM.CGAP.REPORT.RUN service must be set to Auto", "The customer record in Param Value.2.1 must exist", "The bank must have zero delinquent loans"], 3, "Delinquency has nothing to do with whether the reporting job itself can run."),
          q("Generating a Class B or C report follows which sequence?", ["Request Report → List Reports → View", "View → Request Report → List Reports", "List Reports → View → Request Report", "A single one-click generation, no further steps"], 0, "The requested report persists in the CGAP Report List for repeat viewing."),
          q("The B2 report shows…", ["a customer's full loan and savings status", "one loan account's activity from disbursement to current date", "portfolio concentration by sector", "delinquent loans by branch"], 1, "B3 is the customer-status report; B9 is portfolio concentration; C2 is delinquent loans by branch/officer."),
          q("The B9 Portfolio Concentration Report typically serves as…", ["a customer statement", "a regulatory report on loan concentration by sector and industry", "a guarantor recovery report", "a write-off report"], 1, "A common central-bank requirement for lenders."),
          q("C5 Summary Portfolio at Risk groups the outstanding portfolio by…", ["customer age", "branch and product, broken into on-time and delinquency-day buckets", "guarantor name", "loan purpose only"], 1, "Buckets typically span on-time, 1-30, 31-60, 61-90, and 90+ days."),
        ],
      },
      {
        id: "tftD5-4", title: "Standard Loan Provisioning",
        description: "The three-step provisioning process, the PV module's components and tables, classification, the provisioning profile, collateral mitigation methods, accounting/posting details, and manual adjustment.",
        concepts: ["tftPVOverview", "tftPVCoverage", "tftPVComponents", "tftPVClassification", "tftPVProfile", "tftPVCollateralExamples", "tftPVAccountingLink", "tftPVPostingDetails", "tftPVManagement"],
        quiz: [
          q("The three main steps of financial asset provisioning are…", ["Application, Review, Approval", "Classification, Calculation, Posting", "Input, Authorise, Commit", "Disbursement, Repayment, Closure"], 1, "Provision is booked Dr P&L, Cr an internal account once calculated."),
          q("The PV module supports provisioning across which Transact applications?", ["Only AA", "AA, LD, MM, SL and PD", "Only Loans and Deposits", "Only Money Market"], 1, "Arrangement Architecture, Loans and Deposits, Money Market, Syndicated Lending, Past Due."),
          q("Standard Provisioning follows which model?", ["Incurred Loss Model", "Expected Loss Model", "Fair Value Model", "Amortised Cost Model"], 1, "Each asset is classed based on its perceived risk, with the provision calculated as a percentage of the balance."),
          q("PV.LOAN.CLASSIFICATION's Rank field is used to…", ["set the interest rate", "give each classification a unique numeric ranking, referenced by the Rules Engine", "define the branch code", "calculate the loan term"], 1, "A concatenate file, PV.RANK.CLASS, keeps every rank unique across classifications."),
          q("Inclusive Banking's EM.PV.PARAMETER classifies loans based solely on…", ["sector and industry", "number of days overdue", "customer rating", "collateral type"], 1, "A simplified version of the full Rules Engine classification approach."),
          q("A PV.PROFILE record is…", ["always a single undated record", "an FTD-type (dated) file — only the latest applicable record is used on any given date", "unique per customer", "unrelated to classification"], 1, "PV.PROFILE.XREF holds the list of dates the profile has been defined for."),
          q("Using the 'Mitigate' collateral method, Provision Amount equals…", ["Loan Balance × Provision Rate", "(Loan Balance − Collateral Value) × Provision Rate", "Collateral Value × Provision Rate", "Loan Balance + Collateral Value"], 1, "COLLATERAL.USE = Mitigate and PROV.CALC = Percentage."),
          q("Using Secured/Unsecured collateral method, the secured and unsecured portions of the balance…", ["always get the same provisioning rate", "get different rates (SEC.PERCENT vs STD.PERCENT), which can produce a much larger total provision than Mitigate", "are ignored entirely", "only apply to interest, never principal"], 1, "Same loan, same collateral, potentially very different total provision depending on which method is configured."),
          q("Accounting for provision always happens at…", ["Customer level, even if classification runs at Asset level", "Asset (Deal) level, regardless of the classification level used", "Branch level only", "Product Group level only"], 1, "Classification can run at Customer or Asset level; accounting never does."),
          q("IFRS.POSTING.DETAILS uses Position Type…", ["'TR' for Standard Provisioning and 'IF' for IFRS", "'IF' for Standard Provisioning and 'TR' for IFRS", "the same Position Type for both", "no Position Type at all"], 0, "Each needs its own record because of the different Position Type."),
          q("A manually overridden classification or provision amount…", ["reverts to automated the very next COB", "stays on manual until the bank deliberately returns the asset to automated", "is only allowed once per year", "can never be reversed"], 1, "The override sticks — it doesn't silently expire."),
        ],
      },
      {
        id: "tftD5-5", title: "Standard Loan Provisioning Hands-On",
        description: "Viewing a contract's provisioning record, attempting and correctly applying a manual classification override, and checking the Provision Summary Report.",
        concepts: ["tftPVHandsOn"],
        quiz: [
          q("Practice 1 uses which report to locate a contract's provisioning record?", ["Provision Details Report (Credit Manager > Portfolio Monitoring)", "CGAP B2 report", "Guarantor Reports", "Loans Written Off Report"], 0, "Opens PV – Asset Details for the selected contract."),
          q("In Practice 2, attempting a manual classification at Contract level fails with an error because…", ["the contract doesn't exist", "classification for that asset is actually done at Customer level (Class Level = Customer)", "the user lacks permission", "the loan is already written off"], 1, "PV.MANAGEMENT's Class Level field decides exactly where the override belongs."),
          q("Practice 2's successful override is instead made via…", ["Customer Classification (Credit Manager)", "the Loans Written Off Report", "the CGAP B3 report", "the Guarantor Parameters table"], 0, "Setting Manual Class with a Reason there succeeds on authorisation."),
          q("The Provision Summary Report groups totals by…", ["Currency and Auto Classification", "Loan Purpose only", "Guarantor name", "Branch only"], 0, "Showing Rank, Number of contracts, Loan Outstanding, Base Amt, Posted/Calc. Provision and any Man. Correction."),
        ],
      },
      {
        id: "tftD5-6", title: "Guarantor Recoveries & Loan Write-off",
        description: "Recovering overdue amounts from guarantors before write-off, the three arrangement write-off functions, and how customer/account records reflect a write-off.",
        concepts: ["tftGRRecoveryConfig", "tftGRRecoveryOps", "tftWOArrangementWriteOff", "tftWOCustomerAccountUpdates", "tftWOReport"],
        quiz: [
          q("For recovery from a guarantor's account to be possible…", ["the guarantor parameter table's 'Recovery from Guarantor's Account' field must be set to Allowed", "no configuration is needed, it's always possible", "the loan must already be written off", "the guarantor must be an external (non-customer) guarantor"], 0, "This must be actively enabled in the guarantor parameter table."),
          q("With multiple guarantors, how recovery splits between them depends on…", ["a fixed 50/50 rule", "the Recovery Mode field (Equal or Proportional)", "whichever guarantor has the highest balance takes it all", "alphabetical order"], 1, "Same Equal/Proportional logic already used for guarantor account blocking."),
          q("To reach the guarantor recovery dashboard, a user…", ["drills down on the late loan in SCV's Portfolio tab, Transactions, and selects Repayment by Guarantor", "goes directly to the Guarantor Parameters table", "opens the Credit Scoring module", "uses the Loans Written Off Report"], 0, "Manual recovery then requires authorisation, landing in the Tasks tab of SCV."),
          q("The three Arrangement Write-off functions are…", ["Write off Arrangement, Write off Balances, Write off Bills", "Write off Principal, Write off Interest, Write off Charges", "Write off Current, Write off Due, Write off Both", "Write off Guarantor, Write off Collateral, Write off Account"], 0, "Arrangement = everything; Balances = current only, bills survive; Bills = issued bills only, current balances survive."),
          q("Write-off contra entries post to the category code defined in…", ["AC.ALLOCATION.RULE", "EM.PRODUCT.PARAMETERS", "the Guarantor Parameters table", "the Credit Scoring Score Card"], 0, "The same category should also be parameterised for provisioning, keeping write-off and provision aligned."),
          q("A customer with any written-off loan is flagged via…", ["'AA Loans Written Off' = Yes on the customer record", "a deleted customer record", "a blocked SCV login", "nothing — there's no customer-level flag"], 0, "The underlying account is separately flagged Financial Write Off or Write Off, depending on whether a provision existed."),
          q("The Loans Written Off Report shows, among other things…", ["only the customer's name", "write-off amount, loan balance at write-off, days in arrears, and provision amount as at write-off", "only the guarantor's details", "only the interest rate"], 1, "Accessible via Home Pages > Credit Manager > Loans Written Off, filterable per Account Officer or Group."),
        ],
      },
      {
        id: "tftD5-7", title: "Loan Recovery",
        description: "Contingent accounts and their parameters, the write-off-to-recovery process, recovery account updates, recovery transactions, and reversal/reporting.",
        concepts: ["tftLRecOverview", "tftLRecContingentSetup", "tftLRecAccountUpdate", "tftLRecTransactions", "tftLRecEntriesIllustration", "tftLRecReversalReports"],
        quiz: [
          q("The customer contingent account mnemonic for a written-off loan is…", ["the loan account number unchanged", "W + WOF Loan Account Number + W", "the customer number reversed", "a random 10-digit code"], 1, "Warehouses the amounts written off for that specific loan."),
          q("Recovery Order (in WOF Recovery Parameters) defines…", ["the interest rate applied to recovered funds", "the sequence in which recovered funds are applied against written-off balances", "which branch processes the recovery", "the guarantor's share"], 1, "e.g. Disbursement Fee, then New Arrangement Fee, then Penalty Interest, then Principal Interest, then Account last."),
          q("T24 core's rule on contingent vs non-contingent accounts is…", ["transactions may pass freely between them", "accounting transactions may NOT pass directly between contingent and non-contingent accounts", "only contingent-to-contingent transfers are blocked", "there is no such restriction"], 1, "Keeps written-off exposure visibly quarantined from the bank's live, performing book."),
          q("BNK/EM.WOF.PROCESS closes the AA arrangement and its account over…", ["1 COB", "2 COBs", "a full week", "instantly, same day"], 1, "It also opens the contingent account(s) per GIC.BD.PARAMETERS."),
          q("WOF recovery balances are stored on the contingent account…", ["as a single lump total only", "property-wise, exactly as captured in the balance maintenance property at write-off", "only for principal, never interest", "in a separate spreadsheet"], 1, "This property-wise detail is what Recovery Order actually walks through as money comes back in."),
          q("A cash recovery against a written-off loan posts which accounting entries?", ["Only Dr Cash, Cr Bad Debt Recovered PL Category", "Dr Cash/Cr Bad Debt Recovered PL, plus an automatic Dr Contingent Control/Cr Customer Contingent leg via OFS", "Only a contingent-to-contingent transfer", "No accounting entries are posted"], 1, "The officer only keys the customer-facing leg; the second leg posts automatically."),
          q("In the worked WOF & Recovery illustration, writing off a 10,000 loan first…", ["creates a brand new provision entry", "reverses the existing provision entry before opening the contingent accounts at 10,000", "does nothing to the provision", "immediately recovers 10,000"], 1, "Prevents double-counting the same expected loss twice in the general ledger."),
          q("The WOF Customers with Credit Balances Report exists because…", ["all customers with write-offs have zero other accounts", "a write-off customer might still hold other accounts in credit, triggering an override on any transaction against those accounts", "it's a regulatory requirement unrelated to write-offs", "it replaces the Loans Written Off Report"], 1, "Alerts the user to that customer's write-off history before allowing a transaction to proceed."),
        ],
      },
      {
        id: "tftD5-8", title: "Loan Write-off & Recovery Hands-On",
        description: "A linked sequence: topping up a loan, writing off another, observing the resulting contingent account, then recording a recovery.",
        concepts: ["tftWORecHandsOn"],
        quiz: [
          q("Practice 1's top-up processes a USD 1,500 increase and extends the term by…", ["exactly 1 instalment", "between 3 and 6 additional instalments", "a full year", "no term change at all"], 1, "e.g. from 6M to 9M, or from 24W to 30W."),
          q("Practice 2 writes off a loan via…", ["Arrangement Overview > New Activities > Balance Maintenance > Write Off Arrangement", "a brand new loan application", "the Guarantor Parameters table", "the CGAP Reports menu"], 0, "Committing raises a Pending Approval item before the write-off is final."),
          q("Practice 3 observes the effect of write-off by…", ["checking the guarantor's account", "opening the customer's Accounts (AC) list in SCV and finding the new 9000-category contingent account", "reviewing the CGAP B9 report", "checking the loan's interest rate"], 1, "Its Available Balance matches the written-off amount."),
          q("Practice 4 verifies the recovery posted as income by…", ["checking the loan's original interest rate", "a PL Account Statement filtered to the Recovery Category (e.g. 54150 'Bad Debt Recovered')", "the Guarantor Parameters table", "the Loan Application Report"], 1, "Confirms the recovered amount posted as income on the value date, separate from the contingent account balance check."),
        ],
      },
    ],
    assessment: [
      q("The four types of loan repayment are…", ["Full, Partial, None, Custom", "Scheduled, Payoff, Principal Decrease, Credit to Arrangement", "Cash, Cheque, Transfer, Guarantor", "Grace, Delinquent, Non-Accrual, Written-off"], 1, "Group repayments are also supported via the bulk payments feature."),
      q("Flat interest is calculated on which source balance?", ["TOTCOMMITMENT", "CURACCOUNT", "CURCOMMITMENT"], 0, "From the official Lending Operations quiz — the original commitment, regardless of repayments made."),
      q("Principal decrease is effected automatically when the prepayment is credited…", ["in the settlement account with the right transaction code", "in the loan account with the right transaction code", "either account, it makes no difference"], 1, "From the official Lending Operations quiz."),
      q("Account Debit Rule 'Partial' means…", ["the whole due amount is taken even if it overdraws the account", "the available amount is taken and the shortfall moves into overdue status", "nothing is taken, the whole amount goes overdue", "the account closes automatically"], 1, "Full and None are the other two options."),
      q("The AA Payoff Activity's total redemption amount is calculated using…", ["a manual visible-balance total", "the Simulation engine", "the original loan amount only", "an average of past instalments"], 1, "Captures accrued interest and charges up to the effective date."),
      q("Top-up and Reschedule in Inclusive Banking can be processed using…", ["only raw AA activity screens", "Direct Loan Input or the Loan Origination application", "only a fresh application", "the Classic Product Builder only"], 1, "Both give a guided, origination-style screen for the change."),
      q("On a Top-up, the Term Requested field represents…", ["the change (delta) in term", "the loan's new total term", "always the original term", "the missed-payment count"], 1, "Unchanged keeps the original term while only increasing the principal."),
      q("Bulk Rescheduling's 'Full' simulation, versus 'Short'…", ["is faster but skips validation", "additionally validates each loan for contract issues", "only applies to group loans", "generates no list"], 1, "Short is better suited to a large portfolio."),
      q("Manual loan closure (Close Arrangement) is allowed only when CLOSURE.METHOD is…", ["AUTOMATIC", "MANUAL or NONE", "always, regardless of setting", "never allowed manually"], 1, "AUTOMATIC relies entirely on the maturity/zero-balance trigger."),
      q("CGAP report classes delivered in the Inclusive Banking Model Bank are…", ["A, B and C", "D and E only", "all five classes", "B and C only"], 0, "CGAP itself defines classes A-E."),
      q("Generating a Class B or C CGAP report follows which sequence?", ["Request Report → List Reports → View", "View → Request → List", "List → View → Request", "one-click generation"], 0, "The requested report persists for repeat viewing."),
      q("The three main steps of financial asset provisioning are…", ["Application, Review, Approval", "Classification, Calculation, Posting", "Input, Authorise, Commit", "Disbursement, Repayment, Closure"], 1, "Provision posts Dr P&L, Cr an internal account once calculated."),
      q("Standard Provisioning follows which model?", ["Incurred Loss Model", "Expected Loss Model", "Fair Value Model", "Amortised Cost Model"], 1, "Each asset classed by perceived risk, provision = a percentage of balance."),
      q("Using the 'Mitigate' collateral method, Provision Amount equals…", ["Loan Balance × Provision Rate", "(Loan Balance − Collateral Value) × Provision Rate", "Collateral Value × Provision Rate", "Loan Balance + Collateral"], 1, "COLLATERAL.USE = Mitigate, PROV.CALC = Percentage."),
      q("Accounting for provision always happens at…", ["Customer level regardless of classification level", "Asset (Deal) level regardless of classification level", "Branch level only", "Product Group level only"], 1, "Classification can run at Customer or Asset level; accounting never does."),
      q("A manually overridden classification or provision amount…", ["reverts to automated the next COB", "stays on manual until deliberately returned to automated", "is allowed once per year only", "can never be reversed"], 1, "It doesn't silently expire."),
      q("In the provisioning hands-on, a manual classification attempted at Contract level failed because…", ["the contract doesn't exist", "classification for that asset is actually done at Customer level", "the user lacked permission", "the loan was already written off"], 1, "PV.MANAGEMENT's Class Level field decides where the override belongs."),
      q("For recovery from a guarantor's account to be possible…", ["the guarantor parameter table's 'Recovery from Guarantor's Account' field must be Allowed", "no configuration is needed", "the loan must already be written off", "the guarantor must be external only"], 0, "Must be actively enabled first."),
      q("The three Arrangement Write-off functions are…", ["Write off Arrangement, Balances, Bills", "Write off Principal, Interest, Charges", "Write off Current, Due, Both", "Write off Guarantor, Collateral, Account"], 0, "Arrangement = everything; Balances = current only; Bills = issued bills only."),
      q("A customer with any written-off loan is flagged via…", ["'AA Loans Written Off' = Yes on the customer record", "a deleted customer record", "a blocked login", "no flag exists"], 0, "The account is separately flagged Financial Write Off or Write Off."),
      q("The customer contingent account mnemonic for a written-off loan is…", ["the loan account unchanged", "W + WOF Loan Account Number + W", "the customer number reversed", "a random code"], 1, "Warehouses the amounts written off for that specific loan."),
      q("T24 core's rule on contingent vs non-contingent accounts is…", ["transactions pass freely between them", "accounting transactions may NOT pass directly between them", "only contingent-to-contingent is blocked", "no such restriction exists"], 1, "Keeps written-off exposure quarantined from the live book."),
      q("A cash recovery against a written-off loan posts…", ["only Dr Cash / Cr Bad Debt Recovered PL", "that entry plus an automatic Dr Contingent Control / Cr Customer Contingent leg via OFS", "only a contingent-to-contingent transfer", "no accounting entries"], 1, "The officer only keys the customer-facing leg."),
      q("In the worked WOF & Recovery illustration, writing off a loan first…", ["creates a new provision entry", "reverses the existing provision entry before opening the contingent accounts", "does nothing to the provision", "immediately recovers the full amount"], 1, "Prevents double-counting the same expected loss."),
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

// ---- theme switcher — swaps the app's accent color scale at runtime ------
// Tailwind's `indigo-*` classes resolve to CSS variables (see tailwind.config.js);
// picking a theme here just rewrites those variables on the root element, so
// every existing indigo-* class in the app repaints without any other change.
const THEMES = [
  { id: "temenos", name: "Temenos Blue", swatch: "#212a76",
    scale: ["#f0f1fa", "#dfe2f4", "#c2c7e9", "#939dd8", "#6370c4", "#3a48a8", "#2b368c", "#212a76", "#1a215f", "#14194a"] },
  { id: "nature", name: "Nature Green", swatch: "#1f7a4d",
    scale: ["#eefbf3", "#d7f4e2", "#aee6c5", "#7dd3a5", "#4cbb85", "#2d9c68", "#1f7a4d", "#166040", "#124d34", "#0d3a27"] },
  { id: "brinjal", name: "Brinjal Purple", swatch: "#5b2a6e",
    scale: ["#f6effa", "#e8d6f0", "#d1aee0", "#b381cd", "#9459b8", "#77389c", "#5b2a6e", "#48225a", "#391b47", "#291334"] },
  { id: "space", name: "Space Dark", swatch: "#2c3350",
    scale: ["#eef0f7", "#d9dcec", "#b3b9d8", "#8b93c0", "#646ea6", "#454e88", "#333c6e", "#2c3350", "#20263e", "#161a2c"] },
  { id: "ruby", name: "Ruby Red", swatch: "#9c2b3a",
    scale: ["#fbeeef", "#f4d3d6", "#e6a3aa", "#d5717d", "#c14a58", "#a8323f", "#9c2b3a", "#7c222e", "#601a23", "#451318"] },
];
const THEME_KEY = "tsa.theme";

function applyTheme(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  const root = document.documentElement;
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((step, i) => {
    root.style.setProperty(`--accent-${step}`, t.scale[i]);
  });
  return t.id;
}

function useTheme() {
  const [themeId, setThemeId] = useState("temenos");
  useEffect(() => {
    let id = "temenos";
    try { id = localStorage.getItem(THEME_KEY) || "temenos"; } catch {}
    setThemeId(applyTheme(id));
  }, []);
  const setTheme = (id) => {
    setThemeId(applyTheme(id));
    try { localStorage.setItem(THEME_KEY, id); } catch {}
  };
  return [themeId, setTheme];
}

// ---- Light / Dark / System mode — sets data-theme on <html>; CSS in
// globals.css does the actual repainting via the --slate-*/--surface vars.
const MODE_KEY = "tsa.mode";
const MODES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];
function applyMode(mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  return mode;
}
function useMode() {
  const [mode, setModeState] = useState("system");
  useEffect(() => {
    let m = "system";
    try { m = localStorage.getItem(MODE_KEY) || "system"; } catch {}
    setModeState(applyMode(m));
  }, []);
  const setMode = (m) => {
    setModeState(applyMode(m));
    try { localStorage.setItem(MODE_KEY, m); } catch {}
  };
  return [mode, setMode];
}

function ThemePicker({ themeId, setTheme, mode, setMode }) {
  const [open, setOpen] = useState(false);
  const current = THEMES.find(t => t.id === themeId) || THEMES[0];
  return (
    <span className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-surface px-2.5 py-1.5 text-sm text-slate-600 hover:border-indigo-300"
        aria-label="Appearance" title="Appearance">
        <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: current.swatch }} />
        <Palette size={14} className="hidden sm:inline" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-surface p-2 shadow-lg">
            <div className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">Appearance</div>
            <div className="flex gap-1 px-1 pb-2">
              {MODES.map(m => {
                const Icon = m.icon;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                      mode === m.id ? "border-indigo-300 bg-indigo-50 text-indigo-800 font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <Icon size={14} />
                    {m.label}
                  </button>
                );
              })}
            </div>
            <div className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">Accent color</div>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  t.id === themeId ? "bg-indigo-50 text-indigo-800 font-medium" : "text-slate-700 hover:bg-slate-50"}`}>
                <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: t.swatch }} />
                {t.name}
                {t.id === themeId && <Check size={14} className="ml-auto text-indigo-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
}

function Bar({ pct }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Ring({ pct, size = 64 }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--slate-200)" strokeWidth="6" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent-600)" strokeWidth="6"
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
            ? "border-slate-200 bg-surface text-slate-600 hover:border-indigo-300 hover:text-indigo-800"
            : "border-indigo-300 bg-indigo-50 text-indigo-800"}`}
        aria-label={btnLabel}>
        {status === "playing" ? <Pause size={14} /> : status === "paused" ? <Play size={14} /> : <Volume2 size={14} />}
        {btnLabel}
      </button>
      {status !== "idle" && (
        <button onClick={hardStop}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-surface p-1.5 text-slate-500 hover:text-slate-800"
          aria-label="Stop reading">
          <Square size={13} />
        </button>
      )}
      <button onClick={() => setShowOpts(o => !o)}
        className="inline-flex items-center rounded-lg border border-slate-200 bg-surface p-1.5 text-slate-400 hover:text-slate-700"
        aria-label="Voice settings" title="Voice settings">
        <ChevronRight size={13} className={showOpts ? "rotate-90 transition-transform" : "transition-transform"} />
      </button>

      {showOpts && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-surface p-3 text-sm shadow-lg">
          <div className="mb-2 inline-flex rounded-lg border border-slate-200 p-0.5">
            {[["device", "Device"], ["natural", "Natural ★"]].map(([id, lbl]) => (
              <button key={id} onClick={() => { setEngine(id); hardStop(); }}
                className={`px-2.5 py-1 text-xs rounded-md ${engine === id ? "bg-indigo-600 text-white" : "text-slate-600"}`}>
                {lbl}
              </button>
            ))}
          </div>

          {engine === "device" ? (
            <>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Voice</label>
              <select value={chosen?.name || ""} onChange={e => { setVoiceName(e.target.value); hardStop(); }}
                className="w-full rounded-lg border border-slate-200 bg-surface px-2 py-1.5">
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
                className="w-full rounded-lg border border-slate-200 bg-surface px-2 py-1.5">
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
  { icon: Target, label: "Concept", field: "title", accent: "text-indigo-700" },
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
      if (c.figure) s.push(`Worked example. ${c.figure}`);
      if (c.why) s.push(`Why banks use it. ${c.why}`);
      if (c.temenos) s.push(`In Temenos. ${c.temenos}`);
      if (c.memory) s.push(`Memory trick. ${c.memory}`);
    } else if (mode === "simply") {
      if (c.simple) s.push(c.simple);
      if (c.example) s.push(`If you saw it in a real bank. ${c.example}`);
      if (c.figure) s.push(`In numbers. ${c.figure}`);
    } else {
      if (c.simple) s.push(c.simple);
      if (c.example) s.push(`For example. ${c.example}`);
      if (c.figure) s.push(`Worked example. ${c.figure}`);
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
        <div className="inline-flex rounded-lg border border-slate-200 bg-surface p-0.5">
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === m.id ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>
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
            className="w-full rounded-xl border border-slate-200 bg-surface" />
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold ring-1 ring-indigo-100">{i + 1}</div>
                  {i < 4 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Icon size={13} /> {s.label}
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${i === 0 ? "font-semibold text-indigo-800" : "text-slate-700"}`}>{val}</p>
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
          {c.figure && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-amber-700 mb-1.5">
                <Calculator size={13} /> Worked example
              </div>
              <p className="text-sm leading-relaxed text-amber-900">{withMono(c.figure)}</p>
            </div>
          )}
          <Field label="Why banks use it">{c.why}</Field>
          <Field label="How Temenos relates to it">{c.temenos}</Field>
          <Field label="Memory trick">{c.memory}</Field>
        </div>
      )}

      {mode === "simply" && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-surface p-5">
          <p className="text-lg leading-relaxed text-slate-800">{c.simple}</p>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">If you saw it in a real bank</div>
            <p className="text-slate-700 leading-relaxed">{c.example}</p>
          </div>
          {c.figure && (
            <div className="mt-3 rounded-lg bg-amber-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-amber-700 mb-1">In numbers</div>
              <p className="text-amber-900 leading-relaxed">{withMono(c.figure)}</p>
            </div>
          )}
        </div>
      )}

      {c.figure && mode !== "deep" && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-amber-700 mb-1.5">
            <Calculator size={13} /> Worked example
          </div>
          <p className="text-sm leading-relaxed text-amber-900">{withMono(c.figure)}</p>
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
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-700 hover:text-indigo-900">
          <GitBranch size={15} /> View diagram: {DIAGRAMS[c.diagram].title} <ChevronRight size={14} />
        </button>
      )}

      {LABS.filter(l => l.related?.includes(conceptId)).map(l => (
        <button key={l.id} onClick={() => onOpen({ view: "lab", labId: l.id })}
          className="mt-4 flex w-full items-center gap-1.5 text-sm text-indigo-700 hover:text-indigo-900">
          <Wrench size={15} /> Practice in sandbox: {l.title} <ChevronRight size={14} />
        </button>
      ))}

      {c.related?.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Related concepts</div>
          <div className="flex flex-wrap gap-2">
            {c.related.filter(r => CONCEPTS[r]).map(r => (
              <button key={r} onClick={() => onOpen({ view: "concept", conceptId: r })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-surface px-3 py-1 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-800 transition-colors">
                {CONCEPTS[r].title} <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button onClick={onDone}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isRead ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
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
                className="group flex-1 rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft size={12} /> Previous</div>
                <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-indigo-800 line-clamp-1">{CONCEPTS[prev].title}</div>
              </button>
            ) : <div className="flex-1" />}
            {next ? (
              <button onClick={() => onOpen({ view: "concept", conceptId: next })}
                className="group flex-1 rounded-lg border border-slate-200 bg-surface p-3 text-right hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-end gap-1 text-xs text-slate-400">Next <ArrowRight size={12} /></div>
                <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-indigo-800 line-clamp-1">{CONCEPTS[next].title}</div>
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
        <div className="mt-4 flex items-center gap-5 rounded-xl border border-slate-200 bg-surface p-5">
          <Ring pct={pct} />
          <div>
            <div className="text-3xl font-semibold text-slate-900">{pct}%</div>
            <div className="text-sm text-slate-500">{correct} of {questions.length} correct</div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {answers.map((a, idx) => (
            <div key={idx} className={`rounded-lg border p-3 text-sm ${a.correct ? "border-blue-200 bg-blue-50" : "border-rose-200 bg-rose-50"}`}>
              <div className="flex items-start gap-2">
                {a.correct ? <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" /> : <X size={16} className="text-rose-600 mt-0.5 shrink-0" />}
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
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
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
          let cls = "border-slate-200 bg-surface hover:border-slate-300";
          if (reveal && isAns) cls = "border-blue-300 bg-blue-50";
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
          <div className={`font-medium ${picked === cur.answer ? "text-blue-700" : "text-rose-700"}`}>
            {picked === cur.answer ? "Correct" : "Not quite"}
          </div>
          <p className="mt-1 text-slate-600">{withMono(cur.explanation)}</p>
          <button onClick={() => {
            setAnswers(a => [...a, { correct: picked === cur.answer }]);
            setPicked(null); setI(i + 1);
          }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
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
        className="group w-full text-left rounded-2xl border border-slate-200 bg-surface p-8 min-h-52 flex flex-col justify-center transition-shadow hover:shadow-sm">
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
            <div className="mt-3 text-sm text-indigo-800 bg-indigo-50 rounded-lg px-3 py-2">{c.memory}</div>
          </>
        )}
      </button>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => go(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={16} /> Prev</button>
        <div className="flex gap-2">
          <button onClick={() => mark("review")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${status === "review" ? "bg-amber-100 text-amber-800" : "bg-surface border border-slate-200 text-slate-600 hover:bg-amber-50"}`}>
            <RotateCcw size={14} /> Need review
          </button>
          <button onClick={() => mark("known")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${status === "known" ? "bg-blue-100 text-blue-800" : "bg-surface border border-slate-200 text-slate-600 hover:bg-blue-50"}`}>
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
            <div className="rounded-xl border border-slate-200 bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold">{i + 1}</div>
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
// ---- UAT test script viewer -------------------------------------------
const uatTotal = UAT_MODULES.reduce((n, m) => n + m.cases.length, 0);
const uatModShort = (m) => m.title.replace(/^Module\s*\d+\s*[-–]\s*/, "");
const uatFindCase = (id) => {
  for (const m of UAT_MODULES) {
    const c = m.cases.find(x => x.id === id);
    if (c) return { mod: m, c };
  }
  return null;
};
const UAT_STATUSES = [
  { id: "pass",    label: "Pass",    cls: "border-emerald-300 bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  { id: "fail",    label: "Fail",    cls: "border-rose-300 bg-rose-50 text-rose-800",           dot: "bg-rose-500" },
  { id: "blocked", label: "Blocked", cls: "border-amber-300 bg-amber-50 text-amber-800",        dot: "bg-amber-500" },
];
const uatStatusMeta = (id) => UAT_STATUSES.find(s => s.id === id);
const uatModStats = (m, uatStatus) => {
  const s = { pass: 0, fail: 0, blocked: 0, done: 0 };
  for (const c of m.cases) {
    const st = uatStatus[c.id];
    if (st) { s[st]++; s.done++; }
  }
  return s;
};

function UatStatusPill({ status, size = "sm" }) {
  const meta = uatStatusMeta(status);
  if (!meta) return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 text-slate-400 ${size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> Not run
    </span>
  );
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${meta.cls} ${size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} font-medium`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
    </span>
  );
}

function UatResetButton({ label, onReset, disabled }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
  if (disabled) return null;
  return armed ? (
    <span className="inline-flex items-center gap-1">
      <button onClick={() => { onReset(); setArmed(false); }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
        Confirm reset
      </button>
      <button onClick={() => setArmed(false)} className="rounded-lg border border-slate-200 bg-surface px-2 py-1 text-xs text-slate-500">Cancel</button>
    </span>
  ) : (
    <button onClick={() => setArmed(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-surface px-2.5 py-1 text-xs text-slate-500 hover:border-rose-300 hover:text-rose-700">
      <RotateCcw size={12} /> {label}
    </button>
  );
}

function UatProgressBar({ stats, total }) {
  const seg = (n, cls) => n > 0 && <div className={cls} style={{ width: `${(n / total) * 100}%` }} />;
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      {seg(stats.pass, "bg-emerald-500")}
      {seg(stats.fail, "bg-rose-500")}
      {seg(stats.blocked, "bg-amber-500")}
    </div>
  );
}

function UatList({ go, uatStatus, resetUat }) {
  const overall = UAT_MODULES.reduce((a, m) => {
    const s = uatModStats(m, uatStatus);
    return { pass: a.pass + s.pass, fail: a.fail + s.fail, blocked: a.blocked + s.blocked, done: a.done + s.done };
  }, { pass: 0, fail: 0, blocked: 0, done: 0 });
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">UAT Test Script</h1>
      <p className="mt-1 text-sm text-slate-500">
        Yehulu Microfinance core banking · {UAT_MODULES.length} modules · {uatTotal} prepared test cases.
        Mark each case Pass / Fail / Blocked as you work through it.
      </p>
      <div className="mt-4 rounded-xl border border-slate-200 bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-900">{overall.done} / {uatTotal} executed</span>
          <span className="flex items-center gap-3 text-xs text-slate-500">
            <span className="text-emerald-700">{overall.pass} pass</span>
            <span className="text-rose-700">{overall.fail} fail</span>
            <span className="text-amber-700">{overall.blocked} blocked</span>
            <UatResetButton label="Reset all" onReset={() => resetUat()} disabled={overall.done === 0} />
          </span>
        </div>
        <div className="mt-2"><UatProgressBar stats={overall} total={uatTotal} /></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {UAT_MODULES.map(m => {
          const s = uatModStats(m, uatStatus);
          return (
            <button key={m.id} onClick={() => go({ view: "uatmodule", uatModId: m.id })}
              className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-indigo-700 bg-indigo-50 rounded px-1.5 py-0.5">{m.id}</span>
                <ClipboardList size={15} className="text-indigo-600" />
                {s.fail > 0 && <span className="ml-auto text-[11px] font-medium text-rose-600">{s.fail} fail</span>}
              </div>
              <div className="mt-2 font-medium text-slate-900 line-clamp-2">{uatModShort(m)}</div>
              <div className="text-sm text-slate-500">{s.done} / {m.cases.length} executed</div>
              <div className="mt-2"><UatProgressBar stats={s} total={m.cases.length} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UatModule({ modId, go, uatStatus, resetUat }) {
  const m = UAT_MODULES.find(x => x.id === modId);
  if (!m) return null;
  const s = uatModStats(m, uatStatus);
  const groups = [];
  for (const c of m.cases) {
    const g = groups.find(x => x.sub === c.sub);
    (g || groups[groups.push({ sub: c.sub, items: [] }) - 1]).items.push(c);
  }
  return (
    <div className="max-w-3xl">
      <button onClick={() => go({ view: "uat" })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> UAT Test Script</button>
      <div className="flex items-center gap-2 text-xs text-slate-400"><span className="font-mono">{m.id}</span></div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{uatModShort(m)}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{s.done} / {m.cases.length} executed</span>
        {s.pass > 0 && <span className="text-emerald-700">{s.pass} pass</span>}
        {s.fail > 0 && <span className="text-rose-700">{s.fail} fail</span>}
        {s.blocked > 0 && <span className="text-amber-700">{s.blocked} blocked</span>}
        <UatResetButton label="Reset module" onReset={() => resetUat(m.id)} disabled={s.done === 0} />
      </div>
      <div className="mt-2 max-w-md"><UatProgressBar stats={s} total={m.cases.length} /></div>
      <div className="mt-5 space-y-5">
        {groups.map(g => (
          <div key={g.sub}>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">{g.sub || "Other"}</div>
            <div className="space-y-2">
              {g.items.map(c => (
                <button key={c.id} onClick={() => go({ view: "uatcase", uatCaseId: c.id })}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300 transition-colors">
                  <span className="font-mono text-xs text-indigo-700 bg-indigo-50 rounded px-1.5 py-0.5 shrink-0">{c.id}</span>
                  <span className="text-sm text-slate-800">{c.desc}</span>
                  <span className="ml-auto shrink-0 flex items-center gap-2">
                    <UatStatusPill status={uatStatus[c.id]} />
                    <ChevronRight size={15} className="text-slate-300" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UatCase({ caseId, go, uatStatus, setUat }) {
  const hit = uatFindCase(caseId);
  if (!hit) return null;
  const { mod, c } = hit;
  const status = uatStatus[c.id];
  const idx = mod.cases.findIndex(x => x.id === caseId);
  const prev = idx > 0 ? mod.cases[idx - 1] : null;
  const next = idx < mod.cases.length - 1 ? mod.cases[idx + 1] : null;
  const Field = ({ label, children }) => (
    <div className="rounded-xl border border-slate-200 bg-surface p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">{label}</div>
      {children}
    </div>
  );
  return (
    <div className="max-w-2xl">
      <button onClick={() => go({ view: "uatmodule", uatModId: mod.id })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> {uatModShort(mod)}</button>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-indigo-700 bg-indigo-50 rounded px-2 py-0.5">{c.id}</span>
        {c.sub && <span className="text-xs text-slate-400">{c.sub}</span>}
        <span className="ml-auto"><UatStatusPill status={status} size="lg" /></span>
      </div>
      <h1 className="mt-2 text-xl font-semibold text-slate-900 tracking-tight">{c.desc}</h1>
      {c.ref && <p className="mt-1 text-xs text-slate-400">Requirement: {withMono(c.ref)}</p>}

      <div className="mt-4 rounded-xl border border-slate-200 bg-surface p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Result</div>
        <div className="flex flex-wrap gap-2">
          {UAT_STATUSES.map(st => (
            <button key={st.id} onClick={() => setUat(c.id, st.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                status === st.id ? st.cls : "border-slate-200 bg-surface text-slate-600 hover:border-slate-300"}`}>
              <span className={`h-2 w-2 rounded-full ${st.dot}`} /> {st.label}
            </button>
          ))}
          {status && (
            <button onClick={() => setUat(c.id, null)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-surface px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800">
              <RotateCcw size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {c.pre && <Field label="Pre-conditions"><p className="text-sm leading-relaxed text-slate-700">{withMono(c.pre)}</p></Field>}
        <Field label="Test steps">
          <ol className="space-y-2">
            {c.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold ring-1 ring-indigo-100">{i + 1}</span>
                <span>{withMono(s)}</span>
              </li>
            ))}
          </ol>
        </Field>
        {c.data && <Field label="Test data"><p className="text-sm leading-relaxed text-slate-700">{withMono(c.data)}</p></Field>}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-600 mb-1.5"><Check size={13} /> Expected result</div>
          <p className="text-sm leading-relaxed text-emerald-900">{withMono(c.expected)}</p>
        </div>
      </div>

      <div className="mt-6 flex items-stretch gap-3 border-t border-slate-200 pt-4">
        {prev ? (
          <button onClick={() => go({ view: "uatcase", uatCaseId: prev.id })}
            className="group flex-1 rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft size={12} /> {prev.id}</div>
            <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-indigo-800 line-clamp-1">{prev.desc}</div>
          </button>
        ) : <div className="flex-1" />}
        {next ? (
          <button onClick={() => go({ view: "uatcase", uatCaseId: next.id })}
            className="group flex-1 rounded-lg border border-slate-200 bg-surface p-3 text-right hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-end gap-1 text-xs text-slate-400">{next.id} <ArrowRight size={12} /></div>
            <div className="mt-0.5 text-sm font-medium text-slate-700 group-hover:text-indigo-800 line-clamp-1">{next.desc}</div>
          </button>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}

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
                className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
                <Wrench size={18} className="text-indigo-600" />
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold ring-1 ring-indigo-100">{i + 1}</div>
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
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-blue-600 mb-1.5"><Check size={13} /> Done when</div>
          <p className="text-sm leading-relaxed text-blue-900">{withMono(l.verify)}</p>
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
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-surface px-3 py-1 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-800 transition-colors">
                {CONCEPTS[r].title} <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PracticeList({ go }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Practice Lab</h1>
      <p className="mt-1 text-sm text-slate-500">Scenario-based configuration exercises, straight from the trainer decks' hands-on "Practice" slides. Read the business requirements, think it through, then reveal the worked solution.</p>
      {COURSES.filter(c => SCENARIOS.some(s => s.courseId === c.id)).map(c => (
        <div key={c.id} className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">{c.title}</div>
          <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.filter(s => s.courseId === c.id).map(s => (
              <button key={s.id} onClick={() => go({ view: "scenario", scenarioId: s.id })}
                className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
                <Target size={18} className="text-indigo-600" />
                <div className="mt-2 font-medium text-slate-900">{s.title}</div>
                <div className="text-sm text-slate-500 line-clamp-2">{s.brief}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PracticeView({ id, onOpen }) {
  const s = SCENARIOS.find(x => x.id === id);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setRevealed(false); }, [id]);
  if (!s) return null;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{s.title}</h1>
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{s.source}</p>
      <p className="mt-3 text-slate-700 leading-relaxed">{s.brief}</p>

      <div className="mt-3">
        <SpeakButton
          getText={() => [
            s.title, s.brief,
            "Requirements.", ...s.requirements,
            revealed ? "Solution." : "",
            ...(revealed ? s.solution.flatMap(f => [`${f.field}:`, f.value, f.note || ""]) : []),
          ].filter(Boolean).join(". ")}
          resetKey={s.id} />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Client requirements</div>
        <ol className="space-y-2">
          {s.requirements.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-800">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold ring-1 ring-indigo-100">{i + 1}</span>
              {withMono(r)}
            </li>
          ))}
        </ol>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Target size={15} /> Reveal solution
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-blue-600 mb-2"><Check size={13} /> Worked solution</div>
          {s.image && (
            <figure className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/slides/practice/${s.image}.jpg`} alt={`${s.title} — solution screenshot from the trainer deck`}
                loading="lazy"
                className="w-full rounded-lg border border-blue-200 bg-surface" />
              <figcaption className="mt-1.5 text-xs text-blue-700/70">Screenshot from the trainer deck's solution slide</figcaption>
            </figure>
          )}
          <div className="space-y-3">
            {s.solution.map((f, i) => (
              <div key={i} className="text-sm leading-relaxed">
                <div className="font-medium text-blue-950">{withMono(f.field)}</div>
                <div className="text-blue-900">{withMono(f.value)}</div>
                {f.note && <div className="mt-0.5 text-blue-700/80 text-xs">{withMono(f.note)}</div>}
              </div>
            ))}
          </div>
          {s.memory && (
            <div className="mt-4 pt-3 border-t border-blue-200/70">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-blue-600 mb-1"><Lightbulb size={13} /> Remember it as</div>
              <p className="text-sm leading-relaxed text-blue-900">{withMono(s.memory)}</p>
            </div>
          )}
          <button onClick={() => setRevealed(false)}
            className="mt-4 inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900">
            <RotateCcw size={12} /> Hide solution, think again
          </button>
        </div>
      )}

      {s.related?.filter(r => CONCEPTS[r]).length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">Concepts this covers</div>
          <div className="flex flex-wrap gap-2">
            {s.related.filter(r => CONCEPTS[r]).map(r => (
              <button key={r} onClick={() => onOpen({ view: "concept", conceptId: r })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-surface px-3 py-1 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-800 transition-colors">
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
    read: {}, quiz: {}, assess: {}, flash: {}, last: null, uat: {},
  });
  const uatStatus = progress.uat || {};
  const setUat = (id, status) => setProgress(p => {
    const next = { ...(p.uat || {}) };
    if (!status || next[id] === status) delete next[id]; else next[id] = status;
    return { ...p, uat: next };
  });
  const resetUat = (modId) => setProgress(p => {
    if (!modId) return { ...p, uat: {} };
    const mod = UAT_MODULES.find(m => m.id === modId);
    const ids = new Set((mod?.cases || []).map(c => c.id));
    const next = Object.fromEntries(Object.entries(p.uat || {}).filter(([k]) => !ids.has(k)));
    return { ...p, uat: next };
  });
  const [nav, setNav] = useState({ view: "dashboard" });
  const [conceptMode, setConceptMode] = useState("steps");
  const [query, setQuery] = useState("");
  const [themeId, setTheme] = useTheme();
  const [mode, setMode] = useMode();

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
    { id: "training", label: "Training", icon: GraduationCap, target: { view: "course", courseId: "training1" } },
    { id: "flashcards", label: "Flashcards", icon: BookMarked },
    { id: "diagrams", label: "Diagrams", icon: GitBranch },
    { id: "labs", label: "Sandbox", icon: Wrench },
    { id: "practice", label: "Practice Lab", icon: Target },
    { id: "uat", label: "UAT", icon: ClipboardList },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => go({ view: "dashboard" })} className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white"><GraduationCap size={16} /></div>
              <span className="font-semibold tracking-tight">Temenos Study</span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={e => { setQuery(e.target.value); if (e.target.value) go({ view: "search" }); }}
                  placeholder="Search…"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-400 focus:bg-surface" />
              </div>
              <ThemePicker themeId={themeId} setTheme={setTheme} mode={mode} setMode={setMode} />
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap items-center gap-1">
            {NAV.map(n => {
              const Icon = n.icon;
              const inTraining = nav.courseId === "training1"
                || conceptCourse[nav.conceptId] === "training1"
                || (nav.view === "quiz" && COURSES.find(c => c.id === "training1")?.sections.some(s => s.id === nav.sectionId));
              const active = n.id === "training"
                ? inTraining
                : (nav.view === n.id
                  || (n.id === "courses" && ["course", "section", "concept", "quiz", "assessment"].includes(nav.view) && !inTraining)
                  || (n.id === "diagrams" && nav.view === "diagram")
                  || (n.id === "labs" && nav.view === "lab")
                  || (n.id === "practice" && nav.view === "scenario")
                  || (n.id === "uat" && ["uatmodule", "uatcase"].includes(nav.view)));
              return (
                <button key={n.id} onClick={() => go(n.target || { view: n.id })}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${active ? "bg-indigo-50 text-indigo-800 font-medium" : "text-slate-600 hover:bg-slate-100"}`}>
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
            <Dashboard {...{ overallPct, conceptsLearned, avgQuiz, dueFlash, quizTaken, coursePct, progress, uatStatus, go }} />
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
                    className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
                    <GitBranch size={18} className="text-indigo-600" />
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
          {nav.view === "practice" && <PracticeList go={go} />}
          {nav.view === "scenario" && (
            <div>
              <button onClick={() => go({ view: "practice" })} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ChevronLeft size={15} /> Practice Lab</button>
              <PracticeView id={nav.scenarioId} onOpen={go} />
            </div>
          )}
          {nav.view === "uat" && <UatList go={go} uatStatus={uatStatus} resetUat={resetUat} />}
          {nav.view === "uatmodule" && <UatModule modId={nav.uatModId} go={go} uatStatus={uatStatus} resetUat={resetUat} />}
          {nav.view === "uatcase" && <UatCase caseId={nav.uatCaseId} go={go} uatStatus={uatStatus} setUat={setUat} />}
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
                      className="block w-full rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300">
                      <div className="text-xs text-slate-400">Concept · {COURSES.find(c => c.id === conceptCourse[r.id])?.title}</div>
                      <div className="font-medium text-slate-900">{CONCEPTS[r.id].title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{CONCEPTS[r.id].simple}</div>
                    </button>
                  ) : (
                    <button key={i} onClick={() => go({ view: "course", courseId: r.id })}
                      className="block w-full rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300">
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
function Dashboard({ overallPct, conceptsLearned, avgQuiz, dueFlash, quizTaken, coursePct, progress, uatStatus, go }) {
  const nextConcept = allConceptIds.find(id => !progress.read[id]);
  const uat = Object.values(uatStatus || {});
  const uatDone = uat.length;
  const uatFail = uat.filter(s => s === "fail").length;
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Understanding over memorization. Learn → test → review → connect → recall.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard label="Overall progress" value={`${overallPct}%`} sub={`${conceptsLearned}/${allConceptIds.length} concepts`} ring={overallPct} />
        <StatCard label="Quiz average" value={quizTaken ? `${avgQuiz}%` : "—"} sub={`${quizTaken} quizzes taken`} />
        <StatCard label="Flashcards due" value={dueFlash} sub="to review" />
        <button onClick={() => go({ view: "uat" })} className="text-left">
          <StatCard label="UAT executed" value={`${uatDone}/${uatTotal}`} sub={uatFail ? `${uatFail} failing` : "test cases"} />
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">What to study next</div>
            <div className="mt-1 text-lg font-medium text-slate-900">
              {nextConcept ? CONCEPTS[nextConcept].title : "All concepts read — revise with flashcards"}
            </div>
          </div>
          {nextConcept && (
            <button onClick={() => go({ view: "concept", conceptId: nextConcept })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
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
    <div className="rounded-xl border border-slate-200 bg-surface p-4 flex items-center justify-between">
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
      className="rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
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
              className="block w-full rounded-xl border border-slate-200 bg-surface p-4 text-left hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 text-sm font-medium">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900">{s.title}</div>
                  <div className="text-sm text-slate-500 line-clamp-1">{s.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">{done}/{s.concepts.length} concepts</div>
                  {quizScore !== undefined && <div className="text-xs text-indigo-700 font-medium">Quiz {quizScore}%</div>}
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-surface p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-medium text-slate-900"><Award size={18} className="text-indigo-600" /> End-of-course assessment</div>
          <div className="text-sm text-slate-500 mt-0.5">{course.assessment.length} questions across knowledge, understanding and application.
            {progress.assess[course.id] && <span className="text-indigo-700 font-medium"> Last: {progress.assess[course.id].pct}%</span>}
          </div>
        </div>
        <button onClick={() => go({ view: "assessment", courseId: course.id })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Start <ArrowRight size={15} /></button>
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
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-surface p-3 text-left hover:border-indigo-300 transition-colors">
            {isRead(id) ? <CheckCircle2 size={18} className="text-blue-500 shrink-0" /> : <Circle size={18} className="text-slate-300 shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900">{CONCEPTS[id].title}</div>
              <div className="text-sm text-slate-500 line-clamp-1">{CONCEPTS[id].simple}</div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-surface p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-medium text-slate-900"><ListChecks size={18} className="text-indigo-600" /> Section quiz</div>
          <div className="text-sm text-slate-500 mt-0.5">{section.quiz.length} questions.{quizScore !== undefined && <span className="text-indigo-700 font-medium"> Last: {quizScore}%</span>}</div>
        </div>
        <button onClick={() => go({ view: "quiz", courseId: course.id, sectionId: section.id })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Take quiz <ArrowRight size={15} /></button>
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
      className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-surface text-slate-600 border-slate-200 hover:border-slate-300"}`}>
      {children}
    </button>
  );
}

function ProgressView({ overallPct, conceptsLearned, coursePct, progress }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
      <div className="mt-5 flex items-center gap-5 rounded-xl border border-slate-200 bg-surface p-5">
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
            <div key={c.id} className="rounded-xl border border-slate-200 bg-surface p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-900">{c.title}</div>
                <span className="text-sm text-slate-400">{pct}%</span>
              </div>
              <div className="mt-2"><Bar pct={pct} /></div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{secDone}/{c.sections.length} sections complete</span>
                <span>{c.sections.filter(s => progress.quiz[s.id] !== undefined).length}/{c.sections.length} quizzes taken</span>
                {assess !== undefined && <span className="text-indigo-700 font-medium">Assessment {assess}%</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
