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

replaceInFile(path.join(__dirname, 'src/pages/seller/SellerProducts.jsx'), [
  { search: "} catch (_err) {", replace: "} catch {" }
]);

replaceInFile(path.join(__dirname, 'src/pages/admin/AdminOrders.jsx'), [
  { search: "}, [page, statusFilter, fetchOrders]);", replace: "// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [page, statusFilter]);" }
]);

replaceInFile(path.join(__dirname, 'src/pages/admin/AdminPromos.jsx'), [
  { search: "} catch (_err) {\n      showToast('Failed to load promo codes.', 'error');", replace: "} catch {\n      showToast('Failed to load promo codes.', 'error');" },
  { search: "} catch (_err) {\n      showToast('Failed to update status.', 'error');", replace: "} catch {\n      showToast('Failed to update status.', 'error');" },
  { search: "}, [fetchPromos]);", replace: "// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);" }
]);

replaceInFile(path.join(__dirname, 'src/components/ProductCard.jsx'), [
  { search: "} catch (_err) {", replace: "} catch {" }
]);

replaceInFile(path.join(__dirname, 'src/pages/admin/AdminProducts.jsx'), [
  { search: "}, [page, fetchProducts]);", replace: "// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [page]);" }
]);

replaceInFile(path.join(__dirname, 'src/components/Navbar.jsx'), [
  { search: "IconUser, IconMenu2", replace: "IconMenu2" }
]);

replaceInFile(path.join(__dirname, 'src/pages/ProductDetail.jsx'), [
  { search: "} catch (_err) {", replace: "} catch {" }
]);

replaceInFile(path.join(__dirname, 'src/pages/admin/AdminUsers.jsx'), [
  { search: "}, [activeTab, fetchData]);", replace: "// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [activeTab]);" }
]);

replaceInFile(path.join(__dirname, 'src/pages/Checkout.jsx'), [
  { search: "IconLock, IconAlertTriangle", replace: "IconAlertTriangle" },
  { search: "function CheckoutFormWrapper({ clientSecret, grandTotal, onSuccess, onError, form, appliedPromo }) {", replace: "function CheckoutFormWrapper({ grandTotal, onSuccess, onError }) {" },
  { search: "} catch (err) {\n      setError('Failed to initialize payment.');", replace: "} catch {\n      setError('Failed to initialize payment.');" },
  { search: "clientSecret={clientSecret} \n                            grandTotal={grandTotal}\n                            onSuccess={handleOrderCreation}\n                            onError={setError}\n                            form={form}\n                            appliedPromo={appliedPromo}", replace: "grandTotal={grandTotal}\n                            onSuccess={handleOrderCreation}\n                            onError={setError}" }
]);
