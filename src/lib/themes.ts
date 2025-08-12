/**
 * Theme Configuration System
 *
 * Centralized theme management for the accounting application.
 * Supports multiple theme variants, color schemes, and easy customization.
 */

export interface ThemeConfig {
	name: string;
	displayName: string;
	colors: {
		light: ColorScheme;
		dark: ColorScheme;
	};
}

export interface ColorScheme {
	// Base colors
	background: string;
	foreground: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;

	// Primary colors
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;

	// UI colors
	muted: string;
	mutedForeground: string;
	accent: string;
	accentForeground: string;
	destructive: string;
	border: string;
	input: string;
	ring: string;

	// Chart colors
	chart1: string;
	chart2: string;
	chart3: string;
	chart4: string;
	chart5: string;

	// Sidebar colors
	sidebar: string;
	sidebarForeground: string;
	sidebarPrimary: string;
	sidebarPrimaryForeground: string;
	sidebarAccent: string;
	sidebarAccentForeground: string;
	sidebarBorder: string;
	sidebarRing: string;
}

// Default modern theme (current implementation)
export const modernTheme: ThemeConfig = {
	name: 'modern',
	displayName: 'Modern',
	colors: {
		light: {
			// Modern light background with subtle warmth
			background: 'oklch(0.99 0.005 85)',
			foreground: 'oklch(0.15 0.02 245)',

			// Cards with slight elevation and warmth
			card: 'oklch(1 0.008 85)',
			cardForeground: 'oklch(0.15 0.02 245)',

			// Popovers clean and bright
			popover: 'oklch(1 0.005 85)',
			popoverForeground: 'oklch(0.15 0.02 245)',

			// Modern teal-blue primary
			primary: 'oklch(0.55 0.18 195)',
			primaryForeground: 'oklch(1 0.005 85)',

			// Soft lavender secondary
			secondary: 'oklch(0.95 0.025 270)',
			secondaryForeground: 'oklch(0.25 0.05 245)',

			// Subtle muted areas with warmth
			muted: 'oklch(0.96 0.015 85)',
			mutedForeground: 'oklch(0.45 0.025 245)',

			// Soft mint accent
			accent: 'oklch(0.94 0.04 150)',
			accentForeground: 'oklch(0.2 0.04 195)',

			// Coral destructive
			destructive: 'oklch(0.6 0.22 25)',

			// Subtle borders with color
			border: 'oklch(0.9 0.02 85)',
			input: 'oklch(0.98 0.01 85)',
			ring: 'oklch(0.55 0.18 195)',

			// Vibrant chart colors
			chart1: 'oklch(0.65 0.25 25)', // Coral
			chart2: 'oklch(0.6 0.22 195)', // Teal
			chart3: 'oklch(0.55 0.18 270)', // Purple
			chart4: 'oklch(0.7 0.2 85)', // Golden
			chart5: 'oklch(0.6 0.15 150)', // Green

			// Sidebar with subtle color
			sidebar: 'oklch(0.98 0.01 195)',
			sidebarForeground: 'oklch(0.15 0.02 245)',
			sidebarPrimary: 'oklch(0.55 0.18 195)',
			sidebarPrimaryForeground: 'oklch(1 0.005 85)',
			sidebarAccent: 'oklch(0.94 0.04 150)',
			sidebarAccentForeground: 'oklch(0.2 0.04 195)',
			sidebarBorder: 'oklch(0.9 0.02 195)',
			sidebarRing: 'oklch(0.55 0.18 195)',
		},
		dark: {
			// Rich dark background
			background: 'oklch(0.08 0.02 245)',
			foreground: 'oklch(0.95 0.01 85)',

			// Elevated dark cards
			card: 'oklch(0.12 0.025 245)',
			cardForeground: 'oklch(0.95 0.01 85)',

			// Popover darkness
			popover: 'oklch(0.12 0.025 245)',
			popoverForeground: 'oklch(0.95 0.01 85)',

			// Bright teal primary for dark mode
			primary: 'oklch(0.7 0.2 195)',
			primaryForeground: 'oklch(0.08 0.02 245)',

			// Muted purple secondary
			secondary: 'oklch(0.2 0.04 270)',
			secondaryForeground: 'oklch(0.9 0.02 85)',

			// Dark muted areas
			muted: 'oklch(0.16 0.03 245)',
			mutedForeground: 'oklch(0.6 0.025 195)',

			// Mint accent for dark
			accent: 'oklch(0.25 0.06 150)',
			accentForeground: 'oklch(0.9 0.02 85)',

			// Bright coral destructive
			destructive: 'oklch(0.7 0.25 25)',

			// Subtle borders
			border: 'oklch(0.2 0.04 245)',
			input: 'oklch(0.16 0.03 245)',
			ring: 'oklch(0.7 0.2 195)',

			// Vibrant dark chart colors
			chart1: 'oklch(0.7 0.25 25)', // Bright coral
			chart2: 'oklch(0.7 0.2 195)', // Bright teal
			chart3: 'oklch(0.65 0.2 270)', // Bright purple
			chart4: 'oklch(0.75 0.22 85)', // Bright golden
			chart5: 'oklch(0.7 0.18 150)', // Bright green

			// Dark sidebar with color
			sidebar: 'oklch(0.1 0.025 245)',
			sidebarForeground: 'oklch(0.95 0.01 85)',
			sidebarPrimary: 'oklch(0.7 0.2 195)',
			sidebarPrimaryForeground: 'oklch(0.08 0.02 245)',
			sidebarAccent: 'oklch(0.25 0.06 150)',
			sidebarAccentForeground: 'oklch(0.9 0.02 85)',
			sidebarBorder: 'oklch(0.2 0.04 245)',
			sidebarRing: 'oklch(0.7 0.2 195)',
		},
	},
};

