// lib/submitEntry.ts
import { supabase } from "../lib/supabase";

export interface EntryFormData {
    Inspiration: string;
    YesterdayBest: string;
    TodayGreat: string;
    ImprovePlan: string;
    TodaySchedule: string;
    RewardsAfter: string;
    Thoughts: string;
    Rate_SelfLove: number;
    Rate_Mindfullness: number;
    Rate_Confident: number;
    Rate_Health: number;
    Rate_Relationship: number;
    Rate_Creativity: number;
    Rate_Career: number;
    Rate_Financial: number;
    MaintencncePlan: string;
    DreamSmall: string;
    DreamBig: string;
    TwentyIdea: string;
    OutSideBox: string;
}

export const submitEntry = async (formData: EntryFormData) => {
    const { data, error } = await supabase.from("entries").insert([formData]);

    if (error) {
        console.error("Insert failed:", error);
        throw error;
    }

    return data;
};
