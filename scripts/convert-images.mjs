// Конвертирует все .png/.jpg/.jpeg из src/img в .webp (качество 80)
// и удаляет исходные файлы. Запуск: npm run img
import sharp from "sharp";
import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const dir = "src/img";
const exts = /\.(png|jpe?g)$/i;

for (const file of readdirSync(dir)) {
  if (!exts.test(file)) continue;
  const src = join(dir, file);
  const out = join(dir, file.replace(exts, ".webp"));
  await sharp(src).webp({ quality: 80 }).toFile(out);
  unlinkSync(src);
  console.log(`${file} -> ${out.replace(dir + "/", "")}`);
}
console.log("Готово! Не забудь обновить ссылки в html/scss/js на .webp");
