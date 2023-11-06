const dbName = 'KomentarDB';
const dbVersion = 1;
let db;

// Membuka atau membuat database IndexedDB
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('komentar')) {
    db.createObjectStore('komentar', { keyPath: 'id', autoIncrement: true });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadCommentsFromDB();
};

request.onerror = (event) => {
  console.error('Error opening database:', event.target.error);
};

// Menambahkan komentar ke IndexedDB
function addCommentToDB(comment) {
  const transaction = db.transaction(['komentar'], 'readwrite');
  const komentarStore = transaction.objectStore('komentar');
  const request = komentarStore.add(comment);

  request.onsuccess = () => {
    loadCommentsFromDB();
  };

  request.onerror = (event) => {
    console.error('Error adding comment:', event.target.error);
  };
}

// Mengambil komentar dari IndexedDB
function loadCommentsFromDB() {
  const daftarKomentar = document.getElementById('daftar-komentar');
  while (daftarKomentar.firstChild) {
    daftarKomentar.removeChild(daftarKomentar.firstChild);
  }

  const transaction = db.transaction(['komentar'], 'readonly');
  const komentarStore = transaction.objectStore('komentar');
  const request = komentarStore.getAll();

  request.onsuccess = (event) => {
    const comments = event.target.result;
    for (const comment of comments) {
      displayComment(comment);
    }
  };

  request.onerror = (event) => {
    console.error('Error loading comments:', event.target.error);
  };
}

// Menampilkan komentar di HTML
function displayComment(comment) {
  const daftarKomentar = document.getElementById('daftar-komentar');
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <p>${comment.nama}</p>
    <p>${comment.komentar}</p>
    <p><small>${comment.timestamp}</small></p>
    <button class="edit-button" data-id="${comment.id}">Edit</button>
    <button class="delete-button" data-id="${comment.id}">Delete</button>
  `;

  const editButton = commentDiv.querySelector('.edit-button');
  const deleteButton = commentDiv.querySelector('.delete-button');

  editButton.addEventListener('click', () => editComment(comment));
  deleteButton.addEventListener('click', () => deleteComment(comment.id));

  daftarKomentar.appendChild(commentDiv);
}

// Mengedit komentar
function editComment(comment) {
  const transaction = db.transaction(['komentar'], 'readwrite');
  const komentarStore = transaction.objectStore('komentar');
  const request = komentarStore.put(comment);

  request.onsuccess = () => {
    loadCommentsFromDB();
  };

  request.onerror = (event) => {
    console.error('Error editing comment:', event.target.error);
  };
}

// Menghapus komentar
function deleteComment(commentId) {
  const transaction = db.transaction(['komentar'], 'readwrite');
  const komentarStore = transaction.objectStore('komentar');
  const request = komentarStore.delete(commentId);

  request.onsuccess = () => {
    loadCommentsFromDB();
  };

  request.onerror = (event) => {
    console.error('Error deleting comment:', event.target.error);
  };
}

// Mendengarkan formulir komentar
const komentarForm = document.getElementById('komentar-form');
komentarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = document.getElementById('nama').value;
  const komentarText = document.getElementById('komentar').value;
  const timestamp = new Date().toISOString();

  const komentar = { nama, komentar: komentarText, timestamp };
  addCommentToDB(komentar);

  document.getElementById('nama').value = '';
  document.getElementById('komentar').value = '';
});
