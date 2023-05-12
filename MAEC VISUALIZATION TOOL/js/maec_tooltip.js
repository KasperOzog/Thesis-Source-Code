class Tooltip {
    /* Declaring class and initializing the object used for configuring tooltip behavior */
    constructor() {
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.move = this.move.bind(this);
      this.init();
    }
  
    /* Creating init function to initialise D3's tooltips, assign them their own bootstrap layout, and hiding/showing the tooltip when hovering over the node */
    init() {
      this.tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tip card shadow p-2")
        .on("mouseenter", () => {
          this.tooltip.classed("is-visible", true);
        })
        .on("mouseleave", this.hide);
    }
  
    /* Displaying the html tooltip elements, making them visible and creating a fixed size boundary box around it */
    show(html) {
      this.tooltip.html(html).classed("is-visible", true);
      const box = this.tooltip.node().getBoundingClientRect();
      this.width = box.width;
      this.height = box.height;
    }
    
    /* Hiding the tooltip elements */
    hide() {
      this.tooltip.classed("is-visible", false);
    }
  
    /* Configuring the tooltip's position based on where it's activated. Called from main MAEC tree script. */
    move(x0, y0) {
      const xOffset = 10;
      const yOffset = 20;
      let x, y;
      
      /* Translating the x0, y0 values of the tooltip into regular x,y variables to be used during animation and translation to certain pixel values  */
      x = x0;
      if (x + this.width > window.innerWidth - xOffset) {
        x = window.innerWidth - xOffset - this.width;
      }
  
      y = y0 - this.height - yOffset;
      if (y < yOffset) {
        y = yOffset;
      }
  
      this.tooltip.style("transform", `translate(${x}px,${y}px)`);
    }
  }