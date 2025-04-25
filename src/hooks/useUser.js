import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
    const { data: user } = useQuery({
        queryKey: ["user"],
        enabled: false,
    });

    return user;
};
