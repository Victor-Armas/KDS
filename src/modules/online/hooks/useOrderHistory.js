import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchOrdersByUser } from "../services/online.service";

export const useOrderHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["online-order-history", user?.id],
    queryFn: () => fetchOrdersByUser(user.id),
    enabled: !!user, // only runs if user is logged in
    staleTime: 1000 * 60 * 2,
  });
};
