# AntiFake PWA Installation

## Overview

Front-End hiện có thể được cài như Progressive Web App, không thay đổi website, API hoặc cơ chế đăng nhập. Route hướng dẫn là `/profile/settings` và vẫn nằm trong profile được bảo vệ.

## Completed

- `vite-plugin-pwa` tạo manifest và Workbox service worker với `registerType: autoUpdate`.
- Manifest dùng tên AntiFake, `display: standalone`, start URL/scope `/`, theme/background theo branding.
- Bộ icon 192, 512, maskable 512 và Apple touch icon tái sử dụng favicon AntiFake.
- Service worker chỉ precache app shell/static assets; không cấu hình runtime cache API/private data.
- Trang Settings placeholder được hoàn thiện với trạng thái cài, CTA chủ động, tabs Desktop/Android/iOS, bước đánh số và ảnh hướng dẫn responsive.
- Platform detection ưu tiên `matchMedia('(display-mode: standalone)')`, `navigator.standalone` và feature detection; user-agent chỉ chọn hướng dẫn iOS/browser.
- Menu tài khoản trỏ đúng `/profile/settings`.
- `ProtectedRoute` thử flow `/api/auth/refresh` hiện hữu trước khi chuyển Login khi access token vắng.

## Authentication and Security

- Không tạo login flow riêng, không lưu password/refresh token ở client.
- Backend không đổi: production refresh cookie đã `HttpOnly`, `Secure`, `SameSite=None`, path `/api/auth`; CORS cho phép credentials và origin AntiFake.
- Front-End refresh request hiện có dùng `credentials: include`.
- PWA standalone dùng cùng origin Front-End và API production như browser tab.

## Verification

- `node --test --experimental-strip-types test/*.test.mjs`: 46 passed.
- `npx playwright test e2e/pwa-settings.spec.ts`: 9 passed trên desktop/laptop/mobile projects.
- Targeted ESLint cho toàn bộ file thay đổi: passed.
- `npm run build`: passed; sinh `manifest.webmanifest`, `sw.js`, `registerSW.js`, 17 precache entries.
- Chrome DevTools local production preview: manifest/icon/instruction assets 200, actual `beforeinstallprompt` làm CTA xuất hiện, console sạch khi API header được mock.
- Full repo lint vẫn fail vì 60 lỗi/6 warnings có sẵn ngoài phạm vi.

## Deployment and Device Gates

- Chưa deploy trong task này; production `antifake.io.vn` chưa được xác nhận installable từ revision mới.
- Cần smoke thật sau deploy HTTPS trên Chrome desktop, Edge desktop, Chrome Android và Safari iPhone/iPad.
- Browser tab thông thường không có API đáng tin cậy để biết app đã được cài từ trước; trạng thái chắc chắn khi `appinstalled` xảy ra hoặc app đang chạy standalone.
- Safari iOS không hỗ trợ `beforeinstallprompt`; UI chỉ hướng dẫn Share → Add to Home Screen.
