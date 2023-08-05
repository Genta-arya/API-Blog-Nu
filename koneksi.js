const mysql = require('mysql');

const dbConfig = {
  host: 'bshs1omw9nq4ztfgt3sp-mysql.services.clever-cloud.com',
  user: 'up4xroranr6av53a',
  password: 'E2yxdzeLWuDmt9L16fxK',
  database: 'bshs1omw9nq4ztfgt3sp',
};

// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'db_nu',
// };

// Fungsi untuk membuat koneksi
function createConnection() {
  const connection = mysql.createConnection(dbConfig);

  // Event handler ketika terjadi kesalahan koneksi
  connection.on('error', function (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Koneksi database terputus. Mencoba menghubungkan kembali...');

      // Membuat koneksi baru
      createConnection();
    } else {
      throw err;
    }
  });

  // Membuka koneksi ke database
  connection.connect(function (err) {
    if (err) {
      console.error('Koneksi database gagal:', err);
    } else {
      console.log('Berhasil terhubung ke database');
    }
  });

  // Mengembalikan objek koneksi
  return connection;
}

// Membuat koneksi pertama kali
const db = createConnection();

module.exports = db;