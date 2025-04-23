
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLanguage } from "./useLanguage";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  activate: string;
  block: string;
  country: string;
  credits: string;
  email: string;
  email_type: string;
  expiry_time: string;
  hwid: string;
  password: string;
  phone: string;
  start_date: string;
  uid: string;
  user_type: string;
  [key: string]: string; // Add index signature to resolve type issues
}

interface Operation {
  operation_id: string;
  operation_type: string;
  phone_sn: string;
  brand: string;
  model: string;
  imei: string;
  username: string;
  credit: string;
  time: string;
  status: string;
  android: string;
  baseband: string;
  carrier: string;
  security_patch: string;
  uid: string;
  hwid: string;
  log_operation: string;
}

// Variable to track if the success toast has been shown
let hasShownSuccessToast = false;

const fetchUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  // استخدم الرمز المميز للمصادقة
  supabase.auth.setSession({
    access_token: token,
    refresh_token: '',
  });
  
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw new Error("Failed to fetch users");
  
  // تنسيق البيانات لتناسب الواجهة الحالية
  return data.map(user => ({
    id: user.id,
    name: user.name || "",
    activate: user.activate || "Active",
    block: user.block || "Not Blocked",
    country: user.country || "",
    credits: user.credits || "0.0",
    email: user.email || "",
    email_type: user.email_type || "User",
    expiry_time: user.expiry_time || "",
    hwid: user.hwid || "Null",
    password: user.password || "",
    phone: user.phone || "",
    start_date: user.start_date || "",
    uid: user.uid || "",
    user_type: user.user_type || "Monthly License"
  }));
};

const fetchOperations = async (): Promise<Operation[]> => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  // استخدم الرمز المميز للمصادقة
  supabase.auth.setSession({
    access_token: token,
    refresh_token: '',
  });
  
  const { data, error } = await supabase
    .from('operations')
    .select('*');
  
  if (error) throw new Error("Failed to fetch operations");
  
  // تنسيق البيانات لتناسب الواجهة الحالية
  const operations = data.map(op => ({
    operation_id: op.id,
    operation_type: op.operation_type || "",
    phone_sn: op.phone_sn || "",
    brand: op.brand || "",
    model: op.model || "",
    imei: op.imei || "",
    username: op.username || "",
    credit: op.credit || "0.0",
    time: op.time || new Date().toISOString(),
    status: op.status || "Pending",
    android: op.android || "",
    baseband: op.baseband || "",
    carrier: op.carrier || "",
    security_patch: op.security_patch || "",
    uid: op.uid || "",
    hwid: op.hwid || "",
    log_operation: op.log_operation || ""
  }));

  // Format credit values to "0.0" if they're "0.00"
  operations.forEach(op => {
    if (op.credit === "0.00") {
      op.credit = "0.0";
    }
  });

  // Sort operations by time in descending order
  return operations.sort((a, b) => {
    const dateA = new Date(formatTimeString(a.time));
    const dateB = new Date(formatTimeString(b.time));
    return dateB.getTime() - dateA.getTime();
  });
};

// Helper function to format time strings
export const formatTimeString = (timeStr: string): string => {
  if (!timeStr) return "";
  
  // Convert Arabic AM/PM indicators to English
  const normalizedTime = timeStr
    .replace("-م", "-PM")
    .replace("-ص", "-AM");
  
  // Parse the date and format it
  try {
    const date = new Date(normalizedTime);
    return format(date, "yyyy/MM/dd hh:mm -aa");
  } catch {
    return timeStr;
  }
};

// Refund operation function - adapted for Supabase
export const refundOperation = async (operation: any): Promise<boolean> => {
  if (!operation) return false;
  
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  try {
    // Set auth token
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
    
    // The refund amount from the operation
    const refundAmountStr = operation.credit;
    const refundAmount = parseFloat(refundAmountStr) || 0;
    
    // Get current credits for the user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', operation.uid)
      .single();
    
    if (userError) throw new Error("Failed to get user credits");
    
    // Calculate new credits
    let currentCredit = 0;
    try {
      currentCredit = parseFloat(userData.credits.replace(/"/g, "")) || 0;
    } catch (e) {
      console.error("Error parsing credit:", e);
    }
    
    const newCredit = currentCredit + refundAmount;
    
    // Update user's credit
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredit.toString() + ".0" })
      .eq('id', operation.uid);
    
    if (updateError) throw new Error("Failed to update credits");
    
    // Update operation status and credit
    const { error: operationError } = await supabase
      .from('operations')
      .update({
        status: "Failed",
        credit: "0.0"
      })
      .eq('id', operation.operation_id);
    
    if (operationError) throw new Error("Failed to update operation");
    
    return true;
  } catch (error) {
    console.error("Error refunding operation:", error);
    return false;
  }
};

export const useSharedData = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: users = [], isLoading: isLoadingUsers, isSuccess: isUsersSuccess } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    meta: {
      onSuccess: () => {
        // Show success toast only once after data is first loaded
        if (!hasShownSuccessToast) {
          toast(t("fetchSuccessTitle") || "Success", {
            description: t("fetchSuccessDescription") || "Data loaded successfully"
          });
          hasShownSuccessToast = true;
        }
      }
    }
  });

  const { data: operations = [], isLoading: isLoadingOperations } = useQuery({
    queryKey: ['operations'],
    queryFn: fetchOperations,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  // Function to refresh data
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['operations'] });
  };

  // Add credit to user with the "0." format (corrected format)
  const addCreditToUser = async (userId: string, amount: number): Promise<boolean> => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;
    
    try {
      // Set auth token
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      // Find the user in the already loaded data
      const user = users.find(u => u.id === userId);
      if (!user) return false;
      
      // Calculate new credits with the "0." format
      const currentCredits = parseFloat(user.credits) || 0;
      const newCredits = currentCredits + amount;
      const formattedCredits = `${newCredits}.0`;
      
      // Update credits in Supabase
      const { error } = await supabase
        .from('users')
        .update({ credits: formattedCredits })
        .eq('id', userId);

      if (error) throw new Error("Failed to add credits");
      
      // Refresh users data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      return true;
    } catch (error) {
      console.error("Error adding credits:", error);
      return false;
    }
  };

  return {
    users,
    operations,
    isLoading: isLoadingUsers || isLoadingOperations,
    refreshData,
    addCreditToUser,
    refundOperation,
  };
};

// Export the language hook and translation functions
export { useLanguage } from './useLanguage';
