# Smart Student Hub

## Backend_setup

1. set terminal to backend directory
```bash
cd backend
```

1. install the dependency that present in package.json (first time and when ever sync with branch)
```bash
npm install
```

### Create .env.production and .env.development 
and ask those secret from owner or maintainer

3. for development 
```bash
npm run dev
```

4. for production 
```bash
npm start
```





## Frontend_setup

1. set terminal to frontend directory
```bash
cd frontend
```

### Run this command only time 

```bash
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365 -subj "/CN=localhost"
```

### Create .env.production and .env.development 
and ask those secret from owner or maintainer

2. install the dependency that present in package.json (first time and when ever sync with branch)
```bash
npm install
```


3. for development 
```bash
npm run dev
```

4. for production 
```bash
npm start
```


