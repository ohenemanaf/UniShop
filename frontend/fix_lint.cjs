const fs = require('fs');
const path = require('path');

function replaceInFile(filepath, replaces) {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  for (const { search, replace } of replaces) {
    content = content.replace(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
  }
}

// 1. AdminProductEdit.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminProductEdit.jsx'), [
  { search: "IconArrowLeft, IconPackage, IconInfoCircle", replace: "IconArrowLeft, IconPackage" },
  { search: "}, [id]);", replace: "}, [id, showToast]);" }
]);

// 2. AdminLayout.jsx
replaceInFile(path.join(__dirname, 'src/components/AdminLayout.jsx'), [
  { search: "const { user, logout } = useAuth();", replace: "const { logout } = useAuth();" }
]);

// 3. Cart.jsx
replaceInFile(path.join(__dirname, 'src/pages/Cart.jsx'), [
  { search: "IconShoppingCart, IconX, IconLock", replace: "IconShoppingCart, IconLock" }
]);

// 4. Contexts (disable react/only-export-components)
const contexts = ['ToastContext.jsx', 'ThemeContext.jsx', 'CartContext.jsx', 'SocketContext.jsx', 'AuthContext.jsx'];
for (const ctx of contexts) {
  replaceInFile(path.join(__dirname, 'src/context', ctx), [
    { search: "export const use", replace: "// eslint-disable-next-line react-refresh/only-export-components\nexport const use" },
    { search: "export function useSocket", replace: "// eslint-disable-next-line react-refresh/only-export-components\nexport function useSocket" }
  ]);
}
// SocketContext missing dep
replaceInFile(path.join(__dirname, 'src/context/SocketContext.jsx'), [
  { search: "}, [isAuthenticated]);", replace: "}, [isAuthenticated, socket]);" }
]);

// 5. BuyerDashboard.jsx
replaceInFile(path.join(__dirname, 'src/pages/BuyerDashboard.jsx'), [
  { search: "IconSettings, IconHeartFilled, IconHeart", replace: "IconSettings, IconHeartFilled" }
]);

// 6. InventoryDashboard.jsx
replaceInFile(path.join(__dirname, 'src/pages/InventoryDashboard.jsx'), [
  { search: "} catch (err) {", replace: "} catch (_err) {" }
]);

// 7. AdminOrders.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminOrders.jsx'), [
  { search: "}, [page, statusFilter]);", replace: "}, [page, statusFilter, fetchOrders]);" }
]);

// 8. PackingSlip.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/PackingSlip.jsx'), [
  { search: "import { useParams, Link }", replace: "import { useParams }" }
]);

// 9. AdminSupport.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminSupport.jsx'), [
  { search: "IconSearch, IconMessage, IconCheck", replace: "IconCheck" }
]);

// 10. App.jsx
replaceInFile(path.join(__dirname, 'src/App.jsx'), [
  { search: "import { IconSparkles } from '@tabler/icons-react';\n", replace: "" }
]);

// 11. AdminUsers.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminUsers.jsx'), [
  { search: "IconMessageCircle, IconCheck, IconX", replace: "IconMessageCircle, IconX" },
  { search: "}, [activeTab]);", replace: "}, [activeTab, fetchData]);" }
]);

// 12. Support.jsx
replaceInFile(path.join(__dirname, 'src/pages/Support.jsx'), [
  { search: "}, []);", replace: "}, [fetchTickets]);" }
]);

// 13. ProductDetail.jsx
replaceInFile(path.join(__dirname, 'src/pages/ProductDetail.jsx'), [
  { search: "} catch (err) {\n      alert('Error updating wishlist');", replace: "} catch (_err) {\n      alert('Error updating wishlist');" },
  { search: "}, [id, isAuthenticated]);", replace: "}, [id, isAuthenticated, navigate]);" }
]);

// 14. SellerProducts.jsx
replaceInFile(path.join(__dirname, 'src/pages/seller/SellerProducts.jsx'), [
  { search: "} catch (err) {\n      alert('Failed to delete", replace: "} catch (_err) {\n      alert('Failed to delete" }
]);

// 15. AdminProducts.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminProducts.jsx'), [
  { search: "IconPlus, IconEdit, IconBox", replace: "IconPlus, IconBox" },
  { search: "}, [page]);", replace: "}, [page, fetchProducts]);" }
]);

// 16. AdminPromos.jsx
replaceInFile(path.join(__dirname, 'src/pages/admin/AdminPromos.jsx'), [
  { search: "} catch (err) {\n      showToast('Failed to load promo codes.", replace: "} catch (_err) {\n      showToast('Failed to load promo codes." },
  { search: "} catch (err) {\n      showToast('Failed to update status.", replace: "} catch (_err) {\n      showToast('Failed to update status." },
  { search: "}, []);", replace: "}, [fetchPromos]);" }
]);

// 17. ProductCard.jsx
replaceInFile(path.join(__dirname, 'src/components/ProductCard.jsx'), [
  { search: "IconHeartFilled, IconShoppingCart, IconPlus", replace: "IconHeartFilled, IconPlus" },
  { search: "} catch (err) {\n      setWishlisted(wasWishlisted);", replace: "} catch (_err) {\n      setWishlisted(wasWishlisted);" }
]);

// 18. Checkout.jsx
replaceInFile(path.join(__dirname, 'src/pages/Checkout.jsx'), [
  { search: "type=\"submit\" \n        type=\"submit\" \n        disabled", replace: "type=\"submit\" \n        disabled" }
]);

console.log('Done fixing lints.');
