// src/screens/kitchen/StaffPerfilScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ AGREGADO

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
  surfaceContainerHigh: '#E7E8E9',
  surfaceContainerHighest: '#E1E3E4',
  outlineVariant: '#CCC3D8',
  error: '#BA1A1A',
};

// 👤 DATOS MOCK
const STAFF_USER = {
  name: 'Carlos',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQKxcOt0wxvz9VyPD6tP81sLXqWiP5o8NhUt0GhVrCAwK7CbEMWtneqJPTRgkSuVxqbBxaoixOzS1qM1_EM0UezOHQS-dtimcKb6DEO64Mh4Yf-Haiz8XBrpFECmeL1_QvQZUaROw4R42gQCyADJOG9POTZ43ArLGkkfWmkpjGjR54VFEKMhRsclp0brusSvFM_mj98Zy07K2LFfqKYTVru-M8YFPZ4B4KG6LnFWBl2eGxHZC3CNTnr00O9w8LbehXVMrwktaUtl8',
  role: 'admin',
};

const CAFETERIA_CONFIG = {
  name: 'Cafetería Central',
  schedule: '07:00 - 20:00',
  announcement: 'Hoy cerramos a las 18:00 por evento universitario',
  maintenanceMode: false,
};

const SUPPORT_CONTACT = {
  email: 'soporte@yata.universidad.edu',
  phone: '+52 55 1234 5678',
};

