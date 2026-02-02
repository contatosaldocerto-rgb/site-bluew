# 1. Usar Nginx oficial (leve e estável)
FROM nginx:alpine

# 2. Remover config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# 3. Copiar sua config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. Copiar arquivos do site
COPY . /usr/share/nginx/html

# 5. Expor porta padrão HTTP
EXPOSE 80

# 6. Rodar Nginx
CMD ["nginx", "-g", "daemon off;"]
