// src/screens/student/DetalleProductoScreen.tsx
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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ IMPORTANTE

// 🎨 COLORES (consistente con el resto de la app)
const COLORS = {
  primary: '#630ED4',
  primaryContainer: '#7C3AED',
  surface: '#F8F9FA',
  onSurface: '#191C1D',
  onSurfaceVariant: '#4A4455',
  onPrimary: '#FFFFFF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainer: '#EDEEEF',
  surfaceContainerHigh: '#E0E1E2',
  outline: '#7B7487',
  outlineVariant: '#CCC3D8',
  tertiary: '#7D3D00',
};

// 📦 PRODUCTO: Chilaquiles Verdes (ejemplo del menú)
const PRODUCT = {
  id: '1',
  name: 'Chilaquiles Verdes',
  description: 'Totopos crujientes bañados en salsa verde tatemada, crema de rancho y queso fresco.',
  basePrice: 65.00,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxoj5Mk9NmVlotomRnJ6mTaZk_aJ2WduuAe0ZFAvUqpxhTZzfRTc7omWIPNaLVZ0qzo2LgA4eJxuGTJvc4tPWBSp_oOHxIOzByJjbYh36f6AVgEUG0uU4LMondGDcvlvSsuYhgmQ8XDKmVz6kJPPSXtVzZ_tlCdlmv-vtDbrVpYViGWO9qm9gWB56gM6rOIc6agz8JzmgNr02NE_1CBq3FLfr9OiMx-BfUExi73qtTDmzRoESkALbAGqrvGQbdMgLkkSTfJyeND8E',
  category: 'Desayunos',
};

