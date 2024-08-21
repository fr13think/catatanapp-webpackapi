class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const note = JSON.parse(this.getAttribute('note'));
        const date = new Date(note.createdAt);
        note.date = date.toLocaleDateString('id-ID');
        note.time = date.toLocaleTimeString('id-ID');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--note-bg-color, #FFFFFF);
                    border-radius: 10px;
                    padding: 16px;
                    color: var(--note-text-color, #000000);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }
                h2 {
                    margin-top: 0;
                    font-weight: 600;
                }
                button {
                    margin-top: 8px;
                    padding: 8px 16px;
                    cursor: pointer;
                    background-color: var(--accent-color, #007AFF);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                }
                .archived {
                    opacity: 0.7;
                }
            </style>
            <div class="${note.archived ? 'archived' : ''}">
                <h2>${note.title}</h2>
                <p>${note.body}</p>
                <p>Tanggal: ${note.date} ${note.time}</p>
                <button class="edit">Edit</button>
                <button class="delete">Hapus</button>
                <button class="archive">${note.archived ? 'Unarsipkan' : 'Arsipkan'}</button>
            </div>
        `;

        this.shadowRoot.querySelector('.edit').addEventListener('click', () => this.editNote(note));
        this.shadowRoot.querySelector('.delete').addEventListener('click', () => this.deleteNote(note.id));
        this.shadowRoot.querySelector('.archive').addEventListener('click', () => this.toggleArchive(note));
    }

    editNote(note) {
        const event = new CustomEvent('edit-note', { detail: note });
        this.dispatchEvent(event);
    }

    deleteNote(id) {
        const event = new CustomEvent('delete-note', { detail: { id } });
        this.dispatchEvent(event);
    }

    toggleArchive(note) {
        const event = new CustomEvent('toggle-archive', { detail: note });
        this.dispatchEvent(event);
    }
}

customElements.define('note-item', NoteItem);