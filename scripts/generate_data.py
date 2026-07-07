#!/usr/bin/env python3
"""
Synthetic seed-data generator for the BD-ODI-Demo.

Generates small, deterministic CSV seeds that model the real shape of the
four source systems in scope for BD's Fivetran evaluation:
  - Salesforce Sales Cloud
  - Coupa
  - monday.com
  - Workday Adaptive Planning

Pure stdlib (csv, random, datetime) -- no third-party dependencies.
Deterministic: random.seed(42).

Run:
    python3 scripts/generate_data.py
Writes CSVs to transform/seeds/.
"""
import csv
import random
from datetime import date, timedelta
from pathlib import Path

random.seed(42)

REPO_ROOT = Path(__file__).resolve().parent.parent
SEEDS_DIR = REPO_ROOT / "transform" / "seeds"
SEEDS_DIR.mkdir(parents=True, exist_ok=True)


def write_csv(filename: str, header: list, rows: list) -> None:
    path = SEEDS_DIR / filename
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    print(f"wrote {len(rows)} rows -> {path.relative_to(REPO_ROOT)}")


def random_date(start: date, end: date) -> date:
    delta_days = (end - start).days
    return start + timedelta(days=random.randint(0, max(delta_days, 0)))


# ---------------------------------------------------------------------------
# Salesforce
# ---------------------------------------------------------------------------

INDUSTRIES = [
    "Healthcare",
    "Medical Devices",
    "Hospital & Health Care",
    "Biotechnology",
    "Pharmaceuticals",
    "Life Sciences",
    "Government",
    "Higher Education",
]

US_STATES = [
    "NJ", "NY", "CA", "TX", "MA", "IL", "PA", "OH", "NC", "GA",
    "MD", "VA", "FL", "WA", "CO", "MN",
]

FIRST_NAMES = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael",
    "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan",
    "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Daniel",
    "Nancy", "Matthew", "Lisa", "Anthony", "Betty", "Mark", "Margaret",
    "Paul", "Sandra",
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
    "Ramirez", "Lewis", "Robinson",
]

TITLES = [
    "Procurement Manager", "VP Supply Chain", "Director of Operations",
    "Financial Analyst", "IT Director", "Chief Nursing Officer",
    "Materials Manager", "Category Manager", "Controller",
    "Program Manager", "Business Systems Analyst", "Sourcing Specialist",
]

STAGE_NAMES = [
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
]

COMPANY_SUFFIXES = [
    "Health System", "Medical Center", "Regional Hospital", "Clinic Group",
    "Diagnostics", "Care Network", "University Hospital", "Surgical Center",
    "Labs", "Health Partners",
]

COMPANY_ROOTS = [
    "Summit", "Riverside", "Cedar", "Lakeside", "Northgate", "Union",
    "Harborview", "Meridian", "Ashford", "Brookfield", "Highland",
    "Pinecrest", "Fairview", "Ironwood", "Sterling", "Cascade", "Vantage",
    "Beacon", "Crestwood", "Elmhurst",
]


def gen_salesforce():
    sf_start = date(2022, 1, 1)
    sf_end = date(2026, 7, 1)

    accounts = []
    for i in range(1, 201):
        account_id = f"001{i:06d}"
        account_name = f"{random.choice(COMPANY_ROOTS)} {random.choice(COMPANY_SUFFIXES)}"
        industry = random.choice(INDUSTRIES)
        billing_state = random.choice(US_STATES)
        owner_id = f"005{random.randint(1, 25):04d}"
        created_date = random_date(sf_start, sf_end).isoformat()
        accounts.append(
            [account_id, account_name, industry, billing_state, owner_id, created_date]
        )
    write_csv(
        "salesforce_accounts.csv",
        ["account_id", "account_name", "industry", "billing_state", "owner_id", "created_date"],
        accounts,
    )

    account_ids = [row[0] for row in accounts]
    account_created = {row[0]: date.fromisoformat(row[5]) for row in accounts}

    opportunities = []
    for i in range(1, 801):
        opportunity_id = f"006{i:06d}"
        account_id = random.choice(account_ids)
        stage_name = random.choices(
            STAGE_NAMES,
            weights=[15, 15, 20, 15, 25, 10],
        )[0]
        amount = round(random.uniform(5000, 750000), 2)
        created_date_d = random_date(account_created[account_id], sf_end)
        close_date_d = created_date_d + timedelta(days=random.randint(15, 270))
        last_modified_d = created_date_d + timedelta(
            days=random.randint(0, max((close_date_d - created_date_d).days, 1))
        )
        opportunities.append(
            [
                opportunity_id,
                account_id,
                stage_name,
                amount,
                close_date_d.isoformat(),
                created_date_d.isoformat(),
                last_modified_d.isoformat(),
            ]
        )
    write_csv(
        "salesforce_opportunities.csv",
        [
            "opportunity_id",
            "account_id",
            "stage_name",
            "amount",
            "close_date",
            "created_date",
            "last_modified_date",
        ],
        opportunities,
    )

    contacts = []
    for i in range(1, 501):
        contact_id = f"003{i:06d}"
        account_id = random.choice(account_ids)
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
        title = random.choice(TITLES)
        contacts.append([contact_id, account_id, first_name, last_name, email, title])
    write_csv(
        "salesforce_contacts.csv",
        ["contact_id", "account_id", "first_name", "last_name", "email", "title"],
        contacts,
    )


