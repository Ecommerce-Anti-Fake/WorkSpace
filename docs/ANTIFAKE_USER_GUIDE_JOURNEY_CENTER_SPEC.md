# AntiFake User Guide, Ebook & Journey Center — Full Implementation Specification

## 0. Goal

Xây dựng một hệ thống tài liệu hướng dẫn sử dụng hoàn chỉnh cho AntiFake theo góc nhìn **người dùng thực tế**, thay vì chỉ mô tả route, API hoặc trạng thái UAT kỹ thuật.

Hệ thống tài liệu phải gồm các lớp sau:

1. **Ebook hướng dẫn sử dụng AntiFake**.
2. **Help Center** tích hợp trực tiếp trong Web App.
3. **Journey Center** hướng dẫn theo từng hành trình sử dụng.
4. **Contextual Help** tại các màn hình quan trọng.
5. **Visual Guide** dùng screenshot desktop/mobile có annotation.
6. **Documentation Registry / Visual Manifest** để quản lý nội dung và hình ảnh tập trung.
7. **Internal traceability documents** để bảo đảm tài liệu không mô tả vượt quá chức năng thực tế.

Tài liệu phải được tổ chức theo:

> **ROLE → MỤC TIÊU → USER JOURNEY → THAO TÁC → KẾT QUẢ**

Ba nhóm người dùng chính:

- Người mua.
- Shop / Người bán.
- Quản trị viên.

Affiliate và các nhóm đặc thù khác có thể có chương riêng nếu source cho thấy đủ chức năng độc lập.

---

# 1. Nguyên tắc bắt buộc trước khi viết tài liệu

Trước khi tạo ebook hoặc Help Center, phải kiểm tra source thực tế.

## 1.1. Audit source

Đọc và đối chiếu:

- Frontend routes.
- Navigation/menu.
- Authentication.
- Authorization.
- Backend API.
- Database schema.
- User/account states.
- Shop states.
- Product states.
- Order states.
- Payment states.
- Buyer flows.
- Seller/shop flows.
- Admin flows.
- Affiliate.
- QR verification.
- Voucher.
- Wallet.
- Review.
- Report.
- Community.
- Chat.
- Livestream.
- Notification.
- Search.
- Address.
- Shipping.
- Các chức năng khác tồn tại trong source.

Phải đối chiếu:

> Frontend ↔ Backend ↔ Database ↔ Runtime/UAT

Không được suy diễn chức năng chỉ vì route/component tồn tại.

---

## 1.2. Runtime verification

Nếu có production/UAT và browser tooling phù hợp:

- kiểm tra giao diện thật;
- kiểm tra navigation;
- kiểm tra responsive;
- kiểm tra role visibility;
- kiểm tra các flow an toàn;
- chụp screenshot từ giao diện thật.

Không được thực hiện mutation production nguy hiểm chỉ để lấy evidence.

Không thực hiện:

- payment thật;
- webhook replay;
- wallet mutation không được cấp quyền;
- thay đổi role/admin production chỉ để test;
- tạo dữ liệu hàng loạt;
- thao tác có nguy cơ mất dữ liệu.

---

## 1.3. Phân loại trạng thái chức năng

Trong tài liệu internal, sử dụng:

- `VERIFIED`
- `SOURCE_VERIFIED`
- `PARTIAL`
- `UNVERIFIED`
- `NOT_IMPLEMENTED`

Ý nghĩa:

### VERIFIED

Đã xác minh source và runtime/UAT.

### SOURCE_VERIFIED

Source xác nhận chức năng tồn tại nhưng runtime chưa đủ evidence.

### PARTIAL

Một phần flow đã hoạt động nhưng chưa đủ toàn bộ.

### UNVERIFIED

Chưa có đủ bằng chứng.

### NOT_IMPLEMENTED

UI/route/model có thể tồn tại nhưng chức năng chưa hoàn chỉnh.

Không đưa các trạng thái kỹ thuật này tràn lan vào ebook public.

---

# 2. Nguyên tắc viết tài liệu

Tài liệu public phải viết theo ngôn ngữ người dùng.

Không viết:

> Endpoint `/api/orders/:id/status` cập nhật state từ A sang B.

Ưu tiên:

> Sau khi chuẩn bị xong hàng, chọn **Sẵn sàng giao hàng**. Trạng thái đơn hàng sẽ được cập nhật để người mua theo dõi tiến trình.

Không dùng các cụm từ như:

- smoke test;
- permission boundary;
- backend enforcement;
- API route;
- database role;

trừ khi đang viết tài liệu engineering/internal.

---

# 3. Cấu trúc tổng thể Ebook

Tạo file master:

`docs/user-guide/ANTIFAKE_USER_GUIDE.md`

Cấu trúc đề xuất:

