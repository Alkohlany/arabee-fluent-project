import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { useSharedData, useLanguage } from "@/hooks/useSharedData";
import { toast } from "@/components/ui/sonner";
import { format } from 'date-fns';

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
  [key: string]: string;
}

export default function UsersManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const { users, isLoading, refreshData } = useSharedData();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (users) {
      let filtered = [...users];

      if (filterStatus === "active") {
        filtered = filtered.filter((user) => user.Activate === "true");
      } else if (filterStatus === "inactive") {
        filtered = filtered.filter((user) => user.Activate === "false");
      }

      if (searchQuery) {
        const lowerSearchQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((user) =>
          user.Name.toLowerCase().includes(lowerSearchQuery) ||
          user.Email.toLowerCase().includes(lowerSearchQuery) ||
          user.Phone.toLowerCase().includes(lowerSearchQuery)
        );
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchQuery, filterStatus]);

  const handleEdit = (userId: string) => {
    navigate(`/user-edit/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast(t("noAuth"), {
        description: t("noAuthDescription")
      });
      return;
    }

    try {
      const response = await fetch(
        `https://pegasus-tool-database-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast(t("userDeleted"), {
          description: t("userDeletedSuccess")
        });
        refreshData(); // Refresh user data
      } else {
        toast(t("userDeletedFailed"), {
          description: t("userDeletedFailedDescription")
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast(t("userDeletedFailed"), {
        description: t("userDeletedFailedDescription")
      });
    }
  };

  const handleFilterActive = () => {
    setFilterStatus("active");
  };

  const handleFilterInactive = () => {
    setFilterStatus("inactive");
  };

  const handleFilterAll = () => {
    setFilterStatus("all");
  };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-tr from-gray-100 to-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 animate-fade-in">
              {t("users")}
            </h1>
            <p className="text-gray-600 md:text-lg animate-fade-in">{t("manageUsers")}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate('/signup')}>{t("createUser")}</Button>
          </div>
        </header>

        <Card className="shadow-lg border-2 border-gray-50">
          <CardHeader>
            <CardTitle>{t("usersList")}</CardTitle>
            <CardDescription>{t("filterSearchManage")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="search">{t("searchUsers")}</Label>
                <Input
                  type="search"
                  id="search"
                  placeholder={t("searchByNameEmailPhone")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="filter">{t("filterByStatus")}</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterStatus === "all" ? t("allUsers") : filterStatus === "active" ? t("activeUsers") : t("inactiveUsers")}
                      <MoreVertical className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("filter")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleFilterActive}>
                      {t("activeUsers")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleFilterInactive}>
                      {t("inactiveUsers")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleFilterAll}>
                      {t("allUsers")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableCaption>{t("usersOverview")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("phone")}</TableHead>
                    <TableHead>{t("userType")}</TableHead>
                    <TableHead>{t("credits")}</TableHead>
                    <TableHead>{t("country")}</TableHead>
                    <TableHead>{t("expiryTime")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        {t("loadingUsers")}
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        {t("noUsersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.Name}</TableCell>
                        <TableCell>{user.Email}</TableCell>
                        <TableCell>{user.Phone}</TableCell>
                        <TableCell>{user.User_Type}</TableCell>
                        <TableCell>{user.Credits}</TableCell>
                        <TableCell>{user.Country}</TableCell>
                        <TableCell>
                          {user.Expiry_Time ? format(new Date(user.Expiry_Time), 'yyyy-MM-dd') : t('noExpiry')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("openMenu")}</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>{t("edit")}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{t("delete")}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={8}>{t("totalUsers")}: {users?.length || 0}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
