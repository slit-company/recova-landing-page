# Recova Landing — Static

Recova 랜딩페이지 정적 빌드 (한/영 토글, FlowSuite 템플릿 기반 Framer hydration 호환).

## 빠른 실행

```bash
python3 scripts/dev_server.py
```

→ `http://localhost:4173` 열기. 우측 하단 **한 / EN** 버튼으로 언어 전환. 선택은 `localStorage`에 저장돼서 다음 방문 때 자동 적용.

기본 언어는 브라우저 `navigator.language` 기준 (`ko-*` → 한국어, 그 외 → 영어).

## 구조

```
recova-landing-static/
├── index.html                  메인 홈페이지
├── about/index.html
├── pricing/index.html
├── features/index.html
├── contact/index.html
├── blogs/                      13개 블로그 포스트
├── career/                     6개 채용 페이지
├── integrations/               10개 통합 페이지
├── privacy-policy/
├── terms-and-conditions/
├── 404/
│
├── assets/
│   ├── i18n.js                 런타임 번역기 + 토글 UI + MutationObserver
│   ├── translations.ko.json    한국어 Recova 카피 (~1000 엔트리)
│   └── translations.en.json    영문 Recova 카피 (~60 엔트리)
│
└── scripts/
    ├── dev_server.py           로컬 dev 서버 (캐시 비활성)
    └── clone_site.py           hide-CSS / i18n 스크립트 자동 주입 유틸
```

## 카피 수정

거의 모든 텍스트는 **HTML이 아니라 JSON 맵에서** 옴.

- 한국어 카피: `assets/translations.ko.json`
- 영문 카피: `assets/translations.en.json`

키 = 원본 Framer 템플릿 영문 텍스트. 값 = Recova 카피.

수정 후 저장만 하면 페이지 새로고침 시 즉시 반영 (dev 서버는 캐시 무효화 헤더 사용).

**왜 HTML을 직접 안 건드리나**: Framer가 컴파일한 React 컴포넌트가 페이지 로드 후 hydration 하면서 HTML 텍스트를 다시 그림. HTML을 바꾸면 hydration mismatch로 카드/애니메이션이 깨짐. `i18n.js`가 hydration 끝난 뒤 MutationObserver로 텍스트만 갈아끼우는 방식.

## 섹션 추가 hide / 스타일 변경

`scripts/clone_site.py`의 `HIDE_STYLE_TAG` 상수에 CSS 룰 추가하고:

```bash
python3 -c "
import sys; sys.path.insert(0,'scripts')
from clone_site import apply_recova_patches
from pathlib import Path
print(apply_recova_patches(Path('.')))
"
```

→ 36개 HTML 전체에 일관되게 재주입.

## 알려진 한계

- **헤더 로고**: PNG 이미지 hide 후 CSS `::after`로 "Recova" 텍스트 인서트. 실제 SVG/PNG 로고가 있으면 `assets/`에 두고 i18n.js를 패치해서 교체 권장.
- **대시보드 목업 이미지**: PNG로 박힌 영문 UI는 텍스트 치환 불가. 별도 Recova 대시보드 mock 필요.
- **헤더 nav 링크**: "요금제"/"블로그" 라벨은 한국어로 보이지만 클릭하면 원본 pricing/blogs 페이지로 이동. 그 페이지들도 Recova 카피로 채워졌으면 자연스럽지만, 카피 누락 부분은 여전히 원본 영문/Recova 한국어 혼재.
- **EN 토글 런타임 전환**: 페이지 로드 직후엔 잘 동작. 한번 토글 후 다시 토글하면 Framer hydration race로 일부 텍스트가 안 바뀔 수 있음. 새로고침하면 정상.

## 배포

순수 정적 HTML이라 어디든 호스팅 가능:

- **Vercel/Netlify**: 폴더 통째 드래그&드롭
- **GitHub Pages**: `gh-pages` 브랜치에 푸시
- **S3 + CloudFront**: 동기화

JS 청크는 `framerusercontent.com` CDN에서 그대로 받음 (페이지 외부 의존). 자체 호스팅하려면 `mirror/` 시절에 받아둔 청크들을 다시 옮겨와야 함.

## 원본 클론 위치

이 폴더는 `/Users/cosmos/Documents/landing-recova/fresh-clone/`에서 mirror/build 잔여물을 제외하고 추출한 것. 원본 Framer 사이트 미러는 그쪽에 보존돼 있음.
