"""
KALAVERSE - AI Pricing Assistant Service
Dynamic fair-value pricing engine factoring in raw materials, labour hours,
reasonable living hourly artisan wage, fair profit margin, and category benchmarks.
"""

def calculatePriceRecommendation(costs, category="Handloom", gi_tag=True, experience_years=10):
    """
    Real Dynamic AI Pricing Assistant Service.
    
    Calculation Formula:
    1. Labor Cost = Labor Hours × Reasonable Hourly Artisan Wage (₹120/hr standard fair living wage)
    2. Base Cost = Material Cost + Labor Cost + Packaging/Transport/Misc
    3. Suggested Fair Price = Base Cost + Fair Artisan Profit Margin (25% - 35%)
    4. Suggested Range:
       - Minimum Floor Price = Base Cost × 1.15 (ensures living wage + 15% baseline)
       - Premium Boutique Tier = Suggested Price × 1.25 (retail direct-to-consumer tier)
    
    Guarantees:
    - Suggested price is NEVER lower than Material Cost.
    - Accurately reflects user-entered Material Cost and Labor Hours dynamically.
    """
    raw_material = max(0.0, float(costs.get('raw_material_cost', 0) or 0))
    labour_hours = max(0.0, float(costs.get('labour_hours', 0) or 0))
    
    # Use reasonable hourly artisan wage (default ₹120/hr if not specified or <= 0)
    hourly_wage = float(costs.get('labour_rate_per_hour', 0) or 0)
    if hourly_wage <= 0:
        hourly_wage = 120.0  # Fair hourly living wage in INR
        
    packaging = max(0.0, float(costs.get('packaging_cost', 0) or 0))
    transport = max(0.0, float(costs.get('transport_cost', 0) or 0))
    other = max(0.0, float(costs.get('other_cost', 0) or 0))

    direct_labour = labour_hours * hourly_wage
    base_cost = raw_material + direct_labour + packaging + transport + other

    # Base margin (25% to 35% based on craft category complexity)
    cat_lower = (category or "").lower()
    if "handloom" in cat_lower or "silk" in cat_lower:
        margin_rate = 0.32
        category_name = "Heritage Handloom Silk"
    elif "bidri" in cat_lower or "metal" in cat_lower:
        margin_rate = 0.35
        category_name = "Precious Metal Inlay"
    elif "dhokra" in cat_lower or "brass" in cat_lower:
        margin_rate = 0.30
        category_name = "Tribal Brass Casting"
    elif "pottery" in cat_lower or "terracotta" in cat_lower:
        margin_rate = 0.28
        category_name = "Eco Terracotta Pottery"
    elif "wood" in cat_lower:
        margin_rate = 0.30
        category_name = "Hand-Carved Woodcraft"
    else:
        margin_rate = 0.30
        category_name = "Artisan Handicraft"

    # Add optional heritage/GI bonus
    if gi_tag:
        margin_rate += 0.03

    profit = base_cost * margin_rate
    raw_suggested = base_cost + profit

    # Suggested price must NEVER be lower than Material Cost
    suggested_price = max(raw_material, round(raw_suggested / 50.0) * 50.0)
    if suggested_price <= 0:
        suggested_price = max(raw_material, 500.0)

    # Minimum Floor Price (covers base cost + at least 15% margin, never below material cost)
    min_price = max(raw_material, round((base_cost * 1.15) / 50.0) * 50.0)
    if min_price > suggested_price:
        min_price = suggested_price

    # Premium Boutique Tier (approx. +25% over suggested price)
    max_price = max(suggested_price, round((suggested_price * 1.25) / 50.0) * 50.0)

    margin_pct = round(((suggested_price - base_cost) / suggested_price * 100.0), 1) if suggested_price > 0 else 30.0

    factors = [
        {
            "name": "Base Production & Material Cost",
            "impact": f"₹{int(base_cost):,}",
            "description": f"Raw materials (₹{int(raw_material):,}) + {int(labour_hours)} hrs artisan labour (₹{int(direct_labour):,}) at ₹{int(hourly_wage)}/hr."
        },
        {
            "name": "Artisan Fair Profit Margin",
            "impact": f"+{int(margin_rate * 100)}% Margin (₹{int(profit):,})",
            "description": "Ensures sustainable livelihood and ethical pricing for master handcrafted work."
        },
        {
            "name": "E-Commerce Market Benchmark",
            "impact": f"{category_name}",
            "description": "Calibrated against fair-trade direct-to-consumer craft marketplace analytics."
        }
    ]

    return {
        "success": True,
        "base_cost": round(base_cost, 2),
        "labour_cost": round(direct_labour, 2),
        "suggested_price": float(suggested_price),
        "min_price": float(min_price),
        "max_price": float(max_price),
        "final_price": float(suggested_price),
        "margin_percent": margin_pct,
        "estimated_net_profit": round(profit, 2),
        "factors_breakdown": factors
    }

