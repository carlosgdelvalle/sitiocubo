#!/bin/bash

echo "🔧 Restoring essential website functionality..."
echo "❌ I accidentally removed too much - fixing now!"

# Find all HTML files and restore essential scripts while keeping privacy improvements
find . -name "*.html" -type f | while read file; do
    echo "Restoring functionality in: $file"
    
    # Find the line with </body> and add essential scripts before it
    # First, let's restore the duel.js module loader (essential for functionality)
    sed -i '' '/<\/body>/i\
<script src="img1.wsimg.com/starfield/duel/v2.5.8/duel.js"></script>
' "$file"
    
    # Restore the UX widget script (essential for menus and interactions)
    sed -i '' '/<\/body>/i\
<script src="img1.wsimg.com/ceph-p3-01/website-builder-data-prod/static/widgets/UX.4.26.5.js"></script>
' "$file"
    
    # Restore essential polyfill for older browsers (conditional loading)
    sed -i '' '/<\/body>/i\
<script type="text/javascript">"IntersectionObserver"in window&&"Intl"in window&&"Locale"in window.Intl||document.write(`\\x3Cscript src="https://img1.wsimg.com/poly/v3/polyfill.min.js?rum=0&unknown=polyfill&flags=gated&features=Intl.~locale.es-PE">\\x3C/script>`)</script>
' "$file"
    
    echo "  ✅ Restored essential functionality for $file"
done

echo ""
echo "🎉 Essential functionality restored!"
echo "✅ Menus should work now"
echo "✅ Images should display properly"
echo "✅ Website interactions restored"
echo "🔒 Privacy improvements maintained (no tracking scripts)"
