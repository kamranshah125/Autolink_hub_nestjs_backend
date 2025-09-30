import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequestsController } from './purchase-requests.controller';

describe('PurchaseRequestsController', () => {
  let controller: PurchaseRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseRequestsController],
    }).compile();

    controller = module.get<PurchaseRequestsController>(PurchaseRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
