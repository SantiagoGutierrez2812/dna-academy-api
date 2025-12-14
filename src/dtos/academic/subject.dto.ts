
export interface CreateSubjectDto {
    name: string,
    professionalId: number
}

export interface UpdateSubjectDto {
    name?: string,
    professionalId?: number
}