1. Giới thiệu AntiFake.
2. Bắt đầu sử dụng.
3. Hướng dẫn dành cho Người mua.
4. Hướng dẫn dành cho Shop / Người bán.
5. Hướng dẫn dành cho Quản trị viên.
6. Affiliate.
7. QR và xác thực nguồn gốc.
8. Community.
9. Chat.
10. Livestream.
11. Voucher.
12. Wallet.
13. Tài khoản và bảo mật.
14. Xử lý sự cố.
15. FAQ.
16. Thuật ngữ.

Tạo Table of Contents.

Nguồn này phải đủ sạch để tái sử dụng cho:

- Web Help Center.
- Journey Center.
- PDF.
- Ebook.
- Training material.
- Onboarding.

---

# 4. PHẦN I — Bắt đầu với AntiFake

Viết ngắn gọn, dễ hiểu.

Bao gồm:

- AntiFake là gì?
- AntiFake giúp người dùng làm được gì?
- Các nhóm người dùng.
- Đăng ký.
- Đăng nhập.
- Xác minh tài khoản nếu có.
- Quên mật khẩu nếu có.
- Hồ sơ cá nhân.
- Địa chỉ.
- Thông báo.
- Điều hướng giao diện.
- Bảo mật tài khoản.

Không bịa flow chưa tồn tại.

---

# 5. PHẦN II — Người mua

Tổ chức theo journey.

## Journey B01 — Tạo tài khoản và bắt đầu sử dụng

Flow thực tế cần được xác minh:

Đăng ký  
→ xác minh nếu có  
→ đăng nhập  
→ hoàn thiện hồ sơ  
→ thêm địa chỉ  
→ bắt đầu sử dụng.

Hướng dẫn phải phản ánh đúng source.

---

## Journey B02 — Tìm kiếm và khám phá sản phẩm

Bao gồm nếu có:

- Search.
- Category.
- Filter.
- Sort.
- Shop.
- Product Detail.
- Variant.
- Stock.
- Rating.
- Review.
- Provenance.
- AntiFake verification info.

---

## Journey B03 — Xác thực QR

Flow:

QR  
→ Scan/nhập mã  
→ Gửi kiểm tra  
→ Nhận kết quả  
→ Đọc risk/status/provenance  
→ Xử lý theo kết quả.

Không tự bịa ý nghĩa của trạng thái.

---

## Journey B04 — Mua hàng hoàn chỉnh

Đây là flow quan trọng.

Tìm sản phẩm  
→ xem chi tiết  
→ chọn biến thể  
→ chọn số lượng  
→ thêm vào giỏ  
→ mở giỏ hàng  
→ chọn sản phẩm  
→ chọn/thêm địa chỉ  
→ chọn vận chuyển  
→ áp dụng voucher  
→ affiliate code nếu có  
→ kiểm tra tổng tiền  
→ đặt hàng  
→ thanh toán  
→ theo dõi đơn  
→ nhận hàng  
→ xác nhận/hoàn tất  
→ đánh giá.

Phải reconstruct state machine từ backend.

Không tự đặt tên trạng thái.

---

## Journey B05 — Quản lý đơn hàng

Bao gồm nếu hỗ trợ:

- danh sách đơn;
- chi tiết đơn;
- trạng thái;
- hủy đơn;
- payment failed;
- retry;
- refund;
- nhận hàng;
- đánh giá.

---

## Journey B06 — Voucher

Giải thích:

- tìm voucher;
- lưu voucher nếu có;
- điều kiện;
- minimum order;
- thời hạn;
- shop voucher;
- platform voucher;
- áp dụng;
- lý do không áp dụng được.

---

## Journey B07 — Chat với Shop

Nếu có:

Product  
→ Shop  
→ Chat  
→ Conversation  
→ gửi nội dung  
→ gửi ảnh nếu hỗ trợ  
→ notification  
→ reconnect.

---

## Journey B08 — Community

Nếu có:

- Feed.
- Post.
- Comment.
- Like/reaction.
- Report.
- Profile.
- Moderation.

---

## Journey B09 — Livestream

Nếu có:

Live list  
→ xem livestream  
→ tương tác  
→ xem sản phẩm  
→ mua sản phẩm.

Không claim production-ready nếu chưa đủ evidence.

---

# 6. PHẦN III — Shop / Người bán

Seller không mặc định là database role riêng nếu kiến trúc thực tế vẫn là user sở hữu shop.

---

## Journey S01 — Đăng ký trở thành Shop

Xác minh flow thực:

User  
→ đăng ký Shop  
→ nhập thông tin  
→ upload hồ sơ  
→ KYC nếu có  
→ gửi xét duyệt  
→ chờ Admin  
→ approved/rejected  
→ Shop hoạt động.

Phải mô tả:

- cần chuẩn bị gì;
- trường bắt buộc;
- trạng thái hồ sơ;
- bị từ chối thì làm gì;
- khi nào bắt đầu bán được.

---

