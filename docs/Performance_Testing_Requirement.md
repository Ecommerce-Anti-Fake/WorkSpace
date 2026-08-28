# Performance Testing Requirement

## 1. Thông tin dự án

Dự án AntiFake gồm hai repository:

- Frontend: https://github.com/Ecommerce-Anti-Fake/Front-End
- Backend: https://github.com/Ecommerce-Anti-Fake/Back-End
- Môi trường production: https://antifake.io.vn

Tài liệu này là yêu cầu bắt buộc để Codex đọc, phân tích, kiểm thử và tối ưu hiệu năng toàn bộ hệ thống AntiFake dựa trên source code hiện có.

Không chỉ kiểm tra trang chủ. Phải bao phủ toàn bộ role, module, flow, endpoint, Prisma query, bảng dữ liệu, cache, connection pool và các thành phần realtime đang tồn tại trong source code.

---

## 2. Mục tiêu

Codex phải:

1. Đọc và đối chiếu toàn bộ frontend và backend.
2. Tự xác định tất cả role, màn hình, luồng nghiệp vụ và API.
3. Lập bản đồ:
   - Frontend page/flow
   - Frontend service/hook
   - API endpoint
   - API Gateway
   - Microservice
   - Controller
   - Service
   - Prisma query
   - Database table/index
4. Chạy test thật trên môi trường production ở mức an toàn.
5. Chạy benchmark và load test mạnh trên local hoặc staging.
6. Tìm điểm nghẽn về:
   - API
   - Prisma query
   - PostgreSQL
   - Cache
   - Connection pool
   - Realtime
   - Payload
   - Pagination
   - Search/filter
   - Dashboard aggregate
7. Tối ưu dựa trên số liệu thực tế.
8. Chạy regression test sau mỗi nhóm thay đổi.
9. Tạo báo cáo trước và sau khi tối ưu.
10. Chia thay đổi thành commit nhỏ, dễ review và rollback.

---

## 3. Nguyên tắc bắt buộc

- Không tối ưu theo cảm tính.
- Không thêm Redis để che một query database đang chậm hoặc sai thiết kế.
- Phải đo trước, sửa sau, rồi đo lại.
- Không thay đổi nghiệp vụ nếu không thật sự cần thiết.
- Không làm vỡ API contract đang được frontend sử dụng.
- Nếu buộc phải thay API contract:
  - cập nhật frontend đồng bộ;
  - cập nhật test;
  - ghi migration note;
  - giữ backward compatibility nếu có thể.
- Không sửa toàn hệ thống trong một commit duy nhất.
- Không tự merge hoặc deploy production trước khi hoàn tất báo cáo và yêu cầu review.
- Không chạy destructive test trên production.
- Không thực hiện thanh toán thật, hoàn tiền thật, xóa dữ liệu thật hoặc thay đổi quyền quản trị ngoài phạm vi an toàn.
- Dùng account seed và dữ liệu test đã có.
- Không log:
  - access token;
  - refresh token;
  - mật khẩu;
  - dữ liệu KYC;
  - thông tin thanh toán nhạy cảm;
  - toàn bộ request body chứa dữ liệu riêng tư.
- Không chạy tải mạnh trên production.
- Production chỉ được smoke test nhẹ, giới hạn và an toàn.
- Không over-engineer bằng Kubernetes, sharding hoặc read replica nếu chưa có bằng chứng cần thiết.
- Mọi đề xuất phải được phân loại:
  1. cần làm ngay;
  2. nên làm khi traffic tăng;
  3. chưa cần ở quy mô hiện tại.

---

## 4. Giả định tải và khả năng mở rộng

Không chỉ tối ưu cho lượng truy cập hiện tại.

### 4.1. Giai đoạn hiện tại

- 10–20 người dùng đồng thời.
- 20–100 request/giây.
- Dữ liệu production hiện có và dữ liệu seed.

### 4.2. Giai đoạn tăng trưởng gần

