# Deploy backend tren cPanel Phusion Passenger

## 1. Pham vi

Runbook nay bo sung mot duong deploy rieng cho backend NestJS monorepo tren
cPanel Phusion Passenger. No khong thay the cac duong deploy Render, VPS hoac
PM2 hien co.

Passenger process chay cung luc:

- API Gateway va Socket.IO tren HTTP server do Passenger quan ly.
- `auth-service` TCP tren `127.0.0.1:4001`.
- `users-service` TCP tren `127.0.0.1:4002`.
- `catalog-service` TCP tren `127.0.0.1:4003`.
- `orders-service` TCP tren `127.0.0.1:4004`.
- `affiliate-service` TCP tren `127.0.0.1:4005`.

Tat ca port TCP co the ghi de bang bien moi truong tuong ung. Khong mo cac port
4001-4005 ra Internet.

## 2. Yeu cau hosting

- Node.js `20.x`.
- cPanel Application Manager hoac Setup Node.js App dung Phusion Passenger.
- Quyen SSH/Terminal va quyen chay `npm`, `node`, `npx`.
- PostgreSQL co the truy cap tu hosting.
- Cho phep mot Node process bind nam TCP port loopback.
- Passenger phai chay dung **mot application process** cho ung dung nay.

Neu nha cung cap khong xac nhan duoc mot process duy nhat, hoac chan TCP
loopback/WebSocket/SSE, khong dung topology nay. Hay tach cac microservice thanh
process rieng hoac dung VPS/PM2.

## 3. Khai bao ung dung trong cPanel

Gia tri mau:

| Truong | Gia tri |
|---|---|
| Node.js version | `20.x` |
| Application mode | `Production` |
| Application root | `/home/<CPANEL_USER>/<BACKEND_DIRECTORY>` |
| Application URL | `https://api.example.com` hoac URL/subpath duoc cPanel cap |
| Application startup file | `passenger.js` |

Application root phai la thu muc `back-end`, noi co `package.json`,
`passenger.js`, `apps/`, `libs/` va `prisma/`.

