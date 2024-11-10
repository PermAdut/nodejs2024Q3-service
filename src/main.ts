import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { config } from 'dotenv';
import { resolve } from 'path';
config();
async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const path = resolve(__dirname, '..', 'doc', 'api.yaml');
  const apiYaml = yaml.load(await readFile(path, 'utf-8'));
  SwaggerModule.setup('doc', app, apiYaml);
  await app.listen(PORT);
}
bootstrap();
