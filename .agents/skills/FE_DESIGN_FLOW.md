git # FE Guide — Luồng Design (Thiết kế sản phẩm)

Tài liệu này mô tả cách Frontend tích hợp luồng **Design** của AI Fashion Studio: từ lúc khách bắt đầu thiết kế trên một sản phẩm, lưu bản thiết kế, xem lại, đến khi dùng thiết kế đó để đặt hàng.

> Backend phục vụ luồng này là **java-core-api** (Spring Boot, cổng `8081`), FE luôn gọi qua **api-gateway** (`8080`).

---

## 1. Tổng quan luồng

```
[1] Chọn sản phẩm + biến thể (từ Catalog)
        │
        ▼
[2] POST /api/designs                → Tạo bản nháp (DRAFT), nhận designId
        │
        ▼
[3] Khách chỉnh sửa trên canvas (thêm text/ảnh/icon = layers)
        │
        ▼
[4] PUT /api/designs/{designId}/save → Lưu canvas + layers → chuyển sang SAVED
        │
        ├── GET /api/designs/my            → Danh sách thiết kế của khách
        ├── GET /api/designs/{designId}    → Xem chi tiết 1 thiết kế
        │
        ▼
[5] POST /api/orders (item kèm designId) → Đặt hàng với thiết kế đã SAVED
```

**Vòng đời trạng thái (`status`):**

| Status   | Ý nghĩa                                                        |
|----------|---------------------------------------------------------------|
| `DRAFT`  | Vừa tạo, chưa có canvas thật. Có thể save nhiều lần.           |
| `SAVED`  | Đã lưu canvas/layers. **Chỉ trạng thái này mới đặt hàng được.**|
| `LOCKED` | Đã khóa (sau khi vào đơn / BE khóa). Không sửa được nữa.       |

---

## 2. Xác thực (Authentication)

Mọi endpoint design **bắt buộc** gửi header:

```
X-User-Id: <UUID của khách hàng đang đăng nhập>
```

- Đây chính là `customerId`. BE dùng nó để gán quyền sở hữu và kiểm tra truy cập.
- Nếu thiếu header này → request lỗi (400 do thiếu required header).
- Khách chỉ thao tác được trên thiết kế **của chính mình**; truy cập thiết kế người khác → `403 DESIGN_ACCESS_DENIED`.

> ⚠️ Hiện java-core chưa tự giải mã JWT cho nhóm endpoint này — `X-User-Id` được tin cậy trực tiếp. FE lấy UUID khách từ phiên đăng nhập (token) và gắn vào header khi gọi.

---

## 3. Format response

**Thành công (2xx):** trả về **thẳng object DTO** (KHÔNG bọc trong `ApiResponse`).

**Lỗi (4xx/5xx):** luôn bọc trong `ApiResponse`:

```json
{
  "success": false,
  "message": "Design not found with id: ...",
  "data": null,
  "errors": [
    { "field": null, "code": "DESIGN_NOT_FOUND", "message": "Design not found with id: ..." }
  ],
  "meta": { "timestamp": "..." }
}
```

- Lỗi validation (field sai) → mỗi field 1 phần tử trong `errors` với `code: "VALIDATION_FAILED"` và `field` là tên trường.
- FE nên đọc `errors[].code` để phân nhánh xử lý, `message` để hiển thị.

---

## 4. Danh sách Endpoint

Base URL (dev): `http://localhost:8080`

### 4.1. Tạo bản nháp — `POST /api/designs`

Tạo một thiết kế mới ở trạng thái `DRAFT` gắn với 1 sản phẩm + biến thể.

**Headers:** `X-User-Id`, `Content-Type: application/json`

**Request body:**

```json
{
  "productId": "1f0c...-uuid",
  "productVariantId": "8ab2...-uuid",
  "name": "Áo thun tôi tự thiết kế"
}
```

| Trường             | Kiểu   | Bắt buộc | Ghi chú                          |
|--------------------|--------|----------|----------------------------------|
| `productId`        | UUID   | ✅       | Sản phẩm phải `ACTIVE`           |
| `productVariantId` | UUID   | ✅       | Biến thể phải thuộc sản phẩm & `ACTIVE` |
| `name`             | string | ✅       | Không được rỗng                  |

**Response `201 Created`:**

```json
{
  "designId": "d1e2...-uuid",
  "status": "DRAFT"
}
```

---

### 4.2. Lưu thiết kế — `PUT /api/designs/{designId}/save`

Lưu toàn bộ canvas + layers. Sau khi lưu, trạng thái chuyển sang `SAVED`.

