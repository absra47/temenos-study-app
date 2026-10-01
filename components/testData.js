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
  }
];
