export const systemModelTree = {
    name: "The Black Box",
    description:
      "Hidden operations that make the world programmable. These internal logics turn physical, social and sensory experience into data that systems record, encode, route and compute. They shape how inequality is generated, reinforced or obscured across technical, institutional and infrastructural environments.",
  
    children: [
      // -------------------------
      // RING 1 – DIGITAL MEDIATION
      // -------------------------
      {
        name: "Digital mediation",
        description: "Ways information moves through a system.",
        children: [
          {
            name: "In data",
            description:
              "How information is captured, collected or recorded. Includes documentation, measurement, sensing, metadata and categorisation."
          },
          {
            name: "Via data",
            description:
              "How information is routed, processed or transformed within a system. Includes infrastructural flows, computation, organisation, sorting and transmission."
          },
          {
            name: "By data",
            description:
              "How information is circulated, reused or reinterpreted by communities and publics. Includes communal meaning-making, recontextualisation, creative reuse and reinterpretation of outputs."
          }
        ]
      },
  
      // -------------------------
      // RING 2 – CONDITIONS OF MEDIATION
      // -------------------------
      {
        name: "Conditions of mediation",
        description:
          "Technical, institutional and procedural elements that shape how mediation happens.",
        children: [
          {
            name: "Systems",
            description:
              "Platforms, networks, databases, hardware and organisational structures."
          },
          {
            name: "People",
            description:
              "Individuals who design, maintain, operate or experience systems."
          },
          {
            name: "Processes",
            description:
              "Procedures for handling information: documentation, classification, verification, moderation, sorting and routing."
          }
        ]
      },
  
      // -------------------------
      // RING 3 – LIVED EXPERIENCE
      // -------------------------
      {
        name: "Lived experience",
        description:
          "Domains where mediation meets everyday life — sensory, emotional, relational and material.",
        children: [
          {
            name: "Narrative",
            description:
              "Forms of story, memory, history and personal or collective documentation."
          },
          {
            name: "Embodiment",
            description:
              "Physical, sensory and perceptual aspects of life including movement, sensation and interaction."
          },
          {
            name: "Materiality",
            description:
              "Devices, infrastructures and environments that shape everyday life. Includes objects, technologies, built forms and spatial conditions."
          },
          {
            name: "Labour",
            description:
              "Activities through which effort, production or contribution occur. Includes paid, unpaid, formal and informal work."
          },
          {
            name: "Care",
            description:
              "Practices of support and relational maintenance including caregiving, assistance and interdependence."
          },
          {
            name: "Authorship",
            description:
              "Creation and expression of meaning or representation. Includes writing, documenting, designing and producing."
          },
          {
            name: "Affect",
            description:
              "Emotional, atmospheric and felt dimensions of experience."
          },
          {
            name: "Relationality",
            description:
              "Social connections, belonging and interpersonal ties."
          }
        ]
      },
  
      // -------------------------
      // RING 4 – POSITIONALITIES
      // -------------------------
      {
        name: "Positionalities",
        description:
          "Structural locations that shape how people encounter systems and inequalities.",
        children: [
          { name: "Race", description: "Patterns related to racial identity and racialisation." },
          { name: "Ethnicity", description: "Shared cultural heritage, linguistic background and belonging." },
          { name: "Class", description: "Socioeconomic position shaped by income, resources, employment and conditions." },
          { name: "Gender", description: "Identity, expression and social organisation related to gender." },
          { name: "Sexuality and LGBTQI+", description: "Sexual orientation, gender diversity and related forms of social positioning." },
          { name: "Disability", description: "Physical, sensory, cognitive or mental characteristics shaping interaction with environments and systems." },
          { name: "Age", description: "Life stage or generational position." },
          { name: "Migration and Legal Status", description: "Citizenship, residency, documentation, mobility and cross-border conditions." },
          { name: "Religion", description: "Belief systems, cultural affiliation and social belonging." },
          { name: "Urban and Rural", description: "Spatial environments shaped by infrastructural density or remoteness." },
          { name: "Nation and Region", description: "Geopolitical and geographical location within national and global structures." },
          { name: "Language", description: "Linguistic identity, communication patterns and access to resources." },
          { name: "Caste", description: "Inherited stratification shaped by culture and history." },
          { name: "Indigeneity", description: "Indigenous belonging, land relations, cultural continuity and collective identity." },
          { name: "Carceral Status", description: "Position in relation to policing, surveillance, detention or incarceration." },
          { name: "Family and Kinship Structure", description: "Household configurations, relational roles and responsibilities." }
        ]
      },
  
      // -------------------------
      // OUTERMOST
      // -------------------------
      {
        name: "Outermost",
        description: "Practices that follow from making mediation visible.",
        children: [
          {
            name: "Literacy",
            description:
              "Understanding how mediation works across all layers of the system."
          },
          {
            name: "Visibility",
            description:
              "Seeing what becomes perceptible once mediation is understood."
          },
          {
            name: "Accountability",
            description:
              "Acting on what becomes visible — in design decisions, research, and professional practice."
          }
        ]
      }
    ]
  };
  