Passenger reverse-port-binding se chuyen loi goi `http.Server.listen()` dau tien
thanh socket do Passenger quan ly. Backend chi tao mot HTTP server; Socket.IO
duoc bind tren cung server do. Tham khao:
[Phusion Passenger reverse port binding](https://www.phusionpassenger.com/docs/advanced_guides/in_depth/node/reverse_port_binding.html).

## 4. Kich hoat Node.js 20

Neu hosting dung CloudLinux Setup Node.js App, sao chep dung lenh kich hoat ma
cPanel hien thi. Mau thuong gap:

```bash
source /home/<CPANEL_USER>/nodevenv/<APPLICATION_ROOT>/20/bin/activate
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
```

Neu hosting dung cPanel EasyApache Application Manager, thuong khong co
`nodevenv`. Dung Node.js 20 cua cPanel:

```bash
export PATH=/opt/cpanel/ea-nodejs20/bin:$PATH
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
```

Kiem tra:

```bash
node --version
npm --version
```

`node --version` phai tra ve `v20.x`. Tai lieu cPanel:
[How to Install a Node.js Application](https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/).

## 5. Cai dependency va build

```bash
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
npm ci
npm run build:passenger
```

`build:passenger` chi:

1. merge split Prisma schema;
2. generate Prisma Client;
3. build API Gateway va cac file bootstrap Passenger can thiet.

Lenh build khong migrate, seed hoac reset database.

## 6. Tao `.env`

```bash
cp .env.passenger.example .env
chmod 600 .env
nano .env
```

Thay tat ca placeholder bang gia tri production. Toi thieu phai cau hinh:

- `PORT` do moi truong/cPanel cap; startup khong dung port HTTP hard-code.
- `DATABASE_URL`.
- `JWT_SECRET`, `REFRESH_TOKEN_SECRET`.
- `FRONTEND_URL` hoac `CORS_ALLOWED_ORIGINS`/`CORS_ORIGIN`.
- `BACKEND_PUBLIC_URL` hoac `API_PUBLIC_URL`.
- Cloudinary, Agora, Firebase Admin, PayOS va GHN.
- Redis neu `REDIS_ENABLED=true`.
- VietQR neu `BANK_ACCOUNT_LOOKUP_ENABLED=true`.
- `PAYOUT_ACCOUNT_ENCRYPTION_KEY` neu bat buyer/seller withdrawals.

Nam port microservice mac dinh:

```dotenv
AUTH_SERVICE_PORT=4001
USERS_SERVICE_PORT=4002
CATALOG_SERVICE_PORT=4003
ORDERS_SERVICE_PORT=4004
AFFILIATE_SERVICE_PORT=4005
```

Moi port phai la so nguyen `1..65535`, khong trung nhau va khong trung `PORT`.
Startup chi log ten bien bi thieu, khong log gia tri secret.

Neu nhap bien moi truong bang Application Manager, can co module
`ea-apache24-mod_env`. Gioi han do dai cua giao dien co the khong phu hop voi
Firebase private key; trong truong hop do dung `.env` voi quyen `600` va chuoi
`\n` da escape. Tham khao:
[cPanel Application Manager](https://docs.cpanel.net/cpanel/software/application-manager/).

## 7. Migration thu cong

Chay migration mot lan trong Terminal, truoc khi restart artifact moi:

```bash
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
npm run prisma:merge
npx prisma migrate deploy
```

Khong chay `prisma migrate reset` va khong seed production. `start:passenger`
va moi lan Passenger restart deu khong tu dong chay migration.

## 8. Restart Passenger

Tao thu muc restart neu chua co, sau do touch file:

```bash
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
mkdir -p tmp
touch tmp/restart.txt
```

Co the dung nut Restart/Deploy trong giao dien cPanel neu hosting cung cap.
Passenger doc `tmp/restart.txt` de nap lai ung dung.

Khong chay `npm run start:passenger` dong thoi voi ung dung da duoc Passenger
quan ly, vi process thu hai se tranh chap port 4001-4005.

## 9. Kiem tra sau restart

```bash
curl -i https://api.example.com/api/health
```

Log thanh cong can co:

```text
[auth-service] listening on 127.0.0.1:4001
[users-service] listening on 127.0.0.1:4002
[catalog-service] listening on 127.0.0.1:4003
[orders-service] listening on 127.0.0.1:4004
[affiliate-service] listening on 127.0.0.1:4005
Binding Socket.IO server on path /api/socket.io
Socket.IO server bound successfully
[passenger] bootstrap succeeded
```

Neu co worker thu hai, startup se dung voi canh bao:

```text
Passenger must run exactly one application process
```

Khong xoa lock bang tay khi process owner van chay. Lock stale duoc startup moi
thu hoi sau khi xac nhan PID cu khong con ton tai.

## 10. Xem log

Ung dung ghi log vao stdout/stderr. Vi tri cu the phu thuoc hosting:

```bash
cd /home/<CPANEL_USER>/<BACKEND_DIRECTORY>
find logs -maxdepth 1 -type f -print 2>/dev/null
tail -n 200 logs/* 2>/dev/null
```

Application Manager thuong dat log Node trong `<APPLICATION_ROOT>/logs/`. Neu
khong co, xem cPanel `Metrics > Errors` hoac hoi nha cung cap vi tri Apache/
Passenger error log. Khong dua secret, `.env` hoac private key vao ticket/log.

## 11. WebSocket, Socket.IO va SSE

- Socket.IO dung path `/api/socket.io` tren cung HTTP server voi API Gateway.
- Reverse proxy Apache/NGINX phai cho phep HTTP Upgrade va timeout phu hop.
- Shared hosting co the tat WebSocket hoac gioi han ket noi dai; build pass khong
  chung minh tinh nang nay hoat dong.
- SSE can timeout/keep-alive phu hop; proxy co the buffer hoac ngat ket noi.
- Sau deploy, smoke bang hai browser/client va kiem tra reconnect.

## 12. Gioi han mot Passenger process

Moi Passenger worker se co gang bootstrap nam TCP microservice. Source dung:

- singleton promise de khong bootstrap lap trong cung mot worker;
- lock file nguyen tu trong `tmp/` de chan worker thu hai;
- OS port binding lam lop bao ve cuoi, voi loi `EADDRINUSE` ro rang.

Day la co che fail-fast, khong phai ho tro horizontal scaling. cPanel thuong
khong cho user shared-hosting dieu khien worker pool. Can yeu cau nha cung cap
xac nhan ung dung chi co mot process. Neu ho khong the dam bao, dung VPS/PM2
mot instance hoac tach tung microservice thanh ung dung rieng.

## 13. Rollback

1. Chuyen source ve revision backend da biet la on dinh.
2. Chay `npm ci` neu lockfile thay doi.
3. Chay `npm run build:passenger`.
4. Chi chay migration neu revision do yeu cau; khong tu rollback database.
5. `touch tmp/restart.txt`.
6. Kiem tra `/api/health`, log, REST va Socket.IO.

Render/VPS/PM2 tiep tuc dung `scripts/start-deploy.js`, `deploy-main.ts` va cac
script deploy hien co; runbook Passenger khong thay doi cac entrypoint nay.
