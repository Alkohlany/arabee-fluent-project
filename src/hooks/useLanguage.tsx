import { useState, useEffect, useCallback } from 'react';

interface TranslationKeys {
  pegasusTool: string;
  dashboard: string;
  users: string;
  operations: string;
  settings: string;
  welcome: string;
  logout: string;
  allRightsReserved: string;
  dashboardTitle: string;
  dashboardDescription: string;
  loadingData: string;
  totalUsers: string;
  monthlyLicense: string;
  creditsLicense: string;
  totalOperations: string;
  operationID: string;
  monthlyOperations: string;
  monthlyOperationsDesc: string;
  operationTypes: string;
  operationTypesDesc: string;
  licenseTypes: string;
  licenseTypesDesc: string;
  fetchSuccessTitle: string;
  fetchSuccessDescription: string;
  activeUsers: string;
  inactiveUsers: string;
  allUsers: string;
  name: string;
  email: string;
  country: string;
  userType: string;
  credits: string;
  actions: string;
  activate: string;
  block: string;
  edit: string;
  delete: string;
  search: string;
  createUser: string;
  editUser: string;
  saveChanges: string;
  cancel: string;
  areYouSureDelete: string;
  thisActionCantBeUndone: string;
  deleteUser: string;
  userDeletedSuccessfully: string;
  userCreatedSuccessfully: string;
  userUpdatedSuccessfully: string;
  errorDeletingUser: string;
  errorCreatingUser: string;
  errorUpdatingUser: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  unknown: string;
  count: string;
  refund: string;
  refundOperation: string;
  refundSuccess: string;
  refundFailed: string;
  addCredits: string;
  addCreditsToUser: string;
  creditsAddedSuccessfully: string;
  creditsAddFailed: string;
  operationsUsed: string;
  operationCountsInMonth: string;
  usersCountry: string;
}

const enTranslations: Record<keyof TranslationKeys, string> = {
  pegasusTool: "Pegasus Tool",
  dashboard: "Dashboard",
  users: "Users",
  operations: "Operations",
  settings: "Settings",
  welcome: "Welcome",
  logout: "Logout",
  allRightsReserved: "All Rights Reserved",
  dashboardTitle: "Dashboard Overview",
  dashboardDescription: "Statistics and insights at a glance",
  loadingData: "Loading data...",
  totalUsers: "Total Users",
  monthlyLicense: "Monthly License",
  creditsLicense: "Credits License",
  totalOperations: "Total Operations",
  operationID: "Operation ID",
  monthlyOperations: "Monthly Operations",
  monthlyOperationsDesc: "Monthly registered operations statistics",
  operationTypes: "Operation Types",
  operationTypesDesc: "Types breakdown",
  licenseTypes: "License Types",
  licenseTypesDesc: "License type user count comparison",
  fetchSuccessTitle: "Success",
  fetchSuccessDescription: "Data loaded successfully",
  activeUsers: "Active Users",
  inactiveUsers: "Inactive Users",
  allUsers: "All Users",
  name: "Name",
  email: "Email",
  country: "Country",
  userType: "User Type",
  credits: "Credits",
  actions: "Actions",
  activate: "Activate",
  block: "Block",
  edit: "Edit",
  delete: "Delete",
  search: "Search",
  createUser: "Create User",
  editUser: "Edit User",
  saveChanges: "Save Changes",
  cancel: "Cancel",
  areYouSureDelete: "Are you sure you want to delete this user?",
  thisActionCantBeUndone: "This action cannot be undone.",
  deleteUser: "Delete User",
  userDeletedSuccessfully: "User deleted successfully",
  userCreatedSuccessfully: "User created successfully",
  userUpdatedSuccessfully: "User updated successfully",
  errorDeletingUser: "Error deleting user",
  errorCreatingUser: "Error creating user",
  errorUpdatingUser: "Error updating user",
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
  unknown: "Unknown",
  count: "Count",
  refund: "Refund",
  refundOperation: "Refund Operation",
  refundSuccess: "Refund operation successful",
  refundFailed: "Refund operation failed",
  addCredits: "Add Credits",
  addCreditsToUser: "Add Credits to User",
  creditsAddedSuccessfully: "Credits added successfully",
  creditsAddFailed: "Failed to add credits",
  operationsUsed: "Operations Used",
  operationCountsInMonth: "Operation Counts In Month",
  usersCountry: "Users' Country",
};

