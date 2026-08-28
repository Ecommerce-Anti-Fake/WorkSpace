Bạn đang làm việc với hệ thống AntiFake gồm hai repository:

- Backend: https://github.com/Ecommerce-Anti-Fake/Back-End
- Frontend: https://github.com/Ecommerce-Anti-Fake/Front-End
- Website production cần kiểm thử thật: https://antifake.io.vn

## Mục tiêu

Kiểm thử toàn bộ các chức năng và luồng nghiệp vụ hiện có của hệ thống AntiFake trực tiếp trên website production.

Không chỉ đọc code hoặc gọi API. Phải thao tác thật trên giao diện bằng trình duyệt, đăng nhập bằng các tài khoản seed và thực hiện các luồng như người dùng thực tế.

Trong quá trình kiểm thử:

1. Phát hiện lỗi frontend, backend, API, dữ liệu, phân quyền và trải nghiệm người dùng.
2. Sửa trực tiếp các lỗi tìm thấy trong đúng repository liên quan.
3. Cải thiện các màn hình có giao diện xấu, khó dùng hoặc không đồng nhất.
4. Commit và push thay đổi lên GitHub.
5. Chờ deployment hoàn tất hoặc kiểm tra trạng thái deployment thành công.
6. Chỉ sau khi bản mới đã deploy thành công mới được kiểm thử lại trên production.
7. Lặp lại chu trình cho đến khi các luồng chính hoạt động ổn định.
8. Viết tài liệu hướng dẫn sử dụng AntiFake bằng tiếng Việt, bao gồm role, chức năng, flow và hình ảnh minh họa.

Không được chỉ lập kế hoạch, viết báo cáo lỗi hoặc đề xuất cách sửa. Hãy trực tiếp kiểm tra, sửa code, commit, push và xác minh lại.

---

# 1. Khảo sát dự án trước khi kiểm thử

Trước khi thao tác trên website, đọc kỹ cả frontend và backend để lập danh sách đầy đủ:

- Các role và quyền hiện có.
- Các trạng thái tài khoản.
- Các route frontend.
- Các controller và API backend.
- Các tài khoản seed.
- Các shop, affiliate account và dữ liệu liên quan đến tài khoản seed.
- Các chức năng có thể thao tác trên giao diện.
- Các chức năng đã có backend nhưng chưa có frontend.
- Các trang frontend còn dùng mock data.
- Các trang chưa nối API thật.
- Các route chưa được bảo vệ đúng quyền.
- Các menu hoặc nút dẫn tới chức năng chưa hoàn thiện.
- Các dịch vụ ngoài như Firebase, PayOS, Agora, Cloudflare R2, WebSocket, SSE và FCM.

Đọc kỹ tối thiểu:

## Backend

- `prisma/seed.ts`
- `prisma/seeds/**`
- Prisma schema
- auth
- users
- KYC
- shops
- catalog
- offers
- batches
- QR
- provenance
- distribution
- cart
- orders
- payment
- wallet
- vouchers
- affiliate
- social
- chat
- live commerce
- notifications
- reports
- disputes
- moderation
- withdrawal

## Frontend

- `src/App.tsx`
- layouts
- protected routes
- auth store
- API services
- toàn bộ `src/pages`
- toàn bộ navigation, menu và sidebar
- user pages
- seller pages
- admin pages
- affiliate pages
- responsive styles
- các component dùng chung
- các test hiện có

Tạo file:

```text
docs/UAT_TEST_MATRIX.md
```

Cấu trúc:

```md
| ID  | Role | Chức năng | Tiền điều kiện | Các bước kiểm thử | Kết quả mong đợi | Trạng thái |
| --- | ---- | --------- | -------------- | ----------------- | ---------------- | ---------- |
```

Không bỏ sót chức năng chỉ vì chức năng đó khó kiểm thử.

---

# 2. Xác định role thực tế

Không tự suy đoán role chỉ dựa vào tên màn hình.

Phải kiểm tra role và quyền từ:

- Prisma schema.
- Seed data.
- Auth guard.
- Backend authorization.
- Frontend protected route.
- Quan hệ user với shop.
- Quan hệ user với affiliate account.
- Trạng thái KYC.
- Trạng thái shop.
- Trạng thái tài khoản.

Cần phân biệt rõ:

- Khách chưa đăng nhập.
- User hoặc buyer.
- Seller hoặc shop owner.
- Affiliate.
- Admin.
- Các trạng thái hoặc quyền khác có thật trong code.

Nếu seller và affiliate không phải role riêng mà là user có quan hệ tương ứng, tài liệu phải mô tả đúng như vậy.

---

# 3. Tài khoản seed

Tìm tài khoản chính xác trong backend seed và xác minh đăng nhập thật.

Các tài khoản dự kiến:

- Admin: `admin@antifake.io.vn`
- User/Seller 1: `seed.user01@antifake.local`
- User/Seller 2: `seed.user02@antifake.local`
- Mật khẩu: cung cấp qua môi trường UAT bảo mật; không ghi trong tài liệu.

Không được chỉ tin vào danh sách trên. Phải đối chiếu với code seed và dữ liệu production.

Xác định rõ:

