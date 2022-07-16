# Thông tin folder
```
  .
  ├── backend-service: backend của scada sử dụng docker-compose trong lúc dev.
  ├── backup: thư mục backup các dữ liệu cần thiết cho scada và keycloak.
  ├── client-service: client của scada.
  └── integration-service
      ├── config: chứa config map với .env file.
      ├── cron-job: chứa các job đồng bộ dashboard, user và xóa logs.
      ├── db: khai báo db mới (chưa xử dụng trong giai đoạn 1).
      ├── integration-apis: khai báo API mới (chưa xử dụng trong giai đoạn 1).
      ├── keycloak-apis: các api của Keycloak.
      ├── public-apis: các api wrapper và không muốn phân quyền bao gồm /publicAsset để sử dụng trong phần giám sát và /roles dùng cho việc generate menu home.
      ├── resources: các file js,css dùng cho widget library.
      ├── scada-apis: các api của Scada.
      ├── utils: chưa hàm dùng chung và các đường link API.
      └──  dev.env: Biến môi trường khi sử dụng thì phải chuyển thành .env file.
```
# Thông tin triển khai
## Pre-deployment:
* ubuntu version 20
* docker version 20.10.12
* docker-compose version 1.26.2
* npm version 8.1.2
* node version 16.13.2
## Deployment:
`git clone https://github.com/huongnv75/iot-platform.git`
### Triển khai backend-service
- Bước 1: `cd backend-service`
- Bước 2: `docker-compose up -d`
### Triển khai client-service
- Bước 1: `cd client-service`
- Bước 2: `npm install` (lần đầu tiên)
- Bước 3: `npm start`
### Triển khai integration-service
- Bước 1: `cd integration-service`
- Bước 2: `npm install` (lần đầu tiên)
- Bước 3: Thay đổi file `dev.env` thành file `.env` và thay đổi các tham số (lần đầu tiên)
- Bước 3: `npm start`
