export type FontSizeOption = "small" | "normal" | "large" | "xlarge";
export type TextSpacingOption = "normal" | "medium" | "heavy";
export type LineHeightOption = "normal" | "relaxed" | "loose";
export type ColorFilterOption = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "grayscale";

export interface AccessibilityState {
  fontSize: FontSizeOption;
  highContrast: boolean;
  dyslexiaFont: boolean;
  textSpacing: TextSpacingOption;
  lineHeight: LineHeightOption;
  biggerCursor: boolean;
  pauseAnimations: boolean;
  hideImages: boolean;
  colorFilter: ColorFilterOption;
  screenReader: boolean;
}

export interface AccessibilityActions {
  handleFontSizeChange: (size: FontSizeOption) => void;
  handleHighContrastChange: (enabled: boolean) => void;
  handleDyslexiaChange: (enabled: boolean) => void;
  handleTextSpacingChange: (spacing: TextSpacingOption) => void;
  handleLineHeightChange: (height: LineHeightOption) => void;
  handleBiggerCursorChange: (enabled: boolean) => void;
  handlePauseAnimationsChange: (enabled: boolean) => void;
  handleHideImagesChange: (enabled: boolean) => void;
  handleColorFilterChange: (filter: ColorFilterOption) => void;
  setScreenReader: (enabled: boolean) => void;
  handleResetAccessibility: () => void;
}
