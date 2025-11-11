import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { model, msg, parentModel } = await req.json();

    // Send POST request using Axios
    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg,          // ✅ Correct key name
        aiModel: model,        // Selected model
        outputType: "text",    // 'text' or 'json'
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.KRAVIXSTUDIO_API_KEY}`, // ✅ Ensure no space in .env
        },
      }
    );

    console.log("✅ API Response:", response.data);

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
