// src/screens/student/PerfilScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

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
  green: '#16A34A',
};

// 📦 TIPOS
interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  location: string;
  total: number;
  status: 'completado' | 'cancelado' | 'en_proceso';
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  defaultPaymentMethod: 'efectivo' | 'tarjeta';
  pushNotifications: boolean;
}

// 👤 DATOS MOCK (luego vendrán de useAuthStore)
const MOCK_USER: UserProfile = {
  name: 'Brian Aquino',
  email: 'brian.aquino@unach.mx',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEWTFMH7NMbGjAC99Dt81we2KDXfTKrbYeMg&s',
  defaultPaymentMethod: 'efectivo',
  pushNotifications: true,
};

const ORDER_HISTORY: OrderHistoryItem[] = [
  {
    id: '1',
    orderNumber: '#A-030',
    date: '12 May',
    location: 'Cafetería Central',
    total: 120.00,
    status: 'completado',
  },
  // Puedes agregar más items aquí para probar scroll
];

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [pushEnabled, setPushEnabled] = useState(user.pushNotifications);

  // 🔧 HANDLERS
  const handleNotification = () => {
    console.log('🔔 Ver notificaciones');
  };

  const handleEditAvatar = () => {
    console.log('✏️ Editar foto de perfil');
    Alert.alert(
      'Foto de perfil',
      'Tu foto se sincroniza automáticamente con tu cuenta institucional de Google.\n\nPara cambiarla, actualiza tu foto en tu cuenta de Google.',
      [{ text: 'Entendido', style: 'cancel' }]
    );
  };

  const handlePaymentMethod = () => {
    console.log('💳 Cambiar método de pago predeterminado');
    // TODO: Navegar a pantalla de selección o mostrar modal
  };

  const handleToggleNotifications = (value: boolean) => {
    setPushEnabled(value);
    console.log('🔔 Notificaciones push:', value ? 'activadas' : 'desactivadas');
    // TODO: Guardar preferencia en backend o AsyncStorage
  };

  const handleViewAllOrders = () => {
    console.log('📜 Ver todo el historial de pedidos');
    // TODO: Navegar a pantalla de historial completo
  };

  const handleSupport = () => {
    console.log('🆘 Contacto con soporte de cafetería');
    // TODO: Abrir modal de contacto o navegar a pantalla de soporte
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
          console.log('🚪 Cerrando sesión y limpiando navegación...');
          
          // ✅ FIX: Casting con 'as any' para evitar error de tipos
          navigation.reset({
            index: 0,
            routes: [{ name: 'Splash' } as any],
          });
        },
      },
    ]
  );
};

  // 🧩 RENDER: Item del historial
  const renderOrderItem = (order: OrderHistoryItem) => {
    const statusColors: Record<OrderHistoryItem['status'], { bg: string; text: string }> = {
      completado: { bg: `${COLORS.green}1A`, text: COLORS.green },
      cancelado: { bg: `${COLORS.error}1A`, text: COLORS.error },
      en_proceso: { bg: `${COLORS.primary}1A`, text: COLORS.primary },
    };

    const statusLabels: Record<OrderHistoryItem['status'], string> = {
      completado: 'Completado',
      cancelado: 'Cancelado',
      en_proceso: 'En proceso',
    };

    const style = statusColors[order.status];

    return (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        activeOpacity={0.8}
        onPress={() => console.log('Ver detalle de pedido:', order.orderNumber)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[styles.statusText, { color: style.text }]}>
              {statusLabels[order.status]}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderMeta}>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="calendar" size={14} color={COLORS.onSurfaceVariant} />
              <Text style={styles.metaText}>{order.date}</Text>
            </View>
            <Text style={styles.metaText}>{order.location}</Text>
          </View>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatarSmall}
            accessibilityLabel="Foto de perfil"
          />
          <Text style={styles.topBarTitle}>Perfil</Text>
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
        
        {/* Sección: Identidad del usuario */}
        <View style={styles.identitySection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleEditAvatar}
            accessibilityLabel="Editar foto de perfil"
          >
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatarLarge}
              accessibilityLabel="Avatar"
            />
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={14} color={COLORS.onPrimary} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Sección: Preferencias (Bento Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferencias</Text>
          
          <View style={styles.preferencesGrid}>
            {/* Método de pago */}
            <TouchableOpacity
              style={styles.preferenceCard}
              onPress={handlePaymentMethod}
              activeOpacity={0.8}
            >
              <View style={styles.preferenceContent}>
                <View style={[styles.preferenceIcon, { backgroundColor: `${COLORS.secondary}1A` }]}>
                  <MaterialCommunityIcons name="credit-card" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceTitle}>Pago predeterminado</Text>
                  <Text style={styles.preferenceValue}>{user.defaultPaymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>

            {/* Notificaciones push */}
            <View style={styles.preferenceCard}>
              <View style={styles.preferenceContent}>
                <View style={[styles.preferenceIcon, { backgroundColor: `${COLORS.primary}1A` }]}>
                  <MaterialCommunityIcons name="bell-ring" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceTitle}>Notificaciones push</Text>
                  <Text style={styles.preferenceValue}>Alertas de pedido listo</Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: COLORS.surfaceContainerHighest, true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : COLORS.onPrimary}
                ios_backgroundColor={COLORS.surfaceContainerHighest}
              />
            </View>
          </View>
        </View>

        {/* Sección: Historial de pedidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Historial de Pedidos</Text>
            <TouchableOpacity onPress={handleViewAllOrders}>
              <Text style={styles.viewAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersList}>
            {ORDER_HISTORY.map(renderOrderItem)}
          </View>
        </View>

        {/* Sección: Enlaces de utilidad */}
        <View style={styles.utilitySection}>
          <TouchableOpacity
            style={styles.utilityButton}
            onPress={handleSupport}
            activeOpacity={0.8}
          >
            <Text style={styles.utilityButtonText}>Soporte / Contacto cafetería</Text>
            <MaterialCommunityIcons name="headphones" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Espacio para bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <View style={styles.bottomNav}>
        {/* Inicio */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => console.log('🏠 Ir a Inicio')}
        >
          <MaterialCommunityIcons name="home-outline" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        {/* Menú */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => console.log('🍽️ Ir a Menú')}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Menú</Text>
        </TouchableOpacity>

        {/* Perfil (Activo) */}
        <TouchableOpacity
          style={styles.navItemActive}
          onPress={() => console.log('👤 Perfil (actual)')}
        >
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
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
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
    paddingTop: 16,
    paddingBottom: 100,
  },

  /* Identity Section */
  identitySection: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.surfaceContainerLow,
    backgroundColor: COLORS.surfaceContainer,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    opacity: 0.8,
  },

  /* Section */
  section: {
    marginTop: 24,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.6,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  /* Preferences Grid */
  preferencesGrid: {
    gap: 12,
  },
  preferenceCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferenceText: {
    gap: 2,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  preferenceValue: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
  },

  /* Order History */
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}1A`,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  orderMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.onSurface,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  /* Utility Section */
  utilitySection: {
    marginTop: 24,
    gap: 12,
  },
  utilityButton: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  utilityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  logoutButton: {
    backgroundColor: `${COLORS.error}0D`,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: `${COLORS.error}1A`,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
  },

  /* Bottom Spacer */
  bottomSpacer: { height: 24 },

  /* Bottom Navigation */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingTop: 12,
    backgroundColor: `${COLORS.surface}CC`,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    opacity: 0.6,
  },
  navItemActive: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: `${COLORS.primary}1A`,
    borderRadius: 12,
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.onSurface,
    marginTop: 4,
  },
  navLabelActive: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 4,
  },
});