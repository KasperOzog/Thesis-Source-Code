{
    /* Defining permanent variables xmlTable and xmlTree */
    let xmlTable, xmlTree;
  
    /* Configuring color map configuration to be used with d3 tree graph */
    const color = d3
      .scaleOrdinal()
      .domain(COLOR_MAP.map((d) => d.tag))
      .range(COLOR_MAP.map((d) => d.color))
      .unknown("#aaa");
  
    /* Defining variables for element selectors to make code less messy */  
    const xmlInputEl = document.querySelector("#xmlFileInput");
    const xmlOutputEl = document.querySelector("output[for='xmlFileInput']");
    /* Creating instance of the previously defined class objects to use for visualization */
    new XMLInput({
      inputEl: xmlInputEl,
      outputEl: xmlOutputEl,
    });
    /* Adding function from 'maec_upload' for xml to javascript object */
    xmlInputEl.addEventListener("xmlready", ready);
  
    function ready(event) {
      const data = processXML(event.detail);
  
      /* If both components are available, make all actively hidden data visible  */
      if (!xmlTable || !xmlTree) {
        d3.selectAll("div[hidden]").attr("hidden", null);
        
        /* Color identifier and data being passed to the tree */
        xmlTree = new XMLTree({
          el: document.querySelector("#xmlTree"),
          color,
          data,
          expanded: INITIALLY_EXPANDED,
        });
        
        /* When a row is selected from the tabular table with MAEC Data, nodes on the tree-graph will be highlighted */
        document
          .querySelector("#xmlTable")
          .addEventListener("tagselectionchange", (event) => {
            const tagHighlight = event.detail;
            xmlTree.updateTagHighlight(tagHighlight);
          });
        /* Otherwise display the data as normal */  
      } else {
        xmlTable.updateData(data);
        xml
        xmlTree.updateData(data);
      }
    }
  }
  