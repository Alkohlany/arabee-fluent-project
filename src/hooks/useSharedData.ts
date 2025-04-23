import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLanguage } from "./useLanguage";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRow = Database['public']['Tables']['users']['Row'];
type OperationRow = Database['public']['Tables']['operations']['Row'];

interface User extends UserRow {
  [key: string]: string | null;
}

interface Operation extends OperationRow {
  operation_id: string;
  [key: string]: string | null;
}

// Variable to track if the success toast has been shown
let hasShownSuccessToast = false;

const fetchUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw new Error("Failed to fetch users");
  
  return data.map(user => ({
    ...user,
    operation_id: user.id,
  }));
};

const fetchOperations = async (): Promise<Operation[]> => {
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  const { data, error } = await supabase
    .from('operations')
    .select('*');
  
  if (error) throw new Error("Failed to fetch operations");

  return data.map(op => ({
    ...op,
    operation_id: op.id,
    credit: op.credit || "0.0"
  }));
};

// إضافة الرصيد للمستخدم
const addCreditToUser = async (userId: string, amount: number): Promise<boolean> => {
  const token = localStorage.getItem("userToken");
  if (!token) return false;
  
  try {
    // احصل على الرصيد الحالي
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError || !userData) return false;

    // احسب الرصيد الجديد
    const currentCredits = parseFloat(userData.credits || "0.0");
    const newCredits = (currentCredits + amount).toString() + ".0";

    // قم بتحديث الرصيد
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) return false;
    return true;
  } catch (error) {
    console.error("Error adding credits:", error);
    return false;
  }
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
  const addCreditToUser2 = async (userId: string, amount: number): Promise<boolean> => {
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

// Export the language hook
export { useLanguage } from './useLanguage';
