import {Body, Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {CreateNotificationDto} from "./DTO/create.notification.dto";
import {SendNotificationUseCase} from "./use-cases/send.notification.use.case";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,
                private readonly sendNotificationUseCase: SendNotificationUseCase) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('send-notification')
    sendNotification(@Body() dto: CreateNotificationDto) {
        return this.sendNotificationUseCase.execute(dto)
    }

}
