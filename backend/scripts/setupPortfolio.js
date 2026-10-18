const fs=require('fs');const path=require('path');const bcrypt=require('bcryptjs');const db=require('../src/config/db');
async function setup(){try{
  if(process.env.PORTFOLIO_DEMO !== 'true')throw new Error('Demo account setup requires PORTFOLIO_DEMO=true');
  const sql=fs.readFileSync(path.join(__dirname,'portfolio-schema.sql'),'utf8');
  for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await db.query(statement);
  const [columns]=await db.query("SHOW COLUMNS FROM products LIKE 'gallery_images'");
  if(!columns.length)await db.query('ALTER TABLE products ADD COLUMN gallery_images JSON NULL');
  const accounts=[['Portfolio Admin','admin@nexstore.com','Admin@123','admin'],['TechNova Store','seller1@technova.com','Password@123','seller'],['Kwame Asante','kwame@example.com','Password@123','customer']];
  for(const [name,email,password,role] of accounts){const [existing]=await db.query('SELECT id FROM users WHERE email=?',[email]);if(existing.length)continue;const hash=await bcrypt.hash(password,12);await db.query('INSERT INTO users (id,name,email,password_hash,role) VALUES(UUID(),?,?,?,?)',[name,email,hash,role]);}
  const [[seller]]=await db.query('SELECT id FROM users WHERE email=?',['seller1@technova.com']);
  const [[count]]=await db.query('SELECT COUNT(*) AS total FROM products WHERE seller_id=?',[seller.id]);
  if(!count.total){
    const slug='portfolio-campus-desk-lamp';const [existing]=await db.query('SELECT id FROM products WHERE slug=?',[slug]);
    if(!existing.length){const id=require('crypto').randomUUID();const conn=await db.getConnection();try{await conn.beginTransaction();await conn.query('INSERT INTO products (id,name,slug,description,image_url,seller_id) VALUES(?,?,?,?,?,?)',[id,'Campus Desk Lamp',slug,'A warm desk light for study evenings. Portfolio sample listing.','/images/cozy_corner.png',seller.id]);await conn.query('INSERT INTO product_variants (sku,product_id,name,price,compare_price,attributes) VALUES(?,?,?,?,?,?)',['PORTFOLIO-LAMP-WARM',id,'Warm white',85,100,JSON.stringify({color:'Warm white'})]);await conn.query('INSERT INTO inventory (sku,stock,reserved) VALUES(?,25,0)',['PORTFOLIO-LAMP-WARM']);await conn.commit();}catch(error){await conn.rollback();throw error;}finally{conn.release();}}
  }
  console.log('Portfolio schema ready. Missing demo accounts created; existing accounts and data preserved.');
}catch(error){console.error('Portfolio setup failed:',error.code||error.message);process.exitCode=1;}finally{await db.end();}}
setup();
