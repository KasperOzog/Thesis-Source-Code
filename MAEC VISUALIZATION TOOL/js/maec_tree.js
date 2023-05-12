/* D3, it's graphing library and tabular's custom event were used in the making of the MAEC tree-graph*/
class XMLTree {
    constructor({ el, color, data, expanded = false }) {
      this.el = el;
      this.color = color;
      this.data = data;
      this.expanded = expanded;
      this.linkPath = this.linkPath.bind(this);
      this.collapse = this.collapse.bind(this);
      this.expand = this.expand.bind(this);
      this.adjustScroll = this.adjustScroll.bind(this);
      this.init();
    }
  
    init() {
      this.svgWidth = 300;
      this.svgHeight = 150;
      this.marginTop = 40;
      this.marginRight = 20;
      this.marginBottom = 40;
      this.marginLeft = 20;
      this.columnWidth = 320;
      this.linkOuterWidth = 4;
      this.linkInnerWidth = 2;
      this.nodeHighlightWidth = 20;
      this.nodeOuterWidth = 12;
      this.nodeInnerWidth = 6;
  
      this.duration = 500;
  
      this.tagHighlight = new Set();
  
      /* The general layout used for this visualization being defined */
      this.layout = d3.flextree({
        children: (data) => data.elements,
        nodeSize: (node) => [
          node.children ? (node.children.length - 1) * this.linkOuterWidth : 0,
          this.columnWidth,
        ],
        spacing: 36,
      });
  
      this.container = d3.select(this.el).classed("xml-tree", true);
  
      this.svg = this.container
        .append("svg")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)
        .attr("viewBox", [0, 0, this.svgWidth, this.svgHeight]);
  
      this.g = this.svg
        .append("g")
        .attr("transform", `translate(${this.marginLeft},${this.marginTop})`);
  
      this.gLinks = this.g.append("g").attr("fill", "none");
  
      this.gNodes = this.g.append("g");
  
      this.tooltip = new Tooltip();
  
