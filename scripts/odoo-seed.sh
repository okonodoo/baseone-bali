#!/bin/bash
# Odoo Seed Script — Send sample data via curl
# Uses JSON-RPC to create contacts, leads, and products

ODOO_URL="https://pt-telkon-one-group.odoo.com/jsonrpc"
DB="pt-telkon-one-group"
UID=2
KEY="52c4e12551319be0ccc0cdae8db08db2f110590e"

call_odoo() {
  local model=$1
  local values=$2
  local result=$(curl -s -X POST "$ODOO_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"id\":$(date +%s%N),\"params\":{\"service\":\"object\",\"method\":\"execute_kw\",\"args\":[\"$DB\",$UID,\"$KEY\",\"$model\",\"create\",[$values]]}}")
  echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('result','ERROR: '+str(d.get('error',{}).get('data',{}).get('message','unknown'))))" 2>/dev/null
}

get_country_id() {
  local country=$1
  local result=$(curl -s -X POST "$ODOO_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"id\":$(date +%s%N),\"params\":{\"service\":\"object\",\"method\":\"execute_kw\",\"args\":[\"$DB\",$UID,\"$KEY\",\"res.country\",\"search\",[[  [\"name\",\"ilike\",\"$country\"]  ]],{\"limit\":1}]}}")
  echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result',[]); print(r[0] if r else 'false')" 2>/dev/null
}

echo "========================================"
echo "📇 Creating Contacts (res.partner)"
echo "========================================"

# Contact 1: John Smith (already created as ID 9, skip)
echo "  Contact 1: John Smith — Already created (ID: 9)"
C1=9

# Contact 2: Maria Schmidt
AU_ID=$(get_country_id "Germany")
echo "  Germany country_id: $AU_ID"
C2=$(call_odoo "res.partner" "{\"name\":\"Maria Schmidt\",\"email\":\"maria@example.com\",\"phone\":\"+4915123456789\",\"comment\":\"BaseOne Bali - Restaurant & F&B investor. Budget: \$75,000\",\"customer_rank\":1,\"country_id\":$AU_ID}")
echo "  Contact 2: Maria Schmidt — ID: $C2"

# Contact 3: Dmitry Petrov
RU_ID=$(get_country_id "Russian")
echo "  Russia country_id: $RU_ID"
C3=$(call_odoo "res.partner" "{\"name\":\"Dmitry Petrov\",\"email\":\"dmitry@example.com\",\"phone\":\"+79161234567\",\"comment\":\"BaseOne Bali - Digital Agency investor. Budget: \$40,000\",\"customer_rank\":1,\"country_id\":$RU_ID}")
echo "  Contact 3: Dmitry Petrov — ID: $C3"

echo ""
echo "========================================"
echo "📋 Creating CRM Leads (crm.lead)"
echo "========================================"

# Get Australia country ID for John
AU2_ID=$(get_country_id "Australia")
echo "  Australia country_id: $AU2_ID"

# Lead 1: John Smith
L1=$(call_odoo "crm.lead" "{\"name\":\"John Smith - Villa Investment \$150K\",\"contact_name\":\"John Smith\",\"email_from\":\"john@example.com\",\"phone\":\"+61412345678\",\"description\":\"Source: AI Advisor\\nBudget: \$150,000\\nSector: Villa Rental\\nCountry: Australia\\n\\nInvestor interested in villa rental business in Bali.\",\"expected_revenue\":150000,\"type\":\"lead\",\"partner_id\":$C1,\"country_id\":$AU2_ID}")
echo "  Lead 1: John Smith - Villa Investment — ID: $L1"

# Lead 2: Maria Schmidt
L2=$(call_odoo "crm.lead" "{\"name\":\"Maria Schmidt - Restaurant Setup \$75K\",\"contact_name\":\"Maria Schmidt\",\"email_from\":\"maria@example.com\",\"phone\":\"+4915123456789\",\"description\":\"Source: Investment Wizard\\nBudget: \$75,000\\nSector: Restaurant & F&B\\nCountry: Germany\\n\\nInvestor interested in opening a restaurant in Bali.\",\"expected_revenue\":75000,\"type\":\"lead\",\"partner_id\":$C2,\"country_id\":$AU_ID}")
echo "  Lead 2: Maria Schmidt - Restaurant Setup — ID: $L2"

# Lead 3: Dmitry Petrov
L3=$(call_odoo "crm.lead" "{\"name\":\"Dmitry Petrov - Digital Agency \$40K\",\"contact_name\":\"Dmitry Petrov\",\"email_from\":\"dmitry@example.com\",\"phone\":\"+79161234567\",\"description\":\"Source: Website Contact\\nBudget: \$40,000\\nSector: Digital Agency\\nCountry: Russia\\n\\nInvestor interested in setting up a digital agency in Bali.\",\"expected_revenue\":40000,\"type\":\"lead\",\"partner_id\":$C3,\"country_id\":$RU_ID}")
echo "  Lead 3: Dmitry Petrov - Digital Agency — ID: $L3"

echo ""
echo "========================================"
echo "🏠 Creating Products (product.template)"
echo "========================================"

P1=$(call_odoo "product.template" "{\"name\":\"Luxury Villa Canggu - 3BR\",\"type\":\"service\",\"list_price\":2500,\"description_sale\":\"Premium 3-bedroom luxury villa in Canggu, Bali. Fully furnished with private pool. Monthly rent USD.\",\"sale_ok\":true,\"purchase_ok\":false}")
echo "  Product 1: Luxury Villa Canggu - 3BR — ID: $P1 (Price: \$2,500/month)"

P2=$(call_odoo "product.template" "{\"name\":\"Commercial Space Seminyak - Restaurant Ready\",\"type\":\"service\",\"list_price\":1800,\"description_sale\":\"Prime commercial space in Seminyak for restaurant/café. High foot traffic area. Monthly rent USD.\",\"sale_ok\":true,\"purchase_ok\":false}")
echo "  Product 2: Commercial Space Seminyak — ID: $P2 (Price: \$1,800/month)"

P3=$(call_odoo "product.template" "{\"name\":\"Office Space Denpasar - Co-working\",\"type\":\"service\",\"list_price\":800,\"description_sale\":\"Modern office space in Denpasar business district. Suitable for co-working. Monthly rent USD.\",\"sale_ok\":true,\"purchase_ok\":false}")
echo "  Product 3: Office Space Denpasar — ID: $P3 (Price: \$800/month)"

echo ""
echo "========================================"
echo "📊 SEED DATA SUMMARY"
echo "========================================"
echo "Contacts: $C1, $C2, $C3"
echo "CRM Leads: $L1, $L2, $L3"
echo "Products: $P1, $P2, $P3"
echo "✅ All records created!"
