#!/usr/bin/env python3
"""
Odoo Phase 18 Seed Script
Creates: affiliate partners, VGR partner, emlakci partner, CRM pipeline stages, scouting fee product, project tasks
"""
import xmlrpc.client
import sys

URL = "https://pt-telkon-one-group.odoo.com"
DB = "pt-telkon-one-group"
USERNAME = "ozgur@telkonone.com"
API_KEY = "52c4e12551319be0ccc0cdae8db08db2f110590e"

common = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/common", allow_none=True)
uid = common.authenticate(DB, USERNAME, API_KEY, {})
print(f"Authenticated UID: {uid}")

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object", allow_none=True)

def execute(model, method, *args, **kwargs):
    return models.execute_kw(DB, uid, API_KEY, model, method, list(args), kwargs)

def search(model, domain, limit=0):
    kw = {}
    if limit:
        kw['limit'] = limit
    return execute(model, 'search', domain, **kw)

def create(model, vals):
    return execute(model, 'create', vals)

def write(model, ids, vals):
    return execute(model, 'write', ids, vals)

def search_read(model, domain, fields, limit=0):
    kw = {'fields': fields}
    if limit:
        kw['limit'] = limit
    return execute(model, 'search_read', domain, **kw)

def get_country_id(name):
    ids = search('res.country', [['name', 'ilike', name]], limit=1)
    return ids[0] if ids else False

# ============================================================
# 1. CHECK & CREATE CUSTOM FIELDS FOR AFFILIATE ON res.partner
# ============================================================
print("\n=== 1. AFFILIATE CUSTOM FIELDS ===")

affiliate_fields = {
    'x_is_affiliate': {'field_description': 'Is Affiliate', 'ttype': 'boolean'},
    'x_affiliate_code': {'field_description': 'Affiliate Code', 'ttype': 'char'},
    'x_commission_rate': {'field_description': 'Commission Rate (%)', 'ttype': 'float'},
    'x_total_commission': {'field_description': 'Total Commission', 'ttype': 'float'},
    'x_pending_commission': {'field_description': 'Pending Commission', 'ttype': 'float'},
    'x_referred_by': {'field_description': 'Referred By (Affiliate Code)', 'ttype': 'char'},
}

# Get res.partner model ID
partner_model = search_read('ir.model', [['model', '=', 'res.partner']], ['id'], limit=1)
partner_model_id = partner_model[0]['id'] if partner_model else None
print(f"res.partner model ID: {partner_model_id}")

for field_name, field_info in affiliate_fields.items():
    existing = search('ir.model.fields', [['model', '=', 'res.partner'], ['name', '=', field_name]], limit=1)
    if existing:
        print(f"  Field {field_name} already exists (ID: {existing[0]})")
    else:
        try:
            fid = create('ir.model.fields', {
                'model_id': partner_model_id,
                'name': field_name,
                'field_description': field_info['field_description'],
                'ttype': field_info['ttype'],
                'store': True,
            })
            print(f"  Created field {field_name} (ID: {fid})")
        except Exception as e:
            print(f"  Error creating {field_name}: {e}")

# Also add x_referred_by to crm.lead
lead_model = search_read('ir.model', [['model', '=', 'crm.lead']], ['id'], limit=1)
lead_model_id = lead_model[0]['id'] if lead_model else None
print(f"crm.lead model ID: {lead_model_id}")

for field_name in ['x_referred_by']:
    existing = search('ir.model.fields', [['model', '=', 'crm.lead'], ['name', '=', field_name]], limit=1)
    if existing:
        print(f"  Lead field {field_name} already exists (ID: {existing[0]})")
    else:
        try:
            fid = create('ir.model.fields', {
                'model_id': lead_model_id,
                'name': field_name,
                'field_description': 'Referred By (Affiliate Code)',
                'ttype': 'char',
                'store': True,
            })
            print(f"  Created lead field {field_name} (ID: {fid})")
        except Exception as e:
            print(f"  Error creating lead field {field_name}: {e}")

# ============================================================
# 2. CREATE 3 AFFILIATE PARTNERS
# ============================================================
print("\n=== 2. AFFILIATE PARTNERS ===")

