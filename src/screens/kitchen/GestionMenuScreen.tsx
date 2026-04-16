// src/screens/kitchen/GestionMenuScreen.tsx
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
  FlatList,
  Switch,
  Modal,
  Platform,
  Alert,
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
  surfaceContainerHigh: '#E7E8E9',
  surfaceContainerHighest: '#E1E3E4',
  outlineVariant: '#CCC3D8',
  error: '#BA1A1A',
};

// 📦 TIPOS
interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

// 👤 DATOS MOCK (luego vendrán de menu-service)
const STAFF_USER = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmiG88SxySUjWxbz4M_SzL1Sos_uEjtXufO_NlPgdaZx8Etf4jfF5bow7OLvsBPdBew0BPhu4w134MklELWRFiTkr8V47KD1dDY3xwBeq5hZGV59SXbh0bxGKX0If_vmBCSOAINfg3FZ9TBo974nP_wto6j72tbir-BJxVIRHEciMAN4IygqIedEUGtkNx2aAldT-D_0wM2TMtIODxooSR_AIN17y0eciRMgY603vyW5R5rH3XqN0PKMUUfu_siewVCbbvbU-84T8',
};

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos' },
  { id: 'breakfast', name: 'Desayunos' },
  { id: 'drinks', name: 'Bebidas' },
  { id: 'snacks', name: 'Snacks' },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Chilaquiles Verdes',
    price: 65.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwKopbWRYsfvZDMbLOPY_p76C0IPCb2UCBQfOOfPsQmE1oWGF9f8eX9NBSSrPKwytL4qaNCFWqXwcPbC_lHxluXAQd6AAyzvWNU3y-32s82xVPTazsJJdJXntE8TAjvE6MeizFdxXw0eh3OfHMF47spYqLkU0KQB0hpo2reS6gUYFTI26cTY-RyMg11Le6ZzRNpAO0wKza-5l3rbDl2qs7BnqlBqzqoUK0s29OayMlBM77vHepbu1Ugo18VL7HpXfwklpt1TKu1oc',
    category: 'breakfast',
    available: true,
    description: 'Totopos con salsa verde, crema y queso',
  },
  {
    id: '2',
    name: 'Molletes Sencillos',
    price: 45.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvgTo6YFY4l9ODxMnpz494pG-el4z6VJUhTjLB0hBJsrcqk3dESHTQIEMUafSw59wfoEpG21yovUuaqTCW883nlPaVyqRU6HDDueMv9BbLOXoFzVYgc00M6FmQFTXCCMCKYdeJHuMwuJoxWKvnAU7I1htNTp5xZsNSQd8R7cdEdQcSEay6bdHV_HYYs-qWilTdhMXP9PkmXBaz7YtEubI-01h-5lHv1rB9KypitHdUaWrICTlpx7xJ3jL_QCjYfDVii3GnrlOx1EY',
    category: 'breakfast',
    available: true,
  },
  {
    id: '3',
    name: 'Baguette de Pavo',
    price: 78.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AAazidBswQS0ijlEkDtxLH7V_DcK4JJqLB5dW1SZQHZGgvjOxSHE-fAJf2aXLoLv8ZBlq9XotP60YsiE2r6TQoItxTj4lasky90bGfkY6PBfhFCoWy72RRWKf9XuAyvgI4sALrAEiAcQ83HetB0pRN1uFPSwkeNle4gSfiPTHxrzPBr-xff9rfemz1EDhSUXCdYleuM3WYwtl1J0b8fltwg5_un78xDhDeJswo3wcCjq3mRTBE90URM1PvsWDwHJ_Do-RT8ALCQ',
    category: 'snacks',
    available: false, // Agotado
  },
  {
    id: '4',
    name: 'Café Americano',
    price: 32.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT9KrdxeeXaoXLYcrd0RMoEzjXK_0wzhti3n18xhgVlPZDgoFZInwAhz6nVhF0CGfIKP444LQw5i-egPuxc-XxOFf_YatBIm3nlDdi0dgjBY0OgoOOA205C2u3tr3hoszbHBuOQmyRCc5zqcCgIzHN0hp-wHG_a3bQHWBQf73Lzi3ugBzEgvY0TF3o2_I0bIUJkPuoNY-QW43BRTWFqc4L8Q4SX2VyxX346KFkj0LJxJsPmUNeYQDTtYYgoZpDzqs48mwmSJwnbRY',
    category: 'drinks',
    available: true,
  },
];