- Tài khoản nào là buyer.
- Tài khoản nào sở hữu shop.
- Shop nào thuộc tài khoản nào.
- Tài khoản nào có affiliate account.
- Tài khoản nào đã KYC.
- Tài khoản nào có KYC pending hoặc rejected.
- Tài khoản nào suspended.
- Tài khoản admin nào dùng được.

Nếu tài khoản seed không đăng nhập được:

1. Xác định nguyên nhân.
2. Kiểm tra frontend, backend, Firebase, email verification, dữ liệu production và biến môi trường.
3. Sửa đúng nguyên nhân.
4. Không hard-code bỏ qua bảo mật.
5. Không vô hiệu hóa guard chỉ để kiểm thử.

Không đưa secret, token hoặc mật khẩu production vào tài liệu public.

---

# 4. Thiết lập kiểm thử trình duyệt

Ưu tiên sử dụng Playwright.

Nếu frontend chưa có Playwright, hãy thiết lập:

- Playwright config.
- Test theo từng role.
- Screenshot khi test thất bại.
- Video hoặc trace cho lỗi khó tái hiện.
- Dùng selector ổn định như role, label hoặc `data-testid`.
- Không dùng timeout cứng nếu có thể chờ trạng thái UI hoặc API.
- Không chạy song song các test làm thay đổi cùng một dữ liệu.
- Chia test theo nhóm flow.

Các viewport tối thiểu:

- Desktop: 1440 × 900.
- Laptop: 1280 × 720.
- Mobile: 390 × 844.

Khi kiểm thử production:

- Không reset database.
- Không chạy seed lên production.
- Không xóa dữ liệu quan trọng.
- Không tạo số lượng lớn đơn hàng, chat, notification hoặc payment.
- Không spam email, SMS, FCM hoặc cổng thanh toán.
- Chỉ dùng dữ liệu test an toàn.
- Không chỉnh trực tiếp database để che lỗi.
- Không thanh toán tiền thật nếu môi trường đang kết nối payment production.
- Với chức năng nhạy cảm, phải xác định sandbox hoặc test mode trước khi thao tác.

---

# 5. Quy trình làm việc bắt buộc

Phải thực hiện theo chu trình:

```text
Khảo sát
→ Kiểm thử production
→ Ghi nhận lỗi
→ Sửa code
→ Chạy lint/build/test local
→ Commit
→ Push
→ Theo dõi deployment
→ Xác minh deployment thành công
→ Kiểm thử lại production
→ Regression test
→ Cập nhật tài liệu
```

Không được bỏ qua bất kỳ bước nào.

---

# 6. Quy trình commit, deploy và kiểm thử lại

Sau mỗi lần sửa code, không được kiểm thử production ngay.

## 6.1. Kiểm tra local trước khi commit

Chạy đầy đủ lint, build và test liên quan.

Không commit nếu:

- Build thất bại.
- Lint có lỗi nghiêm trọng.
- Test liên quan thất bại.
- TypeScript compile lỗi.
- Có secret bị đưa vào source.
- Có file cache hoặc file build không cần thiết.

## 6.2. Commit

Commit tất cả thay đổi cần thiết với commit message rõ ràng.

Ví dụ:

```bash
git add .
git commit -m "fix(auth): resolve Google login redirect"
```

Không dùng message mơ hồ như:

```text
fix
update
test
change code
```

Có thể chia commit theo nhóm:

- `fix(auth): ...`
- `fix(order): ...`
- `fix(permission): ...`
- `fix(chat): ...`
- `fix(payment): ...`
- `refactor(ui): ...`
- `test(e2e): ...`
- `docs(uat): ...`

Không commit:

- `.env`
- token
- cookie
- secret
- private key
- file build
- cache
- log nhạy cảm

## 6.3. Push

Push lên đúng branch đang được production deploy.

Ví dụ:

```bash
git push
```

Không được chỉ commit local rồi tiếp tục kiểm thử.

## 6.4. Theo dõi CI/CD và deployment

Sau khi push, không được test production ngay.

Ưu tiên kiểm tra trực tiếp:

- GitHub Actions.
- Deployment.
- Environment.
- Commit status.
- Status check.
- Vercel deployment nếu frontend dùng Vercel.
- Render deployment nếu backend dùng Render.
- Log deploy VPS nếu hệ thống dùng VPS.
- Health check backend.
- Build status frontend.

Phải xác nhận:

- Đúng commit vừa push đã được deploy.
- Build thành công.
- Deployment thành công.
- Không còn job đang chạy.
- Không có job failed.
- Backend health check hoạt động.
- Frontend tải đúng bản build mới.

Nếu không có cách kiểm tra trạng thái deployment:

- Chờ tối thiểu khoảng 10 phút sau khi push.
- Sau đó truy cập website để xác minh.
- Không coi việc chờ đủ 10 phút là bằng chứng deployment thành công nếu website vẫn đang chạy bản cũ.

Nếu deploy chưa xong sau 10 phút:

- Kiểm tra GitHub Actions hoặc nền tảng deployment.
- Đọc build log.
- Xác định lỗi.
- Sửa lỗi.
- Commit lại.
- Push lại.
- Theo dõi deployment mới.

Không được tiếp tục kiểm thử production khi deployment đang failed hoặc pending.

## 6.5. Xác minh production đã nhận bản mới

Sau khi deployment báo thành công:

