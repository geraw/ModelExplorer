// Set up initial graph data
const data = {
  nodes: [
    { id: "1", label: 'Node 1', expanded: false },
    { id: "2", label: 'Node 2', expanded: false },
    { id: "3", label: 'Node 3', expanded: false },
    { id: "4", label: 'Node 4', expanded: false },
    { id: "5", label: 'Node 5', expanded: false },
  ],
  links: [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
  ],
};

// Use d3-dag to layout the graph
const layout = d3.dagStratify()(data.nodes);
const dag = d3.sugiyama()(layout);

// Create SVG elements for the graph
const svg = d3.select('svg');
const g = svg.append('g');

// Create node and link elements
const nodes = g.selectAll('.node')
  //.data(dag.descendants())
  .enter()
  .append('g')
  .attr('class', 'node')
  .attr('transform', d => `translate(${d.x}, ${d.y})`);

nodes.append('circle')
  .attr('r', 10);

const links = g.selectAll('.link')
  //.data(dag.links())
  .enter()
  .append('path')
  .attr('class', 'link')
  .attr('d', d3.linkHorizontal()
    .x(d => d.x)
    .y(d => d.y)
  );

// Add click event listener to nodes
nodes.on('click', d => {
  // Toggle expanded flag on data object
  d.data.expanded = !d.data.expanded;

  // Filter graph data based on expanded nodes
  const filteredData = {
    nodes: data.nodes.filter(node => {
      return node === d.data || node.descendants().includes(d.data);
    }),
    links: data.links.filter(link => {
      return filteredData.nodes.includes(link.source) && filteredData.nodes.includes(link.target);
    }),
  };

  // Update visualization with filtered data
  update(filteredData);
});

function update(data) {
  // Update node and link data
  const layout = d3.dagStratify()(data.nodes);
  const dag = d3.sugiyama()(layout);
  const nodes = g.selectAll('.node')
    .data(dag.descendants());

  // Remove any nodes that are no longer in the data
  nodes.exit().remove();

  // Add new nodes
  const newNodes = nodes.enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  newNodes.append('circle')
    .attr('r', 10);

  // Update node positions and links
  nodes.merge(newNodes)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  const links = g.selectAll('.link')
    .data(dag.links());

  // Remove any links that are no longer in the data
  links.exit().remove();

  // Add new links
  links.enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(d => d.x)
      .y(d => d.y)
    );

  // Transition node and link positions
  nodes.merge(newNodes).transition()
    .duration(500)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  links.transition()
    .duration(500)
    .attr('d', d3.linkHorizontal()
      .x(d => d.x)
      .y(d => d.y)
    );

  // Add click event listener to nodes
  nodes.on('click', d => {
    // Toggle expanded flag on data object
    d.data.expanded = !d.data.expanded;

    // Filter graph data based on expanded nodes
    const filteredData = {
      nodes: data.nodes.filter(node => {
        return node === d.data || node.descendants().includes(d.data);
      }),
      links: data.links.filter(link => {
        return filteredData.nodes.includes(link.source) && filteredData.nodes.includes(link.target);
      }),
    };

    // Update visualization with filtered data
    update(filteredData);
  });
}
