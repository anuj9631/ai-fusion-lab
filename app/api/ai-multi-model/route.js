import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  let parentModel = "Unknown"; // ✅ Declare at top scope
  let model = "Unknown";
  
  try {
    const requestData = await req.json();
    model = requestData.model;
    parentModel = requestData.parentModel;
    const msg = requestData.msg;

    // Log request details for debugging
    console.log("📤 API Request:", {
      model,
      parentModel,
      messageCount: msg.length,
    });

    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: msg,
        aiModel: model,
        outputType: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.KRAVIXSTUDIO_API_KEY}`,
        },
      }
    );

    console.log("✅ API Response:", response.data);

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (error) {
    console.error("❌ API Error for model:", parentModel);
    console.error("Request model ID:", model);
    console.error("Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        parentModel: parentModel,
        requestedModel: model,
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}