- Truy cập https://antifake.io.vn.
- Hard refresh.
- Kiểm tra asset hash nếu cần.
- Kiểm tra phiên bản hoặc thay đổi vừa sửa.
- Xóa cache trình duyệt nếu production vẫn hiển thị bản cũ.
- Kiểm tra CDN cache.
- Kiểm tra API đang gọi đúng backend mới.
- Không kết luận lỗi chưa sửa nếu frontend hoặc backend mới chưa thực sự được tải.

## 6.6. Kiểm thử lại

Sau khi xác minh deployment thành công:

1. Chạy lại flow vừa sửa.
2. Chạy các flow liên quan.
3. Kiểm tra console.
4. Kiểm tra network.
5. Reload trang.
6. Đăng xuất và đăng nhập lại nếu liên quan auth.
7. Kiểm tra trên desktop và mobile.
8. Xác nhận dữ liệu thay đổi đúng sau reload.

Một lỗi chỉ được đánh dấu là đã sửa khi hoàn thành:

```text
Sửa code
→ Test local
→ Commit
→ Push
→ Deploy thành công
→ Test production
→ Regression test
→ Xác nhận passed
```

---

# 7. Kiểm thử khách chưa đăng nhập

Kiểm tra:

1. Mở trang chủ.
2. Header.
3. Footer.
4. Menu.
5. Điều hướng.
6. Danh mục.
7. Tìm kiếm.
8. Bộ lọc.
9. Sắp xếp.
10. Chi tiết sản phẩm.
11. Trang shop.
12. Sản phẩm của shop.
13. Danh mục của shop.
14. Đánh giá shop.
15. Community.
16. Livestream.
17. Affiliate.
18. Link có mã affiliate `?aff=...`.
19. QR.
20. Trang login.
21. Trang register.
22. Trang lỗi.
23. Empty state.
24. Loading state.
25. Hành vi khi khách mở trang yêu cầu đăng nhập.

Kết quả mong đợi:

- Không có trang trắng.
- Không có lỗi JavaScript nghiêm trọng.
- Không có request lỗi bị bỏ qua.
- Không có nút chết.
- Không có route 404 ngoài dự kiến.
- Trang yêu cầu đăng nhập phải chuyển hướng hợp lý.
- Sau login có thể quay lại trang trước nếu hệ thống hỗ trợ.
- Menu không hiển thị chức năng sai quyền.

---

# 8. Kiểm thử xác thực

Kiểm tra:

1. Đăng nhập đúng.
2. Sai mật khẩu.
3. Email không tồn tại.
4. Email chưa xác minh.
5. Tài khoản suspended.
6. Đăng xuất.
7. Refresh sau login.
8. Access token hết hạn.
9. Refresh token.
10. Mở nhiều tab.
11. Google login.
12. Người dùng đóng popup Google.
13. Google login lỗi.
14. Quên mật khẩu.
15. Reset mật khẩu.
16. Email action.
17. Route protected.
18. Truy cập trực tiếp `/seller`.
19. Truy cập trực tiếp `/admin`.
20. Backend trả đúng `401` và `403`.
21. Không chỉ chặn ở frontend.
22. Session hết hạn.
23. Đăng xuất toàn bộ session nếu có.

Kiểm tra lỗi thường gặp:

- Redirect loop.
- Mất session khi reload.
- Loading không kết thúc.
- Submit form nhiều lần.
- Token refresh lặp vô hạn.
- Token lưu không an toàn.
- Google popup đóng nhưng UI vẫn loading.
- Error message quá kỹ thuật.
- User không đủ quyền nhưng vẫn nhìn thấy menu.

---

# 9. Kiểm thử hồ sơ và KYC

Đăng nhập bằng buyer.

## Hồ sơ

Kiểm tra:

- Xem hồ sơ.
- Sửa tên.
- Sửa số điện thoại.
- Avatar.
- Upload avatar.
- Validation file.
- Cài đặt tài khoản.
- Đổi mật khẩu nếu có.
- Ví.
- Lịch sử giao dịch.
- Notification.
- Đánh dấu đã đọc.

## Địa chỉ

Kiểm tra:

- Danh sách địa chỉ.
- Thêm.
- Sửa.
- Xóa.
- Đặt mặc định.
- Validation.
- Không cho xóa địa chỉ đang được dùng nếu nghiệp vụ không cho phép.
- Địa chỉ mặc định phải cập nhật đúng sau reload.

## KYC

Kiểm tra:

- Chưa KYC.
- Gửi hồ sơ.
- Upload mặt trước.
- Upload mặt sau.
- Loại file.
- Dung lượng.
- Trạng thái pending.
- Trạng thái rejected.
- Lý do từ chối.
- Gửi lại.
- Trạng thái verified.
- Khi đã verified, không hiển thị lại thông tin giấy tờ nhạy cảm không cần thiết.
- User không được xem KYC người khác.
- Admin được xem theo quyền.

---

# 10. Kiểm thử sản phẩm và giỏ hàng

Kiểm tra:

- Tìm kiếm.
- Lọc.
- Sắp xếp.
- Phân trang hoặc infinite scroll.
- Chi tiết sản phẩm.
- Ảnh.
- Biến thể.
- Giá.
- Giá khuyến mại.
- Số lượng.
- Hết hàng.
- Thông tin shop.
- Đánh giá.
- Yêu thích.
- Bỏ yêu thích.
- Danh sách yêu thích.
- Thêm giỏ hàng.
- Cập nhật số lượng.
- Xóa khỏi giỏ.
- Chọn từng sản phẩm.
- Chọn tất cả.
- Tổng tiền.
- Giá thay đổi.
- Sản phẩm ngừng bán.
- Sản phẩm hết tồn kho.
- Giỏ hàng của user này không được lộ cho user khác.
- Một user chỉ có đúng logic cart mà backend quy định.
- Refresh không làm mất dữ liệu giỏ.

---

# 11. Kiểm thử checkout và payment

Kiểm tra:

- Chọn địa chỉ.
- Chọn phương thức vận chuyển.
- Voucher.
- Mã affiliate.
- Phí vận chuyển.
- Giá sản phẩm.
- Giảm giá.
- Tổng tiền.
- Tạo đơn.
- Thanh toán thành công.
- Thanh toán thất bại.
- Hủy payment.
- Quay lại từ payment.
- Refresh callback.
- Mở callback nhiều lần.
- Không tạo đơn trùng.
- Không tạo payment intent trùng.
- Không trừ tồn kho hai lần.
- Không ghi commission hai lần.
- Không thay đổi giá bằng client.
- Backend phải tự tính lại tổng tiền.
- Xử lý voucher hết hạn.
- Voucher hết lượt.
- Voucher không đủ điều kiện.
- Affiliate code không hợp lệ.
- Affiliate self-referral nếu nghiệp vụ cấm.
- Payment callback giả.
- Payment status không đồng bộ.

Chỉ dùng sandbox hoặc test mode an toàn.

Không thực hiện thanh toán tiền thật nếu không được phép.

---

# 12. Kiểm thử đơn hàng người mua

Kiểm tra:

- Danh sách đơn.
- Lọc trạng thái.
- Chi tiết.
- Sản phẩm.
- Địa chỉ.
- Vận chuyển.
- Payment status.
- Hủy đơn.
- Không được hủy sai trạng thái.
- Xác nhận nhận hàng.
- Hoàn tất.
- Đánh giá.
- Upload ảnh đánh giá.
- Không đánh giá khi chưa mua.
- Không đánh giá khi đơn chưa hoàn tất.
- Không đánh giá hai lần nếu nghiệp vụ không cho phép.
- Khiếu nại.
- Tranh chấp.
- Upload bằng chứng.
- Theo dõi trạng thái tranh chấp.
- User không được xem đơn người khác bằng cách sửa ID.

---

# 13. Kiểm thử seller

Xác định tài khoản seed đang sở hữu shop và đăng nhập bằng tài khoản đó.

## Seller dashboard

Kiểm tra:

- Doanh thu.
- Đơn hàng.
- Sản phẩm.
- Thống kê.
- Biểu đồ.
- Khoảng thời gian.
- Loading.
- Empty state.
- Dữ liệu đúng shop.
- Seller không xem dữ liệu shop khác.

## Thông tin shop

Kiểm tra:

- Xem thông tin.
- Sửa thông tin.
- Logo.
- Banner.
- Ảnh.
- Thông tin doanh nghiệp.
- Upload giấy tờ.
- Trạng thái duyệt.
- Lý do từ chối.
- Gửi lại.
- Không sửa shop người khác.

## Sản phẩm seller

Kiểm tra:

- Danh sách.
- Search.
- Filter.
- Tạo sản phẩm.
- Sửa sản phẩm.
- Upload nhiều ảnh.
- Danh mục.
- Thương hiệu.
- Giá.
- Giá khuyến mại.
- Số lượng.
- Biến thể.
- Shipping method.
- Tài liệu.
- Lưu nháp.
- Gửi duyệt.
- Bị từ chối.
- Sửa và gửi lại.
- Ngừng bán.
- Không sửa sản phẩm shop khác.
- Validation.
- Loading.
- Thông báo thành công và thất bại.

## Batch và QR

Nếu frontend có hỗ trợ:

- Tạo batch.
- Sửa batch.
- Upload tài liệu.
- Liên kết batch với offer.
- Tạo verification label.
- Xem QR.
- Xem provenance.
- Quản lý số lượng mã.

Nếu backend có nhưng frontend chưa có:

- Ghi rõ trong báo cáo.
- Không báo là đã test.
- Đề xuất mức độ ưu tiên bổ sung UI.

## Seller orders

Kiểm tra:

- Danh sách.
- Chi tiết.
- Lọc trạng thái.
- Xác nhận.
- Chuẩn bị hàng.
- Giao hàng.
- Tracking.
- Hủy hoặc từ chối.
- Không chuyển trạng thái sai thứ tự.
- Không cập nhật đơn shop khác.
- Tồn kho.
- Doanh thu.
- Notification buyer.

## Seller wallet

Kiểm tra:

- Số dư.
- Số dư khả dụng.
- Số dư pending.
- Lịch sử.
- Yêu cầu rút.
- Validation số tiền.
- Không rút quá số dư.
- Không submit trùng.
- Trạng thái withdrawal.

## Seller voucher

Kiểm tra:

- Danh sách.
- Tạo.
- Sửa.
- Bật.
- Tắt.
- Ngày bắt đầu.
- Ngày kết thúc.
- Số lượng.
- Giá trị.
- Đơn tối thiểu.
- Phạm vi sản phẩm.
- Validation.

## Seller affiliate

Kiểm tra:

- Chương trình affiliate.
- Hoa hồng.
- Affiliate account.
- Conversion.
- Commission.
- Link.
- Mã giới thiệu.
- Doanh thu.
- Dữ liệu dashboard.
- Không xem dữ liệu shop khác.

## Seller live

Kiểm tra:

- Tạo phiên live.
- Thêm sản phẩm.
- Bắt đầu.
- Kết thúc.
- Camera.
- Microphone.
- Bình luận.
- Reaction.
- Ghim sản phẩm.
- Mất kết nối.
- Kết nối lại.
- Quyền host.
- User khác không được điều khiển phiên live.

---

# 14. Kiểm thử affiliate

Xác định affiliate là role riêng hay user có affiliate account.

Kiểm tra:

- Truy cập trang affiliate.
- Đăng ký.
- Trạng thái.
- Chương trình.
- Mã affiliate.
- Link affiliate.
- Copy link.
- Mở link trong cửa sổ ẩn danh.
- Attribution.
- Thêm sản phẩm vào giỏ.
- Checkout.
- Conversion.
- Commission ledger.
- Payout.
- Đơn bị hủy.
- Payment thất bại.
- Conversion trùng.
- Refresh.
- Self-referral.
- Chỉnh mã affiliate phía client.
- Không ghi commission hai lần.
- Không xem ledger người khác.
- Không dùng affiliate code hết hạn hoặc disabled.

---

# 15. Kiểm thử community

Kiểm tra:

- Danh sách bài viết.
- Tạo bài.
- Sửa bài.
- Xóa bài.
- Ảnh.
- Bình luận.
- Trả lời bình luận.
- Like bình luận.
- Like reply.
- Reaction bài viết.
- Share.
- Report.
- Phân trang.
- Infinite scroll.
- Loading.
- Empty state.
- Không xóa bài người khác.
- Không sửa bình luận người khác.
- Nội dung dài.
- Nội dung trống.
- XSS.
- Spam submit.
- Dữ liệu cập nhật sau reload.

---

# 16. Kiểm thử chat

Kiểm tra buyer và seller bằng hai session trình duyệt khác nhau.

Kiểm tra:

- Tạo thread.
- Mở chat từ sản phẩm.
- Mở chat từ shop.
- Gửi tin nhắn.
- Nhận realtime.
- Trạng thái gửi.
- Không gửi trùng.
- Lịch sử.
- Cuộn.
- Pagination.
- Refresh.
- Unread.
- Mark read.
- Mất mạng.
- Kết nối lại.
- Nhiều tab.
- WebSocket authorization.
- Buyer không đọc chat người khác.
- Seller không đọc chat shop khác.
- Admin không được đọc chat riêng nếu nghiệp vụ không cho phép.
- Route `/chat/:roomId`.
- Route `/seller/chat/:roomId`.
- Route `/admin/chat/:roomId`.

---

# 17. Kiểm thử livestream

Kiểm tra:

- Danh sách livestream.
- Trạng thái scheduled.
- Trạng thái live.
- Trạng thái ended.
- Vào phòng.
- Video.
- Camera.
- Microphone.
- Bình luận realtime.
- Reaction.
- Sản phẩm được ghim.
- Mở sản phẩm.
- Nhắc lịch.
- Seller bắt đầu phiên.
- Seller kết thúc phiên.
- User không phải host không được điều khiển.
- Mất mạng.
- Kết nối lại.
- Từ chối quyền camera.
- Từ chối microphone.
- Agora token.
- Session hết hạn.
- Refresh khi đang live.
- Rời phòng.

---

# 18. Kiểm thử QR và chống hàng giả

Kiểm tra:

- Nhập mã hợp lệ.
- Quét mã hợp lệ.
- Mã không tồn tại.
- Mã sai định dạng.
- Mã đã quét nhiều lần.
- Mã có risk score cao.
- Mã bị khóa.
- Mã thuộc sản phẩm.
- Batch.
- Provenance.
- Distribution event.
- Thời gian sự kiện.
- Thứ tự sự kiện.
- Không làm lộ dữ liệu nội bộ.
- Không cho client tự sửa kết quả xác thực.
- Loading.
- Error message.
- Mobile camera nếu có.

---

# 19. Kiểm thử admin

Đăng nhập bằng admin seed.

## Dashboard

Kiểm tra:

- Số liệu.
- Biểu đồ.
- User.
- Shop.
- Product.
- Order.
- Revenue.
- Loading.
- Empty state.
- Dữ liệu đúng API.

## User management

Kiểm tra:

- Danh sách.
- Search.
- Filter.
- Chi tiết.
- Trạng thái.
- Suspend.
- Unsuspend.
- KYC.
- Audit log.
- Không tự khóa chính admin đang dùng nếu nghiệp vụ không cho phép.

## Shop verification

Kiểm tra:

- Danh sách hồ sơ.
- Chi tiết.
- Tài liệu.
- Approve.
- Reject.
- Lý do từ chối.
- Seller nhận trạng thái.
- Notification.
- Không xử lý lại trạng thái sai.
- Không duyệt khi thiếu dữ liệu bắt buộc.