## Journey S02 — Thiết lập Shop

Bao gồm nếu có:

- tên;
- logo;
- avatar;
- banner;
- mô tả;
- địa chỉ;
- liên hệ;
- chính sách;
- shipping;
- wallet/payment;
- thiết lập khác.

---

## Journey S03 — Tạo sản phẩm

Flow:

Shop Dashboard  
→ Product  
→ Create  
→ thông tin cơ bản  
→ category  
→ description  
→ images/media  
→ variant  
→ SKU  
→ price  
→ inventory  
→ provenance/AntiFake nếu có  
→ submit  
→ review  
→ publish.

Nếu Product và Offer là model tách biệt, ebook phải giải thích bằng ngôn ngữ người dùng nhưng vẫn đúng kiến trúc.

---

## Journey S04 — Quản lý sản phẩm

Bao gồm:

- sửa;
- giá;
- tồn kho;
- variant;
- media;
- bật/tắt bán;
- submit review;
- rejected;
- resubmit;
- archive;
- delete nếu có.

---

## Journey S05 — Xử lý đơn hàng

Đây là flow quan trọng nhất của Shop.

Phải reconstruct state machine thực tế.

Ví dụ cấu trúc trình bày:

Buyer đặt hàng  
↓  
Shop nhận đơn  
↓  
Xác nhận  
↓  
Chuẩn bị hàng  
↓  
Bàn giao vận chuyển  
↓  
Đang giao  
↓  
Giao thành công  
↓  
Hoàn tất.

Đây chỉ là ví dụ, không được dùng nếu source không đúng như vậy.

Với mỗi bước phải giải thích:

- Shop nhìn thấy gì?
- Shop phải bấm gì?
- Điều kiện chuyển trạng thái?
- Ai được phép chuyển?
- Buyer nhìn thấy gì?
- Wallet/commission thay đổi khi nào?
- Hủy/thất bại xử lý ra sao?

Không tự suy diễn logic tiền.

---

## Journey S06 — Voucher Shop

Nếu có:

Create  
→ discount type  
→ value  
→ minimum order  
→ limit  
→ start/end  
→ applicable products  
→ publish  
→ usage.

---

## Journey S07 — Affiliate dành cho Shop

Nếu có:

- program;
- commission;
- link/code;
- attribution;
- conversion;
- payout;
- status.

---

## Journey S08 — Wallet và doanh thu

Bao gồm:

- balance;
- pending;
- available;
- transaction history;
- commission;
- payout;
- withdrawal.

Phải xác minh backend trước khi mô tả.

---

## Journey S09 — Livestream bán hàng

Nếu có:

Create Live  
→ cấu hình  
→ chọn sản phẩm  
→ bắt đầu  
→ tương tác  
→ order  
→ kết thúc  
→ xem kết quả.

---

# 7. PHẦN IV — Admin

Admin guide nên tách khỏi người dùng phổ thông.

## A01 — Dashboard

Giải thích các KPI thực tế.

## A02 — Quản lý người dùng

Search  
→ detail  
→ status  
→ verify/suspend/activate nếu có.

## A03 — KYC

Pending  
→ inspect  
→ approve/reject  
→ reason  
→ notification.

## A04 — Duyệt Shop

Shop Application  
→ inspect  
→ approve/reject  
→ activation.

## A05 — Duyệt sản phẩm

Pending  
→ inspect  
→ approve/reject  
→ publish.

## A06 — Moderation

Nếu hỗ trợ:

- community;
- report;
- review;
- user content.

## A07 — Order/Payment oversight

Chỉ mô tả quyền thực sự có.

## A08 — Wallet/Financial Operations

Đây là vùng nhạy cảm.

Không dùng mutation production chỉ để lấy screenshot.

## A09 — Voucher/Platform Promotion

Nếu có.

## A10 — Audit/Monitoring

Nếu có.

---

# 8. Các chức năng ngoài Journey

Tạo chương riêng:

# Công cụ và chức năng khác

Có thể gồm:

- Profile.
- Address.
- Notification.
- Favorites/Wishlist.
- Review.
- Report.
- Search.
- Chat.
- Community.
- Livestream.
- QR History.
- Wallet.
- Affiliate.
- Voucher.
- Security.
- Account Settings.

Chỉ đưa chức năng thực sự tồn tại.

---

# 9. Format chuẩn cho mỗi bài hướng dẫn

Mỗi bài nên có cấu trúc:

## [Tên công việc]

### Bạn sẽ làm được gì

Một đoạn ngắn.

### Điều kiện trước khi bắt đầu

Ví dụ:

- Đã đăng nhập.
- Shop đã được duyệt.
- Có ít nhất một sản phẩm.

### Các bước thực hiện

#### Bước 1 — ...

Mô tả.

Ảnh minh họa.

#### Bước 2 — ...

Mô tả.

Ảnh minh họa.

### Kết quả

