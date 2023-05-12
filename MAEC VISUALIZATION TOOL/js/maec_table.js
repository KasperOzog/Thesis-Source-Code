/* Tabular and bootstrap were used in the making of this table. */
/* Initially, the XMLTable class is created with the uploaded file's data, color identifiers and elements */
class XMLTable {
    constructor({ el, color, data }) {
      this.el = el;
      this.color = color;
      this.data = data;
      this.wrangle();
    }
  
    /* Re-mapping the data which can be obtained from the hierarchy that was rendered by d3's tree graph  */
    /* Data relating to MAEC tag names and their total re-occurences are obtained from all of the nodes and displayed to the graph */
    wrangle() {
      this.tableData = Array.from(
        d3.rollup(
          d3
            .hierarchy(this.data.elements[0].elements[0], (d) => d.elements)
            .descendants(),
          (v) => v.length,
          (d) => d.data.name
        ),
        ([tag, count]) => ({ tag, count })
      ).sort(
        (a, b) => d3.descending(a.count, b.count) || d3.ascending(a.tag, b.tag)
      );
    }
    
    /* Creating the custom bootstrap table in it's smallest configuration with borders for easier identification of reulsts */
    render() {
      if (!this.table) {
        this.el.classList.add("xml-table","table-sm","table-bordered");
      } 
    }
  
    updateData(data) {
      this.data = data;
      this.wrangle();
    }
  }