import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';

export type ThemeColor = string;
export type ThemeMode = 'light' | 'dark' | 'system';
export type MemoriesViewMode = 'grid' | 'masonry' | 'card';
export type WallpaperType = string; // 'gradient' or a video URL

export interface AccentColorItem {
    id: string;
    nameVi: string;
    nameEn: string;
    solid: string;
    gradient: string;
}

export const ACCENT_COLORS: AccentColorItem[] = [
    { id: 'red', nameVi: 'Đỏ Thượng Hải', nameEn: 'Crimson Red', solid: '#FF3B30', gradient: 'linear-gradient(135deg, #FF5E62 0%, #FF3B30 100%)' },
    { id: 'orange', nameVi: 'Cam Hoàng Hôn', nameEn: 'Sunset Orange', solid: '#FF9500', gradient: 'linear-gradient(135deg, #FFB347 0%, #FF9500 100%)' },
    { id: 'yellow', nameVi: 'Vàng Hổ Phách', nameEn: 'Amber Gold', solid: '#FFCC00', gradient: 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)' },
    { id: 'green', nameVi: 'Lục Bảo Ngọc', nameEn: 'Emerald Green', solid: '#34C759', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 'blue', nameVi: 'Xanh Hoàng Gia', nameEn: 'Royal Blue', solid: '#007AFF', gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
    { id: 'indigo', nameVi: 'Chàm Cực Quang', nameEn: 'Aurora Indigo', solid: '#5856D6', gradient: 'linear-gradient(135deg, #da22ff 0%, #9733ee 100%)' },
    { id: 'violet', nameVi: 'Tím Thạch Anh', nameEn: 'Amethyst Violet', solid: '#AF52DE', gradient: 'linear-gradient(135deg, #8A2387 0%, #E94057 100%)' },
];

export const getAccentGradient = (colorHex: string, type: 'solid' | 'gradient'): string => {
    if (type === 'solid') {
        return colorHex;
    }
    const colorLower = colorHex.toLowerCase();
    const match = ACCENT_COLORS.find(c => c.solid.toLowerCase() === colorLower);
    if (match) {
        return match.gradient;
    }
    // Default fallback gradient if no direct match
    return `linear-gradient(135deg, ${colorHex} 0%, rgba(0,0,0,0.8) 100%)`;
};

export type ThemePreset = 'default' | 'glass-fluent-hybrid' | 'material-design-3' | 'neumorphism' | 'apple-human-interface' | 'glassmorphism' | 'fluent-ui-2';

// Helper functions to convert between Hex and HSL for Material 3 dynamic color generation
const hexToHsl = (hex: string): { h: number, s: number, l: number } => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h <= 360) {
        r = c; g = 0; b = x;
    }

    let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
};


interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    memoriesViewMode: MemoriesViewMode;
    setMemoriesViewMode: (mode: MemoriesViewMode) => void;
    lightThemeColor: ThemeColor;
    setLightThemeColor: (color: ThemeColor) => void;
    darkThemeColor: ThemeColor;
    setDarkThemeColor: (color: ThemeColor) => void;
    isSoundOn: boolean;
    setSoundOn: (isOn: boolean) => void;
    isAiVoiceOn: boolean;
    setAiVoiceOn: (isOn: boolean) => void;
    selectedAiVoiceName: string;
    setSelectedAiVoiceName: (name: string) => void;
    aiVoicePitch: number;
    setAiVoicePitch: (pitch: number) => void;
    aiVoiceRate: number;
    setAiVoiceRate: (rate: number) => void;
    projectFilter: string[];
    setProjectFilter: (filter: string[]) => void;
    wallpaper: WallpaperType;
    setWallpaper: (wallpaper: WallpaperType) => void;
    cardOpacity: number;
    setCardOpacity: (opacity: number) => void;
    sidebarOpacity: number;
    setSidebarOpacity: (opacity: number) => void;
    gridCardOpacity: number;
    setGridCardOpacity: (opacity: number) => void;
    contentOpacity: number;
    setContentOpacity: (opacity: number) => void;
    layoutOpacity: number;
    setLayoutOpacity: (opacity: number) => void;
    subComponentOpacity: number;
    setSubComponentOpacity: (opacity: number) => void;
    isMirrorOn: boolean;
    setIsMirrorOn: (isOn: boolean) => void;
    is2x2Grid: boolean;
    setIs2x2Grid: (isOn: boolean) => void;
    isGlassEnabled: boolean;
    setIsGlassEnabled: (isEnabled: boolean) => void;
    accentColorType: 'solid' | 'gradient';
    setAccentColorType: (type: 'solid' | 'gradient') => void;
    themePreset: ThemePreset;
    setThemePreset: (preset: ThemePreset) => void;
    isSidebarDetached: boolean;
    setIsSidebarDetached: (detached: boolean) => void;
        uiScaleMode: 'auto' | 'manual';
    setUiScaleMode: (mode: 'auto' | 'manual') => void;
    uiScaleValue: number;
    setUiScaleValue: (value: number) => void;
    currentUiScale: number;
    resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_SETTINGS = {
    themeMode: 'system' as ThemeMode,
    lightThemeColor: '#101733',
    darkThemeColor: '#FFFFFF',
    isSoundOn: true,
    isAiVoiceOn: true,
    selectedAiVoiceName: 'Nam Minh',
    aiVoicePitch: 1,
    aiVoiceRate: 0.95,
    wallpaper: 'gradient',
    cardOpacity: 0.4,
    sidebarOpacity: 0.4,
    gridCardOpacity: 0.45,
    contentOpacity: 0.05,
    layoutOpacity: 0.02,
    subComponentOpacity: 0.8,
    isMirrorOn: false,
    is2x2Grid: false,
    isGlassEnabled: false,
    uiScaleMode: 'auto' as const,
    uiScaleValue: 1.0,
    accentColorType: 'solid' as const,
};