- 100–300 người dùng đồng thời.
- 200–500 request/giây.
- Hàng trăm nghìn:
  - product;
  - offer;
  - user;
  - order;
  - notification.
- Hàng triệu:
  - chat message;
  - affiliate click;
  - provenance event;
  - social interaction;
  - audit log.

### 4.3. Giai đoạn tải cao

- 500–1.000 người dùng đồng thời.
- Traffic tăng đột biến trong:
  - Flash Sale;
  - livestream;
  - campaign affiliate;
  - chiến dịch xác thực QR;
  - thời điểm seller/admin xử lý nhiều đơn.
- Nhiều request đồng thời tới:
  - catalog;
  - cart;
  - checkout;
  - order;
  - chat;
  - notification;
  - livestream;
  - dashboard.

### 4.4. Yêu cầu đánh giá khả năng mở rộng

Phải kiểm tra:

- API Gateway;
- từng microservice;
- Prisma connection pool;
- PostgreSQL max_connections;
- Redis;
- WebSocket;
- SSE;
- background job;
- queue hoặc message broker nếu có;
- cache invalidation;
- rate limit;
- session/state khi chạy nhiều instance;
- storage/media delivery;
- idempotency;
- retry;
- timeout;
- circuit breaker nếu có.

Mỗi đề xuất phải chỉ rõ ngưỡng nào thì cần triển khai.

---

## 5. Giai đoạn 1 — Đọc source code và lập bản đồ hệ thống

### 5.1. Frontend

Đọc toàn bộ:

- router;
- route;
- page;
- layout;
- auth guard;
- role guard;
- service API;
- hook;
- store;
- context;
- component;
- pagination;
- search;
- filter;
- realtime;
- upload;
- error state;
- loading state;
- empty state.

### 5.2. Backend

Đọc toàn bộ:

- API Gateway;
- microservice;
- controller;
- service;
- DTO;
- guard;
- interceptor;
- middleware;
- exception filter;
- Prisma schema;
- migration;
- seed;
- Redis/cache;
- event;
- queue;
- message broker;
- SSE;
- WebSocket;
- cron;
- background task;
- Docker;
- PM2;
- Nginx hoặc cấu hình production liên quan;
- environment sample;
- health check;
- metrics.

### 5.3. Lập bản đồ flow

Tạo bảng ánh xạ:

```text
Frontend page/flow
→ frontend service/hook
→ API endpoint
→ API Gateway
→ microservice
→ controller
→ service
→ Prisma query
→ database table/index
→ response field frontend sử dụng
```

### 5.4. Liệt kê role

Tự xác định role thực tế từ source code, ví dụ:

- guest;
- buyer/user;
- seller/shop;
- affiliate;
- admin;
- moderator;
- các role khác nếu tồn tại.

### 5.5. Liệt kê module và endpoint

Phải kiểm tra tối thiểu:

- auth;
- user/profile;
- address;
- KYC/identity;
- shop;
- catalog;
- category;
- brand;
- product;
- offer;
- variant;
- inventory;
- cart;
- checkout;
- order;
- payment;
- wallet;
- affiliate;
- QR;
- verification;
- provenance;
- distribution;
- chat;
- notification;
- social/community;
- report;
- dispute;
- moderation;
- livestream;
- dashboard;
- statistics;
- admin;
- upload/media;
- các module khác có trong code.

### 5.6. Thông tin cần ghi cho mỗi endpoint

- Method.
- URL.
- Role được phép gọi.
- Frontend nào đang gọi.
- Microservice xử lý.
- Bảng database liên quan.
- Prisma query liên quan.
- Có pagination hay không.
- Có filter/search/orderBy hay không.
- Có cache hay không.
- Payload response.
- Tần suất gọi.
- Mức độ quan trọng.
- Rủi ro hiệu năng.

### 5.7. Đầu ra bắt buộc

Tạo:

- `docs/performance/system-flow-map.md`
- `docs/performance/api-inventory.md`
- `docs/performance/database-query-map.md`
- `docs/performance/performance-test-plan.md`

