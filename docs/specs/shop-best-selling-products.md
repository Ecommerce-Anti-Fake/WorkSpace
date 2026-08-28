# Spec: Shop best-selling products API

## Objective

Hoan thien API public `GET /shops/:shopId/best-selling-products` de FE hien thi danh sach san pham ban chay cua shop.

## Contract

- Query `limit`: so nguyen tu 1 den 50, mac dinh 10.
- Response: mang `ShopBestSellingProductDto`, sap xep `soldQuantity` giam dan.
- Chi tinh order item thuoc dung shop, shop group da `DELIVERED`, order co `orderStatus = completed`.
- Moi phan tu gom: `id`, `title`, `price`, `currency`, `availableQuantity`, `soldQuantity`, `offerStatus`, `thumbnailUrl`, `createdAt`.

## Implementation plan

1. Them unit test cho loc dung shop, gop so luong va sap xep.
2. Truy van truc tiep `OrderItem` de tranh cong item cua shop khac trong cung order.
3. Dang ky use case trong orders module va noi duong RPC gateway.
4. Validate `limit`, chay unit test va build cac app bi anh huong.

## Boundaries

- Khong thay doi database schema hay dependency.
- Khong thay doi FE.
- Khong tinh don chua giao thanh cong.

## Success criteria

- API tra dung contract va khong ro ri doanh so giua cac shop.
- `limit` khong hop le bi validation pipe tu choi.
- Unit test va build thanh cong.
