import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId") || undefined;
    const topicName = searchParams.get("topicName") || undefined;

    const questions = dataStore.getPracticeQuestions(subjectId, topicName);
    return NextResponse.json(successResponse(questions));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch practice questions", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view"]);
  if (error) return error;

  try {
    const body = await req.json();
    let studentId = body.studentId;
    if (context!.role === "STUDENT" && context!.studentId) {
      studentId = context!.studentId;
    }
    if (!studentId || !body.questionId || body.selectedOptionIndex === undefined) {
      return NextResponse.json(
        errorResponse("studentId, questionId, and selectedOptionIndex are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const question = dataStore.getPracticeQuestions().find((q) => q.id === body.questionId);
    if (!question) {
      return NextResponse.json(errorResponse("Question not found", "NOT_FOUND"), { status: 404 });
    }

    const isCorrect = Number(body.selectedOptionIndex) === question.correctOptionIndex;

    const attempt = dataStore.recordPracticeAttempt({
      studentId,
      questionId: body.questionId,
      selectedOptionIndex: Number(body.selectedOptionIndex),
      isCorrect,
      timeSpentSeconds: body.timeSpentSeconds || 30,
    });

    return NextResponse.json(
      successResponse({
        attempt,
        isCorrect,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation,
        addedToMistakeBook: !isCorrect,
      }, isCorrect ? "Correct answer! Well done." : "Incorrect. Question added to your Mistake Book for review."),
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to record practice attempt", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