affiliates = [
    {
        'name': 'Jestiyon Turkey',
        'email': 'info@jestiyon.com',
        'is_company': True,
        'x_is_affiliate': True,
        'x_affiliate_code': 'JEST2026',
        'x_commission_rate': 10.0,
        'x_total_commission': 0.0,
        'x_pending_commission': 0.0,
        'country': 'Turkey',
        'comment': 'Affiliate partner - Turkish market referrals',
    },
    {
        'name': 'Bali Property Agent - Made Wijaya',
        'email': 'made@baliproperty.com',
        'is_company': False,
        'x_is_affiliate': True,
        'x_affiliate_code': 'MADE2026',
        'x_commission_rate': 8.0,
        'x_total_commission': 0.0,
        'x_pending_commission': 0.0,
        'country': 'Indonesia',
        'comment': 'Affiliate partner - Local Bali property agent',
    },
    {
        'name': 'Digital Nomad Network',
        'email': 'partners@dnn.sg',
        'is_company': True,
        'x_is_affiliate': True,
        'x_affiliate_code': 'DNN2026',
        'x_commission_rate': 12.0,
        'x_total_commission': 0.0,
        'x_pending_commission': 0.0,
        'country': 'Singapore',
        'comment': 'Affiliate partner - Digital nomad community referrals',
    },
]

for aff in affiliates:
    country = aff.pop('country')
    existing = search('res.partner', [['email', '=', aff['email']]], limit=1)
    if existing:
        write('res.partner', existing, aff)
        print(f"  Updated affiliate: {aff['name']} (ID: {existing[0]})")
    else:
        country_id = get_country_id(country)
        if country_id:
            aff['country_id'] = country_id
        pid = create('res.partner', aff)
        print(f"  Created affiliate: {aff['name']} (ID: {pid})")

# ============================================================
# 3. VGR PARTNER + PORTAL USER
# ============================================================
print("\n=== 3. VGR PARTNER ===")

vgr_existing = search('res.partner', [['email', '=', 'vgr@vireon.com']], limit=1)
vgr_vals = {
    'name': 'Vireon Global Resources',
    'email': 'vgr@vireon.com',
    'is_company': True,
    'customer_rank': 1,
    'supplier_rank': 1,
    'comment': 'Legal operations partner - PMA setup, licensing, compliance',
    'phone': '+62 812 9999 0001',
}
country_id = get_country_id('Indonesia')
if country_id:
    vgr_vals['country_id'] = country_id

if vgr_existing:
    write('res.partner', vgr_existing, vgr_vals)
    vgr_id = vgr_existing[0]
    print(f"  Updated VGR partner (ID: {vgr_id})")
else:
    vgr_id = create('res.partner', vgr_vals)
    print(f"  Created VGR partner (ID: {vgr_id})")

# Try to create portal user for VGR
try:
    vgr_user_existing = search('res.users', [['login', '=', 'vgr@vireon.com']], limit=1)
    if vgr_user_existing:
        print(f"  VGR portal user already exists (ID: {vgr_user_existing[0]})")
    else:
        # Get portal group
        portal_group = search('res.groups', [['category_id.name', '=', 'User types'], ['name', 'ilike', 'Portal']], limit=1)
        if portal_group:
            vgr_user_id = create('res.users', {
                'name': 'Vireon Global Resources',
                'login': 'vgr@vireon.com',
                'partner_id': vgr_id,
                'groups_id': [(6, 0, portal_group)],
            })
            print(f"  Created VGR portal user (ID: {vgr_user_id})")
        else:
            print("  Portal group not found, skipping user creation")
except Exception as e:
    print(f"  VGR portal user creation error (may need manual setup): {e}")

# ============================================================
# 4. LEGAL OPERATIONS PROJECT + PMA TASK
# ============================================================
print("\n=== 4. PROJECT & TASK ===")

