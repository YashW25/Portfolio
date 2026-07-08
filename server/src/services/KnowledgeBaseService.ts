import * as fs from 'fs';
import * as path from 'path';

export class KnowledgeBaseService {
  private knowledgeText: string = "";

  constructor() {
    this.loadKnowledge();
  }

  private loadKnowledge() {
    try {
      const filePath = path.resolve(process.cwd(), '../MYSELF.md');
      if (fs.existsSync(filePath)) {
        this.knowledgeText = fs.readFileSync(filePath, 'utf8');
        console.log(`Knowledge Base loaded: ${this.knowledgeText.length} characters.`);
      } else {
        console.warn('MYSELF.md not found at ' + filePath);
      }
    } catch (err) {
      console.error('Failed to load Knowledge Base', err);
    }
  }

  // Returns the entire content to be passed as System Prompt Context.
  public getContext(): string {
    return this.knowledgeText;
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
