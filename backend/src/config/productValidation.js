function validateVariants(variants) {
  if(!Array.isArray(variants)||!variants.length||variants.length>50)throw new Error('Provide 1–50 variants.');
  const seen=new Set();
  return variants.map(v=>{
    if(!v || typeof v.sku!=='string' || !v.sku.trim() || seen.has(v.sku))throw new Error('Each variant needs a unique SKU.');
    seen.add(v.sku);
    if(typeof v.price!=='number'||!Number.isFinite(v.price)||v.price<=0||v.price>9999999.99||Math.abs(v.price*100-Math.round(v.price*100))>0.000001)throw new Error('Prices must be positive with at most two decimal places.');
    if(!Number.isSafeInteger(v.stock)||v.stock<0)throw new Error('Stock must be a nonnegative whole number.');
    if(v.compare_price!=null && (typeof v.compare_price!=='number'||!Number.isFinite(v.compare_price)||v.compare_price<v.price||v.compare_price>9999999.99||Math.abs(v.compare_price*100-Math.round(v.compare_price*100))>0.000001))throw new Error('Original price must be at least the selling price and have at most two decimal places.');
    if(v.name!=null && (typeof v.name!=='string'||v.name.length>255))throw new Error('Invalid variant name.');
    return {sku:v.sku,name:v.name||null,price:v.price,compare_price:v.compare_price??null,stock:v.stock};
  });
}
module.exports={validateVariants};
