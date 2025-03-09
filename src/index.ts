#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import core engine components
import { UcpfCore } from "./engine/ucpf-core.js";
import { CreativePatterns } from "./engine/creative-patterns.js";
import { StateManager } from "./engine/state-manager.js";

// Import tool implementations
import { analyzeProblem } from "./tools/analyze-problem.js";
import { exploreCreatively } from "./tools/creative-exploration.js";

// Create class instances
const ucpfCore = new UcpfCore(false); // Start with state disabled
const creativePatterns = new CreativePatterns();
const stateManager = new StateManager(false); // Start with state disabled

/**
 * Create the MCP server with appropriate capabilities
 */
const server = new Server(
  {
    name: "DeepLucid3D",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * Handler for listing available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "ucpf://framework/overview",
        mimeType: "text/markdown",
        name: "UCPF Framework Overview",
        description: "An overview of the Unified Cognitive Processing Framework",
      },
      {
        uri: "ucpf://framework/cognitive-states",
        mimeType: "text/markdown",
        name: "Cognitive States Guide",
        description: "Guide to the cognitive states in the UCPF framework",
      },
      {
        uri: "ucpf://framework/knowledge-dimensions",
        mimeType: "text/markdown",
        name: "Knowledge Dimensions Reference",
        description: "Reference for the knowledge dimensions in the UCPF framework",
      },
    ],
  };
});

/**
 * Handler for listing resource templates
 */
server.setRequestHandler(
  ListResourceTemplatesRequestSchema,
  async () => ({
    resourceTemplates: [
      {
        uriTemplate: "ucpf://session/{sessionId}/analysis",
        name: "Session Analysis",
        mimeType: "text/markdown",
        description: "Analysis results for a specific session",
      },
    ],
  })
);