const arTranslations: Record<keyof TranslationKeys, string> = {
  pegasusTool: "أداة بيغاسوس",
  dashboard: "لوحة التحكم",
  users: "المستخدمون",
  operations: "العمليات",
  settings: "الإعدادات",
  welcome: "مرحباً",
  logout: "تسجيل الخروج",
  allRightsReserved: "جميع الحقوق محفوظة",
  dashboardTitle: "نظرة عامة على لوحة التحكم",
  dashboardDescription: "إحصائيات ورؤى في لمحة",
  loadingData: "جارٍ تحميل البيانات...",
  totalUsers: "إجمالي المستخدمين",
  monthlyLicense: "ترخيص شهري",
  creditsLicense: "ترخيص الرصيد",
  totalOperations: "إجمالي العمليات",
  operationID: "معرف العملية",
  monthlyOperations: "العمليات الشهرية",
  monthlyOperationsDesc: "إحصائيات العمليات المسجلة شهريًا",
  operationTypes: "أنواع العمليات",
  operationTypesDesc: "تحليل الأنواع",
  licenseTypes: "أنواع التراخيص",
  licenseTypesDesc: "مقارنة عدد المستخدمين حسب نوع الترخيص",
  fetchSuccessTitle: "نجاح",
  fetchSuccessDescription: "تم تحميل البيانات بنجاح",
  activeUsers: "المستخدمون النشطون",
  inactiveUsers: "المستخدمون غير النشطين",
  allUsers: "جميع المستخدمين",
  name: "الاسم",
  email: "البريد الإلكتروني",
  country: "الدولة",
  userType: "نوع المستخدم",
  credits: "الرصيد",
  actions: "الإجراءات",
  activate: "تفعيل",
  block: "حظر",
  edit: "تعديل",
  delete: "حذف",
  search: "بحث",
  createUser: "إنشاء مستخدم",
  editUser: "تعديل مستخدم",
  saveChanges: "حفظ التغييرات",
  cancel: "إلغاء",
  areYouSureDelete: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
  thisActionCantBeUndone: "لا يمكن التراجع عن هذا الإجراء.",
  deleteUser: "حذف المستخدم",
  userDeletedSuccessfully: "تم حذف المستخدم بنجاح",
  userCreatedSuccessfully: "تم إنشاء المستخدم بنجاح",
  userUpdatedSuccessfully: "تم تحديث المستخدم بنجاح",
  errorDeletingUser: "خطأ في حذف المستخدم",
  errorCreatingUser: "خطأ في إنشاء المستخدم",
  errorUpdatingUser: "خطأ في تحديث المستخدم",
  jan: "يناير",
  feb: "فبراير",
  mar: "مارس",
  apr: "أبريل",
  may: "مايو",
  jun: "يونيو",
  jul: "يوليو",
  aug: "أغسطس",
  sep: "سبتمبر",
  oct: "أكتوبر",
  nov: "نوفمبر",
  dec: "ديسمبر",
  unknown: "غير معروف",
  count: "العدد",
  refund: "استرداد",
  refundOperation: "عملية استرداد",
  refundSuccess: "تمت عملية الاسترداد بنجاح",
  refundFailed: "فشلت عملية الاسترداد",
  addCredits: "إضافة رصيد",
  addCreditsToUser: "إضافة رصيد للمستخدم",
  creditsAddedSuccessfully: "تمت إضافة الرصيد بنجاح",
  creditsAddFailed: "فشل إضافة الرصيد",
  operationsUsed: "العمليات المستخدمة",
  operationCountsInMonth: "عدد العمليات في الشهر",
  usersCountry: "بلدان المستخدمين",
};

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof TranslationKeys) => string;
  isRTL: boolean;
}

const LanguageContext = React.createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [language, isRTL]);

  const t = useCallback(
    (key: keyof TranslationKeys) => {
      const translations = language === 'ar' ? arTranslations : enTranslations;
      return translations[key] || key;
    },
    [language]
  );

  const value: LanguageContextProps = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
