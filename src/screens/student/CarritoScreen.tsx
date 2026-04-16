// src/screens/student/CarritoScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ IMPORTANTE

// 🎨 COLORES
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
  outlineVariant: '#CCC3D8',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
};

// 📦 TIPOS
interface CartItem {
  id: string;
  productId: string;
  name: string;
  customization?: string;
  price: number;
  image: string;
  quantity: number;
}

// 👤 DATOS MOCK
const MOCK_USER = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiYbhjc1ns6Gfj8vCeUZPMB6xaUKfR7SnTIWROs4R250zdzJFjxKbOstCxmIxtqfFW-Q68A_0Z8Dd-DxLC_tzZX1xghG89-rDFlTCyvrs4eJXPce03H6nXuYFrECdk7h4Vg7EO4vk8UlNWnOvvGl-jL5NHOY3VojOjIjB4sVBDq874u15B_trXCM-gvuLKLKYiMUFR76UzxXdzuXYwtBH-TqBN4LRbHAt0llbARV5THGqeC82Lb2dDJOYjbBO2i7_Yy9ymlp_-X_k',
};

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    productId: '1',
    name: 'Torta de Lomo',
    customization: 'Sin cebolla',
    price: 75.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLBQBVkVG_A2E0NPs-DqXfHrY4_GJtu0QrGdhRKO6xdGmCZCLWNoKjVHSsLiwxHDShGpXKMS0ckh9RpFuL0p40o5smu0sHnOMKZVpf6YcWT2lS6UUb6wtfXH7U0PIkUl6uZ5qy92gZATpyNWMJF1jXbHQav5qjwc6FLM4EqjiTXPbcH4olFWlac0PP92Ng5f2Qs4dCfzOum2xBCbiQWG8HnZtUTqq_aB-rjlTJl8pLnBt6uTkUaqsTihNgGqYht-IJP_L6Wes9h_k',
    quantity: 1,
  },
];

const SERVICE_FEE = 0.00;
const ESTIMATED_TIME = '12 - 15 mins';

export default function CarritoScreen() {
  const navigation = useNavigation<any>(); // ✅ HOOK DE NAVEGACIÓN
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  // 🔧 CALCULOS
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SERVICE_FEE;

  // 🔧 HANDLERS
  const handleGoBack = () => navigation.goBack();

  const handleNotification = () => console.log('🔔 Ver notificaciones');

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega al menos un producto para continuar.');
      return;
    }
    console.log('💳 Navegando a Checkout con total:', total);
    // ✅ NAVEGACIÓN AL CHECKOUT PASANDO EL TOTAL
    navigation.navigate('Checkout', { total });
  };

  // 🧩 RENDER: Item del carrito
  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.customization && (
              <Text style={styles.itemCustomization}>{item.customization}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.id)}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
              <MaterialCommunityIcons name="minus" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
              <MaterialCommunityIcons name="plus" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <MaterialCommunityIcons name="cart-outline" size={64} color={COLORS.onSurfaceVariant} />
      <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyCartSubtitle}>Agrega productos del menú para comenzar tu pedido</Text>
      <TouchableOpacity style={styles.emptyCartButton} onPress={handleGoBack}>
        <Text style={styles.emptyCartButtonText}>Ver menú</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Mi Carrito</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotification}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
        </View>
      </View>

      {/* ── CONTENIDO ── */}
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollPadding}>
        {cartItems.length > 0 ? (
          <View style={styles.cartList}>{cartItems.map(renderCartItem)}</View>
        ) : (
          renderEmptyCart()
        )}

        {cartItems.length > 0 && (
          <>
            <View style={styles.editorialQuote}>
              <Text style={styles.quoteText}>"El combustible perfecto para tu próxima clase."</Text>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Resumen de compra</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cargo por servicio</Text>
                  <Text style={styles.summaryValue}>${SERVICE_FEE.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.infoText}>
                  Tiempo estimado de preparación: <Text style={styles.infoTextBold}>{ESTIMATED_TIME}</Text>
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTÓN FIJO: CONTINUAR AL PAGO ── */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleProceedToCheckout} // ✅ CONECTADO
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryContainer]}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutButtonText}>Continuar al pago</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.onPrimary} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: COLORS.surface },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topBarTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primary, letterSpacing: -0.5 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceContainer },
  scrollContent: { flex: 1 },
  scrollPadding: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 120 },
  cartList: { gap: 16 },
  cartItem: { flexDirection: 'row', gap: 16, backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 16, padding: 16, shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 4 },
  itemImage: { width: 96, height: 96, borderRadius: 12 },
  itemContent: { flex: 1, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface },
  itemCustomization: { fontSize: 14, color: COLORS.onSurfaceVariant, opacity: 0.8, marginTop: 2 },
  deleteButton: { padding: 4 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  itemPrice: { fontSize: 18, fontWeight: '500', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainer, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4, gap: 16 },
  quantityButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quantityValue: { fontSize: 16, fontWeight: '600', color: COLORS.onSurface, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  emptyCart: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 16 },
  emptyCartTitle: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface },
  emptyCartSubtitle: { fontSize: 14, color: COLORS.onSurfaceVariant, textAlign: 'center' },
  emptyCartButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: 12 },
  emptyCartButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.onPrimary },
  editorialQuote: { paddingVertical: 32, paddingHorizontal: 16, alignItems: 'center' },
  quoteText: { fontSize: 16, fontStyle: 'italic', color: COLORS.onSurfaceVariant, fontWeight: '300', textAlign: 'center' },
  summarySection: { marginTop: 8, gap: 16 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface, paddingHorizontal: 2 },
  summaryCard: { backgroundColor: COLORS.surfaceContainerLow, borderRadius: 16, padding: 24, gap: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: COLORS.onSurfaceVariant },
  summaryValue: { fontSize: 14, color: COLORS.onSurface, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  totalRow: { paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: `${COLORS.outlineVariant}33` },
  totalLabel: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface },
  totalValue: { fontSize: 20, fontWeight: '700', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: `${COLORS.secondary}0D`, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  infoText: { fontSize: 12, color: COLORS.onSurfaceVariant, flex: 1 },
  infoTextBold: { fontWeight: '700', color: COLORS.onSurface },
  bottomSpacer: { height: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: COLORS.surfaceContainerLowest, shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 8 },
  checkoutButton: { borderRadius: 16, overflow: 'hidden' },
  checkoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 24 },
  checkoutButtonText: { fontSize: 18, fontWeight: '700', color: COLORS.onPrimary },
});