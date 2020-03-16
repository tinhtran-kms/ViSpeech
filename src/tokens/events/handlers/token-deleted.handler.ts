import { Logger, NotFoundException } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenDto } from "tokens/dtos/tokens.dto";
import { TokenDeletedEvent } from "../impl/token-deleted.event";
import { Repository } from "typeorm";

@EventsHandler(TokenDeletedEvent)
export class TokenDeletedHandler implements IEventHandler<TokenDeletedEvent> {
  constructor(
    @InjectRepository(TokenDto)
    private readonly repository: Repository<TokenDto>
  ) { }

  async handle(event: TokenDeletedEvent) {
    Logger.log(event.tokenId, "TokenDeletedEvent");
    const { streamId, tokenId } = event;

    try {
      const token = await this.repository.findOne({ _id: tokenId });
      if (token) {
        await this.repository.delete({ _id: tokenId });
        return;
      }
      throw new NotFoundException(`Token with _id ${tokenId} does not exist.`);
    } catch (error) {
      Logger.error(error, "", "TokenDeletedEvent");
    }
  }
}
