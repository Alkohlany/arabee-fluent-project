import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLanguage } from "./useLanguage";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  Name: string;
  Activate: string;
  Block: string;
  Country: string;
  Credits: string;
  Email: string;
  Email_Type: string;
  Expiry_Time: string;
  Hwid: string;
  Password: string;
  Phone: string;
  Start_Date: string;
  UID: string;
  User_Type: string;
  [key: string]: string; // Add index signature to resolve type issues
}

interface Operation {
  OprationID: string;
  OprationTypes: string;
  Phone_SN: string;
  Brand: string;
  Model: string;
  Imei: string;
  UserName: string;
  Credit: string;
  Time: string;
  Status: string;
  Android: string;
  Baseband: string;
  Carrier: string;
  Security_Patch: string;
  UID: string;
  Hwid: string;
  LogOpration: string;
}

// Variable to track if the success toast has been shown
let hasShownSuccessToast = false;

const fetchUsers = async (token: string | null): Promise<User[]> => {
  if (!token) throw new Error("No authentication token");
  
  const response = await fetch(
    `https://pegasus-tool-database-default-rtdb.firebaseio.com/users.json?auth=${token}`
  );
  
  if (!response.ok) throw new Error("Failed to fetch users");
  
  const data = await response.json();
  return data ? Object.entries(data).map(([id, value]: [string, any]) => ({
    id,
    ...value
  })) : [];
};

const fetchOperations = async (): Promise<Operation[]> => {
  const response = await fetch(
    "https://pegasus-tool-api-operations-default-rtdb.firebaseio.com/Operations.json?auth=wDgquXfCPyqdYqFYC1Vc8kQDjVMpEx0xEvfkqdAC"
  );
  
  if (!response.ok) throw new Error("Failed to fetch operations");
  
  const data = await response.json();
  const operations = data ? Object.entries(data).map(([id, value]: [string, any]) => ({
    OprationID: id,
    ...value
  })) : [];

  // Format credit values to "0.0" if they're "0.00"
  operations.forEach(op => {
    if (op.Credit === "0.00") {
      op.Credit = "0.0";
    }
  });

  // Sort operations by time in descending order
  return operations.sort((a, b) => {
    const dateA = new Date(formatTimeString(a.Time));
    const dateB = new Date(formatTimeString(b.Time));
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

// Refund operation function
export const refundOperation = async (operation: Operation): Promise<boolean> => {
  if (!operation) return false;
  
  const token = localStorage.getItem("userToken");
  if (!token) throw new Error("No authentication token");
  
  try {
    // The refund amount from the operation
    const refundAmountStr = operation.Credit;
    const refundAmount = parseFloat(refundAmountStr) || 0;
    
    // Get current credits for the user
    const creditUrl = `https://pegasus-tool-database-default-rtdb.firebaseio.com/users/${operation.UID}/Credits.json?auth=${token}`;
    const creditResponse = await fetch(creditUrl);
    if (!creditResponse.ok) throw new Error("Failed to get user credits");
    
    const currentCreditStr = await creditResponse.text();
    let currentCredit = 0;
    try {
      // Remove quotes if they exist in the response
      currentCredit = parseFloat(currentCreditStr.replace(/"/g, "")) || 0;
    } catch (e) {
      console.error("Error parsing credit:", e);
    }
    
    // Calculate new credits
    const newCredit = currentCredit + refundAmount;
    
    // Update user's credit with .0 as required
    const url = `https://pegasus-tool-database-default-rtdb.firebaseio.com/users/${operation.UID}.json?auth=${token}`;
    const updateData = JSON.stringify({
      Credits: newCredit.toString() + ".0"
    });
    
    const response = await fetch(url, {
      method: 'PATCH',
      body: updateData,
    });
    
    if (!response.ok) throw new Error("Failed to update credits");
    
    // Update operation status and credit
    const operationId = operation.OprationID;
    const oprationUpdateUrl = `https://pegasus-tool-api-operations-default-rtdb.firebaseio.com/Operations/${operationId}.json?auth=wDgquXfCPyqdYqFYC1Vc8kQDjVMpEx0xEvfkqdAC`;
    const oprationUpdateData = JSON.stringify({
      Status: "Failed",
      Credit: "0.0"
    });

    const oprationResponse = await fetch(oprationUpdateUrl, {
      method: 'PATCH',
      body: oprationUpdateData
    });
    
    if (!oprationResponse.ok) throw new Error("Failed to update operation");
    
    return true;
  } catch (error) {
    console.error("Error refunding operation:", error);
    return false;
  }
};

export const useSharedData = () => {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: users = [], isLoading: isLoadingUsers, isSuccess: isUsersSuccess } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(token),
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

  // Add credit to user with the "0." format
  const addCreditToUser = async (userId: string, amount: number): Promise<boolean> => {
    if (!token) return false;
    
    try {
      // Find the user in the already loaded data
      const user = users.find(u => u.id === userId);
      if (!user) return false;
      
      // Calculate new credits with the "0." format
      const currentCredits = parseFloat(user.Credits) || 0;
      const newCredits = currentCredits + amount;
      const formattedCredits = `${newCredits}.0`;
      
      const url = `https://pegasus-tool-database-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`;
      const response = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({
          Credits: formattedCredits
        }),
      });

      if (!response.ok) throw new Error("Failed to add credits");
      
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

// Remove redundant re-export to avoid circular dependencies
// export { useLanguage } from './useLanguage';
