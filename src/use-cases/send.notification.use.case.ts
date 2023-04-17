import {Injectable} from "@nestjs/common";
import {CreateNotificationDto} from "../DTO/create.notification.dto";
import {ClientKafka} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";

@Injectable()
export class SendNotificationUseCase {
    constructor(private readonly clientService: ClientKafka) {
    }

    async execute(dto: CreateNotificationDto) {
        const pattern = `${dto.project}-${dto.deploy}-${dto.type}`
        return firstValueFrom(this.clientService.send(pattern, dto.value))
    }
}