/**
 * Handler for reading resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  // Static resources
  if (uri === "ucpf://framework/overview") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: `# Unified Cognitive Processing Framework

## Core Principles
This framework combines the recursive self-awareness of DeepLucid with the dimensional knowledge categorization to create a powerful integrated approach to problem-solving and analysis.

## Cognitive Processing Sequence

### Phase 1: Cognitive State Assessment & Knowledge Mapping
1. **Initial Cognitive State Recognition**
   - Identify your current cognitive state:
     - Dark Inertia (reactive, pattern-matching)
     - Passion (engaged but potentially biased)
     - Approaching Lucidity (clear, balanced understanding)
   
2. **Knowledge Dimension Mapping**
   - Map the problem space across three dimensions:
     - **Awareness**: Known vs. Unknown (conscious awareness)
     - **Content**: Knowns vs. Unknowns (information possession)
     - **Accessibility**: Knowable vs. Unknowable (potential for discovery)

### Phase 2: Recursive Awareness & Dimensional Exploration
3. **Apply Recursive Self-Questioning**
   - Challenge initial assumptions
   - Consider multiple perspectives
   - Identify potential cognitive biases
   - Question the boundaries of your knowledge mapping

4. **Explore Knowledge Categories Systematically**
   - Examine each of the eight knowledge categories:
     - Knowable Known Knowns
     - Unknowable Known Knowns
     - Knowable Known Unknowns
     - Unknowable Known Unknowns
     - Knowable Unknown Knowns
     - Unknowable Unknown Knowns
     - Knowable Unknown Unknowns
     - Unknowable Unknown Unknowns

### Phase 3: Structured Thinking & Knowledge Integration
5. **Progressive Structured Thinking**
   - Generate diverse viewpoints within each knowledge category
   - Evaluate the value and limitations of each perspective
   - Identify points of integration and contradiction
   - Create a coherent synthesis that acknowledges knowledge boundaries

6. **Strategic Knowledge Transformation**
   - Identify opportunities to move knowledge between categories:
     - Making implicit knowledge (Unknown Knowns) explicit
     - Converting Known Unknowns into Known Knowns through investigation
     - Developing awareness of potential Unknown Unknowns

### Phase 4: Cognitive Integration & Verification
7. **Problem Decomposition & Reintegration**
   - Break complex problems into component elements
   - Apply appropriate cognitive approaches to each component
   - Reintegrate with lucid awareness of the whole system
   - Map how components interact across knowledge dimensions

8. **Lucidity Verification**
   - Before finalizing response, verify:
     - "Have I achieved lucidity in this response?"
     - "Am I operating from a reactive or unbalanced cognitive state?"
     - "Have I adequately explored all relevant knowledge dimensions?"
     - "Have I acknowledged the appropriate limits of certainty?"`,
        },
      ],
    };
  }
  
  if (uri === "ucpf://framework/cognitive-states") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: `# Cognitive States in UCPF

The UCPF framework recognizes three primary cognitive states that influence how we process information and approach problems:

## Dark Inertia

**Description:** A reactive, pattern-matching cognitive state with limited awareness

**Characteristics:**
- Limited self-awareness
- Reliance on pattern matching
- Binary thinking
- Overconfidence in existing knowledge
- Resistance to contradictory information

**When prevalent:** When operating on auto-pilot, under stress, or with cognitive fatigue

## Passion

**Description:** An engaged but potentially biased state with emotional investment

**Characteristics:**
- Strong emotional engagement
- Potential for bias due to investment
- Heightened creativity
- Selective focus on certain aspects
- Openness to specific avenues of thought

**When prevalent:** When highly motivated by personal interest or when emotionally connected to outcomes

## Approaching Lucidity

**Description:** A clear, balanced understanding with high self-awareness

**Characteristics:**
- High cognitive awareness
- Balance of rationality and intuition
- Comfort with uncertainty
- Integration of multiple perspectives
- Recognition of knowledge boundaries

**When prevalent:** After deep reflection, when applying metacognitive approaches, or during moments of clarity

## State Transitions

Cognitive states are not fixed but dynamic. The UCPF framework aims to facilitate movement from Dark Inertia and Passion states toward Approaching Lucidity through recursive self-questioning and systematic knowledge exploration.`,
        },
      ],
    };
  }
  
  if (uri === "ucpf://framework/knowledge-dimensions") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: `# Knowledge Dimensions in UCPF

The UCPF framework maps knowledge across three critical dimensions:

## 1. Awareness Dimension: Known vs. Unknown

**Known:** Information or questions we are consciously aware of
**Unknown:** Information or questions outside our conscious awareness

## 2. Content Dimension: Knowns vs. Unknowns

**Knowns:** Information we possess
**Unknowns:** Information we do not possess

## 3. Accessibility Dimension: Knowable vs. Unknowable

**Knowable:** Information that can potentially be discovered or verified
**Unknowable:** Information that cannot be discovered or verified due to fundamental limits

## The Eight Knowledge Categories

The intersection of these three dimensions creates eight distinct knowledge categories:

1. **Knowable Known Knowns:** Information we are aware we have and can verify or expand upon
   - Example: Scientific facts that can be further researched

2. **Unknowable Known Knowns:** Information we are aware we have but cannot verify or expand further
   - Example: Personal experiences that cannot be objectively verified

3. **Knowable Known Unknowns:** Questions we know exist and can potentially answer
   - Example: Research questions with viable investigation methods

4. **Unknowable Known Unknowns:** Questions we know exist but cannot answer
   - Example: Questions about subjective experiences of others

5. **Knowable Unknown Knowns:** Information we have but are not aware of, which can be surfaced
   - Example: Implicit biases that can be revealed through testing

6. **Unknowable Unknown Knowns:** Information we have but are not aware of, which cannot be surfaced
   - Example: Deeply subconscious influences on thinking

7. **Knowable Unknown Unknowns:** Questions we don't know exist but could discover and answer
   - Example: Scientific discoveries waiting to be made

8. **Unknowable Unknown Unknowns:** Questions we don't know exist and could never discover or answer
   - Example: Fundamental limits of knowledge beyond human comprehension

## Strategic Knowledge Transformation

The UCPF approach identifies opportunities to transform knowledge between categories:
- Making implicit knowledge (Unknown Knowns) explicit
- Converting Known Unknowns into Known Knowns through investigation
- Developing awareness of potential Unknown Unknowns`,
        },
      ],
    };
  }
  
  // Dynamic resources - session analysis
  const sessionMatch = uri.match(/^ucpf:\/\/session\/([^/]+)\/analysis$/);
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    if (!stateManager.hasSession(sessionId)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `No session found with ID: ${sessionId}`
      );
    }
    
    // Get session data
    const sessionData = stateManager.getState(sessionId);
    if (!sessionData || !sessionData.analysis) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `No analysis data found for session: ${sessionId}`
      );
    }
    
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: sessionData.analysis,
        },
      ],
    };
  }
  
  throw new McpError(
    ErrorCode.InvalidRequest,
    `Resource not found: ${uri}`
  );
});

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "analyze_problem",
        description: "Process a problem statement through the full UCPF framework",
        inputSchema: {
          type: "object",
          properties: {
            problem: {
              type: "string",
              description: "The problem statement to analyze"
            },
            session_id: {
              type: "string",
              description: "Optional session ID for maintaining state between calls"
            },
            enable_state: {
              type: "boolean",
              description: "Whether to enable state management for this analysis",
              default: false
            },
            detailed: {
              type: "boolean",
              description: "Whether to include detailed analysis",
              default: false
            }
          },
          required: ["problem"]
        }
      },
      {
        name: "creative_exploration",
        description: "Generate novel perspectives and connections for a topic",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "The topic or problem to explore creatively"
            },
            constraints: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Optional constraints or parameters to consider"
            },
            perspective_count: {
              type: "number",
              description: "Number of perspectives to generate",
              default: 3
            },
            include_metaphors: {
              type: "boolean",
              description: "Whether to include metaphorical thinking",
              default: true
            },
            session_id: {
              type: "string",
              description: "Optional session ID for maintaining state between calls"
            }
          },
          required: ["topic"]
        }
      },
      {
        name: "manage_state",
        description: "Control the state management for UCPF processing",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["enable", "disable", "reset", "status"],
              description: "The state management action to perform"
            },
            session_id: {
              type: "string",
              description: "Optional session ID to target a specific session"
            }
          },
          required: ["action"]
        }
      }
    ]
  };
});

/**
 * Handler for tool invocation
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "analyze_problem": {
      // Validate required parameters
      if (!args?.problem || typeof args.problem !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Required parameter 'problem' must be a string"
        );
      }
      
      // Optional parameters
      const sessionId = args.session_id as string | undefined;
      const enableState = Boolean(args.enable_state);
      const detailed = Boolean(args.detailed);
      
      // Update state management if needed
      if (enableState !== stateManager.getState("global")?.enabled) {
        stateManager.setEnabled(enableState);
        ucpfCore.setStateEnabled(enableState);
      }
      
      // Process the problem
      const analysis = await analyzeProblem(
        args.problem,
        ucpfCore,
        creativePatterns,
        stateManager,
        sessionId,
        detailed
      );
      
      // Store the analysis if state is enabled
      if (enableState && sessionId) {
        stateManager.setState(sessionId, {
          analysis,
          timestamp: Date.now(),
          problem: args.problem
        });
      }
      
      return {
        content: [
          {
            type: "text",
            text: analysis
          }
        ]
      };
    }
    
    case "creative_exploration": {
      // Validate required parameters
      if (!args?.topic || typeof args.topic !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Required parameter 'topic' must be a string"
        );
      }
      
      // Optional parameters
      const constraints = Array.isArray(args.constraints) ? 
        args.constraints.map(String) : [];
      const perspectiveCount = typeof args.perspective_count === "number" ?
        Math.max(1, Math.min(5, args.perspective_count)) : 3;
      const includeMetaphors = args.include_metaphors !== false;
      const sessionId = args.session_id as string | undefined;
      
      // Process the creative exploration
      const results = await exploreCreatively(
        args.topic,
        constraints,
        creativePatterns,
        ucpfCore,
        stateManager,
        sessionId,
        {
          perspectiveCount,
          includeMetaphors
        }
      );
      
      return {
        content: [
          {
            type: "text",
            text: results
          }
        ]
      };
    }
    
    case "manage_state": {
      // Validate required parameters
      if (!args?.action || typeof args.action !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Required parameter 'action' must be a string"
        );
      }
      
      const action = args.action as "enable" | "disable" | "reset" | "status";
      const sessionId = args.session_id as string | undefined;
      
      let resultText = "";
      
      switch (action) {
        case "enable":
          stateManager.setEnabled(true);
          ucpfCore.setStateEnabled(true);
          stateManager.setState("global", { enabled: true });
          resultText = "State management has been enabled";
          break;
          
        case "disable":
          stateManager.setEnabled(false);
          ucpfCore.setStateEnabled(false);
          resultText = "State management has been disabled";
          break;
          
        case "reset":
          if (sessionId) {
            stateManager.clearSession(sessionId);
            resultText = `Session '${sessionId}' has been reset`;
          } else {
            stateManager.clearAllSessions();
            resultText = "All sessions have been reset";
          }
          break;
          
        case "status":
          const sessionCount = stateManager.getSessionCount();
          const isEnabled = Boolean(stateManager.getState("global")?.enabled);
          resultText = `State management is currently ${isEnabled ? "enabled" : "disabled"}\n`;
          resultText += `Number of active sessions: ${sessionCount}`;
          if (sessionId) {
            const hasSession = stateManager.hasSession(sessionId);
            resultText += `\nSession '${sessionId}': ${hasSession ? "exists" : "not found"}`;
          }
          break;
          
        default:
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid action: ${action}`
          );
      }
      
      return {
        content: [
          {
            type: "text",
            text: resultText
          }
        ]
      };
    }
    
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${name}`
      );
  }
});

/**
 * Start the server
 */
async function main() {
  // Initialize global state
  stateManager.setState("global", { enabled: false });
  
  // Set up error handler
  server.onerror = (error) => {
    console.error("[UCPF Server Error]", error);
  };
  
  // Connect to transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("UCPF Server running on stdio");
}

// Start the server
main().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