// Professional blue theme
export const professionalTheme: ThemeConfig = {
	name: 'professional',
	displayName: 'Professional',
	colors: {
		light: {
			background: 'oklch(0.99 0.002 240)',
			foreground: 'oklch(0.1 0.01 240)',
			card: 'oklch(1 0.002 240)',
			cardForeground: 'oklch(0.1 0.01 240)',
			popover: 'oklch(1 0.002 240)',
			popoverForeground: 'oklch(0.1 0.01 240)',
			primary: 'oklch(0.45 0.15 240)',
			primaryForeground: 'oklch(0.98 0.002 240)',
			secondary: 'oklch(0.96 0.01 240)',
			secondaryForeground: 'oklch(0.2 0.02 240)',
			muted: 'oklch(0.96 0.01 240)',
			mutedForeground: 'oklch(0.5 0.02 240)',
			accent: 'oklch(0.94 0.02 200)',
			accentForeground: 'oklch(0.2 0.02 240)',
			destructive: 'oklch(0.55 0.2 20)',
			border: 'oklch(0.92 0.01 240)',
			input: 'oklch(0.98 0.005 240)',
			ring: 'oklch(0.45 0.15 240)',
			chart1: 'oklch(0.45 0.15 240)',
			chart2: 'oklch(0.55 0.12 200)',
			chart3: 'oklch(0.6 0.1 280)',
			chart4: 'oklch(0.65 0.15 160)',
			chart5: 'oklch(0.5 0.18 60)',
			sidebar: 'oklch(0.97 0.005 240)',
			sidebarForeground: 'oklch(0.1 0.01 240)',
			sidebarPrimary: 'oklch(0.45 0.15 240)',
			sidebarPrimaryForeground: 'oklch(0.98 0.002 240)',
			sidebarAccent: 'oklch(0.94 0.02 200)',
			sidebarAccentForeground: 'oklch(0.2 0.02 240)',
			sidebarBorder: 'oklch(0.92 0.01 240)',
			sidebarRing: 'oklch(0.45 0.15 240)',
		},
		dark: {
			background: 'oklch(0.08 0.01 240)',
			foreground: 'oklch(0.95 0.002 240)',
			card: 'oklch(0.12 0.01 240)',
			cardForeground: 'oklch(0.95 0.002 240)',
			popover: 'oklch(0.12 0.01 240)',
			popoverForeground: 'oklch(0.95 0.002 240)',
			primary: 'oklch(0.65 0.18 240)',
			primaryForeground: 'oklch(0.08 0.01 240)',
			secondary: 'oklch(0.18 0.02 240)',
			secondaryForeground: 'oklch(0.9 0.005 240)',
			muted: 'oklch(0.15 0.02 240)',
			mutedForeground: 'oklch(0.6 0.01 240)',
			accent: 'oklch(0.22 0.04 200)',
			accentForeground: 'oklch(0.9 0.005 240)',
			destructive: 'oklch(0.7 0.22 20)',
			border: 'oklch(0.18 0.02 240)',
			input: 'oklch(0.15 0.02 240)',
			ring: 'oklch(0.65 0.18 240)',
			chart1: 'oklch(0.65 0.18 240)',
			chart2: 'oklch(0.7 0.15 200)',
			chart3: 'oklch(0.75 0.12 280)',
			chart4: 'oklch(0.8 0.18 160)',
			chart5: 'oklch(0.7 0.2 60)',
			sidebar: 'oklch(0.1 0.015 240)',
			sidebarForeground: 'oklch(0.95 0.002 240)',
			sidebarPrimary: 'oklch(0.65 0.18 240)',
			sidebarPrimaryForeground: 'oklch(0.08 0.01 240)',
			sidebarAccent: 'oklch(0.22 0.04 200)',
			sidebarAccentForeground: 'oklch(0.9 0.005 240)',
			sidebarBorder: 'oklch(0.18 0.02 240)',
			sidebarRing: 'oklch(0.65 0.18 240)',
		},
	},
};

// Available themes
export const themes: Record<string, ThemeConfig> = {
	modern: modernTheme,
	professional: professionalTheme,
};

// Default theme
export const defaultTheme = modernTheme;

/**
 * Apply a theme to the document
 */
export function applyTheme(
	theme: ThemeConfig,
	mode: 'light' | 'dark' = 'light'
) {
	const root = document.documentElement;
	const colors = theme.colors[mode];

	// Apply CSS variables
	Object.entries(colors).forEach(([key, value]) => {
		const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
		root.style.setProperty(`--${cssVar}`, value);
	});
}

/**
 * Get theme CSS variables as a string for SSR
 */
export function getThemeCSS(
	theme: ThemeConfig,
	mode: 'light' | 'dark' = 'light'
): string {
	const colors = theme.colors[mode];

	return Object.entries(colors)
		.map(([key, value]) => {
			const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
			return `  --${cssVar}: ${value};`;
		})
		.join('\n');
}

/**
 * Get all available theme options for UI
 */
export function getThemeOptions() {
	return Object.values(themes).map((theme) => ({
		value: theme.name,
		label: theme.displayName,
	}));
}