## Product verification

Kiểm tra:

- Danh sách.
- Chi tiết.
- Tài liệu.
- Approve.
- Reject.
- Lý do.
- Seller nhận kết quả.
- Product chỉ public khi đủ điều kiện.
- Không duyệt lại sai trạng thái.

## Category

Kiểm tra:

- Danh sách.
- Tạo.
- Sửa.
- Bật.
- Tắt.
- Parent category.
- Không tạo vòng lặp.
- Không xóa category đang được dùng nếu backend cấm.
- Validation slug hoặc name nếu có.

## Voucher admin

Kiểm tra:

- Danh sách.
- Tạo.
- Sửa.
- Tắt.
- Điều kiện.
- Ngày.
- Số lượng.
- Validation.

## Wallet và withdrawal

Kiểm tra:

- Tổng quan.
- Ledger.
- Yêu cầu rút.
- Approve.
- Reject.
- Không xử lý hai lần.
- Số dư cập nhật đúng.
- Audit log.
- Notification seller.

## Moderation và report

Nếu có UI:

- Danh sách report.
- Chi tiết.
- Evidence.
- Moderation case.
- Action.
- Reason.
- Audit log.
- Notification.

Nếu backend có nhưng chưa có UI, ghi rõ là chức năng chưa được expose trên frontend.

---

# 20. Kiểm thử phân quyền và bảo mật

Thử trực tiếp URL và request của role khác.

Tối thiểu:

- Buyer mở `/admin`.
- Buyer mở `/seller`.
- User chưa có shop mở seller dashboard.
- Seller mở dữ liệu shop khác.
- User sửa `userId`.
- User sửa `shopId`.
- User sửa `orderId`.
- User sửa `offerId`.
- User sửa `roomId`.
- User sửa `withdrawalId`.
- User xem KYC người khác.
- User xem wallet người khác.
- Seller xem order shop khác.
- Affiliate xem ledger người khác.
- Gọi API không token.
- Token sai role.
- Token hết hạn.
- Client sửa giá.
- Client sửa tổng tiền.
- Client sửa commission.
- Client sửa trạng thái order.
- Upload file không hợp lệ.
- Upload file giả MIME.
- HTML hoặc script trong input.
- Request lặp.
- Submit nhiều lần.
- IDOR.
- Missing ownership check.
- Chỉ bảo vệ frontend nhưng backend không kiểm tra.

Sửa các lỗi phân quyền ở backend, không chỉ ẩn nút frontend.

Không triển khai workaround làm giảm bảo mật.

---

# 21. Kiểm tra giao diện và trải nghiệm

Trong khi test từng trang, đánh giá giao diện.

Sửa các vấn đề:

- Giao diện không đồng nhất.
- Trang affiliate không ăn khớp hệ thống.
- Seller, admin và user khác phong cách quá mức.
- Khoảng cách lộn xộn.
- Font không nhất quán.
- Cỡ chữ không hợp lý.
- Icon không đồng nhất.
- Button quá lớn hoặc quá nhỏ.
- Card thiếu căn chỉnh.
- Table khó đọc.
- Form thiếu label.
- Modal quá dài.
- Nội dung tràn.
- Responsive vỡ.
- Sidebar che nội dung.
- Table không dùng được trên mobile.
- Loading state sơ sài.
- Thiếu skeleton.
- Thiếu empty state.
- Thiếu error state.
- Nút submit không có loading.
- Không disable khi đang submit.
- Thông báo lỗi quá kỹ thuật.
- Trộn tiếng Anh và tiếng Việt không cần thiết.
- Màu tương phản kém.
- Thiếu focus state.
- Layout bị nhảy.
- Hình ảnh méo.
- Text dài phá giao diện.
- Form validation khó hiểu.

Nguyên tắc sửa UI:

1. Giữ nhận diện AntiFake.
2. Không redesign toàn bộ tùy hứng.
3. Tái sử dụng component.
4. Dùng design token chung nếu hợp lý.
5. Không thay đổi nghiệp vụ chỉ để làm đẹp.
6. Seller, admin và user phải cùng một hệ thống thiết kế.
7. Không dùng emoji thay icon.
8. Dùng icon library hiện có.
9. Có hover, focus, disabled, loading.
10. Kiểm tra desktop và mobile.
11. Chụp ảnh trước và sau đối với thay đổi lớn.

---

# 22. Kiểm tra kỹ thuật

## Frontend

Chạy:

```bash
npm install
npm run lint
npm run build
npm run test:auth
npm run test:live
npm run test:payos
```

Chạy thêm Playwright E2E test vừa tạo.

Kiểm tra:

- TypeScript.
- ESLint.
- Console error.
- Network error.
- Request lặp.
- CORS.
- Cookie.
- Token.
- Firebase.
- PayOS.
- Agora.
- WebSocket.
- SSE.
- FCM.
- Upload.
- React render bất thường.
- Memory leak cơ bản.
- Route.
- Responsive.

## Backend

Chạy các script tương ứng có trong `package.json`:

- Install.
- Lint.
- Build.
- Unit test.
- Integration test.
- Prisma validation.
- Kiểm tra migration.
- Health check.

Không chạy seed trên production.

Không tự ý migrate production khi chưa xác định quy trình deployment.

