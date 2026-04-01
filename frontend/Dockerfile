# Sử dụng Node.js 20 làm base
FROM node:20-slim

# Thư mục làm việc cho frontend
WORKDIR /app

# Copy các tệp cài đặt và cài đặt dependencies
COPY package.json ./
RUN npm install

# Copy toàn bộ mã nguồn frontend
COPY . .

# Expose cổng 3000 (Vite)
EXPOSE 3000

# Chạy ở chế độ phát triển và cho phép truy cập từ host ngoài
CMD ["npm", "run", "dev", "--", "--host"]
