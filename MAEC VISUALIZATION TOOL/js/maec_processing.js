/* Function for processing MAEC XML file text nodes */

function processXML(xml) {
    removeTextNodes(xml);
    return xml;
  
    /* This function will remove all of the text nodes from the uploaded XML file  */
    /* This is done as they aren't necessary when displaying only relevant MAEC data within the final tree graph */
    function removeTextNodes(xml) {
      if (!xml.elements) return;
      /* Searching for all the text nodes / tags and creating an array with the xml attributes */
      if (xml.elements.length === 1 && xml.elements[0].type === "text") {
        if (!xml.attributes) xml.attributes = {};
        /* Setting value of XML attributes to the text nodes / tags, then deleting them */
        xml.attributes.value = xml.elements[0].text;
        delete xml.elements;
        /* Execute the 'removeTextNodes' function once for every element currently present in the array  */
      } else {
        xml.elements.forEach((element) => removeTextNodes(element));
      }
    }
  }
  