Không coi flow là passed nếu chỉ nhìn thấy màn hình. Phải xác nhận dữ liệu đúng qua reload hoặc API.

---

# 23. Ghi nhận lỗi

Tạo:

```text
docs/UAT_ISSUES.md
```

Mỗi lỗi theo mẫu:

```md
## AF-UAT-001 — Tên lỗi

- Mức độ: Blocker / Critical / Major / Minor
- Role:
- Môi trường:
- URL:
- Tiền điều kiện:
- Các bước tái hiện:
- Kết quả thực tế:
- Kết quả mong đợi:
- Nguyên nhân:
- Repository:
- File đã sửa:
- Commit:
- Deployment:
- Cách sửa:
- Cách xác minh local:
- Cách xác minh production:
- Regression test:
- Screenshot:
- Trạng thái:
```

Ưu tiên:

1. Bảo mật và phân quyền.
2. Login.
3. Checkout.
4. Payment.
5. Sai tiền.
6. Sai tồn kho.
7. Sai commission.
8. Sai wallet.
9. Mất dữ liệu.
10. Luồng bị chặn.
11. API.
12. Realtime.
13. UI và responsive.
14. Lỗi nhỏ.

---

# 24. Báo cáo kiểm thử

Tạo:

```text
docs/UAT_REPORT.md
```

Nội dung:

- Phạm vi kiểm thử.
- Môi trường.
- Commit frontend đã kiểm thử.
- Commit backend đã kiểm thử.
- Deployment tương ứng.
- Tổng số test case.
- Passed.
- Failed.
- Blocked.
- Not applicable.
- Lỗi đã sửa.
- Lỗi chưa sửa.
- Rủi ro còn lại.
- Flow đã xác minh production.
- Flow chỉ xác minh local.
- Flow không thể kiểm thử.
- Dịch vụ ngoài bị thiếu cấu hình.
- Chức năng backend chưa có UI.
- Trang frontend dùng mock.
- API chưa được frontend sử dụng.
- Kết quả desktop.
- Kết quả mobile.
- Kết quả regression.
- Kết quả lint.
- Kết quả build.
- Kết quả automated test.

---

# 25. Tài liệu hướng dẫn sử dụng AntiFake

Sau khi các flow ổn định, tạo:

```text
docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md
```

Viết bằng tiếng Việt, dành cho người dùng không chuyên kỹ thuật.

## 25.1. Giới thiệu

Bao gồm:

- AntiFake là gì.
- Mục đích.
- Địa chỉ truy cập.
- Các nhóm người dùng.
- Các chức năng chính.
- Lưu ý khi sử dụng.

## 25.2. Các role

Tạo bảng:

```md
| Role hoặc nhóm người dùng | Đối tượng | Điều kiện | Quyền chính |
| ------------------------- | --------- | --------- | ----------- |
```

Phân biệt:

- Khách.
- Buyer.
- Seller.
- Affiliate.
- Admin.
- Các quyền hoặc trạng thái khác có thật trong code.

Không tự bịa role.

## 25.3. Chức năng theo role

Tạo bảng:

```md
| Role | Nhóm chức năng | Chức năng |
| ---- | -------------- | --------- |
```

## 25.4. Sơ đồ flow

Dùng Mermaid cho các flow thực sự hoạt động:

- Đăng ký.
- Đăng nhập.
- Google login.
- KYC.
- Đăng ký shop.
- Duyệt shop.
- Tạo sản phẩm.
- Duyệt sản phẩm.
- Mua hàng.
- Checkout.
- Payment.
- Xử lý order.
- Đánh giá.
- Tranh chấp.
- Affiliate.
- QR.
- Chat.
- Livestream.
- Wallet.
- Withdrawal.
- Moderation.

Không mô tả chức năng chưa hoạt động như đã hoàn thành.

## 25.5. Hướng dẫn từng flow

Mỗi flow phải có:

- Mục đích.
- Role thực hiện.
- Điều kiện.
- Các bước đánh số.
- Kết quả.
- Lưu ý.
- Lỗi thường gặp.
- Hình ảnh minh họa.

Ví dụ:

```md
## Mua hàng và thanh toán

### Điều kiện

- Đã đăng nhập.
- Có địa chỉ nhận hàng.
- Sản phẩm còn hàng.

### Các bước

1. Mở trang chi tiết sản phẩm.
2. Chọn phân loại.
3. Chọn số lượng.
4. Nhấn **Thêm vào giỏ hàng**.
5. Mở giỏ hàng.
6. Chọn sản phẩm.
7. Nhấn **Thanh toán**.
8. Chọn địa chỉ.
9. Chọn phương thức vận chuyển.
10. Áp dụng voucher hoặc mã affiliate nếu có.
11. Kiểm tra tổng tiền.
12. Nhấn **Đặt hàng**.
13. Hoàn tất thanh toán.

### Kết quả

Đơn hàng xuất hiện trong mục **Đơn mua**.
```

## 25.6. FAQ

Bao gồm:

- Không đăng nhập được.
- Không nhận được email.
- Google login lỗi.
- Không upload được ảnh.
- Không tìm thấy đơn.
- Thanh toán thất bại.
- QR không hợp lệ.
- Không vào được seller.
- Không vào được admin.
- Chat không realtime.
- Livestream không có camera.
- Không áp dụng được voucher.
- Không ghi nhận affiliate.
- Không rút được tiền.

