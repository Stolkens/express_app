const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();

// Konfiguracja storage dla multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Inicjalizacja multer z użyciem skonfigurowanego storage
const upload = multer({ storage: storage });

app.engine('.hbs', hbs());
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.post('/contact/send-message', upload.single('image'), (req, res) => {

  const { author, sender, title, message } = req.body;
  const image = req.file;

  if (!author || !sender || !title || !message) {
    return res.render('contact', { isError: true });
  }

  // Sprawdzenie czy plik został przesłany i czy ma poprawne rozszerzenie
  if (!req.file || !['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(req.file.originalname).toLowerCase())) {
    return res.render('contact', { isErrorImage: true });
  }

  // Obsługa logiki zapisu i wysłania wiadomości
  else {
    res.render('contact', { isSent: true, imageName: image.originalname });
  }
  
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});