# Banner Automation

이 프로젝트는 Vercel 배포에 최적화된 [Next.js](https://nextjs.org) 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **린팅**: ESLint
- **배포**: Vercel

## 개발 시작하기

### 1. 종속성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 페이지 수정

`src/app/page.tsx` 파일을 수정하면 자동으로 페이지가 업데이트됩니다.

## 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행 (Turbopack 포함)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 검사
- `npm run lint:fix` - ESLint 자동 수정
- `npm run type-check` - TypeScript 타입 검사
- `npm run analyze` - 번들 크기 분석

## Vercel 배포

### 자동 배포 (권장)

1. [Vercel](https://vercel.com)에 가입하고 GitHub와 연결
2. 이 프로젝트를 GitHub에 푸시
3. Vercel에서 "Import Project" 선택
4. 자동으로 배포되며, 이후 커밋시 자동 재배포

### 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 환경 변수 설정

1. `.env.local` 파일 생성
2. 필요한 환경 변수 추가:

```env
NEXT_PUBLIC_APP_NAME=Banner Automation
NEXT_PUBLIC_APP_URL=your-vercel-url
```

## 프로젝트 특징

- ✅ TypeScript 완전 지원
- ✅ Tailwind CSS v4 사용
- ✅ App Router 구조
- ✅ 성능 최적화 설정
- ✅ 보안 헤더 설정
- ✅ Vercel 배포 최적화
- ✅ 번들 분석 도구 포함

## 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