---

# 26. Hình ảnh minh họa

Chụp screenshot thật từ:

https://antifake.io.vn

Chỉ chụp sau khi deployment cuối cùng đã thành công.

Lưu:

```text
docs/images/
  auth/
  buyer/
  seller/
  affiliate/
  admin/
  qr/
  chat/
  live/
  payment/
  order/
```

Yêu cầu:

- Ảnh rõ.
- Không chứa token.
- Không chứa cookie.
- Không chứa secret.
- Che email cá nhân nếu cần.
- Che số điện thoại.
- Che địa chỉ.
- Che CCCD.
- Che thông tin thanh toán.
- Tên file có ý nghĩa.
- Dùng đường dẫn tương đối trong Markdown.
- Không dùng ảnh cũ nếu giao diện đã sửa.
- Chụp cả desktop và mobile đối với màn hình quan trọng.
- Chụp trước và sau đối với trang được cải thiện đáng kể.

---

# 27. Automated tests cần bổ sung

Tạo Playwright test theo nhóm:

```text
e2e/
  auth.spec.ts
  guest.spec.ts
  buyer.spec.ts
  seller.spec.ts
  affiliate.spec.ts
  admin.spec.ts
  cart-checkout.spec.ts
  orders.spec.ts
  chat.spec.ts
  live.spec.ts
  qr.spec.ts
  permissions.spec.ts
  responsive.spec.ts
```

Không cần ép mọi flow bên ngoài như payment production phải tự động hoàn toàn nếu không an toàn.

Với flow không thể tự động, ghi rõ manual test.

Không hard-code ID dễ thay đổi nếu có thể tìm dữ liệu qua UI hoặc API.

---

# 28. Kết quả cần bàn giao

Sau khi hoàn thành phải có:

1. Code frontend đã sửa.
2. Code backend đã sửa nếu cần.
3. Playwright E2E tests.
4. `docs/UAT_TEST_MATRIX.md`.
5. `docs/UAT_ISSUES.md`.
6. `docs/UAT_REPORT.md`.
7. `docs/HUONG_DAN_SU_DUNG_ANTIFAKE.md`.
8. `docs/images/**`.
9. Danh sách chức năng chưa thể test.
10. Danh sách backend chưa có UI.
11. Danh sách frontend dùng mock.
12. Danh sách API chưa nối.
13. Kết quả lint.
14. Kết quả build.
15. Kết quả test.
16. Danh sách commit.
17. Trạng thái deployment.
18. Commit frontend cuối cùng đã test.
19. Commit backend cuối cùng đã test.
20. Danh sách file thay đổi.

---

# 29. Quy tắc hoàn thành

Không được kết luận hoàn thành nếu:

- Chưa thao tác bằng trình duyệt thật.
- Chỉ đọc code.
- Chỉ test API.
- Chỉ test happy path.
- Chưa test phân quyền.
- Chưa test mobile.
- Chưa test lại sau sửa.
- Chưa commit.
- Chưa push.
- Deployment chưa thành công.
- Chưa xác minh đúng commit đã lên production.
- Còn build lỗi.
- Còn lint lỗi nghiêm trọng.
- Còn console error nghiêm trọng.
- Tài liệu mô tả chức năng không tồn tại.
- Screenshot không khớp giao diện cuối.
- Dùng mock nhưng báo là API thật.
- Flow bị blocked nhưng không ghi rõ.
- Chưa regression test.
- Chỉ chờ 10 phút nhưng không xác minh website đã cập nhật.
- Test production trong khi deployment đang pending hoặc failed.

---

# 30. Báo cáo cuối cùng

Khi hoàn thành, trả về:

```md
## Tổng quan

- Frontend repository:
- Backend repository:
- Website:
- Frontend commit đã kiểm thử:
- Backend commit đã kiểm thử:
- Deployment status:

## Kết quả kiểm thử

- Tổng số test case:
- Passed:
- Failed:
- Blocked:
- Not applicable:
- Automated tests added:

## Lỗi đã sửa

- Frontend issues fixed:
- Backend issues fixed:
- Permission issues fixed:
- UI pages improved:

## Deployment

- Số lần commit:
- Số lần deploy:
- Deployment failed:
- Deployment successful:
- Commit production cuối cùng:

## Tài liệu

- UAT test matrix:
- UAT issues:
- UAT report:
- Hướng dẫn sử dụng:
- Screenshot folders:

## Chức năng chưa hoàn thành

- ...

## Chức năng backend chưa có UI

- ...

## Frontend còn dùng mock

- ...

## Rủi ro còn lại

- ...

## Các file chính đã thay đổi

- ...
```

Bắt đầu bằng việc đọc cả hai repository và lập ma trận:

```text
Role
→ Frontend route
→ API backend
→ Seed account
→ Tiền điều kiện
→ Flow
→ Dữ liệu thay đổi
→ Quyền truy cập
→ Test case
```

Sau đó kiểm thử production, sửa lỗi, chạy test local, commit, push, theo dõi deployment và chỉ kiểm thử lại trên https://antifake.io.vn sau khi xác minh deployment thành công.

Không dừng ở bước lập kế hoạch.
