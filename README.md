#  HOBBYCONNECT – APLICAȚIE MOBILĂ ÎN SCOPUL CONECTĂRII OAMENILOR CU PERSONALITĂȚI COMPLEMENTARE

##  Descriere

**HobbyConnect** este o aplicație mobilă dezvoltată cu React Native care permite utilizatorilor să își descopere tipul de personalitate folosind testul MBTI (Myers-Briggs Type Indicator), să răspundă la întrebări interactive și să se conecteze cu alte persoane cu personalități complementare. Aplicația comunică cu un backend Node.js/Express și folosește o bază de date MongoDB pentru stocarea rezultatelor și a utilizatorilor.

---

##  Adresă repository

[https://github.com/deliailia/HobbyConnect_Licenta.git](https://github.com/deliailia/HobbyConnect_Licenta.git)

---

##  Tehnologii utilizate

- **Frontend**:
  - React Native (Expo)
  - JavaScript / JSX
  - AsyncStorage (pentru salvarea locală)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB

- **Autentificare**:
  - Firebase Authentication

- **Altele**:
  - Cloudinary (pentru stocarea imaginilor)
  - NewsAPI (integrare știri)
  - Nodemailer (pentru trimitere emailuri)
  - GitHub (pentru versionare)

---

##  Pași de compilare și rulare

### 1. Clonarea proiectului

```bash
git clone https://github.com/deliailia/HobbyConnect_Licenta.git
```

---

### 2. Instalarea dependențelor pentru frontend

```bash
npm install
```

---

### 3. Rulare aplicație (Expo)

```bash
npx expo start
```

> Se va deschide automat interfața **Expo Developer Tools**.

---

### 4. Rulare pe telefon mobil

- Instalează aplicația **Expo Go** din Google Play / App Store.
- Scanează codul QR afișat în browser de **Expo Developer Tools**.

---

### 5. Instalare și pornire backend

```bash
cd backend
npm install
node server.js
```

---

### 6. Pornirea frontend-ului (curățare cache)

```bash
expo start -c
```

---

### 7. Configurarea variabilelor de mediu

Creează un fișier `.env` în directorul `backend` și adaugă următoarele:

<details>
  <summary>Click pentru a vedea conținutul</summary>

```env
# JWT
JWT_SECRET= 

# MongoDB
MONGO_URI - adresa bazei de date
PORT=5000

# Cloudinary
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# News API
NEWSAPI_SECRET

# Email (Nodemailer)
EMAIL_PASSWORD
MAIL_USER

# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS - calea către fișierul care conține credențialele 

# Firebase Config (pentru React Native)
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID

# Mail (pentru frontend)
REACT_APP_MAIL_USER
```

</details>


##  Funcționalități principale

- Test MBTI integrat cu salvarea rezultatelor
- Autentificare Firebase (email/parolă)
- Profil personal cu imagine încărcată în Cloudinary
- Filtrare și conectare pe baza personalităților complementare
- Integrare cu NewsAPI pentru afișare articole
- Salvarea datelor utilizatorului în MongoDB
- Trimitere notificări (confirmări / alerte)

---


