import { Plasata, Finalizata } from "../../../components/email-template";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend("re_6ctqkxVi_jmmi2ySfgs86gGhmkMEtP4wu");

export async function POST(req, res) {
  const body = await req.json();
  console.log(body);
  switch (body.type) {
    case "plasata":
      try {
        const { data, error } = await resend.emails.send({
          from: "comenzi@elysian.e-uvt.ro",
          to: body.email,
          subject: "[Elysian] Comanda plasata",
          react: Plasata({
            firstName: body.nume,
            produse: body.produse,
          }),
        });

        console.log(data);

        if (error) {
          return NextResponse.json({ error });
        }
        return NextResponse.json({ data });
      } catch (error) {
        return NextResponse.json({ error });
      }
    case "finalizata":
      try {
        const { data, error } = await resend.emails.send({
          from: "comenzi@elysian.e-uvt.ro",
          to: body.email,
          subject: "[Elysian] Comanda finalizata",
          react: Finalizata({ firstName: body.nume }),
        });

        console.log(data);

        if (error) {
          return NextResponse.json({ error });
        }
        return NextResponse.json({ data });
      } catch (error) {
        return NextResponse.json({ error });
      }
    default:
      // Handle other cases or provide a default response
      return NextResponse.json({ error: "Invalid request type" });
  }
}
