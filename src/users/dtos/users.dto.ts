import {BaseEntityDto} from "base/base-entity.dto";
import {IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID} from "class-validator";
import {RoleDto} from "roles/dtos/roles.dto";
import {Column, Entity, Index} from "typeorm";
import {CONSTANTS} from "common/constant";

export class UserIdRequestParamsDto {
    constructor(userId) {
        this._id = userId;
    }

    @IsString()
    @IsOptional()
    _id: string;
}

export class AssignUserRoleBody {
    @IsNotEmpty()
    @IsArray()
    @IsIn([CONSTANTS.ROLE.USER, CONSTANTS.ROLE.CSR_USER, CONSTANTS.ROLE.MANAGER_USER],
        {each: true})
    roleName: string;
}

@Entity("users")
export class UserDto extends BaseEntityDto {

    constructor(firstName: string, lastName: string, username: string, password: string, email: string, assignerId: string, roles: RoleDto[]) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.assignerId = assignerId;
        this.roles = roles;
    }

    @IsString()
    @IsNotEmpty()
    @Column()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Index({unique: true})
    @Column({nullable: false})
    readonly username: string;

    @IsOptional()
    @IsString()
    @Column({
        select: false, nullable: false,
    })
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @Column({
        unique: true, update: false,
    })
    email: string;

    @IsOptional()
    @IsUUID()
    @Column({
        update: false,
    })
    assignerId: string;

    @IsEmpty()
    @Column({
        default: true,
        nullable: true,
        insert: false,
    })
    firstTimeLoginRemaining: boolean;

    @IsEmpty()
    @Column({
        default: true,
        nullable: false,
        insert: false,
    })
    isActive: boolean;

    @IsArray()
    @IsOptional()
    @Column()
    roles: RoleDto[];
}
