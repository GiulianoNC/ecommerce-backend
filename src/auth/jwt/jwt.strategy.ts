import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable}from '@nestjs/common'
import { jwtConstants } from './jwt.constants';

//PARA PROTEGER RUTAS
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingnoreExpiration: false,
            secretOrKey:jwtConstants.secret,
        });
    }
    async validate(payload: any){
        return { userId:payload.id, username:payload.name, roles : payload.roles};
    }
}