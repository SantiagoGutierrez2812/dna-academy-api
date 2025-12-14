

export interface CreateGradeDto {
    studentSubjectId: number,
    value: number,
    description: string
};

export interface UpdateGradeDto {
    value?: number,
    description?: string
};