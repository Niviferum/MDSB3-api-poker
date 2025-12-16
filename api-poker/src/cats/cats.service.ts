import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
    cats: any;
    constructor(){
        console.log("Création du service des chats")
        this.cats = ['Oréo', 'Tic Tac']
    }
    findAll(){
        return this.cats;
    }
    create(name:string){
        this.cats.push(name)
    return 'Success';
    }
}
