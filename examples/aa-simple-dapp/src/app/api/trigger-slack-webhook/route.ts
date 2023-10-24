import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const url = process.env.ALCOMMUNITY_SLACK_WEBHOOK_URL;
  if (!url) {
    return NextResponse.error();
  }

  const { address, linkedIn } = body;
  const data = {
    text: `A recruiting prospect minted an alcommunity NFT with the following information:\nLinkedIn: ${linkedIn}\nAddress: ${address}`,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      console.log("Slack API response:", responseData);
    } else {
      console.error("Failed to send Slack message. Status:", response.status);
    }
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }

  return NextResponse.json({});
}
