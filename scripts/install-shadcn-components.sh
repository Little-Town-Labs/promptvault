#!/bin/bash
# Install all shadcn/ui components for Prompt Vault
# Run from project root: bash scripts/install-shadcn-components.sh

set -e  # Exit on error

echo "🎨 Installing shadcn/ui components for Prompt Vault"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from project root."
    exit 1
fi

# Initialize shadcn if not already done
if [ ! -f "components.json" ]; then
    echo "📦 Initializing shadcn/ui..."
    echo "   Please select:"
    echo "   - Style: New York"
    echo "   - Color: Zinc"
    echo "   - CSS variables: yes"
    echo ""
    pnpx shadcn@latest init
    echo "✅ shadcn/ui initialized"
    echo ""
else
    echo "✅ shadcn/ui already initialized (components.json exists)"
    echo ""
fi

# Install components in categories
echo "📦 Installing form components..."
pnpx shadcn@latest add button -y
pnpx shadcn@latest add form -y
pnpx shadcn@latest add input -y
pnpx shadcn@latest add textarea -y
pnpx shadcn@latest add label -y
pnpx shadcn@latest add select -y
pnpx shadcn@latest add checkbox -y
pnpx shadcn@latest add radio-group -y
pnpx shadcn@latest add switch -y
echo "✅ Form components installed (9 components)"
echo ""

echo "📦 Installing layout components..."
pnpx shadcn@latest add card -y
pnpx shadcn@latest add separator -y
pnpx shadcn@latest add tabs -y
pnpx shadcn@latest add accordion -y
pnpx shadcn@latest add aspect-ratio -y
pnpx shadcn@latest add scroll-area -y
echo "✅ Layout components installed (6 components)"
echo ""

echo "📦 Installing navigation components..."
pnpx shadcn@latest add dropdown-menu -y
pnpx shadcn@latest add navigation-menu -y
pnpx shadcn@latest add menubar -y
pnpx shadcn@latest add breadcrumb -y
pnpx shadcn@latest add pagination -y
echo "✅ Navigation components installed (5 components)"
echo ""

echo "📦 Installing overlay components..."
pnpx shadcn@latest add dialog -y
pnpx shadcn@latest add alert-dialog -y
pnpx shadcn@latest add sheet -y
pnpx shadcn@latest add popover -y
pnpx shadcn@latest add tooltip -y
pnpx shadcn@latest add context-menu -y
pnpx shadcn@latest add hover-card -y
echo "✅ Overlay components installed (7 components)"
echo ""

echo "📦 Installing data display components..."
pnpx shadcn@latest add table -y
pnpx shadcn@latest add badge -y
pnpx shadcn@latest add avatar -y
pnpx shadcn@latest add skeleton -y
pnpx shadcn@latest add progress -y
pnpx shadcn@latest add alert -y
echo "✅ Data display components installed (6 components)"
echo ""

echo "📦 Installing feedback components..."
pnpx shadcn@latest add sonner -y
echo "✅ Feedback components installed (1 component)"
echo ""

echo "📦 Installing utility components..."
pnpx shadcn@latest add command -y
pnpx shadcn@latest add calendar -y
pnpx shadcn@latest add slider -y
pnpx shadcn@latest add resizable -y
echo "✅ Utility components installed (4 components)"
echo ""

# Count installed components
COMPONENT_COUNT=$(ls -1 src/components/ui/*.tsx 2>/dev/null | wc -l)

echo "=================================================="
echo "✅ Installation complete!"
echo ""
echo "📊 Summary:"
echo "   Total components installed: $COMPONENT_COUNT"
echo "   Location: src/components/ui/"
echo ""
echo "📚 What's installed:"
echo "   ✓ Form components (9)"
echo "   ✓ Layout components (6)"
echo "   ✓ Navigation components (5)"
echo "   ✓ Overlay components (7)"
echo "   ✓ Data display components (6)"
echo "   ✓ Feedback components (1)"
echo "   ✓ Utility components (4)"
echo ""
echo "🎯 Next steps:"
echo "   1. Visit http://localhost:3000/components-test to test"
echo "   2. Read docs/setup/WEEK1_DAY2-4_SHADCN.md for usage"
echo "   3. Continue to Day 5: Create layout components"
echo ""
echo "🎉 Ready to build beautiful UI!"
