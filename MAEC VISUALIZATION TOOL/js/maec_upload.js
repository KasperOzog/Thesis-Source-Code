class XMLInput {
    /* Declaring class for the file inputs / outputs */
    constructor({ inputEl, outputEl }) {
      this.inputEl = inputEl;
      this.outputEl = outputEl;
      /* Binding the function to the defined objects */
      this.processXMLInput = this.processXMLInput.bind(this);
      this.inputEl.addEventListener("change", this.processXMLInput);
    }
  
    /* Processing the input of the MAEC XML File, setting up event for later response when file reader interacted. Also setting text beside the upload button to the uploaded file name */
    processXMLInput(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        this.outputEl.textContent = file.name;
        
        /* Setting 'xml' as the variable for when files read successfully */
        const xml = event.target.result;
        /* Declaring variable for an options object */
        const options = {
          trim: true,
          ignoreComment: true,
          ignoreDeclaration: true,
        };
        /* XML to Javascript Object including the appended options above */
        const result = xml2js(xml, options);
        /* Sending a custom event called 'xmlready' over to the main visualizer.js script to be used during final display.  */
        this.inputEl.dispatchEvent(
          new CustomEvent("xmlready", {
            bubbles: true,
            detail: result,
          })
        );
      };
      /* Reading contents of the uploaded file */
      reader.readAsText(file);
      /* Ensuring that event.target.value is defined empty string) */
      event.target.value = "";
    }
  }