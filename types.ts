export enum Gender {
  MALE = '(راجل)',
  FEMALE = '(ست)',
}

export enum PharaohStyle {
  ROYAL = 'فرعون/ملكة (التاج والصولجان)',
  WARRIOR = 'محارب/محاربة (عجلات حربية وسيوف)',
  PRIEST = 'كاهن/كاهنة (غموض المعبد)',
  SCRIBE = 'كاتب/كاتبة (حكمة البردي)',
  NOBLE = 'نبيل/نبيلة (حفلات النيل)',
}

export interface TransformationConfig {
  gender: Gender;
  style: PharaohStyle;
  promptMod: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}