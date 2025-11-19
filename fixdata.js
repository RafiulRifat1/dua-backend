
const fs = require('fs');

const pathFile = './data.json';
const raw = fs.readFileSync(pathFile, 'utf8');
let obj = JSON.parse(raw);

// If root is array (not { categories: [...] })
if (Array.isArray(obj) && !obj.categories) {
  obj = { categories: obj };
}

for (const category of obj.categories || []) {

  if (!category.slug && category.name) {
    category.slug = category.name.toLowerCase().replace(/ & /g,'-').replace(/\s+/g,'-');
  }

  if (category.category && !category.subcategories) {
    const inner = category.category;
    category.name = inner.name || category.name;
    category.slug = inner.slug || category.slug;
    category.subcategories = inner.subcategories || inner.subCategories || category.subcategories;
  }

  if (!category.subcategories) category.subcategories = [];

  for (const sub of category.subcategories) {
    if (!sub.slug && sub.name) {
      sub.slug = sub.name.toLowerCase().replace(/\s+/g,'-');
    }

    if (!sub.duas) {
      sub.duas = sub.duas || sub.dua || sub.items || [];
    }

    for (const dua of sub.duas) {

      if (!dua.title && dua.title_en) dua.title = dua.title_en;
      if (!dua.title && dua.name) dua.title = dua.name;

      if (!dua.name && dua.title) {
        dua.name = dua.title.length > 40 ? dua.title.slice(0,40) : dua.title;
      }

      if (!dua.arabic && dua.arabic_text) dua.arabic = dua.arabic_text;

      if (!dua.reference && dua.source_url) dua.reference = dua.source_url;

      if (!dua.slug && dua.title) {
        dua.slug = dua.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g,'-')
          .replace(/^-+|-+$/g,'');
      }

      if (!dua.transliteration) dua.transliteration = "";
      if (!dua.translation) dua.translation = "";
    }
  }
}

fs.writeFileSync('./data.fixed.json', JSON.stringify(obj, null, 2), 'utf8');

console.log('✔ data.fixed.json created successfully!');
