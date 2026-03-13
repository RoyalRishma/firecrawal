export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
}

export async function matchJobWithAI(
  jobDescription: string,
  userProfile: { skills: string[]; preferredRole: string }
): Promise<MatchResult> {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.GROQ_API_KEY 
    ? 'https://api.groq.com/openai/v1/chat/completions' 
    : 'https://openrouter.ai/api/v1/chat/completions';

  if (!apiKey) {
    throw new Error('No AI API key found (GROQ_API_KEY or OPENROUTER_API_KEY)');
  }

  const prompt = `
    You are an AI Job Matching Assistant. 
    Analyze the following job description against the user's profile and provide a match analysis in JSON format.

    User Profile:
    - Skills: ${userProfile.skills.join(', ')}
    - Preferred Role: ${userProfile.preferredRole}

    Job Description:
    ${jobDescription}

    Provide the response strictly in this JSON format:
    {
      "score": <number 0-100>,
      "matchedSkills": [<list of strings>],
      "missingSkills": [<list of strings>],
      "reasoning": "<brief 1-2 sentence explanation>"
    }
  `;

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_API_KEY ? 'llama3-8b-8192' : 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    console.error('AI API error:', await response.text());
    throw new Error('AI Matching failed');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content) as MatchResult;
}
