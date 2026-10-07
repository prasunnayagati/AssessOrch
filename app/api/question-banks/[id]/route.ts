import { NextRequest, NextResponse } from "next/server";
import { questionBanks } from "@/lib/question-banks";

// DELETE /api/question-banks/[id] - Delete a specific question bank
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Question bank ID is required" },
        { status: 400 }
      );
    }

    const index = questionBanks.findIndex(bank => bank.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Question bank not found" },
        { status: 404 }
      );
    }

    questionBanks.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Question bank deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting question bank:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete question bank" },
      { status: 500 }
    );
  }
}