try:
    # Check if project module is installed
    project_existing = search('project.project', [['name', '=', 'Legal Operations']], limit=1)
    if project_existing:
        project_id = project_existing[0]
        print(f"  Project 'Legal Operations' already exists (ID: {project_id})")
    else:
        project_id = create('project.project', {
            'name': 'Legal Operations',
            'description': 'PMA setup, licensing, and compliance operations managed by Vireon Global Resources',
        })
        print(f"  Created project 'Legal Operations' (ID: {project_id})")

    # Create PMA task
    task_existing = search('project.task', [['name', 'ilike', 'PMA Setup - John Smith']], limit=1)
    if task_existing:
        print(f"  PMA task already exists (ID: {task_existing[0]})")
    else:
        task_vals = {
            'name': 'PMA Setup - John Smith (Villa Rental)',
            'project_id': project_id,
            'description': """PMA Company Setup for John Smith - Villa Rental Business

Checklist:
1. Document Verification - Passport, KITAS, supporting documents
2. Notary & Deed - Company deed preparation and notarization
3. OSS & Licensing - Online Single Submission, NIB, business licenses
4. Bank Account - Corporate bank account opening
5. Handover - Final documents, company stamp, operational briefing

Budget: $150,000
Sector: Villa Rental
Country: Australia
Timeline: 9 business days""",
        }
        # Try to assign to VGR user
        try:
            vgr_users = search('res.users', [['login', '=', 'vgr@vireon.com']], limit=1)
            if vgr_users:
                task_vals['user_ids'] = [(6, 0, vgr_users)]
        except:
            pass

        task_id = create('project.task', task_vals)
        print(f"  Created PMA task (ID: {task_id})")

except Exception as e:
    print(f"  Project/Task error (module may not be installed): {e}")

# ============================================================
# 5. EMLAKCI PARTNER + PRODUCTS
# ============================================================
print("\n=== 5. EMLAKCI PARTNER ===")

emlakci_existing = search('res.partner', [['email', '=', 'ketut@balidream.com']], limit=1)
emlakci_vals = {
    'name': 'Bali Dream Properties - Ketut',
    'email': 'ketut@balidream.com',
    'is_company': True,
    'customer_rank': 0,
    'supplier_rank': 1,
    'comment': 'Real estate partner - Property listings in Bali',
    'phone': '+62 812 8888 0002',
}
if country_id:
    emlakci_vals['country_id'] = country_id

if emlakci_existing:
    write('res.partner', emlakci_existing, emlakci_vals)
    emlakci_id = emlakci_existing[0]
    print(f"  Updated emlakci partner (ID: {emlakci_id})")
else:
    emlakci_id = create('res.partner', emlakci_vals)
    print(f"  Created emlakci partner (ID: {emlakci_id})")

# Portal user for emlakci
try:
    emlakci_user_existing = search('res.users', [['login', '=', 'ketut@balidream.com']], limit=1)
    if emlakci_user_existing:
        print(f"  Emlakci portal user already exists (ID: {emlakci_user_existing[0]})")
    else:
        portal_group = search('res.groups', [['category_id.name', '=', 'User types'], ['name', 'ilike', 'Portal']], limit=1)
        if portal_group:
            emlakci_user_id = create('res.users', {
                'name': 'Bali Dream Properties - Ketut',
                'login': 'ketut@balidream.com',
                'partner_id': emlakci_id,
                'groups_id': [(6, 0, portal_group)],
            })
            print(f"  Created emlakci portal user (ID: {emlakci_user_id})")
        else:
            print("  Portal group not found")
except Exception as e:
    print(f"  Emlakci portal user error: {e}")

# Emlakci property products
print("\n=== 5b. EMLAKCI PRODUCTS ===")

emlakci_products = [
    {
        'name': 'Beachfront Villa Sanur - 4BR Pool',
        'type': 'service',
        'list_price': 3200,
        'description_sale': 'Stunning beachfront villa in Sanur with 4 bedrooms, private pool, and ocean views. Fully furnished.',
        'sale_ok': True,
        'purchase_ok': False,
    },
    {
        'name': 'Rice Field View Villa Ubud - 2BR',
        'type': 'service',
        'list_price': 1500,
        'description_sale': 'Peaceful villa overlooking rice terraces in Ubud. 2 bedrooms, yoga deck, organic garden.',
        'sale_ok': True,
        'purchase_ok': False,
    },
    {
        'name': 'Commercial Lot Kuta - 500m2',
        'type': 'service',
        'list_price': 5000,
        'description_sale': 'Prime commercial land in Kuta, 500m2, suitable for hotel or restaurant development.',
        'sale_ok': True,
        'purchase_ok': False,
    },
]

