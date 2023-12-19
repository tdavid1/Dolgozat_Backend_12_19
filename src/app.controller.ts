import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { ujcuponDto } from './ujcuponDto'

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'szinhaz',
}).promise();


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok] = await conn.execute('select id, title, percentage, code FROM szinhazak order by title');
    return { title: 'Szinhazak listaja', szinhazak: adatok };
  }
  @Get('/ujcupon')
  @Render('ujcupon')
  ujcupon() {
    return { errormassage: ' ' };
  }
  @Post('/ujcupon')
  async ujCupon(@Body() ujcupon: ujcuponDto) {
    let error = "";
      const title = ujcupon.title;
      const percentage = ujcupon.percentage;
      const code = ujcupon.code;
      let pattern2 = /[A-Z]/;
      let pattern3 = /[-]/;
      let pattern4 = /[1-9]/;
      let test2 =pattern2.test(code);
      let test3 =pattern3.test(code);
      let test4 =pattern4.test(code);
      if(title.length<1){
        error = 'Címnek legalább egy karakter hosszúnak kell lennie';
      }
      else if(percentage<1 || percentage>99){
        error ='A leárazáss százalékának 1 és 99 között kell lennie';
      }
      else if((!test2|| !test3 || !test4 )|| code.length==0){
        error = 'Számot Nagy betüt és egy - et tartalmaznia kell';
      }
      if(error ==""){
        const [ adatok ] = await conn.execute(
          'INSERT INTO szinhazak (title, percentage, code) VALUES (?, ?, ?)',
          [title, percentage, code],
        );
        return { errorn : test };
      }
      else{
        return { error };
      }
      
  }
}
