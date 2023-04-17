import {Inject, Injectable} from "@nestjs/common";
import {CreateNotificationDto} from "../DTO/create.notification.dto";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";

@Injectable()
export class SendNotificationUseCase {
    constructor(@Inject('KAFKA_CLIENT') private readonly clientService: ClientProxy) {
    }

    async execute(dto: CreateNotificationDto) {
        const pattern = `${dto.project}-${dto.deploy}-${dto.type}`
        return firstValueFrom(this.clientService.send(pattern, dto.value))
    }
}
