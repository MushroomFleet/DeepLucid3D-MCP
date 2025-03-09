/**
 * Creative Exploration Tool
 * Focuses on generating novel perspectives and solutions
 */

import { UcpfCore } from '../engine/ucpf-core.js';
import { CreativePatterns, CreativeConnection, CreativePerspective } from '../engine/creative-patterns.js';
import { StateManager } from '../engine/state-manager.js';

interface ExplorationOptions {
  perspectiveCount?: number;
  connectionCount?: number;
  metaphorCount?: number;
  includeMetaphors?: boolean;
  focusAreas?: string[];
}

interface ExplorationResult {
  perspectives: CreativePerspective[];
  connections: CreativeConnection[];
  metaphors: string[];
  insights: string[];
}

/**
 * Format creative exploration results
 */
export function formatExploration(result: ExplorationResult): string {
  const formatSection = (title: string, content: string): string => {
    return `## ${title}\n\n${content}\n\n`;
  };

  let output = "";

  // Format perspectives
  if (result.perspectives.length > 0) {
    output += formatSection("Alternative Perspectives",
      result.perspectives
        .map(p => (
          `### ${p.viewpoint}\n` +
          `**Rationale:** ${p.rationale}\n` +
          (p.implications.length > 0 ? 
            "**Implications:**\n" + p.implications.map(i => `- ${i}`).join("\n") : 
            "") +
          (p.limitingBeliefs.length > 0 ? 
            "\n\n**Limiting Beliefs to Challenge:**\n" + p.limitingBeliefs.map(b => `- ${b}`).join("\n") : 
            "") +
          (p.potentialOutcomes.length > 0 ? 
            "\n\n**Potential Outcomes:**\n" + p.potentialOutcomes.map(o => `- ${o}`).join("\n") : 
            "")
        ))
        .join("\n\n")
    );
  }

  // Format connections
  if (result.connections.length > 0) {
    output += formatSection("Creative Connections",
      result.connections
        .map(c => (
          `### ${c.type.charAt(0).toUpperCase() + c.type.slice(1)}: ${c.source} ↔ ${c.target}\n` +
          `${c.description}\n\n` +
          `**Insight:** ${c.insight}`
        ))
        .join("\n\n")
    );
  }

  // Format metaphors
  if (result.metaphors.length > 0) {
    output += formatSection("Metaphorical Thinking",
      "Consider these metaphors to spark new insights:\n\n" +
      result.metaphors.map(m => `- ${m}`).join("\n")
    );
  }

  // Format insights
  if (result.insights.length > 0) {
    output += formatSection("Key Insights",
      result.insights.map(i => `- ${i}`).join("\n")
    );
  }

  return output;
}

/**
 * Explore creative perspectives and solutions for a topic
 */
export async function exploreCreatively(
  topic: string,
  constraints: string[] = [],
  creativePatterns: CreativePatterns,
  ucpfCore: UcpfCore,
  stateManager: StateManager,
  sessionId?: string,
  options: ExplorationOptions = {}
): Promise<string> {
  // Set defaults for options
  const { 
    perspectiveCount = 3,
    connectionCount = 3,
    metaphorCount = 3,
    includeMetaphors = true,
    focusAreas = []
  } = options;

  // Extract concepts from the topic and constraints
  const topicWords = topic.split(' ');
  const constraintWords = constraints.join(' ').split(' ');
  const allWords = [...topicWords, ...constraintWords];
  
  // Filter for potential concepts (words longer than 3 characters)
  const concepts = Array.from(new Set(
    allWords
      .filter(word => word.length > 3)
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 0)
  ));

  // Generate perspectives, connections, and metaphors
  const perspectives = creativePatterns.generatePerspectives(
    topic, perspectiveCount
  );
  
  const connections = creativePatterns.generateConnections(
    concepts, connectionCount
  );
  
  const metaphors = includeMetaphors ? 
    creativePatterns.generateMetaphors(topic, metaphorCount) : [];

  // Generate some insights based on all of the above
  const insights = [
    "Consider combining elements from different perspectives to create hybrid solutions",
    "Look for patterns that emerge across the different viewpoints",
    "Challenge your initial assumptions about the constraints of the problem"
  ];

  // Construct the result
  const result: ExplorationResult = {
    perspectives,
    connections,
    metaphors,
    insights
  };
  
  // Format and return the results
  return formatExploration(result);
}
