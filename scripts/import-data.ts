import * as dotenv from "dotenv";
import * as xlsx from "xlsx";
import { createClient } from "@supabase/supabase-js";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정하세요.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function toInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
}

function toStr(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

async function importResearchProducts() {
  const filePath = path.resolve(__dirname, "../researchproduct.xlsx");
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws) as Record<string, unknown>[];

  console.log(`📦 research_products 데이터 ${rows.length}건 파싱 완료`);

  const mapped = rows.map((row) => ({
    sales_management_sku: toStr(row["판매관리SKU"]),
    category: toStr(row["카테고리"]),
    product_name: toStr(row["대표상품명"]),
    model: toStr(row["모델"]),
    tube_spec: toStr(row["튜브규격"]),
    thread_spec: toStr(row["나사규격"]),
    shape: toStr(row["형태"]),
    recommended_use: toStr(row["추천용도"]),
    option_name: toStr(row["옵션명"]),
    sales_strategy: toStr(row["판매전략"]),
    keywords: toStr(row["키워드"]),
    reference_url: toStr(row["참조URL"]),
  }));

  const chunks = chunkArray(mapped, 100);
  let inserted = 0;

  for (const chunk of chunks) {
    const { error } = await supabase.from("research_products").insert(chunk);
    if (error) {
      console.error("❌ research_products insert 오류:", error.message);
      process.exit(1);
    }
    inserted += chunk.length;
    console.log(`  ✅ research_products ${inserted}/${mapped.length}건 적재`);
  }

  console.log(`🎉 research_products 총 ${inserted}건 적재 완료`);
}

async function importMyProducts() {
  const filePath = path.resolve(__dirname, "../myproduct.xlsx");
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws) as Record<string, unknown>[];

  console.log(`📦 my_products 데이터 ${rows.length}건 파싱 완료`);

  const mapped = rows.map((row) => ({
    category: toStr(row["카테고리"]),
    product_name: toStr(row["대표상품명"]),
    model: toStr(row["모델"]),
    tube_spec: toStr(row["튜브규격"]),
    thread_spec: toStr(row["나사규격"]),
    shape: toStr(row["형태"]),
    recommended_use: toStr(row["추천용도"]),
    option_name: toStr(row["옵션명"]),
    summary_description: toStr(row["상품 요약설명"]),
    detail_description: toStr(row["상품 상세설명"]),
    search_keywords: toStr(row["검색어설정"]),
    consumer_price: toInt(row["소비자가"]),
    supply_price: toInt(row["공급가"]),
    sale_price: toInt(row["판매가"]),
    image_path: toStr(row["이미지등록(상세)"]),
  }));

  const chunks = chunkArray(mapped, 100);
  let inserted = 0;

  for (const chunk of chunks) {
    const { error } = await supabase.from("my_products").insert(chunk);
    if (error) {
      console.error("❌ my_products insert 오류:", error.message);
      process.exit(1);
    }
    inserted += chunk.length;
    console.log(`  ✅ my_products ${inserted}/${mapped.length}건 적재`);
  }

  console.log(`🎉 my_products 총 ${inserted}건 적재 완료`);
}

async function main() {
  console.log("🚀 데이터 적재 시작...\n");
  await importResearchProducts();
  console.log();
  await importMyProducts();
  console.log("\n✅ 모든 데이터 적재 완료!");
}

main().catch((err) => {
  console.error("❌ 오류 발생:", err);
  process.exit(1);
});
