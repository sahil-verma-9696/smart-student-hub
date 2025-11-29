import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidYearForCourse(options?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidYearForCourse',
      target: target.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj: any = args.object;
          const course = obj.course?.toLowerCase();

          // Course → Allowed years
          const rules = {
            btech: [1, 2, 3, 4],
            mtech: [1, 2],
            diploma: [1, 2, 3],
            bca: [1, 2, 3],
            bba: [1, 2, 3],
            phd: [1, 2, 3, 4, 5],
          };

          if (!rules[course]) return false;

          return rules[course].includes(Number(value));
        },
        defaultMessage(args: ValidationArguments) {
          const obj: any = args.object;
          return `Invalid year '${args.value}' for course '${obj.course}'`;
        },
      },
    });
  };
}
