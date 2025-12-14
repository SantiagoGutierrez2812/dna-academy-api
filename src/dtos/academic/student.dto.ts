

export interface CreateStudentDto {
    name: string,
    email: string,
    countryId: number,
    documentNumber: string,
    createdBy: number
};

export interface UpdateStudentDto {
    name?: string,
    email?: string,
    countryId?: number,
    documentNumber?: string,
};

export interface StudentSubjectDto {
    studentId: number,
    subjectId: number
}