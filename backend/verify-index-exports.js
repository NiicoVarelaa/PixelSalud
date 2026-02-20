const fs = require("fs");
const path = require("path");

const foldersToCheck = [
  "errors",
  "repositories",
  "services",
  "controllers",
  "routes",
  "schemas",
  "middlewares",
  "helps",
  "utils",
];

let hasErrors = false;

function getJsFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".js") && file !== "index.js")
    .map((file) => file.replace(".js", ""));
}

function getExportsFromIndex(indexPath) {
  if (!fs.existsSync(indexPath)) {
    return [];
  }

  const content = fs.readFileSync(indexPath, "utf8");
  const exportNames = [];

  const regex = /(\w+):\s*require\(['"]\.\/([\w-]+)['"]\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    exportNames.push(match[2]); // match[2] es el nombre del archivo
  }

  return exportNames;
}

function verifyFolder(folderName) {
  const folderPath = path.join(__dirname, folderName);
  const indexPath = path.join(folderPath, "index.js");

  console.log(`\n📁 Verificando /${folderName}/`);

  if (!fs.existsSync(indexPath)) {
    console.log(`   ⚠️  No tiene index.js (opcional)`);
    return;
  }

  const actualFiles = getJsFiles(folderPath);
  const exportedFiles = getExportsFromIndex(indexPath);

  const missing = actualFiles.filter((file) => !exportedFiles.includes(file));

  const obsolete = exportedFiles.filter((file) => !actualFiles.includes(file));

  if (missing.length === 0 && obsolete.length === 0) {
    console.log(
      `   ✅ index.js está completo (${actualFiles.length} archivos)`,
    );
    return;
  }

  hasErrors = true;

  if (missing.length > 0) {
    console.log(`   ❌ Faltan en index.js:`);
    missing.forEach((file) => console.log(`      - ${file}.js`));
  }

  if (obsolete.length > 0) {
    console.log(`   ❌ Obsoletos en index.js (archivo no existe):`);
    obsolete.forEach((file) => console.log(`      - ${file}.js`));
  }
}

console.log("🔍 Verificando archivos index.js...\n");
console.log("=".repeat(60));

foldersToCheck.forEach(verifyFolder);

console.log("\n" + "=".repeat(60));

if (hasErrors) {
  console.log("\n❌ Se encontraron inconsistencias");
  console.log(
    "\n💡 Solución: Actualiza los archivos index.js correspondientes",
  );
  process.exit(1);
} else {
  console.log("\n✅ Todos los index.js están actualizados!");
  process.exit(0);
}
