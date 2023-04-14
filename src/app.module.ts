import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SendNotificationUseCase} from "./use-cases/send.notification.use.case";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import fs from "fs";
import path from "path";

@Module({
    imports: [ConfigModule.forRoot(),],
    controllers: [AppController],
    providers: [AppService, SendNotificationUseCase, {
        provide: 'send-notification',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ClientProxyFactory.create({
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: configService.get('Kafka:clientId'),
                    brokers: configService.get('Kafka:brokers'),
                    ssl: {
                        rejectUnauthorized: false,
                        ca: [
                            fs.readFileSync(
                                path.resolve(
                                    `${__dirname}/../../../config/kafka/temp_certs/scram-cluster-ca.crt`
                                )
                            ),
                        ],
                        key: fs.readFileSync(
                            path.resolve(
                                `${__dirname}/keys/scram-cluster-ca.key`
                            ),
                            'utf-8'
                        ),
                        cert: fs.readFileSync(
                            path.resolve(
                                `${__dirname}/keys/scram-cluster-ca.p12.pem`
                            ),
                            'utf-8'
                        ),
                    },
                    sasl: configService.get('Kafka:sasl'),
                }
            }
        })
    },
    ],
})
export class AppModule {
}
