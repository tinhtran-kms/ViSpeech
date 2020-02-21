import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Query
} from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { UserIdRequestParamsDto } from "../dtos/users.dto";
import { UserDto } from "../dtos/users.dto";
import { UsersService } from "../services/users.service";
import { GetUsersQuery } from "users/queries/impl/get-users.query";
import { FindUserQuery } from "users/queries/impl/find-user.query";
import { Roles } from "security/roles.decorator";


@Controller("users")
@ApiTags("Users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /* Create User */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ["Create User"] })
  @ApiResponse({ status: 200, description: "Create User." })
  @Post()
  @Roles(['admin'])
  async createUser(@Body() userDto: UserDto): Promise<UserDto> {
    return await this.usersService.createUser(userDto);
  }

  /* Update User */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ["Update User"] })
  @ApiResponse({ status: 200, description: "Update User." })
  @Put(":id")
  async updateUser(
    @Param() userIdDto: UserIdRequestParamsDto,
    @Body() userDto: UserDto
  ) {
    return this.usersService.updateUser({ id: userIdDto.id, ...userDto });
  }

  /* Delete User */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ["Delete User"] })
  @ApiResponse({ status: 200, description: "Delete User." })
  @Delete(":id")
  async deleteUser(@Param() userIdDto: UserIdRequestParamsDto) {
    return this.usersService.deleteUser(userIdDto);
  }

  /* List Users */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ["List Users"] })
  @ApiResponse({ status: 200, description: "List Users." })
  @Get()
  async findUsers(@Query() getUsersQuery: GetUsersQuery) {
    return this.usersService.findUsers(getUsersQuery);
  }

  /* Find User */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ["Get User"] })
  @ApiResponse({ status: 200, description: "Get User." })
  @Get(":id")
  async findOneUser(@Param() findUserQuery: FindUserQuery) {
    return this.usersService.findOne(findUserQuery);
  }
}
