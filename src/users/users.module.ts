import { forwardRef, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, EventBus, EventPublisher, QueryBus } from '@nestjs/cqrs';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { EventStoreModule } from 'core/event-store/event-store.module';
import { DeletePermissionByUserIdHandler } from 'permissions/commands/handlers/delete-permission-by-userId.handler';
import { PermissionsModule } from 'permissions/permissions.module';
import { PermissionRepository } from 'permissions/repository/permission.repository';
import { DeleteProjectByUserIdHandler } from 'projects/commands/handlers/delete-project-by-userId.handler';
import { ProjectsModule } from 'projects/projects.module';
import { ProjectRepository } from 'projects/repository/project.repository';
import { CreateFreeTokenHandler } from 'tokens/commands/handlers/create-token.handler';
import { DeleteTokenByUserIdHandler } from 'tokens/commands/handlers/delete-token-by-userId.handler';
import { TokenRepository } from 'tokens/repository/token.repository';
import { TokensModule } from 'tokens/tokens.module';
import { Repository } from 'typeorm';

import { CONSTANTS } from 'common/constant';
import { kafkaClientOptions } from 'common/kafka-client.options';
import { EventStore } from 'core/event-store/event-store';
import { PermissionDto } from 'permissions/dtos/permissions.dto';
import { RoleDto } from 'roles/dtos/roles.dto';
import { Utils } from 'utils';
import { CommandHandlers } from './commands/handlers';
import { UsersController } from './controllers/users.controller';
import { UserDto } from './dtos/users.dto';
import { EventHandlers } from './events/handlers';
import {
    EmailVerifiedEvent,
    EmailVerifiedFailedEvent,
    EmailVerifiedSuccessEvent
} from './events/impl/email-verified.event';
import {
    PasswordChangedEvent,
    PasswordChangedFailedEvent,
    PasswordChangedSuccessEvent,
} from './events/impl/password-changed.event';
import {
    UserCreatedEvent,
    UserCreatedFailedEvent,
    UserCreatedSuccessEvent,
    UserCreationStartedEvent,
} from './events/impl/user-created.event';
import { UserDeletedEvent, UserDeletedFailedEvent, UserDeletedSuccessEvent } from './events/impl/user-deleted.event';
import { UserUpdatedEvent, UserUpdatedFailedEvent, UserUpdatedSuccessEvent } from './events/impl/user-updated.event';
import { UserWelcomedEvent } from './events/impl/user-welcomed.event';
import {
    VerifyEmailSentEvent,
    VerifyEmailSentFailedEvent,
    VerifyEmailSentSuccessEvent,
} from './events/impl/verify-email-sent.event';
import { QueryHandlers } from './queries/handler';
import { UserRepository } from './repository/user.repository';
import { UsersSagas } from './sagas/users.sagas';
import { UsersService } from './services/users.service';
import { config } from '../../config';
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        ClientsModule.register([{
            name: config.KAFKA.NAME,
            ...kafkaClientOptions,
        }]),
        TypeOrmModule.forFeature([UserDto, PermissionDto]),
        forwardRef(() => AuthModule),
        EventStoreModule.forFeature(),
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersSagas, ...CommandHandlers,
        ...EventHandlers, ...QueryHandlers,
        CreateFreeTokenHandler,
        DeleteTokenByUserIdHandler,
        DeleteProjectByUserIdHandler,
        DeletePermissionByUserIdHandler,
        /*** REPOSITORY */
        UserRepository, TokenRepository, ProjectRepository, PermissionRepository,
        QueryBus, EventBus, EventStore, CommandBus, EventPublisher,
        ClientKafka,
    ],
    exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
    constructor(
        private readonly command$: CommandBus,
        private readonly query$: QueryBus,
        private readonly event$: EventBus,
        private readonly eventStore: EventStore,
        @InjectRepository(UserDto)
        private readonly repository: Repository<UserDto>,
        @Inject(config.KAFKA.NAME)
        private readonly client: ClientKafka,
    ) {
    }

    async onModuleInit() {
        this.eventStore.setEventHandlers({
            ...this.eventHandlers,
            ...TokensModule.eventHandlers,
            ...ProjectsModule.eventHandlers,
            ...PermissionsModule.eventHandlers,
        });
        await this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
        this.event$.publisher = this.eventStore;
        this.event$.register(EventHandlers);
        this.command$.register([...CommandHandlers, CreateFreeTokenHandler,
            DeleteTokenByUserIdHandler, DeleteProjectByUserIdHandler, DeletePermissionByUserIdHandler]);
        this.query$.register(QueryHandlers);
        this.event$.registerSagas([UsersSagas]);
        // seed data
        await this.seedAdminAccount();
    }

    private async seedAdminAccount() {
        const admin = new UserDto(config.ADMIN.NAME, config.ADMIN.LAST_NAME, config.ADMIN.USERNAME, Utils.hashPassword(config.ADMIN.PASS),
            config.ADMIN.EMAIL, [new RoleDto(CONSTANTS.ROLE.ADMIN)]);
        await this.repository.save(admin).then(() => {
            Logger.log('Seed admin account success.', 'UserModule');
        }).catch(err => Logger.warn('User admin existed.', err.message));
    }

    eventHandlers = {
        // create
        UserCreationStartedEvent: (streamId, data) => new UserCreationStartedEvent(streamId, data),
        UserCreatedEvent: (streamId, data) => new UserCreatedEvent(streamId, data),
        UserCreatedSuccessEvent: (streamId, data) => new UserCreatedSuccessEvent(streamId, data),
        UserCreatedFailedEvent: (streamId, data, error) => new UserCreatedFailedEvent(streamId, data, error),

        // update
        UserUpdatedEvent: (streamId, data) => new UserUpdatedEvent(streamId, data),
        UserUpdatedSuccessEvent: (streamId, data) => new UserUpdatedSuccessEvent(streamId, data),
        UserUpdatedFailedEvent: (streamId, data, error) => new UserUpdatedFailedEvent(streamId, data, error),

        // change password
        PasswordChangedEvent: (streamId, data) => new PasswordChangedEvent(streamId, data),
        PasswordChangedSuccessEvent: (streamId, data) => new PasswordChangedSuccessEvent(streamId, data),
        PasswordChangedFailedEvent: (streamId, data, error) => new PasswordChangedFailedEvent(streamId, data, error),

        // delete
        UserDeletedEvent: (streamId, data, isDeleted) => new UserDeletedEvent(streamId, data, isDeleted),
        UserDeletedSuccessEvent: (streamId, data) => new UserDeletedSuccessEvent(streamId, data),
        UserDeletedFailedEvent: (streamId, data, error) => new UserDeletedFailedEvent(streamId, data, error),

        UserWelcomedEvent: (streamId, data) => new UserWelcomedEvent(streamId, data),

        // send verify email
        VerifyEmailSentEvent: (streamId, data) => new VerifyEmailSentEvent(streamId, data),
        VerifyEmailSentSuccessEvent: (streamId, data) => new VerifyEmailSentSuccessEvent(streamId, data),
        VerifyEmailSentFailedEvent: (streamId, data, error) => new VerifyEmailSentFailedEvent(streamId, data, error),

        // verify email
        EmailVerifiedEvent: (streamId, data) => new EmailVerifiedEvent(streamId, data),
        EmailVerifiedSuccessEvent: (streamId, emailToken, newToken) => new EmailVerifiedSuccessEvent(streamId, emailToken, newToken),
        EmailVerifiedFailedEvent: (streamId, data, error) => new EmailVerifiedFailedEvent(streamId, data, error),
    };
}
