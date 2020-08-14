import * as Assert from "assert";
import ActionService from "../../domain/service/action-service";
import { ActionServicePort } from "../../domain/port/primary/services";

describe('About action we should be able to...', () => {

    let actionService: ActionServicePort;

    beforeEach(() => {
        actionService = new ActionService();
    });

    it('attack another player', () => {
    });
});