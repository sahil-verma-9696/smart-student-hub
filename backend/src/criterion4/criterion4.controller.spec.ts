import { Test, TestingModule } from '@nestjs/testing';
import { Criterion4Controller } from './criterion4.controller';
import { Criterion4Service } from './criterion4.service';

describe('Criterion4Controller', () => {
  let controller: Criterion4Controller;
  let service: Criterion4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Criterion4Controller],
      providers: [
        {
          provide: Criterion4Service,
          useValue: {
            generateReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<Criterion4Controller>(Criterion4Controller);
    service = module.get<Criterion4Service>(Criterion4Service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('module', 'criterion4');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
