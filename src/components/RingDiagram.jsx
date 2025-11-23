import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { systemModelTree } from "../data/systemModelData";

const RingDiagram = ({ width = 800, height = 800 }) => {
  const svgRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = centre
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    // Build a simple array of layers from the hierarchy
    const root = d3.hierarchy(systemModelTree);

    const builtLayers = [
      {
        id: "centre",
        name: root.data.name,
        description: root.data.description,
        children: root.children ? root.children.map(c => c.data) : []
      },
      ...root.children.map(node => ({
        id: node.data.name,
        name: node.data.name,
        description: node.data.description,
        children: node.children ? node.children.map(c => c.data) : []
      }))
    ];

    setLayers(builtLayers);
  }, []);

  useEffect(() => {
    if (!layers.length) return;
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const container = d3.select(svgEl.parentNode);
    container.selectAll(".ring-tooltip").remove();

    const tooltip = container
      .append("div")
      .attr("class", "ring-tooltip")
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

    const w = width;
    const h = height;
    const centerX = 0;
    const centerY = 0;

    const g = svg
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", `${-w / 2} ${-h / 2} ${w} ${h}`)
      .append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    const ringCount = layers.length - 1; // excluding centre
    const maxRadius = Math.min(w, h) / 2 - 40;
    const bandWidth = maxRadius / (ringCount + 1.4); // +extra for spacing
    const gap = bandWidth * 0.2;

    // Colour scale for rings
    const colorScale = d3
      .scaleLinear()
      .domain([1, ringCount])
      .range(["#38bdf8", "#a855f7"]);

    // ---- Centre circle (The Black Box) ----
    const centreRadius = bandWidth * 0.9;

    g.append("circle")
      .attr("r", centreRadius)
      .attr("fill", "#020617")
      .attr("stroke", selectedIndex === 0 ? "#f97316" : "#334155")
      .attr("stroke-width", selectedIndex === 0 ? 2 : 1)
      .style("cursor", "pointer")
      .on("mouseover", function (event) {
        d3.select(this).attr("stroke-width", 3).attr("stroke", "#facc15");
        const centreLayer = layers[0];
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${centreLayer.name}</strong><br/><span style="opacity:0.85">${centreLayer.description}</span>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", selectedIndex === 0 ? 2 : 1)
          .attr("stroke", selectedIndex === 0 ? "#f97316" : "#334155");
        tooltip.style("opacity", 0);
      })
      .on("click", () => {
        setSelectedIndex(0);
      });

    // Centre label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#f9fafb")
      .style("font-size", "13px")
      .style("font-weight", 600)
      .text("The Black Box");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("Hidden operations that");
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.3em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("turn experience into data.");

    // ---- Rings ----
    const ringData = layers.slice(1).map((layer, i) => {
      const index = i + 1; // ring index offset (1..)
      const innerRadius = centreRadius + gap + (index - 1) * (bandWidth + gap);
      const outerRadius = innerRadius + bandWidth;

      return {
        layerIndex: index,
        name: layer.name,
        description: layer.description,
        innerRadius,
        outerRadius
      };
    });

    const arcGen = d3
      .arc()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .innerRadius(d => d.innerRadius)
      .outerRadius(d => d.outerRadius);

    g.selectAll("path.ring-band")
      .data(ringData)
      .join("path")
      .attr("class", "ring-band")
      .attr("d", arcGen)
      .attr("fill", d => {
        const base = colorScale(d.layerIndex);
        const c = d3.color(base);
        if (!c) return "#334155";
        if (d.layerIndex === selectedIndex) {
          c.brighter(0.8);
        } else {
          c.darker(0.4);
        }
        c.opacity = 0.85;
        return c.toString();
      })
      .attr("stroke", d =>
        d.layerIndex === selectedIndex ? "#e5e7eb" : "#020617"
      )
      .attr("stroke-width", d => (d.layerIndex === selectedIndex ? 2 : 1))
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "#facc15");
        const layer = layers[d.layerIndex];
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${layer.name}</strong><br/><span style="opacity:0.85">${layer.description}</span>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke-width", d.layerIndex === selectedIndex ? 2 : 1)
          .attr("stroke", d.layerIndex === selectedIndex ? "#e5e7eb" : "#020617");
        tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        setSelectedIndex(d.layerIndex);
      });

    // ---- Ring labels (names of each ring) ----
    const labelRadiusOffset = bandWidth / 2;

    g.selectAll("text.ring-label")
      .data(ringData)
      .join("text")
      .attr("class", "ring-label")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", d => -(d.innerRadius + labelRadiusOffset))
      .attr("fill", "#e5e7eb")
      .style("font-size", "11px")
      .style("font-weight", 500)
      .text(d => layers[d.layerIndex].name);

  }, [width, height, layers, selectedIndex]);

  const selectedLayer = layers[selectedIndex] || null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1.4fr)",
        gap: "24px",
        alignItems: "center",
        background: "#020617",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 20px 50px rgba(15,23,42,0.85)"
      }}
    >
      <div style={{ position: "relative" }}>
        <svg ref={svgRef} />
      </div>

      <div
        style={{
          color: "#e5e7eb",
          fontSize: "14px",
          lineHeight: 1.5,
          maxHeight: height,
          overflowY: "auto",
          paddingRight: "8px"
        }}
      >
        {selectedLayer && (
          <>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "6px"
              }}
            >
              {selectedLayer.name}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "12px"
              }}
            >
              {selectedLayer.description}
            </p>

            {selectedLayer.children && selectedLayer.children.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#a5b4fc"
                  }}
                >
                  Components
                </h3>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {selectedLayer.children.map(child => (
                    <li key={child.name} style={{ marginBottom: "6px" }}>
                      <strong>{child.name}:</strong>{" "}
                      <span style={{ color: "#d1d5db" }}>
                        {child.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(!selectedLayer.children ||
              selectedLayer.children.length === 0) && (
              <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>
                No further sub-components on this layer.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RingDiagram;
