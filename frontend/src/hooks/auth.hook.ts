import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, logout, userLogin } from "@/api/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
