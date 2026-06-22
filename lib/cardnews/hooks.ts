/* 제품 모델코드(PC/PL/PB/PY/PWT)별 기본 훅 문구 */

const HOOK_MAP: Record<string, { line1: string; line2: string; problem: string; solution: string }> = {
  PC: {
    line1: '4mm 호스 연결,',
    line2: '뭘 써야 할까?',
    problem: '배관 연결 부품 선택이 어렵습니다',
    solution: `PC 타입으로 해결`,
  },
  PL: {
    line1: '좁은 공간에서',
    line2: '배관 연결이 어렵다면?',
    problem: '직선 배관으로는 공간이 부족합니다',
    solution: '90도 엘보 구조로 해결',
  },
  PB: {
    line1: '배관 방향을',
    line2: '바꿔야 한다면?',
    problem: '배관 방향 변경이 필요한 상황',
    solution: 'PB 엘보 타입으로 해결',
  },
  PY: {
    line1: '호스를 분기해야',
    line2: '한다면?',
    problem: '한 라인을 두 방향으로 분기해야 합니다',
    solution: 'PY 분기 타입으로 해결',
  },
  PWT: {
    line1: '두 방향을 동시에',
    line2: '연결해야 한다면?',
    problem: 'T자 연결이 필요한 배관 작업',
    solution: 'PWT 타입으로 해결',
  },
  PT: {
    line1: '세 방향 배관 연결,',
    line2: '한 번에 해결하려면?',
    problem: 'T자 분기 연결이 복잡합니다',
    solution: 'PT 티 타입으로 해결',
  },
  PST: {
    line1: '부식 걱정 없이',
    line2: 'T자 배관이 필요하다면?',
    problem: '일반 피팅은 부식 환경에서 버티지 못합니다',
    solution: 'PST 스테인리스 티 타입으로 해결',
  },
  PUC: {
    line1: '나사 없이 호스끼리',
    line2: '연결해야 한다면?',
    problem: '나사산 없이 호스와 호스를 연결해야 합니다',
    solution: 'PUC 유니온 타입으로 해결',
  },
}

const DEFAULT_HOOK = {
  line1: '공압 피팅 선택,',
  line2: '이렇게 하세요',
  problem: '배관 작업에서 부품 선택이 어렵습니다',
  solution: 'SUPERFIX 원터치 피팅으로 해결',
}

/* 모델명 앞 2-3자를 파싱해 제품 타입 코드 반환 */
export function detectProductType(model: string | null | undefined): string {
  if (!model) return ''
  const upper = model.toUpperCase()
  if (upper.startsWith('PWT')) return 'PWT'
  if (upper.startsWith('PST')) return 'PST'
  if (upper.startsWith('PUC')) return 'PUC'
  if (upper.startsWith('PL')) return 'PL'
  if (upper.startsWith('PB')) return 'PB'
  if (upper.startsWith('PY')) return 'PY'
  if (upper.startsWith('PT')) return 'PT'
  if (upper.startsWith('PC')) return 'PC'
  return ''
}

/* 타입별 기본 훅 반환 */
export function getDefaultHook(model: string | null | undefined): {
  line1: string
  line2: string
  problem: string
  solution: string
} {
  const type = detectProductType(model)
  return HOOK_MAP[type] ?? DEFAULT_HOOK
}
