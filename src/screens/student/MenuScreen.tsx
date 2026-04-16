// src/screens/student/MenuScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 🎨 PALETA DE COLORES (Completa y verificada)
const COLORS = {
  primary: '#630ED4',
  primaryContainer: '#7C3AED',
  secondaryContainer: '#8B4EF7',
  surface: '#F8F9FA',
  onSurface: '#191C1D',
  onSurfaceVariant: '#4A4455',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#EDE0FF',
  surfaceContainer: '#EDEEEF',
  surfaceContainerLow: '#F3F4F5',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerHigh: '#E7E8E9',
  surfaceContainerHighest: '#E1E3E4',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  outline: '#7B7487',
  outlineVariant: '#CCC3D8',
};

// 📦 TIPOS DE DATOS
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: string;
  requiresCustomization: boolean; // ¿Necesita pantalla de detalle?
  hasExtras?: boolean;
}

interface Category {
  id: string;
  name: string;
}

// 👤 DATOS MOCK (Simulan respuesta de MenuService)
const MOCK_USER = {
  name: 'Brian',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALAPuwY3-n1BQxnu8Ef8e2tYdWb-HQmveE10OL-BHGGu8wTALGGjZAsPNrz_vauF8TCYpPAdtuOneiq2bCQU3i6EHnvFq6d0JiqczboGxfEuI9I1fe0oLYY1TvzUxUxhe6yNhaQRnqlYWLwCweNarWJalVb7-3VsdJdry-25y21IQML6Zph-lw2UNqYB0DTn5TsVNiBNkI2fvcgDdLTRSqGHUvN-2_WlPkOBKuVDPSk5rOcYBMLfsR1gA7tJAA-g18yMqjPb6xGEY',
};

const CATEGORIES: Category[] = [
  { id: '1', name: 'Desayunos' },
  { id: '2', name: 'Comidas' },
  { id: '3', name: 'Botanas' },
  { id: '4', name: 'Bebidas' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chilaquiles Verdes',
    description: 'Totopos crujientes bañados en salsa verde tatemada, crema de rancho y queso fresco.',
    price: 65.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxoj5Mk9NmVlotomRnJ6mTaZk_aJ2WduuAe0ZFAvUqpxhTZzfRTc7omWIPNaLVZ0qzo2LgA4eJxuGTJvc4tPWBSp_oOHxIOzByJjbYh36f6AVgEUG0uU4LMondGDcvlvSsuYhgmQ8XDKmVz6kJPPSXtVzZ_tlCdlmv-vtDbrVpYViGWO9qm9gWB56gM6rOIc6agz8JzmgNr02NE_1CBq3FLfr9OiMx-BfUExi73qtTDmzRoESkALbAGqrvGQbdMgLkkSTfJyeND8E',
    available: true,
    category: 'Desayunos',
    requiresCustomization: true,
    hasExtras: true,
  },
  {
    id: '2',
    name: 'Bagel de Huevo y Aguacate',
    description: 'Huevo estrellado a la perfección con láminas de aguacate Hass en pan artesanal.',
    price: 55.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCNvD9fJlHOV0COcs3uY4JDoSqinn9G6OBWkcIvLiNGWAlEUnJdo9mM9fX1rrVUbPwBspHuP6D005gZUx7rCBJ_6ZIESXqIcUlfs4NkHlYRA-2CfkuM0Jma78RDtc5G7T-EjY9X1Y280MzH6-wTxF5yOsXPn5x9afvzvMTH_daBQg2VXNOasNqXA0QOktLJAd0h6nhYq2K6oWZknZQgW4tg_5BJc9-Qn6jrm-NIQQ6yLTUDKN67_SiDiakZnGm9yzRbpsRwmCKmYM',
    available: true,
    category: 'Desayunos',
    requiresCustomization: false,
  },
  {
    id: '3',
    name: 'Cuernito de Chocolate',
    description: 'Croissant de mantequilla relleno de ganache de chocolate belga 70% cacao.',
    price: 38.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVH8N0IBzjsY6BVs32DbN2QNRcFROedd3bieFOf2SE2DMg5pmt_T0-uqAc45V6z5aJeP5DMUBD4fHqnX7S1ScyBqcV-_1luoW9tWDPFgQXOoHyp_Vr9WnDrsk_zjEhB4zPYHvd6xyvmpn5J_onv5LQ4m1ubMzc3aX_PwRTkds7fmtoW0nhD5zTIIA-ck1a2z-FbuBnH0688Pw4DaNj3ltoXn37b6CSQpFK_-G1VwKghDxVUA_9ZecCKctHhjHuSuiDVsGIIeoDQ34',
    available: false,
    category: 'Botanas',
    requiresCustomization: false,
  },
  {
    id: '4',
    name: 'Bowl Académico',
    description: 'Mezcla energética de quinoa, garbanzos rostizados, espinaca y aderezo tahini.',
    price: 72.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkCOtcnuePaxUsOWK-rr1bl8z5il00X0Y7bDGmHb-JpMNaLy2WYnVHg5CAP3vW2iSeaiCX2Wbf53RmGl-GeEJYO6GkL6qkiDLg-9jqGM6GVGbD9NKdwveUVau1FosPnZ0bW_8Vrm64N9bqXQCzSV_LHXsJumZNrnCPJNUXnQf5wIvpDZW4WcWusmikkgMo-72Tf_eVvqFxf0Eb8o9C5DUNiXYmKXbXkiS1NceCBZWFRoyiyAFVNsy06wUbQrB1J33sMlLSWmjcJg',
    available: true,
    category: 'Comidas',
    requiresCustomization: true,
    hasExtras: true,
  },
];

