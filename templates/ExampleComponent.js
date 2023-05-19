export default class ExampleComponent extends HTMLElement {
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
  
  customElements.define('example-component', ExampleComponent)