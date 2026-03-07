import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET — fetch all body progress entries for the user
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("progress_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST — insert a new body progress entry
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workout_type, body_weight_kg, notes, logged_at } = body;

    if (!workout_type || body_weight_kg === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("progress_logs")
        .insert({
            user_id: user.id,
            workout_type,
            body_weight_kg: parseFloat(body_weight_kg),
            notes: notes || null,
            logged_at: logged_at || new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
