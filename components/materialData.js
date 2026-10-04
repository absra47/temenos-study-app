// Source training material, shown from each concept via "View course material".
//
// Two tiers:
//  - MATERIAL_COURSE: one consolidated PDF per TLC course (public/material/tlc/<courseId>.pdf).
//  - MATERIAL_SECTION: the finer-grained Functional Training deck PDFs, mapped per section
//    (public/material/functional_training/<original filename>.pdf). Where a section has its
//    own file(s) here, this takes priority over the course-level PDF.

export const MATERIAL_COURSE = {
  fif: "tlc/fif.pdf",
  aalf1: "tlc/aalf1.pdf",
  aalf2: "tlc/aalf2.pdf",
  aai1: "tlc/aai1.pdf",
  aai2: "tlc/aai2.pdf",
  acbb1: "tlc/acbb1.pdf",
  acbb2: "tlc/acbb2.pdf",
  alpb1: "tlc/alpb1.pdf",
  alpb2: "tlc/alpb2.pdf",
};

const ft = (name) => ({ label: name.replace(/\.pdf$/i, ""), file: `functional_training/${name}` });

export const MATERIAL_SECTION = {
  // TFT Day 1
  "tft-1": [ft("00-1.0 Concept - Product Highlights.pdf")],
  "tft-2": [ft("00-2.0 Concept - Partner Certification & Implementation Methodology.pdf")],
  "tft-3": [ft("02-1.0 Concept - Common Product Parameters.pdf")],
  "tft-4": [ft("02-1.1 Hands-on - Common Product Parameters.pdf")],

  // TFT Day 2
  "tftD2-1": [ft("02-2.0 Concept - Loan Product and Product Conditions.pdf")],
  "tftD2-2": [ft("02-3.0 Concept - Loan Additional Product Conditions.pdf")],
  "tftD2-3": [ft("02-4.0 Concept - Loan Product Review Publish & Maintenance.pdf")],
  "tftD2-4": [ft("02-4.1 Hands-on - Loan Product Builder.pdf"), ft("02-4.2 Quiz - Loans Product Builder.pdf")],
  "tftD2-5": [ft("02_5_0_Concept_Deposit_and_Savings_Plans_Product_Builder_1.pdf")],
  "tftD2-6": [ft("02_6_0_Concept_Account_Product_Builder_and_Overdraft_Facilities.pdf")],
  "tftD2-7": [ft("02-5.1 Hands-on - Savings Plans Product Builder.pdf"), ft("02_6_1_Hands_on_Account_Product_Builder_and_Overdraft_Facilities.pdf")],

  // TFT Day 3
  "tftD3-1": [ft("03-1.0. Concept - Origination Overview and Common Parameters.pdf")],
  "tftD3-2": [ft("03-2.0 Concept - Origination Additional Parameters 1.pdf")],
  "tftD3-3": [ft("03-3.0 Concept - Origination Additional Common Parameters 2.pdf"), ft("03-7.0 Concept - Global Product Parameters.pdf")],
  "tftD3-4": [ft("03-3.1 Hands-on - Common Origination Parameters.pdf"), ft("03-3.2 Quiz - Common Origination Parameters.pdf")],
  "tftD3-5": [ft("03-4.0 Guarantor Parameters.pdf")],
  "tftD3-6": [ft("03-5.0 Concept - Credit Scoring Parameters.pdf")],
  "tftD3-7": [ft("03-5.1 Hands-on - Credit Scoring Parameters.pdf"), ft("03-5.2 Quiz - Credit Scoring.pdf")],
  "tftD3-8": [ft("03-6.0 Concept - Income-Expenditure and Loan Stress Testing.pdf")],

  // TFT Day 4
  "tftD4-1": [ft("04-1.0 Concept - Loan Application Processing 1.pdf")],
  "tftD4-2": [ft("04-2.0 Concept - Loan Application Processing 2.pdf")],
  "tftD4-3": [ft("04-3.0 Concept - Loan Application Processing 3.pdf")],
  "tftD4-4": [ft("04-4.0 Concept - Loan Application Processing 4.pdf")],
  "tftD4-5": [ft("04-4.0 Concept - Loan Application Processing 4.pdf")],
  "tftD4-6": [ft("04-4.0 Concept - Loan Application Processing 4.pdf")],
  "tftD4-7": [ft("04-4.1 Hands-on - Loan Application Processing.pdf")],

  // TFT Day 5
  "tftD5-1": [ft("05-1.0 Concept - Loan Repayment and Overdue Payments.pdf")],
  "tftD5-2": [ft("05-2.0 Concept - Loan Maintenance Activities.pdf")],
  "tftD5-3": [ft("05-3.0 Concept - CGAP Reports.pdf"), ft("05-3.2 Quiz - Loan Operations.pdf")],
  "tftD5-4": [ft("05-4.0 Concept - Standard Loan Provisioning 1.pdf"), ft("05-5.0 Concept - Standard Loan Provisioning 2.pdf")],
  "tftD5-5": [ft("05-5.1 Hands-on - Standard Loan Provisioning.pdf")],
  "tftD5-6": [ft("05-6.0 Concept - Guarantor Recoveries & Loan Write-off.pdf")],
  "tftD5-7": [ft("05-7.0 Concept - Loan Recovery.pdf")],
  "tftD5-8": [ft("05-7.1 Hands-on - Loan Write-off and Recovery.pdf")],

  // TFT Day 6
  "tftD6-1": [ft("06-1.0 Concept - Deposit Application Processing - Existing Customers.pdf")],
  "tftD6-2": [ft("06-2.0 Concept - Prospect Customer Deposits & Savings Plans.pdf")],
  "tftD6-3": [ft("06-2.1 Hands-on - Deposit Application Processing.pdf"), ft("06-2.2 Quiz - Deposit Application Processing.pdf")],
  "tftD6-4": [ft("06-3.0 Concept - Deposit Maintenance, Withdrawal & Redemption.pdf")],
  "tftD6-5": [ft("06-3.1 Hands-on - Deposit Maintenance, Withdrawal and Redemption.pdf")],
  "tftD6-6": [ft("07-1.0 Concept - Inclusive Banking Account Application.pdf")],
  "tftD6-7": [ft("07-1.1 Hands-on - Inclusive Banking Account Application.pdf")],
  "tftD6-8": [ft("07-2.0 Concept - Inclusive Banking Account Maintenance.pdf")],
};
