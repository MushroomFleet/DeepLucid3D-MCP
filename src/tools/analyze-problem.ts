/**
 * Analyze Problem Tool
 * Processes a problem statement through the full UCPF framework
 */

import { UcpfCore, UcpfAnalysis } from '../engine/ucpf-core.js';
import { CreativePatterns, CreativePerspective } from '../engine/creative-patterns.js';
import { StateManager } from '../engine/state-manager.js';

/**
 * Format a UCPF analysis for presentation
 */
export function formatAnalysis(
  analysis: UcpfAnalysis,
  creativeInsights: CreativePerspective[] = []
): string {
  const formatSection = (title: string, content: string): string => {
    return `## ${title}\n\n${content}\n\n`;
  };

  let result = "";

  // Format Cognitive State
  result += formatSection("Cognitive State Assessment", 
    `Current cognitive state: **${analysis.cognitiveState.type}**\n\n` +
    `${analysis.cognitiveState.description}\n\n` +
    "**Characteristics:**\n" +
    analysis.cognitiveState.characteristics
      .map(char => `- ${char}`)
      .join("\n")
  );

  // Format Knowledge Mapping
  result += formatSection("Knowledge Dimension Mapping",
    "The problem space has been mapped across the following knowledge dimensions:\n\n" +
    analysis.knowledgeMapping
      .map(category => (
        `### ${category.label}\n` +
        `**Description:** ${category.description}\n` +
        (category.examples.length > 0 ? 
          "**Examples:**\n" + category.examples.map(ex => `- ${ex}`).join("\n") : 
          "*No specific examples identified.*")
      ))
      .join("\n\n")
  );

  // Format Recursive Questions
  result += formatSection("Recursive Self-Questioning",
    "The following questions challenge initial assumptions and perspectives:\n\n" +
    analysis.recursiveQuestions
      .map(q => (
        `### ${q.question}\n` +
        `**Purpose:** ${q.purpose}\n` +
        `**Target Area:** ${q.targetArea}`
      ))
      .join("\n\n")
  );

  // Format Creative Perspectives
  if (creativeInsights.length > 0) {
    result += formatSection("Creative Perspectives",
      "These alternative viewpoints open new possibilities:\n\n" +
      creativeInsights
        .map(p => (
          `### ${p.viewpoint}\n` +
          `**Rationale:** ${p.rationale}\n` +
          (p.implications.length > 0 ? 
            "**Implications:**\n" + p.implications.map(i => `- ${i}`).join("\n") : 
            "") +
          (p.potentialOutcomes.length > 0 ? 
            "\n\n**Potential Outcomes:**\n" + p.potentialOutcomes.map(o => `- ${o}`).join("\n") : 
            "")
        ))
        .join("\n\n")
    );
  }

  // Format Synthesis
  result += formatSection("Synthesis & Integration",
    "**Key Insights:**\n" +
    (analysis.synthesis.insights.length > 0 ?
      analysis.synthesis.insights.map(i => `- ${i}`).join("\n") :
      "- *Analysis indicates further exploration needed to generate specific insights.*") +
    "\n\n**Confidence Level:** " + (analysis.synthesis.confidenceLevel * 100).toFixed(0) + "%" +
    "\n\n**Uncertainties:**\n" +
    (analysis.synthesis.uncertainties.length > 0 ?
      analysis.synthesis.uncertainties.map(u => `- ${u}`).join("\n") :
      "- *No specific uncertainties identified.*")
  );

  return result;
}

/**
 * Analyze a problem using the UCPF framework
 */
export async function analyzeProblem(
  problem: string,
  ucpfCore: UcpfCore,
  creativePatterns: CreativePatterns,
  stateManager: StateManager,
  sessionId?: string,
  detailed: boolean = false
): Promise<string> {
  // Process the problem through UCPF
  const analysis = await ucpfCore.processInput(problem, sessionId);
  
  // Generate creative perspectives
  const creativeInsights = creativePatterns.generatePerspectives(problem, 3);
  
  // Format the results
  return formatAnalysis(analysis, creativeInsights);
}
