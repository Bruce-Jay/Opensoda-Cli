export default class NewComponentTwo extends HTMLElement {
    static get observedAttributes() {
      return []
    }
  
    constructor() {
      super()
      this.attachShadow({mode: 'open'})
    }
  
    connectedCallback() {
  
    }
  
    disconnectedCallback() {
  
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
  
    }
  }
  
  customElements.define('new-component-two', NewComponentTwo)