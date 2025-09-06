// src/theme.ts
import { StyleSheet } from 'react-native';

export const theme = {
  dark: true,
  roundness: 12,
  colors: {
    // Primary colors
    primary: '#FF00FF', // Neon pink
    accent: '#00FFFF', // Cyan
    secondary: '#8A2BE2', // Vibrant purple
    cyberBlue: '#00BFFF', // Neon blue
    cyberGreen: '#39FF14', // Neon green
    cyberYellow: '#FFD700', // Neon yellow
    cyberRed: '#FF3864', // Neon red
    cyberOrange: '#FF9900', // Neon orange
    cyberPurple: '#9D00FF', // Deep neon purple
    
    // Background colors
    background: '#121212', // Dark background
    card: '#1E1E1E', // Card background
    cardDark: '#171717', // Darker card background
    surface: '#252525', // Surface elements
    
    // Text colors
    text: '#FFFFFF', // Primary text
    textSecondary: '#AAAAAA', // Secondary text
    muted: '#888888',
    disabled: '#666666', // Disabled text
    
    // Status colors
    error: '#FF3864', // Neon red
    success: '#39FF14', // Neon green
    warning: '#FFD700', // Gold
    info: '#00BFFF', // Deep sky blue
    
    // UI elements
    border: '#333333', // Border color
    highlight: '#FF00FF80', // Semi-transparent magenta
    overlay: 'rgba(18, 18, 18, 0.8)', // Overlay for modals
    
    // Gradients (to be used with linear gradient)
    gradientStart: '#8A2BE2', // Purple start
    gradientMiddle: '#FF00FF', // Pink middle
    gradientEnd: '#00FFFF', // Cyan end
    
    // Special colors
    notification: '#FF00FF', // Magenta for notifications
    white: '#FFFFFF', // Pure white
    black: '#CCCCCC', // Light grey (changed from pure black)
    
    // Specific UI elements
    buttonPrimary: '#FF00FF',
    buttonSecondary: '#333333',
    buttonDanger: '#FF3864',
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'Orbitron', // Anime/cyberpunk style font (add to project)
      medium: 'Orbitron',
      bold: 'Orbitron',
      fallback: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 40,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Animation
  animation: {
    scale: 1.0,
    duration: {
      short: 150,
      medium: 300,
      long: 500,
    },
  },
};

// Common styles that can be reused across the app
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Cards
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  
  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  
  // Forms
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  
  // Buttons
  button: {
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Shadows
  shadow: {
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  
  // Flex helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Text styles
  heading: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subheading: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.md,
    marginBottom: theme.spacing.md,
  },
  
  // Cyberpunk specific styles
  neonText: {
    color: theme.colors.accent,
    textShadowColor: theme.colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonBorder: {
    borderColor: theme.colors.accent,
    borderWidth: 1,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  glitchContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
});

// Add cyberpunk-specific helpers
export const cyberpunkStyles = StyleSheet.create({
  neonGlow: {
    textShadowColor: theme.colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    color: theme.colors.accent,
  },
  neonBorder: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 12,
  },
  animePanel: {
    backgroundColor: theme.colors.cardDark,
    borderRadius: theme.roundness * 2,
    borderWidth: 2,
    borderColor: theme.colors.cyberBlue,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    shadowColor: theme.colors.cyberBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  // For future animated backgrounds, overlays, etc.
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});