// src/screens/kitchen/StaffHomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🎨 COLORES (consistente con el resto de la app)
const COLORS = {
  primary: '#630ED4',
  primaryContainer: '#7C3AED',
  secondary: '#712EDD',
  surface: '#F8F9FA',
  onSurface: '#191C1D',
  onSurfaceVariant: '#4A4455',
  onPrimary: '#FFFFFF',
  surfaceContainer: '#EDEEEF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainerLowest: '#FFFFFF',
  outline: '#7B7487',
  outlineVariant: '#CCC3D8',
  green: '#16A34A',
};

// 👤 DATOS MOCK
const STAFF_USER = {
  name: 'Carlos',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeDmRmcLZXXuwI7Kl229gnSYhCjCnlePF--Lk-85T4hbhgDV0h0Ve9A9ONMrnK0LxydA8zpwR_2KTFVGUbAl9iq82sWkgLQuoUENSlZ9XBRqy1THqZF7VZt_BnZP1ChlECUpOfr4lln5PqcNnvzvmw_Ck-Beo8GU7eAU2qafyd2zlcrmu4UTsW3lo7PQIefS1dBN3AGMCOSWu_vpU3ouUV_NZOPYIN-ylLc88r70n-kSCQ5LJMgAz6PsmwP9JcXtDI11uNStC5004',
};

const TODAY_METRICS = {
  received: 142,
  completed: 128,
};

export default function StaffHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // 🔧 HANDLERS
  const handleGoToMenu = () => navigation.navigate('GestionMenu');
  const handleGoToAnalytics = () => navigation.navigate('Estadisticas');
  const handleGoToProfile = () => navigation.navigate('StaffPerfil');
  const handleOpenKDS = () => navigation.navigate('KDS');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR (SIN MENÚ LATERAL) ── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Inicio Staff</Text>
        
        <Image
          source={{ uri: STAFF_USER.avatar }}
          style={styles.avatar}
          accessibilityLabel="Foto de perfil"
        />
      </View>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>¡Buen día, {STAFF_USER.name}!</Text>
          <Text style={styles.welcomeTitle}>Tu flujo de trabajo</Text>
        </View>

        {/* KDS CTA - Card Principal */}
        <TouchableOpacity
          style={styles.kdsCard}
          onPress={handleOpenKDS}
          activeOpacity={0.9}
          accessibilityLabel="Abrir sistema de cocina KDS"
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryContainer]}
            style={styles.kdsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.kdsContent}>
              {/* Header del card */}
              <View style={styles.kdsHeader}>
                <View style={styles.kdsIconContainer}>
                  <MaterialCommunityIcons name="tablet" size={32} color={COLORS.onPrimary} />
                </View>
                <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.onPrimary} opacity={0.5} />
              </View>

              {/* Texto principal */}
              <View style={styles.kdsText}>
                <Text style={styles.kdsTitle}>Abrir KDS / Sistema de Cocina</Text>
                <Text style={styles.kdsSubtitle}>Visualiza y gestiona comandas en tiempo real</Text>
              </View>

              {/* Icono decorativo de fondo */}
              <MaterialCommunityIcons 
                name="silverware-fork-knife" 
                size={120} 
                color={COLORS.onPrimary} 
                style={styles.kdsDecorativeIcon}
                opacity={0.1}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Performance Metrics - Bento Grid */}
        <View style={styles.metricsGrid}>
          
          {/* Card: Recibidos */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>RECIBIDOS</Text>
              <MaterialCommunityIcons name="inbox-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{TODAY_METRICS.received}</Text>
            <Text style={styles.metricDescription}>Pedidos hoy</Text>
          </View>

          {/* Card: Listos */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={[styles.metricLabel, { color: COLORS.green }]}>LISTOS</Text>
              <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.green} />
            </View>
            <Text style={[styles.metricValue, { color: COLORS.green }]}>{TODAY_METRICS.completed}</Text>
            <Text style={styles.metricDescription}>Para entrega</Text>
          </View>
        </View>

        {/* Espacio para bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      {/* ✅ FIX: Estilo híbrido con insets dinámico */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        {/* Inicio (Activo) */}
        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.popToTop()}>
          <MaterialCommunityIcons name="home" size={24} color={COLORS.primary} />
          <Text style={styles.navLabelActive}>Inicio</Text>
        </TouchableOpacity>

        {/* Menú */}
        <TouchableOpacity style={styles.navItem} onPress={handleGoToMenu}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={styles.navLabel}>Menú</Text>
        </TouchableOpacity>

        {/* Panel */}
        <TouchableOpacity style={styles.navItem} onPress={handleGoToAnalytics}>
          <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={styles.navLabel}>Panel</Text>
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity style={styles.navItem} onPress={handleGoToProfile}>
          <MaterialCommunityIcons name="account-outline" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  /* Top Bar - SIN MENÚ LATERAL */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
  },

  /* Scroll Content */
  scrollContent: { flex: 1 },
  scrollPadding: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },

  /* Welcome Section */
  welcomeSection: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -1,
  },

  /* KDS CTA Card */
  kdsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  kdsGradient: {
    padding: 32,
  },
  kdsContent: {
    position: 'relative',
  },
  kdsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  kdsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kdsText: {
    flex: 1,
    paddingRight: 24,
  },
  kdsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onPrimary,
    marginBottom: 8,
  },
  kdsSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  kdsDecorativeIcon: {
    position: 'absolute',
    right: -24,
    bottom: -24,
  },

  /* Metrics Grid */
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.onSurface,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricDescription: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },

  /* Bottom Spacer */
  bottomSpacer: { height: 24 },

  /* Bottom Navigation - SIN paddingBottom fijo (se aplica dinámicamente en JSX) */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.surface}CC`,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItemActive: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${COLORS.primary}1A`,
    borderRadius: 12,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});