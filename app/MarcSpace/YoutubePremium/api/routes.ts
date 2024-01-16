"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../../utils/supabase/server";
import { cookies } from "next/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, date, pay_status } = req.body;

      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase
        .from("youtubepremium")
        .insert([
          {
            name,
            date,
            pay_status,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting into Supabase:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Inserted into Supabase:", data);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
