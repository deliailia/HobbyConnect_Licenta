## HOBBYCONNECT – APLICAȚIE MOBILĂ ÎN SCOPUL CONECTĂRII OAMENILOR CU PERSONALITĂȚI COMPLEMENTARE


##  Descriere
Aplicație mobilă React Native care permite utilizatorilor să parcurgă un test MBTI (Myers-Briggs Type Indicator), să răspundă la întrebări și să-și salveze rezultatele. Sistemul este conectat la un backend pentru gestionarea rezultatelor și întrebărilor.

##  Adresă repository
Repository-ul aplicației este disponibil la:
https://github.com/deliailia/HobbyConnect_Licenta.git


##  Tehnologii utilizate
- React Native (Expo)
- JavaScript / JSX
- Node.js (pentru backend)
- Express.js (pentru API)
- AsyncStorage (pentru salvarea locală a datelor pe dispozitiv)
- Github (pentru versionare)
- Cloudinary (pentru stocarea imaginilor)
- MongoDB (pentru stocarea datelor)
- Firebase Authentication (pentru autentificare)

##  Pași de compilare și rulare

### 1. Clonarea proiectului
```bash
git clone https://github.com/deliailia/HobbyConnect_Licenta.git
```

### 2. Instalarea dependențelor
```bash
npm install
```

### 3. Rulare aplicație (Expo)
```bash
npx expo start
```

Apoi se va deschide automat interfața Expo Developer Tools.

### 4. Rulare pe telefon mobil
- Instalează aplicația **Expo Go** din Google Play / App Store.
- Scanează codul QR din Expo Developer Tools pentru a deschide aplicația pe telefon.

### 5. Pornirea backend-ului 
```bash
cd backend
npm install
node server.js
```
### 6. Pornirea frontend-ului
```bash
expo start -c 
```

