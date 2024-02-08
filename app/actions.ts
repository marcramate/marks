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

    console.log("Ok Insert", data);
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

    console.log("Ok Update", data);
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

export async function PMEX(DataPmJSON: string) {
  try {
    const DataPMOb = JSON.parse(DataPmJSON);

    if (!DataPMOb) {
      console.error("Error: DataPMOb is not defined");
      return;
    }

    const text = DataPMOb.text;
    const company = DataPMOb.company;
    const cost = DataPMOb.cost;
    const status = DataPMOb.status;

    console.log(
      "text:",
      text,
      "company",
      company,
      "cost",
      cost,
      "status",
      status
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          text,
          company,
          cost,
          status,
        },
      ])
      .select();

    if (error) {
      console.log("Error Insert PMEX!!", error);
    }

    console.log("Ok Insert PMEX", data);
  } catch (error) {
    console.error("Error All Insert in PMEX:", error);
  }
}

export async function UPDEXPM(EditJSONPm: string) {
  try {
    const EditDataEXPM = JSON.parse(EditJSONPm);
    if (!EditDataEXPM) {
      console.error("Error: EditDataYTPM is not defined");
      return;
    }

    const text = EditDataEXPM.text;
    const company = EditDataEXPM.company;
    const cost = EditDataEXPM.cost;
    const status = EditDataEXPM.status;
    const id = EditDataEXPM.id;

    console.log(
      "Te:",
      text,
      "Co:",
      company,
      "ST:",
      cost,
      "Ess:",
      status,
      "EID:",
      id
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .update({ text, company, cost, status })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error Update EX!!", error);
    }

    console.log("Ok Update EX", data);
  } catch (error) {
    console.error("Error All Update in EX:", error);
  }
}

export async function DELEXPM(id: string) {
  try {
    const dataIDPm = id;

    if (!dataIDPm) {
      console.error("Error: ID is not defined");
      return;
    }

    console.log("data", dataIDPm);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", dataIDPm);

    if (error) {
      console.log("Error Delete EX!!", error);
    }

    console.log("Ok Delete Ex");
  } catch (error) {
    console.error("Error All Delete in EX:", error);
  }
}

export async function UPDSTALPM() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .update({ status: false })
      .eq("status", true)
      .select();

    if (error) {
      console.log("Error Update Status => False", error);
    }
    console.log("Update Ok Status EX", data);
  } catch (error) {
    console.error("Error Update Status EX", error);
  }
}

export async function STATUPIDPM(id: string, status: boolean) {
  try {
    const IDPm = id;
    const STAPm = status;
    const newstat = !status;

    console.log("ID", id, "Sta:", status, "new", newstat);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .update({ status: newstat })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error Update Status EX", error);
    }

    console.log("OK Update Status", data);
  } catch (error) {
    console.error("Error Update Status Ex", error);
  }
}

export async function GMEX(DataGmeJson: string) {
  try {
    const DataGmob = JSON.parse(DataGmeJson);

    if (!DataGmeJson) {
      console.log("Error: DataGmeJson is not defined");
      return;
    }

    const text = DataGmob.text;
    const company = DataGmob.company;
    const cost = DataGmob.cost;
    const status = DataGmob.status;

    console.log(
      "text:",
      text,
      "company",
      company,
      "cost",
      cost,
      "status",
      status
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          text,
          company,
          cost,
          status,
        },
      ])
      .select();

    if (error) {
      console.log("Error Insert GMEX!!", error);
    }

    console.log("Ok Insert GMEX", data);
  } catch (error) {
    console.error("Error All Insert in GMEX:", error);
  }
}

