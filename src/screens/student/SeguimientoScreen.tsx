// src/screens/student/SeguimientoScreen.tsx
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
import { useNavigation } from '@react-navigation/native'; // ✅ IMPORTANTE


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
  outlineVariant: '#CCC3D8',
  error: '#BA1A1A',
  green: '#16A34A',
};

// 📦 TIPOS
type OrderStatus = 'recibido' | 'en_preparacion' | 'listo';

interface OrderStep {
  id: string;
  label: string;
  description: string;
  time?: string;
  status: OrderStatus | 'completed';
}

// 👤 DATOS MOCK
const MOCK_USER = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp1RJxlQVkk6kXG1PSU0FP0hJNMp54cYnDL5OHwClQL1N4CF9t8SCsyNhVg8O3duJP5elcid_rZ_1qwomZaMGnFHy8cK_YOd2UcMXyyjp0sWlsbck1kpQjHT7DZlr-jNKgfb86qyFI1LIFCuFs5SHrbxezFgPazkDRaSlEbkhrfwIEuFbossjLgfxGVVFoaolDK7P3QhVxsN2LfXcD2vKFdZtRlJOVExLWGcTM0K3YJ7o37xHQ9SCCctHBnK88Ah6WqTcaPJ9lrso',
};

const ORDER_NUMBER = '#A-042';
const CURRENT_STATUS: OrderStatus = 'listo';

const ORDER_STEPS: OrderStep[] = [
  {
    id: '1',
    label: 'Recibido',
    description: 'Estamos procesando tu orden',
    time: '12:30',
    status: 'completed',
  },
  {
    id: '2',
    label: 'En preparación',
    description: 'El chef está cocinando tu comida',
    time: '12:35',
    status: 'completed',
  },
  {
    id: '3',
    label: 'Listo',
    description: '¡Buen provecho!',
    time: '12:42',
    status: 'listo',
  },
];

// 📝 INSTRUCCIÓN DE RECOGIDA (sin ventanillas)
const PICKUP_INSTRUCTION = 'Presenta tu número de orden al personal para recogerlo';

