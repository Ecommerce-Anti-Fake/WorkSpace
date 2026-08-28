# VPS Deployment Runbook

## 1. Mục đích và trạng thái

Tài liệu này là hướng dẫn vận hành cho lần deploy AntiFake lên VPS Ubuntu trong
tương lai. Các file PM2, Nginx và script deploy đã được chuẩn bị trong source,
nhưng việc tạo VPS, đổi DNS, cấp SSL, tạo secret, chạy migration và khởi động
production **chưa được thực hiện**.

Runbook không thay đổi các nguyên tắc hiện tại:

- PostgreSQL là nguồn dữ liệu bền vững và Prisma quản lý migration.
- Redis chỉ phục vụ realtime/cache tạm thời.
- Ảnh tiếp tục được lưu và phân phối qua Cloudinary.
- Livestream dùng Agora RTC; replay/recording không thuộc cutover hiện tại.
- VPS không lưu media lâu dài và không cung cấp CDN riêng.
- Không seed production, không chạy `prisma migrate reset`, không sửa migration
  cũ và không tự rollback database.

## 2. Kiến trúc đích

```text
Internet
  |
  +-- antifake.io.vn / www.antifake.io.vn
  |     Nginx -> anti-fake-front-end/dist
  |
  +-- api.antifake.io.vn
        Nginx :443 -> 127.0.0.1:10000
                         |
                         +-- API Gateway + Socket.IO /api/socket.io
                         +-- auth-service      127.0.0.1:4001
                         +-- users-service     127.0.0.1:4002
                         +-- catalog-service   127.0.0.1:4003
                         +-- orders-service    127.0.0.1:4004
                         +-- affiliate-service 127.0.0.1:4005
                         +-- Redis             127.0.0.1:6379
                         +-- PostgreSQL        DATABASE_URL
```

PM2 chỉ chạy một instance `antifake-api`. Tiến trình này dùng
`scripts/start-deploy.js` để nạp đúng artifact `deploy-main.js`; không chạy
`dist/apps/api-gateway/main.js`, vì entrypoint đó không bootstrap toàn bộ các
microservice nội bộ.

## 3. Cấu hình VPS khuyến nghị

Mức khởi đầu:

- Ubuntu Server 24.04 LTS, kiến trúc x86_64.
- Node.js 24 LTS.
- 2 vCPU, 4 GB RAM, 40-80 GB NVMe nếu PostgreSQL nằm ngoài VPS.
- 4 vCPU, 8 GB RAM nếu PostgreSQL cũng chạy trên cùng VPS.
- Swap 2-4 GB để giảm rủi ro OOM trong lúc `npm ci` và build.
- IP tĩnh và backup/snapshot định kỳ.

