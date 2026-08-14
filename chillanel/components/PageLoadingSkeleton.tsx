import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

// 네비게이션과 프리렌더된 페이지가 보이기까지의 찰나에 흰 화면 대신 띄우는
// 안전망. 대부분의 대상 페이지가 장소 그리드라 PlaceCardSkeleton 격자를 쓴다.
//
// 왜 컴포넌트로 뺐나 (2026-08-10): 원래 app/[lang]/loading.tsx 하나였는데,
// 그 Suspense 경계가 place/[id] 의 soft 404 를 유발했다. place/[id] 는
// dynamicParams=true 라 요청 시 렌더되는데, 경계가 있으면 셸이 200 으로 먼저
// 나가고 notFound() 는 스트림 안에서만 그려진다(로컬 프로덕션 빌드로 실측).
// 그래서 경계를 [lang] 루트에서 걷어내고, dynamicParams=false 인 정적
// 세그먼트에만 loading.tsx 를 두어 이 컴포넌트를 재사용한다.
// place/[id] 위에는 절대 두지 말 것.
export function PageLoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
      <div className="h-8 w-48 bg-border/40 rounded animate-pulse mb-8" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
