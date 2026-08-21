"use client";

// 만료되는 사진 하나를 그리는 최소 클라이언트 컴포넌트.
//
// 사진 URL 은 전부 Google 이 서명해 준 lh3.googleusercontent.com / streetviewpixels
// 주소라 서명이 만료되면 403 을 준다. 빌드 시 scripts/validate_photo_urls.py 가
// 죽은 URL 을 걸러내지만 빌드~조회 사이 만료는 막을 수 없다. SupplierCard 는
// 예전부터 onError 로 이걸 감췄는데, 상세 페이지 갤러리·estate 카드 등 나머지
// 6곳은 그대로여서 깨진 이미지 아이콘이 그대로 노출됐다.
//
// onError 는 이벤트 핸들러라 서버 컴포넌트에서 넘길 수 없다. 그래서 이미지
// 하나만 감싸는 클라이언트 경계를 따로 둔다 — 부모 페이지는 서버 컴포넌트로 유지.

export function Photo({
  src,
  alt,
  className,
  sizes,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      sizes={sizes}
      className={className}
      // 부모 컨테이너가 회색/어두운 배경을 이미 깔고 있으므로, 실패한 이미지는
      // 숨기기만 하면 빈 플레이스홀더로 자연스럽게 남는다.
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