Cho người dùng biết trạng thái thành công.

### Nếu gặp lỗi

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|

Không đưa stack trace hoặc technical detail không cần thiết.

---

# 10. Help Center

Đánh giá và triển khai route:

`/help`

hoặc route phù hợp convention hiện tại.

Không hard-code một trang HTML khổng lồ.

Thiết kế theo content/data architecture có thể mở rộng.

Trang chính đề xuất:

# Trung tâm trợ giúp AntiFake

Có Search.

Các nhóm:

- Bắt đầu.
- Dành cho Người mua.
- Dành cho Shop.
- Xác thực QR.
- Thanh toán & Đơn hàng.
- Voucher.
- Affiliate.
- Community.
- Chat.
- Livestream.
- Tài khoản & Bảo mật.

Admin Help có thể:

- đặt trong admin dashboard;
- hoặc chỉ hiển thị cho admin.

---

# 11. Journey Center

Journey Center không chỉ là danh sách bài viết.

Nó phải giúp người dùng hoàn thành một mục tiêu.

Ví dụ:

## Mua sản phẩm đầu tiên

Tìm sản phẩm  
→ xem chi tiết  
→ thêm giỏ  
→ checkout  
→ thanh toán  
→ theo dõi đơn.

## Mở Shop trên AntiFake

Đăng ký Shop  
→ gửi xét duyệt  
→ thiết lập Shop  
→ tạo sản phẩm  
→ sản phẩm được duyệt  
→ nhận đơn đầu tiên.

## Đăng sản phẩm đầu tiên

Shop Dashboard  
→ tạo sản phẩm  
→ media  
→ variant  
→ giá  
→ tồn kho  
→ submit  
→ publish.

## Xử lý đơn hàng đầu tiên

Nhận đơn  
→ kiểm tra  
→ xác nhận  
→ chuẩn bị  
→ giao hàng  
→ hoàn tất.

Journey Center phải hiển thị tiến trình:

`Bước 3/6`

Và cho phép:

- Bước trước.
- Bước tiếp.
- Quay lại tổng quan.
- Chuyển Desktop/Mobile.

Không bắt buộc user hoàn thành tuần tự nếu đây chỉ là documentation.

---

# 12. Responsive Journey Center

## 12.1. Tự chọn theo thiết bị

Nếu người dùng đang sử dụng Desktop/Laptop:

→ ưu tiên hướng dẫn Desktop.

Nếu người dùng đang sử dụng Mobile:

→ ưu tiên hướng dẫn Mobile.

Không dùng screenshot desktop scale nhỏ để giả mobile.

Phải dùng giao diện responsive thực tế.

---

## 12.2. Cho phép chuyển thủ công

Journey Center phải có selector:

**Desktop | Mobile**

Không khóa cứng theo device detection.

Ví dụ:

Người dùng đang ngồi desktop nhưng hướng dẫn khách trên điện thoại vẫn có thể chuyển sang Mobile.

Nếu phù hợp, lưu lựa chọn trong:

- session;
- local preference;
- hoặc state phù hợp.

---

# 13. Một Journey có thể khác giữa Desktop và Mobile

Không giả định navigation giống nhau.

Ví dụ:

Desktop:

Header  
→ Tài khoản  
→ Đơn mua.

Mobile:

Bottom Navigation  
→ Tài khoản  
→ Đơn mua.

Nếu runtime khác nhau, tài liệu phải có hướng dẫn riêng.

Data structure nên hỗ trợ:

```text
Journey
 ├── common
 ├── desktopSteps
 │    ├── step
 │    ├── screenshot
 │    └── annotation
 └── mobileSteps
      ├── step
      ├── screenshot
      └── annotation
```

---

# 14. Visual Guide

Ảnh phải gắn trực tiếp với bước đang mô tả.

Ưu tiên:

> Mô tả → Ảnh minh họa → Điểm cần chú ý → Bước tiếp theo

Không viết 10 bước rồi để toàn bộ ảnh xuống cuối trang.

---

# 15. Screenshot Annotation

Đối với bước có thao tác cụ thể, tạo bản annotated.

Có thể dùng:

- highlight;
- bounding box;
- số thứ tự;
- mũi tên;
- marker;
- callout ngắn.

Ví dụ:

`① Chọn biến thể`

`② Chọn số lượng`

`③ Thêm vào giỏ`

Trong ảnh cũng có marker tương ứng:

`① ② ③`

---

# 16. Quy tắc Annotation

Annotation phải:

- dễ nhìn;
- không che UI;
- không che button text;
- không che giá;
- không che validation;
- không che trạng thái;
- không che nội dung quan trọng.

Nếu mobile quá chật:

→ ưu tiên bounding box + số thứ tự.

Không nhồi text dài vào screenshot.

---

# 17. Giữ ảnh gốc và ảnh annotated

Không overwrite screenshot gốc.

