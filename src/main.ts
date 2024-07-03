import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // console.log(app);
  const listener = await app.listen(3000,()=>{
    console.log('Port is listening on 3000')
  });
  // console.log(`port is listening on ${listener._connectionKey}`);
}
bootstrap();