// 🧀 EXTRAS DISPONIBLES
interface ExtraOption {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

const EXTRAS: ExtraOption[] = [
  { id: '1', name: 'Queso extra', price: 10.00, selected: false },
  { id: '2', name: 'Tocino', price: 15.00, selected: false },
  { id: '3', name: 'Pollo deshebrado', price: 20.00, selected: false },
];

const MAX_INSTRUCTIONS_LENGTH = 140;

export default function DetalleProductoScreen() {
  const navigation = useNavigation<any>(); // ✅ HOOK DE NAVEGACIÓN
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<ExtraOption[]>(EXTRAS);
  const [instructions, setInstructions] = useState('');

  // Calcular precio total dinámico
  const extrasTotal = extras
    .filter((extra) => extra.selected)
    .reduce((sum, extra) => sum + extra.price, 0);
  
  const totalPrice = (PRODUCT.basePrice + extrasTotal) * quantity;

  // 🔧 HANDLERS
  const handleToggleExtra = (extraId: string) => {
    setExtras((prev) =>
      prev.map((extra) =>
        extra.id === extraId ? { ...extra, selected: !extra.selected } : extra
      )
    );
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log('🛒 Agregar al carrito:', {
      product: PRODUCT.name,
      quantity,
      extras: extras.filter((e) => e.selected).map((e) => e.name),
      instructions: instructions.trim() || 'Ninguna',
      total: totalPrice,
    });
    // TODO: useCartStore.getState().addItem(...)
    
    // ✅ NAVEGAR AL CARRITO
    navigation.navigate('Carrito');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderExtraOption = (extra: ExtraOption) => (
    <TouchableOpacity
      key={extra.id}
      style={[styles.extraCard, extra.selected && styles.extraCardSelected]}
      onPress={() => handleToggleExtra(extra.id)}
      activeOpacity={0.8}
    >
      <View style={styles.extraContent}>
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, extra.selected && styles.checkboxChecked]}>
            {extra.selected && (
              <MaterialCommunityIcons name="check" size={14} color={COLORS.onPrimary} />
            )}
          </View>
          <Text style={styles.extraName}>{extra.name}</Text>
        </View>
        <Text style={styles.extraPrice}>+${extra.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── HEADER: IMAGEN + BACK BUTTON ── */}
      <View style={styles.header}>
        <Image
          source={{ uri: PRODUCT.image }}
          style={styles.productImage}
          resizeMode="cover"
          accessibilityLabel={PRODUCT.name}
        />
        
        {/* Overlay degradado para contraste */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'transparent']}
          style={styles.imageOverlay}
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          accessibilityLabel="Volver al menú"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Información del producto */}
        <View style={styles.productInfo}>
          <View style={styles.productText}>
            <Text style={styles.productName}>{PRODUCT.name}</Text>
            <Text style={styles.productDescription}>{PRODUCT.description}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${PRODUCT.basePrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sectionSpacer} />

        {/* Extras (Opcionales) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Extras</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalBadgeText}>Opcional</Text>
            </View>
          </View>
          
          <View style={styles.extrasList}>
            {extras.map(renderExtraOption)}
          </View>
        </View>

        <View style={styles.sectionSpacer} />

        {/* Observaciones / Instrucciones especiales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones o instrucciones especiales</Text>
          <View style={styles.textareaContainer}>
            <TextInput
              style={styles.textarea}
              placeholder="Ej. sin cebolla, salsa aparte, extra servilletas..."
              placeholderTextColor={`${COLORS.onSurfaceVariant}80`}
              value={instructions}
              onChangeText={(text) => {
                if (text.length <= MAX_INSTRUCTIONS_LENGTH) {
                  setInstructions(text);
                }
              }}
              multiline
              maxLength={MAX_INSTRUCTIONS_LENGTH}
            />
            <Text style={styles.charCounter}>
              {instructions.length}/{MAX_INSTRUCTIONS_LENGTH}
            </Text>
          </View>
        </View>

        <View style={styles.sectionSpacer} />

        {/* Selector de cantidad */}
        <View style={styles.quantitySection}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleDecrement}
            accessibilityLabel="Disminuir cantidad"
          >
            <MaterialCommunityIcons name="minus" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityValue}>{quantity}</Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, styles.quantityButtonAdd]}
            onPress={handleIncrement}
            accessibilityLabel="Aumentar cantidad"
          >
            <MaterialCommunityIcons name="plus" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Espacio para el botón fijo inferior */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTÓN FIJO INFERIOR: AGREGAR AL CARRITO ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={0.9}
          accessibilityLabel={`Agregar ${PRODUCT.name} al carrito por $${totalPrice.toFixed(2)}`}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryContainer]}
            style={styles.addButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addButtonText}>
              Agregar al carrito - ${totalPrice.toFixed(2)}
            </Text>
          </LinearGradient>
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

  /* Header con imagen */
  header: {
    height: 353,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.surfaceContainerLowest}E6`,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Contenido principal */
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // Espacio para footer fijo
  },

  /* Info del producto */
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  productText: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
  },
  priceBadge: {
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  sectionSpacer: {
    height: 32,
  },

  /* Secciones */
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  optionalBadge: {
    backgroundColor: `${COLORS.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  optionalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* Extras */
  extrasList: {
    gap: 12,
  },
  extraCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.outlineVariant,
  },
  extraCardSelected: {
    backgroundColor: `${COLORS.primary}1A`,
    borderColor: COLORS.primary,
  },
  extraContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  extraName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.onSurface,
  },
  extraPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  /* Textarea de observaciones */
  textareaContainer: {
    position: 'relative',
  },
  textarea: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.onSurface,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCounter: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 10,
    fontWeight: '500',
    color: `${COLORS.onSurfaceVariant}66`,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  /* Selector de cantidad */
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 16,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonAdd: {
    backgroundColor: `${COLORS.primaryContainer}1A`,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onSurface,
    width: 32,
    textAlign: 'center',
  },

  /* Espacio para footer */
  bottomSpacer: {
    height: 24,
  },

  /* Footer fijo */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: `${COLORS.surface}CC`,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ✅ ESTILO QUE FALTABA - AGREGADO AQUÍ:
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
});