export default function GestionMenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // 🔧 HANDLERS
  const handleNotification = () => {
    console.log('🔔 Ver notificaciones');
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
    const item = menuItems.find((i) => i.id === itemId);
    console.log(`🔄 ${item?.name}: ${item?.available ? 'Desactivado' : 'Activado'}`);
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('✏️ Editar:', item.name);
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = (item: MenuItem) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de eliminar "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
            console.log('🗑️ Eliminado:', item.name);
          },
        },
      ]
    );
  };

  const handleAddItem = () => {
    console.log('➕ Agregar nuevo producto');
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleSaveItem = (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      // Update existing
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        )
      );
      console.log('✏️ Actualizado:', editingItem.name);
    } else {
      // Create new
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: itemData.name || 'Nuevo Producto',
        price: itemData.price || 0,
        image: itemData.image || '',
        category: itemData.category || 'breakfast',
        available: true,
        ...itemData,
      };
      setMenuItems((prev) => [...prev, newItem]);
      console.log('➕ Creado:', newItem.name);
    }
    setModalVisible(false);
  };

  // 🧩 RENDER: Category Pill
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

  // 🧩 RENDER: Product Card
  const renderMenuItem = (item: MenuItem) => {
    const isAvailable = item.available;

    return (
      <View key={item.id} style={[styles.productCard, !isAvailable && styles.productCardDisabled]}>
        {/* Imagen */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={[styles.productImage, !isAvailable && styles.productImageDisabled]}
            resizeMode="cover"
          />
          {!isAvailable && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>Agotado</Text>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={styles.productContent}>
          <View style={styles.productHeader}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEditItem(item)}
                accessibilityLabel={`Editar ${item.name}`}
              >
                <MaterialCommunityIcons name="pencil" size={20} color={COLORS.onSurfaceVariant} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDeleteItem(item)}
                accessibilityLabel={`Eliminar ${item.name}`}
              >
                <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.toggleContainer}>
              <Switch
                value={item.available}
                onValueChange={() => handleToggleAvailability(item.id)}
                trackColor={{ false: COLORS.surfaceContainerHighest, true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : COLORS.onPrimary}
                ios_backgroundColor={COLORS.surfaceContainerHighest}
              />
              <Text style={styles.toggleLabel}>{item.available ? 'On' : 'Off'}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Filtrar por categoría
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

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
          <Text style={styles.topBarTitle}>Gestión de Menú</Text>
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.inventoryLabel}>Inventario Actual</Text>
          <Text style={styles.headerTitle}>Control de Platillos</Text>
          
          {/* Category Pills */}
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryPill}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Product List */}
        <View style={styles.productList}>
          {filteredItems.map(renderMenuItem)}
        </View>

        {/* Espacio para FAB y bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── FAB: Agregar Producto ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddItem}
        accessibilityLabel="Agregar nuevo producto"
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryContainer]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name="plus" size={28} color={COLORS.onPrimary} />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── BOTTOM NAVIGATION BAR ── */}
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffHome')}>
            <MaterialCommunityIcons name="home-outline" size={24} color={COLORS.onSurface} />
            <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.popToTop()}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={COLORS.primary} />
            <Text style={styles.navLabelActive}>Menú</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Estadisticas')}>
            <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.onSurface} />
            <Text style={styles.navLabel}>Panel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffPerfil')}>
            <MaterialCommunityIcons name="account-outline" size={24} color={COLORS.onSurface} />
            <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
        </View>
      {/* ── MODAL: Agregar/Editar Producto ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre del producto"
              placeholderTextColor={COLORS.outlineVariant}
              defaultValue={editingItem?.name}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Precio ($)"
              placeholderTextColor={COLORS.outlineVariant}
              keyboardType="decimal-pad"
              defaultValue={editingItem?.price.toString()}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextarea]}
              placeholder="Descripción (opcional)"
              placeholderTextColor={COLORS.outlineVariant}
              multiline
              numberOfLines={3}
              defaultValue={editingItem?.description}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={() => handleSaveItem({})}
              >
                <Text style={styles.modalButtonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    paddingHorizontal: 16,
    paddingTop: 100, // Espacio para top bar
    paddingBottom: 140, // Espacio para FAB + bottom nav
  },

  /* Header Section */
  headerSection: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  inventoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.onSurface,
    letterSpacing: -1,
    marginBottom: 16,
  },

  /* Category Pills */
  categoriesContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  categoryPillTextActive: {
    color: COLORS.onPrimary,
    fontWeight: '600',
  },

  /* Product List */
  productList: {
    gap: 16,
  },
  productCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  productCardDisabled: {
    opacity: 0.75,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceContainer,
    flexShrink: 0,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageDisabled: {
    opacity: 0.5,
  },
  soldOutOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(25, 28, 29, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  productContent: {
    flex: 1,
    minWidth: 0,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* Bottom Spacer */
  bottomSpacer: { height: 24 },

  /* FAB */
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 88, // Por encima del bottom nav
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 20,
  },
  fabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    transform: [{ scale: 1.05 }],
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

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.onSurface,
  },
  modalTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  modalButtonSave: {
    backgroundColor: COLORS.primary,
  },
  modalButtonTextCancel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  modalButtonTextSave: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onPrimary,
  },
});