Không sửa code trước khi hoàn thành bản đồ và kế hoạch.

---

## 6. Giai đoạn 2 — Thiết lập đo đạc

### 6.1. Kiểm tra hệ thống hiện có

Xác định backend đã có hay chưa:

- request ID;
- correlation ID;
- structured logging;
- timing interceptor;
- Prisma query logging;
- slow query logging;
- health endpoint;
- metrics endpoint;
- tracing giữa API Gateway và microservice.

### 6.2. Nếu chưa có, bổ sung đo đạc

Đo:

- thời gian toàn request;
- thời gian tại API Gateway;
- thời gian tại microservice;
- thời gian service;
- thời gian từng Prisma query;
- số query trong một request;
- kích thước response;
- status code;
- error;
- timeout;
- retry;
- cache hit/miss;
- DB connection;
- request correlation.

### 6.3. Threshold ban đầu

- Query trên 200 ms: warning.
- API thông thường trên 500 ms: warning.
- API phức tạp trên 1.000 ms: warning.
- Payload danh sách trên 500 KB: warning.
- Payload chi tiết trên 1 MB: warning.
- Transaction trên 1 giây: warning.
- Request lặp bất thường trong cùng flow: warning.

### 6.4. Công cụ

Ưu tiên sử dụng:

- `pg_stat_statements`;
- `EXPLAIN (ANALYZE, BUFFERS)`;
- Prisma query event;
- Playwright;
- autocannon hoặc k6;
- Chrome Network/Performance khi cần đối chiếu frontend;
- htop/glances;
- PostgreSQL activity và lock view;
- Redis metrics nếu có.

### 6.5. Baseline

Phải tạo baseline trước khi tối ưu:

- p50;
- p95;
- p99;
- request/second;
- error rate;
- timeout rate;
- query count/request;
- DB execution time;
- response payload;
- CPU;
- RAM;
- swap;
- DB connections;
- Redis hit/miss;
- event loop delay nếu có;
- memory growth.

Lưu tại:

- `docs/performance/baseline-report.md`
- `artifacts/performance/baseline/`

---

## 7. Giai đoạn 3 — Test toàn bộ luồng nghiệp vụ

### 7.1. Đọc seed

Tự tìm:

- account;
- role;
- password;
- dữ liệu mẫu;
- shop;
- product;
- order;
- livestream;
- affiliate;
- KYC;
- admin.

### 7.2. Test production an toàn

Môi trường:

- `https://antifake.io.vn`

Dùng Playwright hoặc test hiện có.

### 7.3. Guest flow

Kiểm tra:

- mở trang chủ;
- category;
- search;
- filter;
- product detail;
- shop detail;
- livestream;
- community;
- public QR verification;
- các trang public khác.

### 7.4. Buyer flow

Kiểm tra:

- đăng nhập;
- profile;
- address;
- KYC;
- search/filter;
- product detail;
- add cart;
- update cart;
- checkout quote;
- đặt đơn test an toàn;
- order list/detail;
- cancel nếu hợp lệ;
- chat;
- notification;
- report/dispute;
- favorite/follow;
- affiliate nếu buyer có quyền.

### 7.5. Seller flow

Kiểm tra:

- dashboard;
- shop profile;
- product;
- offer;
- variant;
- inventory;
- order;
- promotion/voucher nếu có;
- QR/label;
- provenance;
- distribution;
- livestream;
- chat;
- notification;
- statistics.

### 7.6. Affiliate flow

Kiểm tra:

- dashboard;
- link/campaign;
- click tracking;
- conversion;
- commission;
- withdrawal nếu có flow test an toàn.

### 7.7. Admin/Moderator flow

Kiểm tra:

- user;
- KYC;
- shop approval;
- catalog moderation;
- report;
- dispute;
- livestream moderation;
- payment/order monitoring;
- dashboard;
- config;
- role/permission.

### 7.8. Dữ liệu cần ghi ở mỗi flow

