// src/screens/kitchen/KDSScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

// 🎨 PALETA DE COLORES (Verificada y completa)
const COLORS = {
  primary: '#630ED4',
  primaryContainer: '#7C3AED',
  surface: '#F8F9FA',
  onSurface: '#191C1D',
  onSurfaceVariant: '#4A4455',
  onPrimary: '#FFFFFF',
  surfaceContainer: '#EDEEEF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerHigh: '#E7E8E9',
  outlineVariant: '#CCC3D8',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  amberText: '#92400E',
  green: '#16A34A',
  greenLight: '#DCFCE7',
  greenText: '#166534',
};

// 📦 TIPOS
type OrderStatus = 'pendiente' | 'en_preparacion' | 'listo';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  customization?: string;
  ready?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  elapsedMinutes: number;
  estimatedMinutes?: number;
  paymentMethod: 'tarjeta' | 'efectivo';
  status: OrderStatus;
  priority?: boolean;
  type: 'comedor' | 'para_llevar';
}

// 👤 DATOS MOCK
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#A-242',
    items: [
      { id: '1a', name: 'Chilaquiles Verdes', quantity: 2, customization: 'Extra Crema' },
      { id: '1b', name: 'Café de Olla', quantity: 1 },
    ],
    elapsedMinutes: 2,
    paymentMethod: 'tarjeta',
    status: 'pendiente',
    priority: true,
    type: 'comedor',
  },
  {
    id: '2',
    orderNumber: '#A-243',
    items: [
      { id: '2a', name: 'Baguette Pollo', quantity: 1 },
      { id: '2b', name: 'Jugo Naranja', quantity: 1 },
    ],
    elapsedMinutes: 5,
    paymentMethod: 'efectivo',
    status: 'pendiente',
    type: 'para_llevar',
  },
  {
    id: '3',
    orderNumber: '#A-240',
    items: [
      { id: '3a', name: 'Tacos de Canasta', quantity: 3, ready: true },
      { id: '3b', name: 'Agua de Jamaica', quantity: 1, ready: true },
    ],
    elapsedMinutes: 4,
    estimatedMinutes: 2,
    paymentMethod: 'tarjeta',
    status: 'en_preparacion',
  },
  {
    id: '4',
    orderNumber: '#A-238',
    items: [
      { id: '4a', name: 'Ensalada César', quantity: 1 },
      { id: '4b', name: 'Té Helado', quantity: 1 },
    ],
    elapsedMinutes: 12,
    paymentMethod: 'tarjeta',
    status: 'listo',
  },
];

// 🧮 UTILS
const formatTime = (date: Date) => 
  date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

