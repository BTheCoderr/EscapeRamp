'use client';

import { useEffect, useState } from 'react';

interface ThemeColors {
	primary: string;
	chart1: string;
	chart2: string;
	chart3: string;
	chart4: string;
	chart5: string;
}

export function useThemeColors(): ThemeColors {
	const [colors, setColors] = useState<ThemeColors>({
		primary: '#0ea5e9',
		chart1: '#ef4444',
		chart2: '#06b6d4',
		chart3: '#8b5cf6',
		chart4: '#f59e0b',
		chart5: '#10b981',
	});

	useEffect(() => {
		const updateColors = () => {
			if (typeof window === 'undefined') return;

			const computedStyle = getComputedStyle(document.documentElement);

			// Get the CSS variables and parse the OKLCH values
			const getColorValue = (variable: string): string => {
				const value = computedStyle.getPropertyValue(`--${variable}`).trim();

				// If it's already in HSL format, use it directly
				if (
					value.startsWith('hsl(') ||
					value.startsWith('rgb(') ||
					value.startsWith('#')
				) {
					return value;
				}

				// If it's an OKLCH value, we need to convert it
				// For now, let's use fallback colors that match our theme
				const fallbacks: Record<string, string> = {
					primary: '#0ea5e9',
					'chart-1': '#f87171', // Coral
					'chart-2': '#06b6d4', // Teal
					'chart-3': '#a855f7', // Purple
					'chart-4': '#fbbf24', // Golden
					'chart-5': '#10b981', // Green
				};

				return fallbacks[variable] || '#6b7280';
			};

			setColors({
				primary: getColorValue('primary'),
				chart1: getColorValue('chart-1'),
				chart2: getColorValue('chart-2'),
				chart3: getColorValue('chart-3'),
				chart4: getColorValue('chart-4'),
				chart5: getColorValue('chart-5'),
			});
		};

		// Initial load
		updateColors();

		// Listen for theme changes
		const observer = new MutationObserver(() => {
			updateColors();
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, []);

	return colors;
}
