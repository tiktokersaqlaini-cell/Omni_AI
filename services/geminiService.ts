
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SUPPORTED_VOICES = "achernar, achird, algenib, algieba, alnilam, aoede, autonoe, callirrhoe, charon, despina, enceladus, erinome, fenrir, gacrux, iapetus, kore, laomedeia, leda, orus, puck, pulcherrima, rasalgethi, sadachbia, sadaltager, schedar, sulafat, umbriel, vindemiatrix, zephyr, zubenelgenubi";

export const generateOmniContent = async (topic: string): Promise<GeneratedContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a viral content package for the topic: "${topic}". 
    Create a complete production blueprint including:
    1. A professional video script with 3-5 visual scenes.
    2. A voice persona with a full script for narration. 
       CRITICAL: You MUST choose a voice name ONLY from this list: ${SUPPORTED_VOICES}. 
       Do not invent new voice names.
    3. Specialized distribution metadata for YouTube, Instagram, TikTok, Twitter, and LinkedIn.
    Use high-impact language and viral hook strategies.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          video: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              script: { type: Type.STRING },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    visualPrompt: { type: Type.STRING },
                    narrativeText: { type: Type.STRING },
                    duration: { type: Type.STRING }
                  },
                  required: ["visualPrompt", "narrativeText"]
                }
              },
              musicMood: { type: Type.STRING },
              colorPalette: { type: Type.STRING }
            },
            required: ["title", "hook", "scenes"]
          },
          voice: {
            type: Type.OBJECT,
            properties: {
              persona: { type: Type.STRING },
              tone: { type: Type.STRING },
              fullScript: { type: Type.STRING },
              suggestedVoiceName: { 
                type: Type.STRING,
                description: `MUST be exactly one of: ${SUPPORTED_VOICES}`
              },
              speed: { type: Type.NUMBER }
            },
            required: ["persona", "fullScript", "suggestedVoiceName"]
          },
          social: {
            type: Type.OBJECT,
            properties: {
              youtube: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              instagram: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              tiktok: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              twitter: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              globalTags: { type: Type.ARRAY, items: { type: Type.STRING } },
              seoDescription: { type: Type.STRING }
            }
          }
        },
        required: ["video", "voice", "social"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  // Defensive check: if the model still hallucinated, fallback to a safe default
  const allowed = SUPPORTED_VOICES.split(', ').map(v => v.trim());
  const sanitizedVoice = allowed.includes(voiceName.toLowerCase()) ? voiceName.toLowerCase() : 'charon';

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: sanitizedVoice }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data generated");
  return base64Audio;
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
