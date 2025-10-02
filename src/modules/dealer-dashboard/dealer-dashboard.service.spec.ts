import { Test, TestingModule } from '@nestjs/testing';
import { DealerDashboardService } from './dealer-dashboard.service';

describe('DealerDashboardService', () => {
  let service: DealerDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DealerDashboardService],
    }).compile();

    service = module.get<DealerDashboardService>(DealerDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
