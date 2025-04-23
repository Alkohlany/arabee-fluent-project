
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { formatTimeString } from "@/hooks/useSharedData";

interface OperationDetailsDialogProps {
  operation: any;
  onClose?: () => void;
}

export const OperationDetailsDialog: React.FC<OperationDetailsDialogProps> = ({ operation, onClose }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={!!operation} onOpenChange={(open) => {
      if (!open && onClose) {
        onClose();
      }
    }}>
      <DialogTrigger asChild>
        <button className="underline text-blue-500">{t("details")}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("operationDetails")}</DialogTitle>
          <DialogDescription>
            {t("completeUserInfo")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="operationID" className="text-right font-medium">
              {t("operationID")}
            </label>
            <div className="col-span-3 font-bold">{operation?.OprationID}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="operationType" className="text-right font-medium">
              {t("operationType")}
            </label>
            <div className="col-span-3">{operation?.OprationTypes}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="serialNumber" className="text-right font-medium">
              {t("serialNumber")}
            </label>
            <div className="col-span-3">{operation?.Phone_SN}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="brand" className="text-right font-medium">
              {t("brand")}
            </label>
            <div className="col-span-3">{operation?.Brand}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="model" className="text-right font-medium">
              {t("model")}
            </label>
            <div className="col-span-3">{operation?.Model}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="imei" className="text-right font-medium">
              {t("imei")}
            </label>
            <div className="col-span-3">{operation?.Imei}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="user" className="text-right font-medium">
              {t("user")}
            </label>
            <div className="col-span-3">{operation?.UserName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="credit" className="text-right font-medium">
              {t("credit")}
            </label>
            <div className="col-span-3">{operation?.Credit}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="time" className="text-right font-medium">
              {t("time")}
            </label>
            <div className="col-span-3">{formatTimeString(operation?.Time)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right font-medium">
              {t("status")}
            </label>
            <div className="col-span-3">{operation?.Status}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="android" className="text-right font-medium">
              {t("android")}
            </label>
            <div className="col-span-3">{operation?.Android}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="baseband" className="text-right font-medium">
              {t("baseband")}
            </label>
            <div className="col-span-3">{operation?.Baseband}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="carrier" className="text-right font-medium">
              {t("carrier")}
            </label>
            <div className="col-span-3">{operation?.Carrier}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="securityPatch" className="text-right font-medium">
              {t("securityPatch")}
            </label>
            <div className="col-span-3">{operation?.Security_Patch}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="uid" className="text-right font-medium">
              {t("uid")}
            </label>
            <div className="col-span-3">{operation?.UID}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="hwid" className="text-right font-medium">
              {t("hwid")}
            </label>
            <div className="col-span-3">{operation?.Hwid}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