const hexToRgb = (hex: string): string => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!result) return "0, 0, 0";
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_SETTINGS.themeMode);
    const [memoriesViewMode, setMemoriesViewModeState] = useState<MemoriesViewMode>('grid');
    const [lightThemeColor, setLightThemeColorState] = useState<ThemeColor>(DEFAULT_SETTINGS.lightThemeColor);
    const [darkThemeColor, setDarkThemeColorState] = useState<ThemeColor>(DEFAULT_SETTINGS.darkThemeColor); 
    
    
    const [isSoundOn, setSoundOnState] = useState<boolean>(DEFAULT_SETTINGS.isSoundOn);
    const [isAiVoiceOn, setAiVoiceOnState] = useState<boolean>(DEFAULT_SETTINGS.isAiVoiceOn);
    const [selectedAiVoiceName, setSelectedAiVoiceNameState] = useState<string>(DEFAULT_SETTINGS.selectedAiVoiceName);
    const [aiVoicePitch, setAiVoicePitchState] = useState<number>(DEFAULT_SETTINGS.aiVoicePitch);
    const [aiVoiceRate, setAiVoiceRateState] = useState<number>(DEFAULT_SETTINGS.aiVoiceRate);
    const [projectFilter, setProjectFilterState] = useState<string[]>([]);
    const [wallpaper, setWallpaperState] = useState<WallpaperType>(DEFAULT_SETTINGS.wallpaper);
    const [cardOpacity, setCardOpacityState] = useState<number>(DEFAULT_SETTINGS.cardOpacity);
    const [sidebarOpacity, setSidebarOpacityState] = useState<number>(DEFAULT_SETTINGS.sidebarOpacity);
    const [gridCardOpacity, setGridCardOpacityState] = useState<number>(DEFAULT_SETTINGS.gridCardOpacity);
    const [contentOpacity, setContentOpacityState] = useState<number>(DEFAULT_SETTINGS.contentOpacity);
    const [layoutOpacity, setLayoutOpacityState] = useState<number>(DEFAULT_SETTINGS.layoutOpacity);
    const [subComponentOpacity, setSubComponentOpacityState] = useState<number>(DEFAULT_SETTINGS.subComponentOpacity);
    const [isMirrorOn, setIsMirrorOnState] = useState<boolean>(DEFAULT_SETTINGS.isMirrorOn);
    const [is2x2Grid, setIs2x2GridState] = useState<boolean>(DEFAULT_SETTINGS.is2x2Grid);
    const [isGlassEnabled, setIsGlassEnabledState] = useState<boolean>(DEFAULT_SETTINGS.isGlassEnabled);
    const [accentColorType, setAccentColorTypeState] = useState<'solid' | 'gradient'>(DEFAULT_SETTINGS.accentColorType);
    const [isSidebarDetached, setIsSidebarDetachedState] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('isSidebarDetached');
            return saved ? saved === 'true' : false;
        }
        return false;
    });

    const setIsSidebarDetached = (detached: boolean) => {
        setIsSidebarDetachedState(detached);
        localStorage.setItem('isSidebarDetached', String(detached));
    };

    const setUiScaleMode = (mode: 'auto' | 'manual') => {
        setUiScaleModeState(mode);
        localStorage.setItem('uiScaleMode', mode);
    };

    const setUiScaleValue = (val: number) => {
        setUiScaleValueState(val);
        localStorage.setItem('uiScaleValue', String(val));
    };

    const [themePreset, setThemePresetState] = useState<ThemePreset>('default');
    const [uiScaleMode, setUiScaleModeState] = useState<'auto' | 'manual'>('auto');
    const [uiScaleValue, setUiScaleValueState] = useState<number>(1.0);
    const [currentUiScale, setCurrentUiScale] = useState<number>(1.0);
    
    const resetToDefault = () => {
        setThemeMode(DEFAULT_SETTINGS.themeMode);
        setLightThemeColor(DEFAULT_SETTINGS.lightThemeColor);
        setDarkThemeColor(DEFAULT_SETTINGS.darkThemeColor);
        setSoundOn(DEFAULT_SETTINGS.isSoundOn);
        setAiVoiceOn(DEFAULT_SETTINGS.isAiVoiceOn);
        setSelectedAiVoiceName(DEFAULT_SETTINGS.selectedAiVoiceName);
        setAiVoicePitch(DEFAULT_SETTINGS.aiVoicePitch);
        setAiVoiceRate(DEFAULT_SETTINGS.aiVoiceRate);
        setWallpaper(DEFAULT_SETTINGS.wallpaper);
        setCardOpacity(DEFAULT_SETTINGS.cardOpacity);
        setSidebarOpacity(DEFAULT_SETTINGS.sidebarOpacity);
        setGridCardOpacity(DEFAULT_SETTINGS.gridCardOpacity);
        setContentOpacity(DEFAULT_SETTINGS.contentOpacity);
        setLayoutOpacity(DEFAULT_SETTINGS.layoutOpacity);
        setSubComponentOpacity(DEFAULT_SETTINGS.subComponentOpacity);
        setIsMirrorOn(DEFAULT_SETTINGS.isMirrorOn);
        setIs2x2Grid(DEFAULT_SETTINGS.is2x2Grid);
        setIsGlassEnabled(DEFAULT_SETTINGS.isGlassEnabled);
        setAccentColorType(DEFAULT_SETTINGS.accentColorType);
        setThemePreset('default');
        setIsSidebarDetached(false);
        setProjectFilter([]);
        setUiScaleMode('auto');
        setUiScaleValue(1.0);
    };
    
    // --- Setter Functions that include saving to localStorage ---

    const setAccentColorType = (type: 'solid' | 'gradient') => {
        setAccentColorTypeState(type);
        localStorage.setItem('accentColorType', type);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        localStorage.setItem('themeMode', mode);
    };

    const setMemoriesViewMode = (mode: MemoriesViewMode) => {
        setMemoriesViewModeState(mode);
        localStorage.setItem('memoriesViewMode', mode);
    };

    const setLightThemeColor = (color: ThemeColor) => {
        setLightThemeColorState(color);
        localStorage.setItem('lightThemeColor', color);
    };

    const setDarkThemeColor = (color: ThemeColor) => {
        setDarkThemeColorState(color);
        localStorage.setItem('darkThemeColor', color);
    };

    

    const setSoundOn = (isOn: boolean) => {
        setSoundOnState(isOn);
        localStorage.setItem('isSoundOn', String(isOn));
    };
    
    const setAiVoiceOn = (isOn: boolean) => {
        setAiVoiceOnState(isOn);
        localStorage.setItem('isAiVoiceOn', String(isOn));
    };

    const setSelectedAiVoiceName = (name: string) => {
        setSelectedAiVoiceNameState(name);
        localStorage.setItem('selectedAiVoiceName', name);
    };

    const setAiVoicePitch = (pitch: number) => {
        setAiVoicePitchState(pitch);
        localStorage.setItem('aiVoicePitch', String(pitch));
    };

    const setAiVoiceRate = (rate: number) => {
        setAiVoiceRateState(rate);
        localStorage.setItem('aiVoiceRate', String(rate));
    };

    const setProjectFilter = (filter: string[]) => {
        setProjectFilterState(filter);
        localStorage.setItem('projectFilter', JSON.stringify(filter));
    }

    const setWallpaper = (wp: WallpaperType) => {
        setWallpaperState(wp);
        localStorage.setItem('wallpaper', wp);
    };

    const setCardOpacity = (opacity: number) => {
        setCardOpacityState(opacity);
        localStorage.setItem('cardOpacity', String(opacity));
    };

    const setSidebarOpacity = (opacity: number) => {
        setSidebarOpacityState(opacity);
        localStorage.setItem('sidebarOpacity', String(opacity));
    };

    const setGridCardOpacity = (opacity: number) => {
        setGridCardOpacityState(opacity);
        localStorage.setItem('gridCardOpacity', String(opacity));
    };

    const setContentOpacity = (opacity: number) => {
        setContentOpacityState(opacity);
        localStorage.setItem('contentOpacity', String(opacity));
    };

    const setLayoutOpacity = (opacity: number) => {
        setLayoutOpacityState(opacity);
        localStorage.setItem('layoutOpacity', String(opacity));
    };

    const setSubComponentOpacity = (opacity: number) => {
        setSubComponentOpacityState(opacity);
        localStorage.setItem('subComponentOpacity', String(opacity));
    };

    const setIsMirrorOn = (isOn: boolean) => {
        setIsMirrorOnState(isOn);
        localStorage.setItem('isMirrorOn', String(isOn));
    };

    const setIs2x2Grid = (isOn: boolean) => {
        setIs2x2GridState(isOn);
        localStorage.setItem('is2x2Grid', String(isOn));
    };

    const setIsGlassEnabled = (isEnabled: boolean) => {
        setIsGlassEnabledState(isEnabled);
        localStorage.setItem('isGlassEnabled', String(isEnabled));
    };
    const setThemePreset = (preset: ThemePreset) => {
        setThemePresetState(preset);
        localStorage.setItem('themePreset', preset);
        // Apply preset logic here
        switch (preset) {
            case 'glass-fluent-hybrid':
                setIsGlassEnabled(true);
                setCardOpacity(0.6);
                setSidebarOpacity(0.6);
                setWallpaper('glass-fluent-hybrid');
                setLightThemeColor('#8A5CF6');
                setDarkThemeColor('#9D7BFF');
                break;
            case 'material-design-3':
                setIsGlassEnabled(false);
                setCardOpacity(1);
                setSidebarOpacity(1);
                setWallpaper('material-design-3');
                setAccentColorType('solid');
                setLightThemeColor('#6750A4');
                setDarkThemeColor('#D0BCFF');
                break;
            case 'neumorphism':
                setIsGlassEnabled(false);
                setCardOpacity(1);
                setSidebarOpacity(1);
                setWallpaper('neumorphism');
                setLightThemeColor('#3B82F6');
                setDarkThemeColor('#60A5FA');
                break;
            case 'apple-human-interface':
                setIsGlassEnabled(true);
                setCardOpacity(0.9);
                setSidebarOpacity(0.9);
                setWallpaper('apple-glass');
                setLightThemeColor('#007AFF');
                setDarkThemeColor('#0A84FF');
                break;
            case 'glassmorphism':
                setIsGlassEnabled(true);
                setCardOpacity(0.3);
                setSidebarOpacity(0.3);
                setWallpaper('glassmorphism-effect');
                setLightThemeColor('#3B82F6');
                setDarkThemeColor('#3B82F6');
                break;
            case 'fluent-ui-2':
                setIsGlassEnabled(false);
                setCardOpacity(0.9);
                setSidebarOpacity(0.9);
                setWallpaper('gradient');
                setLightThemeColor('#0078D4');
                setDarkThemeColor('#0078D4');
                break;
            case 'default':
            default:
                setIsGlassEnabled(false);
                setCardOpacity(0.4);
                setSidebarOpacity(0.4);
                setLightThemeColor('#101733');
                setDarkThemeColor('#FFFFFF');
                break;
        }
    };
    // Effect to load settings from localStorage on initial mount
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
        const savedMemoriesMode = localStorage.getItem('memoriesViewMode') as MemoriesViewMode | null;
        const savedLightColor = localStorage.getItem('lightThemeColor');
        const savedDarkColor = localStorage.getItem('darkThemeColor');
        let savedWallpaper = localStorage.getItem('wallpaper');
        
        const savedSound = localStorage.getItem('isSoundOn');
        const savedAiVoice = localStorage.getItem('isAiVoiceOn');
        const savedVoiceName = localStorage.getItem('selectedAiVoiceName');
        const savedVoicePitch = localStorage.getItem('aiVoicePitch');
        const savedVoiceRate = localStorage.getItem('aiVoiceRate');
        const savedProjectFilter = localStorage.getItem('projectFilter');
        const savedCardOpacity = localStorage.getItem('cardOpacity');
        const savedSidebarOpacity = localStorage.getItem('sidebarOpacity');
        const savedGridCardOpacity = localStorage.getItem('gridCardOpacity');
        const savedContentOpacity = localStorage.getItem('contentOpacity');
        const savedLayoutOpacity = localStorage.getItem('layoutOpacity');
        const savedSubComponentOpacity = localStorage.getItem('subComponentOpacity');

        const currentMode = savedMode || 'system';
        setThemeModeState(currentMode);
        
        if (savedMemoriesMode) setMemoriesViewModeState(savedMemoriesMode);

        if (savedLightColor) setLightThemeColorState(savedLightColor);
        if (savedDarkColor) setDarkThemeColorState(savedDarkColor);
        
        setSoundOnState(savedSound === null ? true : savedSound === 'true');
        setAiVoiceOnState(savedAiVoice === null ? true : savedAiVoice === 'true');
        if (savedVoiceName) setSelectedAiVoiceNameState(savedVoiceName);
        if (savedVoicePitch) setAiVoicePitchState(parseFloat(savedVoicePitch));
        if (savedVoiceRate) setAiVoiceRateState(parseFloat(savedVoiceRate));
        if (savedProjectFilter) {
            try {
                const parsedFilter = JSON.parse(savedProjectFilter);
                if (Array.isArray(parsedFilter)) {
                    setProjectFilterState(parsedFilter);
                }
            } catch (e) {
                setProjectFilterState([]);
            }
        }

        if (savedCardOpacity) setCardOpacityState(parseFloat(savedCardOpacity));
        if (savedSidebarOpacity) setSidebarOpacityState(parseFloat(savedSidebarOpacity));
        if (savedGridCardOpacity) setGridCardOpacityState(parseFloat(savedGridCardOpacity));
        if (savedContentOpacity) setContentOpacityState(parseFloat(savedContentOpacity));
        if (savedLayoutOpacity) setLayoutOpacityState(parseFloat(savedLayoutOpacity));
        if (savedSubComponentOpacity) setSubComponentOpacityState(parseFloat(savedSubComponentOpacity));

        const savedMirror = localStorage.getItem('isMirrorOn');
        setIsMirrorOnState(savedMirror === 'true');

        const saved2x2 = localStorage.getItem('is2x2Grid');
        setIs2x2GridState(saved2x2 === 'true');

        const savedGlass = localStorage.getItem('isGlassEnabled');
        setIsGlassEnabledState(savedGlass === 'true');

        const savedAccentType = localStorage.getItem('accentColorType') as 'solid' | 'gradient' | null;
        if (savedAccentType) setAccentColorTypeState(savedAccentType);

        const savedScaleMode = localStorage.getItem('uiScaleMode') as 'auto' | 'manual' | null;
        const savedScaleValue = localStorage.getItem('uiScaleValue');
        if (savedScaleMode) setUiScaleModeState(savedScaleMode);
        if (savedScaleValue) setUiScaleValueState(parseFloat(savedScaleValue));

        // Fallback if no wallpaper saved
        if (savedWallpaper) {
            setWallpaperState(savedWallpaper);
        } else {
            setWallpaperState('gradient');
        }

    }, []);

    // Effect to apply theme (mode and color) to the document
    useEffect(() => {
        const root = window.document.documentElement;
        
        const applyTheme = (isDark: boolean) => {
            const activeColor = isDark ? darkThemeColor : lightThemeColor;
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            root.style.setProperty('--accent-color', activeColor);
            root.style.setProperty('--accent-color-rgb', hexToRgb(activeColor));
            
            const grad = getAccentGradient(activeColor, accentColorType);
            root.style.setProperty('--accent-gradient', grad);

            // Generate Google Material Design 3 (Material You) color tokens dynamically
            try {
                const hsl = hexToHsl(activeColor);
                const h = hsl.h, s = hsl.s;

                const tokens = isDark ? {
                    primary: hslToHex(h, s, 80),
                    onPrimary: hslToHex(h, s, 20),
                    primaryContainer: hslToHex(h, s, 30),
                    onPrimaryContainer: hslToHex(h, s, 90),
                    secondary: hslToHex(h, Math.max(10, s * 0.3), 80),
                    onSecondary: hslToHex(h, Math.max(10, s * 0.3), 20),
                    secondaryContainer: hslToHex(h, Math.max(10, s * 0.3), 30),
                    onSecondaryContainer: hslToHex(h, Math.max(10, s * 0.3), 90),
                    tertiary: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 80),
                    onTertiary: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 20),
                    tertiaryContainer: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 30),
                    onTertiaryContainer: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 90),
                    background: hslToHex(h, Math.max(5, s * 0.08), 6),
                    onBackground: hslToHex(h, Math.max(5, s * 0.08), 90),
                    surface: hslToHex(h, Math.max(5, s * 0.08), 6),
                    onSurface: hslToHex(h, Math.max(5, s * 0.08), 90),
                    surfaceVariant: hslToHex(h, Math.max(5, s * 0.12), 30),
                    onSurfaceVariant: hslToHex(h, Math.max(5, s * 0.12), 80),
                    surfaceContainerLowest: hslToHex(h, Math.max(5, s * 0.08), 4),
                    surfaceContainerLow: hslToHex(h, Math.max(5, s * 0.08), 10),
                    surfaceContainer: hslToHex(h, Math.max(5, s * 0.08), 12),
                    surfaceContainerHigh: hslToHex(h, Math.max(5, s * 0.08), 14),
                    surfaceContainerHighest: hslToHex(h, Math.max(5, s * 0.08), 22),
                    outline: hslToHex(h, Math.max(5, s * 0.15), 60),
                    outlineVariant: hslToHex(h, Math.max(5, s * 0.1), 30),
                    error: '#FFB4AB',
                    onError: '#690005',
                    errorContainer: '#93000A',
                    onErrorContainer: '#FFDAD6'
                } : {
                    primary: hslToHex(h, s, 40),
                    onPrimary: '#FFFFFF',
                    primaryContainer: hslToHex(h, s, 90),
                    onPrimaryContainer: hslToHex(h, s, 10),
                    secondary: hslToHex(h, Math.max(10, s * 0.3), 40),
                    onSecondary: '#FFFFFF',
                    secondaryContainer: hslToHex(h, Math.max(10, s * 0.3), 90),
                    onSecondaryContainer: hslToHex(h, Math.max(10, s * 0.3), 10),
                    tertiary: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 40),
                    onTertiary: '#FFFFFF',
                    tertiaryContainer: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 90),
                    onTertiaryContainer: hslToHex((h + 60) % 360, Math.max(10, s * 0.6), 10),
                    background: hslToHex(h, Math.max(5, s * 0.08), 98),
                    onBackground: hslToHex(h, Math.max(5, s * 0.08), 10),
                    surface: hslToHex(h, Math.max(5, s * 0.08), 98),
                    onSurface: hslToHex(h, Math.max(5, s * 0.08), 10),
                    surfaceVariant: hslToHex(h, Math.max(5, s * 0.12), 90),
                    onSurfaceVariant: hslToHex(h, Math.max(5, s * 0.12), 30),
                    surfaceContainerLowest: '#FFFFFF',
                    surfaceContainerLow: hslToHex(h, Math.max(5, s * 0.08), 96),
                    surfaceContainer: hslToHex(h, Math.max(5, s * 0.08), 94),
                    surfaceContainerHigh: hslToHex(h, Math.max(5, s * 0.08), 92),
                    surfaceContainerHighest: hslToHex(h, Math.max(5, s * 0.08), 90),
                    outline: hslToHex(h, Math.max(5, s * 0.15), 50),
                    outlineVariant: hslToHex(h, Math.max(5, s * 0.1), 80),
                    error: '#BA1A1A',
                    onError: '#FFFFFF',
                    errorContainer: '#FFDAD6',
                    onErrorContainer: '#410002'
                };

                // Inject as CSS custom properties
                Object.entries(tokens).forEach(([token, val]) => {
                    root.style.setProperty(`--md-sys-color-${token}`, val);
                });
            } catch (err) {
                console.error("Error generating Material 3 dynamic color tokens:", err);
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            if (themeMode === 'system') {
                applyTheme(e.matches);
            }
        };

        if (themeMode === 'system') {
            applyTheme(mediaQuery.matches);
            mediaQuery.addEventListener('change', handleChange);
        } else {
            applyTheme(themeMode === 'dark');
        }

        root.style.setProperty('--card-opacity', String(cardOpacity));
        root.style.setProperty('--sidebar-opacity', String(sidebarOpacity));
        root.style.setProperty('--grid-card-opacity', String(gridCardOpacity));
        root.style.setProperty('--content-opacity', String(contentOpacity));
        root.style.setProperty('--layout-opacity', String(layoutOpacity));
        root.style.setProperty('--sub-component-opacity', String(subComponentOpacity));
        if (isGlassEnabled) {
            root.classList.add('glass-enabled');
        } else {
            root.classList.remove('glass-enabled');
        }
        if (themePreset === 'material-design-3') {
            root.classList.add('m3-enabled');
            root.classList.add('theme-m3');
        } else {
            root.classList.remove('m3-enabled');
            root.classList.remove('theme-m3');
        }
        if (themePreset === 'neumorphism') {
            root.classList.add('theme-neumorphism');
        } else {
            root.classList.remove('theme-neumorphism');
        }
        if (themePreset === 'glassmorphism') {
            root.classList.add('theme-glassmorphism');
        } else {
            root.classList.remove('theme-glassmorphism');
        }
        if (themePreset === 'apple-human-interface') {
            root.classList.add('theme-apple-human');
        } else {
            root.classList.remove('theme-apple-human');
        }
        if (themePreset === 'glass-fluent-hybrid') {
            root.classList.add('theme-glass-fluent-hybrid');
        } else {
            root.classList.remove('theme-glass-fluent-hybrid');
        }
        if (themePreset === 'fluent-ui-2') {
            root.classList.add('theme-fluent-2');
        } else {
            root.classList.remove('theme-fluent-2');
        }
        if (isSidebarDetached) {
            root.classList.add('sidebar-detached');
        } else {
            root.classList.remove('sidebar-detached');
        }
        root.style.setProperty('--is-glass-enabled', isGlassEnabled ? '1' : '0');

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [themeMode, lightThemeColor, darkThemeColor, cardOpacity, sidebarOpacity, gridCardOpacity, accentColorType, isGlassEnabled]);

        // Effect to calculate actual scale based on auto or manual settings
    useEffect(() => {
        const updateScale = () => {
            if (uiScaleMode === 'auto') {
                if (typeof window !== 'undefined') {
                    if (window.innerWidth <= 767) {
                        setCurrentUiScale(1.0);
                    } else {
                        const scaleX = window.innerWidth / 1440;
                        const scaleY = window.innerHeight / 850;
                        const computed = Math.min(scaleX, scaleY);
                        const clamped = Math.max(0.75, Math.min(1.15, computed));
                        setCurrentUiScale(Number(clamped.toFixed(2)));
                    }
                }
            } else {
                setCurrentUiScale(uiScaleValue);
            }
        };

        updateScale();
        
        if (uiScaleMode === 'auto') {
            window.addEventListener('resize', updateScale);
            return () => window.removeEventListener('resize', updateScale);
        }
    }, [uiScaleMode, uiScaleValue]);

    // Effect to apply UI Scale to the DOM root
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.style.setProperty('--ui-scale', currentUiScale.toString());
        }
    }, [currentUiScale]);

    const value: ThemeContextType = {
        themeMode,
        setThemeMode,
        memoriesViewMode,
        setMemoriesViewMode,
        lightThemeColor,
        setLightThemeColor,
        darkThemeColor,
        setDarkThemeColor,
        isSoundOn,
        setSoundOn,
        isAiVoiceOn,
        setAiVoiceOn,
        selectedAiVoiceName,
        setSelectedAiVoiceName,
        aiVoicePitch,
        setAiVoicePitch,
        aiVoiceRate,
        setAiVoiceRate,
        projectFilter,
        setProjectFilter,
        wallpaper,
        setWallpaper,
        cardOpacity,
        setCardOpacity,
        sidebarOpacity,
        setSidebarOpacity,
        gridCardOpacity,
        setGridCardOpacity,
        contentOpacity,
        setContentOpacity,
        layoutOpacity,
        setLayoutOpacity,
        subComponentOpacity,
        setSubComponentOpacity,
        isMirrorOn,
        setIsMirrorOn,
        is2x2Grid,
        setIs2x2Grid,
        isGlassEnabled,
        setIsGlassEnabled,
        accentColorType,
        setAccentColorType,
        themePreset,
        setThemePreset,
        isSidebarDetached,
        setIsSidebarDetached,
        uiScaleMode,
        setUiScaleMode,
        uiScaleValue,
        setUiScaleValue,
        currentUiScale,
        resetToDefault,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};