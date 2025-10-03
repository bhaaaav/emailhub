import OpenAI from 'openai';

export interface RefinementResult {
  success: boolean;
  refinedSubject?: string;
  refinedBody?: string;
  suggestions?: string[];
  error?: string;
}

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async refineEmail(subject: string, body: string): Promise<RefinementResult> {
    if (!this.openai) {
      return this.fallbackRefinement(subject, body);
    }

    try {
      const prompt = `
        Please improve the following email to make it more professional, clear, and engaging while maintaining the original intent:
        
        Subject: ${subject}
        Body: ${body}
        
        Please provide:
        1. An improved subject line
        2. An improved email body
        3. 3-5 specific suggestions for improvement
        
        Format your response as JSON:
        {
          "refinedSubject": "improved subject",
          "refinedBody": "improved body",
          "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert email writing assistant. Help users write professional, clear, and engaging emails."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(response);
      return {
        success: true,
        refinedSubject: parsed.refinedSubject,
        refinedBody: parsed.refinedBody,
        suggestions: parsed.suggestions
      };
    } catch (error) {
      console.error('OpenAI refinement failed:', error);
      return this.fallbackRefinement(subject, body);
    }
  }

  private fallbackRefinement(subject: string, body: string): RefinementResult {
    // Fallback to heuristic-based improvements
    const suggestions: string[] = [];
    
    // Subject improvements
    let refinedSubject = subject;
    if (subject.length > 50) {
      suggestions.push('Consider shortening the subject line to under 50 characters');
      refinedSubject = subject.substring(0, 47) + '...';
    }
    
    if (!subject.endsWith('.')) {
      suggestions.push('Subject lines typically don\'t end with periods');
    }

    // Body improvements
    let refinedBody = body;
    
    // Add greeting if missing
    if (!body.toLowerCase().startsWith('dear') && !body.toLowerCase().startsWith('hi') && !body.toLowerCase().startsWith('hello')) {
      refinedBody = `Dear ${this.extractRecipientName(body) || 'Recipient'},\n\n${body}`;
      suggestions.push('Consider adding a proper greeting');
    }

    // Add closing if missing
    if (!body.toLowerCase().includes('sincerely') && !body.toLowerCase().includes('best regards') && !body.toLowerCase().includes('thank you')) {
      refinedBody += '\n\nBest regards,\n[Your Name]';
      suggestions.push('Consider adding a proper closing');
    }

    // Check for common issues
    if (body.length < 50) {
      suggestions.push('Email body seems quite short - consider adding more details');
    }

    if (body.length > 1000) {
      suggestions.push('Email body is quite long - consider breaking it into shorter paragraphs');
    }

    if ((body.match(/!/g) || []).length > 3) {
      suggestions.push('Consider reducing the number of exclamation marks for a more professional tone');
    }

    return {
      success: true,
      refinedSubject,
      refinedBody,
      suggestions
    };
  }

  private extractRecipientName(body: string): string | null {
    // Simple heuristic to extract potential recipient name
    const lines = body.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('dear')) {
        const match = line.match(/dear\s+([^,\n]+)/i);
        if (match) {
          return match[1].trim();
        }
      }
    }
    return null;
  }

  async isAvailable(): Promise<boolean> {
    return this.openai !== null;
  }
}