- API được gọi.
- Thứ tự API.
- API gọi lặp.
- Request tuần tự có thể song song.
- Duration.
- Payload.
- Query count.
- Error 4xx/5xx.
- Timeout.
- Redirect không cần thiết.
- API trả dữ liệu dư.
- API thiếu pagination.
- N+1.
- UI chờ một API quá lâu.
- Loading state bất hợp lý.
- Cache stale.
- Realtime reconnect bất thường.

### 7.9. Endpoint không được frontend gọi

- Đánh dấu dead endpoint.
- Không xóa nếu chưa xác minh.
- Ghi rõ nguồn tham chiếu và mức độ tin cậy.

### 7.10. Đầu ra

- `docs/performance/flow-test-results.md`
- `docs/performance/endpoint-performance-matrix.md`

---

## 8. Giai đoạn 4 — Phân tích query và database

Kiểm tra toàn bộ Prisma query.

### 8.1. Các vấn đề cần phát hiện

- `include` quá rộng;
- `select` chưa tối ưu;
- lấy toàn object nhưng frontend chỉ dùng vài field;
- N+1 query;
- query trong vòng lặp;
- nhiều `findUnique` hoặc `findFirst` chạy tuần tự;
- `count` và `findMany` chạy tuần tự;
- transaction kéo dài;
- network call bên trong transaction;
- nested relation quá sâu;
- offset pagination ở trang sâu;
- search `contains` không có chiến lược index;
- `orderBy` trên cột chưa index;
- filter status/time thiếu composite index;
- foreign key thường join nhưng thiếu index;
- count lớn chạy ở mỗi request;
- aggregate/dashboard query quá nặng;
- query lặp trong cùng request;
- API Gateway và service cùng lấy trùng dữ liệu;
- media/review/chat/reaction không giới hạn;
- pageSize không có giới hạn;
- lọc dữ liệu trong JavaScript thay vì database;
- lấy dữ liệu rồi mới sort trong memory;
- transaction isolation không phù hợp;
- lock contention;
- stale statistics;
- unused index;
- sequential scan trên bảng lớn.

### 8.2. Với từng query nghi vấn

Phải:

1. Xác định endpoint và flow gọi.
2. Ghi SQL tương đương.
3. Chạy:
   - `EXPLAIN (ANALYZE, BUFFERS)`.
4. Ghi:
   - planning time;
   - execution time;
   - scan type;
   - rows;
   - rows removed by filter;
   - buffers;
   - sort;
   - memory;
   - index sử dụng;
   - lock hoặc wait nếu có.

### 8.3. Module ưu tiên kiểm tra

- offers/products/categories/brands;
- shops/users/KYC;
- carts/cart_items;
- orders/order_items/order_status;
- payments/wallet transactions;
- QR labels;
- verification;
- provenance;
- affiliate click/conversion/commission;
- chat rooms/messages;
- notifications;
- social posts/comments/likes/replies;
- reports/disputes;
- livestream sessions/reactions/viewers;
- dashboard aggregate.

---

## 9. Giai đoạn 5 — Tối ưu query

Thực hiện từng module, không sửa đồng loạt.

### 9.1. Các loại thay đổi được phép

- thay `include` bằng `select`;
- chỉ trả field frontend sử dụng;
- `Promise.all` cho query độc lập;
- loại bỏ N+1;
- batch query;
- giới hạn nested relation;
- pagination;
- pageSize cap;
- cursor pagination;
- denormalized counter khi count realtime quá đắt;
- precomputed aggregate;
- materialized strategy nếu phù hợp;
- transaction ngắn hơn;
- loại bỏ network call trong transaction;
- tái sử dụng kết quả query trong cùng request;
- filter/sort trực tiếp tại DB;
- tránh serialize object quá lớn;
- giảm payload.

### 9.2. Bắt buộc với mỗi nhóm thay đổi

- benchmark trước;
- diff;
- test;
- benchmark sau;
- rollback plan;
- commit riêng.

