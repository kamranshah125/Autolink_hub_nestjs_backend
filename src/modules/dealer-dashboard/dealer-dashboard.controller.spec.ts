import { Test, TestingModule } from '@nestjs/testing';
import { DealerDashboardController } from './dealer-dashboard.controller';

describe('DealerDashboardController', () => {
  let controller: DealerDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealerDashboardController],
    }).compile();

    controller = module.get<DealerDashboardController>(DealerDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