export default function StaffPerfilScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets(); // ✅ HOOK PARA SAFE AREA
  const [config, setConfig] = useState(CAFETERIA_CONFIG);
  const [announcement, setAnnouncement] = useState(config.announcement);
  const [maintenanceMode, setMaintenanceMode] = useState(config.maintenanceMode);

  // 🔧 HANDLERS
  const handleNotification = () => {
    console.log('🔔 Ver notificaciones');
  };

  const handleEditName = () => {
    Alert.prompt(
      'Editar nombre de cafetería',
      'Nuevo nombre:',
      (newName) => {
        if (newName && newName.trim()) {
          setConfig((prev) => ({ ...prev, name: newName.trim() }));
          console.log('✏️ Nombre actualizado:', newName);
        }
      },
      'plain-text',
      config.name
    );
  };

  const handleEditSchedule = () => {
    Alert.prompt(
      'Editar horario',
      'Nuevo horario (ej: 08:00 - 19:00):',
      (newSchedule) => {
        if (newSchedule && newSchedule.trim()) {
          setConfig((prev) => ({ ...prev, schedule: newSchedule.trim() }));
          console.log('🕐 Horario actualizado:', newSchedule);
        }
      },
      'plain-text',
      config.schedule
    );
  };

  const handleUpdateAnnouncement = () => {
    console.log('📢 Aviso actualizado:', announcement);
    Alert.alert('Aviso actualizado', 'El mensaje ha sido enviado a los estudiantes.', [
      { text: 'OK', style: 'default' },
    ]);
  };

  const handleToggleMaintenance = (value: boolean) => {
    setMaintenanceMode(value);
    console.log(`🔧 Modo mantenimiento: ${value ? 'ACTIVADO' : 'DESACTIVADO'}`);
    
    if (value) {
      Alert.alert(
        'Modo Mantenimiento Activado',
        'Los estudiantes no podrán realizar nuevos pedidos hasta que desactives este modo.',
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contacto de Soporte',
      '¿Cómo deseas contactar al equipo de soporte técnico?',
      [
        { text: 'Email', onPress: () => Linking.openURL(`mailto:${SUPPORT_CONTACT.email}`) },
        { text: 'Teléfono', onPress: () => Linking.openURL(`tel:${SUPPORT_CONTACT.phone}`) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            console.log('🚪 Sesión de personal cerrada');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image
            source={{ uri: STAFF_USER.avatar }}
            style={styles.avatar}
            accessibilityLabel="Foto de perfil"
          />
          <Text style={styles.topBarTitle}>YaTa Cafetería</Text>
        </View>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotification}
          accessibilityLabel="Notificaciones"
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Editorial Header */}
        <View style={styles.headerSection}>
          <Text style={styles.adminLabel}>Administración</Text>
          <Text style={styles.headerTitle}>Configuración de Cafetería</Text>
          <Text style={styles.headerSubtitle}>
            Gestiona los parámetros globales de tu punto de servicio.
          </Text>
        </View>

        {/* General Settings Bento Grid */}
        <View style={styles.settingsGrid}>
          
          {/* Nombre de Cafetería */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={handleEditName}
            activeOpacity={0.8}
          >
            <View style={styles.settingHeader}>
              <MaterialCommunityIcons name="storefront" size={24} color={COLORS.primary} />
              <Text style={styles.editLink}>EDITAR</Text>
            </View>
            <Text style={styles.settingLabel}>Nombre</Text>
            <Text style={styles.settingValue}>{config.name}</Text>
          </TouchableOpacity>

          {/* Horario de Servicio */}
          <View style={[styles.settingCard, styles.settingCardSecondary]}>
            <View style={styles.settingHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.secondary} />
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleEditSchedule}>
                  <Text style={[styles.editLink, { color: COLORS.secondary }]}>EDITAR</Text>
                </TouchableOpacity>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVO</Text>
                </View>
              </View>
            </View>
            <Text style={styles.settingLabel}>Horario de Servicio</Text>
            <Text style={[styles.settingValue, styles.monoFont]}>{config.schedule}</Text>
          </View>
        </View>

        {/* Announcement Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aviso del Día</Text>
          <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              {/* ✅ FIX: 'bullhorn' es el nombre correcto en MaterialCommunityIcons */}
              <MaterialCommunityIcons name="bullhorn" size={16} color={COLORS.primary} />
              <Text style={styles.announcementLabel}>Mensaje para Estudiantes</Text>
            </View>
            <TextInput
              style={styles.announcementInput}
              placeholder="Escribe el aviso aquí..."
              placeholderTextColor={COLORS.outlineVariant}
              value={announcement}
              onChangeText={setAnnouncement}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateAnnouncement}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>ACTUALIZAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Maintenance Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Sistema</Text>
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceContent}>
              <MaterialCommunityIcons 
                name="wrench" 
                size={20} 
                color={maintenanceMode ? COLORS.error : COLORS.onSurfaceVariant} 
              />
              <View>
                <Text style={styles.maintenanceTitle}>Modo Mantenimiento</Text>
                <Text style={styles.maintenanceSubtitle}>
                  {maintenanceMode 
                    ? 'Pedidos pausados temporalmente' 
                    : 'Sistema operativo normal'}
                </Text>
              </View>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={handleToggleMaintenance}
              trackColor={{ false: COLORS.surfaceContainerHighest, true: COLORS.error }}
              thumbColor={Platform.OS === 'ios' ? undefined : COLORS.onPrimary}
              ios_backgroundColor={COLORS.surfaceContainerHighest}
            />
          </View>
        </View>

        {/* Support Contact */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleContactSupport}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="headphones" size={24} color={COLORS.primary} />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Contacto de Soporte</Text>
              <Text style={styles.supportSubtitle}>
                ¿Problemas técnicos? Contacta al equipo de YaTa
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>v2.4.1 Build AC-772</Text>
        </View>

        {/* Espacio para bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      {/* ✅ FIX: Estilo híbrido con insets dinámico para safe area */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffHome')}>
          <MaterialCommunityIcons name="home-outline" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GestionMenu')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Menú</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Estadisticas')}>
          <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Panel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.popToTop()}>
          <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
          <Text style={styles.navLabelActive}>Perfil</Text>
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

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Scroll Content */
  scrollContent: { flex: 1 },
  scrollPadding: {
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 100,
  },

  /* Header Section */
  headerSection: {
    marginBottom: 32,
  },
  adminLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -1,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    marginTop: 8,
  },

  /* Settings Grid */
  settingsGrid: {
    gap: 16,
    marginBottom: 32,
  },
  settingCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  settingCardSecondary: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeBadge: {
    backgroundColor: `${COLORS.secondary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  settingValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  monoFont: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  /* Section */
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 16,
  },

  /* Announcement Card */
  announcementCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHighest,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  announcementLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  announcementInput: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: COLORS.onSurface,
    minHeight: 96,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  updateButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* Maintenance Card */
  maintenanceCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maintenanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  maintenanceSubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },

  /* Support Card */
  supportCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  supportSubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },

  /* Logout Button */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${COLORS.error}0D`,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.error}1A`,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
  },

  /* Version Info */
  versionInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '500',
    color: `${COLORS.onSurfaceVariant}40`,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 15,
    height: 64,
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
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.onSurface,
    marginTop: 4,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 4,
  },
});