Ví dụ:

```text
docs/
  images/
    guide/
      buyer/
        checkout/
          desktop/
            01-cart.png
            01-cart-annotated.png
            02-address.png
            02-address-annotated.png
          mobile/
            01-cart.png
            01-cart-annotated.png
            02-address.png
            02-address-annotated.png
```

Ảnh gốc dùng cho:

- evidence;
- regression;
- recapture;
- re-annotation.

Ảnh annotated dùng cho:

- Journey Center;
- Help Center;
- Ebook;
- training.

---

# 18. Viewport chuẩn

Khuyến nghị tối thiểu:

Desktop:

`1440×900`

Laptop:

`1280×720`

Mobile:

`390×844`

Có thể bổ sung viewport khác nếu UI breakpoints thực tế yêu cầu.

Không crop tùy tiện làm mất context.

---

# 19. Ebook phải có Desktop + Mobile

Khác Journey Center, Ebook không được tự động ẩn một platform.

Ebook phải chứa cả Desktop và Mobile ở những bước cần thiết.

Ví dụ:

## 4.2. Thêm sản phẩm vào giỏ

### Trên máy tính

Mô tả...

**Hình 4.2a — Thêm sản phẩm vào giỏ trên Desktop**

[Desktop annotated screenshot]

### Trên điện thoại

Mô tả...

**Hình 4.2b — Thêm sản phẩm vào giỏ trên Mobile**

[Mobile annotated screenshot]

---

# 20. Không để Ebook quá nặng

Không bắt buộc mọi bước có 2 ảnh.

Phân loại:

## Level A — UI khác đáng kể

Bắt buộc Desktop + Mobile.

Ví dụ:

- navigation;
- menu;
- checkout;
- seller dashboard;
- product management;
- order management;
- shop registration.

## Level B — UI khác nhẹ

Có thể dùng:

- 1 ảnh desktop;
- 1 ảnh mobile tổng quan;
- phần mô tả dùng chung.

## Level C — UI gần giống nhau

Có thể dùng chung mô tả và 1 ảnh chính nếu runtime xác nhận không có khác biệt đáng kể.

Mục tiêu:

> trực quan nhưng không tạo ebook hàng trăm trang không cần thiết.

---

# 21. Layout Journey Center trên Mobile

Ưu tiên:

```text
BƯỚC 2/6

Chọn sản phẩm

Mô tả ngắn

[Screenshot mobile]

① Vị trí cần thao tác

[Mẹo nếu có]

[← Trước]        [Tiếp →]
```

Không hiển thị ảnh desktop rộng buộc user phải zoom.

---

# 22. Layout Journey Center trên Desktop

Có thể dùng layout:

```text
┌────────────────────────────────────────────┐
│ Mua sản phẩm đầu tiên                     │
│ Bước 2/6                                  │
├───────────────────┬────────────────────────┤
│ HƯỚNG DẪN         │ SCREENSHOT             │
│                   │                        │
│ ① Chọn biến thể   │     [①]                │
│ ② Chọn số lượng   │          [②]           │
│ ③ Thêm vào giỏ    │               [③]      │
├───────────────────┴────────────────────────┤
│ ← Bước trước                    Tiếp theo →│
└────────────────────────────────────────────┘
```

Đây chỉ là UX direction.

Phải điều chỉnh theo design system thực tế của AntiFake.

---

# 23. Contextual Help

Không bắt user lúc nào cũng phải tự vào `/help`.

Thêm contextual help ở các màn hình quan trọng.

Ví dụ:

Checkout:

**? Hướng dẫn đặt hàng**

Seller Product Create:

**? Cách đăng sản phẩm**

Seller Orders:

**? Quy trình xử lý đơn hàng**

Shop Registration:

**? Điều kiện mở Shop**

QR:

**? Cách kiểm tra sản phẩm**

Các link phải deep-link trực tiếp tới Journey/Step liên quan.

---

# 24. Journey Deep Link

Mỗi journey/bước quan trọng nên có URL ổn định.

Ví dụ:

```text
/help/buyer/first-purchase
/help/buyer/first-purchase/add-to-cart
/help/buyer/orders
/help/seller/register-shop
/help/seller/create-product
/help/seller/process-order
/help/qr/verify-product
```

Contextual Help không được chỉ đưa user về `/help`.

---

# 25. Quick Guide

Ngoài Help Center đầy đủ, triển khai Quick Guide cho các flow phổ biến.

## Buyer

- Mua sản phẩm đầu tiên.
- Kiểm tra QR.
- Theo dõi đơn.
- Áp dụng voucher.

## Seller

- Đăng ký Shop.
- Hoàn thiện Shop.
- Đăng sản phẩm đầu tiên.
- Xử lý đơn đầu tiên.
- Tạo voucher.

Có thể dùng:

- stepper;
- checklist;
- coach marks;
- tooltip;
- onboarding panel.

