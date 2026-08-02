# Rodando o site localmente com Docker

Build (+rebuild) e execução com `docker-compose`:

```bash
# build e start (modo atrelado ao diretório atual via volume)
docker compose up --build

# ou em background
docker compose up -d --build

# parar e remover containers
docker compose down
```

Se preferir testar direto com `docker`:

```bash
# build image
docker build -t aulas-mobile:latest .

# run (mapeia para localhost:8080)
docker run --rm -p 8080:80 aulas-mobile:latest
```

Abra no navegador: http://localhost:8080

Observações:
- O `docker-compose.yml` monta o diretório atual como `:ro` dentro do container para facilitar desenvolvimento sem reaplicar a imagem.
- Se não quiser volumes e preferir a imagem imutável, remova a seção `volumes:` do `docker-compose.yml`.
