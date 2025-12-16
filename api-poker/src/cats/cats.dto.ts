import { IsNumber, IsString, Length } from 'class-validator';

export class catsDTO {
    @IsString({always: true})
    @Length(2,20, {message: "Nom entre deux et vingt caractères"})

    name: string;
    
    @IsNumber()
    age: number;
}