// src/components/RadialDendrogram.jsx

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { systemModelTree } from "../data/systemModelData";

const RadialDendrogram = ({ width = 800, height = 800 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const container = d3.select(svgEl.parentNode);
    container.selectAll(".tree-tooltip").remove();

    const tooltip = container
      .append("div")
      .attr("class", "tree-tooltip")
      .style("position", "absolute")
      .style("padding", "8px 10px")
      .style("background", "rgba(15,23,42,0.95)")
      .style("color", "#f9fafb")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("max-width", "260px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 20);

    const radius = Math.min(width, height) / 2 - 40;

    // Build hierarchy
    const root = d3.hierarchy(systemModelTree);

    // Radial cluster layout
    const cluster = d3.cluster().size([2 * Math.PI, radius]);
    cluster(root);

    // Set up SVG
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .append("g");

    // Links (curved radial)
    const linkGen = d3
      .linkRadial()
      .angle(d => d.x)
      .radius(d => d.y);

    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#1f2937")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d => linkGen({ source: d.source, target: d.target }));

    // Nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        d =>
          `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      );

    node
      .append("circle")
      .attr("r", d => (d.depth === 0 ? 6 : d.children ? 4 : 3))
      .attr("fill", d => {
        if (d.depth === 0) return "#f97316"; // centre
        if (d.depth === 1) return "#38bdf8"; // big branches
        if (d.depth === 2) return "#a855f7"; // ring domains
        return "#e5e7eb"; // leaves
      })
      .attr("stroke", "#020617")
      .attr("stroke-width", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#facc15");

        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.name}</strong><br/><span style="opacity:0.85">${d.data.description || ""}</span>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", d => {
          const node = d3.select(this).datum();
          if (node.depth === 0) return "#f97316";
          if (node.depth === 1) return "#38bdf8";
          if (node.depth === 2) return "#a855f7";
          return "#e5e7eb";
        });
        tooltip.style("opacity", 0);
      });

    // Labels
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => (d.x < Math.PI === !d.children ? 8 : -8))
      .attr("text-anchor", d =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .attr("transform", d => (d.x >= Math.PI ? "rotate(180)" : null))
      .text(d => d.data.name)
      .attr("fill", d => (d.depth === 0 ? "#f9fafb" : "#e5e7eb"))
      .style("font-size", d => (d.depth <= 1 ? "12px" : "10px"))
      .style("font-weight", d => (d.depth <= 1 ? 600 : 400))
      .style("cursor", "default");

  }, [width, height]);

  return (
    <div
      style={{
        position: "relative",
        background: "#020617",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 20px 50px rgba(15,23,42,0.8)",
        width: "100%",
        maxWidth: `${width}px`,
        margin: "0 auto"
      }}
    >
      <svg ref={svgRef} style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
};

export default RadialDendrogram;