export default function KDSScreen() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔒 Forzar orientación horizontal en tablet
  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('No se pudo bloquear orientación:', error);
      }
    })();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // 🕒 Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔧 HANDLERS
  const handleStartPreparation = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'en_preparacion' } : o))
    );
  };

  const handleMarkAsReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'listo' } : o))
    );
  };

  const handleRefresh = () => {
    console.log('🔄 Sincronizando con kitchen-service...');
    // TODO: Llamar API para actualizar órdenes
  };

  const handleNotifications = () => {
    console.log('🔔 Centro de notificaciones');
  };

  // 🧩 RENDER: Card de orden
  const renderOrderCard = (order: Order, columnStatus: OrderStatus) => {
    const isPending = columnStatus === 'pendiente';
    const isInPrep = columnStatus === 'en_preparacion';
    const isReady = columnStatus === 'listo';

    const borderColor = isPending ? COLORS.amber : isInPrep ? COLORS.primary : COLORS.green;
    const badgeBg = isPending ? COLORS.amberLight : isInPrep ? `${COLORS.primary}1A` : COLORS.greenLight;
    const badgeText = isPending ? COLORS.amberText : isInPrep ? COLORS.primary : COLORS.greenText;

    return (
      <View
        key={order.id}
        style={[styles.orderCard, { borderLeftWidth: 5, borderLeftColor: borderColor }, isReady && styles.orderCardDelivered]}
      >
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderNumber, isReady && styles.orderNumberDelivered]}>
              {order.orderNumber}
            </Text>
            <Text style={styles.orderMeta}>
              {isReady
                ? 'Entregado hace 1 min'
                : isInPrep
                ? `En curso: ${order.elapsedMinutes} min • Est. ${order.estimatedMinutes} min`
                : `Hace ${order.elapsedMinutes} min • ${order.type === 'comedor' ? 'Comedor' : 'Para llevar'}`}
            </Text>
          </View>

          <View style={styles.orderBadges}>
            {order.priority && !isReady && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityBadgeText}>Prioridad</Text>
              </View>
            )}
            {!isReady && (
              <View style={[styles.paymentBadge, { backgroundColor: badgeBg }]}>
                <Text style={[styles.paymentBadgeText, { color: badgeText }]}>
                  {order.paymentMethod === 'tarjeta' ? '💳 Pagado' : '💵 Efectivo'}
                </Text>
              </View>
            )}
            {isReady && (
              <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.green} />
            )}
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsList}>
          {order.items.map((item) => (
            <View key={item.id} style={[styles.itemRow, item.ready && isInPrep && styles.itemRowReady]}>
              <Text style={[styles.itemName, item.ready && isInPrep && styles.itemNameReady]}>
                {item.quantity}x {item.name}
              </Text>
              {item.customization && <Text style={styles.itemCustomization}>{item.customization}</Text>}
              {isInPrep && (
                <MaterialCommunityIcons
                  name={item.ready ? 'check-circle' : 'circle-outline'}
                  size={20}
                  color={item.ready ? COLORS.green : COLORS.outlineVariant}
                />
              )}
            </View>
          ))}
        </View>

        {/* Botón de acción */}
        {!isReady && (
          <TouchableOpacity
            style={[styles.actionButton, isPending ? styles.actionButtonPending : styles.actionButtonReady]}
            onPress={() => (isPending ? handleStartPreparation(order.id) : handleMarkAsReady(order.id))}
            activeOpacity={0.85}
          >
            <Text style={isPending ? styles.actionButtonTextPending : styles.actionButtonTextReady}>
              {isPending ? '▶ Iniciar Preparación' : '✅ Marcar como listo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 🧩 RENDER: Columna Kanban
  const renderColumn = (title: string, status: OrderStatus, count: number, dotColor: string) => {
    const columnOrders = orders.filter((o) => o.status === status);

    return (
      <View style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={styles.columnTitle}>
            <View style={[styles.columnDot, { backgroundColor: dotColor }]} />
            <Text style={styles.columnTitleText}>{title}</Text>
          </View>
          <View style={[styles.columnBadge, { backgroundColor: `${dotColor}33` }]}>
            <Text style={[styles.columnBadgeText, { color: dotColor }]}>{count}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.columnContent}
          contentContainerStyle={styles.columnContentPadding}
          showsVerticalScrollIndicator={false}
        >
          {columnOrders.map((o) => renderOrderCard(o, status))}
          {columnOrders.length === 0 && (
            <View style={styles.emptyColumn}>
              <MaterialCommunityIcons name="clipboard-outline" size={40} color={COLORS.outlineVariant} />
              <Text style={styles.emptyColumnText}>Sin órdenes</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // Cálculos
  const pendingCount = orders.filter((o) => o.status === 'pendiente').length;
  const prepCount = orders.filter((o) => o.status === 'en_preparacion').length;
  const readyCount = orders.filter((o) => o.status === 'listo').length;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarTitle}>Cocina</Text>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{formatTime(currentTime)}</Text>
          </View>
        </View>

        <View style={styles.topBarRight}>
          <View style={styles.systemStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>En línea</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
            <MaterialCommunityIcons name="refresh" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── KANBAN BOARD ── */}
      <ScrollView
        horizontal
        style={styles.kanbanScroll}
        contentContainerStyle={styles.kanbanPadding}
        showsHorizontalScrollIndicator={false}
      >
        {renderColumn('Pendientes', 'pendiente', pendingCount, COLORS.amber)}
        {renderColumn('En preparación', 'en_preparacion', prepCount, COLORS.primary)}
        {renderColumn('Listos', 'listo', readyCount, COLORS.green)}
      </ScrollView>

      {/* ── DECORACIÓN ── */}
      <View style={styles.bgDecoration1} />
      <View style={styles.bgDecoration2} />
    </SafeAreaView>
  );
}

// 🎨 ESTILOS
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH * 0.32; // 3 columnas + padding lateral

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.outlineVariant}33`,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  topBarTitle: { fontSize: 28, fontWeight: '700', color: COLORS.primary, letterSpacing: -0.5 },
  timeBadge: { backgroundColor: COLORS.surfaceContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 },
  timeBadgeText: { fontSize: 16, fontWeight: '700', color: COLORS.onSurfaceVariant, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  systemStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.greenLight, borderRadius: 9999 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green },
  statusText: { fontSize: 14, fontWeight: '700', color: COLORS.greenText },
  iconButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },

  /* Kanban */
  kanbanScroll: { flex: 1 },
  kanbanPadding: { paddingHorizontal: 24, paddingVertical: 24, gap: 20 },

  /* Column */
  column: { width: COLUMN_WIDTH, backgroundColor: COLORS.surface, borderRadius: 20, overflow: 'hidden' },
  columnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: `${COLORS.outlineVariant}33` },
  columnTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  columnDot: { width: 14, height: 14, borderRadius: 7 },
  columnTitleText: { fontSize: 20, fontWeight: '700', color: COLORS.onSurface },
  columnBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  columnBadgeText: { fontSize: 14, fontWeight: '700' },
  columnContent: { flex: 1 },
  columnContentPadding: { padding: 16, gap: 16 },
  emptyColumn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyColumnText: { fontSize: 16, color: COLORS.onSurfaceVariant, textAlign: 'center' },

  /* Order Card */
  orderCard: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 20, padding: 24, shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 },
  orderCardDelivered: { opacity: 0.6 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  orderNumber: { fontSize: 28, fontWeight: '700', color: COLORS.onSurface, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 6 },
  orderNumberDelivered: { color: COLORS.green, textDecorationLine: 'line-through' },
  orderMeta: { fontSize: 14, color: COLORS.onSurfaceVariant, fontWeight: '500' },
  orderBadges: { alignItems: 'flex-end', gap: 8 },
  priorityBadge: { backgroundColor: COLORS.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 },
  paymentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  paymentBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  itemsList: { gap: 12, marginBottom: 24 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  itemRowReady: { backgroundColor: COLORS.surfaceContainerLow, borderLeftWidth: 4, borderLeftColor: COLORS.primaryContainer },
  itemName: { fontSize: 18, fontWeight: '600', color: COLORS.onSurface, flex: 1 },
  itemNameReady: { opacity: 0.7 },
  itemCustomization: { fontSize: 14, color: COLORS.onSurfaceVariant, marginLeft: 10, fontStyle: 'italic' },

  /* Action Buttons */
  actionButton: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  actionButtonPending: { backgroundColor: `${COLORS.primary}1A` },
  actionButtonReady: { backgroundColor: COLORS.primary },
  actionButtonTextPending: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  actionButtonTextReady: { fontSize: 18, fontWeight: '700', color: COLORS.onPrimary },

  /* Decorations */
  bgDecoration1: { position: 'absolute', top: '20%', right: -50, width: 400, height: 400, backgroundColor: `${COLORS.primary}06`, borderRadius: 9999 },
  bgDecoration2: { position: 'absolute', bottom: '15%', left: '20%', width: 280, height: 280, backgroundColor: `${COLORS.primary}06`, borderRadius: 9999 },
});