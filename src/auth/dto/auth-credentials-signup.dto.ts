import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { isUnique } from "src/customValidations/IsUnique/isUnique.decorator";

export class AuthCredentialsSignUpDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @isUnique({
        tableName: 'user',
        column: 'username'
    })
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak.'
    })
    password: string;
}
