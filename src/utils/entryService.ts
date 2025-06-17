import { supabase } from "../lib/supabase";

export interface Entry {
    id: string;
    created_at: string;
    type: "task" | "event" | "note";
    text: string;
    completed: boolean;
}

// โหลดทั้งหมด
export const loadEntries = async (): Promise<Entry[]> => {
    const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Load error:", error.message);
        return [];
    }

    return data as Entry[];
};

// บันทึกใหม่
export const saveEntry = async (entry: Omit<Entry, "id" | "created_at">) => {
    const { error } = await supabase.from("entries").insert([entry]);
    if (error) console.error("Save error:", error.message);
};