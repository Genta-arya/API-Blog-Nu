const express = require("express");
const db = require("./koneksi"); // Mengimpor koneksi database dari file koneksi.js
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const cors = require("cors");
// const API = "192.168.1.27"
app.use(cors());
app.use(bodyParser.json());

// Route root
app.post('/login', (req, res) => {
  try {
    // Mendapatkan email dan password dari body request
    const { email, password } = req.body;

    // Contoh query untuk memeriksa keberadaan email dan password dalam tabel auth
    const loginQuery = 'SELECT * FROM auth WHERE email = ? AND password = ?';
    const loginValues = [email, password];

    // Jalankan query untuk login menggunakan objek koneksi db
    db.query(loginQuery, loginValues, (error, loginResults) => {
      if (error) {
        console.error('Error query:', error);
        res.status(500).send('Error server');
      } else {
        // Periksa apakah data ditemukan dalam tabel auth
        if (loginResults.length > 0) {
          // Jika login berhasil, lakukan seleksi data berdasarkan email
          const selectQuery = 'SELECT * FROM auth WHERE email = ?';
          const selectValues = [email];

          // Jalankan query untuk seleksi data menggunakan objek koneksi db
          db.query(selectQuery, selectValues, (error, selectResults) => {
            if (error) {
              console.error('Error query:', error);
              res.status(500).send('Error server');
            } else {
              // Kirim hasil seleksi data sebagai respon
              if (selectResults.length > 0) {
                console.log('Login successful:', selectResults);
                res.status(200).json(selectResults);
              } else {
                res.status(404).send('User not found');
              }
            }
          });
        } else {
          res.status(401).send('Invalid email or password'); // Email atau password tidak valid
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error server');
  }
});

app.get('/posting', (req, res) => {
  try {
    // Query untuk mengambil semua data dari tabel "posting"
    const selectQuery = 'SELECT * FROM posting';

    // Jalankan query menggunakan objek koneksi db
    db.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Error query:', error);
        res.status(500).send('Error server');
      } else {
        // Kirim hasil query sebagai respon
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error server');
  }
});

app.get('/posting/:id', (req, res) => {
  try {
    const postId = req.params.id;

    // Query untuk mengambil data postingan berdasarkan ID
    const selectQuery = 'SELECT * FROM posting WHERE id = ?';

    // Jalankan query menggunakan objek koneksi db
    db.query(selectQuery, [postId], (error, results) => {
      if (error) {
        console.error('Error query:', error);
        res.status(500).send('Error server');
      } else {
        // Jika data postingan ditemukan, kirim sebagai respon
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          // Jika data postingan tidak ditemukan, kirim pesan error
          res.status(404).send('Postingan tidak ditemukan');
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error server');
  }
});

app.get('/posting/category/:category', (req, res) => {
  try {
    const category = req.params.category;

    // Query untuk mengambil data postingan berdasarkan kategori
    const selectQuery = 'SELECT * FROM posting WHERE category = ?';

    // Jalankan query menggunakan objek koneksi db
    db.query(selectQuery, [category], (error, results) => {
      if (error) {
        console.error('Error query:', error);
        res.status(500).send('Error server');
      } else {
        // Jika data postingan ditemukan, kirim sebagai respon
        if (results.length > 0) {
          res.status(200).json(results);
        } else {
          // Jika data postingan tidak ditemukan, kirim pesan kosong
          res.status(200).json([]);
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error server');
  }
});




app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
