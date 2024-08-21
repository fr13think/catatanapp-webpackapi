class AppBarNote extends HTMLElement {
    // Constructor untuk inisialisasi komponen
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('#toggleTheme').addEventListener('click', this.toggleTheme.bind(this));
    }

    // Fungsi untuk merender konten shadow DOM
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-body: space-between;
                    align-items: center;
                    background-color: var(--background-light, #F2F2F7);
                    color: var(--text-light, #000000);
                    padding: 16px;
                    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
                }
                h1 {
                    margin: 0;
                    font-weight: 600;
                }
                button {
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 24px;
                }
                .dark-mode-icon {
                    display: none;
                }
                .light-mode-icon {
                    display: inline;
                }
            </style>
            <h1>Catatan Harian</h1>
            <button id="toggleTheme">
                <span class="dark-mode-icon">🌙</span>
                <span class="light-mode-icon">☀️</span>
            </button>
        `;
    }

    // Fungsi untuk mengganti tema
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        this.updateTheme();
    }

    updateTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.style.setProperty('--background-light', isDarkMode ? '#1C1C1E' : '#F2F2F7');
        this.style.setProperty('--text-light', isDarkMode ? '#FFFFFF' : '#000000');

        const darkModeIcon = this.shadowRoot.querySelector('.dark-mode-icon');
        const lightModeIcon = this.shadowRoot.querySelector('.light-mode-icon');

        if (isDarkMode) {
            darkModeIcon.style.display = 'inline';
            lightModeIcon.style.display = 'none';
        } else {
            darkModeIcon.style.display = 'none';
            lightModeIcon.style.display = 'inline';
        }
    }
}

customElements.define('app-bar', AppBarNote);
