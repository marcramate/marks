"use server";

import { Console } from "console";
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
    const date_end = formDataObject.dateend;
    const status_pay = formDataObject.pay_status;

    console.log("naem:", name, "dd", date, "de", date_end, "ss", status_pay);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("youtubepremium")
      .insert([
        {
          name,
          date,
          date_end,
          status_pay,
        },
      ])
      .select();

    if (error) {
      console.log("Error Insert YTPM!!", error);
    }

    console.log("Ok Insert");
  } catch (error) {
    console.error("Error All Insert in YTPM:", error);
  }
}

export async function UPDYTPM(EditDataJSON: string) {
  try {
    const EditDataYTPM = JSON.parse(EditDataJSON);
    if (!EditDataYTPM) {
      console.error("Error: EditDataYTPM is not defined");
      return;
    }

    const name = EditDataYTPM.name;
    const date = EditDataYTPM.date;
    const date_end = EditDataYTPM.dateend;
    const status_pay = EditDataYTPM.pay_status;
    const id = EditDataYTPM.id;

    console.log(
      "En:",
      name,
      "Ed:",
      date,
      "Ede:",
      date_end,
      "Ess:",
      status_pay,
      "EID:",
      id
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("youtubepremium")
      .update({ name, date, date_end, status_pay })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error Update YTPM!!", error);
    }

    console.log("Ok Update");
  } catch (error) {
    console.error("Error All Update in YTPM:", error);
  }
}

export async function DELYTPM(id: string) {
  try {
    const dataID = id;

    if (!dataID) {
      console.error("Error: ID is not defined");
      return;
    }

    console.log("data", dataID);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("youtubepremium")
      .delete()
      .eq("id", dataID);

    if (error) {
      console.log("Error Delete YTPM!!", error);
    }

    console.log("Ok Del");
  } catch (error) {
    console.error("Error All Delete in YTPM:", error);
  }
}

export async function UpdateEnd(newDate: Date) {
  try {
    const dateend = newDate;

    console.log("date : ", dateend);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("youtubepremium") 
      .update({ date_end: newDate });

    if (error) {
      console.log("Error updating data YTPM!!", error);
    }

    console.log("Ok Update_end");
  } catch (error : any) {
    console.error(error.message);
    throw new Error("Failed to update data");
  }
}