---

## 10. Giai đoạn 6 — Index

### 10.1. Nguyên tắc

- Chỉ thêm index dựa trên query đã đo.
- Không thêm index tràn lan.
- Không tạo index trùng.
- Kiểm tra schema và index thật trong DB.
- Đánh giá tác động:
  - insert;
  - update;
  - disk;
  - migration time;
  - vacuum;
  - bloat.

### 10.2. Loại index cần xem xét

- status + createdAt;
- shopId + status + createdAt;
- userId + createdAt;
- orderId + status;
- roomId + createdAt;
- recipientId + readAt + createdAt;
- livestream status + scheduledAt;
- affiliateId + createdAt;
- QR code/value unique lookup;
- foreign key thường join;
- index hỗ trợ search nếu thật sự cần.

### 10.3. Partial index

Nếu cần partial index PostgreSQL mà Prisma schema không biểu diễn tốt:

- dùng raw SQL migration;
- giải thích rõ;
- kiểm tra khả năng rollback;
- ghi chú deploy.

### 10.4. Sau migration

- chạy EXPLAIN lại;
- lưu query plan trước/sau;
- benchmark read;
- benchmark insert/update nếu index nhiều.

---

## 11. Giai đoạn 7 — Cache

Chỉ triển khai sau khi query và index đã ổn.

### 11.1. Kiểm tra hệ thống cache hiện có

- Redis;
- cache-manager;
- in-memory cache;
- API Gateway cache;
- HTTP cache;
- CDN cache.

Không tạo hệ thống cache thứ hai nếu không cần.

### 11.2. Nhóm dữ liệu phù hợp cache

#### Public/reference cache

- category;
- brand;
- public shop summary;
- public product detail;
- public offer detail;
- homepage section;
- public livestream list.

#### Aggregate cache ngắn hạn

- dashboard;
- statistics;
- counts;
- ranking;
- recommendation;
- trending.

#### Realtime state

- livestream viewer count;
- presence;
- rate limit;
- session;
- notification counters nếu kiến trúc phù hợp.

### 11.3. Dữ liệu không nên cache hoặc phải rất thận trọng

- cart;
- wallet balance;
- payment state;
- KYC content;
- role/permission;
- order mutation result;
- private user data;
- unread notification;
- dữ liệu thay đổi tức thời.

### 11.4. Cache strategy

- cache-aside;
- namespace;
- versioned key;
- TTL;
- TTL jitter;
- graceful fallback khi Redis down;
- cache stampede protection;
- không dùng `KEYS` trong production;
- dùng `SCAN`;
- không cache lỗi 4xx/5xx;
- không dùng shared cache key cho dữ liệu riêng tư;
- không để Redis lỗi làm API chết.

### 11.5. TTL gợi ý ban đầu

- category/brand: 30–60 phút;
- public shop/product detail: 1–5 phút;
- public list: 30–120 giây;
- dashboard: 15–60 giây;
- livestream list: 5–20 giây;
- config/reference: 1–6 giờ.

Điều chỉnh theo source code và tần suất cập nhật thực tế.

### 11.6. Invalidation

Phải xác định mutation nào làm mất hiệu lực cache:

- offer create/update/delete/status;
- product/category/brand update;
- shop approval/update;
- order/payment transition;
- livestream status;
- social moderation;
- notification state;
- dashboard cache.

Tạo ma trận:

```text
Mutation
→ cache key bị ảnh hưởng
→ cách invalidate
→ fallback nếu invalidate thất bại
```

Đầu ra:

- `docs/performance/cache-key-map.md`

---

## 12. Giai đoạn 8 — Connection pool và hạ tầng database

### 12.1. Kiểm tra Prisma

- mỗi microservice có bao nhiêu PrismaClient;
- có tạo client theo request không;
- connection_limit;
- pool_timeout;
- idle connection;
- connection leak;
- tổng connection toàn hệ thống.

### 12.2. PostgreSQL

Kiểm tra:

