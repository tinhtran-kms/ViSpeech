import { BaseEntityDto } from 'base/base-entity.dto';
import { IsArray, IsBoolean, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleDto } from 'roles/dtos/roles.dto';
import { Column, Entity } from 'typeorm';
import { ERR } from "../../common/error";
import { ErrUtil } from "../../utils/err.util";

export class UserIdRequestParamsDto {
    constructor(userId) {
        this._id = userId;
    }

    @IsString(ErrUtil.getMessage('_id', ERR.IsString))
    @IsOptional()
    _id: string;
}

export class ChangePasswordBody {
    @IsNotEmpty(ErrUtil.getMessage('userId', ERR.IsNotEmpty))
    @IsString(ErrUtil.getMessage('userId', ERR.IsString))
    readonly userId;

    @IsNotEmpty(ErrUtil.getMessage('oldPassword', ERR.IsNotEmpty))
    @IsString(ErrUtil.getMessage('oldPassword', ERR.IsString))
    readonly oldPassword;

    @IsNotEmpty(ErrUtil.getMessage('newPassword', ERR.IsNotEmpty))
    @IsString(ErrUtil.getMessage('newPassword', ERR.IsString))
    readonly newPassword;
}

export enum USER_TYPE {
    NORMAL = 'NORMAL',
    FACEBOOK = 'FACEBOOK',
    GOOGLE = 'GOOGLE',
    TWITTER = 'TWITTER',
}

@Entity('users')
export class UserDto extends BaseEntityDto {
    constructor(firstName: string, lastName: string, username: string, password: string, email: string, roles: RoleDto[],
        userType: USER_TYPE = USER_TYPE.NORMAL, socialId?: string) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.isActive = true;
        this.socialId = socialId;
        this.userType = userType;
    }

    @IsString(ErrUtil.getMessage('firstName', ERR.IsString))
    @IsNotEmpty(ErrUtil.getMessage('firstName', ERR.IsNotEmpty))
    @Column()
    firstName: string;

    @IsString(ErrUtil.getMessage('lastName', ERR.IsString))
    @IsOptional()
    @Column()
    lastName: string;

    @IsString(ErrUtil.getMessage('username', ERR.IsString))
    @IsNotEmpty(ErrUtil.getMessage('username', ERR.IsNotEmpty))
    @Column({nullable: false, update: false, unique: true})
    username: string;

    @IsOptional()
    @IsString(ErrUtil.getMessage('password', ERR.IsString))
    @Column({
        select: false, nullable: false,
    })
    password: string;

    @IsEmail({}, ErrUtil.getMessage('email', ERR.IsEmail))
    @IsNotEmpty(ErrUtil.getMessage('email', ERR.IsNotEmpty))
    @Column({
        unique: true, update: false,
    })
    email: string;

    @IsEmpty(ErrUtil.getMessage('firstTimeLoginRemaining', ERR.IsEmpty))
    @Column({
        default: true,
        nullable: true,
        insert: false,
    })
    firstTimeLoginRemaining: boolean;

    @IsNotEmpty(ErrUtil.getMessage('isActive', ERR.IsNotEmpty))
    @IsBoolean(ErrUtil.getMessage('isActive', ERR.IsBoolean))
    @Column({
        default: true,
        nullable: false,
    })
    isActive: boolean;

    @IsOptional()
    @IsString(ErrUtil.getMessage('socialId', ERR.IsString))
    @Column()
    socialId: string;

    @IsOptional()
    @IsString()
    @IsEnum(USER_TYPE)
    @Column({default: USER_TYPE.NORMAL})
    userType: USER_TYPE;

    @IsArray(ErrUtil.getMessage('roles', ERR.IsArray))
    @IsOptional()
    @Column()
    roles: RoleDto[];
}
