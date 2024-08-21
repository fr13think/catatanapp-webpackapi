class NoteForm extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.editMode = false;
      this.editId = null;
  }

  connectedCallback() {
      this.render();
  }

  render() {
      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  margin-bottom: 20px;
              }
              form {
                  display: grid;
                  gap: 10px;
              }
              input, textarea {
                  width: 100%;
                  padding: 8px;
              }
              button {
                  padding: 8px 16px;
                  cursor: pointer;
              }
              .error {
                  color: red;
                  font-size: 0.8em;
              }
          </style>
          <form id="noteForm">
              <input type="text" id="title" placeholder="Judul" required>
              <div class="error" id="titleError"></div>
              <textarea id="body" placeholder="Isi catatan" required></textarea>
              <div class="error" id="bodyError"></div>
              <button type="submit">${this.editMode ? 'Update' : 'Tambah'} Catatan</button>
          </form>
      `;

      this.shadowRoot.querySelector('#noteForm').addEventListener('submit', this.handleSubmit.bind(this));
      this.shadowRoot.querySelector('#title').addEventListener('input', this.validateTitle.bind(this));
      this.shadowRoot.querySelector('#body').addEventListener('input', this.validatebody.bind(this));
  }

  validateTitle() {
    const title = this.shadowRoot.querySelector('#title').value;
    const titleError = this.shadowRoot.querySelector('#titleError');
    if (title.length < 3) {
        titleError.textContent = 'Judul harus minimal 3 karakter';
    } else if (title.length > 100) {
    titleError.textContent = 'Judul tidak boleh lebih dari 100 karakter';
    }else {
        titleError.textContent = '';
    }
}


  validatebody() {
    const body = this.shadowRoot.querySelector('#body').value;
    const bodyError = this.shadowRoot.querySelector('#bodyError');
    if (body.length < 10) {
        bodyError.textContent = 'Isi catatan harus minimal 10 karakter';
    } else if (body.length > 255) {
        bodyError.textContent = 'Isi catatan tidak boleh lebih dari 255 karakter'; // Tambahkan validasi untuk panjang maksimum
    } else {
        bodyError.textContent = ''; // Jika tidak ada error, bersihkan pesan error
    }
}

  handleSubmit(event) {
      event.preventDefault();
      const title = this.shadowRoot.querySelector('#title').value;
      const body = this.shadowRoot.querySelector('#body').value;

      if (title.length < 3 || body.length < 10) {
          return;
      }

      const noteEvent = new CustomEvent('save-note', {
          detail: { id: this.editId, title, body, editMode: this.editMode }
      });
      this.dispatchEvent(noteEvent);

      this.resetForm();
  }

  setEditMode(note) {
      this.editMode = true;
      this.editId = note.id;
      this.shadowRoot.querySelector('#title').value = note.title;
      this.shadowRoot.querySelector('#body').value = note.body;
      this.shadowRoot.querySelector('button[type="submit"]').textbody = 'Update Catatan';
      this.render();
  }

  resetForm() {
      this.editMode = false;
      this.editId = null;
      this.shadowRoot.querySelector('#noteForm').reset();
      this.shadowRoot.querySelector('button[type="submit"]').textbody = 'Tambah Catatan';
  }
}

customElements.define('note-form', NoteForm);