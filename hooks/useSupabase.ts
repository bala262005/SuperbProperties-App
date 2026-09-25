import { createClerkSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";

export  function useSupabase() {
    const { getToken } = useAuth();

    const client = useMemo(
        () => createClerkSupabaseClient(() => getToken()),
        [getToken],
    );

    return client;
}