- max_connections;
- pg_stat_activity;
- idle in transaction;
- long transaction;
- blocked query;
- lock;
- deadlock;
- vacuum/analyze;
- table bloat;
- index bloat;
- pg_stat_user_indexes;
- unused index;
- sequential scan;
- database region;
- network latency;
- TLS/DNS overhead.

### 12.3. PgBouncer

Đánh giá có cần PgBouncer hay không.

Không triển khai nếu chưa có bằng chứng.

Phải chỉ rõ:

- tổng connection hiện tại;
- connection peak;
- ngưỡng cần PgBouncer;
- pool mode phù hợp;
- rủi ro với Prisma transaction.

### 12.4. Thay đổi config

Không thay PostgreSQL production tùy tiện.

Mọi thay đổi phải có:

- giá trị cũ;
- giá trị mới;
- lý do;
- tác động RAM;
- tác động throughput;
- cách rollback.

---

## 13. Giai đoạn 9 — Kiểm tra quy mô dữ liệu

Không đánh giá query chỉ bằng seed nhỏ.

### 13.1. Dataset benchmark tối thiểu trên local/staging

- 100.000 offers;
- 50.000 products;
- 20.000 users;
- 100.000 orders;
- 1.000.000 order items hoặc event;
- 1.000.000 notifications/messages;
- dữ liệu lớn tương ứng cho affiliate/provenance/social nếu phù hợp.

Không đưa dataset benchmark lên production.

### 13.2. Kiểm tra lại

- pagination sâu;
- cursor pagination;
- search;
- filter nhiều điều kiện;
- count;
- aggregate;
- dashboard;
- notification list;
- chat history;
- affiliate tracking;
- provenance history;
- livestream analytics.

So sánh query plan khi dữ liệu nhỏ và lớn.

---

## 14. Giai đoạn 10 — Load test

### 14.1. Nguyên tắc

- Tải mạnh chỉ chạy trên local/staging.
- Production chỉ smoke test nhẹ.
- Không làm gián đoạn người dùng thật.
- Không test payment thật.
- Không phá dữ liệu.

### 14.2. Workload public

- home;
- search;
- product detail;
- shop detail;
- category;
- livestream list;
- public verification.

### 14.3. Workload authenticated

- profile;
- notification;
- cart;
- order list/detail;
- chat list/messages;
- KYC status;
- affiliate dashboard nếu có.

### 14.4. Workload seller/admin

- dashboard;
- product management;
- offer management;
- order management;
- statistics;
- moderation.

### 14.5. Các mức tải

#### Mức 1 — Baseline

- 1 user;
- 5 concurrent;
- 30 giây.

#### Mức 2 — Normal

- 20 concurrent;
- 2 phút.

#### Mức 3 — Growth

- 50 concurrent;
- 5 phút.

#### Mức 4 — Peak

- 100 concurrent;
- 5 phút.

#### Mức 5 — Burst

- tăng từ 10 lên 100 concurrent trong thời gian ngắn;
- mô phỏng Flash Sale hoặc livestream.

#### Mức mở rộng

Nếu staging đủ tài nguyên:

- 200–300 concurrent.

Không chạy mức này trên production nếu chưa được phép.

### 14.6. Chỉ số đo

- p50;
- p95;
- p99;
- throughput;
- error rate;
- timeout;
- CPU;
- RAM;
- swap;
- DB CPU;
- active connections;
- slow query;
- Redis hit/miss;
- cache latency;
- event loop delay;
- memory leak;
- recovery sau burst.

### 14.7. Tiêu chí ban đầu

- error rate dưới 1%;
- không có connection timeout;
- không có Redis timeout hàng loạt;
- không có deadlock;
- không có memory leak;
- p95 API đọc thông thường dưới 500 ms ở normal load;
- p95 API phức tạp dưới 1 giây;
- p99 không tăng mất kiểm soát;
- hệ thống phục hồi sau burst;
- CPU/RAM trở về mức bình thường sau test.

### 14.8. Đầu ra

