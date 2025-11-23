// src/components/FocusedRingSunburst.jsx
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { systemModelTree } from "../data/systemModelData";

const FocusedRingSunburst = ({ width = 720, height = 720 }) => {
  const svgRef = useRef(null);
  const [selectedRingIndex, setSelectedRingIndex] = useState(null); // 1..4, null = none

  // Outermost layer (Literacy / Visibility / Accountability) for legend pills
  const outermost =
    systemModelTree.children && systemModelTree.children.length > 4
      ? systemModelTree.children[4]
      : null;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const container = d3.select(svgEl.parentNode);
    container.selectAll(".sunburst-tooltip").remove();

    const tooltip = container
      .append("div")
      .attr("class", "sunburst-tooltip")
      .style("position", "absolute")
      .style("padding", "8px 10px")
      .style("background", "rgba(15,23,42,0.96)")
      .style("color", "#e5e7eb")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("max-width", "260px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 30);

    const root = systemModelTree;

    // Use only the first 4 children as rings (Digital mediation, Conditions, Lived, Positionalities)
    const ringsRaw = (root.children || []).slice(0, 4);
    const ringCount = ringsRaw.length;

    const w = width;
    const h = height;
    const maxRadius = Math.min(w, h) / 2 - 40;

    // Base ring width with minimal gaps
    const baseRingWidth = maxRadius / (ringCount + 1.2);
    const gap = baseRingWidth * 0.04; // almost no gap

    // Small focus scale when a ring is selected
    const focusScale = selectedRingIndex ? 1.04 : 1.0;

    // Colour palette for rings (bands)
    const ringColors = {
      1: "#38bdf8", // blue – data mediation
      2: "#a855f7", // purple – system conditions
      3: "#22c55e", // green – lived experience
      4: "#fb923c" // orange – positionality
    };

    // Short lines to show under ring labels
    const ringMeta = [
      {
        label: "Digital mediation",
        subline: "How data movement creates inequality"
      },
      {
        label: "Conditions of mediation",
        subline: "How systems and processes organise inequality"
      },
      {
        label: "Domains of lived experience",
        subline: "Where inequality is encountered and felt"
      },
      {
        label: "Positionalities",
        subline:
          "Who is structurally situated differently inside systems"
      }
    ];

    const svgRoot = svg
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", `${-w / 2} ${-h / 2} ${w} ${h}`)
      .append("g")
      .attr("transform", "translate(0,0)");

    const g = svgRoot
      .append("g")
      .attr("class", "sunburst-root")
      .attr("transform", `scale(${focusScale})`);

    // ---- Centre circle: The Black Box ----
    const centreRadius = baseRingWidth * 0.85;

    g.append("circle")
      .attr("r", centreRadius)
      .attr("fill", "#020617")
      .attr("stroke", "#0f172a")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 1.1)
      .style("cursor", "pointer")
      .on("mouseover", (event) => {
        d3.select(event.currentTarget)
          .attr("stroke-width", 1.6)
          .attr("stroke", "#38bdf8");
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${root.name}</strong><br/><span style="opacity:0.85">${root.description}</span>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("stroke-width", 1.1)
          .attr("stroke", "#0f172a");
        tooltip.style("opacity", 0);
      })
      .on("click", () => {
        setSelectedRingIndex(null); // reset focus
      });

    // Centre labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.4em")
      .attr("fill", "#e5e7eb")
      .style("font-size", "13px")
      .style("font-weight", 600)
      .text("The Black Box");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.0em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("Opaque computational processes");
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.2em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("that produce inequality.");

    // ---- Ring radii ----
    const ringGeometry = ringsRaw.map((ring, i) => {
      const index = i + 1; // 1..4
      const innerRadius = centreRadius + gap + (index - 1) * (baseRingWidth + gap);
      let outerRadius = innerRadius + baseRingWidth;

      // make outermost ring slightly smaller
      if (index === ringCount) {
        outerRadius = innerRadius + baseRingWidth * 0.88;
      }

      const meta = ringMeta[i] || {};
      return {
        ringIndex: index,
        name: meta.label || ring.name,
        subline: meta.subline || "",
        description: ring.description,
        components: ring.children || [],
        innerRadius,
        outerRadius
      };
    });

    // ---- Build slices for all rings (always visible outlines) ----
    const allSlices = [];
    ringGeometry.forEach((ring) => {
      const comps = ring.components;
      const k = comps.length;
      if (!k) return;

      const angleStep = (2 * Math.PI) / k;
      comps.forEach((comp, i) => {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        allSlices.push({
          ringIndex: ring.ringIndex,
          name: comp.name,
          description: comp.description,
          innerRadius: ring.innerRadius,
          outerRadius: ring.outerRadius,
          startAngle,
          endAngle,
          midAngle: startAngle + angleStep / 2
        });
      });
    });

    // ---- Arc generators ----
    const fullRingArc = d3
      .arc()
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius);

    const sliceArc = d3
      .arc()
      .innerRadius((d) => d.innerRadius)
      .outerRadius((d) => d.outerRadius)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .cornerRadius(1.5);

    // ---- Base ring bands (clickable, subtle tint) ----
    const ringGroup = g.append("g").attr("class", "rings");

    ringGroup
      .selectAll("path.ring-base")
      .data(ringGeometry)
      .join("path")
      .attr("class", "ring-base")
      .attr("d", fullRingArc)
      .attr("fill", (d) => {
        const c = d3.color(ringColors[d.ringIndex] || "#64748b");
        c.opacity = selectedRingIndex
          ? d.ringIndex === selectedRingIndex
            ? 0.12
            : 0.04
          : 0.08;
        return c.toString();
      })
      .attr("stroke", (d) => ringColors[d.ringIndex] || "#64748b")
      .attr("stroke-width", (d) =>
        d.ringIndex === selectedRingIndex ? 1.6 : 0.9
      )
      .attr("stroke-opacity", (d) =>
        selectedRingIndex && d.ringIndex !== selectedRingIndex ? 0.35 : 0.8
      )
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke-width", 1.9)
          .attr("stroke", "#e5e7eb")
          .attr("stroke-opacity", 1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name}</strong><br/><span style="opacity:0.85">${d.description}</span>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke", ringColors[d.ringIndex] || "#64748b")
          .attr("stroke-width", d.ringIndex === selectedRingIndex ? 1.6 : 0.9)
          .attr(
            "stroke-opacity",
            selectedRingIndex && d.ringIndex !== selectedRingIndex ? 0.35 : 0.8
          );
        tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        setSelectedRingIndex((prev) =>
          prev === d.ringIndex ? null : d.ringIndex
        );
      });

    // ---- Ring labels + sublines ----
    const labelGroup = g.append("g").attr("class", "ring-labels");

    labelGroup
      .selectAll("g.ring-label-group")
      .data(ringGeometry)
      .join("g")
      .attr("class", "ring-label-group")
      .each(function (d) {
        const grp = d3.select(this);
        const midRadius = (d.innerRadius + d.outerRadius) / 2;

        grp
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr("y", -midRadius)
          .attr("fill", "#e5e7eb")
          .style("font-size", "11px")
          .style("font-weight", 600)
          .text(d.name);

        if (d.subline) {
          grp
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", -midRadius + 14)
            .attr("fill", "#94a3b8")
            .style("font-size", "9px")
            .text(d.subline);
        }
      });

    // ---- Slices (always visible outlines) ----
    const sliceGroup = g.append("g").attr("class", "ring-slices");

    sliceGroup
      .selectAll("path.slice")
      .data(allSlices)
      .join("path")
      .attr("class", "slice")
      .attr("d", sliceArc)
      .attr("fill", "none")
      .attr("stroke", (d) => ringColors[d.ringIndex] || "#64748b")
      .attr("stroke-width", (d) =>
        d.ringIndex === selectedRingIndex ? 1.4 : 0.6
      )
      .attr("stroke-opacity", (d) =>
        selectedRingIndex && d.ringIndex !== selectedRingIndex ? 0.3 : 0.6
      )
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke-width", 1.8)
          .attr("stroke", "#e5e7eb")
          .attr("stroke-opacity", 1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name}</strong><br/><span style="opacity:0.85">${d.description}</span>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke", ringColors[d.ringIndex] || "#64748b")
          .attr("stroke-width", d.ringIndex === selectedRingIndex ? 1.4 : 0.6)
          .attr(
            "stroke-opacity",
            selectedRingIndex && d.ringIndex !== selectedRingIndex
              ? 0.3
              : 0.6
          );
        tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        setSelectedRingIndex((prev) =>
          prev === d.ringIndex ? null : d.ringIndex
        );
      });

    // ---- Labels only for slices of the selected ring (avoid clutter) ----
    if (selectedRingIndex != null) {
      const selectedSlices = allSlices.filter(
        (s) => s.ringIndex === selectedRingIndex
      );

      const sliceLabelGroup = g.append("g").attr("class", "slice-labels");

      sliceLabelGroup
        .selectAll("text.slice-label")
        .data(selectedSlices)
        .join("text")
        .attr("class", "slice-label")
        .attr("text-anchor", "middle")
        .attr(
          "x",
          (d) =>
            ((d.innerRadius + d.outerRadius) / 2) * Math.sin(d.midAngle)
        )
        .attr(
          "y",
          (d) =>
            -((d.innerRadius + d.outerRadius) / 2) * Math.cos(d.midAngle)
        )
        .attr("fill", "#e5e7eb")
        .style("font-size", "9px")
        .style("pointer-events", "none")
        .text((d) => d.name);
    }
  }, [width, height, selectedRingIndex]);

  // Legend data
  const legendItems = [
    {
      color: "#38bdf8",
      title: "Data mediation",
      text: "Inequalities in how data is recorded, processed, routed, circulated."
    },
    {
      color: "#a855f7",
      title: "System conditions",
      text: "Inequalities produced by systems, people and processes."
    },
    {
      color: "#22c55e",
      title: "Lived experience",
      text: "Inequalities across narrative, embodiment, materiality, labour, care, authorship, affect and relationality."
    },
    {
      color: "#fb923c",
      title: "Positionality",
      text: "Structural inequalities across race, class, gender, language, disability and related categories."
    }
  ];

  const literacyItems =
    outermost && outermost.children
      ? outermost.children.map((c) => c.name)
      : ["Literacy", "Visibility", "Accountability"];

  return (
    <div
      style={{
        position: "relative",
        background: "#020617",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 24px 60px rgba(15,23,42,0.85)",
        width: "100%",
        maxWidth: `${width}px`,
        margin: "0 auto"
      }}
    >
      <svg ref={svgRef} style={{ width: "100%", height: "auto", display: "block" }} />

      {/* Legend */}
      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid rgba(148,163,184,0.3)",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          color: "#e5e7eb",
          fontSize: "13px"
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "4px"
            }}
          >
            Dimensions of the digital divide
          </div>
          <div style={{ color: "#9ca3af" }}>
            The digital divide is not one gap. It is produced at multiple
            layers.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "6px"
          }}
        >
          {legendItems.map((item) => (
            <div
              key={item.title}
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "4px",
                  background: item.color,
                  marginTop: "2px"
                }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "2px",
                    fontSize: "12px"
                  }}
                >
                  {item.title}
                </div>
                <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            alignItems: "center",
            color: "#9ca3af",
            fontSize: "12px"
          }}
        >
          <span style={{ marginRight: "4px" }}>
            Interpretation & response:
          </span>
          {literacyItems.map((label, idx) => (
            <React.Fragment key={label}>
              {idx > 0 && <span>→</span>}
              <span
                style={{
                  border: "1px solid rgba(148,163,184,0.6)",
                  borderRadius: "999px",
                  padding: "2px 10px",
                  color: "#e5e7eb"
                }}
              >
                {label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusedRingSunburst;
