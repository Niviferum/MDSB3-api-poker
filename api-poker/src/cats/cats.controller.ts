import { Bind, Body, Controller, Dependencies, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
@Dependencies(CatsService)
export class CatsController {
    catsService: CatsService;
    constructor(catsService:CatsService){
        console.log("Création du controlleur des chats")
        this.catsService = catsService
    }
    @Get(":name")
    @Bind(Param())
    @HttpCode(HttpStatus.NO_CONTENT)
    findOne(params : {name:string}){
        return  `${params.name.toUpperCase()} says Miaou`;
    }

    @Get()
    findAll() {
        return this.catsService.findAll()
    }

    @Post("")
    create(@Body('name') name:string){
        return this.catsService.create(name)
    }
    
}
