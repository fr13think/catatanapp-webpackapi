// Mengimpor data catatan dari modul eksternal
import { notesData } from './data/notes.js';

// Inisialisasi array catatan dengan data yang diimpor
let notes = notesData;

// Fungsi untuk merender catatan berdasarkan istilah pencarian
function renderNotes(searchTerm = '') {
  // Mendapatkan elemen container untuk catatan
  const notesContainer = document.getElementById('notesGrid');
  // Membersihkan konten sebelumnya
  notesContainer.innerHTML = '';
  
  // Memfilter catatan berdasarkan istilah pencarian
  const filteredNotes = notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.body.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Memisahkan catatan aktif dan yang terarsip
  const activeNotes = filteredNotes.filter(note => !note.archived);
  const archivedNotes = filteredNotes.filter(note => note.archived);

  // Fungsi bantuan untuk merender daftar catatan
  const renderNotesList = (notesList, title, className) => {
      // Jika tidak ada catatan, tidak melakukan apa-apa
      if (notesList.length === 0) return;

      // Membuat elemen section untuk setiap kategori catatan
      const section = document.createElement('div');
      section.className = 'notes-section';
      // Menetapkan judul dan jumlah catatan pada section
      section.innerHTML = `<h2>${title} (<span>${notesList.length}</span>)</h2>`;
      // Membuat elemen grid untuk menampung item catatan
      const grid = document.createElement('div');
      grid.className = `notes-grid ${className}`;
      // Iterasi melalui setiap catatan dan membuat elemen catatan
      notesList.forEach(note => {
          // Custom attribute 'note'
          const noteItem = document.createElement('note-item');
          // Menetapkan data catatan sebagai atribut
          noteItem.setAttribute('note', JSON.stringify(note));
          // Menambahkan event listener untuk aksi pada catatan
          noteItem.addEventListener('delete-note', handleDeleteNote);
          noteItem.addEventListener('edit-note', handleEditNote);
          noteItem.addEventListener('toggle-archive', handleToggleArchive);
          // Menambahkan item catatan ke grid
          grid.appendChild(noteItem);
      });
      // Menambahkan grid ke section dan section ke container
      section.appendChild(grid);
      notesContainer.appendChild(section);
  };

  // Merender catatan aktif dan terarsip
  renderNotesList(activeNotes, 'Catatan Aktif', 'active-notes');
  renderNotesList(archivedNotes, 'Catatan Terarsip', 'archived-notes');
}

// Fungsi untuk menangani penyimpanan catatan baru atau yang telah diedit
function handleSaveNote(event) {
  // Mendapatkan detail dari event
  const { id, title, body, editMode } = event.detail;
  // Jika dalam mode edit, perbarui catatan yang ada
  if (editMode) {
      const index = notes.findIndex(note => note.id === id);
      notes[index] = { ...notes[index], title, body: body, createdAt: new Date().toISOString() };
  } else {
      // Jika bukan mode edit, tambahkan catatan baru
      const newId = crypto.randomUUID();
      notes.push({ id: newId, title, body: body, createdAt: new Date().toISOString(), archived: false });
  }
  // Merender ulang catatan setelah perubahan
  renderNotes();
}

// Fungsi untuk menangani penghapusan catatan
function handleDeleteNote(event) {
  // Mendapatkan ID catatan dari event
  const id = event.detail.id;
  // Memfilter keluar catatan yang dihapus dari array
  notes = notes.filter(note => note.id !== id);
  // Merender ulang catatan setelah penghapusan
  renderNotes();
}

// Fungsi untuk menangani pembukaan modal edit
function handleEditNote(event) {
  // Mendapatkan elemen modal edit
  const editModal = document.querySelector('edit-modal');
  // Membuka modal dengan detail catatan
  editModal.open(event.detail);
}

// Fungsi untuk menangani penyimpanan perubahan pada catatan yang telah diedit
function handleSaveEdit(event) {
  // Mendapatkan catatan yang telah diperbarui dari event
  const updatedNote = event.detail;
  // Mencari index catatan yang diperbarui
  const index = notes.findIndex(note => note.id === updatedNote.id);
  // Memperbarui catatan di array
  notes[index] = { ...notes[index], ...updatedNote, createdAt: new Date().toISOString() };
  // Merender ulang catatan setelah perubahan
  renderNotes();
}

// Fungsi untuk menangani pengarsipan dan pembatalan pengarsipan catatan
function handleToggleArchive(event) {
  // Mendapatkan detail catatan dari event
  const noteToToggle = event.detail;
  // Mencari index catatan yang akan diarsipkan atau dibatalkan pengarsipannya
  const index = notes.findIndex(note => note.id === noteToToggle.id);
  // Mengganti status pengarsipan catatan
  notes[index].archived = !notes[index].archived;
  // Merender ulang catatan setelah perubahan
  renderNotes();
}

// Menambahkan event listener untuk form catatan dan modal edit
document.querySelector('note-form').addEventListener('save-note', handleSaveNote);
document.querySelector('edit-modal').addEventListener('save-edit', handleSaveEdit);

// Memanggil fungsi renderNotes untuk inisialisasi aplikasi
renderNotes();

// Menambahkan event listener untuk input pencarian
document.getElementById('searchInput').addEventListener('input', (e) => {
  // Merender catatan berdasarkan istilah pencarian
  renderNotes(e.target.value);
});

// Menambahkan event listener untuk mengubah tema
document.body.addEventListener('DOMSubtreeModified', () => {
  // Mendapatkan status mode gelap
  const isDarkMode = document.body.classList.contains('dark-mode');
  // Mengatur variabel CSS untuk setiap item catatan berdasarkan tema
  document.querySelectorAll('note-item').forEach(item => {
      item.style.setProperty('--note-bg-color', isDarkMode ? '#2C2C2E' : '#FFFFFF');
      item.style.setProperty('--note-text-color', isDarkMode ? '#FFFFFF' : '#000000');
  });
  
  // Memanggil fungsi updateTheme pada footer untuk mengubah tema
  document.querySelector('app-footer').updateTheme();
});
