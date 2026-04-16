// src/types/index.ts

// 👤 Estudiante
export type StudentTabParamList = {
  Home: undefined;
  Menu: undefined;
  Perfil: undefined;
};

export type StudentStackParamList = {
  StudentTabs: undefined;
  DetalleProducto: { productId: string; productName?: string };
  Carrito: undefined;
  Checkout: { total: number };
  Seguimiento: { orderId: string };
};

// 👨‍🍳 Staff
export type StaffStackParamList = {
  StaffHome: undefined;
  KDS: undefined;
  GestionMenu: undefined;
  Estadisticas: undefined;
  StaffPerfil: undefined;
};

// 🔐 Root (autenticación)
export type RootStackParamList = {
  Splash: undefined;
  LoginEstudiante: undefined; // Google SSO
  LoginPersonal: undefined;   // Email/Password
  StudentStack: undefined;
  StaffStack: undefined;
};

// 🎯 Tipo global para useNavigation
export type NavigationProp = {
  navigate<RouteName extends keyof RootStackParamList>(
    route: RouteName,
    params?: RootStackParamList[RouteName]
  ): void;
  goBack(): void;
  popToTop(): void;
};