import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SendNotificationUseCase} from "./use-cases/send.notification.use.case";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {readFileSync} from "fs";
import {resolve} from "path";

@Module({
    imports: [ConfigModule.forRoot(),],
    controllers: [AppController],
    providers: [AppService, SendNotificationUseCase, {
        provide: 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ClientProxyFactory.create({
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: configService.get('KAFKA_CLIENT_ID'),
                    brokers: configService.get('KAFKA_BROKERS'),
                    ssl: {
                        rejectUnauthorized: false,
                        ca: [
                            readFileSync(
                                resolve(
                                    `${__dirname}/../keys/kafka/temp_certs/scram-cluster-ca.crt`
                                )
                            ),
                        ],
                        key: readFileSync(
                            resolve(
                                `${__dirname}/../keys/kafka/temp_certs/scram-cluster-ca.key`
                            ),
                            'utf-8'
                        ),
                        cert: readFileSync(
                            resolve(
                                `${__dirname}/../keys/kafka/temp_certs/scram-cluster-ca.p12.pem`
                            ),
                            'utf-8'
                        ),
                    },
                    sasl: {
                        mechanism: configService.get('KAFKA_SASL_mechanism'),
                        username: configService.get('KAFKA_SASL_username'),
                        password: configService.get('KAFKA_SASL_password')
                    },
                }
            }
        })
    },
    ],
})
export class AppModule {
}
