'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { themes, applyTheme, type ThemeConfig } from '@/lib/themes';

interface AdvancedThemeProviderProps
	extends Omit<ThemeProviderProps, 'themes'> {
	children: React.ReactNode;
	defaultTheme?: string;
	themeVariant?: string;
}

export function AdvancedThemeProvider({
	children,
	defaultTheme = 'system',
	themeVariant = 'modern',
	...props
}: AdvancedThemeProviderProps) {
	const [currentThemeVariant, setCurrentThemeVariant] =
		React.useState(themeVariant);

	React.useEffect(() => {
		const theme = themes[currentThemeVariant];
		if (theme) {
			// Get current theme mode from next-themes
			const isDark = document.documentElement.classList.contains('dark');
			applyTheme(theme, isDark ? 'dark' : 'light');
		}
	}, [currentThemeVariant]);

	// Listen for theme changes
	React.useEffect(() => {
		const observer = new MutationObserver(() => {
			const theme = themes[currentThemeVariant];
			if (theme) {
				const isDark = document.documentElement.classList.contains('dark');
				applyTheme(theme, isDark ? 'dark' : 'light');
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, [currentThemeVariant]);

	const contextValue = React.useMemo(
		() => ({
			themeVariant: currentThemeVariant,
			setThemeVariant: setCurrentThemeVariant,
			availableThemes: Object.keys(themes),
		}),
		[currentThemeVariant]
	);

	return (
		<ThemeVariantContext.Provider value={contextValue}>
			<NextThemesProvider
				attribute="class"
				defaultTheme={defaultTheme}
				enableSystem
				disableTransitionOnChange
				{...props}
			>
				{children}
			</NextThemesProvider>
		</ThemeVariantContext.Provider>
	);
}

// Context for theme variant management
const ThemeVariantContext = React.createContext<{
	themeVariant: string;
	setThemeVariant: (variant: string) => void;
	availableThemes: string[];
} | null>(null);

export function useThemeVariant() {
	const context = React.useContext(ThemeVariantContext);
	if (!context) {
		throw new Error(
			'useThemeVariant must be used within AdvancedThemeProvider'
		);
	}
	return context;
}

export { themes } from '@/lib/themes';