# ---------------------------------------------------------------------------
# Coupa
# ---------------------------------------------------------------------------

SUPPLIER_CATEGORIES = [
    "Medical Supplies",
    "Laboratory Equipment",
    "IT Hardware",
    "Professional Services",
    "Facilities & Maintenance",
    "Packaging",
    "Logistics",
    "Office Supplies",
]

RISK_RATINGS = ["Low", "Medium", "High"]

PO_STATUSES = ["draft", "approved", "closed", "cancelled"]

CURRENCIES = ["USD", "EUR", "GBP"]

PAYMENT_STATUSES = ["pending", "paid", "overdue"]

SUPPLIER_ROOTS = [
    "Apex", "Vertex", "NovaMed", "Bright Path", "Clearline", "Ironclad",
    "Trueform", "Vantis", "Northstar", "Bluewell", "Ridgeway", "Solace",
    "Coreline", "Anchorpoint", "Fieldstone", "Grayson", "Halcyon", "Kestrel",
]

SUPPLIER_SUFFIXES = ["Supply Co.", "Industries", "Group", "Logistics", "Partners", "Labs", "Inc."]


def gen_coupa():
    coupa_start = date(2023, 1, 1)
    coupa_end = date(2026, 7, 1)

    suppliers = []
    for i in range(1, 81):
        supplier_id = f"SUP{i:05d}"
        supplier_name = f"{random.choice(SUPPLIER_ROOTS)} {random.choice(SUPPLIER_SUFFIXES)}"
        category = random.choice(SUPPLIER_CATEGORIES)
        risk_rating = random.choices(RISK_RATINGS, weights=[60, 30, 10])[0]
        suppliers.append([supplier_id, supplier_name, category, risk_rating])
    write_csv(
        "coupa_suppliers.csv",
        ["supplier_id", "supplier_name", "category", "risk_rating"],
        suppliers,
    )

    supplier_ids = [row[0] for row in suppliers]

    purchase_orders = []
    po_dates = {}
    for i in range(1, 601):
        po_id = f"PO{i:06d}"
        supplier_id = random.choice(supplier_ids)
        po_date_d = random_date(coupa_start, coupa_end)
        status = random.choices(PO_STATUSES, weights=[10, 25, 55, 10])[0]
        total_amount = round(random.uniform(250, 120000), 2)
        currency = random.choices(CURRENCIES, weights=[85, 10, 5])[0]
        po_dates[po_id] = po_date_d
        purchase_orders.append(
            [po_id, supplier_id, po_date_d.isoformat(), status, total_amount, currency]
        )
    write_csv(
        "coupa_purchase_orders.csv",
        ["po_id", "supplier_id", "po_date", "status", "total_amount", "currency"],
        purchase_orders,
    )

    po_ids = [row[0] for row in purchase_orders]

    invoices = []
    for i in range(1, 701):
        invoice_id = f"INV{i:06d}"
        po_id = random.choice(po_ids)
        invoice_date_d = po_dates[po_id] + timedelta(days=random.randint(1, 45))
        amount = round(random.uniform(200, 118000), 2)
        payment_status = random.choices(PAYMENT_STATUSES, weights=[25, 60, 15])[0]
        invoices.append(
            [invoice_id, po_id, invoice_date_d.isoformat(), amount, payment_status]
        )
    write_csv(
        "coupa_invoices.csv",
        ["invoice_id", "po_id", "invoice_date", "amount", "payment_status"],
        invoices,
    )