export default function SeguimientoScreen() {
  const navigation = useNavigation<any>();
  
  const handleGoHome = () => {
    console.log('🏠 Volver al inicio');
    navigation.navigate('StudentTabs');
  };

  const handleNotification = () => {
    console.log('🔔 Ver notificaciones');
  };

  const renderTimelineStep = (step: OrderStep, index: number) => {
    const isCompleted = step.status === 'completed' || step.status === 'listo';
    const isCurrent = step.status === CURRENT_STATUS && !isCompleted;

    return (
      <View key={step.id} style={styles.timelineStep}>
        <View style={[
          styles.timelineIcon,
          isCompleted && styles.timelineIconCompleted,
          isCurrent && styles.timelineIconCurrent,
        ]}>
          <MaterialCommunityIcons
            name={isCompleted ? 'check' : 'circle-outline'}
            size={18}
            color={isCompleted ? COLORS.onPrimary : COLORS.outlineVariant}
          />
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.timelineHeader}>
            <Text style={[
              styles.timelineLabel,
              isCompleted && styles.timelineLabelCompleted,
              isCurrent && styles.timelineLabelCurrent,
            ]}>
              {step.label}
            </Text>
            {step.time && (
              <Text style={styles.timelineTime}>{step.time}</Text>
            )}
          </View>
          <Text style={styles.timelineDescription}>{step.description}</Text>
        </View>
      </View>
    );
  };

  const renderPickupInstruction = () => {
    if (CURRENT_STATUS !== 'listo') {
      return (
        <View style={[styles.instructionCard, styles.instructionCardPending]}>
          <View style={styles.instructionIconPending}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.instructionTitle}>Tu pedido está en proceso</Text>
            <Text style={styles.instructionText}>
              Te notificaremos cuando esté listo para recoger
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.instructionCard}>
        <View style={styles.instructionIcon}>
          <MaterialCommunityIcons name="storefront" size={20} color={COLORS.onPrimary} />
        </View>
        <View>
          <Text style={styles.instructionTitle}>Tu orden está lista</Text>
          <Text style={styles.instructionText}>{PICKUP_INSTRUCTION}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image
            source={{ uri: MOCK_USER.avatar }}
            style={styles.avatar}
            accessibilityLabel="Foto de perfil"
          />
          <Text style={styles.cafeteriaName}>YaTa Cafetería</Text>
        </View>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotification}
          accessibilityLabel="Notificaciones"
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENIDO CON SCROLL ── */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.statusLabel}>Estatus del Pedido</Text>
          <Text style={styles.statusTitle}>
            {CURRENT_STATUS === 'listo' ? 'Tu pedido está listo' : 'Seguimiento de tu pedido'}
          </Text>
        </View>

        {/* Número de orden */}
        <View style={styles.orderNumberCard}>
          <Text style={styles.orderNumberLabel}>Número de Orden</Text>
          <Text style={styles.orderNumberValue}>{ORDER_NUMBER}</Text>
        </View>

        {/* Instrucción de recogida */}
        {renderPickupInstruction()}

        {/* Línea de tiempo */}
        <View style={styles.timelineContainer}>
          {ORDER_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              {renderTimelineStep(step, index)}
              {index < ORDER_STEPS.length - 1 && (
                <View style={styles.timelineConnector} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Botón: Volver al inicio ✅ AHORA DENTRO DEL SCROLL */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.9}
            accessibilityLabel="Volver al inicio"
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryContainer]}
              style={styles.homeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.homeButtonText}>Volver al inicio</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Espacio extra para asegurar visibilidad */}
        <View style={styles.scrollBottomSpacer} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION BAR (fuera del scroll, fija) ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive} onPress={handleGoHome}>
          <MaterialCommunityIcons name="home" size={24} color={COLORS.primary} />
          <Text style={styles.navLabelActive}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => console.log('🍽️ Menú')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Menú</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => console.log('👤 Perfil')}>
          <MaterialCommunityIcons name="account-outline" size={24} color={COLORS.onSurface} />
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  cafeteriaName: {
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
  scrollContent: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32, // ✅ Reducido: el botón ahora está DENTRO del scroll
  },
  scrollBottomSpacer: {
    height: 100, // ✅ Espacio extra para que el último elemento no quede tapado
  },

  /* Header */
  header: {
    marginBottom: 32,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -1,
  },

  /* Order Number Card */
  orderNumberCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  orderNumberLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  orderNumberValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: -2,
  },

  /* Instruction Card */
  instructionCard: {
    backgroundColor: `${COLORS.primary}0D`,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 32,
  },
  instructionCardPending: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionIconPending: {
    backgroundColor: `${COLORS.primary}1A`,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },

  /* Timeline */
  timelineContainer: {
    marginBottom: 40,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 24,
    paddingBottom: 32,
    position: 'relative',
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.surface,
    zIndex: 1,
  },
  timelineIconCompleted: {
    backgroundColor: COLORS.primary,
  },
  timelineIconCurrent: {
    backgroundColor: COLORS.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  timelineLabelCompleted: {
    color: COLORS.onSurface,
  },
  timelineLabelCurrent: {
    color: COLORS.green,
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    backgroundColor: COLORS.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timelineDescription: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  timelineConnector: {
    position: 'absolute',
    left: 19,
    top: 44,
    bottom: -16,
    width: 2,
    backgroundColor: `${COLORS.outlineVariant}4D`,
    zIndex: 0,
  },

  /* Action Section - BOTÓN VOLVER AL INICIO ✅ */
  actionSection: {
    marginTop: 16,
    marginBottom: 24, // ✅ Espacio extra después del botón
  },
  homeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  homeButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },

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