export default function MenuScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');

  // 🔧 HANDLERS
  const handleSearch = (text: string) => setSearchQuery(text);

  const handleQuickAdd = (product: Product) => {
    // Agregar directo al carrito (lógica con Zustand)
    console.log('🛒 Quick Add:', product.name);
  };

  const handleViewDetails = (product: Product) => {
    navigation.navigate('DetalleProducto', { 
      productId: product.id,
      productName: product.name // opcional, para optimismo en UI
    });
  };

  const handleNotification = () => {
    console.log('🔔 Abrir notificaciones');
  };

  // 🧩 RENDERERS
  const renderCategoryPill = ({ item }: { item: Category }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryPill, isActive && styles.categoryPillActive]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.8}
      >
        <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductCard = (product: Product) => {
    const isAvailable = product.available;

    return (
      <TouchableOpacity
        key={product.id}
        style={[styles.productCard, !isAvailable && styles.productCardDisabled]}
        disabled={!isAvailable}
        activeOpacity={isAvailable ? 0.9 : 1}
        onPress={() => {
          if (isAvailable) {
            if (product.requiresCustomization) {
              handleViewDetails(product);
            } else {
              handleQuickAdd(product);
            }
          }
        }}
      >
        {/* Imagen */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
          
          {/* Badges de estado */}
          {isAvailable ? (
            <View style={styles.availabilityBadge}>
              <Text style={styles.availabilityBadgeText}>Disponible</Text>
            </View>
          ) : (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>Agotado</Text>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={[styles.productContent, !isAvailable && styles.productContentDisabled]}>
          <View style={styles.productHeader}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[styles.productPrice, !isAvailable && styles.productPriceDisabled]}>
              ${product.price.toFixed(2)}
            </Text>
          </View>
          
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>

          {isAvailable ? (
            <View style={styles.actionButtons}>
              {/* Botón Principal */}
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  product.requiresCustomization 
                    ? handleViewDetails(product) 
                    : handleQuickAdd(product);
                }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name={product.requiresCustomization ? 'pencil' : 'cart-plus'} 
                  size={18} 
                  color={COLORS.onPrimary} 
                />
                <Text style={styles.primaryActionText}>
                  {product.requiresCustomization ? 'Personalizar' : 'Agregar al carrito'}
                </Text>
              </TouchableOpacity>

              {/* Botón Secundario (solo si requiere personalización) */}
              {product.requiresCustomization && (
             <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={(e) => {
                e.stopPropagation();
                handleQuickAdd(product);
                }}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="cart-plus" size={18} color={COLORS.onSurfaceVariant} />
                <Text style={styles.secondaryActionText}>Agregar al carrito</Text>
            </TouchableOpacity>
            )}
            </View>
          ) : (
            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>No disponible</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 🔍 FILTRADO BÁSICO (Mock)
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = product.category === CATEGORIES.find(c => c.id === selectedCategory)?.name;
    return matchesSearch && (selectedCategory === '1' || matchesCategory);
  });

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── TOP APP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: MOCK_USER.avatar }}
            style={styles.avatar}
            accessibilityLabel="Foto de perfil"
          />
          <Text style={styles.cafeteriaName}>YaTa</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleNotification}
          accessibilityLabel="Notificaciones"
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENIDO SCROLLABLE ── */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué se te antoja hoy?"
            placeholderTextColor={`${COLORS.onSurfaceVariant}99`}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Categorías Horizontales */}
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryPill}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Header de Sección */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menú del Día</Text>
          <View style={styles.varietiesBadge}>
            <Text style={styles.varietiesBadgeText}>48 Variedades</Text>
          </View>
        </View>

        {/* Grid de Productos */}
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => renderProductCard(product))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log('🏠 Inicio')}>
          <MaterialCommunityIcons name="home-outline" size={24} color={COLORS.onSurface} />
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive} onPress={() => console.log('🍽️ Menú')}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.primary} />
          <Text style={styles.navLabelActive}>Menú</Text>
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
  container: { flex: 1, backgroundColor: COLORS.surface },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceContainer },
  cafeteriaName: { fontSize: 20, fontWeight: '700', color: COLORS.primary, letterSpacing: -0.5 },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  /* Scroll */
  scrollContent: { flex: 1 },
  scrollPadding: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 100 },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.onSurface, padding: 0 },

  /* Categories */
  categoriesContainer: { gap: 12, paddingVertical: 4, marginBottom: 24 },
  categoryPill: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 9999, backgroundColor: COLORS.surfaceContainerHigh },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryPillText: { fontSize: 14, fontWeight: '500', color: COLORS.onSurfaceVariant },
  categoryPillTextActive: { color: COLORS.onPrimary, fontWeight: '600' },

  /* Section Header */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingTop: 8 },
  sectionTitle: { fontSize: 28, fontWeight: '700', color: COLORS.onSurface, letterSpacing: -1 },
  varietiesBadge: { backgroundColor: `${COLORS.primary}1A`, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  varietiesBadgeText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },

  /* Product Grid */
  productGrid: { gap: 24, paddingBottom: 24 },
  productCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  productCardDisabled: { opacity: 0.6 },
  productImageContainer: { height: 192, position: 'relative', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  availabilityBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: `${COLORS.primaryContainer}E6`,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  availabilityBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1 },
  soldOutOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(25, 28, 29, 0.4)', alignItems: 'center', justifyContent: 'center' },
  soldOutText: { fontSize: 14, fontWeight: '700', color: COLORS.onError, backgroundColor: COLORS.error, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 9999, textTransform: 'uppercase', letterSpacing: 1 },
  productContent: { padding: 20, gap: 12 },
  productContentDisabled: { opacity: 0.6 },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface, flex: 1, marginRight: 8 },
  productPrice: { fontSize: 18, fontWeight: '500', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  productPriceDisabled: { color: COLORS.onSurface },
  productDescription: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 20 },

  /* Action Buttons */
  actionButtons: { gap: 8, marginTop: 8 },
  primaryActionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 16 },
  primaryActionText: { fontSize: 14, fontWeight: '700', color: COLORS.onPrimary, letterSpacing: 0.5 },
  secondaryActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: COLORS.outlineVariant,
  },
  secondaryActionText: { fontSize: 13, fontWeight: '500', color: COLORS.onSurfaceVariant },
  disabledButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceContainerHighest, paddingVertical: 12, borderRadius: 16 },
  disabledButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.onSurfaceVariant },

  /* Bottom */
  bottomSpacer: { height: 24 },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 8, paddingTop: 12,
    backgroundColor: `${COLORS.surface}CC`,
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
    shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 8,
  },
  navItem: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 24, opacity: 0.6 },
  navItemActive: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 24, backgroundColor: `${COLORS.primary}1A`, borderRadius: 12, transform: [{ scale: 1.1 }] },
  navLabel: { fontSize: 12, fontWeight: '500', color: COLORS.onSurface, marginTop: 4 },
  navLabelActive: { fontSize: 12, fontWeight: '500', color: COLORS.primary, marginTop: 4 },
});