# ---------------------------------------------------------------------------
# monday.com
# ---------------------------------------------------------------------------

WORKSPACES = ["Supply Chain", "IT Projects", "Facilities", "R&D"]

BOARD_NAMES = [
    "Vendor Onboarding",
    "Facility Maintenance Requests",
    "IT Change Requests",
    "Regulatory Submissions",
    "Product Launch Tracker",
    "Capital Equipment Requests",
    "Quality Audit Actions",
    "Site Readiness Checklist",
    "Contract Renewals",
    "Field Service Escalations",
    "Lab Equipment Calibration",
    "New Hire Onboarding",
    "Marketing Campaign Tracker",
    "Clinical Trial Milestones",
    "Distribution Center Rollout",
]

ITEM_STATUSES = ["Working on it", "Done", "Stuck"]

ITEM_NAME_TEMPLATES = [
    "Review {n} submission",
    "Follow up with {n}",
    "Update {n} documentation",
    "Schedule {n} inspection",
    "Approve {n} request",
    "Escalate {n} issue",
    "Close out {n} task",
    "Coordinate {n} shipment",
]

ITEM_SUBJECTS = [
    "vendor", "site", "region", "device", "batch", "facility", "contract",
    "shipment", "audit", "device fleet",
]


def gen_monday():
    boards = []
    for i, board_name in enumerate(BOARD_NAMES, start=1):
        board_id = f"BRD{i:04d}"
        workspace = random.choice(WORKSPACES)
        boards.append([board_id, board_name, workspace])
    write_csv("monday_boards.csv", ["board_id", "board_name", "workspace"], boards)

    board_ids = [row[0] for row in boards]

    md_start = date(2024, 1, 1)
    md_end = date(2026, 7, 1)

    items = []
    for i in range(1, 401):
        item_id = f"ITM{i:06d}"
        board_id = random.choice(board_ids)
        template = random.choice(ITEM_NAME_TEMPLATES)
        subject = random.choice(ITEM_SUBJECTS)
        item_name = template.format(n=subject)
        status = random.choices(ITEM_STATUSES, weights=[45, 40, 15])[0]
        created_at_d = random_date(md_start, md_end)
        updated_at_d = created_at_d + timedelta(days=random.randint(0, 120))
        items.append(
            [
                item_id,
                board_id,
                item_name,
                status,
                created_at_d.isoformat(),
                updated_at_d.isoformat(),
            ]
        )
    write_csv(
        "monday_items.csv",
        ["item_id", "board_id", "item_name", "status", "created_at", "updated_at"],
        items,
    )


# ---------------------------------------------------------------------------
# Workday Adaptive Planning
# ---------------------------------------------------------------------------

ACCOUNT_TYPES = ["Revenue", "Expense", "Headcount"]

REVENUE_ACCOUNT_NAMES = [
    "Product Revenue", "Service Revenue", "Recurring Revenue",
    "Other Revenue", "Rebate Adjustments",
]

EXPENSE_ACCOUNT_NAMES = [
    "Cost of Goods Sold", "R&D Expense", "Sales & Marketing Expense",
    "G&A Expense", "Facilities Expense", "IT Expense", "Travel & Entertainment",
    "Professional Services Expense", "Freight & Logistics Expense",
    "Regulatory & Compliance Expense",
]

HEADCOUNT_ACCOUNT_NAMES = [
    "Full-Time Headcount", "Contractor Headcount", "Open Requisitions",
]

LEVEL_CODES = [f"L{str(i).zfill(2)}" for i in range(1, 13)]

DEPARTMENTS = [
    "Manufacturing", "R&D", "Quality Assurance", "Regulatory Affairs",
    "Sales", "Marketing", "Supply Chain", "Finance", "IT",
    "Customer Service", "Facilities", "Human Resources",
]

POSITIONS = [
    "Engineer", "Analyst", "Manager", "Specialist", "Technician",
    "Director", "Coordinator", "Associate", "Senior Manager", "Lead",
]

VERSIONS = ["Budget", "Actual", "Forecast"]

FACTSHEET_METRICS = [
    "Headcount Utilization %",
    "Operating Margin %",
    "Revenue per FTE",
    "Days Sales Outstanding",
    "Capex to Revenue %",
    "Cost per Unit Shipped",
]