export async function UPDXGM(EditJSONGm: string) {
  try {
    const EditDataGXPM = JSON.parse(EditJSONGm);
    if (!EditDataGXPM) {
      console.error("Error: EditDataGXPM is not defined");
      return;
    }

    const text = EditDataGXPM.text;
    const company = EditDataGXPM.company;
    const cost = EditDataGXPM.cost;
    const status = EditDataGXPM.status;
    const id = EditDataGXPM.id;

    console.log(
      "Te:",
      text,
      "Co:",
      company,
      "ST:",
      cost,
      "Ess:",
      status,
      "EID:",
      id
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("expenses")
      .update({ text, company, cost, status })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error Update UPDXGM!!", error);
    }

    console.log("Ok Update UPDXGM", data);
  } catch (error) {
    console.error("Error All Update in UPDXGM:", error);
  }
}

export async function DELEXGM(id: string) {
  try {
    const dataIDGm = id;

    if (!dataIDGm) {
      console.error("Error: ID is not defined");
      return;
    }

    console.log("data", dataIDGm);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", dataIDGm);

    if (error) {
      console.log("Error Delete DELEXGM!!", error);
    }

    console.log("Ok Delete DELEXGM");
  } catch (error) {
    console.error("Error All Delete in DELEXGM:", error);
  }
}

export async function CartagIn(DatacartagJson: string) {
  try {
    const DataCarTag = JSON.parse(DatacartagJson);

    if (!DataCarTag) {
      console.log("Error: DataCarTag is not defined");
      return;
    }

    const c_name = DataCarTag.c_name;
    const c_price = DataCarTag.c_price;
    const c_startdate = DataCarTag.c_startdate;
    const c_enddate = DataCarTag.c_enddate;
    const c_tag = DataCarTag.c_tag;

    console.log(
      "c_name:",
      c_name,
      "c_price",
      c_price,
      "c_startdate",
      c_startdate,
      "c_enddate",
      c_enddate,
      "c_tag",
      c_tag
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("car")
      .insert([
        {
          c_name,
          c_price,
          c_startdate,
          c_enddate,
          c_tag,
        },
      ])
      .select();

    if (error) {
      console.log("Error Insert CartagIn!!", error);
    }

    console.log("Ok Insert CartagIn", data);
  } catch (error) {
    console.error("Error All Insert in CartagIn:", error);
  }
}

export async function UPDCartag(EditJSONcartag: string) {
  try {
    const EditDataUPDCartag = JSON.parse(EditJSONcartag);

    if (!EditDataUPDCartag) {
      console.error("Error: EditDataUPDCartag is not defined");
      return;
    }
    const id = EditDataUPDCartag.id;
    const c_name = EditDataUPDCartag.c_name;
    const c_price = EditDataUPDCartag.c_price;
    const c_startdate = EditDataUPDCartag.c_startdate;
    const c_enddate = EditDataUPDCartag.c_enddate;
    const c_tag = EditDataUPDCartag.c_tag;

    console.log(
      "Te:",
      c_name,
      "Co:",
      c_price,
      "ST:",
      c_startdate,
      "Ess:",
      c_enddate,
      "Tag:",
      c_tag,
      "EID:",
      id
    );

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("car")
      .update({ c_name, c_price, c_startdate, c_enddate, c_tag })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error Update UPDCartag!!", error);
    }

    console.log("Ok Update UPDCartag", data);
  } catch (error) {
    console.error("Error All Update in UPDCartag:", error);
  }
}

export async function DELcartag(id: string) {
  try {
    const IDcartag = id;

    if (!IDcartag) {
      console.log("Error: ID is not defined");
      return;
    }

    console.log("ID DELcartag:", IDcartag);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("car")
      .delete()
      .eq("id", IDcartag);

      if(error){
        console.log("Error Delete DELCartag!!", error);
      }
  } catch (error) {}
}
/*
export async function DELEXPM(id: string) {
  try {
    const dataIDPm = id;

    if (!dataIDPm) {
      console.error("Error: ID is not defined");
      return;
    }

    console.log("data", dataIDPm);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", dataIDPm);

    if (error) {
      console.log("Error Delete EX!!", error);
    }

    console.log("Ok Delete Ex");
  } catch (error) {
    console.error("Error All Delete in EX:", error);
  }
}
*/