Không popup tutorial mỗi lần truy cập.

Ưu tiên:

> First-time onboarding + Help luôn có thể mở lại.

---

# 26. Seller Getting Started Checklist

Trong Seller Dashboard nên cân nhắc checklist:

- Thiết lập hồ sơ.
- Hoàn thiện Shop.
- Tạo sản phẩm đầu tiên.
- Đăng sản phẩm.
- Tạo voucher.
- Nhận đơn đầu tiên.
- Xử lý đơn đầu tiên.

Khi hoàn tất có thể thu gọn.

Người dùng vẫn phải mở lại được từ Help.

---

# 27. Role-aware Help

Help Center có thể điều chỉnh nội dung theo user context.

Ví dụ:

Buyer:

> Bạn muốn mua hàng?  
> Bắt đầu với hướng dẫn mua sản phẩm đầu tiên.

Seller:

> Bạn đang bán hàng?  
> Xem hướng dẫn dành cho Shop.

Admin:

> Hướng dẫn quản trị.

Không dùng frontend role để thay thế backend authorization.

---

# 28. Search

Nếu Help Center đủ lớn, search theo:

- title;
- keywords;
- role;
- feature;
- journey.

Ví dụ search:

`đơn hàng`

Có thể trả:

### Người mua

- Theo dõi đơn hàng.
- Hủy đơn hàng.

### Shop

- Xác nhận đơn.
- Chuẩn bị hàng.
- Xử lý đơn bị hủy.

---

# 29. Documentation Registry

Không để tài liệu thành một đống Markdown không quản lý được.

Tạo metadata cho article.

Ví dụ:

```ts
{
  slug: "seller/process-order",
  title: "Xử lý đơn hàng",
  role: "seller",
  journey: "seller-order",
  feature: "orders",
  keywords: ["đơn hàng", "xác nhận", "giao hàng"],
  updatedAt: "..."
}
```

Có thể dùng:

- Markdown.
- MDX.
- Content collection.
- TS/JSON registry.

Tự chọn giải pháp phù hợp với stack.

---

# 30. Visual Manifest

Tạo manifest cho screenshot.

Ví dụ:

```yaml
journey: buyer-first-purchase
step: add-to-cart

desktop:
  original: images/guide/buyer/cart/desktop/01-cart.png
  annotated: images/guide/buyer/cart/desktop/01-cart-annotated.png
  viewport: 1440x900

mobile:
  original: images/guide/buyer/cart/mobile/01-cart.png
  annotated: images/guide/buyer/cart/mobile/01-cart-annotated.png
  viewport: 390x844
```

Có thể triển khai JSON/TS/YAML.

Mục tiêu là cùng visual asset được reuse bởi:

- Journey Center.
- Help Center.
- Ebook.
- Training.
- Onboarding.

Không copy thủ công ảnh vào nhiều nơi.

---

# 31. Visual Version Tracking

Screenshot dễ stale.

Visual Manifest nên lưu:

- journey;
- step;
- platform;
- viewport;
- source page;
- screenshot path;
- annotated path;
- capture date;
- application commit/version nếu phù hợp.

Khi UI thay đổi, phải xác định được screenshot nào cần recapture.

---

# 32. Feature Guide Matrix

Tạo:

`docs/user-guide/FEATURE_GUIDE_MATRIX.md`

Format:

| Feature | Role | UI | API | Runtime | Guide | Screenshot | Status |
|---|---|---|---|---|---|---|---|

Mục tiêu:

> Không có documentation nào nói nhiều hơn những gì sản phẩm thực sự làm được.

Đây là tài liệu engineering/internal.

---

# 33. UX Documentation Gaps

Tạo:

`docs/user-guide/UX_DOCUMENTATION_GAPS.md`

Trong quá trình viết, nếu phát hiện:

- route không tới được từ menu;
- nút không hoạt động;
- frontend/backend lệch;
- UX khó hiểu;
- thiếu empty state;
- thiếu error;
- thiếu loading;
- state name khó hiểu;
- seller flow quá dài;
- user không biết bước tiếp;
- responsive lỗi;
- permission sai;
- feature có source nhưng không discoverable;

phải ghi lại.

Mỗi issue gồm:

- Feature.
- Role.
- Current behavior.
- Expected behavior.
- Severity.
- Evidence.
- Recommended fix.

Không che giấu product gap để hoàn thành ebook.

---

# 34. Screenshot Security

Không đưa vào ảnh:

- password;
- token;
- cookie;
- API key;
- secret;
- CCCD/KYC thật;
- email/phone thật nếu không cần;
- dữ liệu người dùng thật;
- thông tin thanh toán thật.

Dùng:

- UAT account.
- Test data.
- Sanitized data.

Không dùng ảnh baseline lỗi bảo mật làm ảnh hướng dẫn final.

---

# 35. Naming Screenshot