def month_range(start: date, end: date):
    months = []
    current = date(start.year, start.month, 1)
    while current <= end:
        months.append(current)
        if current.month == 12:
            current = date(current.year + 1, 1, 1)
        else:
            current = date(current.year, current.month + 1, 1)
    return months


def gen_adaptive():
    accounts = []
    account_codes = []
    for i, name in enumerate(REVENUE_ACCOUNT_NAMES, start=1):
        code = f"REV{i:03d}"
        account_codes.append((code, "Revenue"))
        accounts.append([code, name, "Revenue", random.choice(LEVEL_CODES)])
    for i, name in enumerate(EXPENSE_ACCOUNT_NAMES, start=1):
        code = f"EXP{i:03d}"
        account_codes.append((code, "Expense"))
        accounts.append([code, name, "Expense", random.choice(LEVEL_CODES)])
    for i, name in enumerate(HEADCOUNT_ACCOUNT_NAMES, start=1):
        code = f"HC{i:03d}"
        account_codes.append((code, "Headcount"))
        accounts.append([code, name, "Headcount", random.choice(LEVEL_CODES)])

    # pad to ~60 rows with additional expense sub-accounts across levels
    while len(accounts) < 60:
        i = len(accounts) + 1
        base_name = random.choice(EXPENSE_ACCOUNT_NAMES)
        level_code = random.choice(LEVEL_CODES)
        code = f"EXP{i:03d}"
        account_codes.append((code, "Expense"))
        accounts.append([code, f"{base_name} - {level_code}", "Expense", level_code])

    write_csv(
        "adaptive_accounts.csv",
        ["account_code", "account_name", "account_type", "level_code"],
        accounts,
    )

    account_level = {row[0]: row[3] for row in accounts}

    periods = month_range(date(2025, 1, 1), date(2026, 6, 1))

    transactions = []
    tx_i = 1
    target_rows = 3000
    # distribute rows across account/level/version/period combinations
    while len(transactions) < target_rows:
        account_code, account_type = random.choice(account_codes)
        level_code = account_level[account_code]
        version = random.choice(VERSIONS)
        period_date = random.choice(periods)
        if account_type == "Revenue":
            amount = round(random.uniform(50000, 900000), 2)
        elif account_type == "Headcount":
            amount = float(random.randint(1, 60))
        else:
            amount = round(random.uniform(2000, 400000), 2)
        transaction_id = f"TXN{tx_i:07d}"
        tx_i += 1
        transactions.append(
            [transaction_id, account_code, level_code, version, period_date.isoformat(), amount]
        )
    write_csv(
        "adaptive_account_transactions.csv",
        ["transaction_id", "account_code", "level_code", "version", "period_date", "amount"],
        transactions,
    )

    cube_rows = []
    target_cube_rows = 500
    while len(cube_rows) < target_cube_rows:
        level_code = random.choice(LEVEL_CODES)
        department = random.choice(DEPARTMENTS)
        position = random.choice(POSITIONS)
        period_date = random.choice(periods)
        planned_fte = round(random.uniform(0.5, 12), 1)
        cube_rows.append(
            [level_code, department, position, period_date.isoformat(), planned_fte]
        )
    write_csv(
        "adaptive_cube_sheet_headcount.csv",
        ["level_code", "department", "position", "period_date", "planned_fte"],
        cube_rows,
    )

    factsheet_rows = []
    target_fact_rows = 300
    while len(factsheet_rows) < target_fact_rows:
        level_code = random.choice(LEVEL_CODES)
        metric_name = random.choice(FACTSHEET_METRICS)
        period_date = random.choice(periods)
        if "%" in metric_name:
            metric_value = round(random.uniform(1, 45), 2)
        elif metric_name == "Revenue per FTE":
            metric_value = round(random.uniform(80000, 400000), 2)
        elif metric_name == "Days Sales Outstanding":
            metric_value = round(random.uniform(20, 75), 1)
        else:
            metric_value = round(random.uniform(5, 500), 2)
        factsheet_rows.append([level_code, metric_name, metric_value, period_date.isoformat()])
    write_csv(
        "adaptive_factsheet.csv",
        ["level_code", "metric_name", "metric_value", "period_date"],
        factsheet_rows,
    )


def main():
    gen_salesforce()
    gen_coupa()
    gen_monday()
    gen_adaptive()
    print("done.")


if __name__ == "__main__":
    main()
