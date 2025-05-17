export interface CardData {
  playerName: string;
  title: string;
  teamName: string;
  role: string;
  avatar: File | null;
  stats: {
    label: string;
    value: string;
  }[];
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  template: 'classic' | 'modern' | 'angled' | 'fifa' | 'esports' | 'minimalist';
  socialLinks: {
    platform: string;
    url: string;
  }[];
  brandLogos: {
    name: string;
    imageUrl: string;
  }[];
}

export interface CardGeneratorProps {
  cardData: CardData;
  onDataChange: (newData: Partial<CardData>) => void;
  onGenerate: () => void;
}

export interface CardPreviewProps {
  cardData: CardData;
}

export interface CardTemplateProps {
  cardData: CardData;
  className?: string;
}