- `scripts/performance/`
- `docs/performance/load-test-report.md`
- `artifacts/performance/final/`

---

## 15. Giai đoạn 11 — Kiểm tra frontend sau tối ưu backend

Sau mỗi thay đổi backend:

- chạy frontend build;
- chạy lint;
- chạy typecheck;
- chạy unit/integration test;
- chạy Playwright;
- kiểm tra API contract;
- loading state;
- error state;
- empty state;
- pagination;
- search;
- filter;
- realtime;
- role permission;
- stale data do cache.

Không chỉnh UI nếu không liên quan.

Không tối ưu logo, banner hoặc ảnh trong task này.

---

## 16. Thứ tự triển khai

1. Observability và baseline.
2. Public catalog/search/product/shop.
3. Auth/user/KYC.
4. Cart/checkout/order.
5. Payment/wallet.
6. QR/provenance.
7. Chat/notification/realtime.
8. Social/community.
9. Affiliate.
10. Livestream.
11. Seller/admin dashboard.
12. Connection pool và DB-wide review.
13. Final regression.
14. Final load test.

Mỗi module phải đi theo quy trình:

```text
Audit
→ test
→ đo
→ tối ưu query
→ index nếu cần
→ cache nếu phù hợp
→ regression test
→ benchmark
→ commit riêng
```

---

## 17. Yêu cầu báo cáo cuối

Tạo:

- `docs/performance/README.md`
- `docs/performance/system-flow-map.md`
- `docs/performance/api-inventory.md`
- `docs/performance/database-query-map.md`
- `docs/performance/baseline-report.md`
- `docs/performance/optimization-report.md`
- `docs/performance/cache-key-map.md`
- `docs/performance/load-test-report.md`

Báo cáo phải gồm:

1. Kiến trúc và bản đồ flow.
2. Danh sách toàn bộ endpoint.
3. Endpoint đã test.
4. Endpoint chưa test và lý do.
5. Query chậm đã phát hiện.
6. N+1 đã sửa.
7. `include/select` đã tối ưu.
8. Index đã thêm.
9. Index không thêm và lý do.
10. Cache key, TTL và invalidation.
11. Connection pool trước/sau.
12. Baseline và kết quả cuối:
    - p50;
    - p95;
    - p99;
    - throughput;
    - error rate;
    - query count;
    - payload;
    - CPU/RAM;
    - DB connections.
13. File đã sửa.
14. Migration đã tạo.
15. Rủi ro còn lại.
16. Đề xuất tiếp theo.
17. Phân loại:
    - cần làm ngay;
    - nên làm khi traffic tăng;
    - chưa cần.

---

## 18. Tiêu chí hoàn thành

- Đã đọc và đối chiếu cả frontend và backend.
- Đã test các flow chính của từng role.
- Không chỉ tối ưu trang chủ.
- Không làm vỡ API contract.
- Không có migration nguy hiểm không giải thích.
- Không cache sai dữ liệu nhạy cảm.
- Redis unavailable không làm hệ thống chết.
- Build pass.
- Lint pass.
- Typecheck pass.
- Test pass.
- Playwright flow chính pass.
- Query chậm quan trọng được xử lý.
- Index có bằng chứng từ EXPLAIN.
- Cache có invalidation rõ ràng.
- Có baseline trước và sau.
- Có p50/p95/p99.
- Có load test.
- Có rollback plan.
- Mỗi nhóm thay đổi có commit riêng.
- Không tự merge hoặc deploy production trước khi review.

---

## 19. Chỉ dẫn bắt đầu cho Codex

Bắt đầu bằng việc:

1. Đọc toàn bộ source code của hai repository.
2. Lập bản đồ hệ thống.
3. Tạo kế hoạch audit.
4. Tạo baseline.
5. Không sửa code ngay trong bước đầu tiên.
6. Sau khi hoàn thành tài liệu giai đoạn 1, mới bắt đầu tối ưu từng module theo thứ tự đã quy định.