**Headers:** `X-User-Id`, `Content-Type: application/json`

**Request body:**

```json
{
  "name": "Áo thun tôi tự thiết kế",
  "canvasJson": {
    "version": "5.3.0",
    "objects": [ /* JSON serialize từ canvas editor (vd fabric.js) */ ],
    "background": "#ffffff"
  },
  "previewImageUrl": "https://cdn.example.com/preview/abc.png",
  "printFileUrl": "https://cdn.example.com/print/abc.png",
  "layers": [
    {
      "layerType": "TEXT",
      "content": "HELLO",
      "positionX": 120.5,
      "positionY": 80.0,
      "width": 200.0,
      "height": 60.0,
      "rotation": 0,
      "color": "#000000",
      "zIndex": 1
    },
    {
      "layerType": "IMAGE",
      "content": "https://cdn.example.com/uploads/logo.png",
      "positionX": 50.0,
      "positionY": 300.0,
      "width": 150.0,
      "height": 150.0,
      "rotation": 15.5,
      "color": null,
      "zIndex": 2
    }
  ]
}
```

**Trường cấp thiết kế:**

| Trường            | Kiểu               | Bắt buộc | Ghi chú                                                        |
|-------------------|--------------------|----------|----------------------------------------------------------------|
| `name`            | string             | ✅       | Không rỗng                                                     |
| `canvasJson`      | object (JSON tự do)| ✅       | Toàn bộ state của canvas editor. BE lưu nguyên vẹn, không parse.|
| `previewImageUrl` | string             | ❌       | URL ảnh preview. **FE tự upload ảnh ở nơi khác rồi truyền URL vào.** |
| `printFileUrl`    | string             | ❌       | URL file in. Tương tự preview.                                 |
| `layers`          | array              | ❌       | Danh sách layer đã "làm phẳng". Tối đa **50** layer.           |

**Trường mỗi `layer` (`SaveDesignLayerRequest`):**

| Trường       | Kiểu           | Bắt buộc | Ghi chú                                  |
|--------------|----------------|----------|------------------------------------------|
| `layerType`  | enum           | ✅       | `TEXT` \| `IMAGE` \| `ICON`              |
| `content`    | string         | ❌       | Text (với TEXT) hoặc URL ảnh/icon        |
| `positionX`  | number         | ✅       | Toạ độ X                                 |
| `positionY`  | number         | ✅       | Toạ độ Y                                 |
| `width`      | number         | ✅       | Phải > 0                                 |
| `height`     | number         | ✅       | Phải > 0                                 |
| `rotation`   | number         | ❌       | Độ xoay                                  |
| `color`      | string         | ❌       | Mã màu (vd `#000000`)                    |
| `zIndex`     | integer        | ✅       | Thứ tự chồng layer (nhỏ ở dưới)          |

> **Quan trọng:** mỗi lần save là **ghi đè toàn bộ** — BE xoá hết layer cũ và lưu lại danh sách mới. FE phải gửi **đầy đủ** tất cả layer hiện có, không gửi kiểu "chỉ layer thay đổi".

**Response `200 OK`:**

```json
{
  "designId": "d1e2...-uuid",
  "status": "SAVED",
  "previewImageUrl": "https://cdn.example.com/preview/abc.png",
  "printFileUrl": "https://cdn.example.com/print/abc.png"
}
```

---

### 4.3. Danh sách thiết kế của tôi — `GET /api/designs/my`

**Headers:** `X-User-Id`

**Query params:**

| Param      | Mặc định | Ghi chú                          |
|------------|----------|----------------------------------|
| `page`     | `1`      | Bắt đầu từ 1                     |
| `pageSize` | `10`     | Khoảng hợp lệ: 1–100             |

**Response `200 OK`:**

```json
{
  "items": [
    {
      "id": "d1e2...-uuid",
      "name": "Áo thun tôi tự thiết kế",
      "productId": "1f0c...-uuid",
      "productVariantId": "8ab2...-uuid",
      "previewImageUrl": "https://cdn.example.com/preview/abc.png",
      "status": "SAVED",
      "createdAt": "2026-07-17T10:20:30+07:00"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalItems": 1,
  "totalPages": 1
}
```

---

### 4.4. Chi tiết thiết kế — `GET /api/designs/{designId}`

**Headers:** `X-User-Id`

**Response `200 OK`:**

