-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PROFESSOR', 'ALUNO');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('ENSINO_FUNDAMENTAL', 'ENSINO_MEDIO');

-- CreateEnum
CREATE TYPE "GradeGroup" AS ENUM ('ANOS_INICIAIS', 'ANOS_FINAIS', 'ENSINO_MEDIO');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('PRIMEIRO_ANO', 'SEGUNDO_ANO', 'TERCEIRO_ANO', 'QUARTO_ANO', 'QUINTO_ANO', 'SEXTO_ANO', 'SETIMO_ANO', 'OITAVO_ANO', 'NONO_ANO');

-- CreateEnum
CREATE TYPE "HighSchoolGrade" AS ENUM ('PRIMEIRO', 'SEGUNDO', 'TERCEIRO');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'CORRECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "educationLevel" "EducationLevel",
    "gradeGroup" "GradeGroup",
    "grade" "Grade",
    "highSchoolYear" "HighSchoolGrade",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'DRAFT',
    "educationLevel" "EducationLevel" NOT NULL,
    "gradeGroup" "GradeGroup",
    "grade" "Grade",
    "highSchoolYear" "HighSchoolGrade",
    "professorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "options" TEXT[],
    "answer" INTEGER NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "answers" INTEGER[],
    "score" INTEGER,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "correctedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_activityId_key" ON "Submission"("studentId", "activityId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
