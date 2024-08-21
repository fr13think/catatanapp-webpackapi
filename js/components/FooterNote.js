class FooterNote extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--background-light, #F2F2F7);
                    color: var(--text-light, #000000);
                    text-align: center;
                    padding: 16px;
                    font-size: 14px;
                    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);
                }
            </style>
            <p>Created by Yudha Elfransyah - 13.08.2024</p>
        `;
    }

    updateTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.style.setProperty('--background-light', isDarkMode ? '#1C1C1E' : '#F2F2F7');
        this.style.setProperty('--text-light', isDarkMode ? '#FFFFFF' : '#000000');
    }
}

customElements.define('app-footer', FooterNote);