```json
{
  "id": "d1e2...-uuid",
  "customerId": "9f00...-uuid",
  "productId": "1f0c...-uuid",
  "productVariantId": "8ab2...-uuid",
  "name": "Áo thun tôi tự thiết kế",
  "canvasJson": { "version": "5.3.0", "objects": [ ... ] },
  "previewImageUrl": "https://cdn.example.com/preview/abc.png",
  "printFileUrl": "https://cdn.example.com/print/abc.png",
  "status": "SAVED",
  "layers": [
    {
      "id": "la01...-uuid",
      "layerType": "TEXT",
      "content": "HELLO",
      "positionX": 120.5,
      "positionY": 80.0,
      "width": 200.0,
      "height": 60.0,
      "rotation": 0,
      "color": "#000000",
      "zIndex": 1
    }
  ]
}
```

- `layers` trả về theo thứ tự `zIndex` tăng dần.
- Để render lại editor, dùng `canvasJson`; `layers` là bản dữ liệu có cấu trúc (BE/xưởng in dùng).

---

## 5. Dùng thiết kế để đặt hàng

Khi tạo đơn (`POST /api/orders`), mỗi order item có thể đính kèm `designId`:

```json
{
  "items": [
    {
      "productId": "1f0c...-uuid",
      "productVariantId": "8ab2...-uuid",
      "designId": "d1e2...-uuid",
      "quantity": 1
    }
  ]
}
```

BE kiểm tra khi có `designId`:

1. Design phải tồn tại → nếu không: `404 DESIGN_NOT_FOUND`.
2. Design phải thuộc đúng khách (`X-User-Id`) → nếu không: `403 DESIGN_ACCESS_DENIED`.
3. Design phải ở trạng thái **`SAVED`** → nếu không: `422 DESIGN_MUST_BE_SAVED`.
4. `productId` + `productVariantId` của order item phải **khớp** với design → nếu không: `422 DESIGN_PRODUCT_MISMATCH`.

> ✅ FE nên chặn trước ở UI: chỉ cho "Đặt hàng" khi design đang `SAVED`, và gửi đúng cặp product/variant mà design được tạo ra.

---

## 6. Bảng mã lỗi

| HTTP | Code                        | Khi nào                                                    |
|------|-----------------------------|------------------------------------------------------------|
| 404  | `PRODUCT_NOT_FOUND`         | `productId` không tồn tại (lúc tạo draft)                  |
| 422  | `PRODUCT_NOT_AVAILABLE`     | Sản phẩm không ở trạng thái ACTIVE                         |
| 404  | `VARIANT_NOT_FOUND`         | `productVariantId` không tồn tại                          |
| 422  | `VARIANT_NOT_AVAILABLE`     | Biến thể không thuộc sản phẩm / không ACTIVE              |
| 404  | `DESIGN_NOT_FOUND`          | `designId` không tồn tại                                   |
| 403  | `DESIGN_ACCESS_DENIED`      | Design không thuộc khách đang gọi                         |
| 409  | `DESIGN_LOCKED`             | Cố save khi design đang `LOCKED`                          |
| 422  | `INVALID_CANVAS_JSON`       | `canvasJson` không hợp lệ (vd null)                       |
| 422  | `DESIGN_LAYER_LIMIT_EXCEEDED` | Gửi > 50 layer                                          |
| 422  | `DESIGN_MUST_BE_SAVED`      | Đặt hàng với design chưa `SAVED`                          |
| 422  | `DESIGN_PRODUCT_MISMATCH`   | Design không khớp product/variant của order item         |
| 422  | `INVALID_PAGE` / `INVALID_PAGE_SIZE` | `page` < 1 hoặc `pageSize` ngoài 1–100          |
| 422  | `VALIDATION_FAILED`         | Sai/thiếu trường trong body (kèm `field`)                |

---

## 7. Lưu ý cho FE

- **Ảnh preview/print:** BE **không sinh ảnh** (không có AI generation ở luồng hiện tại). FE chịu trách nhiệm upload ảnh preview và file in lên storage riêng, rồi truyền `previewImageUrl` / `printFileUrl` vào lúc save. Hai trường này optional.
- **Save = full replace:** luôn gửi đủ toàn bộ layers mỗi lần lưu.
- **`canvasJson` là hộp đen:** BE lưu nguyên và trả nguyên, không kiểm tra cấu trúc bên trong (ngoài việc khác null). FE tự thống nhất schema của canvas editor.
- **Không trộn wrapper:** đọc thành công là object phẳng, đọc lỗi là `ApiResponse`. Viết interceptor xử lý 2 nhánh này.
- **Base path qua gateway:** `/api/designs/**` được route sang java-core; FE không gọi thẳng cổng 8081.
```
