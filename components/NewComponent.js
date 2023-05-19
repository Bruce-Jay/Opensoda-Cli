export default class NewComponent extends HTMLElement {
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
  
  customElements.define('new-component', NewComponent)