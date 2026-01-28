
export interface VideoScene {
  visualPrompt: string;
  narrativeText: string;
  duration: string;
}

export interface SocialPlatform {
  title?: string;
  hook?: string;
  caption: string;
  tags: string[];
}

export type GeminiVoice = 
  | 'achernar' | 'achird' | 'algenib' | 'algieba' | 'alnilam' 
  | 'aoede' | 'autonoe' | 'callirrhoe' | 'charon' | 'despina' 
  | 'enceladus' | 'erinome' | 'fenrir' | 'gacrux' | 'iapetus' 
  | 'kore' | 'laomedeia' | 'leda' | 'orus' | 'puck' 
  | 'pulcherrima' | 'rasalgethi' | 'sadachbia' | 'sadaltager' 
  | 'schedar' | 'sulafat' | 'umbriel' | 'vindemiatrix' 
  | 'zephyr' | 'zubenelgenubi';

export interface GeneratedContent {
  video: {
    title: string;
    hook: string;
    script: string;
    scenes: VideoScene[];
    musicMood: string;
    colorPalette: string;
  };
  voice: {
    persona: string;
    tone: string;
    fullScript: string;
    suggestedVoiceName: GeminiVoice;
    speed: number;
  };
  social: {
    youtube: SocialPlatform;
    instagram: SocialPlatform;
    tiktok: SocialPlatform;
    twitter: SocialPlatform;
    linkedin: SocialPlatform;
    globalTags: string[];
    seoDescription: string;
  };
}

export enum TabType {
  VIDEO = 'video',
  VOICE = 'voice',
  SOCIAL = 'social',
  SETTINGS = 'settings'
}
