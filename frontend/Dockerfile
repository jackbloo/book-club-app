# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json vite.config.* tsconfig.* tailwind.config.js postcss.config.js ./
RUN npm install

COPY src ./src
COPY index.html ./ 

RUN npm run build

# Serve with a lightweight web server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