for prod in emlakci_products:
    existing = search('product.template', [['name', '=', prod['name']]], limit=1)
    if existing:
        print(f"  Product already exists: {prod['name']} (ID: {existing[0]})")
    else:
        pid = create('product.template', prod)
        print(f"  Created product: {prod['name']} (ID: {pid})")

# ============================================================
# 6. CRM PIPELINE STAGES
# ============================================================
print("\n=== 6. CRM PIPELINE STAGES ===")

stages = [
    {'name': 'New', 'sequence': 1},
    {'name': 'Qualified', 'sequence': 2},
    {'name': 'Scouting Fee Paid', 'sequence': 3},
    {'name': 'Scouting', 'sequence': 4},
    {'name': 'Proposal', 'sequence': 5},
    {'name': 'Won', 'sequence': 10, 'is_won': True},
]

for stage in stages:
    existing = search('crm.stage', [['name', '=', stage['name']]], limit=1)
    if existing:
        print(f"  Stage already exists: {stage['name']} (ID: {existing[0]})")
    else:
        try:
            sid = create('crm.stage', stage)
            print(f"  Created stage: {stage['name']} (ID: {sid})")
        except Exception as e:
            print(f"  Error creating stage {stage['name']}: {e}")

# Check for Lost stage (usually exists by default)
lost_existing = search('crm.stage', [['name', 'ilike', 'Lost']], limit=1)
if lost_existing:
    print(f"  Lost stage exists (ID: {lost_existing[0]})")
else:
    try:
        sid = create('crm.stage', {'name': 'Lost', 'sequence': 99})
        print(f"  Created Lost stage (ID: {sid})")
    except Exception as e:
        print(f"  Error creating Lost stage: {e}")

# ============================================================
# 7. SCOUTING FEE PRODUCT
# ============================================================
print("\n=== 7. SCOUTING FEE PRODUCT ===")

scouting_existing = search('product.template', [['name', '=', 'Scouting Fee']], limit=1)
if scouting_existing:
    print(f"  Scouting Fee product already exists (ID: {scouting_existing[0]})")
else:
    scouting_id = create('product.template', {
        'name': 'Scouting Fee',
        'type': 'service',
        'list_price': 500,
        'sale_ok': True,
        'purchase_ok': False,
        'description_sale': 'BaseOne Bali Scouting Fee - Professional on-ground scouting service for investment opportunities in Bali. Includes site visits, market analysis, and detailed report.',
    })
    print(f"  Created Scouting Fee product (ID: {scouting_id})")

# ============================================================
# 8. CHECK SIGN MODULE
# ============================================================
print("\n=== 8. ODOO SIGN MODULE CHECK ===")

try:
    sign_templates = search('sign.template', [], limit=1)
    print(f"  Sign module is available! Templates found: {len(sign_templates)}")
    
    # Try creating sign templates
    sign_docs = [
        {'name': 'Virtual Office Agreement', 'description': 'Virtual office rental agreement for PMA companies'},
        {'name': 'PMA Setup Service Agreement', 'description': 'Service agreement for PMA company setup'},
        {'name': 'NDA - Non-Disclosure Agreement', 'description': 'Confidentiality agreement for investment discussions'},
    ]
    for doc in sign_docs:
        existing = search('sign.template', [['name', '=', doc['name']]], limit=1)
        if existing:
            print(f"  Sign template exists: {doc['name']} (ID: {existing[0]})")
        else:
            try:
                sid = create('sign.template', doc)
                print(f"  Created sign template: {doc['name']} (ID: {sid})")
            except Exception as e:
                print(f"  Error creating sign template: {e}")
except Exception as e:
    print(f"  Sign module not available or not accessible: {e}")
    print("  Will create a Contracts info page on the website instead.")

print("\n=== DONE ===")
print("All Odoo Phase 18 data has been seeded successfully!")