Dùng semantic naming.

Ví dụ:

```text
buyer-product-detail-desktop.png
buyer-product-detail-mobile.png

buyer-cart-desktop.png
buyer-cart-desktop-annotated.png

buyer-checkout-address-mobile.png
buyer-checkout-address-mobile-annotated.png

seller-create-product-basic-desktop.png
seller-create-product-basic-mobile.png

seller-order-confirm-desktop.png
seller-order-confirm-mobile.png

admin-shop-review-desktop.png
```

---

# 36. Journey ưu tiên cần Visual Guide

## Buyer

Ưu tiên:

1. Đăng ký/đăng nhập.
2. Tìm sản phẩm.
3. Xem sản phẩm.
4. Mua sản phẩm đầu tiên.
5. Checkout.
6. Theo dõi đơn.
7. QR.
8. Voucher.
9. Chat với Shop.

## Seller

Ưu tiên rất cao:

1. Đăng ký trở thành Shop.
2. Hoàn thiện Shop.
3. Tạo sản phẩm đầu tiên.
4. Quản lý sản phẩm.
5. Xử lý đơn đầu tiên.
6. Tồn kho.
7. Voucher.
8. Wallet/doanh thu.
9. Affiliate.
10. Livestream nếu VERIFIED/PARTIAL phù hợp.

Seller mobile journey phải được kiểm tra kỹ vì Shop có khả năng xử lý đơn trực tiếp bằng điện thoại.

---

# 37. Admin Screenshot

Admin screenshot chỉ được thực hiện khi có account UAT/test hợp lệ.

Không:

- đổi role production chỉ để chụp ảnh;
- unsuspend account production mà không được phép;
- thực hiện financial mutation chỉ để tạo visual.

Nếu thiếu credential:

- ghi manual action;
- tiếp tục các phần không bị block.

---

# 38. Documentation Architecture

Không nên xuất PDF trước.

Nguồn chính nên là:

- Markdown/MDX.
- Documentation Registry.
- Visual Manifest.
- Screenshot asset.

Từ đó build:

```text
Single Source of Truth
        ↓
  ┌─────┼────────┐
  ↓     ↓        ↓
Help   Ebook    Journey Center
Center
        ↓
      PDF
```

Mục tiêu:

- tránh duplicate;
- dễ update;
- dễ trace;
- dễ maintain.

---

# 39. Thứ tự thực hiện

## Phase 1 — Discovery

Audit source:

- routes;
- API;
- schema;
- roles;
- permissions;
- states;
- navigation.

## Phase 2 — Journey Mapping

Lập:

- Buyer Journey Map.
- Seller Journey Map.
- Admin Journey Map.

## Phase 3 — Runtime Verification

Xác minh các flow an toàn.

## Phase 4 — Gap Analysis

Ghi các UX/product gap.

## Phase 5 — Documentation

Viết ebook theo evidence.

## Phase 6 — Screenshot

Capture:

- Desktop.
- Mobile.
- Original.
- Annotated.

## Phase 7 — Help Center

Triển khai `/help`.

## Phase 8 — Journey Center

Triển khai:

- progress;
- desktop/mobile;
- article/step deep link.

## Phase 9 — Contextual Help

Gắn help vào màn hình thật.

## Phase 10 — QA

Kiểm tra:

- link;
- screenshot;
- mobile;
- desktop;
- role visibility;
- search;
- content;
- terminology;
- accessibility;
- privacy;
- regression.

---

# 40. Không được làm

Không:

- bịa chức năng;
- bịa button;
- bịa state;
- bịa API;
- bịa screenshot;
- dùng ảnh cũ không đúng UI;
- payment production;
- webhook replay;
- wallet mutation không cần thiết;
- expose credentials;
- thay đổi quyền production để lấy screenshot;
- đánh dấu VERIFIED chỉ vì component tồn tại;
- dùng desktop screenshot scale xuống làm mobile guide.

---

# 41. Definition of Done

Goal chỉ DONE khi:

## Discovery

- [ ] Đã audit source.
- [ ] Đã đối chiếu frontend/backend/database.
- [ ] Đã inventory các chức năng.
- [ ] Đã lập Buyer Journey Map.
- [ ] Đã lập Seller Journey Map.
- [ ] Đã lập Admin Journey Map.

## Ebook

- [ ] Có `ANTIFAKE_USER_GUIDE.md`.
- [ ] Có Table of Contents.
- [ ] Buyer guide hoàn chỉnh.
- [ ] Seller guide hoàn chỉnh.
- [ ] Admin guide hoàn chỉnh.
- [ ] Có troubleshooting.
- [ ] Có FAQ.
- [ ] Có glossary.

## Buyer