Node.js 24 đang là nhánh LTS theo
[Node.js release schedule](https://nodejs.org/en/about/previous-releases).

## 4. Tạo user deploy

Đăng nhập lần đầu bằng tài khoản có quyền quản trị, sau đó tạo user riêng:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /var/www/antifake
sudo chown -R deploy:deploy /var/www/antifake
```

Đăng xuất và đăng nhập lại bằng `deploy`. Không chạy Node.js hoặc PM2 bằng
`root`. Chỉ dùng `sudo` cho cài package, firewall, Nginx, Certbot và systemd.

Nên cấu hình SSH key, tắt đăng nhập mật khẩu sau khi đã kiểm tra key hoạt động,
và giới hạn sudo của script frontend cho `nginx -t` cùng reload Nginx nếu cần
tự động hóa hoàn toàn.

## 5. Cài phần mềm hệ thống

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl ca-certificates nginx redis-server ufw snapd
```

Cài Node.js 24 từ NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
rm /tmp/nodesource_setup.sh
```

Sau đó kiểm tra:

```bash
node --version
npm --version
```

Kết quả Node phải là `v24.x`. Tiếp theo cài PM2:

```bash
sudo npm install -g pm2
pm2 --version
```

Cài Certbot theo hướng dẫn snap chính thức:

```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/local/bin/certbot
```

Tham khảo:
[Certbot Nginx instructions](https://certbot.eff.org/instructions?os=snap&tab=standard&ws=nginx).

## 6. Cấu hình Redis

Trong `/etc/redis/redis.conf`, giữ Redis chỉ trên loopback:

```text
bind 127.0.0.1 ::1
protected-mode yes
```

Khởi động và kiểm tra:

```bash
sudo systemctl enable --now redis-server
redis-cli ping
sudo ss -lntp | grep 6379
```

Kết quả `redis-cli` phải là `PONG`; port 6379 không được listen trên public IP.

## 7. PostgreSQL

Khuyến nghị dùng PostgreSQL managed hoặc một database server được backup riêng.
Nếu PostgreSQL nằm cùng VPS:

- Chỉ bind `127.0.0.1`.
- Không mở UFW port 5432.
- Tạo database/user riêng với quyền tối thiểu.
- Thiết lập backup và thử restore trước lần deploy đầu tiên.

`DATABASE_URL` phải dùng connection string thật trong `.env` backend. Không ghi
connection string vào source, Nginx, PM2 config hoặc tài liệu.

## 8. DNS tại PA Việt Nam

Tạo ba bản ghi A:

| Loại | Host | Giá trị |
|---|---|---|
| A | `@` | IP public của VPS |
| A | `www` | IP public của VPS |
| A | `api` | IP public của VPS |

Không tạo proxy/CDN riêng. Chờ DNS propagate rồi kiểm tra:

```bash
dig +short antifake.io.vn
dig +short www.antifake.io.vn
dig +short api.antifake.io.vn
```

Ba kết quả phải trỏ tới IP VPS trước khi chạy Certbot.

## 9. Clone hai repository

```bash
cd /var/www/antifake
git clone <BACKEND_REPOSITORY_URL> back-end
git clone <FRONTEND_REPOSITORY_URL> anti-fake-front-end
```

Các URL repository và branch production chưa được source xác định; người vận
hành phải thay placeholder bằng URL/branch được duyệt.

## 10. Tạo backend `.env`

```bash
cd /var/www/antifake/back-end
cp .env.example .env
chmod 600 .env
nano .env
```

Các giá trị public production tối thiểu:

```dotenv
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://antifake.io.vn
BACKEND_PUBLIC_URL=https://api.antifake.io.vn
CORS_ALLOWED_ORIGINS=https://antifake.io.vn,https://www.antifake.io.vn,https://api.antifake.io.vn
API_JSON_BODY_LIMIT=5mb
REDIS_ENABLED=true
REDIS_URL=redis://127.0.0.1:6379/0
```

Phải tự điền secret thật cho:

- `DATABASE_URL`
- `JWT_SECRET`, `REFRESH_TOKEN_SECRET`
- `AFFILIATE_ATTRIBUTION_SECRET`
- `PAYOUT_ACCOUNT_ENCRYPTION_KEY`
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `AGORA_APP_CERTIFICATE`
- `FIREBASE_PRIVATE_KEY`
- `PAYOS_API_KEY`, `PAYOS_CHECK_SUM_KEY`
- `GHN_TOKEN`
- `VIETQR_API_KEY`

Các nhóm cấu hình cần rà soát:

- JWT: `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, API key và API secret.
- Agora RTC: `AGORA_APP_ID`, backend-only `AGORA_APP_CERTIFICATE`, và
  `AGORA_RTC_TOKEN_TTL_SECONDS=3600` trong khoảng `60..86400`.
- Firebase Admin: project ID, client email và private key. Private key nhiều
  dòng phải được lưu bằng chuỗi `\n` đúng cách.
- PayOS: client ID, API key, checksum key và các override return/cancel URL nếu
  thực sự cần.
- GHN, VietQR, affiliate, withdrawal/COD flags và rate-limit overrides.

Ưu tiên `PAYOS_CHECK_SUM_KEY`. `PAYOS_CHECKSUM_KEY`, `API_PUBLIC_URL` và
`CORS_ORIGIN` chỉ là alias tương thích; không cần cấu hình nếu tên chính đã có.
`FIREBASE_PRIVATE_KEY_ID` có thể xuất hiện trong service account nhưng source
hiện không đọc biến này.

Production phải có `BACKEND_PUBLIC_URL`; backend sẽ từ chối tạo PayOS link nếu
URL public này bị thiếu.

## 11. Callback và webhook production

### Agora RTC

Agora không callback trạng thái commerce cho flow này. Backend phát AccessToken2
và PostgreSQL là nguồn sự thật cho trạng thái session; callback SDK phía browser
không được tự chuyển session sang `LIVE`.

Trong Agora Console:

- bật App Certificate;
- bật Co-Host authentication;
- xác nhận `AGORA_APP_ID` khớp project production;
- không đưa `AGORA_APP_CERTIFICATE` vào frontend hoặc log.

Cutover provider là thao tác riêng, idempotent và không được tự động chạy trong
startup, seed, `prisma migrate deploy` hoặc script deploy bình thường:

1. drain traffic tạo/start/join livestream;
2. backup PostgreSQL và ghi nhận revision đang deploy;
3. deploy backend/frontend tương thích với Agora;
4. chạy thủ công `npm run live:cutover-agora`;
5. lệnh phải từ chối nếu còn session Cloudflare `LIVE`;
6. chỉ migrate session Cloudflare `SCHEDULED` sang `AGORA_RTC`, giữ nguyên lịch
   sử `ENDED`/`CANCELLED`;
7. restart, mở lại traffic và chạy smoke hai browser.

### PayOS

Source hiện có:

```text
GET  https://api.antifake.io.vn/api/orders/payos/return
POST https://api.antifake.io.vn/api/orders/payos/webhook
GET  https://api.antifake.io.vn/api/wallet/top-ups/payos/return
POST https://api.antifake.io.vn/api/wallet/top-ups/payos/webhook
```

PayOS return/cancel chỉ phục vụ điều hướng UX; webhook có chữ ký mới là nguồn
sự thật cho trạng thái thanh toán.

Source có hai webhook nhận hai loại giao dịch nhưng không thể hiện từ code việc
tài khoản PayOS production hỗ trợ nhiều destination hay dùng credential/channel
riêng. Phải xác nhận điều này trong dashboard PayOS trước deploy. Không tự gộp
hai route hoặc đổi logic thanh toán trong bước cấu hình VPS.

## 12. Tạo frontend `.env`

```bash
cd /var/www/antifake/anti-fake-front-end
cp .env.example .env
chmod 600 .env
nano .env
```

Giữ:

```dotenv
VITE_API_BASE_URL=https://api.antifake.io.vn
VITE_SOCKET_URL=https://api.antifake.io.vn
```

Không thêm `/api` vào `VITE_API_BASE_URL`: frontend hiện tự ghép `/api/...`.
Socket.IO dùng origin riêng và path `/api/socket.io`.

Điền các biến Firebase Web public theo Firebase project production. Biến
`VITE_*` được đóng vào bundle tại thời điểm build, nên thay đổi `.env` yêu cầu
build frontend lại.

## 13. Build và khởi động backend

Lần đầu hoặc mỗi lần deploy:

```bash
cd /var/www/antifake/back-end
bash scripts/deploy-vps.sh
```

Script thực hiện theo thứ tự:

1. `git pull --ff-only`
2. `npm ci`
3. merge split Prisma schema
4. `prisma generate`
5. build API Gateway deployment artifact
6. `prisma migrate deploy`
7. reload PM2 và lưu process list

Script không seed. Trước migration production, luôn có backup mới và kiểm tra
migration pending:

```bash
npx prisma migrate status
```

Cấu hình PM2 startup cho user `deploy`:

```bash
pm2 startup systemd -u deploy --hp /home/deploy
```

Chạy lệnh `sudo` mà PM2 in ra, rồi:

```bash
pm2 save
pm2 status
pm2 logs antifake-api --lines 100
```

## 14. Build frontend

```bash
cd /var/www/antifake/anti-fake-front-end
npm ci
npm run build
test -f dist/index.html
```

Sau khi Nginx đã được cài đặt, các lần deploy sau có thể dùng:

```bash
bash scripts/deploy-vps.sh
```

Script chỉ reload Nginx sau khi build thành công và `nginx -t` pass.

## 15. Cấu hình Nginx

```bash
sudo cp /var/www/antifake/back-end/deploy/nginx/api.antifake.io.vn.conf \
  /etc/nginx/sites-available/api.antifake.io.vn
sudo cp /var/www/antifake/anti-fake-front-end/deploy/nginx/antifake.io.vn.conf \
  /etc/nginx/sites-available/antifake.io.vn

sudo ln -s /etc/nginx/sites-available/api.antifake.io.vn \
  /etc/nginx/sites-enabled/api.antifake.io.vn
sudo ln -s /etc/nginx/sites-available/antifake.io.vn \
  /etc/nginx/sites-enabled/antifake.io.vn

sudo nginx -t
sudo systemctl reload nginx
```

Nếu default site còn bật, chỉ unlink nó sau khi hai site mới đã pass syntax:

```bash
sudo unlink /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Nginx API proxy tới `127.0.0.1:10000`, hỗ trợ WebSocket/Socket.IO và giới hạn
request 60 MB để bao phủ endpoint tối đa 10 file, mỗi file 5 MB. Đây không phải
media storage; backend vẫn chuyển nội dung hợp lệ tới Cloudinary.

## 16. SSL Let's Encrypt

Sau khi HTTP và DNS hoạt động:

```bash
sudo certbot --nginx -d antifake.io.vn -d www.antifake.io.vn
sudo certbot --nginx -d api.antifake.io.vn
sudo certbot renew --dry-run
```

Chọn redirect HTTP sang HTTPS. Kiểm tra Certbot đã tạo server HTTPS cho cả
domain chính, `www` và `api`; `www` phải redirect về `https://antifake.io.vn`.

## 17. Firewall

Kiểm tra SSH port trước khi bật UFW. Với SSH mặc định:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

Không mở:

- Backend `10000`
- Microservice `4001-4005`
- PostgreSQL `5432`
- Redis `6379`

`0.0.0.0:10000` của API Gateway chỉ được Nginx truy cập nhờ firewall; không
publish port này trong security group của nhà cung cấp VPS.

## 18. Kiểm tra sau deploy

### Nginx và frontend

```bash
curl -I https://antifake.io.vn
curl -I https://www.antifake.io.vn
curl -I https://antifake.io.vn/profile
```

Kỳ vọng `www` redirect về domain chính và route React không trả 404.

### Health và API

```bash
curl -fsS https://api.antifake.io.vn/api/health
curl -I https://api.antifake.io.vn
```

Health phải trả `status: ok`, service `api-gateway`.

### CORS và refresh cookie

```bash
curl -i -X OPTIONS https://api.antifake.io.vn/api/auth/refresh \
  -H "Origin: https://antifake.io.vn" \
  -H "Access-Control-Request-Method: POST"
```

Kỳ vọng:

- `Access-Control-Allow-Origin: https://antifake.io.vn`
- `Access-Control-Allow-Credentials: true`
- Không có wildcard `*`

Thực hiện login bằng tài khoản staging/test và kiểm tra `Set-Cookie`:

- `eaf_refresh_token`
- `HttpOnly`
- `Secure`
- `SameSite=None`
- `Path=/api/auth`

Sau đó gọi `/api/auth/refresh` với cookie jar hoặc kiểm tra từ browser với
`credentials: include`.

### Socket.IO

```bash
curl -i "https://api.antifake.io.vn/api/socket.io/?EIO=4&transport=polling"
```

Handshake phải trả packet mở đầu có `sid`. Sau đó đăng nhập frontend, kiểm tra
WebSocket upgrade và chat/live event trong Network tab.

### Redis

```bash
redis-cli ping
pm2 logs antifake-api --lines 100
```

Log phải cho biết Redis adapter được bật; nếu fallback local xuất hiện, kiểm tra
`REDIS_URL` và Redis service trước khi tiếp tục.

### Cloudinary

- Upload một ảnh test bằng flow hiện có.
- URL kết quả phải thuộc Cloudinary.
- Reload trang và xác nhận ảnh vẫn tải được.
- Không có file upload tồn tại lâu dài trong repository hoặc thư mục VPS.

### Agora RTC

- Xác nhận App Certificate và Co-Host authentication đã bật.
- Tạo seller session; response no-store phải trả access `PUBLISHER` top-level
  nhưng không chứa App Certificate.
- Browser seller cấp quyền camera/microphone, publish cả hai track thành công,
  rồi mới gọi `/start`.
- Browser thứ hai join sau khi session `LIVE`, nhận `SUBSCRIBER`, phát được
  audio/video và không thể publish.
- Kiểm tra anonymous/non-owner không join trước `LIVE`; alias
  `/broadcast-credentials` chỉ cho owner.
- Kiểm tra renew token bằng cùng `clientId`, UID ổn định, media không gián đoạn.
- End/cancel phải cleanup track/client; không có Cloudflare iframe/replay.
- Không log token, UID mapping input hoặc App Certificate.

### PayOS

- Xác nhận dashboard webhook/callback dùng `api.antifake.io.vn`.
- Thực hiện giao dịch giá trị nhỏ trên staging cho order và wallet top-up.
- Xác nhận chữ ký webhook, amount và trạng thái idempotent.
- Callback trình duyệt không tự ghi payment/ledger state.

## 19. Log và chẩn đoán

```bash
pm2 status
pm2 monit
pm2 logs antifake-api --lines 200
sudo tail -n 200 /var/log/nginx/access.log
sudo tail -n 200 /var/log/nginx/error.log
sudo journalctl -u nginx -n 200 --no-pager
sudo journalctl -u redis-server -n 200 --no-pager
```

Không paste secret, JWT, Firebase private key, PayOS checksum, Agora token hoặc
App Certificate vào ticket/log.

## 20. Rollback

Trước mỗi deploy, ghi lại commit hiện tại và backup database:

```bash
git rev-parse HEAD
npx prisma migrate status
```

Nếu build hoặc migration thất bại trước PM2 reload, tiến trình cũ vẫn chạy;
điều tra lỗi và không ép restart.

Rollback code backend:

```bash
cd /var/www/antifake/back-end
git status --short
git switch --detach <KNOWN_GOOD_COMMIT>
npm ci
npm run prisma:merge
npx prisma generate
npx nest build api-gateway
pm2 startOrReload ecosystem.config.cjs --env production --update-env
```

Rollback frontend:

```bash
cd /var/www/antifake/anti-fake-front-end
git status --short
git switch --detach <KNOWN_GOOD_COMMIT>
npm ci
npm run build
sudo nginx -t
sudo systemctl reload nginx
```

Không chạy migration rollback tự động. Prisma migration đã áp dụng phải được
coi là forward-only. Chỉ rollback application nếu schema còn tương thích; nếu
có sự cố dữ liệu, dừng ghi và restore backup đã kiểm chứng theo quy trình vận
hành riêng. Tuyệt đối không dùng `prisma migrate reset` trên production.

Sau khi xử lý xong, chuyển lại branch production được duyệt và deploy
fast-forward bình thường.

## 21. Checklist go-live

- [ ] DNS `@`, `www`, `api` trỏ đúng IP.
- [ ] `.env` backend/frontend tồn tại, mode 600, không được Git track.
- [ ] Backup database và restore procedure đã được kiểm tra.
- [ ] Prisma generate/build/migrate deploy pass.
- [ ] PM2 chạy bằng user `deploy`, đúng một `antifake-api`.
- [ ] Nginx syntax pass; chỉ 22, 80, 443 public.
- [ ] SSL và renewal dry-run pass.
- [ ] Health, CORS, cookie và Socket.IO pass.
- [ ] Cloudinary, Agora RTC và PayOS staging smoke pass.
- [ ] PM2/Nginx/Redis logs không có lỗi mới hoặc secret.
- [ ] Rollback commit và người chịu trách nhiệm deploy đã được ghi nhận.
