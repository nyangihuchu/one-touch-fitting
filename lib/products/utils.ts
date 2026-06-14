export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("ko-KR") + "원";
}

export function calcTotalPages(count: number, pageSize: number): number {
  return Math.ceil(count / pageSize);
}

const IMAGE_BASE_URL = 'http://contents.cretec.kr/nctx/resource/SBI_ITEM_IMG/'

export function getProductImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return IMAGE_BASE_URL + imagePath
}
