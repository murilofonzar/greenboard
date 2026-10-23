ALTER TABLE "Submission" ALTER COLUMN "studentId" DROP NOT NULL;

ALTER TABLE "Submission"
ADD COLUMN "guestName" TEXT,
ADD COLUMN "guestClass" TEXT,
ADD COLUMN "guestGradeGroup" "GradeGroup",
ADD COLUMN "guestGrade" "Grade";
