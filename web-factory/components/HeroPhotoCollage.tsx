// Multi-photo masonry collage background for hero.
// 5장 grid + dark overlay — Alibaba factory profile vibes.

import { photoUrl } from "@/lib/photoUrl";

type Props = {
  photos: string[];      // 정렬된 사진 URL (앞쪽이 hero)
  // 이 콜라주 전체가 aria-hidden 이라 alt 텍스트는 쓰이지 않는다. 모든 img 를
  // alt="" 로 두면 만료된 사진(403)이 깨진 아이콘 대신 조용히 사라진다.
  ariaLabel?: string;
};

export function HeroPhotoCollage({ photos }: Props) {
  if (!photos.length) return null;
  // up to 5 photos
  const p = photos.slice(0, 5);
  while (p.length < 5) p.push(p[0]);   // 부족하면 첫 사진 반복

  return (
    <div aria-hidden className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-px overflow-hidden">
      {/* big left */}
      <div className="col-span-7 row-span-6 relative bg-stone-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(p[0])} alt="" referrerPolicy="no-referrer"
             className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* top-right */}
      <div className="col-span-5 row-span-3 relative bg-stone-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(p[1])} alt="" referrerPolicy="no-referrer"
             className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* mid-right */}
      <div className="col-span-3 row-span-3 relative bg-stone-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(p[2])} alt="" referrerPolicy="no-referrer"
             className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* bottom-right */}
      <div className="col-span-2 row-span-3 relative bg-stone-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl(p[3])} alt="" referrerPolicy="no-referrer"
             className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}