- [ ] Flow đăng ký/đăng nhập.
- [ ] Flow tìm sản phẩm.
- [ ] Flow Product Detail.
- [ ] Flow Cart.
- [ ] Flow Checkout.
- [ ] Flow Payment theo mức độ đã xác minh.
- [ ] Flow Order.
- [ ] Flow QR.
- [ ] Flow Voucher.
- [ ] Flow Chat nếu có.

## Seller

- [ ] Flow đăng ký Shop.
- [ ] Flow Shop approval.
- [ ] Flow thiết lập Shop.
- [ ] Flow tạo sản phẩm.
- [ ] Flow quản lý sản phẩm.
- [ ] Flow xử lý order.
- [ ] Flow voucher.
- [ ] Flow wallet nếu có.
- [ ] Flow affiliate nếu có.
- [ ] Flow livestream nếu có.

## Admin

- [ ] User management.
- [ ] KYC.
- [ ] Shop approval.
- [ ] Product approval.
- [ ] Moderation.
- [ ] Order/payment oversight nếu có.
- [ ] Voucher nếu có.
- [ ] Audit/Monitoring nếu có.

## Help Center

- [ ] Có `/help` hoặc kiến trúc tương đương.
- [ ] Responsive.
- [ ] Search.
- [ ] Role-aware.
- [ ] Deep link.
- [ ] Contextual Help.

## Journey Center

- [ ] Có Buyer Journeys.
- [ ] Có Seller Journeys.
- [ ] Có Admin Journey phù hợp.
- [ ] Có progress.
- [ ] Có Previous/Next.
- [ ] Có Desktop/Mobile selector.
- [ ] Tự ưu tiên platform theo viewport.
- [ ] Không khóa cứng device.
- [ ] Mobile không dùng ảnh desktop scale xuống.

## Visual

- [ ] Các journey quan trọng có screenshot.
- [ ] Có Desktop visual.
- [ ] Có Mobile visual.
- [ ] Có annotation cho thao tác khó tìm.
- [ ] Annotation không che UI.
- [ ] Giữ ảnh gốc.
- [ ] Giữ ảnh annotated.
- [ ] Screenshot dùng UAT/test data.
- [ ] Không rò secret/PII.
- [ ] Có Visual Manifest.
- [ ] Screenshot trace được tới Journey/Step/platform.

## Ebook Desktop/Mobile

- [ ] Level A có cả Desktop + Mobile.
- [ ] Level B có visual phù hợp.
- [ ] Level C không duplicate vô nghĩa.
- [ ] Ebook không phình quá mức chỉ vì ảnh.

## Internal traceability

- [ ] Có `FEATURE_GUIDE_MATRIX.md`.
- [ ] Có `UX_DOCUMENTATION_GAPS.md`.
- [ ] Không guide nào claim vượt evidence.

## Quality

- [ ] Tests pass.
- [ ] Build pass.
- [ ] Lint pass.
- [ ] Không regression.
- [ ] Không broken links.
- [ ] Không stale image rõ ràng.
- [ ] Accessibility cơ bản đạt.
- [ ] Mobile usability được kiểm tra.

---

# 42. Báo cáo sau mỗi Phase

Sau mỗi phase, báo cáo ngắn:

- đã audit gì;
- journey nào phát hiện;
- VERIFIED gì;
- PARTIAL gì;
- UNVERIFIED gì;
- UX gap nào phát hiện;
- tài liệu nào tạo/cập nhật;
- screenshot nào capture;
- Help Center tiến triển;
- Journey Center tiến triển;
- tests/build;
- blocker;
- manual action.

Không dừng toàn bộ goal chỉ vì một flow cần credential nếu vẫn còn các phần khác có thể thực hiện an toàn.

---

# 43. Outcome mong muốn

Khi hoàn thành, AntiFake phải có một hệ thống hướng dẫn mà người dùng có thể:

1. Vào **Help Center** để tìm chức năng.
2. Vào **Journey Center** để làm theo từng bước.
3. Nhìn thấy đúng hướng dẫn **Desktop hoặc Mobile** theo thiết bị.
4. Chuyển thủ công giữa **Desktop | Mobile**.
5. Đọc từng bước và nhìn ngay screenshot bên dưới/bên cạnh.
6. Nhìn thấy vị trí cần thao tác được đánh dấu trực tiếp.
7. Mở ebook để xem đầy đủ cả Desktop và Mobile.
8. Seller mới có thể hoàn thành onboarding mà không cần hỏi hỗ trợ.
9. Buyer mới có thể tự mua sản phẩm đầu tiên.
10. Admin có tài liệu riêng phù hợp quyền quản trị.
11. Tài liệu không mô tả vượt quá chức năng thực tế.
12. Khi UI thay đổi, team có thể biết chính xác ảnh/hướng dẫn nào cần cập nhật.

Mục tiêu cuối cùng không chỉ là “có tài liệu”.

Mục tiêu là:

> **Biến tài liệu hướng dẫn thành một phần của trải nghiệm sản phẩm AntiFake.**
