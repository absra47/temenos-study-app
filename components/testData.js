// Colleague-contributed quizzes, shown under the Test tab.
export const TESTS = [
  {
    "id": "product-builder",
    "title": "Temenos Product Builder — Quiz",
    "subtitle": "Decks 00-1.0 → 02-6.1 · Financial Inclusion Product Builder",
    "questions": [
      {
        "question": "What are the four steps of the product build, in the correct order?",
        "options": [
          "Create Product Group → Define Shared Conditions → Create Inheritance Group → Create Products",
          "Create Inheritance Group → Define Shared Conditions → Create Product Group → Create Products",
          "Define Shared Conditions → Create Inheritance Group → Create Products → Create Product Group",
          "Create Products → Create Product Group → Define Shared Conditions → Create Inheritance Group"
        ],
        "answer": 1,
        "explanation": "**b — Inheritance Group → Shared Conditions → Product Group → Products.**\n\nLoans, deposits and accounts all follow this same order. Get the sequence wrong and the group has nothing to inherit from.\n\n*Source:* `02-1.0 Concept - Common Product Parameters - Transcription.md:95`",
        "deck": "02-1.0"
      },
      {
        "question": "Which single record holds the inheritance group, the product group, and the global conditions?",
        "options": [
          "`EM.PRODUCT.LOAN`",
          "`EM.PRODUCT.PARAMETERS`",
          "`EM.PRODUCT.GROUP`",
          "`AA.PRD.DES.TERM.AMOUNT`"
        ],
        "answer": 2,
        "explanation": "**c — `EM.PRODUCT.GROUP`** — all three live on the same table.\n\nProducts live on `EM.PRODUCT.LOAN` / `.DEPOSIT` / `.ACCOUNT`. `EM.PRODUCT.PARAMETERS` holds Global Product Parameters (record ID `SYSTEM`). `AA.PRD.DES.*` are the core AA condition tables.\n\n*Source:* `02-1.0 Concept - Common Product Parameters - Transcription.md:121`",
        "deck": "02-1.0"
      },
      {
        "question": "True or false: in the Financial Inclusion product build, shared conditions are mandatory but inheritance groups are not.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "**False.** It is the other way round.\n\n**Inheritance groups are mandatory; shared conditions are optional.** Shared conditions are explicitly optional in `02-1.0` and `02-5.0` — this is the most commonly missed fact in the whole build.\n\n*Source:* `02-1.0 Concept - Common Product Parameters - Transcription.md:123` · `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:62`",
        "deck": "02-1.0"
      },
      {
        "question": "A consultant needs a completely unique product that shares no conditions with anything else. How is that done?",
        "options": [
          "Define a parent product code with no inheritance conditions linked to it (NoInherit)",
          "Skip the product group and go straight to the product builder wizard",
          "Not possible in Financial Inclusion — every product must share conditions",
          "Build it in the Classic Product Builder instead of the wizard"
        ],
        "answer": 0,
        "explanation": "**a — a `NoInherit` parent product code with no inheritance conditions linked to it.**\n\nWith `NoInherit`, Customer/Account, Limit, Term/Amount, Payment Schedule and Principal Interest all become *Define Now*. The product group is still required — you never skip it.\n\n*Source:* `02-1.1 Hands-on - Common Product Parameters - Transcription.md:129`",
        "deck": "02-1.1"
      },
      {
        "question": "Which loan product condition can NEVER be inherited, and must always be defined in the workflow?",
        "options": [
          "Penalty Interest",
          "Customer/Account (`EM.PRDL.CUST.ACCT`)",
          "Settlement",
          "Term / Amount"
        ],
        "answer": 1,
        "explanation": "**b — Customer/Account (`EM.PRDL.CUST.ACCT`).**\n\nIt is always defined in the workflow and cannot be inherited, regardless of what the parent product code says. Penalty Interest, Settlement and Term/Amount all *can* inherit.\n\n*Source:* `02-2.0 Concept - Loan Product and Product Conditions - Transcription.md:81`",
        "deck": "02-2.0"
      },
      {
        "question": "Which Day Basis pairing is correct?",
        "options": [
          "Flat + Constant Monthly → `A` (360/360); Reducing Balance → `E` (366/365)",
          "Flat + Constant Monthly → `E` (366/365); Reducing Balance → `A` (360/360)",
          "Flat + Constant Monthly → `G` (366/364); Reducing Balance → `E` (366/365)",
          "Flat + Constant Monthly → `A` (360/360); Reducing Balance → `G` (366/364)"
        ],
        "answer": 0,
        "explanation": "**a — Flat + Constant Monthly → `A` (360/360); Reducing Balance → `E` (366/365)** on `CURACCOUNT`.\n\nThe third basis, `G` (366/364), applies to **Flat + Constant Weekly or Bi-Weekly**.\n\n*Source:* `02-2.0 Concept - Loan Product and Product Conditions - Transcription.md:195-198`",
        "deck": "02-2.0"
      },
      {
        "question": "True or false: flat interest is calculated on the outstanding principal balance.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "**False.** Flat interest is calculated on **`TOTCOMMITMENT`** — the original commitment, not the outstanding balance.\n\nThis is exactly what makes flat interest flat: it does not reduce as the principal is repaid.\n\n*Source:* `02-2.0 Concept - Loan Product and Product Conditions - Transcription.md:199`",
        "deck": "02-2.0"
      },
      {
        "question": "Why must the category range be reserved before the product group is created?",
        "options": [
          "Otherwise the product will not appear in the dropdown",
          "Otherwise the product cannot be published",
          "Otherwise the currency cannot be selected on the product",
          "Otherwise shared conditions cannot be inherited"
        ],
        "answer": 0,
        "explanation": "**a — Otherwise the product will not appear in the dropdown.**\n\nThe category must fall inside the group's reserved range. This is the cause of most \"where did my product go\" problems.\n\n*Source:* `02-2.0 Concept - Loan Product and Product Conditions - Transcription.md:59`",
        "deck": "02-2.0"
      },
      {
        "question": "Can a product be amended in the wizard after it has been published?",
        "options": [
          "Yes, as long as no arrangements exist against it",
          "No — it can only be amended in the Core / Classic Product Builder",
          "Yes, by re-running the Proof and Publish stage",
          "Yes, provided the change is made at close of day"
        ],
        "answer": 1,
        "explanation": "**b — No. The Core / Classic Product Builder only.**\n\nThe wizard is **build-only**. Once published, the workflow ends and you cannot re-open the product there. Making the change at close of day (just before COB) is still good practice — it just does not determine *where* you make it.\n\n*Source:* `02-4.0 Concept - Loan Product Review Publish & Maintenance - Transcription.md:76`",
        "deck": "02-4.0"
      },
      {
        "question": "Which three product conditions must be maintained through their own versions rather than the Classic Product Builder?",
        "options": [
          "Penalty Interest, Settlement, Overdue",
          "Settlement, Eligibility, Limit",
          "Limit, Term/Amount, Payment Schedule",
          "Eligibility, Charge, Payoff/Closure"
        ],
        "answer": 1,
        "explanation": "**b — Settlement, Eligibility and Limit.**\n\n**Settlement** → `EM.PRDL.SETTLEMENT,CATEG.CHANGE`\n**Eligibility** → `EM.PRDL.ELIGIBILITY,EDIT.STANDALONE`\n**Limit** → `EM.PRDL.LIMIT,LIMIT.CHANGE`\n\nEverything else is maintained in the Classic Product Builder → Product Conditions.\n\n*Source:* `02-4.0 Concept - Loan Product Review Publish & Maintenance - Transcription.md:82`",
        "deck": "02-4.0"
      },
      {
        "question": "To exclude a charge property from a product, what do you select at Charge Selection?",
        "options": [
          "No",
          "Not Applicable",
          "Yes",
          "Leave the selection blank"
        ],
        "answer": 1,
        "explanation": "**b — Not Applicable.**\n\n*Yes* = one default condition for all currencies. *No* = define the condition per currency. *Not Applicable* = the charge is not on the product at all.\n\n*Source:* `02-3.0 Concept - Loan Additional Product Conditions - Transcription.md:30`",
        "deck": "02-3.0"
      },
      {
        "question": "On a savings plan, what is the difference between the Bonus charge and the Bonus Restricted charge?",
        "options": [
          "Bonus pays out on the maturity date; Bonus Restricted waives or replaces it when a restriction is breached",
          "Bonus waives the charge; Bonus Restricted pays it out",
          "They are the same charge — one is used for savings plans, the other for term deposits",
          "Bonus capitalises the interest; Bonus Restricted pays it out"
        ],
        "answer": 0,
        "explanation": "**a — Bonus pays on the maturity date; Bonus Restricted waives or replaces it on breach.**\n\nThey are **two separate charges**. Bonus uses Charge Link *Schedule* → Date *Maturity Date*. Bonus Restricted uses Charge Link *Restriction* — e.g. *Maximum No. Of Delinquent Payments* — with Charge Action *Waive* or *Replace*.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:157,162` · `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:171,173`",
        "deck": "02-5.0"
      },
      {
        "question": "Which two savings-plan charges make the Overdue stage mandatory?",
        "options": [
          "Deposit Ageing Fee and Bonus Restricted",
          "Bonus and Deposit Ageing Fee",
          "Withdrawal Fee and Preclosure Fee",
          "Tax and Deposit Ageing Fee"
        ],
        "answer": 0,
        "explanation": "**a — Deposit Ageing Fee and Bonus Restricted.**\n\nIf either is defined, the Overdue stage is presented and must be completed. Both are Savings Plan only — and that Overdue stage is the one that appears on savings plans but not on loans.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:136`",
        "deck": "02-5.0"
      },
      {
        "question": "True or false: setting Limit Serial to NEW makes the system auto-create the limit record at account opening.",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explanation": "**True.**\n\nWith the limit product given in the Limit condition and **Limit Serial = `NEW`**, the system auto-creates the limit record at account opening. Limit handling is then managed by AA. Without `NEW`, the record is not created automatically.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:108`",
        "deck": "02-6.0"
      },
      {
        "question": "NO.UNAUTH.DEBIT queues an overdraft facility for immediate review after how many events — and does it count payment items or occasions?",
        "options": [
          "After 3 events, counting payment items",
          "After 5 events, counting occasions",
          "After 3 events, counting occasions",
          "After 30 days of continuous debit, counting occasions"
        ],
        "answer": 2,
        "explanation": "**c — 3 out-of-order (OOO) events, counting occasions.**\n\nSeveral referrals on the same day count as **one** occasion. Both `NO.UNAUTH.DEBIT` and `MIN.30D.CREDIT` are maintained in `EB.PARAM` → `ALL-EM.ACCT.LIMIT.REVIEW`.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:148,150`",
        "deck": "02-6.0"
      }
    ]
  },
  {
    "id": "origination",
    "title": "Temenos Origination — Quiz",
    "subtitle": "Decks 03-1.0 → 03-5.2 · Concepts only (not examples)",
    "questions": [
      {
        "question": "Origination is described by three characteristics. Alongside **workflow driven** and **customer centered**, what is the third?",
        "options": [
          "Stage ownership management",
          "Batch driven processing",
          "Channel independent",
          "Product centric"
        ],
        "answer": 0,
        "explanation": "**a — Stage ownership management.**\n\nOrigination is **workflow driven** (users are guided from stage to stage), **customer centered** (processing runs in the context of the identified customer, combining values from the customer record with other relevant records so results are fair for all customers) and supports **stage ownership management** — different groups of users can own different stages (e.g. one team initiates, another approves).\n\n*Source:* `03-1.0 Concept - Origination Overview and Common Parameters - Transcription.md:32`",
        "deck": "03-1.0"
      },
      {
        "question": "Origination supports all customer types for loans and accounts. What is supported for **deposits**?",
        "options": [
          "Individuals, groups and SMEs — the same as loans",
          "Individuals and SMEs only — there is no group origination for deposits",
          "SMEs only",
          "Groups and individuals, but not SMEs"
        ],
        "answer": 1,
        "explanation": "**b — Individuals and SMEs only.**\n\nLoans and accounts support individuals, groups and SMEs. For **deposits, only individuals and SMEs** are supported — **there is no origination for group customers**. This is a common trap because group processing exists everywhere else.\n\n*Source:* `03-1.0 Concept - Origination Overview and Common Parameters - Transcription.md:75`",
        "deck": "03-1.0"
      },
      {
        "question": "In `EM.XX.STAGE`, a stage's **Optional** checkbox is left unticked. What is the effect?",
        "options": [
          "The stage is optional and the user decides",
          "The stage is not required and is never presented",
          "The stage is required and cannot be skipped",
          "The stage is skipped only for group applications"
        ],
        "answer": 2,
        "explanation": "**c — it is required and cannot be skipped.**\n\nIf the stage is marked **Optional**, it can then be set to *Optional* or *Not Required* on the main parameter table. If the box is **left blank, the stage is required** and cannot be skipped.\n\n*Source:* `03-1.0 Concept - Origination Overview and Common Parameters - Transcription.md:124`",
        "deck": "03-1.0"
      },
      {
        "question": "The SLA escalation field on a stage must hold a value that is a valid record in which table?",
        "options": [
          "`PW.ACTIVITY`",
          "`PW.PARTICIPANT`",
          "`SA.DATA.TYPES`",
          "`EM.XX.APPROVAL`"
        ],
        "answer": 1,
        "explanation": "**b — `PW.PARTICIPANT`.**\n\nSLA is the institution's in-house target for processing an application, tracked **in days** with an optional tolerance. When the SLA is breached the system notifies the escalation path via **Task Management**, and that escalation must resolve to a valid `PW.PARTICIPANT` record.\n\n*Source:* `03-1.0 Concept - Origination Overview and Common Parameters - Transcription.md:128`",
        "deck": "03-1.0"
      },
      {
        "question": "Why is the **Default Status** deliberately left blank for the Review/Approval stage in the Workflow Parameters tab?",
        "options": [
          "Because the stage is always Optional",
          "To avoid the system defaulting a decision for the approving officer",
          "Because no status records exist for that stage",
          "Because the status is set later at Offer Production"
        ],
        "answer": 1,
        "explanation": "**b — to avoid defaulting a decision.**\n\nOtherwise the system would apply a status as soon as the user commits the stage. Leaving it blank forces the approving officer to **intentionally** decide whether the application is approved, provisionally approved or declined.\n\n*Source:* `03-2.0 Concept - Origination Additional Parameters 1 - Transcription.md:32`",
        "deck": "03-2.0"
      },
      {
        "question": "For application approvals, records can exist at both product and product group level. Which takes priority?",
        "options": [
          "The product group record",
          "The product record",
          "Whichever was created first",
          "Both are applied together"
        ],
        "answer": 1,
        "explanation": "**b — the product level definition takes priority.**\n\nApproval levels (which role may approve which amount) can be defined **per currency** and for a **product group or a product**. Where both exist, the **product** record wins.\n\n*Source:* `03-2.0 Concept - Origination Additional Parameters 1 - Transcription.md:135`",
        "deck": "03-2.0"
      },
      {
        "question": "Loans support both Single and Dual approval. How is the method selected, given both use the same table?",
        "options": [
          "By creating a separate Dual Approval table",
          "By the **Approval Check Rule** field at the top of `EM.LO.APPROVAL`",
          "By ticking a checkbox on the product group",
          "By the currency of the approval level"
        ],
        "answer": 1,
        "explanation": "**b — the Approval Check Rule field** at the top of `EM.LO.APPROVAL`.\n\nThe trap in the question is real: the **same table, `EM.LO.APPROVAL`, serves both** single and dual approval, so an explicit selection of the method is necessary.\n\n*Source:* `03-2.0 Concept - Origination Additional Parameters 1 - Transcription.md:181`",
        "deck": "03-2.0"
      },
      {
        "question": "In Dual Approval, what is the difference between **Single Limit** and **Dual Limit**?",
        "options": [
          "Single Limit is the loan count; Dual Limit is the amount",
          "Single Limit applies when one member of the level approves alone; Dual Limit applies when two members approve jointly — and is higher",
          "Single Limit is for individuals, Dual Limit for groups",
          "Dual Limit is the sum of two Single Limits"
        ],
        "answer": 1,
        "explanation": "**b — Single applies to one approver alone; Dual applies to two approvers jointly, and is higher.**\n\nWhere an amount exceeds one member's single limit but is within the level's dual limit, the officer can refer it to another member of the same group — the first officer does not have to approve it, only be a member of the approval group. Beyond the dual limit the application routes to a higher group via Task Management.\n\n*Source:* `03-2.0 Concept - Origination Additional Parameters 1 - Transcription.md:201`",
        "deck": "03-2.0"
      },
      {
        "question": "On `EM.XX.STAGE.CHECKLIST`, the **Item Override** field is left blank for a checklist item. What does that mean?",
        "options": [
          "The item is optional",
          "The user may override it and must enter a note",
          "The item cannot be overridden — the inputter must indicate it has been received",
          "The item is skipped automatically"
        ],
        "answer": 2,
        "explanation": "**c — it cannot be overridden.**\n\nIf **Item Override** is set to **Yes**, a user may mark the item as no longer required (and must enter a note explaining why). Left blank, the item **cannot be overridden** and the inputter must record that it was received.\n\n*Source:* `03-3.0 Concept - Origination Additional Common Parameters 2 - Transcription.md:33`",
        "deck": "03-3.0"
      },
      {
        "question": "In a loan application, a user wants to skip a required checklist item. What is the correct mechanism?",
        "options": [
          "Set the item to 'Not required'",
          "Use the **Override** status",
          "Delete the item from `GIC.CHECKLIST.MASTER`",
          "Tick 'Skip If Auto Approved'"
        ],
        "answer": 1,
        "explanation": "**b — Override.**\n\nA user **cannot** set an item to *Not required* manually in the loan application — *Not required* is a parameter-time state. To skip a required item the user applies **Override** (with a note). If the item has the `Bring.Forward` attribute it is then moved to the next stage.\n\n*Source:* `03-3.0 Concept - Origination Additional Common Parameters 2 - Transcription.md:51`",
        "deck": "03-3.0"
      },
      {
        "question": "The **Skip If Auto Approved** flag removes a checklist item once all auto approval rules pass. Which stages is it relevant to?",
        "options": [
          "Only Application Input",
          "Only stages from **Credit Assessment** onward",
          "Every stage in the workflow",
          "Only the Review/Approval stage"
        ],
        "answer": 1,
        "explanation": "**b — from Credit Assessment onward.**\n\nThe flag is only relevant to the application stages **following the Credit Assessment stage**, because that is where the **auto approval rules are executed**. Note this field — along with *Default Not Required* — applies to **loans only**, not deposits or accounts.\n\n*Source:* `03-3.0 Concept - Origination Additional Common Parameters 2 - Transcription.md:49`",
        "deck": "03-3.0"
      },
      {
        "question": "On `EM.DO.PARAMETERS`, what does **Skip Approval for Authorized Users** mean?",
        "options": [
          "Authorized users cannot approve applications",
          "The approval stage is presented and the user may skip it",
          "If set, origination will not present the approval stage when the user has permission to authorize the deposit amount",
          "If unset, the current user may approve all deposits regardless of amount"
        ],
        "answer": 2,
        "explanation": "**c — the approval stage is omitted when the user is authorised for the amount.**\n\nThere is an inverse constraint worth remembering: if the field is **No**, the `REVIEW.APPROVAL` stage **cannot** be set to *Not Required*; if it is **Yes**, that stage **cannot** be set to *Required*.\n\n*Source:* `03-1.0 Concept - Origination Overview and Common Parameters - Transcription.md:282`",
        "deck": "03-3.0"
      },
      {
        "question": "**Blocking Mode** is set to **Proportional**. How are funds blocked across multiple guarantors?",
        "options": [
          "The same amount is blocked in each guarantor's account",
          "Each guarantor is blocked in proportion to the amount they guarantee",
          "Only the first guarantor is blocked",
          "The block is split equally regardless of guarantees"
        ],
        "answer": 1,
        "explanation": "**b — in proportion to each guarantor's guaranteed amount.**\n\n**Equal** blocks the same amount in each account; **Proportional** scales the block by how much each guarantor guarantees. A key invariant: **the amount blocked can never exceed the guaranteed amount** for that guarantor.\n\n*Source:* `03-4.0 Guarantor Parameters - Transcription.md:92`",
        "deck": "03-4.0"
      },
      {
        "question": "The parameter **Min. No. of Guarantors per Loan** is set above zero. What is the consequence?",
        "options": [
          "Guarantors become optional",
          "The guarantor stage of Loan Origination (and the guarantor tab of Direct Loan) becomes mandatory",
          "The loan is auto-declined",
          "Guarantor accounts are blocked automatically"
        ],
        "answer": 1,
        "explanation": "**b — the guarantor stage becomes mandatory.**\n\nA value greater than zero forces the guarantor step to be completed in Loan Origination (and later the guarantor tab of Direct Loan). If the field is zero or left blank, the stage is not forced.\n\n*Source:* `03-4.0 Guarantor Parameters - Transcription.md:119`",
        "deck": "03-4.0"
      },
      {
        "question": "Where are the conditions that exclude a person from acting as guarantor defined, and how do they behave?",
        "options": [
          "In `EM.LO.GUARANTOR.PARAM`, always as an error",
          "In `EM.GU.CONDITION`, with each condition configured as **Error** or **Override** and carrying its own message",
          "In `PW.PARTICIPANT`, as permissions",
          "In `EM.GU.REASON.RELEASE`, as release reasons"
        ],
        "answer": 1,
        "explanation": "**b — `EM.GU.CONDITION`**, each record configured with an **Error** or **Override** action and a message.\n\nIf any selected condition is true for a prospective guarantor, the configured message is raised. (Release reasons are a different table — `EM.GU.REASON.RELEASE`.)\n\n*Source:* `03-4.0 Guarantor Parameters - Transcription.md:133`",
        "deck": "03-4.0"
      },
      {
        "question": "In a score card, how should the **Operand** field be used?",
        "options": [
          "OR between different data types, AND within a data type's values",
          "AND between different data types, OR within a data type's values",
          "AND throughout",
          "OR throughout"
        ],
        "answer": 1,
        "explanation": "**b — AND between data types, OR within a data type's values.**\n\nThe operand that combines all **data type scores** into an overall score is **AND**; the operand that evaluates the **different values of a single data type** (e.g. the age bands) is **OR**. Mixing these up is the classic score card error.\n\n*Source:* `03-5.0 Concept - Credit Scoring Parameters - Transcription.md:96`",
        "deck": "03-5.0"
      },
      {
        "question": "How does `SA.SCORE.LIMIT` work, and what must the **last** value of the `UPTO.SCORE` multi-value field be?",
        "options": [
          "It is a lookup of exact scores; the last value is 100",
          "It runs like a cumulative frequency table; the last `UPTO.SCORE` value must be `REST`",
          "It stores a single recommended limit; the field is blank",
          "It lists decline reasons; the last value is the highest score"
        ],
        "answer": 1,
        "explanation": "**b — cumulative frequency style, with `REST` last.**\n\nEach `UPTO.SCORE` holds the upper bound of a score range and the matching `REC.LIMIT` holds the recommended limit for that range. The final `UPTO.SCORE` must be **`REST`** — meaning any score above the previous value. A routine can be attached if the standard table is not enough.\n\n*Source:* `03-5.0 Concept - Credit Scoring Parameters - Transcription.md:165`",
        "deck": "03-5.0"
      },
      {
        "question": "Which values are accepted in the **Source Field** of `EM.LO.CS.SA.DATA.MAPPING`?",
        "options": [
          "Any T24 field name",
          "`CUSTOMER.ID`, `APPLICATION.ID`, `INC.EXP.ID` and `EXTERNAL`",
          "Only `CUSTOMER.ID`",
          "Only `SYSTEM`"
        ],
        "answer": 1,
        "explanation": "**b — `CUSTOMER.ID`, `APPLICATION.ID`, `INC.EXP.ID` and `EXTERNAL`.**\n\nThe mapping table is **global** (its Id is `SYSTEM`) and does not vary by loan product. `CUSTOMER.ID` extracts from any table keyed by customer number, `APPLICATION.ID` from the loan origination file, and `INC.EXP.ID` from the Income and Expenditure table.\n\n*Source:* `03-5.0 Concept - Credit Scoring Parameters - Transcription.md:258`",
        "deck": "03-5.0"
      },
      {
        "question": "A bank wants to guarantee that failing one data type test means the applicant fails credit scoring outright. What is the supported approach?",
        "options": [
          "Set that data type's score to `-100`",
          "Make the data type the first one defined in the score card",
          "Set the score as low as possible to make the whole result a failure",
          "It cannot be achieved with credit scoring — a local development is required"
        ],
        "answer": 0,
        "explanation": "**a — assign a deeply negative score for that data type.**\n\nA large negative weight drags the overall score below the pass threshold, so the applicant cannot pass. The exact figure is a design choice — what matters is that the penalty is large enough to guarantee failure.\n\n*Source:* `03-5.0 Concept - Credit Scoring Parameters - Transcription.md:145`",
        "deck": "03-5.2"
      },
      {
        "question": "A bank wants Loan Origination to suggest an amount to approve for each application. Which table drives this?",
        "options": [
          "`SA.LIMIT.RECOMMEND`",
          "`SA.SCORE.LIMIT`",
          "`EM.LIMIT.SUGGEST`",
          "It cannot be done and the bank should be discouraged"
        ],
        "answer": 1,
        "explanation": "**b — `SA.SCORE.LIMIT`.**\n\nCredit scoring produces a score; the score limit table maps score ranges to a **recommended limit** (`REC.LIMIT`), which origination then reports. The other table names in the options do not exist.\n\n*Source:* `03-5.0 Concept - Credit Scoring Parameters - Transcription.md:153`",
        "deck": "03-5.2"
      }
    ]
  },
  {
    "id": "deposits-accounts",
    "title": "Deposits & Accounts — Concept Facts",
    "subtitle": "Decks 02-5.0 & 02-6.0 · Deposit and Savings Plans Product Builder · Account Product Builder and Overdraft Facilities",
    "questions": [
      {
        "question": "What drives the shape of the deposit product workflow?",
        "options": [
          "The category range reserved on the product group",
          "PRODUCT.TYPE on the product group",
          "The currencies defined on the product group",
          "Whether the product inherits the Settlement condition"
        ],
        "answer": 1,
        "explanation": "**b — `PRODUCT.TYPE` on the product group.**\n\nThe selection made at product group creation drives the workflow. The available values are **Call Deposit**, **Savings Plan** and **Term Deposit**.\n\nThis is why a Savings Plan gets a different set of stages than a Term Deposit — the type is chosen before any products are built. In Inclusive Banking, the **SavPlans** and **TermDeps** product group records ship with the ISB and can be amended if necessary.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:115,117`",
        "deck": "02-5.0"
      },
      {
        "question": "Which statement about deposit product categories is correct?",
        "options": [
          "Savings Plans 6500 – 6599 and Term Deposits 6700 – 6799, with up to 200 products",
          "Savings Plans 6000 – 6099 and Term Deposits 6500 – 6599, with up to 300 products",
          "Savings Plans 6700 – 6799 and Term Deposits 6500 – 6599, with up to 100 products",
          "Both deposit types share a single range, with up to 200 products"
        ],
        "answer": 0,
        "explanation": "**a — Savings Plans 6500 – 6599, Term Deposits 6700 – 6799, up to 200 products.**\n\nThe ranges are distinct per product type. Up to **200** deposit and savings plan products can be created based on the setup in Inclusive Banking.\n\nDon't carry the account-product numbers over: retail accounts run to **300** products, and their savings range is **6000 – 6099** — which is savings *accounts*, a different product line from savings *plans*.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:81-83`",
        "deck": "02-5.0"
      },
      {
        "question": "Which statement about the deposit inheritance group and its conditions is correct?",
        "options": [
          "The inheritance group, product group and global conditions live on the same table, and shared conditions are optional",
          "They live on three separate tables, and shared conditions are mandatory",
          "They live on the same table, and global conditions must be redefined for every product",
          "They live on separate tables, and global conditions are optional"
        ],
        "answer": 0,
        "explanation": "**a — same table, and shared conditions are optional.**\n\nIn Inclusive Banking the **inheritance group, product group and its global conditions are all defined on the same table**. Beyond the global conditions, additional **shared conditions** may be defined to apply to products within the group, and various mixes of them can be inherited when building different products.\n\n**Shared conditions are optional — it is possible to define all conditions while building the product.** Note the counterweight from the concept deck: **global conditions are predefined in the ISB and are not to be amended without due care.** During implementation the model's product conditions must be reviewed and aligned to the institution's business requirements.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:59` · `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:62` · `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:97`",
        "deck": "02-5.0"
      },
      {
        "question": "Which features are specific to Savings Plans rather than Term Deposits?",
        "options": [
          "Bonus and Deposit Ageing Fee charges, an additional Payment Schedule tab, and an Overdue stage",
          "Settlement and Tax inheritance, plus a Closure stage",
          "A Term/Amount stage and a Payment Schedule stage",
          "Royalty Interest and Global Conditions"
        ],
        "answer": 0,
        "explanation": "**a — Bonus / Deposit Ageing Fee, an extra Payment Schedule tab, and an Overdue stage.**\n\n- **Bonus** — bonuses generally apply to Savings Plans as an incentive for timely payments, so Bonus and Bonus Restricted may be opted for at Charge selection\n- **Deposit Ageing Fee** — a penalty for late payment of the regular deposit amount\n- **Payment Schedule stage** — Savings Plans get an **additional tab** to define the deposit frequency\n- **Overdue stage** — presented **only** for Savings Plan products, and **mandatory where Deposit Ageing Fee or Bonus Restricted are defined**\n\nThe Overdue stage is the important one: it's the only case in the deck where a stage becomes mandatory.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:133-136`",
        "deck": "02-5.0"
      },
      {
        "question": "For a savings plan, what happens to the amount entered in the Term/Amount stage?",
        "options": [
          "It is the total commitment, debited in full at arrangement creation",
          "It maps to ACTUAL.AMT in the Payment Schedule and is treated as the initial amount only",
          "It is ignored — the commitment comes solely from the Payment Schedule",
          "It sets the bonus calculation basis but not the deposit amount"
        ],
        "answer": 1,
        "explanation": "**b — it maps to `ACTUAL.AMT` in the Payment Schedule and is the initial amount only.**\n\nUnlike other deposit products, the Term Amount figure maps to **`ACTUAL.AMT`** in the Payment Schedule. Bills are generated during **COB** on the regular deposit schedule date. Any amount defined in the Term Amount product condition is considered to be the **initial amount only** — and in such cases the system generates an **EXPECTED bill online for settlement**.\n\nRelated detail from the same deck: the term amount may be left blank, with the commitment amount specified in `ACTUAL.AMT` in the Payment Schedule.\n\n*Source:* `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:144` · `02-5.0 Concept - Deposit and Savings Plans Product Builder - Transcription.md:149`",
        "deck": "02-5.0"
      },
      {
        "question": "Which statement about retail account types and category ranges is correct?",
        "options": [
          "Current 1000 – 1099, Savings 6000 – 6099, Shares 7300 – 7399, with up to 300 products",
          "Current 6000 – 6099, Savings 1000 – 1099, Shares 7300 – 7399, with up to 200 products",
          "Current 1000 – 1099, Savings 6500 – 6599, Shares 6700 – 6799, with up to 300 products",
          "All three share one range, with up to 300 products"
        ],
        "answer": 0,
        "explanation": "**a — Current 1000 – 1099, Savings 6000 – 6099, Shares 7300 – 7399, up to 300 products.**\n\nThe Account Product Builder designs **Current Accounts, Savings Accounts and Share Accounts.** Inheritance groups and shared conditions for all three are delivered with the Inclusive Banking ISB and can be amended suitably if necessary.\n\nUp to **300** products can be created — more than the 200 ceiling on deposits.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:35` · `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:62-65`",
        "deck": "02-6.0"
      },
      {
        "question": "Which conditions are commonly defined for inheritance on retail accounts?",
        "options": [
          "Statement, Tax, Dormancy, Payoff and Closure",
          "Settlement, Tax, Renewal and Closure",
          "Overdue, Grace Period, Delinquent Period and Non-Accrual Basis",
          "Limit, Eligibility, Term/Amount and Payment Schedule"
        ],
        "answer": 0,
        "explanation": "**a — Statement, Tax, Dormancy, Payoff and Closure.**\n\nThat's the retail-account inheritance set, and it differs from the deposit set (**Settlement, Tax, Renewal, Closure**) — the two product lines share **Tax** and **Closure** but not the rest.\n\nThe deck notes shared conditions **can be defined differently for each of the product types**, and that the lesson focuses on the differences for account products and their unique product conditions.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:52`",
        "deck": "02-6.0"
      },
      {
        "question": "Under what circumstances does the system automatically create the limit record as part of account opening?",
        "options": [
          "When the limit product is provided in the Limit product condition and the Limit Serial number is set to NEW",
          "Whenever Use Limit is set to Yes on the product",
          "When a default overdraft facility amount is set at product level",
          "When Separate Application is set to Yes"
        ],
        "answer": 0,
        "explanation": "**a — limit product provided on the Limit product condition, and Limit Serial = `NEW`.**\n\nThe limit product (e.g. **100** in Inclusive Banking) must be provided **and** the limit Serial number set to **NEW**. When both are true, the system automatically creates the limit record as part of the account opening process, meaning **limit handling is done through and managed by AA**.\n\nA default overdraft facility amount can also be set at product level, **or** Minimum and Maximum amounts set to allow negotiation within the allowed range. Those control the facility's *value* — they don't create the record.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:108`",
        "deck": "02-6.0"
      },
      {
        "question": "What is the difference between Check Type SINGLE and All, and between Joint Limit Liability FULL and SPLIT?",
        "options": [
          "SINGLE checks a single account, All checks all accounts of the customer; FULL makes joint holders fully liable, SPLIT splits liability equally",
          "SINGLE checks a single customer, All checks all customers in the group; FULL covers all holders, SPLIT covers one",
          "SINGLE checks one currency, All checks all currencies; FULL means full liability, SPLIT means no liability",
          "SINGLE is a one-off check, All is continuous; FULL and SPLIT both split liability but FULL includes collateral"
        ],
        "answer": 0,
        "explanation": "**a — SINGLE = single account, All = all accounts of the customer; FULL = joint holders fully liable, SPLIT = liability equally split.**\n\nFrom the OD Other Parameters:\n\n- **Check Type `SINGLE`** — the maximum limit amount check applies to a **single account**\n- **Check Type `All`** — the maximum limit amount check applies to **all accounts of the customer**\n\nWhere Joint Accounts are to be included for maximum limit amount checking, the system can further perform a **FULL** check (joint holders fully liable for the account limit) or a **SPLIT** check (liability equally split between the joint holders).\n\nAlso in this parameter group: **Review Frequency** may be set to Monthly, Quarterly or Yearly.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:119-128`",
        "deck": "02-6.0"
      },
      {
        "question": "How may overdraft renewal be set, and where are its conditions maintained?",
        "options": [
          "Automatic, User triggered or Conditional — with conditions in EB.PARAM > ALL-EM.ACCT.LIMIT.REVIEW",
          "Automatic or Manual — with conditions on the Dormancy product condition",
          "Conditional only — with conditions in the ACCOUNT.CLASS record",
          "Automatic, User triggered or Conditional — with conditions in EM.PRODUCT.PARAMETERS"
        ],
        "answer": 0,
        "explanation": "**a — Automatic, User triggered or Conditional, with conditions in `EB.PARAM > ALL-EM.ACCT.LIMIT.REVIEW`.**\n\nOverdraft renewal may be **Automatic**, **User triggered** or **Conditional**. In the current release, **two** conditions are maintained in `EB.PARAM > ALL-EM.ACCT.LIMIT.REVIEW`: **`MIN.30D.CREDIT`** and **`NO.UNAUTH.DEBIT`**.\n\nKeeping them in a system parameter table rather than on the product means the threshold behaviour is changed once, centrally, rather than per product.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:138`",
        "deck": "02-6.0"
      },
      {
        "question": "Which statement correctly describes the two overdraft renewal conditions?",
        "options": [
          "MIN.30D.CREDIT requires the account to return to credit for a minimum of 30 days in a rolling 12-month period; NO.UNAUTH.DEBIT queues immediate review after 3 OOO events",
          "MIN.30D.CREDIT requires a minimum balance of 30 held for 12 months; NO.UNAUTH.DEBIT blocks all unauthorised debits",
          "MIN.30D.CREDIT reviews the facility every 30 days; NO.UNAUTH.DEBIT reviews it after any unauthorised debit",
          "Both are optional charge conditions applied at account closure"
        ],
        "answer": 0,
        "explanation": "**a — the rolling-credit rule and the 3-OOO-event rule.**\n\n- **`MIN.30D.CREDIT`** — the account must return to credit for a **minimum of 30 days in any rolling 12-month period**; otherwise the facility must be reviewed and cannot auto-renew.\n- **`NO.UNAUTH.DEBIT`** — the facility is queued for **immediate review after 3 out-of-order (OOO) events**.\n\nOn that second one, the material is explicit that it counts **occasions, not payment items or referrals** — several referrals in one day count once. Without both conditions satisfied, the facility cannot auto-renew.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:140-141` · `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:147-150`",
        "deck": "02-6.0"
      },
      {
        "question": "Which account type requires notice before withdrawing funds, and what do its three parameters mean?",
        "options": [
          "A Notice account — Notice Amount is the max withdrawable without notification, Notice Period is the notice given before larger amounts can be withdrawn, Notice Availability is how long funds stay available once notice is served",
          "A Dormant account — Notice Amount, Notice Period and Notice Availability govern reactivation",
          "A Share account — the parameters govern dividend withdrawal",
          "A Current account — the parameters govern overdraft drawdown notice"
        ],
        "answer": 0,
        "explanation": "**a — a Notice account, defined in `EM.PRDA.BALANCE.AVAILABILITY`.**\n\nCertain types of accounts require notice for withdrawing funds — also known as **Notice accounts**. For such accounts the notice parameters are defined at the **Balance Availability** stage:\n\n- **Notice Amount** — the maximum amount that can be withdrawn **without any notification**\n- **Notice Period** — the notice days or months given before an amount **greater than the notice amount** can be withdrawn\n- **Notice Availability** — the period for which the funds are **made available once the notice has been served**\n\nImplementation gotcha from the deck: the **category code of the notice account product must exist in the `ACCOUNT.CLASS` record `SAVINGS`.**\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:157-160` · `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:164`",
        "deck": "02-6.0"
      },
      {
        "question": "Which statement about the Dormancy stage is correct?",
        "options": [
          "It is mutually exclusive with the Inactivity Months functionality on the Company record, and a dormancy fee definition becomes mandatory in Charge Selection if a charge frequency is set",
          "It replaces the Company record's inactivity setting, and charges are always optional",
          "It can be used alongside Inactivity Months, and charges are defined on the Closure stage",
          "It applies only to Current accounts, and no charges can be levied"
        ],
        "answer": 0,
        "explanation": "**a — mutually exclusive with Inactivity Months, and the fee becomes mandatory if a charge frequency is set.**\n\nUser-defined dormancy statuses can be configured based on the inactivity period, and this is **mutually exclusive with the Inactivity Months functionality** available in the Company record or Account Product Condition.\n\nThe deck also states: *\"Dormancy fee definition becomes mandatory in the Charge selection stage if charge frequency is defined at this stage.\"*\n\nTwo operational details worth carrying: **Inactivity Months** marks an account as inactive during **Close of Business**, and the **`ACCT.INACTIVE.RESET`** application is used to remove the inactive setting. Auto-closure of dormant accounts is supported through additional configuration in the **Product Qualifier** and **Activity Restriction** product conditions. Institutions can include any financial or non-financial activity in the check for last customer-initiated activity — and the **default activities predefined in Inclusive Banking must be reviewed and updated during implementation**.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:173,175` · `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:179` · `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:181`",
        "deck": "02-6.0"
      },
      {
        "question": "Which three kinds of restriction can be defined at the Account Restrictions stage?",
        "options": [
          "Complete restriction of specified transactions (Error or Override), Periodic Rules, and Property Rules",
          "Hard block, soft block and advisory notice",
          "Debit restrictions, credit restrictions and balance restrictions",
          "Customer level, account level and product level rules"
        ],
        "answer": 0,
        "explanation": "**a — complete transaction restriction, Periodic Rules and Property Rules.**\n\nThe deck defines them as:\n\n- **Complete Restriction of specified transactions** — specify the transactions to be restricted and **whether a transaction of this type results in an Error or an Override**. The stated example is *No Overdraft* — blocking activities that attempt to overdraw an account.\n- **Periodic Rules** — transaction rules based on **the period of time, including the full lifetime of the arrangement**. The stated example: no more than 3 cash withdrawals every quarter.\n- **Property Rules** — restriction rules based on **properties defined in the Payment Schedule**. When the Payment Schedule is processed the rule is evaluated, and the property may or may not be applied. The stated example: *waive interest if more than three withdrawals during the year.*\n\nThat third one is how an interest waiver is implemented — as a restriction rule evaluated against a Payment Schedule property, not as a charge.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:240-242`",
        "deck": "02-6.0"
      },
      {
        "question": "What is required for the Change Product condition to work?",
        "options": [
          "Both products must be in the same product group; it supports relative periods such as R_BIRTH + 18Y",
          "Both products must be in different product groups so the account can migrate across ranges",
          "The two products must share the same category code",
          "Change Product applies only within the same currency"
        ],
        "answer": 0,
        "explanation": "**a — both products in the same product group, and relative periods are supported.**\n\nChange Product enables the change of an account from one product type to another **during its lifetime**. It defines the rules and behaviour for allowing arrangements of one product to be changed to another. The bank can indicate **which product the account will change into** when the change product parameters are met.\n\nThe deck's example is an automatic change **from a Children product to a Regular savings account on the customer's 18th birthday** — which is where the relative period form comes in, e.g. `R_BIRTH + 18Y`.\n\nThe constraint to remember: the two products must be in the **same product group**.\n\n*Source:* `02-6.0 Concept - Account Product Builder and Overdraft Facilities - Transcription.md:252`",
        "deck": "02-6.0"
      }
    ]
  },
  {
    "id": "income-stress-global",
    "title": "Income, Stress Testing & Global Parameters — Quiz",
    "subtitle": "Decks 03-6.0 & 03-7.0 · Income-Expenditure, Loan Stress Testing and Global Product Parameters",
    "questions": [
      {
        "question": "Where is the stress-testing parameter record stored?",
        "options": [
          "`EM.INC.EXP`",
          "`EB.PARAM` > `ALL-LO.DEBT.TO.INCOME.RATIO.RULES`",
          "`EM.HOUSEHOLD.INC.TYPE`",
          "`EM.LO.PARAMETERS`"
        ],
        "answer": 1,
        "explanation": "**b — `EB.PARAM` > `ALL-LO.DEBT.TO.INCOME.RATIO.RULES`.**\n\n`EM.INC.EXP` holds each applicant's actual income and expenditure values; the rules record decides how they are stressed.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "Which table records debts the applicant is *directly* responsible for paying?",
        "options": [
          "`EM.SECONDARY.DEBT.TYPE`",
          "`EM.EXTERNAL.EXP.TYPE`",
          "`EM.PRIMARY.DEBT.TYPE`",
          "`EM.HOUSEHOLD.EXP.TYPE`"
        ],
        "answer": 2,
        "explanation": "**c — `EM.PRIMARY.DEBT.TYPE`.**\n\nSecondary debts are those owed through guaranteeing others, e.g. signing as guarantor for a relative or giving a personal guarantee on company debt.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "Which kind of debt does `EM.SECONDARY.DEBT.TYPE` typically describe?",
        "options": [
          "Debts the applicant owes directly",
          "Debts owed by guaranteeing others",
          "Household living expenses",
          "Debts of the bank"
        ],
        "answer": 1,
        "explanation": "**b — Debts owed by guaranteeing others.**\n\nThe classifications are fluid, so institutions can use the table as they see fit.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What is the difference between household expenses and external expenses?",
        "options": [
          "Household expenses are non-essential; external ones are living costs",
          "Household expenses are living costs (food, rent, utilities); external expenses are non-household and have no direct impact on subsistence",
          "They are identical and share one table",
          "External expenses are only for groups"
        ],
        "answer": 1,
        "explanation": "**b.** Household = living expenses (`EM.HOUSEHOLD.EXP.TYPE`). External = non-household (`EM.EXTERNAL.EXP.TYPE`).\n\nThe line between the two is thin.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "Under *Administration*, where are the income and expenditure parameter tables accessed?",
        "options": [
          "Administration > Products > Scoring & Profiling",
          "Administration > Security > Users",
          "Administration > Origination > Stages",
          "Administration > Accounting > Rules"
        ],
        "answer": 0,
        "explanation": "**a — Administration > Products > Scoring & Profiling.**\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "True or false: stress testing is mandatory in every Inclusive Banking implementation.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "**False.** Stress testing is **optional**, though it is a regulatory requirement in some countries.\n\nThis release gives an initial framework that can be expanded.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "In this release, how are stress-testing results used by default?",
        "options": [
          "They automatically reject the application",
          "They are for information, and may also feed credit scoring via the `EM.LO.CS.SA.DATA.MAPPING` table",
          "They automatically reduce the interest rate",
          "They are posted as an accounting entry"
        ],
        "answer": 1,
        "explanation": "**b.** Results are informational; a bank may include select fields in credit scoring mapping.\n\nA context enquiry shows the results in the Credit Assessment and Review/Approval stages.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What does the income type entry `HI-WAGE` mean?",
        "options": [
          "Household Income – Wage",
          "High Income – Wage",
          "Household Investment – Wage",
          "Hourly Income – Wage"
        ],
        "answer": 0,
        "explanation": "**a — Household Income Wage.**\n\n`HE-FOOD` similarly means Household Expenditure Food.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "An income entry is `HI-WAGE-95-90`. How much of the actual wage is used for testing?",
        "options": [
          "95%",
          "90%",
          "85.5% (90% of 95%)",
          "100%"
        ],
        "answer": 2,
        "explanation": "**c — 85.5%.** Two layers of stressing are allowed; here 95% of the income is included, and that is then stressed again to 90% of the result.\n\nA dashed `--` means 100% of the unstressed amount is used.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "An expenditure entry is `HE-FOOD-110-110`. What does it mean?",
        "options": [
          "Food expense is reduced by 10% twice",
          "The food expense is first increased by 10%, then stressed again by 10%",
          "Food expense is capped at 110",
          "Only 110 units of food are allowed"
        ],
        "answer": 1,
        "explanation": "**b.** For expenditure, values above 100 *increase* the amount (110 = +10%), the opposite direction to income stressing.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What does setting `DTI Use Current Monthly Payment` to YES do?",
        "options": [
          "Excludes the current loan from testing",
          "Adds the monthly payment from the current application to included expenditure before the DTI check",
          "Doubles the income",
          "Switches the test to MSR"
        ],
        "answer": 1,
        "explanation": "**b.** The repayment derived from the current application is added to the expenditure side. If NO, it is excluded.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What is special about the `DTI Stress Income Ratio` field?",
        "options": [
          "It stresses only expenditure",
          "One value stresses all income types, and it is mutually exclusive with per-income-type stressing",
          "It only works for mortgages",
          "It must always be 100"
        ],
        "answer": 1,
        "explanation": "**b.** If a value is entered, the user cannot enter stress percentages for individual income types.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What does the DTI Loan Amount Threshold do for non-mortgage loans?",
        "options": [
          "Sets the maximum loan amount",
          "Loans below this amount are not tested",
          "Sets the minimum interest rate",
          "Sets the stress percentage"
        ],
        "answer": 1,
        "explanation": "**b.** It holds the loan amount below which testing is not done.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "How does MSR (Mortgage Service Ratio) testing differ from DTI testing?",
        "options": [
          "MSR has no income stressing",
          "Expenditure is limited to the current loan's calculated repayment (automatically included), and the interest rate can be increased via `Stress MSR Repayment Interest`",
          "MSR tests all loan products",
          "MSR uses only guarantor income"
        ],
        "answer": 1,
        "explanation": "**b.** Income stressing works the same in both. MSR also raises the interest rate and recalculates the repayment, asking: if rates rise but income does not, can the borrower still pay?\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "Which loan types can test the effect of an interest-rate increase?",
        "options": [
          "All loan types",
          "Mortgage loans only",
          "Group loans only",
          "None"
        ],
        "answer": 1,
        "explanation": "**b — Mortgage loans only.** For other loans the income/expenditure items are identified but no rate-rise test applies.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What is the record Id of `EM.INC.EXP` when created inside a loan application?",
        "options": [
          "Loan product id",
          "Customer Number – Loan Application Number",
          "Group id",
          "Account number"
        ],
        "answer": 1,
        "explanation": "**b.** It is auto-generated. Records created outside an application use just the customer number.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "What must be set for stress testing calculations to occur?",
        "options": [
          "`Create separate income/expenditure per application` = Y in `EB.PARAM > ALL-EM.INCOME.EXPENDITURE`",
          "`Scoring Required` = No",
          "Group limits switched on",
          "Credit check set to Required"
        ],
        "answer": 0,
        "explanation": "**a.** With Y, records are created per loan application; stress testing requires this.\n\n*Source:* `03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf`",
        "deck": "03-6.0"
      },
      {
        "question": "Which table does the Global Product Parameters concept deck describe, with record ID `SYSTEM`?",
        "options": [
          "`EM.PRODUCT.PARAMETERS`",
          "`EM.PRODUCT.GROUP`",
          "`EM.LO.PARAMETERS`",
          "`EM.INC.EXP`"
        ],
        "answer": 0,
        "explanation": "**a — `EM.PRODUCT.PARAMETERS`.** It holds miscellaneous values affecting many Inclusive Banking applications, grouped into labelled tabs.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "Why capture savings account categories in the Initial Deposit eligibility section?",
        "options": [
          "To pay interest on them",
          "So origination can check that the borrower has deposited funds to show equity for the loan",
          "To block guarantor funds",
          "To compute group limits"
        ],
        "answer": 1,
        "explanation": "**b.** The second section covers the requirement that borrowers have held savings accounts for some time.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "When rescheduling a loan, what does *Amend Original Term* do?",
        "options": [
          "Starts a fresh anniversary from today",
          "Extends or reduces the term using the current term anniversaries (e.g. still the 15th of the month)",
          "Cancels the loan",
          "Resets the interest rate"
        ],
        "answer": 1,
        "explanation": "**b.** The alternative, *Define From Today*, drops the existing date frequency and uses today as the new anniversary date.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "What does the source-of-repayment-date setting *Contract Next Due Date* mean?",
        "options": [
          "Payments follow product parameters",
          "The loan reschedules to start on the contract's next due date",
          "Payments start today",
          "Payments are suspended"
        ],
        "answer": 1,
        "explanation": "**b.** *Product* means the loan resets according to the product parameters instead.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "If *Term as Number of Payments* is selected, the loan term is defined by…",
        "options": [
          "The calendar period from the application",
          "The number of payments",
          "The maturity date only",
          "The customer's age"
        ],
        "answer": 1,
        "explanation": "**b.** Term is not taken from the calendar period in the loan application.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "How are group-loan shadow limits calculated?",
        "options": [
          "Fixed bank-wide amount",
          "Total savings balances of group members × a savings multiplier",
          "Sum of loans granted",
          "Guarantor income"
        ],
        "answer": 1,
        "explanation": "**b.** The Group Limit Parameters tab lists savings categories to check, and a second section lists categories used for the Savings Report in the Single Group View.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "What does the Guarantor Parameters tab hold?",
        "options": [
          "Guarantor income types",
          "Product categories checked for accounts that can be blocked to secure loans",
          "Guarantor scoring rules",
          "External guarantor Ids"
        ],
        "answer": 1,
        "explanation": "**b.** Customer guarantors may be required to provide accounts that are blocked to secure the loan.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      },
      {
        "question": "What does the Savings Multiplier tab configure?",
        "options": [
          "Shadow limits for individual customers: category codes, limit multiplier, override/error behaviour and affected loan products",
          "Group meeting dates",
          "Interest tiers",
          "Tax rates"
        ],
        "answer": 0,
        "explanation": "**a.** It is the individual-customer equivalent of group shadow limits; affected products go in the Loan Product field.\n\n*Source:* `03-7.0 Concept - Global Product Parameters.pdf`",
        "deck": "03-7.0"
      }
    ]
  },
  {
    "id": "loan-app-1",
    "title": "Loan Application Processing 1 — Quiz",
    "subtitle": "Deck 04-1.0 · Application Input, settlement, custom schedules and group applicants",
    "questions": [
      {
        "question": "Which application handles the loan application process through its origination stages?",
        "options": [
          "`AA.ARRANGEMENT`",
          "`EM.LO.APPLICATION`",
          "`EM.LO.GUARANTOR`",
          "`SA.SCORE.TXN`"
        ],
        "answer": 1,
        "explanation": "**b — `EM.LO.APPLICATION`.** Whether each stage is required, optional or not required depends on Loan Origination parameter setup.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "What is the correct order of the origination stages?",
        "options": [
          "Application Input → Eligibility Check → Guarantor Input → Credit Check → Collateral Input → Credit Scoring → Credit Assessment → Review/Approval → Offer Production → Loan Creation",
          "Application Input → Credit Scoring → Eligibility Check → Guarantor Input → Collateral Input → Credit Check → Review/Approval → Credit Assessment → Loan Creation → Offer Production",
          "Eligibility Check → Application Input → Credit Check → Guarantor Input → Credit Scoring → Collateral Input → Credit Assessment → Offer Production → Review/Approval → Loan Creation",
          "Application Input → Guarantor Input → Eligibility Check → Collateral Input → Credit Check → Credit Scoring → Review/Approval → Credit Assessment → Offer Production → Loan Creation"
        ],
        "answer": 0,
        "explanation": "**a.** Application Input, Eligibility Check, Guarantor Input, Credit Check, Collateral Input, Credit Scoring, Credit Assessment, Review/Approval, Offer Production, Loan Creation.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "Where can origination be accessed from?",
        "options": [
          "Only the command line",
          "The Single Customer View or the dedicated Loan Service Agent page",
          "Only the Arrangement Overview",
          "Only the teller screen"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "A customer who belongs to a group is processed as an *Individual* applicant. What happens?",
        "options": [
          "It is a group loan anyway",
          "It is treated as a non-group loan, excluded from group loan reports, and the group limit is neither checked nor updated",
          "The group limit is reduced",
          "The loan is blocked"
        ],
        "answer": 1,
        "explanation": "**b.** The Customer Type choice (Group, Individual, Non-Individual) appears only if Loan Origination Parameters allow group application processing.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "What does the Asset class field display on the application?",
        "options": [
          "The collateral value",
          "The worst overdue status of all the customer's existing loans",
          "The product group",
          "The credit score"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "For Refinance, Reschedule or Top-up, how is the loan to be amended selected?",
        "options": [
          "Typed in the notes field",
          "Via the *For Arrangement* field dropdown",
          "It is selected automatically",
          "By the approver later"
        ],
        "answer": 1,
        "explanation": "**b.** Only one loan action (New Loan / Refinance / Reschedule / Top-up) can be chosen. For a top-up, the value in *Term Requested* becomes the new term.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "Which loan products can be selected at Application Input?",
        "options": [
          "Any AA product",
          "Only loan product or product group records created in Loan Origination Parameters",
          "Only deposit products",
          "Only the most recent product"
        ],
        "answer": 1,
        "explanation": "**b.** On selection the system displays the interest rate and currency, and calculates the instalment once Amount and Term are entered.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "A loan product is set for automatic disbursement, but no disbursement account is entered. What happens?",
        "options": [
          "The loan is rejected",
          "An override message says automatic disbursement will be disabled",
          "Disbursement happens to a default account",
          "Nothing"
        ],
        "answer": 1,
        "explanation": "**b.** The reverse also applies: for a manual-disbursement product, entering a disbursement account triggers an override saying automatic disbursement will be triggered. An empty account field means the activity is done manually.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "When a checklist item is overridden, what is required?",
        "options": [
          "Supervisor password",
          "A note explaining why",
          "A new document",
          "Nothing"
        ],
        "answer": 1,
        "explanation": "**b.** Only items defined as overridable can be overridden. Otherwise the inputter selects an application status code.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "How can an individual loan use a custom payment schedule?",
        "options": [
          "Pick *Custom* in Repayment Frequency at Application Input",
          "Edit AA after loan creation only",
          "It is not possible",
          "Use a group loan"
        ],
        "answer": 0,
        "explanation": "**a.** If the product was configured for Custom schedules, *Custom* is defaulted and cannot be changed.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "What happens when the Application Input stage is committed with a custom schedule?",
        "options": [
          "A permanent arrangement is created",
          "A temporary Arrangement is created and the `AA.ARR.PAYMENT.SCHEDULE` opens for negotiation",
          "The loan is disbursed",
          "The stage is skipped"
        ],
        "answer": 1,
        "explanation": "**b.** The temporary Arrangement is deleted at Loan Creation, so the substantive Arrangement can be created. The custom schedule is transferred to it.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "In a custom schedule, how can a payment holiday be built?",
        "options": [
          "Multi-value the repayment row, with each row having a relative start date, period and optional number of payments",
          "Not possible",
          "Set interest to zero",
          "Use a charge"
        ],
        "answer": 0,
        "explanation": "**a.** E.g. start one month after disbursement and collect 3 payments, take a 4-month holiday, then restart from month 8.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "What do status codes 103 and 105 do?",
        "options": [
          "Reject the application",
          "Put the origination process on hold until the expected actions are completed",
          "Approve the application",
          "Delete the record"
        ],
        "answer": 1,
        "explanation": "**b.** Code behaviours are parameterised in `EM.LO.APPLICATION.STATUS`.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      },
      {
        "question": "How is the loan amount treated for a group application?",
        "options": [
          "Each member borrows the full amount",
          "It is shared among group members",
          "Only the leader borrows",
          "Group amount is ignored"
        ],
        "answer": 1,
        "explanation": "**b.** On entering Group Id, origination shares the amount, defaults the term for each member and calculates each instalment. Settlement accounts default if category codes exist in the Settlement Product Condition.\n\n*Source:* `04-1.0 Concept - Loan Application Processing 1.pdf`",
        "deck": "04-1.0"
      }
    ]
  },
  {
    "id": "loan-app-2",
    "title": "Loan Application Processing 2 — Quiz",
    "subtitle": "Deck 04-2.0 · Eligibility, Guarantor, Credit Check, Collateral and Credit Scoring",
    "questions": [
      {
        "question": "What does each eligibility result show?",
        "options": [
          "Pass or Fail only",
          "Passed, or Warning with a message if the criteria are not met",
          "A numeric score",
          "Approved or Rejected"
        ],
        "answer": 1,
        "explanation": "**b.** Criteria come from `EM.PRDL.ELIGIBILITY`. Failures raise an override or an error message, depending on the eligibility parameterisation.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "If eligibility fails because of wrong values in other tables, what can the user do?",
        "options": [
          "Nothing",
          "Put processing on hold and correct them, or step back to a previous stage (one step at a time)",
          "Delete the application",
          "Skip the stage"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "How are eligibility checks done for a group applicant?",
        "options": [
          "Only for the group leader",
          "Origination lists every member and checks each, showing results per member",
          "Only for the group as a whole",
          "Not required"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "A guarantor who is not a bank customer is created in which table?",
        "options": [
          "`EM.LO.GUARANTOR`",
          "`EM.LOAN.GUARANTORS`",
          "`AC.LOCKED.EVENTS`",
          "`ELO.GU.DOCUMENT`"
        ],
        "answer": 0,
        "explanation": "**a — `EM.LO.GUARANTOR`**, via *New External Guarantor*. Its Id always begins with the letter **G**.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "What is the record Id format of `EM.LOAN.GUARANTORS`?",
        "options": [
          "CustomerNumber-LoanOriginationId",
          "G + number",
          "Account number",
          "Loan product id"
        ],
        "answer": 0,
        "explanation": "**a.** The record opens when the user clicks *Add Loan Guarantors*, and is checked against `EM.LO.GUARATOR.PARAM`.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "How are internal guarantors' funds secured?",
        "options": [
          "Blocked using `AC.LOCKED.EVENTS` with an expiry date matching the loan maturity",
          "Moved to the loan account",
          "Not secured",
          "Charged a fee"
        ],
        "answer": 0,
        "explanation": "**a.** Funds can be released when the lock expires. There can be several locks on a guarantor's account, each with its own expiry.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "Which accounts are offered for an internal guarantor to select?",
        "options": [
          "Any account",
          "The customer's accounts in the category code defined in `EM.PRODUCT.PARAMETERS`",
          "Only current accounts",
          "Only loan accounts"
        ],
        "answer": 1,
        "explanation": "**b.** The system also shows how much will be blocked, depending on whether blocking is equal or proportional among guarantors.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "For an external guarantor, what does the displayed 'amount to block' mean?",
        "options": [
          "It is blocked in a bank account",
          "It is for information only, since there is no account to block",
          "It is charged as a fee",
          "It is added to the loan"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "How are non-cash guarantees such as chattels or promissory notes handled?",
        "options": [
          "Not allowed",
          "Scanned and stored using the scan icon; one document can guarantee more than one loan",
          "Entered as a charge",
          "Converted to cash"
        ],
        "answer": 1,
        "explanation": "**b.** Scanned documents are viewed in origination through the `ELO.GU.DOCUMENT` enquiry link. The guarantor record must be set to **Active** to be valid.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "What does `EACH.MEMB.GUARANTOR` = Yes do on a group application?",
        "options": [
          "Skips guarantors",
          "Displays all group members so guarantor details are entered per member",
          "Makes the leader the guarantor",
          "Blocks the group account"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "When can the Credit Check stage be marked Not Required?",
        "options": [
          "Never",
          "When there is no local credit bureau interface; set in `EM.LO.PARAMETERS`",
          "When the loan is small",
          "When it is a group loan"
        ],
        "answer": 1,
        "explanation": "**b.** Credit check applies when the client has plugged a credit bureau interface into origination.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "Which collaterals are available for selection at Collateral Input?",
        "options": [
          "All collaterals in the bank",
          "Only collaterals relevant to the applicants in the application (all members' for group loans)",
          "Only new collaterals",
          "Only the guarantor's"
        ],
        "answer": 1,
        "explanation": "**b.** *New Collateral* opens a window running through `COLLATERAL.RIGHT` and then `COLLATERAL`. Once committed, they can be selected without leaving origination.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "By default, who is credit scoring required for?",
        "options": [
          "Guarantor only",
          "The applicant = Yes (depending on parameters); the guarantor = No",
          "Both = Yes",
          "Neither"
        ],
        "answer": 1,
        "explanation": "**b.** Guarantors can be scored only if they are existing customers and the user changes the default to Yes. Groups list each member.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "Credit scoring is *Optional* in `EM.LO.PARAMETERS`. What is *Perform Check?* set to?",
        "options": [
          "Yes",
          "No",
          "Blank, so the user sets it to Yes to score or commits to skip",
          "Hidden"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "Why create Income and Expenditure records per loan application?",
        "options": [
          "An existing record may be outdated since the applicant's situation could have changed",
          "It is cheaper",
          "It is required for guarantors",
          "It speeds up COB"
        ],
        "answer": 0,
        "explanation": "**a.** Otherwise the existing record must be updated before scoring. The score data (`SA.SCORE.DATA`) and score card (`SA.SCORE.CARD`) can use this profile.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      },
      {
        "question": "After committing credit scoring, where does the score get calculated?",
        "options": [
          "In `EM.LO.APPLICATION` directly",
          "In `SA.SCORE.TXN`, after selecting the Product Name (product, product group or SYSTEM)",
          "In the Arrangement",
          "At Loan Creation"
        ],
        "answer": 1,
        "explanation": "**b.** The score is calculated when the user commits the record. The Product Name dropdown shows only records relevant to the product applied for.\n\n*Source:* `04-2.0 Concept - Loan Application Processing 2.pdf`",
        "deck": "04-2.0"
      }
    ]
  },
  {
    "id": "loan-app-3",
    "title": "Loan Application Processing 3 — Quiz",
    "subtitle": "Deck 04-3.0 · Credit Assessment, Approval, Offer Production and Loan Creation",
    "questions": [
      {
        "question": "What is the Credit Assessment stage's main purpose?",
        "options": [
          "Disburse the loan",
          "The credit officer reviews the results so far, using the Customer/Group Loan History report, and makes a recommendation",
          "Print offer documents",
          "Collect fees"
        ],
        "answer": 1,
        "explanation": "**b.** The loan history report shows past loans, late payments, and any provisioned or written-off amounts.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "Is the approver bound by the credit assessment officer's recommendation?",
        "options": [
          "Yes",
          "No, the approver can decide differently",
          "Only for group loans",
          "Only above a threshold"
        ],
        "answer": 1,
        "explanation": "**b.** The recommendation passes to the approving officer, who takes the final decision.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "What is different about the application status at Review/Approval?",
        "options": [
          "It is defaulted to Approved",
          "It is not defaulted; the approver must deliberately select a status",
          "It is hidden",
          "It is set by the system from the score"
        ],
        "answer": 1,
        "explanation": "**b.** This avoids mistakes and doubts about the decision.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "The approver leaves *Approved Amount* and *Approved Term* blank. What happens?",
        "options": [
          "The application fails",
          "The system assumes the amount and term applied for",
          "Zero is approved",
          "Recommended values are used"
        ],
        "answer": 1,
        "explanation": "**b.** The approver may approve a different amount/term than recommended or applied for.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "When is the Notes field mandatory at approval?",
        "options": [
          "Always",
          "When the approver declines or selects *Client Withdrawal*",
          "For group loans",
          "Never"
        ],
        "answer": 1,
        "explanation": "**b.** The reasons must be recorded. *Decision By* defaults to the current officer's account officer code.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "What must be configured for approval deal slips to print?",
        "options": [
          "Nothing",
          "The Other Parameters tab of the Origination Product Parameters table",
          "The guarantor table",
          "The SMS group"
        ],
        "answer": 1,
        "explanation": "**b.** Deal slips are useful where physical signatures or credit committee signatures are required.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "True or false: all members of a group must be approved for the same amount and term.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explanation": "**False.** Amounts and terms can differ per member, and the approver can approve different values or leave the fields blank to assume the applied ones.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "How are loan offer documents produced?",
        "options": [
          "Typed manually",
          "Via the Document Output module, prepopulated from Loan Origination product parameters, and stored in the SCV Documents tab",
          "Emailed by the bank",
          "By COB"
        ],
        "answer": 1,
        "explanation": "**b.** Only the loan application document template is included in the model bank. The repayment start date is calculated automatically but can be amended.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "What happens at Loan Creation for a product set up for automatic disbursement?",
        "options": [
          "Only the arrangement is created",
          "On commit, origination creates and disburses the loan (all members' loans for groups)",
          "The loan waits for teller disbursement",
          "The offer is reprinted"
        ],
        "answer": 1,
        "explanation": "**b.** Loan Creation is the final origination stage.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "How is a loan for manual disbursement identified?",
        "options": [
          "The Disburse Account field is empty; SCV Portfolio shows status *Not Disbursed* with commitment = approved amount and principal = zero",
          "It has a red flag",
          "It has no arrangement",
          "It is a group loan"
        ],
        "answer": 0,
        "explanation": "**a.** Disbursing by cash credits the Teller's cash account. An account transfer credits the customer's disbursement account (e.g. savings category 6002). Both debit the applicant's loan account.\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      },
      {
        "question": "After a manual disbursement by account transfer is committed, what status does the loan show in SCV?",
        "options": [
          "Not Disbursed",
          "Current",
          "Pending",
          "Closed"
        ],
        "answer": 1,
        "explanation": "**b — Current.**\n\n*Source:* `04-3.0 Concept - Loan Application Processing 3.pdf`",
        "deck": "04-3.0"
      }
    ]
  },
  {
    "id": "loan-app-4",
    "title": "Loan Application Processing 4 — Quiz",
    "subtitle": "Deck 04-4.0 · Group bulk disbursement, origination reports and Direct Loan",
    "questions": [
      {
        "question": "Where can group loans be disbursed in bulk from?",
        "options": [
          "The *Bulk Operations* tab / Group Disbursement screen `EM.FT.BULK.INPUT,DISBURSE`",
          "The Teller screen",
          "`EM.LO.APPLICATION`",
          "The Arrangement Overview"
        ],
        "answer": 0,
        "explanation": "**a.** Disbursements to members of the same group are posted from one screen. The setup table is `EM.FT.BULK.PARAM` (Administration > Groups > Bulk Operations Parameter).\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "What does `Default Process Value` in `EM.FT.BULK.PARAM` decide?",
        "options": [
          "Whether all group members' loans are disbursed or some are left for later",
          "The FT version",
          "The loan term",
          "The interest rate"
        ],
        "answer": 0,
        "explanation": "**a.** `FT OFS Version` lets a bank use its own version instead of the default; *Allowed categories* filters the disbursement account dropdown.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "For loan disbursements, what are valid values of `Default Credit Account`?",
        "options": [
          "Yes or No (required for disbursements); other options are All Loans and Grp Loan",
          "Any text",
          "Only All Loans",
          "Only Grp Loan"
        ],
        "answer": 0,
        "explanation": "**a.** If Yes, the first account in `ALLOWED.CATEG` is auto-populated.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "What is the first step to disburse a group's loans together?",
        "options": [
          "Authorise the FT",
          "Open Teller",
          "Select *Group Service Agent*, then Groups, then find the group",
          "Run COB"
        ],
        "answer": 2,
        "explanation": "**c.** Then use the Meatballs icon under Group > *Disburse Loans*, set Disburse to No for members to skip, and commit. Loans become *Current* in the SCV Loans tab.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "How do you skip some members during group bulk disbursement?",
        "options": [
          "Set *Disburse* to No for those members",
          "Change the group",
          "Delete their loans",
          "They cannot be skipped"
        ],
        "answer": 0,
        "explanation": "**a.** A partial disbursement can be done by keying the partial amount (depending on product setup). The screen defaults to all arrangements in *Not Disbursed* status.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "Group disbursement is currently supported through…",
        "options": [
          "Only AA activities",
          "FT, with records generated via OFS; unprocessed FTs can be reviewed and resubmitted with *Resubmit FT*",
          "Only cheque",
          "Only Teller"
        ],
        "answer": 1,
        "explanation": "**b.** An internal account can be used if its category is an allowed category in `EM.FT.BULK.PARAM`.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "What does the Loan Application report show?",
        "options": [
          "Only approved loans",
          "Guarantor details",
          "Each application's details, current status, and days taken to process so far (or until the loan is created)",
          "Written-off loans"
        ],
        "answer": 2,
        "explanation": "**c.** It is at Home Pages > Branch Manager > Loans > Search Loan Application, and can be added to other home pages.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "Where are SLAs for each origination stage defined?",
        "options": [
          "`EM.FT.BULK.PARAM`",
          "`EM.INC.EXP`",
          "`PV.PROFILE`",
          "`EM.LO.PARAMETER` (`EM.LO.PARAMETERS`)"
        ],
        "answer": 3,
        "explanation": "**d.** On a breach, a notification goes to the user group in the escalation path (usually managers).\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "Which enquiry produces the SLA escalation report from the command line?",
        "options": [
          "`ENQ EM.CUS.LOAN.LIST`",
          "`ENQ EM.GRP.LOAN.LIST`",
          "`ENQ EM.FT.BULK`",
          "`ENQ EM.LO.SLA.ESC`"
        ],
        "answer": 3,
        "explanation": "**d.** It was not yet on the TE menu at the time of the deck.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "Which enquiries give the customer and group loan histories during credit assessment?",
        "options": [
          "`EM.INC.EXP`",
          "`PV.ASSET.DETAIL`",
          "`EM.LO.SLA.ESC` for both",
          "`EM.CUS.LOAN.LIST` (customer) and `EM.GRP.LOAN.LIST` (group)"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "Which four groups of parameter tables must be set up for origination to run?",
        "options": [
          "Group, Savings, Interest, Tax",
          "Origination, Provisioning, CGAP, Teller",
          "Origination, Guarantor, Credit scoring, Income and expenditure",
          "Guarantor, Collateral, Write-off, Recovery"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "When is the *Direct Loan* input method used?",
        "options": [
          "When origination is not in use, to create loans that are already approved (e.g. from a third-party system, or manually processed group loans)",
          "To replace credit scoring",
          "To approve loans",
          "For deposits"
        ],
        "answer": 0,
        "explanation": "**a.** Direct Loan screens are built like the Application Input screens, and an approver must review and authorise the input.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      },
      {
        "question": "How can an approver find an unauthorised Direct Loan to approve?",
        "options": [
          "By email",
          "Only by command line",
          "Via the dashboard or the Tasks tab of the Single Customer View",
          "Only through COB"
        ],
        "answer": 2,
        "explanation": "**c.** After approval it is disbursed and managed as normal.\n\n*Source:* `04-4.0 Concept - Loan Application Processing 4.pdf`",
        "deck": "04-4.0"
      }
    ]
  },
  {
    "id": "repayment-overdue",
    "title": "Loan Repayment & Overdue Payments — Quiz",
    "subtitle": "Deck 05-1.0 · Repayment types, group collections, payoff and overdue handling",
    "questions": [
      {
        "question": "Which are the four types of loan repayment?",
        "options": [
          "Daily, Weekly, Monthly, Yearly",
          "Scheduled repayment, Payoff, Principal Decrease, Credit to the arrangement",
          "Cash, Cheque, Transfer, Standing order",
          "Capital, Interest, Charge, Penalty"
        ],
        "answer": 1,
        "explanation": "**b.** Group loan payments are supported through the bulk payments feature, like group disbursements.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "What makes scheduled payments happen automatically?",
        "options": [
          "The Overdue condition",
          "Linking the arrangement to a servicing account through the Settlement product condition",
          "The Payoff activity",
          "Teller authorisation"
        ],
        "answer": 1,
        "explanation": "**b.** If funds are missing, payments become overdue per the product's rules. Payments can also be done manually via FT and Teller.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "In what order are outstanding amounts paid by default?",
        "options": [
          "Random",
          "Capital first",
          "A predefined order, e.g. Penalty Interest, then Charges, then Principal Interest, then Capital",
          "Charges only"
        ],
        "answer": 2,
        "explanation": "**c.** Interest, Charges and Capital can be paid from different accounts.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "Which table configures group disbursements and group repayments (collections)?",
        "options": [
          "`GIC.BD.PARAMETERS`",
          "`EM.LO.PARAMETERS`",
          "`EM.FT.BULK.PARAM`",
          "`PV.MANAGEMENT`"
        ],
        "answer": 2,
        "explanation": "**c.** The table ID can be SYSTEM or a Company ID. Bulk types are *Group Collection* and *Group Disbursement*; `FT.MASTER.OFS.VER` posts the individual FTs through OFS.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "Which version posts group repayments per group?",
        "options": [
          "`EM.FT.BULK.INPUT,GCS`",
          "`FT.MASTER.OFS.VER`",
          "`EM.LO.APPLICATION`",
          "`EM.FT.BULK.INPUT,DISBURSE`"
        ],
        "answer": 0,
        "explanation": "**a.** `,DISBURSE` is for disbursements.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "For group loan repayments, which `Default Credit Account` options display all the customer's loan accounts?",
        "options": [
          "Yes",
          "No",
          "Any",
          "All Loans or Grp Loan"
        ],
        "answer": 3,
        "explanation": "**d.** If Yes is selected, the first account in `ALLOWED.CATEG` is auto-populated. `Default Loan repayment Amount` decides whether to default the due amounts.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "On the group collection screen, how is a member skipped?",
        "options": [
          "Set `PROCESS.PAYMENT` to No",
          "Set Disburse to No",
          "Delete the row",
          "Change the group number"
        ],
        "answer": 0,
        "explanation": "**a.** Members with PROCESS.PAYMENT = Yes are processed. The group account is populated from `G.ACCOUNT.NUMBER` on `MCB.GROUP`.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "Can overpayments be made through the automatic Settlement condition?",
        "options": [
          "Only for group loans",
          "Only at maturity",
          "Yes, always",
          "No, overpayment is only available through manual repayments"
        ],
        "answer": 3,
        "explanation": "**d.** Settlement only pays amounts due. Depending on product settings, an overpayment leads to a principal decrease or an *unallocated amount*, which pays future dues first.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "What does a Principal Decrease do?",
        "options": [
          "Forgives interest",
          "Reschedules the loan",
          "Closes the loan",
          "Repays part of the outstanding capital before maturity; it is an Arrangement Activity done via FT or Teller"
        ],
        "answer": 3,
        "explanation": "**d.** The system can recalculate future repayment amounts or the new term, if the product is set up for it.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "How is the total redemption amount for a Payoff worked out?",
        "options": [
          "By the guarantor",
          "From the SCV",
          "Manually by the teller",
          "With the Simulation engine (Payoff simulation)"
        ],
        "answer": 3,
        "explanation": "**d.** The calculated amount is then used to pay off the loan through AA activities via FT or Teller. It covers capital, accrued interest and charges, and can include an early redemption fee.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "What effective date can be used for a Payoff?",
        "options": [
          "Only past dates",
          "Only the maturity date",
          "Today's system date or a future date",
          "Only today"
        ],
        "answer": 2,
        "explanation": "**c.** A Payoff can be requested at any point in the loan's life; a payoff statement is produced for the customer.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "Which overdue stages might a bank typically accept?",
        "options": [
          "Standard, Doubtful, Loss",
          "Draft, Live, Archived",
          "Grace (no penalty), Delinquent (penalties applied), Non-Accrual Basis (interest income suspended)",
          "Open, Closed, Pending"
        ],
        "answer": 2,
        "explanation": "**c.** Stages can be driven by days unpaid, number of payments missed, or IFRS impairment rules. Reminder notices go out automatically, and fees can attach to overdue.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "Account Debit Rule = *Partial* means…",
        "options": [
          "The loan is closed",
          "Nothing is taken and everything becomes overdue",
          "The available amount is taken from the servicing account and the rest moves to overdue",
          "The entire amount is taken even if overdrawn"
        ],
        "answer": 2,
        "explanation": "**c.** *Full* takes the entire amount even if the account is overdrawn; *None* takes nothing if the full amount is not available. The rule is in the Settlement condition.\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      },
      {
        "question": "When is penalty interest calculated on overdue payments?",
        "options": [
          "If configured in the AA loan product",
          "Only for groups",
          "Always",
          "Never"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-1.0 Concept - Loan Repayment and Overdue Payments.pdf`",
        "deck": "05-1.0"
      }
    ]
  },
  {
    "id": "loan-maintenance",
    "title": "Loan Maintenance Activities — Quiz",
    "subtitle": "Deck 05-2.0 · Top-up, reschedule, guarantor maintenance, arrears capitalisation, bulk rescheduling and closure",
    "questions": [
      {
        "question": "How are modifications made to a loan arrangement?",
        "options": [
          "By deleting and recreating",
          "By editing the account",
          "Only via COB",
          "Through Activities, via the *New Activity* link in the Arrangement Overview"
        ],
        "answer": 3,
        "explanation": "**d.** Examples: change principal, interest, duration, or adjust a bill amount.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "In Inclusive Banking, where else can top-up and reschedule be processed?",
        "options": [
          "Only AA",
          "Only COB",
          "Only Teller",
          "Direct Loan Input or Loan Origination"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "When entering a top-up with a term change, what goes in the requested term field?",
        "options": [
          "The new total term (not the change in term)",
          "The old term",
          "Nothing",
          "The extra months only"
        ],
        "answer": 0,
        "explanation": "**a.** Top-ups require approval just like a new Direct Loan. They can be with or without changing the term.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "How is a guarantor released during top-up/reschedule?",
        "options": [
          "Change status from Current to Released, and select a valid *Reason for Release*",
          "Change the loan product",
          "Delete the record",
          "Not possible"
        ],
        "answer": 0,
        "explanation": "**a.** New guarantors are added by multi-valuing the Guarantor Id field, from the *Update Loan Guarantors* link in the Guarantor Input tab.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "What happens if a guarantor no longer meets the exclusion conditions?",
        "options": [
          "Nothing",
          "The loan is closed",
          "The guarantor is deleted automatically",
          "The user is alerted in top-up/reschedule, and an alert shows in the SCV Loan Guarantors tab"
        ],
        "answer": 3,
        "explanation": "**d.** The bank then addresses the change per its policy.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "Can guarantors be maintained without a top-up or reschedule?",
        "options": [
          "No",
          "Only at origination",
          "Yes, via *Maintain Guarantors* in the Loan Guarantors tab",
          "Only by admin"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "Where are the bill balances to be capitalised stored?",
        "options": [
          "`EM.FT.BULK.PARAM`",
          "`PV.PROFILE`",
          "`EM.LO.PARAMETERS–TOPUP` or `–RESCHEDULE`, with balance prefixes in `EB.PARAM>ALL-EM.CAPITALISE.ARREARS`",
          "`GIC.BD.PARAMETERS`"
        ],
        "answer": 2,
        "explanation": "**c.** Capitalisation of arrears applies to a non-expired loan during top-up/reschedule; the total is shown on screen and included in the calculation.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "What is Bulk Rescheduling used for?",
        "options": [
          "Changing interest rates",
          "Provisioning",
          "Writing off loans",
          "Rescheduling many loans due to ad hoc/special holidays or crises, skipping the specified repayment cycles"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "What are the Bulk Rescheduling restrictions?",
        "options": [
          "Earliest is next business day; not on the actual due date; loans maturing within the holiday period cannot be rescheduled",
          "Only for group loans",
          "Any date allowed",
          "Only on the due date"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "In Bulk Rescheduling, *Number of Periods to Skip* with no dates entered skips payments from…",
        "options": [
          "Month end",
          "Current date + 1 (tomorrow)",
          "The holiday end",
          "The loan start"
        ],
        "answer": 1,
        "explanation": "**b.** If dates are also given, only payments within the date range up to that number are rescheduled. *All Active Loans* requires Number of Periods.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "What does *interest forgiven* = Yes do in bulk rescheduling?",
        "options": [
          "No interest is calculated or accrued in the skipped cycle",
          "The loan is written off",
          "Charges are waived",
          "Interest doubles"
        ],
        "answer": 0,
        "explanation": "**a.** Otherwise interest accrues and later instalments are recalculated.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "Which bulk rescheduling simulation option validates each loan?",
        "options": [
          "Neither",
          "Full (Short skips the extra validation, ideal for large portfolios)",
          "Both",
          "Short"
        ],
        "answer": 1,
        "explanation": "**b.** Full also runs Validate on each loan to check for contract issues.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "What is the bulk rescheduling workflow?",
        "options": [
          "Authorise → Input → Check",
          "Input parameters → Simulation check → Authorisation → Final check",
          "COB → Input → Final",
          "Simulate → Delete → Authorise"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "When can a loan be closed by *Loan Closure*?",
        "options": [
          "Only with guarantor approval",
          "When the maturity date is reached, or when account balances are zero",
          "Only on write-off",
          "Only manually"
        ],
        "answer": 1,
        "explanation": "**b.** It can also occur if the loan is cancelled in the initial cancellation period.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      },
      {
        "question": "Manual loan closure is allowed when `CLOSURE.METHOD` is…",
        "options": [
          "MANUAL or NONE",
          "AUTOMATIC only",
          "Never",
          "Any"
        ],
        "answer": 0,
        "explanation": "**a.** `LENDING-CLOSE-ARRANGEMENT` triggers automatically for AUTOMATIC and must be triggered manually for MANUAL.\n\n*Source:* `05-2.0 Concept - Loan Maintenance Activities.pdf`",
        "deck": "05-2.0"
      }
    ]
  },
  {
    "id": "cgap-reports",
    "title": "CGAP Reports — Quiz",
    "subtitle": "Deck 05-3.0 · CGAP report classes B and C",
    "questions": [
      {
        "question": "What is CGAP?",
        "options": [
          "A core banking module",
          "A tax authority",
          "The Consultative Group to Assist the Poor, a global partnership of 34 organisations advancing inclusive banking",
          "A Temenos product"
        ],
        "answer": 2,
        "explanation": "**c.** It developed microfinance reporting templates in classes A–E.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "Which CGAP report classes does the Inclusive Banking Model Bank provide?",
        "options": [
          "All A–E",
          "Only B",
          "D and E",
          "A, B and C"
        ],
        "answer": 3,
        "explanation": "**d.** Report names combine class and number, e.g. B1, C4.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "Where are the delivered CGAP reports listed?",
        "options": [
          "`EB.PARAM`, record `ALL-EM.CGAP.REPORT`",
          "`EM.FT.BULK.PARAM`",
          "`GIC.BD.PARAMETERS`",
          "`PV.PROFILE`"
        ],
        "answer": 0,
        "explanation": "**a.** The customer in `Param Value.2.1` must exist, TSM must be started, and the `EM.CGAP.REPORT.RUN` service must be in Auto mode.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "How do you generate a B or C report?",
        "options": [
          "Type ENQ only",
          "Print from Teller",
          "Meatballs icon > Request Report, commit, then Meatballs > List Reports, and View",
          "Run COB"
        ],
        "answer": 2,
        "explanation": "**c.** Path: Credit Manager > Reports.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "What does report B2 show?",
        "options": [
          "Customer status",
          "Daily payments",
          "Loan account activity from disbursement to the current date",
          "Portfolio concentration"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "What does report B3 show?",
        "options": [
          "Customer status: current and historical loans and savings accounts",
          "Portfolio at risk",
          "Delinquent loans",
          "Daily payments"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "Report B8 requires which input?",
        "options": [
          "The loan product",
          "The branch",
          "The date of payment",
          "The officer"
        ],
        "answer": 2,
        "explanation": "**c.** It shows amounts paid split into payment properties, plus current loan balances and overdue amounts.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "What does B9 show?",
        "options": [
          "Delinquent loans by officer",
          "Daily payments",
          "Loan distribution per sector and industry (usually regulatory)",
          "Customer status"
        ],
        "answer": 2,
        "explanation": "**c.** It is the Portfolio Concentration Report.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "Which report groups delinquent loans by branch and then Loan Officer?",
        "options": [
          "C2",
          "B8",
          "C5",
          "B3"
        ],
        "answer": 0,
        "explanation": "**a.** C2 = Delinquent Loans by Branch & LO.\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      },
      {
        "question": "What does C5 show?",
        "options": [
          "Daily payments",
          "Portfolio at risk by branch and product, in delinquency buckets by days",
          "Customer status",
          "Account activity"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `05-3.0 Concept - CGAP Reports.pdf`",
        "deck": "05-3.0"
      }
    ]
  },
  {
    "id": "provisioning",
    "title": "Standard Loan Provisioning — Quiz",
    "subtitle": "Decks 05-4.0 & 05-5.0 · Classification, PV.PROFILE, collateral, PV.MANAGEMENT and detail records",
    "questions": [
      {
        "question": "What are the three main steps of provisioning?",
        "options": [
          "Origination, Approval, Disbursement",
          "Classification, Calculation, Posting",
          "Accrual, Billing, Payment",
          "Input, Authorise, Close"
        ],
        "answer": 1,
        "explanation": "**b.** Posting is Dr P&L, Cr an internal account.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Which table defines asset classes?",
        "options": [
          "`PV.LOAN.CLASSIFICATION`",
          "`PV.MANAGEMENT`",
          "`PV.ASSET.DETAIL`",
          "`PV.PROFILE`"
        ],
        "answer": 0,
        "explanation": "**a.** The higher the risk the higher the rank; ranks are unique (`PV.RANK.CLASS`). Typical classes: Standard, Watchlist, Substandard, Doubtful, Write-Off/Loss.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "What are the two levels of classification supported in `PV.MANAGEMENT`?",
        "options": [
          "Customer level (worst loan class applies to all) and Asset level (each loan on its own)",
          "Branch and Company",
          "Group and Individual",
          "Product and Currency"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "In Inclusive Banking standard provisioning, classification is determined by…",
        "options": [
          "Sector",
          "Collateral",
          "Customer residence",
          "Number of days late only (`EM.PV.PARAMETER`)"
        ],
        "answer": 3,
        "explanation": "**d.** For other criteria the Rules Engine can be used, or an API. `EM.PV.PARAMETER` ID can be SYSTEM, Branch Code or AA Product Name.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Which table holds the provision percentages per classification?",
        "options": [
          "`PV.LOAN.CLASSIFICATION`",
          "`PV.PROFILE`",
          "`EM.PV.PARAMETER`",
          "`IFRS.POSTING.DETAILS`"
        ],
        "answer": 1,
        "explanation": "**b.** It supports multiple provisioning types with source balances (e.g. `PROVPRINCIPAL`) and a calculation method of Percentage, IFRS or API; a contract uses only one method.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Which table configures job frequencies and the delay between calculation and posting?",
        "options": [
          "`PV.PROFILE`",
          "`PV.ASSET.DETAIL`",
          "`PV.MANAGEMENT`",
          "`EM.PV.PARAMETER`"
        ],
        "answer": 2,
        "explanation": "**c.** Posting can be delayed by a minimum of one day, and the provision is recalculated on the posting date.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Which two collateral methods does `PV.PROFILE` support?",
        "options": [
          "Pledge and Release",
          "Block and Lock",
          "Fixed and Floating",
          "Mitigate and Secured/Unsecured"
        ],
        "answer": 3,
        "explanation": "**d.** Both require `PROV.CALC` = Percentage.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "What is the provision formula under the Mitigate method?",
        "options": [
          "Loan Balance × Rate",
          "Collateral × Rate",
          "(Loan Balance − Collateral Value) × Provision Rate",
          "(Balance + Collateral) × Rate"
        ],
        "answer": 2,
        "explanation": "**c.** `COLLATERAL.USE` must be set to Mitigate.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Principal £100,000, interest £5,000, collateral £102,000, Watchlist rates 10% principal / 5% interest (Mitigate). What is the provision?",
        "options": [
          "£5,000",
          "£150",
          "£0",
          "£10,000"
        ],
        "answer": 1,
        "explanation": "**b.** £102,000 covers the principal fully, leaving £2,000 for interest. Uncovered interest is £3,000 × 5% = £150.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "In the Secured/Unsecured method, how do the percentages compare?",
        "options": [
          "Secured is higher",
          "Only unsecured is provisioned",
          "The secured portion has a lower percentage than the unsecured portion",
          "They are equal"
        ],
        "answer": 2,
        "explanation": "**c.** Fields: `SEC.PERCENT` (secured) and `STD.PERCENT` (unsecured).\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "At which level can accounting entries for provisions be posted?",
        "options": [
          "Group level",
          "Customer level",
          "Branch level",
          "Only the Asset (loan) level"
        ],
        "answer": 3,
        "explanation": "**d.** Even if classification is at customer level. Posting style is defined in `IFRS.POSTING.DETAILS`.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "How many `PV.PROFILE` records are used at a time?",
        "options": [
          "One per branch",
          "One per customer",
          "Only one, the one with the latest applicable date",
          "All of them"
        ],
        "answer": 2,
        "explanation": "**c.** It is a date-keyed (FTD) file, with `PV.PROFILE.XREF` holding the dates. Model Bank has one for IFRS and one for Standard.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "Which modules must be installed for Standard provisioning versus IFRS?",
        "options": [
          "Both: PV only",
          "Standard: PV and IA; IFRS: PV",
          "Standard: PV; IFRS: PV and IA",
          "Both: IA only"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "In `IFRS.POSTING.DETAILS`, which fields hold the debit and credit sides?",
        "options": [
          "`POSTING.STYLE` only",
          "`ENTRY.TARGET` (debit) and `CONTRA.ENTRY` (credit)",
          "`PROFIT` and `LOSS`",
          "`CATEGORY` and `ENTRY.TYPE`"
        ],
        "answer": 1,
        "explanation": "**b.** `CATEGORY` is the P&L category for the debit; `CONTRA.CATEGORY` the internal account category for the credit.\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "What is the difference between ADJUST and I/O posting styles?",
        "options": [
          "ADJUST posts the difference from yesterday's value; I/O reverses yesterday's value and reposts the new one",
          "They are identical",
          "ADJUST reverses all entries",
          "I/O only works for IFRS"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-4.0 Concept - Standard Loan Provisioning 1.pdf`",
        "deck": "05-4.0"
      },
      {
        "question": "How many `PV.MANAGEMENT` records are allowed for a lead company with the ID `SYSTEM`?",
        "options": [
          "Unlimited",
          "One per customer",
          "A single record, linked to one Provisioning Profile",
          "Two"
        ],
        "answer": 2,
        "explanation": "**c.** It can be shared in a multi-company environment. If SYSTEM exists, it must be reversed before entering individual records.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "`CLASS.FREQUENCY` in `PV.MANAGEMENT` is used for…",
        "options": [
          "The collateral method",
          "The posting delay",
          "A separate classification frequency from the calculation frequency",
          "The rank"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "What is the minimum posting delay after classification?",
        "options": [
          "One month",
          "One week",
          "At least one day (mandatory)",
          "None"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "For AA, when can multiple `PV.MANAGEMENT` records be defined?",
        "options": [
          "Per branch",
          "Only at product group level and only when the product line field is empty",
          "Per customer",
          "Never"
        ],
        "answer": 1,
        "explanation": "**b.** A product group or category can be in only one `PV.MANAGEMENT` record. `PV.MGMT.PRODUCT.LIST` holds the list.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "Mortgage Watchlist = 12%, Personal Loan Watchlist = 15%, default = 10% (multiple set-ups). What rate does a Car Loan classed Watchlist get?",
        "options": [
          "10% (the default)",
          "12%",
          "15%",
          "0%"
        ],
        "answer": 0,
        "explanation": "**a.** Products without their own profile use the default rate.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "What is `PV.ASSET.DETAIL` keyed by?",
        "options": [
          "The product",
          "The date",
          "The customer ID",
          "The asset (contract) ID"
        ],
        "answer": 3,
        "explanation": "**d.** It holds current and previous classification and provisioning details, created when the classification job first processes the contract. History beyond 31 multi-values moves to `PV.ASSET.DETAIL.HIST`.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "Which field in `PV.ASSET.DETAIL` overrides the automatic classification?",
        "options": [
          "`POST.PROV.AMT`",
          "`LAST.CLASS.DATE`",
          "`MANUAL.CLASS` (overrides `AUTO.CLASS`)",
          "`MANAGEMENT.ID`"
        ],
        "answer": 2,
        "explanation": "**c.** `REASON` justifies it. `MANUAL.PROV.AMT` overrides `CALC.PROV.AMT`.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "When is `PV.CUSTOMER.DETAIL` updated?",
        "options": [
          "Never",
          "Only if `CLASS.LEVEL` in `PV.MANAGEMENT` is CUSTOMER",
          "Only for groups",
          "Always"
        ],
        "answer": 1,
        "explanation": "**b.** It holds the worst classification for the customer, which the calculator applies to all the customer's contracts.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      },
      {
        "question": "Where can a manual classification be entered when the level is Customer?",
        "options": [
          "`PV.PROFILE`",
          "`PV.CUSTOMER.DETAIL`",
          "`PV.ASSET.DETAIL`",
          "`EM.PV.PARAMETER`"
        ],
        "answer": 1,
        "explanation": "**b.** At Loan level it's `PV.ASSET.DETAIL`, where a manual provision amount can also be entered and will be posted.\n\n*Source:* `05-5.0 Concept - Standard Loan Provisioning 2.pdf`",
        "deck": "05-5.0"
      }
    ]
  },
  {
    "id": "writeoff-recovery",
    "title": "Guarantor Recovery, Write-off & Loan Recovery — Quiz",
    "subtitle": "Decks 05-6.0 & 05-7.0 · Recovery from guarantors, write-off and contingent accounts",
    "questions": [
      {
        "question": "Which setting must be on for recovery from a guarantor's account to be possible?",
        "options": [
          "Scoring Required = Yes",
          "Group loan flag",
          "`Recovery from Guarantor's Account` = Allowed in the guarantor parameter table",
          "Collateral = Mitigate"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "How is recovery split among multiple guarantors?",
        "options": [
          "By the `Recovery Mode` field: Equal or Proportional",
          "Oldest first",
          "Randomly",
          "By account balance only"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "What does `Insufficient Balance Action` decide?",
        "options": [
          "The recovery date",
          "Whether to overdraw guarantor accounts or recover only up to their balances",
          "Provision rate",
          "The recovery mode"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "How is a recovery from guarantors started?",
        "options": [
          "From Teller",
          "Drill down on the late loan in the SCV Portfolio tab, then choose *Repayment by Guarantor*",
          "From the guarantor's account directly",
          "By COB"
        ],
        "answer": 1,
        "explanation": "**b.** Manual recovery requires authorisation; the unauthorised record appears in the Tasks tab of SCV.\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "Which property class supports arrangement write-off?",
        "options": [
          "Overdue",
          "Charge Off",
          "Settlement",
          "Balance Maintenance"
        ],
        "answer": 3,
        "explanation": "**d.** Accessed via New Activity in the Arrangement Overview.\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "What are the three write-off functions?",
        "options": [
          "Customer, branch, group",
          "Partial, full, none",
          "Capital, interest, charges",
          "Write off arrangements (all balances, current and due), balances (current only, bills remain), bills (issued bills only, balances remain)"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "Where is the write-off contra category defined?",
        "options": [
          "`EM.PV.PARAMETER`",
          "`AC.ALLOCATION.RULE`, for every payment property; the same category should be used for provisioning",
          "`GIC.BD.PARAMETERS`",
          "`PV.PROFILE`"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "When is a written-off account flagged as *Financial Write off*?",
        "options": [
          "When no provision exists",
          "For group loans",
          "When provision amounts exist; otherwise it is flagged Write off",
          "Always"
        ],
        "answer": 2,
        "explanation": "**c.** Customers with written-off loans are also flagged.\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "Where is the Loans Written Off report?",
        "options": [
          "Home Pages > Credit Manager > Loans Written Off",
          "Teller > Loan Operations",
          "Admin > Products",
          "Branch Manager > Loans"
        ],
        "answer": 0,
        "explanation": "**a.** It shows write-off amount, balance at write-off, days in arrears and provision amount; it can be shown per account officer or group.\n\n*Source:* `05-6.0 Concept - Guarantor Recoveries Loan Write-off.pdf`",
        "deck": "05-6.0"
      },
      {
        "question": "After a write-off, how does the system keep access to the written-off items?",
        "options": [
          "A suspense account",
          "Using contingent accounts: a customer contingent account and a contingent control contra account",
          "A savings account",
          "The original loan account"
        ],
        "answer": 1,
        "explanation": "**b.** The customer account mnemonic is W + WOF loan account number + W. Control accounts can be per customer or per branch.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "Which table holds the WOF recovery parameters?",
        "options": [
          "`EM.LO.PARAMETERS`",
          "`EM.FT.BULK.PARAM`",
          "`PV.MANAGEMENT`",
          "`GIC.BD.PARAMETERS`"
        ],
        "answer": 3,
        "explanation": "**d.** Path: Administration > Products > Loan Products > WOF Recovery Parameters. It is system-wide.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "What is the *Recovery category*?",
        "options": [
          "The provision category",
          "The P&L category where recovery funds are credited as income",
          "The contingent customer account category",
          "The loan category"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "What does `Contingent Account Level` decide?",
        "options": [
          "Whether control accounts are kept at customer or branch level",
          "The provision rate",
          "The write-off date",
          "The recovery order"
        ],
        "answer": 0,
        "explanation": "**a.** `Customer Control Customer Category` and `Contingent Control Internal Category` are mutually exclusive, one becoming mandatory by this selection.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "Which service closes the AA contract and account after write-off?",
        "options": [
          "`EM.CGAP.REPORT.RUN`",
          "`PV.CLASSIFICATION`",
          "`BNK/EM.WOF.PROCESS`, taking 2 COBs",
          "`PV.CALCULATION`"
        ],
        "answer": 2,
        "explanation": "**c.** AA sets the arrangement to Closed or Pending Closure first. Written-off accounts can be viewed on `EM.AA.WOF.LOANS.REPORT`.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "What category code does the contingent account show in the SCV Portfolio tab?",
        "options": [
          "1000",
          "6002",
          "9000",
          "5000"
        ],
        "answer": 2,
        "explanation": "**c.** It is opened in the loan currency with the WOF loan account as alternate ID. The category must be in the contingent range in `ACCOUNT.PARAMETERS` and marked Contingent in `CATEGORY`.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "Why can't normal entries be passed between contingent and non-contingent accounts?",
        "options": [
          "T24 core does not allow it",
          "The bank forbids it",
          "It is a COB limitation",
          "They use different currencies"
        ],
        "answer": 0,
        "explanation": "**a.** That's why the second leg is posted automatically via OFS between the control and customer contingent accounts.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "What are the accounting entries for a WOF recovery in cash?",
        "options": [
          "Dr Cash, Cr Bad debt recovered P&L category; then automatically Dr Contingent Control, Cr Customer Contingent",
          "Dr Provision, Cr Loan",
          "Dr P&L, Cr Provision",
          "Dr Loan, Cr Cash"
        ],
        "answer": 0,
        "explanation": "**a.** Recoveries can be cash, cheque or account transfer.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "When is the recovery account closed?",
        "options": [
          "Never",
          "When the full amount is paid off",
          "On the first payment",
          "After 1 COB"
        ],
        "answer": 1,
        "explanation": "**b.** The control account is also closed if at customer level and no other WOF loans remain.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "How can recovery entries be reversed?",
        "options": [
          "Using the transaction reversal version on the menu",
          "By provision",
          "They cannot",
          "By write-off"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      },
      {
        "question": "What does the *WOF Customers with Cr Bal* report show?",
        "options": [
          "Overdue loans",
          "Customers with written-off loans who still have other accounts with credit balances",
          "Customers with no loans",
          "Recovered loans"
        ],
        "answer": 1,
        "explanation": "**b.** Transactions on any account of such a customer also trigger an override message. Path: Credit Manager > WOF Customers with Cr Bal.\n\n*Source:* `05-7.0 Concept - Loan Recovery.pdf`",
        "deck": "05-7.0"
      }
    ]
  },
  {
    "id": "deposit-application",
    "title": "Deposit Application Processing — Quiz",
    "subtitle": "Decks 06-1.0 & 06-2.0 · Existing customers, prospect customers and Savings Plans",
    "questions": [
      {
        "question": "Which application runs deposit origination?",
        "options": [
          "`EM.FT.BULK.INPUT`",
          "`EM.AO.APPLICATION`",
          "`EM.DO.APPLICATION`",
          "`EM.LO.APPLICATION`"
        ],
        "answer": 2,
        "explanation": "**c — `EM.DO.APPLICATION`.** Stages may be required, optional or not required, per Deposit Origination parameters.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What are the deposit origination stages, in order?",
        "options": [
          "Application Input → Eligibility → Guarantor → Credit Scoring → Deposit Creation",
          "Review/Approval → Application Input → Offer Production → Update Customer → Deposit Creation",
          "Application Input → Offer Production → Review/Approval → Deposit Creation → Update Customer",
          "Application Input → Review/Approval → Update Customer → Offer Production → Deposit Creation"
        ],
        "answer": 3,
        "explanation": "**d.** Unlike loans, there are no eligibility, guarantor, credit or collateral stages.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "Where can deposit origination be accessed from?",
        "options": [
          "Only the Arrangement Overview",
          "Only the command line",
          "Only the Teller",
          "Single Customer View"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "When is the *Existing Customer* field displayed at Application Input?",
        "options": [
          "When deposit origination parameters allow applications by prospect customers",
          "Always",
          "Only for non-individuals",
          "Only for savings plans"
        ],
        "answer": 0,
        "explanation": "**a.** The answer decides whether the Update Customer stage is required later.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "When does the Checklist tab appear at Application Input?",
        "options": [
          "Only for prospects",
          "Never",
          "Dynamically, if the product requires documents based on deposit value (always, if items are always required)",
          "Only at approval"
        ],
        "answer": 2,
        "explanation": "**c.** Supporting documents can be scanned and are stored against the application record.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "Which products appear in the Deposit Product dropdown?",
        "options": [
          "All AA products",
          "Only deposit and savings plan products",
          "Accounts only",
          "Loans and deposits"
        ],
        "answer": 1,
        "explanation": "**b.** After selection, origination shows currency, amount (if default), term and rate, or the user enters amount and term and the rate is displayed.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What is the default *Maturity Instruction*?",
        "options": [
          "Rollover",
          "Close",
          "Capitalise",
          "Pay"
        ],
        "answer": 0,
        "explanation": "**a.** Most products can be set for automatic rollover, with *Close* chosen exceptionally.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "If *Rollover Type* is Principal, what should *Int. Pay Method* be?",
        "options": [
          "Pay",
          "None",
          "Rollover",
          "Capitalise"
        ],
        "answer": 0,
        "explanation": "**a.** Accrued interest is paid at the end of the term or on the Int. Pay Frequency. For Principal and Interest rollover it should be *Capitalise*.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What is `Int. Pay Start Date` relevant to?",
        "options": [
          "Only prospects",
          "Only Capitalise",
          "Rollover type Principal and Interest",
          "Only when the interest pay method is Pay"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What does the status ‘Waiting for Information’ do?",
        "options": [
          "Puts the process on hold",
          "Creates the deposit",
          "Moves to the next stage",
          "Rejects the application"
        ],
        "answer": 0,
        "explanation": "**a.** ‘Deposit Application Input Complete’ moves it on. Behaviours are defined in `EM.DO.APPLICATION.STATUS`.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What is special about the status at Review/Approval?",
        "options": [
          "No default status is applied; the approver must select one",
          "It is hidden",
          "It defaults to Declined",
          "It defaults to Approved"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "When can the approver change the approved amount, term or rate?",
        "options": [
          "Within the negotiation rules of the deposit product; non-negotiable values are no-input",
          "Always",
          "Only for groups",
          "Never"
        ],
        "answer": 0,
        "explanation": "**a.** *Decision By* is a multi-value field showing the approving officer's account officer code.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What can be agreed with the customer at Offer Production?",
        "options": [
          "The funding date, whether funding/payout is by account or cash, and documents to produce",
          "The loan term",
          "The interest rate only",
          "The guarantor"
        ],
        "answer": 0,
        "explanation": "**a.** If *Account* is selected, a field to choose the customer's account appears; if *Cash*, it does not.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What must be set for offer documents to be produced?",
        "options": [
          "Checklist complete",
          "Existing Customer = No",
          "`Main Holder` = Yes",
          "Scoring Required = Yes"
        ],
        "answer": 2,
        "explanation": "**c.** Documents are configured in Document Output, selected in the deposit origination parameters, and stored in the SCV Documents tab.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "For a product set up for automatic funding, what happens at Deposit Creation?",
        "options": [
          "The deposit is created Not Funded",
          "The deposit is created and funded on commit",
          "The deposit is rejected",
          "Funding waits for COB"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "How is an unfunded deposit identified in SCV?",
        "options": [
          "Status Pending",
          "Status *Not Funded*, commitment = approved amount, principal = zero",
          "Status Closed",
          "It does not appear"
        ],
        "answer": 1,
        "explanation": "**b.** The Operations icon offers funding options.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "What happens when a deposit is manually funded by cash?",
        "options": [
          "The customer account is credited",
          "Nothing",
          "The loan is disbursed",
          "The Teller's cash account is debited and the deposit credited; status changes to *Current*"
        ],
        "answer": 3,
        "explanation": "**d.** For account transfer, the customer's funding account (e.g. savings) is debited.\n\n*Source:* `06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf`",
        "deck": "06-1.0"
      },
      {
        "question": "When is a temporary prospect customer record used?",
        "options": [
          "For staff",
          "For loans only",
          "When the institution wants to process a deposit application for a non-customer before creating a full customer",
          "For all customers"
        ],
        "answer": 2,
        "explanation": "**c.** It contains only mandatory and necessary fields.\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "When is a prospect converted to a full customer after approval?",
        "options": [
          "Never",
          "When the customer record is updated and validated via Customer Update, or when the deposit account is created",
          "On application input",
          "After one year"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "What happens to a prospect customer record if the application is declined?",
        "options": [
          "It is kept forever",
          "It is deleted after the days set in the *Customer Retention* field of the Company record",
          "It is archived by the customer",
          "It becomes full customer"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "For a prospect, what should *Existing Customer* be set to?",
        "options": [
          "Yes",
          "No",
          "Blank",
          "Group"
        ],
        "answer": 1,
        "explanation": "**b.** This reveals *Create Prospect Customer*; *Customer Type* decides which prospect version is served. The Prospect ID is auto-assigned.\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "At the Customer Update stage for a prospect, what does *Activate Customer* do?",
        "options": [
          "Deletes the prospect",
          "Opens the full customer version to complete details; once committed the customer becomes full",
          "Creates a loan",
          "Approves the deposit"
        ],
        "answer": 1,
        "explanation": "**b.** *Create Account* presents account products so needed accounts can be created (e.g. to fund the deposit via the Teller).\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "What is *Amount Requested* for a Savings Plan versus a Term Deposit?",
        "options": [
          "SP: the regular amount deposited at agreed frequencies; TD: a fixed amount",
          "SP: fixed; TD: regular",
          "Same for both",
          "Neither"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "Which Maturity Instruction is available for a Savings Plan?",
        "options": [
          "Both",
          "Rollover only",
          "Close only (rollover is not a SP feature)",
          "Neither"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "What is the default *Int. Pay Method* for a Savings Plan?",
        "options": [
          "Pay",
          "Capitalise",
          "Rollover",
          "None"
        ],
        "answer": 1,
        "explanation": "**b.** *Pay* may be selected, but Capitalise is most common.\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "For a Savings Plan with Account funding, when is the first regular deposit taken?",
        "options": [
          "At maturity",
          "Immediately online",
          "At close of business from the funding account",
          "Never"
        ],
        "answer": 2,
        "explanation": "**c.** With Cash funding, the initial amount is processed online via the `INITIAL.AMT` field.\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "What does a Savings Plan arrangement show before funding?",
        "options": [
          "No arrangement",
          "Status Current",
          "Status Closed",
          "Status Not Funded, with commitment and principal zero, and amounts due and frequencies shown"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      },
      {
        "question": "In which stage do Savings Plans mainly differ from Term Deposits?",
        "options": [
          "Application Input",
          "Deposit Creation",
          "Offer Production",
          "Review/Approval"
        ],
        "answer": 0,
        "explanation": "**a.** The other stages are done as normal.\n\n*Source:* `06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf`",
        "deck": "06-2.0"
      }
    ]
  },
  {
    "id": "deposit-maintenance",
    "title": "Deposit Maintenance, Withdrawal & Redemption — Quiz",
    "subtitle": "Deck 06-3.0 · Funding, withdrawal, redemption and simulation",
    "questions": [
      {
        "question": "Where are deposit operations accessed from?",
        "options": [
          "Only AA command line",
          "The Teller page, or the deposit record in Deposits or Single Customer View",
          "Only COB",
          "Only reports"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "Which funding methods are available for a deposit?",
        "options": [
          "Cash only",
          "Cash, Cheque or Account transfer, if the Settlement conditions allow",
          "Online card only",
          "Account only"
        ],
        "answer": 1,
        "explanation": "**b.** Funding can be partial or full per product setup.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "Which bill type is held by an unfunded deposit?",
        "options": [
          "PAYOFF",
          "OVERDUE",
          "EXP (Expected)",
          "DUE"
        ],
        "answer": 2,
        "explanation": "**c.** It can be viewed in Bills in the arrangement overview. Status is *Not Funded*.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "How are late Savings Plan payments handled?",
        "options": [
          "Ignored",
          "Aged through the overdue property class, possibly with a late payment charge or waived bonus",
          "Written off",
          "Closed immediately"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "Which can control withdrawals in a period?",
        "options": [
          "`ACTIVITY.RESTRICTION` and `PERIODIC.RULES`",
          "`GIC.BD.PARAMETERS`",
          "`PV.PROFILE`",
          "`EM.FT.BULK.PARAM`"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "What can charges on withdrawals/redemptions be?",
        "options": [
          "Only fixed",
          "Only waived",
          "Not allowed",
          "Due or deferred, for all or select transactions, with a charge API for early redemption/withdrawal penalty"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "On what dates can a withdrawal or redemption be simulated?",
        "options": [
          "Current, future or back-dated",
          "Only past",
          "Only maturity",
          "Only today"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "What triggers the redemption simulation?",
        "options": [
          "Customer update",
          "COB",
          "The Teller",
          "The *Redeem Deposit* option, with the chosen closure date"
        ],
        "answer": 3,
        "explanation": "**d.** A closure bill is simulated for the date specified.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "What does the Redemption Statement show?",
        "options": [
          "Customer details",
          "The interest rate",
          "Only the principal",
          "Transactional charges and costs of early redemption, and the total payable"
        ],
        "answer": 3,
        "explanation": "**d.** It lets the customer decide whether to proceed. It has an icon to complete the transaction.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "Which activity runs when the actual redemption is chosen?",
        "options": [
          "`DEPOSITS-FUND`",
          "`LENDING-WRITE-OFF`",
          "`LENDING-CLOSE-ARRANGEMENT`",
          "`DEPOSITS-REDEEM-ARRANGEMENT`, which shows the settlement property"
        ],
        "answer": 3,
        "explanation": "**d.** Settlement accounts can be amended.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "After redemption proceeds are settled, what status does the deposit get?",
        "options": [
          "Current",
          "Closed immediately",
          "PENDING.CLOSURE; subsequent COBs close it per the closure conditions",
          "Not Funded"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "How is a deposit pre-closed?",
        "options": [
          "By rollover",
          "By writing it off",
          "By deleting it",
          "By withdrawing all available balances including accrued interest"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "Where is deposit withdrawal accessed from?",
        "options": [
          "Only reports",
          "Only Teller",
          "The Arrangement Overview, entering the amount and withdrawal date so simulation can calculate charges",
          "COB"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "In the redemption screens, which button leads to the final commit screen?",
        "options": [
          "Print",
          "Authorise",
          "Validate",
          "Simulate"
        ],
        "answer": 2,
        "explanation": "**c.** Afterwards, proceeds are credited to the designated account.\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      },
      {
        "question": "What happens to Financial Summary balances after redemption?",
        "options": [
          "They are hidden",
          "They double",
          "They stay",
          "They are cleared; the redemption statement can be viewed again"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf`",
        "deck": "06-3.0"
      }
    ]
  },
  {
    "id": "account-application-maintenance",
    "title": "Account Application & Maintenance — Quiz",
    "subtitle": "Decks 07-1.0 & 07-2.0 · Account origination, dormant reset, closure and statements",
    "questions": [
      {
        "question": "Which application runs account origination?",
        "options": [
          "`EM.LO.APPLICATION`",
          "`EM.DO.APPLICATION`",
          "`EM.AO.APPLICATION`",
          "`EM.CUS.LOAN.LIST`"
        ],
        "answer": 2,
        "explanation": "**c.** Stages: Application Input, Review/Approval, Update Customer, Offer Production, Account Creation.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "Which table lists customer roles and their tax liability percentages?",
        "options": [
          "`AA.ACCOUNT`",
          "`EM.AO.PARAMETERS`",
          "`AA.CUSTOMER.ROLE`",
          "`PV.PROFILE`"
        ],
        "answer": 2,
        "explanation": "**c.** The role and whether the customer is 100% responsible for tax on credit interest are displayed on customer selection.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "For Savings Accounts, what does origination display after the product is selected?",
        "options": [
          "Overdraft limit",
          "Term",
          "Dividend and tax",
          "Currency, minimum balance, statement frequency and whether a passbook is required"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "For Share Accounts, what is displayed?",
        "options": [
          "Whether dividend is calculated on account transactions and whether withholding tax applies to earned dividend",
          "Minimum balance",
          "Overdraft",
          "Passbook"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "What is created automatically on commit of Application Input for a Current Account?",
        "options": [
          "A deposit",
          "Overdraft Limit and Card facility applications",
          "A guarantor record",
          "A loan"
        ],
        "answer": 1,
        "explanation": "**b.** Driven by the *Separate Application* setting in the Limit Product condition and the Facility Applications parameters.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "When must the automatically created facility applications be fully approved?",
        "options": [
          "At COB",
          "Before the Account Creation stage (ideally before Offer Production)",
          "After creation",
          "Never"
        ],
        "answer": 1,
        "explanation": "**b.** They can be processed in parallel with the account application and are reached through SCV.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "How does eligibility differ for accounts compared to loans and deposits?",
        "options": [
          "It happens at approval",
          "It is a separate stage",
          "There is none",
          "Eligibility Check is built into the Application Input stage"
        ],
        "answer": 3,
        "explanation": "**d.** An application can be discontinued early if the customer is ineligible.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "What can be negotiated at Application Input?",
        "options": [
          "Only the product",
          "Negotiable items such as interest rate or margin; facilities can be opted in or out",
          "Only currency",
          "Nothing"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "What can savings accounts do with interest?",
        "options": [
          "Only capitalise",
          "Only pay to loans",
          "Nothing",
          "Pay it to external beneficiaries: create one or select an existing account"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "When is the Review/Approval stage shown for accounts?",
        "options": [
          "Never",
          "When approval is required (e.g. overdraft limits) and the inputter lacks power to approve; otherwise it goes straight to Offer Production",
          "Always",
          "Only for prospects"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "Where are produced account documents stored?",
        "options": [
          "The Teller",
          "Email",
          "AA",
          "The Documents folder/tab of the Single Customer View"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "Where does a created account appear?",
        "options": [
          "Nowhere",
          "Accounts tab of SCV and of the Accounts page in Role Based Home Pages",
          "Loans tab",
          "Deposits tab"
        ],
        "answer": 1,
        "explanation": "**b.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "What happens to a prospect customer record when the account application is declined?",
        "options": [
          "Moved to loans",
          "Converted to full",
          "Kept",
          "Deleted after the days in the *Customer Retention* field of the Company record"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "What must be completed before Account Creation for a prospect customer?",
        "options": [
          "Guarantor input",
          "Credit scoring",
          "Facility applications must be approved",
          "Collateral"
        ],
        "answer": 2,
        "explanation": "**c.** Funds can then be deposited through the Teller or other transfers.\n\n*Source:* `07-1.0 Concept - Inclusive Banking Account Application.pdf`",
        "deck": "07-1.0"
      },
      {
        "question": "Which three maintenance topics does the Account Maintenance deck cover?",
        "options": [
          "Origination, Eligibility, Scoring",
          "Top-up, Reschedule, Payoff",
          "Provisioning, Write-off, Recovery",
          "Inactive/Dormant reset, Online Account Closure, Account Statement Request"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "When is an account flagged Inactive or Dormant?",
        "options": [
          "At opening",
          "After no activity for the number of months set in the account product record",
          "After closure",
          "After one day"
        ],
        "answer": 1,
        "explanation": "**b.** The flag shows wherever the account is displayed, and an inactive accounts report exists.\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "How is an inactive or dormant flag reset?",
        "options": [
          "From the Arrangement Overview link (reset date, validate, commit) or directly with the reset icon",
          "By the customer",
          "Only by closing it",
          "Automatically at COB"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "Why should account closure be simulated first?",
        "options": [
          "To delete the account",
          "To calculate outstanding accruals and show whether the account is a settlement account for others",
          "To charge fees",
          "It is mandatory"
        ],
        "answer": 1,
        "explanation": "**b.** Simulation requires both TSM and `AA.SIMULATION.SERVICE` running.\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "What must be done before closing an account that is a settlement account for a loan?",
        "options": [
          "Nothing",
          "Detach it by replacing it with another account of the customer, then approve and retry",
          "Delete the loan",
          "Close the loan"
        ],
        "answer": 1,
        "explanation": "**b.** Otherwise an error blocks closure.\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "In the closure simulation, what is the *Payoff Date*?",
        "options": [
          "The opening date",
          "The reset date",
          "The expected closure date",
          "The statement date"
        ],
        "answer": 2,
        "explanation": "**c.** Entered in the Calculate Payoff tab. In *Advanced – Pay Out* set Active = Yes and enter the account to receive the balance.\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "After closure, what happens to the balance and what is available?",
        "options": [
          "The balance is forfeited",
          "The account is deleted",
          "The balance stays",
          "The balance becomes zero as proceeds go to the payout account, and a closure statement can be reviewed"
        ],
        "answer": 3,
        "explanation": "**d.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "How is an account statement requested?",
        "options": [
          "With the *Request Document* icon, using the Document Output module with the account number as source Id and a date range",
          "Printing from Teller",
          "Email",
          "Via COB"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "Where is the requested statement available?",
        "options": [
          "Teller",
          "Account Overview only",
          "Documents tab of the Single Customer View",
          "Nowhere"
        ],
        "answer": 2,
        "explanation": "**c.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      },
      {
        "question": "Which listings are on the Accounts page of the Role Based Home Pages?",
        "options": [
          "Live accounts (live, pending, opened today), inactive/dormant accounts, and closed accounts",
          "Only deposits",
          "Only written-off",
          "Only loans"
        ],
        "answer": 0,
        "explanation": "**a.**\n\n*Source:* `07-2.0 Concept - Inclusive Banking Account Maintenance.pdf`",
        "deck": "07-2.0"
      }
    ]
  }
];
