import { LabProject } from '../types';

export const INITIAL_PROJECTS: LabProject[] = [
  {
    id: 'proj-1',
    title: 'SkyCast Pro',
    category: 'Weather Application / Web Development',
    status: 'Completed',
    estimated_duration: '2 Weeks',
    description:
      'SkyCast Pro is a weather application designed to provide users with weather information through a simple and user-friendly interface.',
    objectives: [
      'Build an intuitive user interface displaying real-time atmospheric metrics and forecasts',
      'Implement responsive layout adapting cleanly across desktop, tablet, and mobile displays',
      'Integrate weather API endpoints for live temperature, humidity, wind speed, and precipitation data',
      'Provide clean error handling for invalid location searches and network timeouts',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API', 'Responsive Design'],
    requirements: [
      'Intuitive UI with clean typography and iconographic weather states',
      'Search functionality supporting city names and geographic coordinates',
      'Responsive grid layout without horizontal scroll on mobile devices',
      'Accurate live telemetry parsing with unit switching (Celsius / Fahrenheit)',
    ],
    implementation_steps: [
      {
        step_number: 1,
        title: 'UI Wireframing & Markup',
        details:
          'Construct accessible semantic HTML structure and CSS layouts for current temperature, daily forecast cards, and search input.',
      },
      {
        step_number: 2,
        title: 'Weather API Integration',
        details:
          'Implement asynchronous fetch requests to weather API endpoints with error boundaries and loading indicators.',
      },
      {
        step_number: 3,
        title: 'Dynamic DOM Rendering & Responsiveness',
        details:
          'Render temperature, conditions icons, UV index, and humidity dynamically; calibrate responsive media queries.',
      },
    ],
    github_url: 'https://github.com/bhavyapotnuru-999',
    related_module_id: 'mod-1',
    related_module_title: 'Module 1: Foundations of NumPy & Vector Computation',
    related_experiment_numbers: [1],
    updated_at: '2026-10-12T10:00:00.000Z',
  },
  {
    id: 'proj-2',
    title: 'GreenSprout',
    category: 'Sustainable Agriculture / Green Technology',
    status: 'In Progress',
    estimated_duration: '4 Weeks',
    description:
      'GreenSprout is a solar-powered hydroponic fodder system concept designed to support sustainable livestock-fodder production, reduce water consumption, and explore cultivation without chemical fertilizers.',
    objectives: [
      'Target up to 80% water reduction, subject to validation',
      'Design automated nutrient delivery and cycle scheduling for vertical hydroponic fodder trays',
      'Integrate solar photovoltaic power management and low-power telemetry sensors',
      'Explore organic sprout germination and seed growth cycles without synthetic chemical fertilizers',
    ],
    technologies: [
      'IoT Sensors',
      'Solar PV Management',
      'Python',
      'Microcontrollers',
      'Hydroponics',
      'Data Logging',
    ],
    requirements: [
      'Closed-loop water recirculation pipeline minimizing drainage waste',
      'Validated sensor telemetry tracking ambient humidity, temperature, and pH levels',
      'Solar battery charging circuit with fallback energy management',
      '7-day fodder harvest turnaround monitoring from seed to livestock feed',
    ],
    implementation_steps: [
      {
        step_number: 1,
        title: 'System Architecture & Tray Design',
        details:
          'Design vertical tier layout, automated misting nozzles, and recycled drainage reservoirs.',
      },
      {
        step_number: 2,
        title: 'Telemetry & Solar Power Integration',
        details:
          'Connect microcontrollers to temperature/humidity sensors and solar inverter battery monitors.',
      },
      {
        step_number: 3,
        title: 'Water Reduction Validation & Harvest Benchmarking',
        details:
          'Measure volumetric water intake against soil benchmarks, tracking target up to 80% water reduction.',
      },
    ],
    github_url: 'https://github.com/bhavyapotnuru-999',
    related_module_id: 'mod-2',
    related_module_title: 'Module 2: Data Wrangling & Analysis with Pandas',
    related_experiment_numbers: [2, 3],
    updated_at: '2026-10-18T14:30:00.000Z',
  },
  {
    id: 'proj-3',
    title: 'Responsive Web Development Project',
    category: 'ApexPlanet Internship / Web Development',
    status: 'Completed',
    estimated_duration: '2 Weeks',
    description:
      'A frontend development project focused on webpage structure, styling, responsiveness, and interactive functionality using HTML, CSS, and JavaScript.',
    objectives: [
      'Develop accessible, semantic webpage layouts following modern W3C frontend standards',
      'Implement responsive design patterns utilizing CSS Flexbox, Grid, and fluid typography',
      'Engineer client-side interactive behaviors and state transitions using vanilla JavaScript',
      'Optimize frontend assets, cross-browser rendering consistency, and mobile viewport performance',
    ],
    technologies: [
      'HTML',
      'CSS',
      'JavaScript',
      'CSS Flexbox & Grid',
      'Responsive Design',
      'Git',
    ],
    requirements: [
      'Fully responsive layout across mobile (<640px), tablet (640-1024px), and desktop (>1024px)',
      'Clean component structure with maintainable CSS naming architecture',
      'Zero layout shift and fluid scaling across viewports',
      'Interactive components such as navigation menus, modal dialogs, and form validations',
    ],
    implementation_steps: [
      {
        step_number: 1,
        title: 'Semantic Architecture & Mobile-First CSS',
        details:
          'Establish base semantic markup with mobile-first CSS media queries and modular styling variables.',
      },
      {
        step_number: 2,
        title: 'Interactive JavaScript Modules',
        details:
          'Implement dynamic DOM interaction handlers, keyboard accessibility, and UI transitions.',
      },
      {
        step_number: 3,
        title: 'Cross-Device QA & Validation',
        details:
          'Validate performance, lighthouse score, viewport rendering, and responsive image loading.',
      },
    ],
    github_url: 'https://github.com/bhavyapotnuru-999',
    related_module_id: 'mod-3',
    related_module_title: 'Module 3: Statistical Visualizations & Exploratory Data Analysis',
    related_experiment_numbers: [3],
    updated_at: '2026-10-20T11:00:00.000Z',
  },
  {
    id: 'proj-4',
    title: 'Interactive Web Application',
    category: 'ApexPlanet Internship / Frontend Development',
    status: 'In Progress',
    estimated_duration: '3 Weeks',
    description:
      'An internship task focused on creating an interactive web application with a user-friendly interface, responsive layout, and JavaScript-based functionality.',
    objectives: [
      'Create an engaging, user-friendly frontend web application with dynamic state management',
      'Deliver real-time UI updates, event-driven interactions, and input validation without page reloads',
      'Structure modular JavaScript functions and client-side data persistence mechanisms',
      'Ensure responsive design compliance and polished micro-interactions across devices',
    ],
    technologies: [
      'JavaScript',
      'HTML5',
      'CSS3',
      'DOM Manipulation',
      'Local Storage',
      'UI/UX Design',
    ],
    requirements: [
      'Interactive user flows with real-time UI feedback, toasts, and input validation',
      'Persistent browser storage for user actions and customized settings',
      'Responsive dashboard interface optimized for speed and clarity',
      'Modular, readable JavaScript codebase following clean code principles',
    ],
    implementation_steps: [
      {
        step_number: 1,
        title: 'UI/UX Specification & Layout Framing',
        details:
          'Design intuitive component layouts, wireframe action flows, and build the foundational CSS grid.',
      },
      {
        step_number: 2,
        title: 'JavaScript State Engine & Event Handling',
        details:
          'Write modular event listeners, form sanitization, dynamic item rendering, and local persistence.',
      },
      {
        step_number: 3,
        title: 'User Experience Polishing & Testing',
        details:
          'Incorporate smooth animations, keyboard shortcuts, edge-case validation, and feedback notifications.',
      },
    ],
    github_url: 'https://github.com/bhavyapotnuru-999',
    related_module_id: 'mod-4',
    related_module_title: 'Module 4: Exploratory Data Analysis & Feature Engineering',
    related_experiment_numbers: [4, 5],
    updated_at: '2026-10-22T16:00:00.000Z',
  },
  {
    id: 'proj-5',
    title: 'Multi-Agent Reasoning and Verification Engine',
    category: 'Artificial Intelligence',
    status: 'Not Started',
    estimated_duration: '4 Weeks',
    description:
      'An AI project concept exploring multiple AI agents that analyze a problem, compare their responses, identify inconsistencies, and verify a consolidated answer.',
    objectives: [
      'Orchestrate a multi-agent topology comprising specialized proposer, critic, and verifier roles',
      'Implement consensus mechanisms that compare parallel agent inferences and flag logical fallacies',
      'Synthesize verified final outputs with confidence scoring and traceable step-by-step reasoning chains',
      'Benchmark multi-agent consensus accuracy against standard single-agent baseline responses',
    ],
    technologies: [
      'Python',
      'Multi-Agent Systems',
      'LLM Prompt Engineering',
      'Consensus Verification',
      'FastAPI',
      'JSON Schema',
    ],
    requirements: [
      'Decoupled agent roles: Reasoning Agent, Fact-Checker Agent, and Synthesis/Arbitration Agent',
      'Structured cross-agent debate protocols detecting hallucination and contradictory assertions',
      'Deterministic output schema validation with fallback reconciliation',
      'Benchmarking dashboard measuring consensus latency vs verification fidelity',
    ],
    implementation_steps: [
      {
        step_number: 1,
        title: 'Agent Role Definitions & Prompt Pipelines',
        details:
          'Formulate specialized system prompts and persona contracts for Proposer, Skeptic, and Verifier agents.',
      },
      {
        step_number: 2,
        title: 'Consensus Algorithm & Inconsistency Detection',
        details:
          'Implement semantic embedding comparison, contradiction detection, and vote aggregation.',
      },
      {
        step_number: 3,
        title: 'Reconciliation Engine & Evaluation Suite',
        details:
          'Construct the arbitration synthesizer that produces a unified verified answer with confidence metrics.',
      },
    ],
    github_url: 'https://github.com/bhavyapotnuru-999',
    related_module_id: 'mod-5',
    related_module_title: 'Module 5: Supervised Learning — Regression Modeling',
    related_experiment_numbers: [5, 6],
    updated_at: '2026-10-24T09:00:00.000Z',
  },
];
