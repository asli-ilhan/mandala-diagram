import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const MandalaDiagram = ({
  width = 700,
  height = 700,
}) => {
  const svgRef = useRef(null);

  // ---- DATA: segments + rings ----
  // Each "segment" is one wedge of the mandala that stretches from centre to outer ring.
  // You can edit labels and descriptions here without touching the drawing logic.
  const segments = [
    {
      id: "narrative",
      color: "#f97373",
      rings: {
        ring1: {
          label: "In data",
          description:
            "How information is captured, sensed or recorded (documentation, measurement, metadata)."
        },
        ring2: {
          label: "Systems",
          description:
            "Technical and institutional arrangements where mediation occurs (platforms, networks, hardware)."
        },
        ring3: {
          label: "Narrative",
          description:
            "Forms of story, memory, history and documentation in everyday life."
        },
        ring4: {
          label: "Race / Ethnicity",
          description:
            "Patterns of social organisation related to racial identity, racialisation and shared cultural heritage."
        },
        outer: {
          label: "Literacy",
          description:
            "Understanding how mediation operates across all layers of the system."
        }
      }
    },
    {
      id: "embodiment",
      color: "#f9a76c",
      rings: {
        ring1: {
          label: "Via data",
          description:
            "How information is processed and routed inside systems (sorting, computation, flow)."
        },
        ring2: {
          label: "People",
          description:
            "Those who design, operate, maintain, and experience systems."
        },
        ring3: {
          label: "Embodiment",
          description:
            "Physical, sensory and perceptual aspects of life, including movement and interaction."
        },
        ring4: {
          label: "Gender / Sexuality",
          description:
            "Identity, expression, gender diversity and related social positioning."
        },
        outer: {
          label: "Visibility",
          description:
            "What becomes perceptible once mediation is understood."
        }
      }
    },
    {
      id: "materiality",
      color: "#ffd166",
      rings: {
        ring1: {
          label: "By data",
          description:
            "How information is circulated or reused in public life (reinterpretation, community meaning-making)."
        },
        ring2: {
          label: "Processes",
          description:
            "Documentation, classification, verification, moderation, sorting and routing."
        },
        ring3: {
          label: "Materiality",
          description:
            "Devices, infrastructures and environments that shape everyday life."
        },
        ring4: {
          label: "Class / Disability",
          description:
            "Socioeconomic position and physical, sensory, cognitive or mental characteristics."
        },
        outer: {
          label: "Accountability",
          description:
            "Acting on what becomes visible through design, research and professional practice."
        }
      }
    },
    {
      id: "labour",
      color: "#9be15d",
      rings: {
        ring1: {
          label: "In data",
          description:
            "How information is captured, sensed or recorded (documentation, measurement, metadata)."
        },
        ring2: {
          label: "Systems",
          description:
            "Technical and institutional arrangements where mediation occurs (platforms, networks, hardware)."
        },
        ring3: {
          label: "Labour",
          description:
            "Paid and unpaid, formal and informal work and contribution."
        },
        ring4: {
          label: "Age / Migration",
          description:
            "Life stage, generational position, citizenship, residency, documentation and mobility."
        },
        outer: {
          label: "Literacy",
          description:
            "Understanding how mediation operates across all layers of the system."
        }
      }
    },
    {
      id: "care",
      color: "#42d6a4",
      rings: {
        ring1: {
          label: "Via data",
          description:
            "How information is processed and routed inside systems (sorting, computation, flow)."
        },
        ring2: {
          label: "People",
          description:
            "Those who design, operate, maintain, and experience systems."
        },
        ring3: {
          label: "Care",
          description:
            "Practices of support, caregiving, assistance and interdependence."
        },
        ring4: {
          label: "Religion / Language",
          description:
            "Belief systems, cultural affiliation and linguistic identity shaping access and belonging."
        },
        outer: {
          label: "Visibility",
          description:
            "What becomes perceptible once mediation is understood."
        }
      }
    },
    {
      id: "authorship",
      color: "#54a0ff",
      rings: {
        ring1: {
          label: "By data",
          description:
            "How information is circulated or reused in public life (reinterpretation, community meaning-making)."
        },
        ring2: {
          label: "Processes",
          description:
            "Documentation, classification, verification, moderation, sorting and routing."
        },
        ring3: {
          label: "Authorship",
          description:
            "Creation and expression of meaning or representation (writing, designing, producing)."
        },
        ring4: {
          label: "Urban / Rural",
          description:
            "Spatial environments shaped by infrastructural density or remoteness."
        },
        outer: {
          label: "Accountability",
          description:
            "Acting on what becomes visible through design, research and professional practice."
        }
      }
    },
    {
      id: "affect",
      color: "#a66bff",
      rings: {
        ring1: {
          label: "In data",
          description:
            "How information is captured, sensed or recorded (documentation, measurement, metadata)."
        },
        ring2: {
          label: "Systems",
          description:
            "Technical and institutional arrangements where mediation occurs (platforms, networks, hardware)."
        },
        ring3: {
          label: "Affect",
          description:
            "Emotional, atmospheric and felt dimensions of experience."
        },
        ring4: {
          label: "Nation / Region",
          description:
            "Geopolitical and geographical location within national and global structures."
        },
        outer: {
          label: "Literacy",
          description:
            "Understanding how mediation operates across all layers of the system."
        }
      }
    },
    {
      id: "relationality",
      color: "#ff6ac1",
      rings: {
        ring1: {
          label: "Via data",
          description:
            "How information is processed and routed inside systems (sorting, computation, flow)."
        },
        ring2: {
          label: "People",
          description:
            "Those who design, operate, maintain, and experience systems."
        },
        ring3: {
          label: "Relationality",
          description:
            "Social connections, belonging and interpersonal ties."
        },
        ring4: {
          label: "Caste / Carceral / Family",
          description:
            "Inherited stratification, position in relation to policing/surveillance, and family/kinship structures."
        },
        outer: {
          label: "Visibility",
          description:
            "What becomes perceptible once mediation is understood."
        }
      }
    }
  ];

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove(); // clear on re-render

    const container = d3.select(svgEl.parentNode);
    // Remove old tooltips if any
    container.selectAll(".mandala-tooltip").remove();

    const tooltip = container
      .append("div")
      .attr("class", "mandala-tooltip")
      .style("position", "absolute")
      .style("padding", "8px 10px")
      .style("background", "rgba(15,23,42,0.95)")
      .style("color", "#f9fafb")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("max-width", "260px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 10);

    const margin = 40;
    const w = width;
    const h = height;
    const radius = Math.min(w, h) / 2 - margin;

    const centerX = w / 2;
    const centerY = h / 2;

    const g = svg
      .attr("viewBox", `0 0 ${w} ${h}`)
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const ringCount = 5; // ring1, ring2, ring3, ring4, outer
    const ringThickness = radius / (ringCount + 1.3); // +1.3 to leave space for the centre

    // ---- Draw centre: The Black Box ----
    const centerOuter = ringThickness * 1.1;

    const centerArc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(centerOuter)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append("path")
      .attr("d", centerArc)
      .attr("fill", "#020617");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.4em")
      .attr("fill", "#e5e7eb")
      .style("font-weight", 600)
      .style("font-size", "14px")
      .text("The Black Box");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.0em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("Hidden operations that turn experience");
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.3em")
      .attr("fill", "#9ca3af")
      .style("font-size", "10px")
      .text("into programmable data.");

    // ---- Prepare arc data for each ring + segment ----
    const ringOrder = ["ring1", "ring2", "ring3", "ring4", "outer"];

    const segmentAngle = (2 * Math.PI) / segments.length;

    const allArcs = [];

    ringOrder.forEach((ringId, ringIndex) => {
      const innerR = centerOuter + ringIndex * ringThickness;
      const outerR = innerR + ringThickness * 0.9;

      segments.forEach((segment, segIndex) => {
        const startAngle = segIndex * segmentAngle;
        const endAngle = (segIndex + 1) * segmentAngle;

        const cell = segment.rings[ringId];
        if (!cell) return;

        allArcs.push({
          ringId,
          ringIndex,
          segmentId: segment.id,
          segmentIndex: segIndex,
          label: cell.label,
          description: cell.description,
          color: segment.color,
          innerRadius: innerR,
          outerRadius: outerR,
          startAngle,
          endAngle
        });
      });
    });

    const arcGen = d3
      .arc()
      .innerRadius(d => d.innerRadius)
      .outerRadius(d => d.outerRadius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .cornerRadius(4);

    // ---- Draw arcs ----
    g.selectAll("path.mandala-arc")
      .data(allArcs)
      .join("path")
      .attr("class", "mandala-arc")
      .attr("d", arcGen)
      .attr("fill", d => d3.color(d.color).brighter(d.ringIndex * 0.25))
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "#f9fafb");

        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.label}</strong><br/><span style="opacity:0.85">${d.description}</span>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1)
          .attr("stroke", "#0f172a");
        tooltip.style("opacity", 0);
      });

    // ---- Labels at ring3 (Lived experience) for readability ----
    const livedRingIndex = ringOrder.indexOf("ring3");
    const livedInner = centerOuter + livedRingIndex * ringThickness;
    const livedOuter = livedInner + ringThickness * 0.9;
    const livedLabelRadius = (livedInner + livedOuter) / 2;

    const livedLabels = segments.map((segment, i) => {
      const angle = i * segmentAngle + segmentAngle / 2;
      return {
        text: segment.rings.ring3.label,
        angle,
        radius: livedLabelRadius
      };
    });

    const labelGroup = g.append("g");

    labelGroup
      .selectAll("text.lived-label")
      .data(livedLabels)
      .join("text")
      .attr("class", "lived-label")
      .attr("text-anchor", "middle")
      .attr("x", d => d.radius * Math.sin(d.angle))
      .attr("y", d => -d.radius * Math.cos(d.angle))
      .attr("fill", "#020617")
      .style("font-size", "11px")
      .style("font-weight", 600)
      .attr("transform", d => {
        const deg = (d.angle * 180) / Math.PI;
        const baseX = d.radius * Math.sin(d.angle);
        const baseY = -d.radius * Math.cos(d.angle);
        // Flip labels on the bottom half so they are not upside down
        const rotation =
          deg > 90 && deg < 270 ? deg + 180 : deg;
        return `translate(${baseX},${baseY}) rotate(${rotation})`;
      })
      .text(d => d.text);

  }, [width, height, segments]);

  return (
    <div
      style={{
        position: "relative",
        background: "#020617",
        padding: "24px",
        borderRadius: "20px"
      }}
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default MandalaDiagram;