      this.wrangle();
  
    }
  
    wrangle() {
      this.root = this.layout.hierarchy(this.data.elements[0]);
      this.root.x0 = this.columnWidth / 2;
      this.root.y0 = 0;
      this.root.descendants().forEach((d, i) => {
        d.id = `${this.id}-${i}`;
        d._children = d.children;
      });
  
      if (!this.expanded) {
        this.collapse(this.root);
      }
  
      this.render(this.root);
    }
  
    render(source) {
      /* Creating the new xml tree layout */
      this.root = this.layout(this.root);
  
      this.nodes = this.root.descendants().reverse();
      this.links = this.root.links();
  
      /* Configuring the width and height of the tree and it's nodes */
      let left = this.root;
      let right = this.root;
      let top = this.root;
      let bottom = this.root;
      this.root.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
        if (node.y < top.y) top = node;
        if (node.y > bottom.y) bottom = node;
      });
      const height = right.x - left.x;
      const width = bottom.y - top.y + this.columnWidth;
      this.svgHeight = height + this.marginTop + this.marginBottom;
      this.svgWidth = width + this.marginLeft + this.marginRight;
  
      const transition = this.svg
        .transition()
        .duration(this.duration)
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)
        .attr("viewBox", [0, left.x, this.svgWidth, this.svgHeight]);
  
      transition.end().then(this.adjustScroll).catch(this.adjustScroll);  
  
      /* Updating all of the nodes */
      const node = this.gNodes.selectAll("g").data(this.nodes, (d) => d.id);
  
      /* Entering new nodes back to the parent or root nodes initial positions */
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .attr("cursor", (d) => (d._children ? "pointer" : "default"))
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          this.render(d);
        })
        .on("mouseenter", (event, d) => {
          let attrs = [];
          if (d.data.attributes) {
            attrs = Object.keys(d.data.attributes).filter(
              (attr) => !attr.includes(":")
            );
          }
  
          const html = /*html*/ `<table class="table table-sm table-borderless mb-0">
            <tbody>
              <tr><td>name</td><td>${d.data.name}</td></tr>
              ${attrs
                .map(
                  (attr) =>
                    `<tr><td>${attr}</td><td>${d.data.attributes[attr]}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>`;
          this.tooltip.show(html);
          const box = d3
            .select(event.target)
            .select(".node__line--outer")
            .node()
            .getBoundingClientRect();
          this.tooltip.move(box.x + box.width / 2, box.y);
        })
        .on("mouseleave", this.tooltip.hide);
  
      nodeEnter
        .append("line")
        .attr("class", "node__line node__line--highlight")
        .attr("y1", (d) => -d.xSize / 2)
        .attr("y2", (d) => d.xSize / 2)
        .attr("stroke-linecap", "round")
        .attr("stroke", (d) => this.color(d.data.name))
        .attr("stroke-width", this.nodeHighlightWidth)
        .attr("stroke-opacity", 0.5)
        .attr("display", "none")
        .clone(true)
        .attr("class", "node__line node__line--outer")
        .attr("stroke-width", this.nodeOuterWidth)
        .attr("stroke-opacity", 1)
        .attr("display", null)
        .clone(true)
        .attr("class", "node__line node__line--inner")
        .attr("stroke", (d) => (d._children ? "#fff" : this.color(d.data.name)))
        .attr("stroke-width", this.nodeInnerWidth);
  
      nodeEnter
        .append("text")
        .attr("class", "node__label node__label--inner")
        .attr("dy", "-0.3em")
        .attr("x", 6)
        .attr("y", (d) => -d.xSize / 2)
        .attr("text-anchor", "start")
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr("class", "node__label node__label--outer")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "#fff");
  
      /* Moving the tree graph's nodes to their newly updated positions when animation starts */
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
  
      nodeUpdate
        .selectAll(".node__line")
        .attr("y1", (d) => -d.xSize / 2)
        .attr("y2", (d) => d.xSize / 2);
  
      nodeUpdate
        .select(".node__line--highlight")
        .attr("display", (d) =>
          this.tagHighlight.has(d.data.name) ? null : "none"
        );
  
      nodeUpdate
        .selectAll(".node__label")
        .attr("y", (d) => -d.xSize / 2)
        .attr("font-weight", (d) =>
          this.tagHighlight.has(d.data.name) ? "bold" : null
        );
  
      /* Exitting nodes to the parennt's current positions, animation then removal */
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
  
      nodeExit
        .selectAll(".node__line")
        .attr("y1", (d) => -d.xSize / 2)
        .attr("y2", (d) => d.xSize / 2);
  
      nodeExit.selectAll(".node__label").attr("y", (d) => -d.xSize / 2);
  
      /* Updating the interconnected link lines in the tree graph based on the current node descendants being displayed */
      const link = this.gLinks
        .selectAll("g")
        .data(this.links, (d) => d.target.id);
  
      
      /*  New links entering the graph at the parent's current positions */
      const linkEnter = link.enter().append("g").attr("class", "link");
  
      linkEnter
        .append("path")
        .attr("class", "link__path link__path--outer")
        .attr("stroke-width", this.linkOuterWidth)
        .attr("stroke", "#fff")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return this.linkPath({ source: o, target: o });
        })
        .clone(true)
        .attr("class", "link__path link__path--inner")
        .attr("stroke-width", this.linkInnerWidth)
        .attr("stroke", "#ccc");
  
      /* Transitioning the new links to the updated positions ( The small animation that plays when nodes are expanded or collapsed ) */
      const linkUpdate = link.merge(linkEnter).transition(transition);
  
      linkUpdate.selectAll(".link__path").attr("d", this.linkPath);
  
      /* Transitioning the current links back to the parent node's positions  */
      const linkExit = link.exit().transition(transition).remove();
  
      linkExit.selectAll(".link__path").attr("d", (d) => {
        const o = { x: source.x, y: source.y };
        return this.linkPath({ source: o, target: o });
      });

      /* The exact positions of each of the nodes being stored and converted to x,y for more accurate positioning */
      this.root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  
    /* Collapsing nodes affecting all children */
    collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(this.collapse);
        d.children = null;
      }
    }
  
    /* Expanding a node, and applying this to all child nodes under the parent */
    expand(d) {
      if (d._children) {
        d.children = d._children;
        d.children.forEach(this.expand);
      }
    }
  
    /* The function responsible for automatically focusing on the table filtered tag's position on the table, instead of manually having to locate the highlighted tags */
    adjustScroll() {
      if (this.tagHighlight.size) {
        this.el.scrollLeft = this.el.scrollWidth;
      }
    }
  
    /* Linking the paths all of the descendants based on the current state of the node ( expanded or collapsed ) */
    linkPath(d) {
      const isEnterOrExit = d.source === d.target;
      let xOffset = 0;
      let yOffset = 0;
      if (!isEnterOrExit) {
        
        /* Obtaining all of the children of a descendant */
        const children = d.source.children;
        const n = children.length - 1;
        /* Returning the first index of the target element and assigning it to constant variable 'i' */
        const i = children.indexOf(d.target);
        yOffset = i - n / 2;
        /* Source child changing index */
        let j = 0;
        while (
          j <= n &&
          d.source.x + (j - n / 2) * this.linkOuterWidth > children[j].x
        ) {
          j++;
        }
        if (i < j) {
          xOffset = i - j / 2;
        } else {
          xOffset = (n - j - 1) / 2 - (i - j);
        }
      }
  
      /* The source's initial starting point / Link's exit area */
      const x0 = d.source.y;
      const y0 = isEnterOrExit
        ? d.source.x
        : d.source.x + yOffset * this.linkOuterWidth;
      /* First corner */
      const x1 = isEnterOrExit
        ? d.source.y
        : (d.source.y + d.target.y) / 2 + xOffset * this.linkOuterWidth;
      const y1 = y0;
      /* Second corner */
      const x2 = x1;
      const y2 = d.target.x;
      /* The destination ( target ) node in the hieararchy */
      const x3 = d.target.y;
      const y3 = y2;
  
      /* D3 path calculated utliizing the four positional values above */
      const path = d3.path();
      path.moveTo(x0, y0);
      path.lineTo(x1, y1);
      path.lineTo(x2, y2);
      path.lineTo(x3, y3);
      return path.toString();
    }
  
    updateData(data) {
      this.data = data;
      this.wrangle();
    }
  }
  