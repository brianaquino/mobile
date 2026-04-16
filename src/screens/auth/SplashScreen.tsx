// src/screens/auth/SplashScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ IMPORTANTE
import type { NavigationProp } from '../../types'; // Si tienes tipos globales, sino usa `any`

// 🎨 COLORES
const COLORS = {
  primary: '#630ED4',
  primaryContainer: '#7C3AED',
  surface: '#F8F9FA',
  onSurface: '#191C1D',
  onSurfaceVariant: '#4A4455',
  onPrimary: '#FFFFFF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainerHighest: '#E1E3E4',
};

export default function SplashScreen() {
  const navigation = useNavigation<any>(); // ✅ Hook para obtener navegación
  
  const handleGoogleSignIn = () => {
    console.log('🔐 Simulando autenticación con Google...');
    // 🔄 Por ahora, navegamos directo al flujo de estudiante para probar
    navigation.replace('StudentStack'); 
  };

  const handleStaffLogin = () => {
    console.log('👨‍🍳 Navegando a login de personal');
    navigation.navigate('LoginPersonal');
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* ── HEADER: Logo y Títulos ── */}
        <View style={styles.header}>
          {/* Logo YaTa */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Text style={styles.logoText}>YaTa</Text>
          </View>
          
          {/* Títulos */}
          <View style={styles.titles}>
            <Text style={styles.title}>Cafetería Central - Universidad</Text>
            <Text style={styles.subtitle}>Pide, paga y recoge sin filas</Text>
          </View>
        </View>

        {/* ── IMAGEN CENTRAL ── */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBg1} />
          <View style={styles.imageBg2} />
          
          <Image
            source={{ 
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8OPsYLHjplk2d8uo3WFy36cuf334DI5KmTMlQPlQQJQmtFQ0jbXOsbDzicP_8TRs25CC5_Hi3nxNetLO-tqtXeSDZOgbpO2eNhvibZJco5pCxMiqita7lJS3qJNd88un7m3RYWr0OcnqBj7EpJyfu5syBEnNlz0uKtoi5rc-bGo_xsJWZr4FsIw_UzdRFk42UOfc6wg4ifbMBgqPUjSNh4MEJyUXgI5VLDybVuPFBP-5sLe8Sd_hiM1oMqWXB-M27I7Hi6iuYbiM' 
            }}
            style={styles.coffeeImage}
            resizeMode="cover"
            accessibilityLabel="Café de especialidad siendo servido"
          />
        </View>

        {/* ── SECCIÓN DE ACCIONES ── */}
        <View style={styles.actions}>
          
          {/* Botón Google Sign In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            accessibilityLabel="Continuar con Google"
            accessibilityHint="Usa tu cuenta institucional para iniciar sesión"
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryContainer]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name="google" size={20} color={COLORS.onPrimary} />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Texto de ayuda */}
          <View style={styles.helperText}>
            <Text style={styles.helperTextBase}>
              Usa tu cuenta institucional{' '}
              <Text style={styles.helperTextAccent}>@unach.mx</Text>
            </Text>
          </View>
        </View>

        {/* ── FOOTER: Link para personal ── */}
        <TouchableOpacity
          style={styles.footer}
          onPress={handleStaffLogin}
          accessibilityLabel="Acceso para personal de cafetería"
        >
          <Text style={styles.footerText}>
            ¿Eres personal de cafetería?{' '}
            <Text style={styles.footerLink}>Accede aquí</Text>
          </Text>
        </TouchableOpacity>

      </View>

      {/* ── Acentos de fondo (decorativos) ── */}
      <View style={styles.bgAccent1} />
      <View style={styles.bgAccent2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  
  /* Header */
  header: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoContainer: {
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
  },
  logoGlow: {
    position: 'absolute',
    inset: -16,
    backgroundColor: 'rgba(99, 14, 212, 0.05)',
    borderRadius: 9999,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -2,
  },
  titles: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.8,
  },

  /* Imagen */
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  imageBg1: {
    position: 'absolute',
    width: 256,
    height: 256,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    transform: [{ rotate: '12deg' }, { scale: 1.05 }],
  },
  imageBg2: {
    position: 'absolute',
    width: 256,
    height: 256,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 24,
    transform: [{ rotate: '-12deg' }],
  },
  coffeeImage: {
    width: 256,
    height: 256,
    borderRadius: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },

  /* Acciones */
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  googleButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.onPrimary,
  },
  helperText: {
    alignItems: 'center',
  },
  helperTextBase: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  helperTextAccent: {
    color: COLORS.primary,
    fontWeight: '500',
    letterSpacing: -0.5,
  },

  /* Footer */
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* Acentos de fondo */
  bgAccent1: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(99, 14, 212, 0.05)',
    borderRadius: 9999,
  },
  bgAccent2: {
    position: 'absolute',
    bottom: -96,
    left: -96,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(113, 46, 221, 0.05)',
    borderRadius: 9999,
  },
});