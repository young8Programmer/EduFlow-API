import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.TEACHER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.TEACHER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
