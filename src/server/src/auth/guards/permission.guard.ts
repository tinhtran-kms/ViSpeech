import { BadRequestException, CanActivate, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { CONSTANTS } from 'common/constant';
import { PermissionDto } from 'permissions/dtos/permissions.dto';
import { getMongoRepository } from 'typeorm';
import { UserDto } from 'users/dtos/users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    async canActivate(context: import('@nestjs/common').ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const id = request.params._id || request.params.id;
        if (!id) return true;

        const payload = this.authService.decode(request);
        if (!payload || !payload['id'] || !payload['roles']) {
            throw new UnauthorizedException();
        }

        const isAdmin = payload['roles'].findIndex(role => role.name === CONSTANTS.ROLE.ADMIN) !== -1;
        if (isAdmin) return true;

        const permission = await getMongoRepository(PermissionDto).findOne({ _id: id });
        if (!permission) {
            throw new NotFoundException(`Permission with _id ${id} does not exist.`);
        }
        if (permission.assignerId === payload['id']) {
            return true;
        }

        Logger.warn('User does not have permission to modify this permission.', 'PermissionGuard');
        return false;
    }
}

@Injectable()
export class AssignPermissionGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    async canActivate(context: import('@nestjs/common').ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const payload = this.authService.decode(request);
        if (!payload || !payload['id'] || !payload['roles']) {
            throw new UnauthorizedException();
        }

        const { assigneeUsername, assignerId, projectId } = request.body;
        const assignee = await getMongoRepository(UserDto).findOne({ username: assigneeUsername });
        if (assignee) {
            const permission = await getMongoRepository(PermissionDto).findOne({ assignerId, assigneeId: assignee._id, projectId });
            if (permission || assignee._id === assignerId) {
                return false;
            }
        }

        const isAdmin = payload['roles'].findIndex(role => role.name === CONSTANTS.ROLE.ADMIN) !== -1;
        const isManagerUser = payload['roles'].findIndex(role => role.name === CONSTANTS.ROLE.MANAGER_USER) !== -1;
        if (isAdmin || (isManagerUser && assignerId === payload['id'])) {
            return true;
        }
        return false;
    }
}

@Injectable()
export class ReplyPermisisonAssignGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {
    }

    async canActivate(context: import('@nestjs/common').ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { emailToken } = request.body;

        const requestJwt = this.authService.decode(request);
        if (!requestJwt || !requestJwt['id'] || !requestJwt['roles']) {
            throw new UnauthorizedException();
        }

        const decodedEmailToken = this.jwtService.decode(emailToken);
        const assignerId = decodedEmailToken['assignerId'];
        const assigneeId = decodedEmailToken['assigneeId'];
        const projectId = decodedEmailToken['projectId'];
        const permissions = decodedEmailToken['permissions'];

        if (!decodedEmailToken || !assignerId || !assigneeId || !projectId || !permissions) {
            throw new BadRequestException("Token is invalid.");
        }

        const permission = await getMongoRepository(PermissionDto).findOne({ assignerId, assigneeId, projectId, status: CONSTANTS.STATUS.PENDING });
        if (permission && assigneeId === requestJwt['id']) {
            return true;
        }

        return false;
    }
}

@Injectable()
export class PermissionQueryGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {
    }

    async canActivate(context: import('@nestjs/common').ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const payload = this.authService.decode(request);
        if (!payload || !payload['id'] || !payload['roles']) {
            throw new UnauthorizedException();
        }

        const isAdmin = payload['roles'].findIndex(role => role.name === CONSTANTS.ROLE.ADMIN) !== -1;
        if (isAdmin) return true;

        const { id, emailToken } = request.params;
        if (id) {
            const permission = await getMongoRepository(PermissionDto).findOne({ _id: id });
            if (!permission) {
                throw new NotFoundException(`Permission with _id ${id} does not exist.`);
            }
            if (permission.assigneeId === payload['id'] || permission.assignerId === payload['id']) {
                return true;
            }
        }

        if (emailToken) {
            const decodedToken = this.jwtService.decode(emailToken);
            const assigneeId = decodedToken['assigneeId'];
            const assignerId = decodedToken['assignerId'];
            const projectId = decodedToken['projectId'];
            if (assigneeId && assignerId && projectId) {
                const permissions = await getMongoRepository(PermissionDto).find({ assigneeId, assignerId, projectId });
                if (permissions.length === 0) {
                    throw new NotFoundException(`Permissions with assigneeId ${assigneeId} and 
                        assignerId ${assignerId} and projectId ${projectId} does not exist.`);
                }
                if (assigneeId === payload['id'] || assignerId === payload['id']) {
                    return true;
                }
            }
        }

        Logger.warn('User does not have permission to query permissions.', 'PermissionQueryGuard');
        return false;
    }
}