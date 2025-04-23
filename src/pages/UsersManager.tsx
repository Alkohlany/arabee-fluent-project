import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSharedData } from "@/hooks/useSharedData";

export default function UsersManager() {
  const { t } = useLanguage();
  const { users, refreshData, addCreditToUser } = useSharedData();
  
  const handleAddCredits = async (userId: string, amount: number) => {
    const success = await addCreditToUser(userId, amount);
    if (success) {
      toast.success(t("creditsAdded"));
      refreshData();
    } else {
      toast.error(t("errorAddingCredits"));
    }
  };

  const handleRenewUser = async (userId: string, months: number) => {
    const success = await renewUser(userId, months);
    if (success) {
      toast.success(t("userRenewed"));
      refreshData();
    } else {
      toast.error(t("errorRenewingUser"));
    }
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    const success = await blockUser(userId, isBlocked);
    if (success) {
      toast.success(isBlocked ? t("userBlocked") : t("userUnblocked"));
      refreshData();
    } else {
      toast.error(t("errorTogglingBlock"));
    }
  };

  return (
    <div>
      <h1>{t("usersManager")}</h1>
      <div>
        {users.map(user => (
          <div key={user.id}>
            <h2>{user.Name}</h2>
            <p>Email: {user.Email}</p>
            <p>Credits: {user.Credits}</p>
            <button onClick={() => handleAddCredits(user.id, 10)}>
              {t("addCredits")}
            </button>
            <button onClick={() => handleRenewUser(user.id, 1)}>
              {t("renewUser")}
            </button>
            <button onClick={() => handleBlockUser(user.id, user.Block !== "1")}>
              {user.Block === "1" ? t("unblockUser") : t("blockUser")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
