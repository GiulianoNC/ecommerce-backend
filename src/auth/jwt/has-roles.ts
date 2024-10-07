import { SetMetadata } from '@nestjs/common';
import { JwtRole } from './jwt-rol';

//para proteger las rutas
export const HasRoles =(...roles: JwtRole[]) => SetMetadata('roles', roles);