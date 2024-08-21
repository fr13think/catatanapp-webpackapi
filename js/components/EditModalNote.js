class EditModalNote extends HTMLElement {
    // Constructor untuk inisialisasi komponen
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Callback yang dipanggil ketika komponen terhubung ke DOM
    connectedCallback() {
        this.render();
    }

    // Fungsi untuk merender konten shadow DOM
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.4);
                }
                .modal-body {
                    background-color: #fefefe;
                    margin: 15% auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                    max-width: 500px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
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
            <div class="modal">
                <div class="modal-body">
                    <h2>Edit Catatan</h2>
                    <input type="text" id="editTitle" placeholder="Judul" required>
                    <div class="error" id="editTitleError"></div>
                    <textarea id="editbody" placeholder="Isi catatan" required></textarea>
                    <div class="error" id="editbodyError"></div>
                    <button id="saveEdit">Simpan</button>
                    <button id="cancelEdit">Batal</button>
                </div>
            </div>
        `;

        // Menambahkan event listener untuk tombol simpan dan batal
        this.shadowRoot.querySelector('#saveEdit').addEventListener('click', this.handleSave.bind(this));
        this.shadowRoot.querySelector('#cancelEdit').addEventListener('click', this.close.bind(this));

        // Menambahkan event listener untuk validasi input judul dan isi catatan
        this.shadowRoot.querySelector('#editTitle').addEventListener('input', this.validateTitle.bind(this));
        this.shadowRoot.querySelector('#editbody').addEventListener('input', this.validatebody.bind(this));
    }

    // Fungsi untuk membuka modal dengan data catatan yang akan diedit
    open(note) {
        this.note = note;
        this.shadowRoot.querySelector('#editTitle').value = note.title;
        this.shadowRoot.querySelector('#editbody').value = note.body;
        this.shadowRoot.querySelector('.modal').style.display = 'block';
    }

    close() {
        this.shadowRoot.querySelector('.modal').style.display = 'none';
    }

    // Fungsi untuk validasi judul catatan
    validateTitle() {
        const title = this.shadowRoot.querySelector('#editTitle').value;
        const titleError = this.shadowRoot.querySelector('#editTitleError');
        if (title.length < 3) {
            titleError.textbody = 'Judul harus minimal 3 karakter';
        } else {
            titleError.textbody = '';
        }
    }

    // Fungsi untuk validasi isi catatan
    validatebody() {
        const body = this.shadowRoot.querySelector('#editbody').value;
        const bodyError = this.shadowRoot.querySelector('#editbodyError');
        if (body.length < 10) {
            bodyError.textbody = 'Isi catatan harus minimal 10 karakter';
        } else {
            bodyError.textbody = '';
        }
    }

    // Fungsi untuk menangani penyimpanan catatan yang telah diedit
    handleSave() {
        const title = this.shadowRoot.querySelector('#editTitle').value;
        const body = this.shadowRoot.querySelector('#editbody').value;

        if (title.length < 3 || body.length < 10) {
            return;
        }

        const updatedNote = { ...this.note, title, body };
        const event = new CustomEvent('save-edit', { detail: updatedNote });
        this.dispatchEvent(event);
        this.close();
    }
}

customElements.define('edit-modal', EditModalNote);