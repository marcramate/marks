"use server";

import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

export async function YTPM(formDataJSON: string) {
  try {
    const formDataObject = JSON.parse(formDataJSON);

    if (!formDataObject) {
      console.error("Error: formDataObject is not defined");
      return;
    }

    const name = formDataObject.name;
    const date = formDataObject.date;
    const pay_status = formDataObject.pay_status;

    console.log("naem:",name, "dd",date, "ss",pay_status);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    /*
    const { data, error } = await supabase
      .from("youtubepremium")
      .insert([
        {
          ...formDataObject,
        },
      ])
      .select();

    if (error) {
      console.log("Error Insert YTPM!!", error);
    }

    console.log("Ok");
     */
  } catch (error) {
    console.error("Error in YTPM:", error);
   
  }

}
