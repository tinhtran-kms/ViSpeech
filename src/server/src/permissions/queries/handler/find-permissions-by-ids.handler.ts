import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PermissionDto} from 'permissions/dtos/permissions.dto';
import {Repository} from 'typeorm';
import { FindPermisisonsByIdsQuery } from '../impl/find-permissions-by-ids.query';

@QueryHandler(FindPermisisonsByIdsQuery)
export class FindPermisisonsByIdsHandler implements IQueryHandler<FindPermisisonsByIdsQuery> {
    constructor(
        @InjectRepository(PermissionDto)
        private readonly repository: Repository<PermissionDto>
    ) {
    }

    async execute(query: FindPermisisonsByIdsQuery): Promise<any> {
        Logger.log('Async FindPermisisonsByIdsQuery...', 'FindPermisisonsByIdsQuery');
        const { assigneeId, assignerId, projectId } = query;
        try {
            if (!assigneeId && !assignerId && !projectId) return [];

            const findOptions = {}
            if (assigneeId) findOptions['assigneeId'] = assigneeId;
            if (assignerId) findOptions['assignerId'] = assignerId;
            if (projectId) findOptions['projectId'] = projectId;

            return await this.repository.find(findOptions);
        } catch (error) {
            Logger.error(error, '', 'FindPermisisonsByIdsQuery');
        }
    }
}